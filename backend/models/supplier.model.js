const mongoose = require("mongoose");

const SupplierSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    contact_person: {
      type: String,
    },
    email: {
      type: String,
    },
    phone: {
      type: String,
    },
    address: {
      type: String,
    },
    status: { type: String, enum: ["active", "inactive"], default: "active" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Supplier", SupplierSchema);
