import mongoose from "mongoose";

let cached = global.mongoose || { conn: null, promise: null };

export default async function dbConnect() {
  const uri = process.env.MONGODB_URI;                 // SRV URL
  const dbName = process.env.MONGODB_DB || "schm-lili"; // 👈 unique DB name

  if (!uri) throw new Error("MONGODB_URI missing");

  if (cached.conn) return cached.conn;
  if (!cached.promise) {
    cached.promise = mongoose.connect(uri, { dbName, bufferCommands:false }).then(m => m);
  }
  cached.conn = await cached.promise;
  return cached.conn;
}
