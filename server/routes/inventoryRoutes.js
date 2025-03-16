const express = require("express");
const { getAllItems, getItemById, createItem, updateItem, deleteItem, getLowStockItems } = require("../controllers/InventoryControllers");
const router = express.Router();

router.post("/", getAllItems);
router.get("/:id", getItemById);
router.post("/create", createItem);
router.put("/update/:id", updateItem);
router.delete("/delete/:id", deleteItem);
router.post("/low-stock", getLowStockItems);

module.exports = router;