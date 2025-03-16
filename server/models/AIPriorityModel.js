const mongoose = require('mongoose');

const aiPrioritySchema = new mongoose.Schema({
    adminId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Healthpro',
        required: true
    },
    itemScores: {
        type: Map,
        of: Number
    },
    overallScore: {
        type: Number,
        required: true
    },
    recommendation: {
        type: String
    },
    lastUpdated: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

aiPrioritySchema.index({ adminId: 1, lastUpdated: -1 });

module.exports = mongoose.model('AIPriority', aiPrioritySchema); 