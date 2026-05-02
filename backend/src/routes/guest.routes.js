const express = require('express');
const {
  getGuests,
  getGuestById,
  updateGuest
} = require('../controllers/guest.controller');

const router = express.Router();

router.get('/guests', getGuests);
router.get('/guests/:id', getGuestById);
router.patch('/guests/:id', updateGuest);

module.exports = router;
