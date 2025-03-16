const mongoose = require("mongoose");

const inventorySchema = new mongoose.Schema({
  itemName: {
    type: String,
    required: true,
    trim: true
  },
  category: {
    type: String,
    enum: ["Medicine", "Equipment", "Consumables", "Other"],
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 0
  },
  unit: {
    type: String,
    enum: ["pieces", "ml", "mg", "bottles", "packs"],
    required: true
  },
  expiryDate: {
    type: Date,
    required: true,
  },
  reorderLevel: {
    type: Number,
    required: true,
    default: 10
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  }
});

const Inventory = mongoose.model("Inventory", inventorySchema);

module.exports = Inventory;
