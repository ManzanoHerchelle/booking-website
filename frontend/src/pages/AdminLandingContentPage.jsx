import { useEffect, useState } from 'react';
import MessageBox from '../components/MessageBox.jsx';
import { apiGet, apiPut } from '../services/api.js';
import { getAdminToken } from '../utils/adminSession.js';

const initialForm = {
  eyebrow: 'BrewSpot Cafe & Villa',
  title: 'Book a stay in our place for vacay.',
  subtitle: 'Maybe grab a coffee in our BrewSpot Cafe too.',
  primary_button_label: 'Start Booking',
  primary_button_link: '/reserve',
  secondary_button_label: 'Browse Rooms',
  secondary_button_link: '/rooms'
};

function AdminLandingContentPage() {
  const token = getAdminToken();
  const [form, setForm] = useState(initialForm);
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function loadContent() {
      try {
        const data = await apiGet('/admin/landing-content', { token });
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

  async function handleSubmit(event) {
    event.preventDefault();
    setMessage(null);

    try {
      setSaving(true);
      const saved = await apiPut('/admin/landing-content', form, { token });
      setForm((current) => ({
        ...current,
        ...saved
      }));
      setMessage({ type: 'success', text: 'Landing section updated successfully.' });
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
          <h1 className="page-title">Landing Section</h1>
          <p>Edit the main introduction copy and buttons shown on the homepage.</p>
        </div>

        <form className="booking-form" onSubmit={handleSubmit}>
          <label>
            <span>Eyebrow text</span>
            <input name="eyebrow" value={form.eyebrow} onChange={updateField} required />
          </label>

          <label>
            <span>Main title</span>
            <textarea name="title" rows="3" value={form.title} onChange={updateField} required />
          </label>

          <label>
            <span>Subtitle</span>
            <textarea name="subtitle" rows="3" value={form.subtitle} onChange={updateField} />
          </label>

          <div className="field-grid">
            <label>
              <span>Primary button label</span>
              <input name="primary_button_label" value={form.primary_button_label} onChange={updateField} required />
            </label>
            <label>
              <span>Primary button link</span>
              <input name="primary_button_link" value={form.primary_button_link} onChange={updateField} required />
            </label>
          </div>

          <div className="field-grid">
            <label>
              <span>Secondary button label</span>
              <input name="secondary_button_label" value={form.secondary_button_label || ''} onChange={updateField} />
            </label>
            <label>
              <span>Secondary button link</span>
              <input name="secondary_button_link" value={form.secondary_button_link || ''} onChange={updateField} />
            </label>
          </div>

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
            <p className="eyebrow">Live Preview Notes</p>
            <h2>What this controls</h2>
          </div>
          <div className="summary-card">
            <div><strong>Eyebrow:</strong> small label above the title</div>
            <div><strong>Main title:</strong> large headline shown on the left</div>
            <div><strong>Subtitle:</strong> supporting text below the title</div>
            <div><strong>Buttons:</strong> primary and secondary call-to-action links</div>
          </div>
        </section>
      </aside>
    </main>
  );
}

export default AdminLandingContentPage;
