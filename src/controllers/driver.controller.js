const Driver = require("../models/Driver");
const redis = require("../config/redis");
const geoService = require("../services/geo.service");

// Register Driver
exports.registerDriver = async (req, res) => {
    try {
        const { name, phone } = req.body;

        const driver = await Driver.create({
            name,
            phone
        });

        res.status(201).json({
            success: true,
            data: driver
        });

    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
};



exports.updateLocation = async (req, res) => {

    try {

        const {
            driverId,
            latitude,
            longitude
        } = req.body;

        await geoService.updateDriverLocation(
            driverId,
            latitude,
            longitude
        );

        res.json({
            success: true,
            message: "Driver location updated."
        });

    } catch (err) {

        res.status(500).json({
            success: false,
            message: err.message
        });

    }

};

exports.updateStatus = async (req, res) => {
    try {

        const { driverId, status, isAvailable } = req.body;

        const driver = await Driver.findByIdAndUpdate(
            driverId,
            {
                status,
                isAvailable
            },
            {
                new: true
            }
        );

        if (!driver) {
            return res.status(404).json({
                success: false,
                message: "Driver not found"
            });
        }

        res.json({
            success: true,
            data: driver
        });

    } catch (err) {

        res.status(500).json({
            success: false,
            message: err.message
        });

    }
};