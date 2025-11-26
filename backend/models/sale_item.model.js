const mongoose = require("mongoose");

const SaleItemSchema = mongoose.Schema({
  sale_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Sale",
  },
  item_batch_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "ItemBatch",
  },
  qty: {
    type: Number,
    required: true,
  },
  unit_price: {
    type: Number,
    required: true,
  },
});

module.exports = mongoose.model("SaleItem", SaleItemSchema);
