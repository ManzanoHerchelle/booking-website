const express = require('express');
const {
  getRoomTypes,
  getRooms,
  getPromos,
  getAvailableRooms
} = require('../controllers/catalog.controller');

const router = express.Router();

router.get('/room-types', getRoomTypes);
router.get('/rooms', getRooms);
router.get('/promos', getPromos);
router.get('/available-rooms', getAvailableRooms);

module.exports = router;
