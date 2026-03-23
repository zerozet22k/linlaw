import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI?.trim() as string;
const MONGODB_NAME = process.env.MONGODB_NAME?.trim() as string;

if (!MONGODB_URI) {
  console.error("MONGODB_URI is required and must be set in environment variables.");
}

if (!MONGODB_NAME) {
  console.error("MONGODB_NAME is required and must be set in environment variables.");
}

interface MongooseCache {
  conn: mongoose.Mongoose | null;
  promise: Promise<mongoose.Mongoose | null> | null;
}

let cached: MongooseCache = (global as any).mongoose;

if (!cached) {
  cached = (global as any).mongoose = { conn: null, promise: null };
}

async function dbConnect(): Promise<mongoose.Mongoose | null> {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    console.log(`Connecting to MongoDB database "${MONGODB_NAME || "unknown"}"`);

    cached.promise = mongoose
      .connect(MONGODB_URI, {
        bufferCommands: false,
        dbName: MONGODB_NAME,
      })
      .then((mongoose) => {
        console.log("MongoDB connected successfully");
        return mongoose;
      })
      .catch((error) => {
        console.error("MongoDB connection failed:", error.message || error);
        return null;
      });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}

export default dbConnect;
