import mongoose, { Mongoose } from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error(
    "Please define the MONGODB_URI environment variable inside .env.local"
  );
}

/**
 * Interface defining the cached connection object stored in global scope.
 */
interface MongooseCache {
  conn: Mongoose | null;
  promise: Promise<Mongoose> | null;
}

/**
 * Extend global namespace to include the cached mongoose connection in NodeJS global object.
 */
declare global {
  var mongoose: MongooseCache | undefined;
}

// Retrieve cached connection from global scope or initialize a new cache object.
const cached: MongooseCache = global.mongoose || { conn: null, promise: null };

if (!global.mongoose) {
  global.mongoose = cached;
}

/**
 * Establishes or retrieves a cached Mongoose database connection.
 * Caching prevents creating multiple connections across hot-reloads in Next.js development.
 *
 * @returns {Promise<Mongoose>} The active Mongoose connection instance.
 */
async function connectToDatabase(): Promise<Mongoose> {
  // Return the existing connection if already established
  if (cached.conn) {
    return cached.conn;
  }

  // If no connection promise exists, initiate a new connection
  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    cached.promise = mongoose.connect(MONGODB_URI!, opts).then((mongooseInstance) => {
      return mongooseInstance;
    });
  }

  try {
    // Await the connection promise and cache the resolved connection
    cached.conn = await cached.promise;
  } catch (error) {
    // Reset promise cache on failure to allow retry on subsequent calls
    cached.promise = null;
    throw error;
  }

  return cached.conn;
}

export default connectToDatabase;
export { connectToDatabase };
