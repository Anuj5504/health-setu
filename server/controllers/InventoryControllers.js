const Inventory = require('../models/InventoryModels');

const getAllItems = async (req, res) => {
    try {
        const { adminId } = req.body;
        if (!adminId) {
            return res.status(400).json({ message: 'Admin ID is required' });
        }
        const items = await Inventory.find({ adminId });
        res.status(200).json(items);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getItemById = async (req, res) => {
    try {
        const item = await Inventory.findById(req.params.id);
        if (!item) {
            return res.status(404).json({ message: 'Item not found' });
        }
        res.status(200).json(item);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const createItem = async (req, res) => {
    try {
        const item = new Inventory(req.body);
        const newItem = await item.save();
        res.status(201).json(newItem);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const updateItem = async (req, res) => {
    try {
        const { adminId, ...updateData } = req.body;
        const updatedItem = await Inventory.findOneAndUpdate(
            { _id: req.params.id, adminId },
            updateData,
            { new: true }
        );
        if (!updatedItem) {
            return res.status(404).json({ message: 'Item not found or unauthorized' });
        }
        res.status(200).json(updatedItem);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const deleteItem = async (req, res) => {
    try {
        const { adminId } = req.body;
        const item = await Inventory.findOneAndDelete({
            _id: req.params.id,
            adminId
        });
        if (!item) {
            return res.status(404).json({ message: 'Item not found or unauthorized' });
        }
        res.status(200).json({ message: 'Item deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getLowStockItems = async (req, res) => {
    try {
        const { adminId } = req.body;
        if (!adminId) {
            return res.status(400).json({ message: 'Admin ID is required' });
        }
        const lowStockItems = await Inventory.find({
            adminId,
            $expr: { $lt: ["$quantity", "$reorderLevel"] }
        });
        res.status(200).json(lowStockItems);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    getAllItems,
    getItemById,
    createItem,
    updateItem,
    deleteItem,
    getLowStockItems,
}; 