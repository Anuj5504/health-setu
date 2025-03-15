const express = require("express");
const router = express.Router();
// Remove unused model imports
// const HealthproModel = require("../models/HealthproModel");
// const PatientModel = require("../models/PatientModel");
// const FamilyModel = require("../models/FamilyModel");
const {
    createPatient,
    loginPatient,
    createFamily,
    createHealthpro,
    loginHealthpro,
    joinFamily,
    createCaregiver,
    loginCaregiver
} = require('../controllers/AuthController');

// Auth routes
router.post('/login', loginPatient);
router.post('/healthpro/login', loginHealthpro);
router.post('/caregiver/login', loginCaregiver);

router.post('/register', createPatient);
router.post('/healthpro/register', createHealthpro);
router.post('/caregiver/register', createCaregiver);

router.post('/family/create', createFamily);
router.post('/family/join', joinFamily);

module.exports = router;   