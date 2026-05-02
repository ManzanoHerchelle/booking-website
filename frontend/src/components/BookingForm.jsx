function BookingForm({
  form,
  todayMinDate,
  loadingAvailability,
  submittingReservation,
  canSubmitReservation,
  onFieldChange,
  onAvailabilityCheck,
  onSubmit
}) {
  return (
    <form className="booking-form" onSubmit={onSubmit}>
      <div className="field-grid">
        <label>
          <span>First name</span>
          <input name="first_name" value={form.first_name} onChange={onFieldChange} required />
        </label>
        <label>
          <span>Last name</span>
          <input name="last_name" value={form.last_name} onChange={onFieldChange} required />
        </label>
        <label>
          <span>Email</span>
          <input type="email" name="email" value={form.email} onChange={onFieldChange} required />
        </label>
        <label>
          <span>Phone</span>
          <input name="phone" value={form.phone} onChange={onFieldChange} />
        </label>
        <label>
          <span>Check-in date</span>
          <input
            type="date"
            name="check_in_date"
            min={todayMinDate}
            value={form.check_in_date}
            onChange={onFieldChange}
            required
          />
        </label>
        <label>
          <span>Check-out date</span>
          <input
            type="date"
            name="check_out_date"
            min={form.check_in_date || todayMinDate}
            value={form.check_out_date}
            onChange={onFieldChange}
            required
          />
        </label>
        <label>
          <span>Adults</span>
          <input type="number" min="1" name="adult_count" value={form.adult_count} onChange={onFieldChange} required />
        </label>
        <label>
          <span>Children</span>
          <input type="number" min="0" name="child_count" value={form.child_count} onChange={onFieldChange} />
        </label>
      </div>

      <label className="full-width">
        <span>Special requests</span>
        <textarea
          name="special_requests"
          rows="3"
          value={form.special_requests}
          onChange={onFieldChange}
          placeholder="Late arrival, preferred room area, accessibility needs..."
        />
      </label>

      <div className="action-row">
        <button type="button" className="btn btn-primary" onClick={onAvailabilityCheck} disabled={loadingAvailability}>
          {loadingAvailability ? 'Checking...' : 'Check Availability'}
        </button>
        <button type="submit" className="btn btn-accent" disabled={!canSubmitReservation}>
          {submittingReservation ? 'Submitting...' : 'Submit Reservation'}
        </button>
      </div>
    </form>
  );
}

export default BookingForm;
