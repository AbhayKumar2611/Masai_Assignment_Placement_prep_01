const redis = require("redis");

let redisClient = null;

const connectRedis = async () => {
  try {
    redisClient = redis.createClient({
      url: process.env.REDIS_URL || "redis://localhost:6379",
    });

    redisClient.on("error", (err) => {
      console.error("Redis Client Error:", err);
    });

    await redisClient.connect();
    console.log("Redis Connected Successfully");
  } catch (error) {
    console.error("Error connecting to Redis:", error);
    // Continue without Redis if connection fails
    redisClient = null;
  }
};

const getRedisClient = () => {
  return redisClient;
};

const cacheDoctors = async (doctors) => {
  if (!redisClient) return;
  try {
    await redisClient.setEx(
      "doctors:list",
      3600, // 1 hour cache
      JSON.stringify(doctors)
    );
  } catch (error) {
    console.error("Error caching doctors:", error);
  }
};

const getCachedDoctors = async () => {
  if (!redisClient) return null;
  try {
    const cached = await redisClient.get("doctors:list");
    return cached ? JSON.parse(cached) : null;
  } catch (error) {
    console.error("Error getting cached doctors:", error);
    return null;
  }
};

const clearDoctorsCache = async () => {
  if (!redisClient) return;
  try {
    await redisClient.del("doctors:list");
  } catch (error) {
    console.error("Error clearing doctors cache:", error);
  }
};

module.exports = {
  connectRedis,
  getRedisClient,
  cacheDoctors,
  getCachedDoctors,
  clearDoctorsCache,
};

