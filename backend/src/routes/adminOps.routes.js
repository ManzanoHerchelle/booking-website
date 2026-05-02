const express = require('express');
const {
  getOperationsOverview,
  getActivityLogs
} = require('../controllers/adminOps.controller');
const {
  authenticateAdmin,
  requireAdminRole
} = require('../middlewares/auth.middleware');

const router = express.Router();

router.get('/admin/operations/overview', authenticateAdmin, requireAdminRole, getOperationsOverview);
router.get('/admin/activity-logs', authenticateAdmin, requireAdminRole, getActivityLogs);

module.exports = router;
