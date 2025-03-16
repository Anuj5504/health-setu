const express = require('express');
const router = express.Router();
const reportAIController = require('../controllers/ReportAIController');

// Error handling middleware for multer
const handleMulterError = (err, req, res, next) => {
    if (err) {
        console.error('Multer error:', err);
        return res.status(400).json({
            error: err.message || 'Error uploading file'
        });
    }
    next();
};

// File upload endpoint with error handling
router.post('/upload', 
    (req, res, next) => {
        reportAIController.upload.single('file')(req, res, (err) => {
            handleMulterError(err, req, res, next);
        });
    },
    reportAIController.handleFileUpload
);

// Analysis endpoint
router.post('/analyze', reportAIController.analyzeReport);

module.exports = router; 