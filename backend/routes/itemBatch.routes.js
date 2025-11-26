const express = require("express");
const router = express.Router();
const { getAllBatches } = require("../controllers/itemBatch.controller");

router.get("/", getAllBatches);
// router.get("/item/:itemId", getBatchesByItem);
// router.get("/expiring/:days", getExpiringBatches);
// router.delete("/:id", deleteBatch);

module.exports = router;
