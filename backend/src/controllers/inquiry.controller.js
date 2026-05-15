const pool = require('../config/db');

async function getInquiries(req, res) {
  try {
    const { status } = req.query;
    const params = [];
    const where = [];

    if (status) {
      where.push('status = ?');
      params.push(status);
    }

    const whereClause = where.length ? `WHERE ${where.join(' AND ')}` : '';

    const [rows] = await pool.query(
      `
      SELECT id, name, email, phone, subject, message, status, responded_at, response_notes, created_at
      FROM inquiries
      ${whereClause}
      ORDER BY created_at DESC
      `,
      params
    );

    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to fetch inquiries' });
  }
}

async function getInquiry(req, res) {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ message: 'Inquiry ID is required' });
    }

    const [rows] = await pool.query(
      `
      SELECT *
      FROM inquiries
      WHERE id = ?
      `,
      [id]
    );

    if (!rows.length) {
      return res.status(404).json({ message: 'Inquiry not found' });
    }

    // Mark as read if it was new
    if (rows[0].status === 'new') {
      await pool.query('UPDATE inquiries SET status = ? WHERE id = ?', ['read', id]);
    }

    res.json(rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to fetch inquiry' });
  }
}

async function createInquiry(req, res) {
  try {
    const { name, email, phone, subject, message } = req.body;

    if (!name || !email || !subject || !message) {
      return res.status(400).json({
        message: 'name, email, subject, and message are required'
      });
    }

    const [result] = await pool.query(
      `
      INSERT INTO inquiries (name, email, phone, subject, message)
      VALUES (?, ?, ?, ?, ?)
      `,
      [name, email, phone || null, subject, message]
    );

    res.status(201).json({
      message: 'Inquiry submitted successfully',
      inquiry_id: result.insertId
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to create inquiry' });
  }
}

async function updateInquiry(req, res) {
  try {
    const { id } = req.params;
    const { status, response_notes } = req.body;

    if (!id) {
      return res.status(400).json({ message: 'Inquiry ID is required' });
    }

    if (!status && !response_notes) {
      return res.status(400).json({
        message: 'At least one of status or response_notes is required'
      });
    }

    const fields = [];
    const params = [];

    if (status) {
      fields.push('status = ?');
      params.push(status);
    }

    if (response_notes !== undefined) {
      fields.push('response_notes = ?');
      params.push(response_notes || null);
      
      // Only update responded_at if the inquiry is being marked as responded
      if (status === 'responded' && !response_notes) {
        fields.push('responded_at = NOW()');
      }
    }

    // If marking as responded, set responded_at if not already set
    if (status === 'responded') {
      fields.push('responded_at = COALESCE(responded_at, NOW())');
    }

    params.push(id);

    const [result] = await pool.query(
      `
      UPDATE inquiries
      SET ${fields.join(', ')}
      WHERE id = ?
      `,
      params
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Inquiry not found' });
    }

    res.json({ message: 'Inquiry updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to update inquiry' });
  }
}

async function deleteInquiry(req, res) {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ message: 'Inquiry ID is required' });
    }

    const [result] = await pool.query(
      `DELETE FROM inquiries WHERE id = ?`,
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Inquiry not found' });
    }

    res.json({ message: 'Inquiry deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to delete inquiry' });
  }
}

module.exports = {
  getInquiries,
  getInquiry,
  createInquiry,
  updateInquiry,
  deleteInquiry
};
