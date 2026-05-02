function ReservationLookup({
  lookupCode,
  lookupResult,
  onLookupCodeChange,
  onSubmit,
  formatPeso
}) {
  return (
    <section className="panel">
      <div className="panel-header">
        <p className="eyebrow">Status Lookup</p>
        <h2>Reservation Check</h2>
        {/* <p>Fetch booking details using the reservation code endpoint.</p> */}
      </div>

      <form className="lookup-form" onSubmit={onSubmit}>
        <label>
          <span>Reservation code</span>
          <input
            value={lookupCode}
            onChange={onLookupCodeChange}
            placeholder="RES-123456789"
          />
        </label>
        <button type="submit" className="btn btn-secondary">Check Status</button>
      </form>

      <div className="lookup-result">
        {lookupResult?.error ? (
          lookupResult.error
        ) : lookupResult ? (
          <>
            <div><strong>Guest:</strong> {lookupResult.guest_name}</div>
            <div><strong>Confirmation:</strong> {lookupResult.confirmation_code || 'Pending full payment'}</div>
            <div><strong>Status:</strong> {lookupResult.reservation_status}</div>
            <div><strong>Payment:</strong> {lookupResult.payment_status}</div>
            <div><strong>Balance due:</strong> {formatPeso(lookupResult.balance_due)}</div>
          </>
        ) : (
          'No lookup yet.'
        )}
      </div>
    </section>
  );
}

export default ReservationLookup;
