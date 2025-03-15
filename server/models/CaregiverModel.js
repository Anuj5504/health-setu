const mongoose = require('mongoose');

const CaregiverSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true
    },
    mobileno:{
        type: Number,
    },
    address:{
        type: String,
    },
    city:{
        type: String,
    },
    password:{
        type: String,
        required: true
    },
    patients: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'PatientModel'
    }]
});

module.exports = mongoose.model('CaregiverModel', CaregiverSchema);
