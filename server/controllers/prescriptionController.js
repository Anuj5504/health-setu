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

exports.getAllPrescription = async (req, res) => {
    try {
        const prescriptions = await Prescription.find({}).sort({ createdAt: -1 });
        const groupedForecast = {};

        // First, initialize the data structure for each unique medicine
        prescriptions.forEach((prescription) => {
            prescription.medicines.forEach((medicine) => {
                if (!medicine.name) return;
                const medicineName = medicine.name.trim();

                // Get prescription date details
                const prescriptionDate = new Date(prescription.createdAt);
                const year = prescriptionDate.getFullYear();
                const month = prescriptionDate.getMonth();

                if (!groupedForecast[medicineName]) {
                    // Initialize array for all months
                    groupedForecast[medicineName] = Array.from({ length: 12 }, (_, i) => ({
                        ds: `${year}-${String(i + 1).padStart(2, "0")}-01`,
                        yhat: 0
                    }));
                }

                // Calculate total medicine count
                const dosageCount = Object.values(medicine.dosage || {}).filter(Boolean).length;
                if (dosageCount === 0) return;

                let totalCount = dosageCount;
                const durationDays = parseInt(medicine.duration?.durationDays) || 0;
                if (durationDays === 0) return;

                // Calculate based on duration unit
                switch (medicine.duration?.durationUnit?.toLowerCase()) {
                    case 'day':
                    case 'day\'s':
                        totalCount *= durationDays;
                        break;
                    case 'alternate day':
                        totalCount *= Math.ceil(durationDays / 2);
                        break;
                    case 'week':
                    case 'week\'s':
                        totalCount *= (durationDays * 7);
                        break;
                    case 'month':
                    case 'month\'s':
                        totalCount *= (durationDays * 30);
                        break;
                    case 'sos':
                        totalCount = dosageCount;
                        break;
                    default:
                        return;
                }

                // Add to the corresponding month
                if (month >= 0 && month < 12) {
                    groupedForecast[medicineName][month].yhat += totalCount;
                }
            });
        });

        res.status(200).json(groupedForecast);
    } catch (error) {
        res.status(400).json({
            success: false,
            error: error.message
        });
    }
};

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