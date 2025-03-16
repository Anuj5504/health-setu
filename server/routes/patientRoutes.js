const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const {
    getPatients,
    getPatientById,
    updatePatientCaregiver,
    setDisease,
    createDisease
} = require('../controllers/PatientController');

router.get('/',  getPatients);
router.get('/:id', getPatientById);
router.put('/update-caregiver', updatePatientCaregiver);
router.post('/set-disease', setDisease);
router.post('/disease', createDisease);

module.exports = router; 