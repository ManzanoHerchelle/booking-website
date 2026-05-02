import { useEffect, useMemo, useState } from 'react';

function normalizeImages(images) {
  if (!Array.isArray(images)) {
    return [];
  }

  return images
    .filter((image) => image && image.image_url)
    .map((image) => ({
      id: image.id ?? image.image_url,
      image_url: image.image_url,
      alt_text: image.alt_text || ''
    }));
}

function AmenitiesCardImageCarousel({ images }) {
  const normalizedImages = useMemo(() => normalizeImages(images), [images]);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    setActiveIndex(0);
  }, [normalizedImages.length]);

  useEffect(() => {
    if (normalizedImages.length < 2) {
      return undefined;
    }

    const id = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % normalizedImages.length);
    }, 4500);

    return () => window.clearInterval(id);
  }, [normalizedImages.length]);

  if (!normalizedImages.length) {
    return (
      <div className="amenities-card-carousel placeholder" aria-hidden="true">
        <div className="amenities-card-carousel-placeholder">Photo coming soon.</div>
      </div>
    );
  }

  return (
    <div className="amenities-card-carousel" aria-label="Amenities photos">
      {normalizedImages.map((image, index) => (
        <img
          key={image.id}
          className={`amenities-card-carousel-image${index === activeIndex ? ' is-active' : ''}`}
          src={image.image_url}
          alt={image.alt_text}
          loading="lazy"
        />
      ))}
      {normalizedImages.length > 1 ? (
        <div className="amenities-card-carousel-indicators" aria-hidden="true">
          {normalizedImages.map((image, index) => (
            <span
              key={`indicator-${image.id}`}
              className={index === activeIndex ? 'is-active' : ''}
            />
          ))}
        </div>
      ) : null}
    </div>
  );
}

export default AmenitiesCardImageCarousel;

