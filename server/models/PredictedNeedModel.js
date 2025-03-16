const mongoose = require("mongoose");

const predictedNeedSchema = new mongoose.Schema({
    adminId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'HealthproModel',
        required: true
    },
    itemName: {
        type: String,
        required: true
    },
    predictedQuantity: {
        type: Number,
        required: true
    },
    priority: {
        type: String,
        enum: ['high', 'medium', 'low'],
        default: 'medium'
    },
    status: {
        type: String,
        enum: ['pending', 'completed', 'cancelled'],
        default: 'pending'
    },
    predictedDate: {
        type: Date,
        required: true,
        validate: {
            validator: function(v) {
                return v instanceof Date && !isNaN(v) && v > new Date();
            },
            message: 'Predicted date must be a valid future date'
        }
    }
}, {
    timestamps: true
});

module.exports = mongoose.model("PredictedNeed", predictedNeedSchema); 