import expiredItems from "../assets/images/time.png";
import medicalReport from "../assets/images/medical-report.png";
import itemReport from "../assets/images/medical.png";
import staffReport from "../assets/images/staff.png";
import supplierReport from "../assets/images/first-aid.png";
import inventoryReport from "../assets/images/health-insurance.png";
import understockedItemReport from "../assets/images/medical-symbol.png";

const ReportList = [
  {
    image: medicalReport,
    title: "Item Sales Report",
    description:
      "Track product sales performance and revenue trends over time. Analyze best-selling items and seasonal patterns.",
    link: "sales-report",
  },
  {
    image: itemReport,
    title: "Registered Items Report",
    description:
      "Complete database of all products in your pharmacy system. View item details, categories, and pricing information.",
    link: "registered-items-report",
  },
  {
    image: inventoryReport,
    title: "Inventory Report",
    description:
      "Current stock levels and inventory valuation across all products. Monitor overall inventory health and investment.",
    link: "inventory-report",
  },
  {
    image: expiredItems,
    title: "Expired Items Writeoff",
    description:
      "Identify and manage expired or near-expiry products for disposal. Track write-off quantities and financial impact.",
    link: "writeoff-report",
  },
  {
    image: staffReport,
    title: "Staff Details Report",
    description:
      "Comprehensive employee information and performance metrics. Manage staff roles, schedules, and responsibilities.",
    link: "staff-report",
  },
  {
    image: supplierReport,
    title: "Supplier Details Report",
    description:
      "Supplier contact information and performance analysis. Evaluate vendor reliability and purchase history.",
    link: "supplier-report",
  },
  {
    image: understockedItemReport,
    title: "Understocked Items Report",
    description:
      "Identify products running low on stock that need reordering. Prevent out-of-stock situations and lost sales.",
    link: "understocked-items-report",
  },
  {
    image: expiredItems,
    title: "Near-Expiry Items Alert",
    description:
      "Proactive alerts for products approaching expiration dates. Plan promotions or returns to minimize losses.",
    link: "near-expiry-items-report",
  },
];

export default ReportList;
