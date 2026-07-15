const mongoose = require("mongoose");

const rideSchema = new mongoose.Schema(
  {
    rider: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Rider",
      required: true,
    },

    driver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Driver",
      default: null,
    },

    pickupLocation: {
      latitude: Number,
      longitude: Number,
    },

    status: {
      type: String,
      enum: [
        "REQUESTED",
        "SEARCHING",
        "ASSIGNED",
        "TIMEOUT",
      ],
      default: "REQUESTED",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Ride", rideSchema);