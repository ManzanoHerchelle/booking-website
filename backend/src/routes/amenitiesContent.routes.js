const express = require('express');
const {
  getPublicAmenitiesContent,
  getAdminAmenitiesContent,
  saveAmenitiesContent
} = require('../controllers/amenitiesContent.controller');
const {
  authenticateAdmin,
  requireAdminRole
} = require('../middlewares/auth.middleware');

const router = express.Router();

router.get('/amenities-content', getPublicAmenitiesContent);
router.get('/admin/amenities-content', authenticateAdmin, requireAdminRole, getAdminAmenitiesContent);
router.put('/admin/amenities-content', authenticateAdmin, requireAdminRole, saveAmenitiesContent);

module.exports = router;
