const { populate } = require("../models/counter.model");
const Sales = require("../models/sale.model");
const WriteOff = require("../models/write_off.model");

const getSalesReport = async (req, res) => {
  try {
    const { startDate, endDate } = req.body;
    if (!startDate || !endDate)
      return res.status(400).json({
        success: false,
        message: "start date and end date are required",
      });

    const records = await Sales.aggregate([
      {
        $match: {
          createdAt: {
            $gte: new Date(startDate),
            $lte: new Date(endDate),
          },
        },
      },
    ]);

    if (records) {
      return res.status(200).json({
        success: true,
        data: records,
      });
    } else {
      return res.status(400).json({
        success: false,
        message: "Error occurred while retrieving the sales report!",
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const getWriteOffReport = async (req, res) => {
  try {
    const { startDate, endDate } = req.body;
    if (!startDate || !endDate) {
      return res.status(400).json({
        success: false,
        message: "start date and end date are required",
      });
    }
    const writeOffs = await WriteOff.find({
      createdAt: { $gte: startDate, $lte: endDate },
    })
      .populate({
        path: "batch_id",
        select: "batch_no expiry_date",
        populate: {
          path: "item_id",
          select: "name sku",
        },
      })
      .populate("recorded_by", "name email")
      .sort({ createdAt: 1 });

    if (writeOffs) {
      return res.status(200).json({
        success: true,
        data: writeOffs,
      });
    } else {
      return res.status(400).json({
        success: false,
        message: "Error occurred while retrieving writeoffs report!",
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
module.exports = {
  getSalesReport,
  getWriteOffReport,
};
