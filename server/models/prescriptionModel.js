const mongoose = require('mongoose');

const prescriptionSchema = new mongoose.Schema({
    prescriptionId: {
        type: String,
        required: true,
        unique: true
    },
    doctorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    patientId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Patient',
        required: true
    },
    patientEmail: {
        type: String,
        required: true
    },
    patientDetails: {
        name: {
            type: String,
            // required: true
        },
        age: {
            type: String,
            // required: true
        },
        sex: String,
        contact: String,
        city: String
    },
    vitals: {
        weight: String,
        height: String,
        bmi: String,
        additionalInfo: String
    },
    diagnosis: {
        type: String,
        // required: true
    },
    investigationTest: String,
    medicines: [{
        name: {
            type: String,
            // required: true
        },
        dosage: {
            morning: Boolean,
            afternoon: Boolean,
            evening: Boolean,
            night: Boolean,
            beforeFood: Boolean,
            afterFood: Boolean
        },
        duration: {
            durationDays: String,
            durationUnit: String
        },
        advice: String
    }],
    remarks: String,
    followUp: Date,
    pdfUrl: String,
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Prescription', prescriptionSchema); 