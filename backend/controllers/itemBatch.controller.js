const asyncHandler = require("express-async-handler");
const ItemBatch = require("../models/item_batch.model");

// CREATE
const createBatch = asyncHandler(async (req, res) => {
  const {
    item_id,
    batch_no,
    expiry_date,
    stock,
    cost_price,
    selling_price,
    grn_id,
  } = req.body;
  const batch = await ItemBatch.create({
    item_id,
    batch_no,
    expiry_date,
    stock,
    cost_price,
    selling_price,
    grn_id,
  });
  res.status(201).json(batch);
});

// UPDATE STOCK
const updateBatchStock = asyncHandler(async (req, res) => {
  const { batch_id, quantity } = req.body;
  const batch = await ItemBatch.findById(batch_id);
  if (!batch) return res.status(404).json({ message: "Batch not found" });

  batch.stock += quantity;
  await batch.save();
  res.json({ message: "Stock updated", stock: batch.stock });
});

// GET BATCHES FOR ITEM
const getBatchesForItem = asyncHandler(async (req, res) => {
  const batches = await ItemBatch.find({ item_id: req.params.item_id });
  res.json(batches);
});

// GET ALL BATCHES
const getAllBatches = asyncHandler(async (req, res) => {
  const response = await ItemBatch.find({}).populate([
    {
      path: "item_id",
      populate: {
        path: "supplier",
      },
    },
    { path: "grn_id", select: "grn_no" },
  ]);

  if (response) {
    return res
      .status(200)
      .json({ data: response, message: "all item batches fetched!" });
  } else {
    return res.status(404).json({ message: "error while retrieving batches!" });
  }
});

module.exports = {
  createBatch,
  updateBatchStock,
  getBatchesForItem,
  getAllBatches,
};
