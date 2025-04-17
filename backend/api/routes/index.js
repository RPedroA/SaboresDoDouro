const router = require("express").Router();
const authRouter = require("./auth");
const userRouter = require("./user");
const wineRouter = require("./wine");
const categoryRouter = require("./category");
const reviewRouter = require("./review");
const bottleSizeRoutes = require("./bottleSize");
const dailyHealthMetricsRouter = require("./dailyHealthMetrics"); 

router.use("/auth", authRouter);
router.use("/user", userRouter);
router.use("/wine", wineRouter);
router.use("/category", categoryRouter);
router.use("/review", reviewRouter);
router.use("/bottlesizes", bottleSizeRoutes);
router.use("/dailyHealthMetrics", dailyHealthMetricsRouter); 

module.exports = router;
