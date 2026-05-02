function ReservationConfirmation({ reservation, formatPeso }) {
  if (!reservation) {
    return null;
  }

  return (
    <section className="confirmation-panel">
      <h3>Reservation Submitted</h3>
      <p>Your booking code is <strong>{reservation.reservation_code}</strong>.</p>
      <div className="summary-card">
        <div><strong>Guest:</strong> {reservation.guest_name}</div>
        <div><strong>Stay:</strong> {reservation.check_in_date.slice(0, 10)} to {reservation.check_out_date.slice(0, 10)}</div>
        <div><strong>Status:</strong> {reservation.reservation_status}</div>
        <div><strong>Payment:</strong> {reservation.payment_status}</div>
        <div><strong>Total:</strong> {formatPeso(reservation.total_amount)}</div>
        <div><strong>Balance:</strong> {formatPeso(reservation.balance_due)}</div>
      </div>
    </section>
  );
}

export default ReservationConfirmation;
