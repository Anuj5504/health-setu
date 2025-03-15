const mongoose = require('mongoose');

const AppoinmentSchema = new mongoose.Schema({
    patientId: String,
    mainSymptoms: String,
    report: String,
    appointmentDate: String,
});

module.exports = mongoose.model('AppointmentModel', AppoinmentSchema);