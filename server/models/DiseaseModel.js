const mongoose = require('mongoose');

const DiseaseSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    symptoms: [{
        type: String,
        required: true
    }],
    treatments: [{
        type: String,
        required: true
    }]
});

module.exports = mongoose.model('DiseaseModel', DiseaseSchema);