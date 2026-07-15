const redis = require("../config/redis");

exports.acquireLock = async (rideId) => {

    const key = `ride:${rideId}:lock`;

    const result = await redis.set(
        key,
        "locked",
        "EX",
        10,
        "NX"
    );

    return result === "OK";
};

exports.releaseLock = async (rideId) => {

    const key = `ride:${rideId}:lock`;

    await redis.del(key);

};