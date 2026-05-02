import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import HomepageCarouselPlaceholder from './HomepageCarouselPlaceholder.jsx';
import { apiGet } from '../services/api.js';

const fallbackLandingContent = {
  eyebrow: 'BrewSpot Cafe & Villa',
  title: 'Book a stay in our place for vacay.',
  subtitle: 'Maybe grab a coffee in our BrewSpot Cafe too.',
  primary_button_label: 'Start Booking',
  primary_button_link: '/reserve',
  secondary_button_label: 'Browse Rooms',
  secondary_button_link: '/rooms'
};

function LandingSection() {
  const [content, setContent] = useState(fallbackLandingContent);

  useEffect(() => {
    async function loadLandingContent() {
      try {
        const data = await apiGet('/landing-content');
        setContent({
          ...fallbackLandingContent,
          ...data
        });
      } catch (error) {
        setContent(fallbackLandingContent);
      }
    }

    loadLandingContent();
  }, []);

  return (
    <header className="landing-section">
      <div className="landing-copy">
        <p className="eyebrow">{content.eyebrow}</p>
        <h1>{content.title}</h1>
        <p className="landing-text">
          {content.subtitle}
        </p>
        <div className="landing-actions">
          <Link to={content.primary_button_link} className="btn btn-primary">{content.primary_button_label}</Link>
          {content.secondary_button_label && content.secondary_button_link ? (
            <Link to={content.secondary_button_link} className="btn btn-secondary">{content.secondary_button_label}</Link>
          ) : null}
        </div>
      </div>

      <HomepageCarouselPlaceholder />
    </header>
  );
}

export default LandingSection;
