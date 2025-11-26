const mongoose = require("mongoose");

const ItemBatchSchema = mongoose.Schema(
  {
    item_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Item",
      required: true,
    },
    batch_no: {
      type: String,
      required: true,
    },
    expiry_date: {
      type: Date,
      required: true,
    },
    unit_received: {
      type: String,
      required: true,
    },
    qty_received: {
      type: Number,
      required: true,
    },
    qty_sold: {
      type: Number,
      default: 0,
    },
    base_qty: {
      type: Number,
      required: true,
    },
    cost_price_per_base: {
      type: Number,
      required: true,
    },
    selling_price_per_base: {
      type: Number,
      required: true,
    },
    qty_sold: {
      type: Number,
      default: 0,
    },
    grn_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "GRN",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("ItemBatch", ItemBatchSchema);
