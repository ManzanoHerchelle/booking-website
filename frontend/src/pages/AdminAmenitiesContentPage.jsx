import { useEffect, useState } from 'react';
import MessageBox from '../components/MessageBox.jsx';
import { apiGet, apiPut, apiUploadFile } from '../services/api.js';
import { getAdminToken } from '../utils/adminSession.js';

const initialForm = {
  eyebrow: 'Amenities',
  title: 'What do we have to offer? A lot. Kinda...',
  image_url: '',
  image_alt: 'Amenities section image',
  subtitle: ''
};

function AdminAmenitiesContentPage() {
  const token = getAdminToken();
  const [form, setForm] = useState(initialForm);
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  useEffect(() => {
    async function loadContent() {
      try {
        const data = await apiGet('/admin/amenities-content', { token });
        setForm((current) => ({
          ...current,
          ...data
        }));
      } catch (error) {
        setMessage({ type: 'error', text: error.message });
      } finally {
        setLoading(false);
      }
    }

    loadContent();
  }, [token]);

  function updateField(event) {
    const { name, value } = event.target;
    setForm((current) => ({
      ...current,
      [name]: value
    }));
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
      setMessage({ type: 'success', text: 'File uploaded successfully.' });
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
      const saved = await apiPut('/admin/amenities-content', form, { token });
      setForm((current) => ({
        ...current,
        ...saved
      }));
      setMessage({ type: 'success', text: 'Amenities section updated successfully.' });
    } catch (error) {
      setMessage({ type: 'error', text: error.message });
    } finally {
      setSaving(false);
    }
  }

  return (
    <main className="main-grid">
      <section className="panel">
        <div className="panel-header">
          <p className="eyebrow">Content Management</p>
          <h1 className="page-title">Amenities Section</h1>
          <p>Edit the amenities heading, display image, and supporting subtitle shown on the homepage.</p>
        </div>

        <form className="booking-form" onSubmit={handleSubmit}>
          <label>
            <span>Eyebrow text</span>
            <input name="eyebrow" value={form.eyebrow} onChange={updateField} required />
          </label>

          <label>
            <span>Section title</span>
            <textarea name="title" rows="3" value={form.title} onChange={updateField} required />
          </label>

          <div className="field-grid">
            <label>
              <span>Image URL</span>
              <input name="image_url" value={form.image_url || ''} onChange={updateField} placeholder="https://example.com/amenities.jpg" />
            </label>
            <label>
              <span>Image alt text</span>
              <input name="image_alt" value={form.image_alt || ''} onChange={updateField} />
            </label>
          </div>

          <label>
            <span>Upload file (image or PDF)</span>
            <input type="file" accept="image/*,application/pdf" onChange={handleImageUpload} disabled={uploadingImage || saving || loading} />
          </label>

          {uploadingImage ? <div className="room-meta">Uploading file...</div> : null}

          <label>
            <span>Subtitle</span>
            <textarea name="subtitle" rows="3" value={form.subtitle || ''} onChange={updateField} />
          </label>

          <div className="action-row">
            <button type="submit" className="btn btn-primary" disabled={saving || loading}>
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>

        <MessageBox message={message} />
      </section>

      <aside className="sidebar">
        <section className="panel">
          <div className="panel-header">
            <p className="eyebrow">Preview Notes</p>
            <h2>Placement</h2>
          </div>
          <div className="summary-card">
            <div><strong>Title:</strong> shown at the top of the section</div>
            <div><strong>Image:</strong> shown between the title and subtitle</div>
            <div><strong>Subtitle:</strong> shown below the image</div>
          </div>
        </section>
      </aside>
    </main>
  );
}

export default AdminAmenitiesContentPage;
