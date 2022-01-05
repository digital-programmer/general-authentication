const express = require("express");
const router = express.Router();
const homeController = require("../controllers/homeController");
const forgotPasswordController = require("../controllers/forgotPasswordController");


router.get("/", homeController.home);
router.get("/forgot-password", forgotPasswordController.index);
router.post("/forgot-password", forgotPasswordController.sendPassword);
router.use("/users", require("./users"));

module.exports = router;