const express = require('express');
const router = express.Router();
const {
    createPrescription,
    getDoctorPrescriptions,
    getPrescriptionById,
    updatePrescriptionPDF,
    deletePrescription,
    getPatientPrescriptions
} = require('../controllers/prescriptionController');

// Protected routes (require authentication)

// Create new prescription
router.post('/', createPrescription);

// Get all prescriptions for a doctor
router.get('/doctor', getDoctorPrescriptions);

// Get prescription by ID
router.get('/:id', getPrescriptionById);

// Update prescription PDF URL
router.patch('/pdf', updatePrescriptionPDF);

// Delete prescription
router.delete('/:id', deletePrescription);

// Add this route to your existing routes
router.get('/patient/:patientId', getPatientPrescriptions);

module.exports = router; 