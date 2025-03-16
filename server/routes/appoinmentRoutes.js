const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const {
    startAIConversation,
    processAIConversation,
    getPatientAppointments,
    getAppointments,
    getAvailableSlots
} = require('../controllers/AppointmentController');


// AI Conversation endpoints
router.post('/start', startAIConversation);
router.post('/talk', processAIConversation);

// Patient appointments
router.get('/patient/:patientId',getPatientAppointments);
router.get('/patient', getAppointments);
router.get('/check-slots/:date', getAvailableSlots);
// router.post('/check-availability', checkAvailability);

module.exports = router;