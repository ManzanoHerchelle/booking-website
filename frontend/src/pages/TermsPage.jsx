function TermsPage() {
  return (
    <main className="stack-grid">
      <section className="panel">
        <div className="panel-header">
          <p className="eyebrow">Terms</p>
          <h1 className="page-title">Booking Policies</h1>
          {/* <p>Static policy content works for the current version and can later be loaded from the database.</p> */}
        </div>

        <div className="terms-grid">
          <article className="info-card">
            <h3>Booking rules</h3>
            <p>Reservations are subject to room availability and booking policy validation.</p>
          </article>
          <article className="info-card">
            <h3>Cancellation policy</h3>
            <p>Cancellation and refund eligibility depend on the resort policy and booking date.</p>
          </article>
          <article className="info-card">
            <h3>Payment verification</h3>
            <p>Submitted payments may need manual verification before a booking is fully confirmed.</p>
          </article>
        </div>
      </section>
    </main>
  );
}

export default TermsPage;
