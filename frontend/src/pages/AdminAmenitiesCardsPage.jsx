import { useEffect, useState } from 'react';
import MessageBox from '../components/MessageBox.jsx';
import { apiDelete, apiGet, apiPatch, apiPost, apiUploadFile } from '../services/api.js';
import { getAdminToken } from '../utils/adminSession.js';

const emptyImageRow = {
  image_url: '',
  alt_text: '',
  sort_order: 1,
  is_active: true
};

const initialForm = {
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

function AdminAmenitiesCardsPage() {
  const token = getAdminToken();
  const [cards, setCards] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingImageIndex, setUploadingImageIndex] = useState(null);

  useEffect(() => {
    async function loadCards() {
      try {
        const data = await apiGet('/admin/amenities-cards', { token });
        setCards(Array.isArray(data) ? data : []);
      } catch (error) {
        setMessage({ type: 'error', text: error.message });
      } finally {
        setLoading(false);
      }
    }

    loadCards();
  }, [token]);

  function updateField(event) {
    const { name, value, type, checked } = event.target;
    setForm((current) => ({
      ...current,
      [name]: type === 'checkbox' ? checked : value
    }));
  }

  function updateImageField(index, field, value) {
    setForm((current) => ({
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
      setMessage({ type: 'success', text: 'Card file uploaded successfully.' });
    } catch (error) {
      setMessage({ type: 'error', text: error.message });
    } finally {
      setUploadingImageIndex(null);
      event.target.value = '';
    }
  }

  function addImageRow() {
    setForm((current) => ({
      ...current,
      images: [...current.images, { ...emptyImageRow, sort_order: current.images.length + 1 }]
    }));
  }

  function removeImageRow(index) {
    setForm((current) => {
      const nextImages = current.images.filter((_, currentIndex) => currentIndex !== index);
      return {
        ...current,
        images: nextImages.length ? nextImages : [{ ...emptyImageRow }]
      };
    });
  }

  function resetForm() {
    setForm(initialForm);
  }

  function handleEdit(card) {
    setForm({
      id: card.id,
      title: card.title || '',
      description: card.description || '',
      sort_order: card.sort_order || 1,
      is_active: card.is_active === 0 ? false : true,
      images: normalizeImages(card.images)
    });
    setMessage(null);
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setMessage(null);

    try {
      setSaving(true);
      const payload = {
        title: form.title,
        description: form.description,
        sort_order: Number(form.sort_order || 1),
        is_active: Boolean(form.is_active),
        images: (form.images || [])
          .filter((image) => image.image_url)
          .map((image) => ({
            image_url: image.image_url,
            alt_text: image.alt_text || null,
            sort_order: Number(image.sort_order || 1),
            is_active: image.is_active !== false
          }))
      };

      const savedCard = form.id
        ? await apiPatch(`/admin/amenities-cards/${form.id}`, payload, { token })
        : await apiPost('/admin/amenities-cards', payload, { token });

      setCards((current) => {
        const next = form.id
          ? current.map((card) => (card.id === savedCard.id ? savedCard : card))
          : [...current, savedCard];

        return next.sort((a, b) => a.sort_order - b.sort_order || a.id - b.id);
      });

      setMessage({
        type: 'success',
        text: form.id ? 'Amenities card updated successfully.' : 'Amenities card created successfully.'
      });
      resetForm();
    } catch (error) {
      setMessage({ type: 'error', text: error.message });
    } finally {
      setSaving(false);
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
      if (form.id === id) {
        resetForm();
      }
      setMessage({ type: 'success', text: 'Amenities card deleted successfully.' });
    } catch (error) {
      setMessage({ type: 'error', text: error.message });
    }
  }

  return (
    <main className="main-grid">
      <section className="panel">
        <div className="panel-header">
          <p className="eyebrow">Content Management</p>
          <h1 className="page-title">Amenities Cards</h1>
          <p>Create cards shown on the homepage. Each card can rotate through multiple images.</p>
        </div>

        <form className="booking-form" onSubmit={handleSubmit}>
          <div className="field-grid">
            <label>
              <span>Title</span>
              <input name="title" value={form.title} onChange={updateField} required />
            </label>
            <label>
              <span>Sort order</span>
              <input type="number" min="1" name="sort_order" value={form.sort_order} onChange={updateField} required />
            </label>
          </div>

          <label className="full-width">
            <span>Description</span>
            <textarea name="description" rows="3" value={form.description} onChange={updateField} required />
          </label>

          <label className="checkbox-row">
            <input type="checkbox" name="is_active" checked={form.is_active} onChange={updateField} />
            <span>Show this card on the homepage</span>
          </label>

          <div className="panel-header">
            <h2>Card images</h2>
            <p>Images rotate automatically. Sort order controls the display sequence.</p>
          </div>

          {form.images.map((image, index) => (
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
                <input type="file" accept="image/*,application/pdf" onChange={(event) => handleImageUpload(index, event)} disabled={uploadingImageIndex === index || saving} />
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
            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? 'Saving...' : form.id ? 'Update Card' : 'Create Card'}
            </button>
            {form.id ? (
              <button type="button" className="btn btn-secondary" onClick={resetForm}>
                Cancel Edit
              </button>
            ) : null}
          </div>
        </form>

        <MessageBox message={message} />
      </section>

      <aside className="sidebar">
        <section className="panel">
          <div className="panel-header">
            <p className="eyebrow">Current Cards</p>
            <h2>Amenities list</h2>
          </div>

          <div className={cards.length ? 'room-list' : 'room-list empty-state'}>
            {loading ? 'Loading amenities cards...' : cards.length ? cards.map((card) => (
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
      </aside>
    </main>
  );
}

export default AdminAmenitiesCardsPage;

