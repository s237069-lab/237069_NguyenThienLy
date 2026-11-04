
const express = require("express");
const mongoose = require("mongoose");
const Device = require("../models/Device");

const router = express.Router();

// 1. Lấy danh sách thiết bị và tìm kiếm
router.get("/", async (req, res) => {
  try {
    const search = req.query.search || "";

let filter = {};

if (search.trim()) {
      filter = {
        $or: [
          { deviceId: { $regex: search, $options: "i" } },
          { name: { $regex: search, $options: "i" } },
          { room: { $regex: search, $options: "i" } },
          { deviceType: { $regex: search, $options: "i" } },
        ],
      };
    }

    const devices = await Device.find(filter).sort({ createdAt: -1 });
    res.status(200).json(devices);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 2. Lấy chi tiết một thiết bị
router.get("/:id", async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "ID không hợp lệ" });
    }

    const device = await Device.findById(req.params.id);

    if (!device) {
      return res.status(404).json({ message: "Không tìm thấy thiết bị" });
    }

    res.status(200).json(device);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 3. Thêm thiết bị
router.post("/", async (req, res) => {
  try {
    const device = await Device.create(req.body);
    res.status(201).json(device);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ message: "Mã thiết bị đã tồn tại" });
    }

    if (error.name === "ValidationError") {
      return res.status(400).json({ message: error.message });
    }

    res.status(500).json({ message: error.message });
  }
});

// 4. Cập nhật thiết bị
router.put("/:id", async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "ID không hợp lệ" });
    }

    const device = await Device.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!device) {
      return res.status(404).json({ message: "Không tìm thấy thiết bị" });
    }

    res.status(200).json(device);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ message: "Mã thiết bị đã tồn tại" });
    }

    res.status(400).json({ message: error.message });
  }
});

// 5. Xóa thiết bị
router.delete("/:id", async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "ID không hợp lệ" });
    }

    const device = await Device.findByIdAndDelete(req.params.id);

    if (!device) {
      return res.status(404).json({ message: "Không tìm thấy thiết bị" });
    }

    res.status(200).json({ message: "Xóa thiết bị thành công" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
