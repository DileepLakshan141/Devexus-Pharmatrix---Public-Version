const asyncHandler = require("express-async-handler");
const ItemUnit = require("../models/item_unit.model");
const mongoose = require("mongoose");

// CREATE
const createItemUnit = asyncHandler(async (req, res) => {
  const { item_id, unit_name, quantity_in_parent } = req.body;
  if (!item_id || !unit_name)
    return res.status(400).json({ message: "Item ID and unit name required" });
  try {
    const unit = await ItemUnit.create({
      item_id,
      unit_name,
      to_base_qty: parseFloat(quantity_in_parent),
    });
    res.status(201).json(unit);
  } catch (error) {
    console.log(error);
  }
});

// GET BY ITEM
const getUnitsByItem = asyncHandler(async (req, res) => {
  const itemId = req.params.id?.trim();
  if (!mongoose.Types.ObjectId.isValid(itemId)) {
    return res
      .status(400)
      .json({ message: "Invalid item_id", received: itemId });
  }
  const units = await ItemUnit.find({ item_id: itemId });
  res.json(units);
});

module.exports = { createItemUnit, getUnitsByItem };
