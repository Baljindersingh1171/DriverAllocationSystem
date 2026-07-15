const express = require("express");
const cors = require("cors");
const morgan = require("morgan");

const driverRoutes = require("./routes/driver.routes");
const rideRoutes = require("./routes/ride.routes");

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

app.get("/", (req, res) => {
    res.json({
        message: "Driver Allocation API"
    });
});

app.use("/api/drivers", driverRoutes);
app.use("/api/rides", rideRoutes);

module.exports = app;