const pool = require('../config/db');

async function getGuests(req, res) {
  try {
    const [rows] = await pool.query(
      `
      SELECT *
      FROM guests
      ORDER BY created_at DESC
      `
    );
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to fetch guests' });
  }
}

async function getGuestById(req, res) {
  try {
    const [rows] = await pool.query(
      'SELECT * FROM guests WHERE id = ? LIMIT 1',
      [req.params.id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: 'Guest not found' });
    }

    res.json(rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to fetch guest' });
  }
}

async function updateGuest(req, res) {
  try {
    const {
      first_name,
      last_name,
      email,
      phone,
      address_line,
      city,
      province,
      country,
      notes
    } = req.body;

    await pool.query(
      `
      UPDATE guests
      SET
        first_name = COALESCE(?, first_name),
        last_name = COALESCE(?, last_name),
        email = COALESCE(?, email),
        phone = COALESCE(?, phone),
        address_line = COALESCE(?, address_line),
        city = COALESCE(?, city),
        province = COALESCE(?, province),
        country = COALESCE(?, country),
        notes = COALESCE(?, notes),
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
      `,
      [
        first_name ?? null,
        last_name ?? null,
        email ?? null,
        phone ?? null,
        address_line ?? null,
        city ?? null,
        province ?? null,
        country ?? null,
        notes ?? null,
        req.params.id
      ]
    );

    res.json({ message: 'Guest updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to update guest' });
  }
}

module.exports = {
  getGuests,
  getGuestById,
  updateGuest
};
