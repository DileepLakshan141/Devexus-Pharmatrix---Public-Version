const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const { NotFound, ErrorHandler } = require("./middleware/error_middleware");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
const allowedOrigins = [
  "https://devexus-pharmatrix.vercel.app",
  "https://dileepthedevprojectspharmatrix.netlify.app",
  "http://localhost:3000",
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not an valid domain"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "Cookie"],
  })
);

app.use("/pharmatrix-api/clients", require("./routes/client.routes"));
app.use("/pharmatrix-api/suppliers", require("./routes/supplier.routes"));
app.use("/pharmatrix-api/items", require("./routes/item.routes"));
app.use("/pharmatrix-api/item-units", require("./routes/itemUnit.routes"));
app.use("/pharmatrix-api/grns", require("./routes/grn.routes"));
app.use("/pharmatrix-api/item-batches", require("./routes/itemBatch.routes"));
app.use("/pharmatrix-api/inventory", require("./routes/inventory.routes"));
app.use("/pharmatrix-api/dashboard", require("./routes/dashboard.routes"));
app.use("/pharmatrix-api/pos", require("./routes/pos.routes"));
app.use("/pharmatrix-api/sales", require("./routes/sales.routes"));
app.use("/pharmatrix-api/reports", require("./routes/reports.routes"));

app.use(NotFound);
app.use(ErrorHandler);

module.exports = app;
