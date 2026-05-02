const express = require('express');
const {
  getPayments,
  getAdminPayments,
  createPayment,
  createAdminPayment,
  handlePaymentWebhook,
  refundAdminPayment
} = require('../controllers/payment.controller');
const {
  authenticateAdmin,
  requireAdminRole
} = require('../middlewares/auth.middleware');

const router = express.Router();

router.get('/admin/payments', authenticateAdmin, requireAdminRole, getAdminPayments);
router.post('/admin/payments', authenticateAdmin, requireAdminRole, createAdminPayment);
router.post('/admin/payments/:id/refund', authenticateAdmin, requireAdminRole, refundAdminPayment);
router.post('/payments/webhooks/generic', handlePaymentWebhook);
router.get('/payments', getPayments);
router.post('/payments', createPayment);

module.exports = router;
