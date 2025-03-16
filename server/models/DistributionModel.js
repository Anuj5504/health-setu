const mongoose = require("mongoose");

const distributionSchema = new mongoose.Schema({
    requestingAdminId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'HealthproModel',
        required: true
    },
    sourceAdminId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'HealthproModel',
        required: true
    },
    items: [{
        itemName: {
            type: String,
            required: true
        },
        quantity: {
            type: Number,
            required: true,
            min: 1
        },
        currentStock: Number,
        reorderLevel: Number,
        priority: {
            type: String,
            enum: ['high', 'medium', 'low'],
            required: true
        }
    }],
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending'
    },
    aiPriority: {
        score: Number,
        reason: String
    }
}, {
    timestamps: true
});

module.exports = mongoose.model("Distribution", distributionSchema); 