const axios = require("axios");

const rideId = "6a575fd8c78281a1e0a8ecfa";

const drivers = [
  "6a5759a4982b1a74faf6f32b",
  "6a5759ac982b1a74faf6f32c",
  "6a5759b4982b1a74faf6f32d"
];

async function accept(driverId) {
  try {
    const res = await axios.post("http://localhost:5000/api/rides/accept", {
      rideId,
      driverId
    });

    console.log(driverId, "SUCCESS", res.data);
  } catch (err) {
    console.log(driverId, "FAILED", err.response?.data || err.message);
  }
}

Promise.all(drivers.map(accept));