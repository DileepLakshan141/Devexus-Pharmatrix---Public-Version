const mongoose = require('mongoose')
const InventorySchema = mongoose.Schema({
  item_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Item",
    required: true,
    unique: true
  },
  stock_quantity: {
    type: Number,
    default: 0,
    required: true
  },
  last_cost_price: Number,
  last_selling_price: Number,
  last_grn_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "GRN"
  }
}, { timestamps: true });

module.exports = mongoose.model("Inventory", InventorySchema);
