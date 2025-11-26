require("dotenv").config();
const mongoose = require("mongoose");
const app = require("./app");

const PORT = process.env.PORT || 4000;
const MONGO_URI =
  process.env.MONGO_URI || "mongodb://localhost:27017/pharmatrix";

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");
    app.listen(PORT, () => {
      console.log("Pharmatrix 1.0 BACKEND SERVER RUNNING ON " + PORT);
    });
  })
  .catch((err) => {
    console.error("DB connection failed:", err.message);
  });
