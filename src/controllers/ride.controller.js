const rideService = require("../services/ride.service");

exports.requestRide = async (req, res) => {
    try {

        const result = await rideService.requestRide(req.body);

        res.status(201).json({
            success: true,
            data: result
        });

    } catch (err) {

        res.status(500).json({
            success: false,
            message: err.message
        });

    }
};

exports.acceptRide = async (req, res) => {
    try {
        const result = await rideService.acceptRide(req.body);

        res.status(200).json({
            success: true,
            data: result
        });
    } catch (err) {
        res.status(400).json({
            success: false,
            message: err.message
        });
    }
};