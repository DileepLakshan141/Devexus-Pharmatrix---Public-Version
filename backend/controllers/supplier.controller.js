const asyncHandler = require("express-async-handler");
const Supplier = require("../models/supplier.model");

// CREATE
const createSupplier = asyncHandler(async (req, res) => {
  const { name, contact_person, phone, email, address } = req.body;
  if (!name)
    return res.status(400).json({ message: "Supplier name is required" });

  const supplier = await Supplier.create({
    name,
    contact_person,
    phone,
    email,
    address,
  });
  res.status(201).json(supplier);
});

// READ ALL
const getAllSuppliers = asyncHandler(async (req, res) => {
  const suppliers = await Supplier.find().sort({ createdAt: -1 });
  res.json(suppliers);
});

// READ ONE
const getSupplierById = asyncHandler(async (req, res) => {
  const supplier = await Supplier.findById(req.params.id);
  if (!supplier) return res.status(404).json({ message: "Supplier not found" });
  res.json(supplier);
});

// UPDATE
const updateSupplier = asyncHandler(async (req, res) => {
  const supplier = await Supplier.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  if (!supplier) return res.status(404).json({ message: "Supplier not found" });
  res.json(supplier);
});

// DELETE
const deleteSupplier = asyncHandler(async (req, res) => {
  const result = await Supplier.findByIdAndDelete(req.params.id);
  if (!result) return res.status(404).json({ message: "Supplier not found" });
  res.json({ message: "Supplier deleted successfully" });
});

module.exports = {
  createSupplier,
  getAllSuppliers,
  getSupplierById,
  updateSupplier,
  deleteSupplier,
};
