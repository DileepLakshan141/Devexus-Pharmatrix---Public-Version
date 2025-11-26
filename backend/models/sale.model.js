const mongoose = require("mongoose");

const SaleSchema = mongoose.Schema(
  {
    invoice_no: {
      type: String,
      required: true,
      unique: true,
    },
    customer_name: { type: String, default: "walk-in" },
    sub_total: {
      type: Number,
      required: true,
    },
    total_payable: {
      type: Number,
      required: true,
    },
    discount: {
      type: Number,
      default: 0,
    },
    payment_method: {
      type: String,
      enum: ["cash", "card", "scan", "insurance", "credit"],
      default: "cash",
    },
    sold_items: [
      {
        item_batch_id: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "ItemBatch",
          required: true,
        },
        qty: {
          type: Number,
          required: true,
          min: 1,
        },
        base_unit_price: {
          type: Number,
          required: true,
          min: 0,
        },
        unit_name: {
          type: String,
          required: true,
        },
        unit_qty: {
          type: Number,
          required: true,
        },
      },
    ],
    cashier: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Client",
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Sale", SaleSchema);
