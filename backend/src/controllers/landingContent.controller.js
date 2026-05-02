const pool = require('../config/db');

const defaultLandingContent = {
  eyebrow: 'BrewSpot Cafe & Villa',
  title: 'Book a stay in our place for vacay.',
  subtitle: 'Maybe grab a coffee in our BrewSpot Cafe too.',
  primary_button_label: 'Start Booking',
  primary_button_link: '/reserve',
  secondary_button_label: 'Browse Rooms',
  secondary_button_link: '/rooms'
};

async function getPublicLandingContent(req, res) {
  try {
    const [rows] = await pool.query(
      `
      SELECT
        eyebrow,
        title,
        subtitle,
        primary_button_label,
        primary_button_link,
        secondary_button_label,
        secondary_button_link
      FROM landing_content
      ORDER BY id ASC
      LIMIT 1
      `
    );

    res.json(rows[0] || defaultLandingContent);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to load landing content' });
  }
}

async function getAdminLandingContent(req, res) {
  try {
    const [rows] = await pool.query(
      `
      SELECT
        lc.*,
        updater.full_name AS updated_by_name
      FROM landing_content lc
      LEFT JOIN users updater ON updater.id = lc.updated_by
      ORDER BY lc.id ASC
      LIMIT 1
      `
    );

    res.json(rows[0] || defaultLandingContent);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to load landing content' });
  }
}

async function saveLandingContent(req, res) {
  try {
    const {
      eyebrow,
      title,
      subtitle,
      primary_button_label,
      primary_button_link,
      secondary_button_label,
      secondary_button_link
    } = req.body;

    if (!eyebrow || !title || !primary_button_label || !primary_button_link) {
      return res.status(400).json({
        message: 'Eyebrow, title, primary button label, and primary button link are required'
      });
    }

    const [existingRows] = await pool.query(
      'SELECT id FROM landing_content ORDER BY id ASC LIMIT 1'
    );

    if (existingRows.length) {
      const existingId = existingRows[0].id;

      await pool.query(
        `
        UPDATE landing_content
        SET
          eyebrow = ?,
          title = ?,
          subtitle = ?,
          primary_button_label = ?,
          primary_button_link = ?,
          secondary_button_label = ?,
          secondary_button_link = ?,
          updated_by = ?,
          updated_at = NOW()
        WHERE id = ?
        `,
        [
          eyebrow,
          title,
          subtitle || null,
          primary_button_label,
          primary_button_link,
          secondary_button_label || null,
          secondary_button_link || null,
          req.user.id,
          existingId
        ]
      );
    } else {
      await pool.query(
        `
        INSERT INTO landing_content (
          eyebrow,
          title,
          subtitle,
          primary_button_label,
          primary_button_link,
          secondary_button_label,
          secondary_button_link,
          updated_by
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `,
        [
          eyebrow,
          title,
          subtitle || null,
          primary_button_label,
          primary_button_link,
          secondary_button_label || null,
          secondary_button_link || null,
          req.user.id
        ]
      );
    }

    const [rows] = await pool.query(
      `
      SELECT
        lc.*,
        updater.full_name AS updated_by_name
      FROM landing_content lc
      LEFT JOIN users updater ON updater.id = lc.updated_by
      ORDER BY lc.id ASC
      LIMIT 1
      `
    );

    res.json(rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to save landing content' });
  }
}

module.exports = {
  getPublicLandingContent,
  getAdminLandingContent,
  saveLandingContent
};
