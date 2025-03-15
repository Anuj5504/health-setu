const mongoose = require('mongoose');

const FamilySchema = new mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    houseid:{
        type: String,
        required: true
    },
    password:{
        type: String,
        required: true
    },
    members: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'PatientModel'
    }]
});

module.exports = mongoose.model('FamilyModel', FamilySchema);