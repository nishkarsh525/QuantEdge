// src/backend/config/db.js
import mongoose from "mongoose";

// Mongoose connection caching for serverless environments
let cached = global.mongooseConnection;

if (!cached) {
  cached = global.mongooseConnection = { conn: null, promise: null };
}

const connectDB = async () => {
  if (cached.conn) {
    console.log("🚀 Using cached MongoDB connection");
    return cached.conn;
  }

  if (!cached.promise) {
    const MONGODB_CONNECTION_STRING = process.env.MONGO_URI; // Use the exact name from Vercel Env Vars

    if (!MONGODB_CONNECTION_STRING) {
      console.error("🔥 FATAL: MONGO_URI environment variable is not defined.");
      // This error will be caught by the API route's try...catch
      throw new Error(
        "Server configuration error: Missing database connection string."
      );
    }

    console.log("🔧 Attempting new MongoDB connection...");
    cached.promise = mongoose
      .connect(MONGODB_CONNECTION_STRING, {
        bufferCommands: false, // Recommended for serverless
        // useNewUrlParser and useUnifiedTopology are default true in Mongoose 6+
      })
      .then((mongooseInstance) => {
        console.log("✅ MongoDB Connected:", mongooseInstance.connection.host);
        return mongooseInstance;
      })
      .catch((error) => {
        console.error(
          "🔥 MongoDB Connection Error in connectDB promise:",
          error.message
        );
        cached.promise = null; // Reset promise on error so retry can happen
        throw error; // Re-throw the error to be caught by the caller (API route)
      });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null; // Ensure promise is cleared on error for retries
    console.error("🔥 Error resolving MongoDB connection promise:", e.message);
    throw e; // Re-throw error to the calling API route
  }
  return cached.conn;
};

export default connectDB;
