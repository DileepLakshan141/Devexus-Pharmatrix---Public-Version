const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Simple CORS for debugging
app.use(cors());

console.log("Starting route loading...");

try {
  console.log("1. Loading clients route...");
  app.use("/pharmatrix-api/clients", require("./routes/client.routes"));
  console.log("✓ Clients route loaded");
} catch (err) {
  console.log("✗ Clients route failed:", err.message);
}

try {
  console.log("2. Loading suppliers route...");
  app.use("/pharmatrix-api/suppliers", require("./routes/supplier.routes"));
  console.log("✓ Suppliers route loaded");
} catch (err) {
  console.log("✗ Suppliers route failed:", err.message);
}

try {
  console.log("3. Loading items route...");
  app.use("/pharmatrix-api/items", require("./routes/item.routes"));
  console.log("✓ Items route loaded");
} catch (err) {
  console.log("✗ Items route failed:", err.message);
}

try {
  console.log("4. Loading item-units route...");
  app.use("/pharmatrix-api/item-units", require("./routes/itemUnit.routes"));
  console.log("✓ Item units route loaded");
} catch (err) {
  console.log("✗ Item units route failed:", err.message);
}

try {
  console.log("5. Loading grns route...");
  app.use("/pharmatrix-api/grns", require("./routes/grn.routes"));
  console.log("✓ GRNs route loaded");
} catch (err) {
  console.log("✗ GRNs route failed:", err.message);
}

try {
  console.log("6. Loading item-batches route...");
  app.use("/pharmatrix-api/item-batches", require("./routes/itemBatch.routes"));
  console.log("✓ Item batches route loaded");
} catch (err) {
  console.log("✗ Item batches route failed:", err.message);
}

try {
  console.log("7. Loading inventory route...");
  app.use("/pharmatrix-api/inventory", require("./routes/inventory.routes"));
  console.log("✓ Inventory route loaded");
} catch (err) {
  console.log("✗ Inventory route failed:", err.message);
}

try {
  console.log("8. Loading dashboard route...");
  app.use("/pharmatrix-api/dashboard", require("./routes/dashboard.routes"));
  console.log("✓ Dashboard route loaded");
} catch (err) {
  console.log("✗ Dashboard route failed:", err.message);
}

try {
  console.log("9. Loading pos route...");
  app.use("/pharmatrix-api/pos", require("./routes/pos.routes"));
  console.log("✓ POS route loaded");
} catch (err) {
  console.log("✗ POS route failed:", err.message);
}

try {
  console.log("10. Loading sales route...");
  app.use("/pharmatrix-api/sales", require("./routes/sales.routes"));
  console.log("✓ Sales route loaded");
} catch (err) {
  console.log("✗ Sales route failed:", err.message);
}

try {
  console.log("11. Loading reports route...");
  app.use("/pharmatrix-api/reports", require("./routes/reports.routes"));
  console.log("✓ Reports route loaded");
} catch (err) {
  console.log("✗ Reports route failed:", err.message);
}

console.log("All routes processed");

app.listen(4000, () => {
  console.log("Debug server running on port 4000");
});

module.exports = app;
