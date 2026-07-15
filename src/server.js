require("dotenv").config();

const app = require("./app");

const connectDB = require("./config/mongo");

// Connect Redis
require("./config/redis");

const PORT = process.env.PORT || 5000;

(async () => {
    await connectDB();

    app.listen(PORT, () => {
        console.log(`🚀 Server running on port ${PORT}`);
    });
})();