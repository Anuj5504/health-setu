const Prescription = require('../models/prescriptionModel');

// Create new prescription
exports.createPrescription = async (req, res) => {
    try {
        const prescription = new Prescription(req.body);
        await prescription.save();
        res.status(201).json({
            success: true,
            data: prescription
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            error: error.message
        });
    }
};

// Get all prescriptions for a doctor
exports.getDoctorPrescriptions = async (req, res) => {
    try {
        const prescriptions = await Prescription.find({ doctorId: req.user._id })
            .sort({ createdAt: -1 });
        res.status(200).json({
            success: true,
            data: prescriptions
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            error: error.message
        });
    }
};

// Get prescription by ID
exports.getPrescriptionById = async (req, res) => {
    try {
        const prescription = await Prescription.findById(req.params.id);
        if (!prescription) {
            return res.status(404).json({
                success: false,
                error: 'Prescription not found'
            });
        }
        res.status(200).json({
            success: true,
            data: prescription
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            error: error.message
        });
    }
};

// Update prescription PDF URL
exports.updatePrescriptionPDF = async (req, res) => {
    try {
        const { prescriptionId, pdfUrl } = req.body;
        const prescription = await Prescription.findOneAndUpdate(
            { prescriptionId },
            { pdfUrl },
            { new: true }
        );
        if (!prescription) {
            return res.status(404).json({
                success: false,
                error: 'Prescription not found'
            });
        }
        res.status(200).json({
            success: true,
            data: prescription
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            error: error.message
        });
    }
};

// Delete prescription
exports.deletePrescription = async (req, res) => {
    try {
        const prescription = await Prescription.findById(req.params.id);
        if (!prescription) {
            return res.status(404).json({
                success: false,
                error: 'Prescription not found'
            });
        }
        await prescription.remove();
        res.status(200).json({
            success: true,
            message: 'Prescription deleted successfully'
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            error: error.message
        });
    }
};

// Add this function to your existing controller
exports.getPatientPrescriptions = async (req, res) => {
    try {
        const prescriptions = await Prescription.find({ patientId: req.params.patientId })
            .sort({ createdAt: -1 });
        res.status(200).json({
            success: true,
            data: prescriptions
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            error: error.message
        });
    }
}; 