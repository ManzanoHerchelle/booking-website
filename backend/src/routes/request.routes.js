const express = require('express');
const {
  getCancellationRequests,
  createCancellationRequest,
  getRefundRequests,
  createRefundRequest,
  getStayExtensions,
  createStayExtension,
  getRoomTransfers,
  createRoomTransfer
} = require('../controllers/request.controller');

const router = express.Router();

router.get('/cancellation-requests', getCancellationRequests);
router.post('/cancellation-requests', createCancellationRequest);
router.get('/refund-requests', getRefundRequests);
router.post('/refund-requests', createRefundRequest);
router.get('/stay-extensions', getStayExtensions);
router.post('/stay-extensions', createStayExtension);
router.get('/room-transfers', getRoomTransfers);
router.post('/room-transfers', createRoomTransfer);

module.exports = router;
