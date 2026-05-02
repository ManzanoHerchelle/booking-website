import AmenitiesCardImageCarousel from './AmenitiesCardImageCarousel.jsx';

function AmenitiesCard({ card }) {
  return (
    <article className="info-card amenities-card">
      <h3>{card.title}</h3>
      <AmenitiesCardImageCarousel images={card.images} />
      <p>{card.description}</p>
    </article>
  );
}

export default AmenitiesCard;

