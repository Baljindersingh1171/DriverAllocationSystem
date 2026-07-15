const express = require("express");
const router = express.Router();

const rideController = require("../controllers/ride.controller");

router.post("/request", rideController.requestRide);
router.post("/accept", rideController.acceptRide);

module.exports = router;