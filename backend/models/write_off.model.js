const mongoose = require("mongoose");

const WriteOffSchema = mongoose.Schema(
  {
    batch_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ItemBatch",
      required: true,
    },
    reason: {
      type: String,
      required: true,
      enum: ["expired", "damaged", "other"],
    },
    quantity: {
      type: Number,
      required: true,
    },
    recorded_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Client",
      required: true,
    },
    notes: { type: String },
    cost_price_per_base: {
      type: Number,
      required: true,
    },
    total_loss: {
      type: Number,
      required: true,
    },
    grn_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "GRN",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("WriteOff", WriteOffSchema);
