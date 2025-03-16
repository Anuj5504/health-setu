const Healthpro = require('../models/HealthproModel');
const Patient = require('../models/PatientModel');
const Family = require('../models/FamilyModel');
const Caregiver = require('../models/CaregiverModel');

const getHealthpros = async (req, res) => {
    try {
        const healthpros = await Healthpro.find();
        res.json(healthpros);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

const getHealthproById = async (req, res) => {
    try {
        const { id } = req.params;
        const healthproData = await Healthpro
            .findById(id)
            .populate('family');
        res.json(healthproData);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

// setcaregivertopaient
const setCaregiver = async (req, res) => {
    try {
        const { patientid, caregiverid } = req.body;
        const patient = await Patient.findById(patientid);
        if (!patient) {
            return res.status(400).json({ msg: "Patient not found" });
        }
        const caregiver = await Caregiver.findById(caregiverid);
        if (!caregiver) {
            return res.status(400).json({ msg: "Caregiver not found" });
        }
        patient.caregiver = caregiver._id;
        await patient.save();
        res.json(patient);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

// Add module exports
module.exports = {
    getHealthpros,
    getHealthproById,
    setCaregiver
};
