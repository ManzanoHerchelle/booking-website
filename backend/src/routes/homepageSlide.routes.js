const express = require('express');
const {
  getPublicHomepageSlides,
  getAdminHomepageSlides,
  createHomepageSlide,
  updateHomepageSlide,
  deleteHomepageSlide
} = require('../controllers/homepageSlide.controller');
const {
  authenticateAdmin,
  requireAdminRole
} = require('../middlewares/auth.middleware');

const router = express.Router();

router.get('/homepage-slides', getPublicHomepageSlides);
router.get('/admin/homepage-slides', authenticateAdmin, requireAdminRole, getAdminHomepageSlides);
router.post('/admin/homepage-slides', authenticateAdmin, requireAdminRole, createHomepageSlide);
router.patch('/admin/homepage-slides/:id', authenticateAdmin, requireAdminRole, updateHomepageSlide);
router.delete('/admin/homepage-slides/:id', authenticateAdmin, requireAdminRole, deleteHomepageSlide);

module.exports = router;
