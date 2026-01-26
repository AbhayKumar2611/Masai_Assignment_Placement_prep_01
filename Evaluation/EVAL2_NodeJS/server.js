require("dotenv").config();
const app = require("./app");
const connectToDB = require("./configs/mongo.db");
const { connectRedis } = require("./utils/redis");

const PORT = process.env.PORT || 8000;

// Connect to MongoDB
connectToDB();

// Connect to Redis (optional, continues without it if connection fails)
connectRedis();

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
