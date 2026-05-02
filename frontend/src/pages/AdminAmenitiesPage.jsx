import { useEffect, useState } from 'react';
import MessageBox from '../components/MessageBox.jsx';
import { apiDelete, apiGet, apiPatch, apiPost, apiPut, apiUploadFile } from '../services/api.js';
import { getAdminToken } from '../utils/adminSession.js';

const initialSectionForm = {
  eyebrow: 'Amenities',
  title: 'What do we have to offer? A lot. Kinda...',
  subtitle: ''
};

const emptyImageRow = {
  image_url: '',
  alt_text: '',
  sort_order: 1,
  is_active: true
};

const initialCardForm = {
  id: null,
  title: '',
  description: '',
  sort_order: 1,
  is_active: true,
  images: [{ ...emptyImageRow }]
};

function normalizeImages(images) {
  if (!Array.isArray(images) || !images.length) {
    return [{ ...emptyImageRow }];
  }

  const normalized = images.map((image) => ({
    image_url: image.image_url || '',
    alt_text: image.alt_text || '',
    sort_order: image.sort_order || 1,
    is_active: image.is_active === 0 ? false : true
  }));

  return normalized.length ? normalized : [{ ...emptyImageRow }];
}

function AdminAmenitiesPage() {
  const token = getAdminToken();

  const [sectionForm, setSectionForm] = useState(initialSectionForm);
  const [sectionMessage, setSectionMessage] = useState(null);
  const [sectionLoading, setSectionLoading] = useState(true);
  const [sectionSaving, setSectionSaving] = useState(false);

  const [cards, setCards] = useState([]);
  const [cardForm, setCardForm] = useState(initialCardForm);
  const [cardMessage, setCardMessage] = useState(null);
  const [cardsLoading, setCardsLoading] = useState(true);
  const [cardSaving, setCardSaving] = useState(false);
  const [uploadingImageIndex, setUploadingImageIndex] = useState(null);

  useEffect(() => {
    async function loadSection() {
      try {
        const data = await apiGet('/admin/amenities-content', { token });
        setSectionForm((current) => ({
          ...current,
          ...data
        }));
      } catch (error) {
        setSectionMessage({ type: 'error', text: error.message });
      } finally {
        setSectionLoading(false);
      }
    }

    loadSection();
  }, [token]);

  useEffect(() => {
    async function loadCards() {
      try {
        const data = await apiGet('/admin/amenities-cards', { token });
        setCards(Array.isArray(data) ? data : []);
      } catch (error) {
        setCardMessage({ type: 'error', text: error.message });
      } finally {
        setCardsLoading(false);
      }
    }

    loadCards();
  }, [token]);

  function updateSectionField(event) {
    const { name, value } = event.target;
    setSectionForm((current) => ({
      ...current,
      [name]: value
    }));
  }

  async function handleSectionSubmit(event) {
    event.preventDefault();
    setSectionMessage(null);

    try {
      setSectionSaving(true);
      const saved = await apiPut('/admin/amenities-content', sectionForm, { token });
      setSectionForm((current) => ({
        ...current,
        ...saved
      }));
      setSectionMessage({ type: 'success', text: 'Amenities section updated successfully.' });
    } catch (error) {
      setSectionMessage({ type: 'error', text: error.message });
    } finally {
      setSectionSaving(false);
    }
  }

  function updateCardField(event) {
    const { name, value, type, checked } = event.target;
    setCardForm((current) => ({
      ...current,
      [name]: type === 'checkbox' ? checked : value
    }));
  }

  function updateImageField(index, field, value) {
    setCardForm((current) => ({
      ...current,
      images: current.images.map((image, currentIndex) => {
        if (currentIndex !== index) {
          return image;
        }

        return {
          ...image,
          [field]: value
        };
      })
    }));
  }

  function handleImageInputChange(index) {
    return (event) => {
      const { name, value, type, checked } = event.target;
      updateImageField(index, name, type === 'checkbox' ? checked : value);
    };
  }

  async function handleImageUpload(index, event) {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    try {
      setUploadingImageIndex(index);
      const uploaded = await apiUploadFile(file, { token });
      updateImageField(index, 'image_url', uploaded.file_url || uploaded.file_path || '');
      setCardMessage({ type: 'success', text: 'Card file uploaded successfully.' });
    } catch (error) {
      setCardMessage({ type: 'error', text: error.message });
    } finally {
      setUploadingImageIndex(null);
      event.target.value = '';
    }
  }

  function addImageRow() {
    setCardForm((current) => ({
      ...current,
      images: [...current.images, { ...emptyImageRow, sort_order: current.images.length + 1 }]
    }));
  }

  function removeImageRow(index) {
    setCardForm((current) => {
      const nextImages = current.images.filter((_, currentIndex) => currentIndex !== index);
      return {
        ...current,
        images: nextImages.length ? nextImages : [{ ...emptyImageRow }]
      };
    });
  }

  function resetCardForm() {
    setCardForm(initialCardForm);
  }

  function handleEdit(card) {
    setCardForm({
      id: card.id,
      title: card.title || '',
      description: card.description || '',
      sort_order: card.sort_order || 1,
      is_active: card.is_active === 0 ? false : true,
      images: normalizeImages(card.images)
    });
    setCardMessage(null);
  }

  async function handleCardSubmit(event) {
    event.preventDefault();
    setCardMessage(null);

    try {
      setCardSaving(true);
      const payload = {
        title: cardForm.title,
        description: cardForm.description,
        sort_order: Number(cardForm.sort_order || 1),
        is_active: Boolean(cardForm.is_active),
        images: (cardForm.images || [])
          .filter((image) => image.image_url)
          .map((image) => ({
            image_url: image.image_url,
            alt_text: image.alt_text || null,
            sort_order: Number(image.sort_order || 1),
            is_active: image.is_active !== false
          }))
      };

      const savedCard = cardForm.id
        ? await apiPatch(`/admin/amenities-cards/${cardForm.id}`, payload, { token })
        : await apiPost('/admin/amenities-cards', payload, { token });

      setCards((current) => {
        const next = cardForm.id
          ? current.map((card) => (card.id === savedCard.id ? savedCard : card))
          : [...current, savedCard];

        return next.sort((a, b) => a.sort_order - b.sort_order || a.id - b.id);
      });

      setCardMessage({
        type: 'success',
        text: cardForm.id ? 'Amenities card updated successfully.' : 'Amenities card created successfully.'
      });
      resetCardForm();
    } catch (error) {
      setCardMessage({ type: 'error', text: error.message });
    } finally {
      setCardSaving(false);
    }
  }

  async function handleDelete(id) {
    const confirmed = window.confirm('Delete this amenities card? This will remove its images too.');

    if (!confirmed) {
      return;
    }

    try {
      await apiDelete(`/admin/amenities-cards/${id}`, { token });
      setCards((current) => current.filter((card) => card.id !== id));
      if (cardForm.id === id) {
        resetCardForm();
      }
      setCardMessage({ type: 'success', text: 'Amenities card deleted successfully.' });
    } catch (error) {
      setCardMessage({ type: 'error', text: error.message });
    }
  }

  return (
    <main className="main-grid">
      <div className="stack-grid">
        <section className="panel">
          <div className="panel-header">
            <p className="eyebrow">Content Management</p>
            <h1 className="page-title">Amenities</h1>
            <p>Update the section heading and manage the cards shown on the homepage.</p>
          </div>

          <div className="panel-header">
            <h2>Section heading</h2>
          </div>

          <form className="booking-form" onSubmit={handleSectionSubmit}>
            <label>
              <span>Eyebrow text</span>
              <input name="eyebrow" value={sectionForm.eyebrow} onChange={updateSectionField} required />
            </label>

            <label>
              <span>Section title</span>
              <textarea name="title" rows="3" value={sectionForm.title} onChange={updateSectionField} required />
            </label>

            <label>
              <span>Subtitle</span>
              <textarea name="subtitle" rows="3" value={sectionForm.subtitle || ''} onChange={updateSectionField} />
            </label>

            <div className="action-row">
              <button type="submit" className="btn btn-primary" disabled={sectionSaving || sectionLoading}>
                {sectionSaving ? 'Saving...' : 'Save Heading'}
              </button>
            </div>
          </form>

          <MessageBox message={sectionMessage} />
        </section>

        <section className="panel">
          <div className="panel-header">
            <h2>Cards</h2>
            <p>Each card shows a title, an image carousel, and a description.</p>
          </div>

          <form className="booking-form" onSubmit={handleCardSubmit}>
            <div className="field-grid">
              <label>
                <span>Card title</span>
                <input name="title" value={cardForm.title} onChange={updateCardField} required />
              </label>
              <label>
                <span>Sort order</span>
                <input type="number" min="1" name="sort_order" value={cardForm.sort_order} onChange={updateCardField} required />
              </label>
            </div>

            <label className="full-width">
              <span>Description</span>
              <textarea name="description" rows="3" value={cardForm.description} onChange={updateCardField} required />
            </label>

            <label className="checkbox-row">
              <input type="checkbox" name="is_active" checked={cardForm.is_active} onChange={updateCardField} />
              <span>Show this card on the homepage</span>
            </label>

            <div className="panel-header">
              <h3>Card images</h3>
              <p>Images rotate automatically. Sort order controls the display sequence.</p>
            </div>

            {cardForm.images.map((image, index) => (
              <div className="panel" key={`image-row-${index}`}>
                <div className="field-grid">
                  <label>
                    <span>Image URL</span>
                    <input name="image_url" value={image.image_url} onChange={handleImageInputChange(index)} placeholder="https://example.com/photo.jpg" />
                  </label>
                  <label>
                    <span>Alt text</span>
                    <input name="alt_text" value={image.alt_text} onChange={handleImageInputChange(index)} />
                  </label>
                </div>
                <label>
                  <span>Upload file (image or PDF)</span>
                  <input type="file" accept="image/*,application/pdf" onChange={(event) => handleImageUpload(index, event)} disabled={uploadingImageIndex === index || cardSaving} />
                </label>
                {uploadingImageIndex === index ? <div className="room-meta">Uploading file...</div> : null}
                <div className="field-grid">
                  <label>
                    <span>Sort order</span>
                    <input type="number" min="1" name="sort_order" value={image.sort_order} onChange={handleImageInputChange(index)} />
                  </label>
                  <label className="checkbox-row">
                    <input type="checkbox" name="is_active" checked={Boolean(image.is_active)} onChange={handleImageInputChange(index)} />
                    <span>Active</span>
                  </label>
                </div>
                <div className="action-row">
                  <button type="button" className="btn btn-secondary" onClick={addImageRow}>
                    Add Image
                  </button>
                  <button type="button" className="btn btn-accent" onClick={() => removeImageRow(index)}>
                    Remove
                  </button>
                </div>
              </div>
            ))}

            <div className="action-row">
              <button type="submit" className="btn btn-primary" disabled={cardSaving}>
                {cardSaving ? 'Saving...' : cardForm.id ? 'Update Card' : 'Create Card'}
              </button>
              {cardForm.id ? (
                <button type="button" className="btn btn-secondary" onClick={resetCardForm}>
                  Cancel Edit
                </button>
              ) : null}
            </div>
          </form>

          <MessageBox message={cardMessage} />
        </section>
      </div>

      <aside className="sidebar">
        <section className="panel">
          <div className="panel-header">
            <p className="eyebrow">Current Cards</p>
            <h2>Amenities list</h2>
          </div>

          <div className={cards.length ? 'room-list' : 'room-list empty-state'}>
            {cardsLoading ? 'Loading amenities cards...' : cards.length ? cards.map((card) => (
              <article className="room-card" key={card.id}>
                <header>
                  <div>
                    <h3>{card.title}</h3>
                    <p className="room-meta">Order {card.sort_order} · {card.is_active ? 'Active' : 'Hidden'}</p>
                  </div>
                </header>
                <p className="room-meta">{card.images?.length ? `${card.images.length} image(s)` : 'No images yet.'}</p>
                <p className="room-meta">{card.description}</p>
                <div className="action-row">
                  <button type="button" className="btn btn-secondary" onClick={() => handleEdit(card)}>
                    Edit
                  </button>
                  <button type="button" className="btn btn-accent" onClick={() => handleDelete(card.id)}>
                    Delete
                  </button>
                </div>
              </article>
            )) : 'No amenities cards yet.'}
          </div>
        </section>

        <section className="panel">
          <div className="panel-header">
            <p className="eyebrow">Preview Notes</p>
            <h2>Placement</h2>
          </div>
          <div className="summary-card">
            <div><strong>Section title:</strong> shown at the top of the section</div>
            <div><strong>Cards:</strong> each card shows title, carousel, and description</div>
          </div>
        </section>
      </aside>
    </main>
  );
}

export default AdminAmenitiesPage;
