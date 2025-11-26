const expressAsyncHandler = require("express-async-handler");
const itemBatchModel = require("../models/item_batch.model");

// get items by the barcode
const getItemByBarcode = expressAsyncHandler(async (req, res) => {
  const { barcode } = req.params;
  if (!barcode)
    return res.status(400).json({ message: "barcode is required!" });

  const results = await itemBatchModel
    .find({})
    .populate({ path: "item_id", match: { barcode: barcode } })
    .exec();

  const filteredResults = results.filter(
    (batch) => batch.item_id !== null && batch.qty_sold < batch.base_qty
  );
  if (!filteredResults || filteredResults.length < 1) {
    return res
      .status(400)
      .json({ message: "product search failed! try again!" });
  } else {
    return res.status(200).json(filteredResults);
  }
});

// get items by the item name
const getItemByItemName = expressAsyncHandler(async (req, res) => {
  const { searchTerm } = req.params;
  if (!searchTerm)
    return res.status(400).json({ message: "search term is required!" });
  const safeTerm = searchTerm.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

  const results = await itemBatchModel.find({}).populate("item_id").exec();

  const filteredResults = results.filter(
    (batch) =>
      batch.item_id &&
      batch.item_id.name &&
      batch.qty_sold < batch.base_qty &&
      new RegExp(safeTerm, "i").test(batch.item_id.name)
  );

  if (!filteredResults || filteredResults.length < 1) {
    return res
      .status(400)
      .json({ message: "product search failed! try again!" });
  } else {
    return res.status(200).json(filteredResults);
  }
});

module.exports = {
  getItemByBarcode,
  getItemByItemName,
};
