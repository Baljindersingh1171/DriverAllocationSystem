const express = require("express");

const router = express.Router();

const driverController = require("../controllers/driver.controller");

router.post("/register", driverController.registerDriver);

router.patch(
    "/location",
    driverController.updateLocation
);

router.patch("/status", driverController.updateStatus);

module.exports = router;