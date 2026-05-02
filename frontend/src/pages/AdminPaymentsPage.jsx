import { useEffect, useMemo, useState } from 'react';
import MessageBox from '../components/MessageBox.jsx';
import { apiGet, apiPost, apiUploadFile } from '../services/api.js';
import { getAdminToken } from '../utils/adminSession.js';
import { formatPeso } from '../utils/format.js';

const initialPaymentForm = {
  payment_method: 'e_wallet',
  payment_channel: '',
  amount: '',
  payment_status: 'paid',
  reference_number: '',
  proof_image_url: '',
  notes: ''
};

function formatDateTime(value) {
  if (!value) {
    return '';
  }

  try {
    return new Date(value).toLocaleString();
  } catch (error) {
    return String(value);
  }
}

function AdminPaymentsPage() {
  const token = getAdminToken();
  const [lookupCode, setLookupCode] = useState('');
  const [reservation, setReservation] = useState(null);
  const [payments, setPayments] = useState([]);
  const [paymentForm, setPaymentForm] = useState(initialPaymentForm);
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploadingProof, setUploadingProof] = useState(false);
  const [refundingPaymentId, setRefundingPaymentId] = useState(null);

  const reservationId = reservation?.id || null;

  const computedSummary = useMemo(() => {
    if (!reservation) {
      return null;
    }

    const total = Number(reservation.total_amount || 0);
    const paid = Number(reservation.amount_paid || 0);
    const balance = Number(reservation.balance_due || Math.max(total - paid, 0));

    return { total, paid, balance };
  }, [reservation]);

  async function loadReservationByCode(code) {
    const trimmed = String(code || '').trim();
    if (!trimmed) {
      setMessage({ type: 'error', text: 'Enter a reservation code first.' });
      return;
    }

    setMessage(null);
    setLoading(true);

    try {
      const details = await apiGet(`/admin/reservations/code/${encodeURIComponent(trimmed)}`, { token });
      setReservation(details);

      const paymentRows = await apiGet(`/admin/payments?reservation_id=${encodeURIComponent(details.id)}`, { token });
      setPayments(Array.isArray(paymentRows) ? paymentRows : []);
      setPaymentForm(initialPaymentForm);
    } catch (error) {
      setReservation(null);
      setPayments([]);
      setMessage({ type: 'error', text: error.message });
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (!reservationId) {
      return;
    }

    async function refreshPayments() {
      try {
        const paymentRows = await apiGet(`/admin/payments?reservation_id=${encodeURIComponent(reservationId)}`, { token });
        setPayments(Array.isArray(paymentRows) ? paymentRows : []);
      } catch (error) {
        setPayments([]);
      }
    }

    refreshPayments().catch(() => {});
  }, [reservationId, token]);

  function updatePaymentField(event) {
    const { name, value } = event.target;
    setPaymentForm((current) => ({
      ...current,
      [name]: value
    }));
  }

  async function handleProofUpload(event) {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    try {
      setUploadingProof(true);
      const uploaded = await apiUploadFile(file, { token });
      setPaymentForm((current) => ({
        ...current,
        proof_image_url: uploaded.file_url || uploaded.file_path || ''
      }));
      setMessage({ type: 'success', text: 'Proof file uploaded successfully.' });
    } catch (error) {
      setMessage({ type: 'error', text: error.message });
    } finally {
      setUploadingProof(false);
      event.target.value = '';
    }
  }

  async function handleSubmitPayment(event) {
    event.preventDefault();
    if (!reservationId) {
      setMessage({ type: 'error', text: 'Look up a reservation before recording a payment.' });
      return;
    }

    setMessage(null);

    const payload = {
      reservation_id: reservationId,
      payment_method: paymentForm.payment_method,
      payment_channel: paymentForm.payment_channel || null,
      amount: Number(paymentForm.amount),
      payment_status: paymentForm.payment_status,
      reference_number: paymentForm.reference_number || null,
      proof_image_url: paymentForm.proof_image_url || null,
      notes: paymentForm.notes || null
    };

    if (!payload.amount || Number.isNaN(payload.amount) || payload.amount <= 0) {
      setMessage({ type: 'error', text: 'Amount must be a positive number.' });
      return;
    }

    try {
      setSaving(true);
      await apiPost('/admin/payments', payload, { token });

      const details = await apiGet(`/admin/reservations/${encodeURIComponent(reservationId)}`, { token });
      setReservation(details);

      const paymentRows = await apiGet(`/admin/payments?reservation_id=${encodeURIComponent(reservationId)}`, { token });
      setPayments(Array.isArray(paymentRows) ? paymentRows : []);
      setPaymentForm(initialPaymentForm);
      setMessage({ type: 'success', text: 'Payment recorded successfully.' });
    } catch (error) {
      setMessage({ type: 'error', text: error.message });
    } finally {
      setSaving(false);
    }
  }

  async function handleRefund(payment) {
    try {
      setRefundingPaymentId(payment.id);
      setMessage(null);

      await apiPost(
        `/admin/payments/${payment.id}/refund`,
        { amount: Number(payment.amount), notes: `Refund initiated for payment ${payment.id}` },
        { token }
      );

      if (reservationId) {
        const details = await apiGet(`/admin/reservations/${encodeURIComponent(reservationId)}`, { token });
        setReservation(details);

        const paymentRows = await apiGet(`/admin/payments?reservation_id=${encodeURIComponent(reservationId)}`, { token });
        setPayments(Array.isArray(paymentRows) ? paymentRows : []);
      }

      setMessage({ type: 'success', text: 'Refund recorded successfully.' });
    } catch (error) {
      setMessage({ type: 'error', text: error.message });
    } finally {
      setRefundingPaymentId(null);
    }
  }

  return (
    <main className="main-grid">
      <section className="panel">
        <div className="panel-header">
          <p className="eyebrow">Payment Management</p>
          <h1 className="page-title">Payments</h1>
          <p>Look up a reservation code, review balances, and record payments.</p>
        </div>

        <form
          className="booking-form"
          onSubmit={(event) => {
            event.preventDefault();
            loadReservationByCode(lookupCode).catch(() => {});
          }}
        >
          <label>
            <span>Reservation code</span>
            <input
              value={lookupCode}
              onChange={(event) => setLookupCode(event.target.value)}
              placeholder="RES-123456789"
            />
          </label>

          <div className="action-row">
            <button type="submit" className="btn btn-secondary" disabled={loading}>
              {loading ? 'Searching...' : 'Find Reservation'}
            </button>
          </div>
        </form>

        <MessageBox message={message} />

        {reservation ? (
          <div className="summary-card">
            <div><strong>Guest:</strong> {reservation.guest_name} ({reservation.guest_email})</div>
            <div><strong>Dates:</strong> {String(reservation.check_in_date).slice(0, 10)} to {String(reservation.check_out_date).slice(0, 10)}</div>
            <div><strong>Status:</strong> {reservation.reservation_status}</div>
            <div><strong>Payment:</strong> {reservation.payment_status}</div>
            <div><strong>Total:</strong> {formatPeso(computedSummary.total)}</div>
            <div><strong>Paid:</strong> {formatPeso(computedSummary.paid)}</div>
            <div><strong>Balance:</strong> {formatPeso(computedSummary.balance)}</div>
          </div>
        ) : null}

        {reservation ? (
          <>
            <div className="panel-header">
              <h2>Record a payment</h2>
            </div>

            <form className="booking-form" onSubmit={handleSubmitPayment}>
              <div className="field-grid">
                <label>
                  <span>Method</span>
                  <select name="payment_method" value={paymentForm.payment_method} onChange={updatePaymentField}>
                    <option value="e_wallet">E-wallet</option>
                    <option value="bank_transfer">Bank transfer</option>
                    <option value="cash">Cash</option>
                  </select>
                </label>
                <label>
                  <span>Status</span>
                  <select name="payment_status" value={paymentForm.payment_status} onChange={updatePaymentField}>
                    <option value="paid">Paid</option>
                    <option value="pending">Pending</option>
                    <option value="failed">Failed</option>
                    <option value="refunded">Refunded</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </label>
              </div>

              <div className="field-grid">
                <label>
                  <span>Channel (optional)</span>
                  <input name="payment_channel" value={paymentForm.payment_channel} onChange={updatePaymentField} placeholder="GCash, BPI, frontdesk, etc." />
                </label>
                <label>
                  <span>Amount</span>
                  <input name="amount" value={paymentForm.amount} onChange={updatePaymentField} type="number" min="0" step="0.01" required />
                </label>
              </div>

              <div className="field-grid">
                <label>
                  <span>Reference number (optional)</span>
                  <input name="reference_number" value={paymentForm.reference_number} onChange={updatePaymentField} />
                </label>
                <label>
                  <span>Proof image URL (optional)</span>
                  <input name="proof_image_url" value={paymentForm.proof_image_url} onChange={updatePaymentField} placeholder="https://..." />
                </label>
              </div>

              <label className="full-width">
                <span>Upload proof file (image or PDF)</span>
                <input type="file" accept="image/*,application/pdf" onChange={handleProofUpload} disabled={uploadingProof || saving} />
              </label>

              {uploadingProof ? <div className="room-meta">Uploading proof file...</div> : null}

              <label className="full-width">
                <span>Notes (optional)</span>
                <textarea name="notes" rows="3" value={paymentForm.notes} onChange={updatePaymentField} />
              </label>

              <div className="action-row">
                <button type="submit" className="btn btn-primary" disabled={saving}>
                  {saving ? 'Saving...' : 'Record Payment'}
                </button>
              </div>
            </form>
          </>
        ) : null}
      </section>

      <aside className="sidebar">
        <section className="panel">
          <div className="panel-header">
            <p className="eyebrow">Payment History</p>
            <h2>{reservation ? 'Payments for this reservation' : 'No reservation loaded'}</h2>
          </div>

          <div className={payments.length ? 'room-list' : 'room-list empty-state'}>
            {reservation ? (
              payments.length ? payments.map((payment) => (
                <article className="room-card" key={payment.id}>
                  <header>
                    <div>
                      <h3>{formatPeso(payment.amount)}</h3>
                      <p className="room-meta">{payment.payment_method} · {payment.payment_status}</p>
                    </div>
                    <span className="tag">{payment.payment_channel || 'Unspecified'}</span>
                  </header>
                  <p className="room-meta">Paid at: {formatDateTime(payment.paid_at || payment.created_at)}</p>
                  {payment.reference_number ? (
                    <p className="room-meta">Reference: {payment.reference_number}</p>
                  ) : null}
                  {payment.recorded_by_name ? (
                    <p className="room-meta">Recorded by: {payment.recorded_by_name}</p>
                  ) : null}
                  {payment.notes ? (
                    <p className="room-meta">{payment.notes}</p>
                  ) : null}
                  {['paid', 'partial'].includes(payment.payment_status) ? (
                    <div className="action-row">
                      <button
                        type="button"
                        className="btn btn-accent"
                        disabled={refundingPaymentId === payment.id}
                        onClick={() => handleRefund(payment)}
                      >
                        {refundingPaymentId === payment.id ? 'Refunding...' : 'Refund'}
                      </button>
                    </div>
                  ) : null}
                </article>
              )) : 'No payments recorded yet.'
            ) : (
              'Look up a reservation code to view payments.'
            )}
          </div>
        </section>
      </aside>
    </main>
  );
}

export default AdminPaymentsPage;

