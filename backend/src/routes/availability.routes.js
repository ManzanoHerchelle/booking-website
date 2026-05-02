const express = require('express');
const {
  getAvailabilityBlocks,
  createAvailabilityBlock
} = require('../controllers/availability.controller');

const router = express.Router();

router.get('/availability-blocks', getAvailabilityBlocks);
router.post('/availability-blocks', createAvailabilityBlock);

module.exports = router;
