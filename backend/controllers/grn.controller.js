const asyncHandler = require("express-async-handler");
const mongoose = require("mongoose");
const GRN = require("../models/grn.model");
const ItemBatch = require("../models/item_batch.model");
const Inventory = require("../models/inventory.model");
const ItemUnit = require("../models/item_unit.model");
const Counter = require("../models/counter.model");

const getNextGRNSequence = async () => {
  const ret = await Counter.findByIdAndUpdate(
    "grn_no",
    { $inc: { seq: 1 } },
    { new: true, upsert: true }
  );
  return ret.seq;
};

const createGRN = asyncHandler(async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { supplier_id, recorded_by, items, remarks } = req.body;
    const seq = await getNextGRNSequence();
    const grn_no = `GRN-${seq.toString().padStart(6, "0")}`;

    const grn = await GRN.create(
      [
        {
          grn_no,
          supplier_id,
          recorded_by,
          items,
          remarks,
        },
      ],
      { session }
    );

    for (const item of items) {
      const {
        item_id,
        batch_no,
        expiry_date,
        unit_received,
        qty_received,
        cost_price_per_base,
        selling_price_per_base,
        total_value,
      } = item;

      const unit = await ItemUnit.findOne({
        item_id,
        unit_name: unit_received,
      }).session(session);

      if (!unit) {
        throw new Error(
          `Unit '${unit_received}' not defined for item ID ${item_id}. Please define the unit first.`
        );
      }

      const base_qty = qty_received * unit.to_base_qty;
      const batch = await ItemBatch.create(
        [
          {
            item_id,
            batch_no,
            expiry_date: new Date(expiry_date),
            unit_received,
            qty_received,
            base_qty,
            cost_price_per_base,
            selling_price_per_base,
            total_value,
            grn_id: grn[0]._id,
            qty_sold: 0,
          },
        ],
        { session }
      );

      await Inventory.findOneAndUpdate(
        { item_id: item_id },
        {
          $inc: { stock_quantity: base_qty },
          $set: {
            last_cost_price: cost_price_per_base,
            last_grn_id: grn[0]._id,
          },
        },
        { upsert: true, session, new: true }
      );
    }

    await session.commitTransaction();
    session.endSession();
    res.status(201).json({
      success: true,
      message: "GRN created successfully",
      data: {
        grn_id: grn[0]._id,
        grn_no: grn[0].grn_no,
      },
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.error("GRN Creation Error:", error);

    if (error.message.includes("Unit")) {
      res.status(400);
      throw new Error(error.message);
    }
    if (error.name === "ValidationError") {
      res.status(400);
      throw new Error(`Validation Error: ${error.message}`);
    }
    if (error.code === 11000) {
      res.status(409);
      throw new Error("Duplicate GRN number or batch detected.");
    }

    res.status(500);
    throw new Error(
      "Internal server error during GRN creation. Changes have been rolled back."
    );
  }
});

const getAllGRNs = asyncHandler(async (req, res) => {
  try {
    const filter = {};
    if (req.query.supplier_id) filter.supplier_id = req.query.supplier_id;
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

    const grns = await GRN.find(filter)
      .populate("supplier_id", "name")
      .populate("recorded_by", "username")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: grns.length,
      data: grns,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "error occured while fetching GRN records.",
    });
  }
});

const getGRNById = asyncHandler(async (req, res) => {
  const id = req.params.id;
  if (!id) {
    return res.status(400).json({
      success: false,
      message: "id can not be extracted from the params",
    });
  }
  const grn = await GRN.findById(req.params.id)
    .populate("supplier_id", "name contact_person phone")
    .populate("recorded_by", "username email")
    .populate("items.item_id", "name sku");

  if (!grn) {
    res.status(404);
    throw new Error("GRN not found");
  }

  const batches = await ItemBatch.find({ grn_id: grn._id }).select(
    "batch_no expiry_date qty_received unit_received base_qty"
  );

  res.json({
    success: true,
    data: {
      ...grn.toObject(),
      related_batches: batches,
    },
  });
});

module.exports = {
  createGRN,
  getAllGRNs,
  getGRNById,
};
