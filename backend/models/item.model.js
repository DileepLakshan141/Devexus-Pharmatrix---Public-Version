const mongoose = require("mongoose");

const ItemSchema = mongoose.Schema(
  {
    name: { type: String, required: true },
    sku: { type: String, required: true, unique: true },
    barcode: { type: String, unique: true, sparse: true },
    category: { type: String },
    manufacturer: { type: String },
    reorder_level: { type: Number, default: 0 },
    available_in_pos: { type: Boolean, default: true },
    supplier: { type: mongoose.Schema.Types.ObjectId, ref: "Supplier" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Item", ItemSchema);
