const mongoose = require("mongoose");

const PatientSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    city: {
        type: String,
    },
    password: {
        type: String,
        required: true
    },
    mobileno: {
        type: Number,
    },
    address: {
        type: String,
    },

    // family: {
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: 'FamilyModel',
    // },
    familyRole: {
        type: String,
        // required: true
    },
    caregiver: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'CaregiverModel'
    },
    disease: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'DiseaseModel'
    },
    goals: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'GoalModel'
    },
});

module.exports = mongoose.model("PatientModel", PatientSchema);