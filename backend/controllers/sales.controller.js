const asyncHandler = require("express-async-handler");
const mongoose = require("mongoose");
const Sale = require("../models/sale.model");
const SaleItem = require("../models/sale_item.model");
const ItemBatch = require("../models/item_batch.model");
const Inventory = require("../models/inventory.model");
const Counter = require("../models/counter.model");

const getNextInvoiceSequence = async () => {
  const ret = await Counter.findByIdAndUpdate(
    "invoice_no",
    { $inc: { seq: 1 } },
    { new: true, upsert: true }
  );
  return ret.seq;
};

// @desc    Create a new sale with stock deduction
// @route   POST /api/sales
// @access  Private
const createSale = asyncHandler(async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const {
      customer_name,
      payment_method,
      cashier,
      items,
      sub_total,
      total_payable,
      discount = 0,
    } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      res.status(400);
      throw new Error("Sale items are required");
    }

    const seq = await getNextInvoiceSequence();
    const invoice_no = `INV-${seq.toString().padStart(7, "0")}`;

    const soldItems = [];
    for (const batchSelection of items) {
      const { batch_id, quantity, sell_price, unit_name, selectedUnit } =
        batchSelection;

      if (
        !batch_id ||
        !quantity ||
        quantity <= 0 ||
        !sell_price ||
        sell_price <= 0
      ) {
        throw new Error("Invalid batch selection data");
      }

      const requiredQty = quantity * selectedUnit;

      const batch = await ItemBatch.findOne({
        _id: batch_id,
        expiry_date: { $gt: new Date() },
        $expr: {
          $gte: [{ $subtract: ["$base_qty", "$qty_sold"] }, requiredQty],
        },
      }).session(session);

      if (!batch) {
        console.log(`${quantity * selectedUnit} ${quantity}`);
        throw new Error(`Insufficient stock in selected batch: ${id}`);
      }

      batch.qty_sold += quantity * selectedUnit;
      await batch.save({ session });

      await Inventory.findOneAndUpdate(
        { item_id: batch.item_id },
        { $inc: { stock_quantity: -(quantity * selectedUnit) } },
        { session }
      );

      soldItems.push({
        item_batch_id: batch_id,
        qty: quantity,
        base_unit_price: sell_price,
        unit_name: unit_name || batch.unit_name,
        unit_qty: selectedUnit,
      });
    }

    const sale = await Sale.create(
      [
        {
          invoice_no,
          customer_name: customer_name || "walk-in",
          sub_total,
          total_payable,
          discount,
          payment_method: payment_method || "cash",
          cashier: cashier || req.user._id,
          sold_items: soldItems,
        },
      ],
      { session }
    );

    await session.commitTransaction();
    session.endSession();

    res.status(201).json({
      success: true,
      message: "Sale completed successfully",
      data: sale[0],
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    res.status(500).json({
      message: "Sale record creation failed",
      error: error.message,
    });
  }
});

// @desc    Get all sales with filters
// @route   GET /api/sales
// @access  Private
const getAllSales = asyncHandler(async (req, res) => {
  const filter = {};

  if (req.query.startDate || req.query.endDate) {
    filter.createdAt = {};
    if (req.query.startDate)
      filter.createdAt.$gte = new Date(req.query.startDate);
    if (req.query.endDate) {
      const endDate = new Date(req.query.endDate);
      endDate.setHours(23, 59, 59, 999);
      filter.createdAt.$lte = endDate;
    }
  }

  if (req.query.cashier) filter.cashier = req.query.cashier;

  const sales = await Sale.find(filter)
    .populate("cashier", "username")
    .sort({ createdAt: -1 });

  res.json({ success: true, count: sales.length, data: sales });
});

// @desc    Get sale by ID with details
// @route   GET /api/sales/:id
// @access  Private
const getSaleById = asyncHandler(async (req, res) => {
  const sale = await Sale.findById(req.params.id)
    .populate("cashier", "username email")
    .populate({
      path: "sold_items.item_batch_id",
      select: "batch_no expiry_date cost_price_per_base selling_price_per_base",
      populate: {
        path: "item_id",
        select: "name sku manufacturer description",
      },
    });

  if (!sale) {
    res.status(404);
    throw new Error("Sale not found");
  }

  const saleItems = await SaleItem.find({ sale_id: sale._id })
    .populate("item_batch_id", "batch_no expiry_date")
    .populate({
      path: "item_batch_id",
      populate: { path: "item_id", select: "name sku" },
    });

  res.json({
    success: true,
    data: {
      ...sale.toObject(),
      items: saleItems,
    },
  });
});

// @desc    Get sales report
// @route   GET /api/sales/report
// @access  Private
const getSalesReport = asyncHandler(async (req, res) => {
  const { startDate, endDate } = req.query;

  if (!startDate || !endDate) {
    res.status(400);
    throw new Error("Start date and end date are required");
  }

  const start = new Date(startDate);
  const end = new Date(endDate);
  end.setHours(23, 59, 59, 999);

  const report = await Sale.aggregate([
    {
      $match: {
        createdAt: { $gte: start, $lte: end },
      },
    },
    {
      $group: {
        _id: {
          date: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          payment_method: "$payment_method",
        },
        totalSales: { $sum: "$total" },
        count: { $sum: 1 },
      },
    },
    {
      $sort: { "_id.date": 1 },
    },
  ]);

  res.json({ success: true, data: report });
});

module.exports = {
  createSale,
  getAllSales,
  getSaleById,
  getSalesReport,
};
