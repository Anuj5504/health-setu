const express = require('express');
const router = express.Router();
const {
    getAdminsWithLowStock,
    createDistributionRequest,
    getMyRequests,
    updateRequestStatus,
    savePredictedNeed,
    getAdminsWithPredictedNeeds
} = require('../controllers/DistributionController');

// Get hospitals with low stock
router.get('/admins-low-stock/:adminId', getAdminsWithLowStock);

// Get all requests for an admin (both sent and received)
router.get('/requests/:adminId', getMyRequests);

// Create new request
router.post('/request', createDistributionRequest);

// Update request status
router.put('/request/:requestId/status', updateRequestStatus);

// Add these routes to your existing routes
router.post('/predicted-needs', savePredictedNeed);
router.get('/predicted-needs/:adminId', getAdminsWithPredictedNeeds);

module.exports = router; 