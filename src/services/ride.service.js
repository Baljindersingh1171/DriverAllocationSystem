const Ride = require("../models/Ride");
const Driver = require("../models/Driver");

const geoService = require("./geo.service");
const lockService = require("./lock.service");

exports.requestRide = async (payload) => {

    const {
        riderId,
        latitude,
        longitude
    } = payload;

    // Create Ride
    const ride = await Ride.create({
        rider: riderId,
        pickupLocation: {
            latitude,
            longitude
        },
        status: "SEARCHING"
    });

    // Find nearby drivers
    const nearbyDriverIds = await geoService.findNearbyDrivers(
        latitude,
        longitude
    );

    const drivers = await Driver.find({
        _id: { $in: nearbyDriverIds },
        status: "ONLINE",
        isAvailable: true
    });

    // Retry after 20 seconds if nobody accepted
    setTimeout(async () => {
        try {
            await exports.retryRideAllocation(ride._id);
        } catch (err) {
            console.error("Retry failed:", err.message);
        }
    }, 20000);

    return {
        ride,
        nearbyDrivers: drivers
    };
};

exports.acceptRide = async ({ rideId, driverId }) => {

    const locked = await lockService.acquireLock(rideId);

    if (!locked) {
        throw new Error("Another driver is already processing this ride.");
    }

    try {

        const ride = await Ride.findById(rideId);

        if (!ride) {
            throw new Error("Ride not found");
        }

        if (ride.status === "ASSIGNED") {
            throw new Error("Ride already assigned");
        }

        const driver = await Driver.findById(driverId);

        if (!driver) {
            throw new Error("Driver not found");
        }

        if (!driver.isAvailable) {
            throw new Error("Driver unavailable");
        }

        // Assign ride
        ride.driver = driver._id;
        ride.status = "ASSIGNED";
        await ride.save();

        // Update driver
        driver.isAvailable = false;
        driver.currentRide = ride._id;
        await driver.save();

        return ride;

    } finally {

        await lockService.releaseLock(rideId);

    }
};

exports.retryRideAllocation = async (rideId) => {

    const ride = await Ride.findById(rideId);

    if (!ride) return;

    // If ride already assigned, don't retry
    if (ride.status !== "SEARCHING") {
        return;
    }

    // Mark previous attempt as timeout
    ride.status = "TIMEOUT";
    await ride.save();

    // Search nearby drivers again
    const nearbyDriverIds = await geoService.findNearbyDrivers(
        ride.pickupLocation.latitude,
        ride.pickupLocation.longitude
    );

    const drivers = await Driver.find({
        _id: { $in: nearbyDriverIds },
        status: "ONLINE",
        isAvailable: true
    });

    console.log("========== RETRY ALLOCATION ==========");
    console.log("Ride:", ride._id);
    console.log(
        "Drivers Notified:",
        drivers.map(driver => ({
            id: driver._id,
            name: driver.name
        }))
    );

    // In a real application, notifications would be sent here.

    return drivers;
};