const express = require("express");
const router = express.Router();
const {
  createOrUpdateDailyHealthMetrics, // ✅ Changed to correct function name
  getAllDailyHealthMetrics,
  getDailyHealthMetricsById,
  getDailyHealthMetricsByUserId,
  updateDailyHealthMetrics,
  deleteDailyHealthMetrics,
} = require("../controllers/dailyHealthMetricsController"); // ✅ Ensure correct import path

// ✅ Create or Update (Prevents duplicate records for the same day)
router.post("/", createOrUpdateDailyHealthMetrics);

// ✅ Get all DailyHealthMetrics records
router.get("/", getAllDailyHealthMetrics);

// ✅ Get a specific DailyHealthMetrics by ID
router.get("/:id", getDailyHealthMetricsById);

// ✅ Get a user's DailyHealthMetrics by userId
router.get("/user/:userId", getDailyHealthMetricsById);

// ✅ Update an existing DailyHealthMetrics record
router.put("/:id", updateDailyHealthMetrics);

// ✅ Delete a DailyHealthMetrics record
router.delete("/:id", deleteDailyHealthMetrics);

module.exports = router;
