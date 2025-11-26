const mongoose = require("mongoose");

const GRNSchema = mongoose.Schema(
  {
    grn_no: {
      type: String,
      required: true,
      unique: true,
    },
    supplier_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Supplier",
      required: true,
    },
    items: [
      {
        item_id: { type: mongoose.Schema.Types.ObjectId, ref: "Item" },
        batch_no: String,
        expiry_date: Date,
        unit_received: String,
        qty_received: Number,
        cost_price_per_base: Number,
        selling_price_per_base: Number,
        total_value: Number,
      },
    ],
    recorded_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Client",
      required: true,
    },
    remarks: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("GRN", GRNSchema);
