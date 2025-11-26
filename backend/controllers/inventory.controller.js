const asyncHandler = require("express-async-handler");
const mongoose = require("mongoose");
const Inventory = require("../models/inventory.model");
const ItemBatch = require("../models/item_batch.model");
const Item = require("../models/item.model");
const WriteOff = require("../models/write_off.model");

// @desc    Get current inventory with filters
// @route   GET /api/inventory
// @access  Private
const getInventory = asyncHandler(async (req, res) => {
  const filter = {};

  if (req.query.item_id) {
    if (!mongoose.Types.ObjectId.isValid(req.query.item_id)) {
      res.status(400);
      throw new Error("Invalid item ID format");
    }
    filter.item_id = req.query.item_id;
  }

  if (req.query.lowStock === "true") {
    const lowStockItems = await Inventory.find({})
      .populate("item_id", "name reorder_level")
      .then((inventories) =>
        inventories.filter(
          (inv) => inv.stock_quantity <= inv.item_id.reorder_level
        )
      );
    return res.json({ success: true, data: lowStockItems });
  }

  const inventory = await Inventory.find(filter)
    .populate("item_id", "name sku reorder_level barcode manufacturer")
    .populate("last_grn_id", "grn_no")
    .sort({ "item_id.name": 1 });

  res.json({ success: true, data: inventory });
});

// @desc    Get batches for a specific item
// @route   GET /api/items/:itemId/batches
// @access  Private
const getBatchesByItem = asyncHandler(async (req, res) => {
  const { itemId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(itemId)) {
    res.status(400);
    throw new Error("Invalid item ID format");
  }

  const batches = await ItemBatch.find({
    item_id: itemId,
    $expr: { $lt: ["$qty_sold", "$qty_received"] },
  })
    .populate("item_id", "name sku")
    .sort({ expiry_date: 1 });

  res.json({ success: true, data: batches });
});

// @desc    Get low stock alerts
// @route   GET /api/inventory/alerts/low-stock
// @access  Private
const getLowStockAlerts = asyncHandler(async (req, res) => {
  const lowStockItems = await Inventory.aggregate([
    {
      $lookup: {
        from: "items",
        localField: "item_id",
        foreignField: "_id",
        as: "item",
      },
    },
    { $unwind: "$item" },
    {
      $match: {
        $expr: { $lte: ["$stock_quantity", "$item.reorder_level"] },
      },
    },
    {
      $project: {
        item_id: 1,
        stock_quantity: 1,
        "item.name": 1,
        "item.sku": 1,
        "item.reorder_level": 1,
      },
    },
  ]);

  res.json({ success: true, data: lowStockItems });
});

// @desc    Get expiry alerts
// @route   GET /api/inventory/alerts/expiry
// @access  Private
const getExpiryAlerts = asyncHandler(async (req, res) => {
  const days = parseInt(req.query.days) || 30;
  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);
  const thresholdDate = new Date(today);
  thresholdDate.setDate(thresholdDate.getDate() + days);

  const expiringBatches = await ItemBatch.find({
    expiry_date: { $gte: today, $lte: thresholdDate },
    $expr: { $lt: ["$qty_sold", "$base_qty"] },
  })
    .populate("item_id", "name sku")
    .sort({ expiry_date: 1 });

  res.json({ success: true, data: expiringBatches });
});

// @desc    Write off expired stock (Scheduled task)
// @route   POST /api/inventory/write-off-expired
// @access  Private/System
const writeOffExpiredStock = asyncHandler(async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);

    const expiredBatches = await ItemBatch.find({
      expiry_date: { $lte: today },
      $expr: { $lt: ["$qty_sold", "$base_qty"] },
    })
      .populate("item_id")
      .session(session);

    if (expiredBatches.length === 0) {
      await session.commitTransaction();
      session.endSession();
      return res.json({
        success: true,
        message: "No expired stock found",
        data: [],
      });
    }

    const writeOffResults = [];

    for (const batch of expiredBatches) {
      const remainingQty = batch.base_qty - batch.qty_sold;
      const totalLoss = remainingQty * batch.cost_price_per_base;

      const writeOff = await WriteOff.create(
        [
          {
            batch_id: batch._id,
            item_id: batch.item_id._id,
            reason: "expired",
            quantity: remainingQty,
            recorded_by: req.user.id,
            notes: `Automated write-off of expired batch ${
              batch.batch_no
            }. Expired on ${batch.expiry_date.toDateString()}`,
            cost_price_per_base: batch.cost_price_per_base,
            total_loss: totalLoss,
            grn_id: batch.grn_id,
          },
        ],
        { session }
      );

      batch.qty_sold = batch.base_qty;
      await batch.save({ session });

      await Inventory.findOneAndUpdate(
        { item_id: batch.item_id._id },
        { $inc: { stock_quantity: -remainingQty } },
        { session }
      );

      writeOffResults.push({
        batch_id: batch._id,
        batch_no: batch.batch_no,
        item_name: batch.item_id.name,
        quantity: remainingQty,
        total_loss: totalLoss,
        writeOff_id: writeOff[0]._id,
        expiry_date: batch.expiry_date,
      });
    }

    await session.commitTransaction();
    session.endSession();

    const totalLoss = writeOffResults.reduce(
      (sum, item) => sum + item.total_loss,
      0
    );

    res.json({
      success: true,
      message: `Successfully wrote off ${expiredBatches.length} expired batches`,
      data: {
        batches_processed: expiredBatches.length,
        total_items_written_off: writeOffResults.reduce(
          (sum, item) => sum + item.quantity,
          0
        ),
        total_financial_loss: totalLoss,
        details: writeOffResults,
      },
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.error("Write-Off Error:", error);
    res.status(500);
    throw new Error("Failed to write off expired stock: " + error.message);
  }
});

module.exports = {
  getInventory,
  getBatchesByItem,
  getLowStockAlerts,
  getExpiryAlerts,
  writeOffExpiredStock,
};
