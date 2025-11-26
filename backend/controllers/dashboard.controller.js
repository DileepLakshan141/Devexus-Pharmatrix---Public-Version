const asyncHandler = require("express-async-handler");
const Sale = require("../models/sale.model");
const Supplier = require("../models/supplier.model");
const Client = require("../models/client.model");
const Inventory = require("../models/inventory.model");
const ItemBatch = require("../models/item_batch.model");
const Item = require("../models/item.model");
const GRN = require("../models/grn.model");

// @desc    Get dashboard insights and counts
// @route   GET /api/dashboard
// @access  Private
const getDashboardInsights = asyncHandler(async (req, res) => {
  try {
    // Run all queries in parallel for maximum performance
    const [
      latestGRNs,
      latestSales,
      salesByPaymentMethod,
      totalSales,
      totalItems,
      totalSuppliers,
      totalClients,
      totalStockValue,
      lowStockItems,
      expiringBatches,
      recentSales,
      dailyRevenue,
    ] = await Promise.all([
      GRN.aggregate([
        { $sort: { createdAt: -1 } },

        { $limit: 5 },

        {
          $lookup: {
            from: "suppliers",
            localField: "supplier_id",
            foreignField: "_id",
            as: "supplier",
          },
        },

        { $unwind: "$supplier" },

        {
          $addFields: {
            total_value: { $sum: "$items.total_value" },
            supplier_name: "$supplier.name",
          },
        },

        {
          $project: {
            _id: 1,
            grn_no: 1,
            supplier_name: 1,
            total_value: 1,
            createdAt: 1,
          },
        },
      ]),

      Sale.aggregate([
        {
          $sort: { createdAt: -1 },
        },
        {
          $limit: 5,
        },
      ]),

      Sale.aggregate([
        {
          $group: {
            _id: "$payment_method",
            count: { $sum: 1 },
          },
        },
      ]),

      // 1. Total Sales Count & Revenue
      Sale.aggregate([
        {
          $group: {
            _id: null,
            count: { $sum: 1 },
            totalRevenue: { $sum: "$total" },
          },
        },
      ]),

      // 1.a
      Item.countDocuments(),

      // 2. Total Suppliers
      Supplier.countDocuments({ status: "active" }),

      // 3. Total Staff Members
      Client.countDocuments({ user_role: { $ne: 1 } }), // Adjust role check as needed

      // 4. Total Stock Value (Inventory value)
      ItemBatch.aggregate([
        {
          $addFields: {
            remaining_qty: { $subtract: ["$base_qty", "$qty_sold"] },
          },
        },
        {
          $project: {
            batch_value: {
              $multiply: ["$remaining_qty", "$cost_price_per_base"],
            },
          },
        },
        {
          $group: {
            _id: null,
            totalStockValue: { $sum: "$batch_value" },
          },
        },
      ]),

      // 5. Low Stock Alerts
      Inventory.aggregate([
        {
          $lookup: {
            from: "items",
            localField: "item_id",
            foreignField: "_id",
            as: "item",
          },
        },
        { $unwind: "$item" },
        {
          $match: {
            $expr: { $lte: ["$stock_quantity", "$item.reorder_level"] },
          },
        },
        { $count: "count" },
      ]),

      // 6. Expiring Soon Batches (next 30 days)
      ItemBatch.countDocuments({
        expiry_date: {
          $lte: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
          $gte: new Date(),
        },
        $expr: { $lt: ["$qty_sold", "$base_qty"] },
      }),

      // 7. Recent Sales (last 5 for activity feed)
      Sale.find()
        .populate("cashier", "username")
        .sort({ createdAt: -1 })
        .limit(5)
        .select("invoice_no total customer_name createdAt"),

      // 8. Monthly Revenue Trend (last 6 months)
      Sale.aggregate([
        {
          $group: {
            _id: {
              $dateToString: {
                format: "%Y-%m-%d",
                date: { $toDate: "$createdAt" },
              },
            },
            total_sum: {
              $sum: "$total_payable",
            },
            total_discount: {
              $sum: "$discount",
            },
            average_sales: {
              $avg: "$total_payable",
            },
          },
        },

        {
          $sort: { _id: -1 },
        },

        {
          $limit: 5,
        },
      ]),
    ]);

    // Process the results
    const salesData = totalSales[0] || { count: 0, totalRevenue: 0 };
    const stockValueData = totalStockValue[0] || { totalStockValue: 0 };
    const lowStockCount = lowStockItems[0] ? lowStockItems[0].count : 0;

    res.json({
      success: true,
      data: {
        summary: {
          totalSales: salesData.count,
          totalRevenue: salesData.totalRevenue,
          totalSuppliers: totalSuppliers,
          totalItems: totalItems,
          totalStaff: totalClients,
          totalStockValue: stockValueData.totalStockValue,
          lowStockAlerts: lowStockCount,
          expiringSoon: expiringBatches,
          latestSales: latestSales,
          latest_grns: latestGRNs,
        },

        charts: {
          dailyRevenue: dailyRevenue,
          salesByPaymentMethod: salesByPaymentMethod,
        },

        recentActivity: {
          recentSales: recentSales,
        },

        quickActions: {
          createSale: true,
          createGRN: true,
          viewLowStock: lowStockCount > 0,
          viewExpiring: expiringBatches > 0,
        },
      },
    });
  } catch (error) {
    console.error("Dashboard Error:", error);
    res.status(500);
    throw new Error("Failed to load dashboard insights");
  }
});

module.exports = {
  getDashboardInsights,
};
