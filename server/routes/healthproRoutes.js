const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const {
    getHealthpros,
    getHealthproById,
    setCaregiver
} = require('../controllers/HealthproController');

router.get('/', getHealthpros);
router.get('/:id', getHealthproById);
router.post('/set-caregiver', setCaregiver);

module.exports = router; 