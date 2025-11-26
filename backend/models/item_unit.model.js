const mongoose = require("mongoose");

const ItemUnitSchema = mongoose.Schema({
  item_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Item",
    required: true,
  },
  unit_name: { type: String, required: true },
  to_base_qty: { type: Number, required: true },
});

module.exports = mongoose.model("ItemUnit", ItemUnitSchema);
