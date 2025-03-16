const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const {
    startAIConversation,
    processAIConversation,
    getPatientAppointments,
    getAppointments
} = require('../controllers/AppointmentController');

// AI Conversation endpoints
router.post('/start', startAIConversation);
router.post('/talk', processAIConversation);

// Patient appointments
router.get('/patient/:patientId',getPatientAppointments);
router.get('/patient', getAppointments);

module.exports = router;