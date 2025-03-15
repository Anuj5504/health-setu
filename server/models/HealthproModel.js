const mongoose = require('mongoose');

const HealthproSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true
    },
    password:{
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
    family: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'FamilyModel'
    }]
});

module.exports = mongoose.model('HealthproModel', HealthproSchema);