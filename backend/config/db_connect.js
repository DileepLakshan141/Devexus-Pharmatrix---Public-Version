const mongoose = require("mongoose");

const ConnectDB = async () => {
  try {
    const conObj = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  } catch (error) {
    console.error("MongoDB Connection Failed:", error);
    process.exit(1);
  }
};

module.exports = ConnectDB;
