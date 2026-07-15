const redis = require("../config/redis");

exports.updateDriverLocation = async (driverId, latitude, longitude) => {
    await await redis.call(
    "GEOADD",
    "drivers",
    longitude,
    latitude,
    driverId
);
};

// NEW
exports.findNearbyDrivers = async (latitude, longitude) => {

    const drivers = await redis.call(
        "GEOSEARCH",
        "drivers",
        "FROMLONLAT",
        longitude,
        latitude,
        "BYRADIUS",
        5,
        "km"
    );

    return drivers;
};