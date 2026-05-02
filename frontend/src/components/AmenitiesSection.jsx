import { useEffect, useState } from 'react';
import AmenitiesCard from './AmenitiesCard.jsx';
import { apiGet } from '../services/api.js';

const fallbackAmenitiesContent = {
  eyebrow: 'Amenities',
  title: 'What do we have to offer? A lot. Kinda...',
  subtitle: ''
};

function AmenitiesSection() {
  const [amenitiesContent, setAmenitiesContent] = useState(fallbackAmenitiesContent);
  const [cards, setCards] = useState([]);
  const [loadingCards, setLoadingCards] = useState(true);
  const [cardsError, setCardsError] = useState(null);

  useEffect(() => {
    async function loadAmenitiesContent() {
      try {
        const data = await apiGet('/amenities-content');
        setAmenitiesContent({
          ...fallbackAmenitiesContent,
          ...data
        });
      } catch (error) {
        setAmenitiesContent(fallbackAmenitiesContent);
      }
    }

    loadAmenitiesContent();
  }, []);

  useEffect(() => {
    async function loadCards() {
      try {
        setCardsError(null);
        const data = await apiGet('/amenities-cards');
        setCards(Array.isArray(data) ? data : []);
      } catch (error) {
        setCards([]);
        setCardsError(error.message || 'Failed to load amenities cards');
      } finally {
        setLoadingCards(false);
      }
    }

    loadCards();
  }, []);

  return (
    <section className="panel">
      <div className="panel-header">
        <p className="eyebrow">{amenitiesContent.eyebrow}</p>
        <h2>{amenitiesContent.title}</h2>
        {amenitiesContent.subtitle ? (
          <p>{amenitiesContent.subtitle}</p>
        ) : null}
      </div>

      <div className="feature-grid">
        {loadingCards ? (
          <div className="empty-state">Loading amenities...</div>
        ) : cardsError ? (
          <div className="empty-state">{cardsError}</div>
        ) : cards.length ? (
          cards.map((card) => <AmenitiesCard key={card.id} card={card} />)
        ) : (
          <div className="empty-state">No amenities have been configured yet.</div>
        )}
      </div>
    </section>
  );
}

export default AmenitiesSection;
