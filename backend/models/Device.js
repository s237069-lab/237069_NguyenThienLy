
const mongoose = require("mongoose");

const deviceSchema = new mongoose.Schema(
  {
    deviceId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    deviceType: {
      type: String,
      required: true,
    },
    room: {
      type: String,
      required: true,
    },
    brand: String,
    model: String,
    quantity: {
      type: Number,
      required: true,
      min: 0,
    },
    status: {
      type: String,
      enum: ["Đang sử dụng", "Hư hỏng", "Đang sửa chữa", "Ngừng sử dụng"],
      default: "Đang sử dụng",
    },
    purchaseDate: String,
    description: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Device", deviceSchema);
