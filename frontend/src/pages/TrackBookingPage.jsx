import { useState } from 'react';
import { Link } from 'react-router-dom';
import ReservationLookup from '../components/ReservationLookup.jsx';
import { apiGet } from '../services/api.js';
import { formatPeso } from '../utils/format.js';

function TrackBookingPage() {
  const [lookupCode, setLookupCode] = useState('');
  const [lookupResult, setLookupResult] = useState(null);

  async function handleLookup(event) {
    event.preventDefault();

    if (!lookupCode.trim()) {
      setLookupResult({ error: 'Enter a reservation code first.' });
      return;
    }

    try {
      const details = await apiGet(`/reservations/code/${encodeURIComponent(lookupCode.trim())}`);
      setLookupResult(details);
    } catch (error) {
      setLookupResult({ error: error.message });
    }
  }

  return (
    <main className="main-grid">
      <section className="panel">
        <div className="panel-header">
          <p className="eyebrow">Track Booking</p>
          <h1 className="page-title">Reservation Status</h1>
          <p>Guests can check a booking using the reservation code generated during reservation.</p>
        </div>

        <ReservationLookup
          lookupCode={lookupCode}
          lookupResult={lookupResult}
          onLookupCodeChange={(event) => setLookupCode(event.target.value)}
          onSubmit={handleLookup}
          formatPeso={formatPeso}
        />
      </section>

      <aside className="sidebar">
        <section className="panel">
          <div className="panel-header">
            <p className="eyebrow">Next Step</p>
            <h2>Submit payment</h2>
            <p>Already have your reservation code? Submit your payment details for verification.</p>
          </div>
          <div className="action-row">
            <Link to="/payment" className="btn btn-primary">Go to Payment Page</Link>
          </div>
        </section>
      </aside>
    </main>
  );
}

export default TrackBookingPage;
