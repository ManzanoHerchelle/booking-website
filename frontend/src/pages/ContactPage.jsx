function ContactPage() {
  return (
    <main className="main-grid">
      <section className="panel">
        <div className="panel-header">
          <p className="eyebrow">Contact</p>
          <h1 className="page-title">Inquiry Form</h1>
          <p>Curious about us? Hit us up with your inquiries. We're friendly enough to answer them :)</p>
        </div>

        <form className="booking-form">
          <div className="field-grid">
            <label>
              <span>Name</span>
              <input placeholder="Juan Dela Cruz" />
            </label>
            <label>
              <span>Email</span>
              <input type="email" placeholder="juan@example.com" />
            </label>
            <label>
              <span>Phone</span>
              <input placeholder="09123456789" />
            </label>
            <label>
              <span>Subject</span>
              <input placeholder="Booking inquiry" />
            </label>
          </div>
          <label className="full-width">
            <span>Message</span>
            <textarea rows="5" placeholder="How can we help you?" />
          </label>
          <div className="action-row">
            <button type="button" className="btn btn-primary" disabled>Submit Inquiry</button>
          </div>
        </form>
      </section>

      <aside className="sidebar">
        <section className="panel">
          <div className="panel-header">
            <p className="eyebrow">Support</p>
            <h2>Quick help</h2>
          </div>
          <div className="summary-card">
            <div>Use the reservation page to create a booking.</div>
            <div>Use track booking to check reservation status.</div>
            <div>Keep the reservation code after submitting a booking.</div>
          </div>
        </section>
      </aside>
    </main>
  );
}

export default ContactPage;
