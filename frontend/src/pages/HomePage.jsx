import { Link } from 'react-router-dom';
import LandingSection from '../components/LandingSection.jsx';
import AmenitiesSection from '../components/AmenitiesSection.jsx';

function HomePage() {
  return (
    <>
      <LandingSection />

      <main className="stack-grid">
        <AmenitiesSection />

        <section className="panel">
          <div className="panel-header">
            <p className="eyebrow">How It Works</p>
            <h2>Wanna book? Easy.</h2>
          </div>
          <div className="feature-grid">
            <article className="info-card">
              <span className="tag">Step 1</span>
              <h3>
                <Link to="/rooms" className="feature-link">Browse rooms</Link>
              </h3>
              <p>View accommodations and compare capacity, rates, and descriptions.</p>
            </article>
            <article className="info-card">
              <span className="tag">Step 2</span>
              <h3>
                <Link to="/reserve" className="feature-link">Reserve online</Link>
              </h3>
              <p>Choose dates, check availability, and submit a reservation request.</p>
            </article>
            <article className="info-card">
              <span className="tag">Step 3</span>
              <h3>
                <Link to="/track" className="feature-link">Track booking</Link>
              </h3>
              <p>Use the reservation code to check booking status on the website.</p>
            </article>
          </div>
        </section>
      </main>
    </>
  );
}

export default HomePage;
