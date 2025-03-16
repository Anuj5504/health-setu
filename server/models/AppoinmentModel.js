const mongoose = require('mongoose');

const AppoinmentSchema = new mongoose.Schema({
    patientId: String,
    mainSymptoms: String,
    report: String,
    appointmentDate: String,
    appointmentTime: String,
    status: {
        type: String,
        enum: ['scheduled', 'completed', 'cancelled'],
        default: 'scheduled'
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('AppointmentModel', AppoinmentSchema);