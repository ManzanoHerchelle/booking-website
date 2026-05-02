import { useState } from 'react';
import { Link } from 'react-router-dom';
import MessageBox from '../components/MessageBox.jsx';
import { apiGet, apiPost } from '../services/api.js';
import { formatPeso } from '../utils/format.js';

function MyBookingsPage() {
  const [email, setEmail] = useState('');
  const [bookings, setBookings] = useState([]);
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [cancellingCode, setCancellingCode] = useState('');
  const [cancelReasonByCode, setCancelReasonByCode] = useState({});

  async function loadBookings(event) {
    event.preventDefault();

    const trimmed = email.trim();
    if (!trimmed) {
      setMessage({ type: 'error', text: 'Enter your email first.' });
      return;
    }

    setMessage(null);
    setLoading(true);

    try {
      const rows = await apiGet(`/my-bookings?email=${encodeURIComponent(trimmed)}`);
      setBookings(Array.isArray(rows) ? rows : []);
      setMessage({ type: 'success', text: 'Bookings loaded successfully.' });
    } catch (error) {
      setBookings([]);
      setMessage({ type: 'error', text: error.message });
    } finally {
      setLoading(false);
    }
  }

  async function cancelBooking(reservationCode) {
    const reason = String(cancelReasonByCode[reservationCode] || '').trim();

    if (!reason) {
      setMessage({ type: 'error', text: `Add a cancellation reason for ${reservationCode}.` });
      return;
    }

    try {
      setCancellingCode(reservationCode);
      setMessage(null);
      await apiPost('/my-bookings/cancel', {
        reservation_code: reservationCode,
        email: email.trim(),
        reason
      });

      const updated = await apiGet(`/my-bookings?email=${encodeURIComponent(email.trim())}`);
      setBookings(Array.isArray(updated) ? updated : []);
      setMessage({ type: 'success', text: `Booking ${reservationCode} was cancelled.` });
    } catch (error) {
      setMessage({ type: 'error', text: error.message });
    } finally {
      setCancellingCode('');
    }
  }

  return (
    <main className="main-grid">
      <section className="panel">
        <div className="panel-header">
          <p className="eyebrow">My Bookings</p>
          <h1 className="page-title">Manage Your Reservations</h1>
          <p>Use your booking email to view reservations, request cancellation, and download receipts.</p>
        </div>

        <form className="booking-form" onSubmit={loadBookings}>
          <label>
            <span>Email used during booking</span>
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="you@example.com"
              required
            />
          </label>

          <div className="action-row">
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Loading...' : 'Load My Bookings'}
            </button>
          </div>
        </form>

        <MessageBox message={message} />

        <div className={bookings.length ? 'room-list' : 'room-list empty-state'}>
          {bookings.length ? bookings.map((booking) => {
            const reservationCode = booking.reservation_code;
            const isCancelled = booking.reservation_status === 'cancelled';

            return (
              <article className="room-card" key={reservationCode}>
                <header>
                  <div>
                    <h3>{reservationCode}</h3>
                    <p className="room-meta">
                      {String(booking.check_in_date).slice(0, 10)} to {String(booking.check_out_date).slice(0, 10)}
                    </p>
                  </div>
                  <span className="tag">{booking.reservation_status}</span>
                </header>

                <p className="room-meta">
                  Payment: {booking.payment_status} | Total: {formatPeso(booking.total_amount)} | Balance: {formatPeso(booking.balance_due)}
                </p>

                {booking.confirmation_code ? (
                  <p className="room-meta">Confirmation reference: {booking.confirmation_code}</p>
                ) : null}

                <div className="field-grid">
                  <label>
                    <span>Cancellation reason</span>
                    <input
                      value={cancelReasonByCode[reservationCode] || ''}
                      onChange={(event) => {
                        const value = event.target.value;
                        setCancelReasonByCode((current) => ({
                          ...current,
                          [reservationCode]: value
                        }));
                      }}
                      placeholder="Reason for cancellation"
                      disabled={isCancelled}
                    />
                  </label>
                </div>

                <div className="action-row">
                  <Link
                    className="btn btn-secondary"
                    to={`/my-bookings/${encodeURIComponent(reservationCode)}/receipt?email=${encodeURIComponent(email.trim())}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Open Receipt
                  </Link>
                  <button
                    type="button"
                    className="btn btn-accent"
                    disabled={isCancelled || cancellingCode === reservationCode}
                    onClick={() => cancelBooking(reservationCode)}
                  >
                    {cancellingCode === reservationCode ? 'Cancelling...' : 'Cancel Booking'}
                  </button>
                </div>
              </article>
            );
          }) : 'No bookings loaded yet.'}
        </div>
      </section>

      <aside className="sidebar">
        <section className="panel">
          <div className="panel-header">
            <p className="eyebrow">Policy</p>
            <h2>Self-service rules</h2>
          </div>
          <div className="summary-card">
            <div><strong>1.</strong> Enter the same email used during reservation.</div>
            <div><strong>2.</strong> Cancellation is policy-based and may be blocked near check-in.</div>
            <div><strong>3.</strong> Receipt includes room lines and payment history.</div>
          </div>
        </section>
      </aside>
    </main>
  );
}

export default MyBookingsPage;
