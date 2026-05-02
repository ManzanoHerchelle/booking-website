const express = require('express');
const {
  getPublicLandingContent,
  getAdminLandingContent,
  saveLandingContent
} = require('../controllers/landingContent.controller');
const {
  authenticateAdmin,
  requireAdminRole
} = require('../middlewares/auth.middleware');

const router = express.Router();

router.get('/landing-content', getPublicLandingContent);
router.get('/admin/landing-content', authenticateAdmin, requireAdminRole, getAdminLandingContent);
router.put('/admin/landing-content', authenticateAdmin, requireAdminRole, saveLandingContent);

module.exports = router;
