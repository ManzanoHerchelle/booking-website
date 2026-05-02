import { useEffect, useState } from 'react';
import MessageBox from '../components/MessageBox.jsx';
import { apiDelete, apiGet, apiPatch, apiPost, apiUploadFile } from '../services/api.js';
import { getAdminToken } from '../utils/adminSession.js';

const initialForm = {
  id: null,
  title: '',
  subtitle: '',
  image_url: '',
  alt_text: '',
  button_label: '',
  button_link: '',
  sort_order: 1,
  is_active: true
};

function AdminSlidesPage() {
  const token = getAdminToken();
  const [slides, setSlides] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  useEffect(() => {
    async function loadSlides() {
      try {
        const data = await apiGet('/admin/homepage-slides', { token });
        setSlides(data);
      } catch (error) {
        setMessage({ type: 'error', text: error.message });
      } finally {
        setLoading(false);
      }
    }

    loadSlides();
  }, [token]);

  function updateField(event) {
    const { name, value, type, checked } = event.target;
    setForm((current) => ({
      ...current,
      [name]: type === 'checkbox' ? checked : value
    }));
  }

  function handleEdit(slide) {
    setForm({
      id: slide.id,
      title: slide.title || '',
      subtitle: slide.subtitle || '',
      image_url: slide.image_url || '',
      alt_text: slide.alt_text || '',
      button_label: slide.button_label || '',
      button_link: slide.button_link || '',
      sort_order: slide.sort_order || 1,
      is_active: Boolean(slide.is_active)
    });
    setMessage(null);
  }

  function resetForm() {
    setForm(initialForm);
  }

  async function handleImageUpload(event) {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    try {
      setUploadingImage(true);
      const uploaded = await apiUploadFile(file, { token });
      setForm((current) => ({
        ...current,
        image_url: uploaded.file_url || uploaded.file_path || ''
      }));
      setMessage({ type: 'success', text: 'Slide file uploaded successfully.' });
    } catch (error) {
      setMessage({ type: 'error', text: error.message });
    } finally {
      setUploadingImage(false);
      event.target.value = '';
    }
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setMessage(null);

    try {
      setSaving(true);
      const payload = {
        ...form,
        sort_order: Number(form.sort_order || 1)
      };

      const savedSlide = form.id
        ? await apiPatch(`/admin/homepage-slides/${form.id}`, payload, { token })
        : await apiPost('/admin/homepage-slides', payload, { token });

      setSlides((current) => {
        if (form.id) {
          return current.map((slide) => (slide.id === savedSlide.id ? savedSlide : slide));
        }

        return [...current, savedSlide].sort((a, b) => a.sort_order - b.sort_order || a.id - b.id);
      });

      setMessage({
        type: 'success',
        text: form.id ? 'Homepage slide updated successfully.' : 'Homepage slide created successfully.'
      });
      resetForm();
    } catch (error) {
      setMessage({ type: 'error', text: error.message });
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id) {
    const confirmed = window.confirm('Delete this homepage slide?');

    if (!confirmed) {
      return;
    }

    try {
      await apiDelete(`/admin/homepage-slides/${id}`, { token });
      setSlides((current) => current.filter((slide) => slide.id !== id));

      if (form.id === id) {
        resetForm();
      }

      setMessage({ type: 'success', text: 'Homepage slide deleted successfully.' });
    } catch (error) {
      setMessage({ type: 'error', text: error.message });
    }
  }

  return (
    <main className="main-grid">
      <section className="panel">
        <div className="panel-header">
          <p className="eyebrow">Content Management</p>
          <h1 className="page-title">Homepage Slides</h1>
          <p>Add, reorder, activate, and edit the images shown on the landing page.</p>
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
            <span>Subtitle</span>
            <textarea name="subtitle" rows="3" value={form.subtitle} onChange={updateField} />
          </label>

          <div className="field-grid">
            <label>
              <span>Image URL</span>
              <input name="image_url" value={form.image_url} onChange={updateField} required />
            </label>
            <label>
              <span>Alt text</span>
              <input name="alt_text" value={form.alt_text} onChange={updateField} />
            </label>
          </div>

          <label>
            <span>Upload file (image or PDF)</span>
            <input type="file" accept="image/*,application/pdf" onChange={handleImageUpload} disabled={uploadingImage || saving} />
          </label>

          {uploadingImage ? <div className="room-meta">Uploading slide file...</div> : null}

          <div className="field-grid">
            <label>
              <span>Button label</span>
              <input name="button_label" value={form.button_label} onChange={updateField} />
            </label>
            <label>
              <span>Button link</span>
              <input name="button_link" value={form.button_link} onChange={updateField} placeholder="/reserve" />
            </label>
          </div>

          <label className="checkbox-row">
            <input type="checkbox" name="is_active" checked={form.is_active} onChange={updateField} />
            <span>Show this slide on the homepage</span>
          </label>

          <div className="action-row">
            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? 'Saving...' : form.id ? 'Update Slide' : 'Create Slide'}
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
            <p className="eyebrow">Current Slides</p>
            <h2>Homepage content list</h2>
          </div>

          <div className={slides.length ? 'room-list' : 'room-list empty-state'}>
            {loading ? 'Loading slides...' : slides.length ? slides.map((slide) => (
              <article className="room-card" key={slide.id}>
                <header>
                  <div>
                    <h3>{slide.title}</h3>
                    <p className="room-meta">Order {slide.sort_order} · {slide.is_active ? 'Active' : 'Hidden'}</p>
                  </div>
                </header>
                <p className="room-meta">{slide.subtitle || 'No subtitle yet.'}</p>
                <p className="room-meta">{slide.image_url}</p>
                <div className="action-row">
                  <button type="button" className="btn btn-secondary" onClick={() => handleEdit(slide)}>
                    Edit
                  </button>
                  <button type="button" className="btn btn-accent" onClick={() => handleDelete(slide.id)}>
                    Delete
                  </button>
                </div>
              </article>
            )) : 'No homepage slides yet.'}
          </div>
        </section>
      </aside>
    </main>
  );
}

export default AdminSlidesPage;
