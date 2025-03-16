const Patient = require('../models/PatientModel');
const Family = require('../models/FamilyModel');
const Caregiver = require('../models/CaregiverModel');
const Disease = require('../models/DiseaseModel');

const getPatients = async (req, res) => {
    try {
        // Populate caregiver information when fetching patients
        const patients = await Patient.find()
            .populate({
                path: 'caregiver',
                select: 'name email mobileno address city' 
            });
        res.json(patients);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

const getPatientById = async (req, res) => {
    try {
        const { id } = req.params;
        const patient = await Patient
            .findById(id)
            .populate({
                path: 'caregiver',
                select: 'name email contact city' // Only select needed fields
            })

        if (!patient) {
            return res.status(404).json({ msg: "Patient not found" });
        }

        res.json(patient);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

const setCaregiver = async (req, res) => {
    try {
        const { patientid, caregiverid } = req.body;
        const patient = await Patient.findById(patientid);
        const caregiver = await Caregiver.findById(caregiverid);
        if (!patient || !caregiver) {
            return res.status(400).json({ msg: "Patient or caregiver not found" });
        }
        patient.caregiver = caregiver;
        await patient.save();
        res.json(patient);
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
}

const setDisease = async (req, res) => {
    try {
        const { patientid, diseaseid } = req.body;
        const patient = await Patient.findById(patientid);
        const disease = await Disease.findById(diseaseid);
        if (!patient || !disease) {
            return res.status(400).json({ msg: "Patient or disease not found" });
        }
        patient.disease = disease;
        await patient.save();
        res.json(patient);
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
}

const createDisease = async (req, res) => {
    try {
        const { name, symptoms, treatments } = req.body;
        if (!name || !symptoms || !treatments) {
            return res.status(400).json({ msg: "Please enter all fields" });
        }
        const newDisease = new Disease({
            name,
            symptoms,
            treatments
        });
        const savedDisease = await newDisease.save();
        res.json(savedDisease);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

const updatePatientCaregiver = async (req, res) => {
    try {
        const { patientId, caregiverId } = req.body;

        // Update patient with caregiver reference
        const updatedPatient = await Patient.findByIdAndUpdate(
            patientId,
            { caregiver: caregiverId },
            { new: true }
        );

        // Add patient to caregiver's patients array
        await Caregiver.findByIdAndUpdate(
            caregiverId,
            { $addToSet: { patients: patientId } }, // $addToSet prevents duplicates
            { new: true }
        );

        res.json(updatedPatient);
    } catch (error) {
        console.error('Error updating patient caregiver:', error);
        res.status(500).json({
            error: error.message,
            msg: "Failed to update patient caregiver"
        });
    }
};

module.exports = {
    getPatients,
    getPatientById,
    setCaregiver,
    setDisease,
    createDisease,
    updatePatientCaregiver
};

