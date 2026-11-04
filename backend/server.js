
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const deviceRoutes = require("./routes/devices");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Trang kiểm tra API
app.get("/", (req, res) => {
  res.json({ message: "Device Management API is running!" });
});

// Kiểm tra sức khỏe server
app.get("/health", (req, res) => {
  res.json({ status: "OK", message: "Backend is healthy" });
});

// Sử dụng các API thiết bị
app.use("/api/devices", deviceRoutes);

// Kết nối MongoDB
const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("Connected to MongoDB successfully!");

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("MongoDB connection error:", error.message);
    process.exit(1);
  });
