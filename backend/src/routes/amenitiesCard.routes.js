const express = require('express');
const {
  getPublicAmenitiesCards,
  getAdminAmenitiesCards,
  createAmenitiesCard,
  updateAmenitiesCard,
  deleteAmenitiesCard
} = require('../controllers/amenitiesCard.controller');
const {
  authenticateAdmin,
  requireAdminRole
} = require('../middlewares/auth.middleware');

const router = express.Router();

router.get('/amenities-cards', getPublicAmenitiesCards);
router.get('/admin/amenities-cards', authenticateAdmin, requireAdminRole, getAdminAmenitiesCards);
router.post('/admin/amenities-cards', authenticateAdmin, requireAdminRole, createAmenitiesCard);
router.patch('/admin/amenities-cards/:id', authenticateAdmin, requireAdminRole, updateAmenitiesCard);
router.delete('/admin/amenities-cards/:id', authenticateAdmin, requireAdminRole, deleteAmenitiesCard);

module.exports = router;
