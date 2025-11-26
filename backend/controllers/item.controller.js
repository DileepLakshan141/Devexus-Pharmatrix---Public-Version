const asyncHandler = require("express-async-handler");
const Item = require("../models/item.model");
const mongoose = require("mongoose");
const expressAsyncHandler = require("express-async-handler");

// CREATE
const createItem = async (req, res) => {
  try {
    const itemData = {
      ...req.body,
      supplier: req.body.supplierId || req.body.supplier,
    };

    delete itemData.supplierId;

    if (
      itemData.supplier &&
      !mongoose.Types.ObjectId.isValid(itemData.supplier)
    ) {
      res.status(400);
      throw new Error("Invalid supplier ID format");
    }

    const item = await Item.create(itemData);
    res.status(201).json(item);
  } catch (err) {
    if (err.name === "ValidationError" || err.name === "CastError") {
      res.status(400);
    } else if (err.code === 11000) {
      res.status(409);
      err.message = "SKU or barcode already exists";
    }
  }
};

// READ ALL
const getAllItems = asyncHandler(async (req, res) => {
  const items = await Item.find().populate("supplier");
  res.json(items);
});

// READ ONE
const getItemById = asyncHandler(async (req, res) => {
  const item = await Item.findById(req.params.id).populate("supplier");
  if (!item) return res.status(404).json({ message: "Item not found" });
  res.json(item);
});

// UPDATE
const updateItem = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const {
    name,
    sku,
    barcode,
    manufacturer,
    category,
    supplier,
    reorder_level,
    available_in_pos,
  } = req.body;

  const item = await Item.findById(id);
  if (!item) {
    return res.status(404).json({ message: "Item not found" });
  }

  if (name !== undefined) item.name = name;
  if (sku !== undefined) item.sku = sku;
  if (barcode !== undefined) item.barcode = barcode;
  if (manufacturer !== undefined) item.manufacturer = manufacturer;
  if (category !== undefined) item.category = category;
  if (supplier !== undefined) item.supplier = supplier;
  if (reorder_level !== undefined) item.reorder_level = reorder_level;
  if (available_in_pos !== undefined) item.available_in_pos = available_in_pos;

  const updatedItem = await item.save();

  res.status(200).json(updatedItem);
});

// DELETE
const deleteItem = asyncHandler(async (req, res) => {
  const item = await Item.findById(req.params.id);
  if (!item) return res.status(404).json({ message: "Item not found" });

  await item.deleteOne();
  res.json({ message: "Item deleted" });
});

// TOGGLE POS AVAILABILITY
const toggleItemPOS = asyncHandler(async (req, res) => {
  const item = await Item.findById(req.params.id);
  if (!item) return res.status(404).json({ message: "Item not found" });

  item.is_available_in_pos = !item.is_available_in_pos;
  await item.save();
  res.json({
    message: `POS availability toggled`,
    is_available_in_pos: item.is_available_in_pos,
  });
});

// GET ITEMS BY SUPPLIER
const getItemsBySupplier = expressAsyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ message: "supplier id is missing" });
    }
    const response = await Item.find({ supplier: id });
    if (response) {
      return res.status(200).json(response);
    } else {
      return res.status(400).json({ message: "no items found" });
    }
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
});

module.exports = {
  createItem,
  getAllItems,
  getItemById,
  updateItem,
  deleteItem,
  toggleItemPOS,
  getItemsBySupplier,
};
