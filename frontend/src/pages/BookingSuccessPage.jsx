import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import MessageBox from '../components/MessageBox.jsx';
import { apiGet } from '../services/api.js';
import { formatPeso } from '../utils/format.js';

function BookingSuccessPage() {
  const { code } = useParams();
  const [reservation, setReservation] = useState(null);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    async function load() {
      try {
        const details = await apiGet(`/reservations/code/${encodeURIComponent(code)}`);
        setReservation(details);
      } catch (error) {
        setMessage({ type: 'error', text: error.message });
      }
    }

    load().catch(() => {});
  }, [code]);

  return (
    <main className="main-grid">
      <section className="panel">
        <div className="panel-header">
          <p className="eyebrow">Booking Complete</p>
          <h1 className="page-title">Reservation Confirmed</h1>
          <p>Your booking has been finalized and a reference is now available.</p>
        </div>

        <MessageBox message={message} />

        {reservation ? (
          <div className="summary-card">
            <div><strong>Reservation code:</strong> {reservation.reservation_code}</div>
            <div><strong>Confirmation reference:</strong> {reservation.confirmation_code || 'Will be generated after full payment'}</div>
            <div><strong>Guest:</strong> {reservation.guest_name}</div>
            <div><strong>Stay:</strong> {String(reservation.check_in_date).slice(0, 10)} to {String(reservation.check_out_date).slice(0, 10)}</div>
            <div><strong>Status:</strong> {reservation.reservation_status}</div>
            <div><strong>Payment:</strong> {reservation.payment_status}</div>
            <div><strong>Total:</strong> {formatPeso(reservation.total_amount)}</div>
            <div><strong>Paid:</strong> {formatPeso(reservation.amount_paid)}</div>
            <div><strong>Balance:</strong> {formatPeso(reservation.balance_due)}</div>
          </div>
        ) : null}

        <div className="action-row">
          <Link to="/my-bookings" className="btn btn-primary">Manage My Bookings</Link>
          <Link to="/rooms" className="btn btn-secondary">Browse More Rooms</Link>
        </div>
      </section>
    </main>
  );
}

export default BookingSuccessPage;
