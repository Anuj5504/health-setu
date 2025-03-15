const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const {
    startAIConversation,
    processAIConversation,
    getPatientAppointments
} = require('../controllers/AppointmentController');

// AI Conversation endpoints
router.post('/start', startAIConversation);
router.post('/talk', processAIConversation);

// Patient appointments
router.get('/patient/:patientId', auth, getPatientAppointments);

module.exports = router;