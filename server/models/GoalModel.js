const mongoose = require('mongoose');

const GoalSchema = new mongoose.Schema({
    patient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'PatientModel',
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    todos: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'TodosModel'
    }]
});

module.exports = mongoose.model('GoalModel', GoalSchema); 