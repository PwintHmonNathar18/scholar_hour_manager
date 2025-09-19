// node scripts/promote-admins.js
import "dotenv/config";
import mongoose from "mongoose";
import { connectDB } from "@/lib/db.js";
import User from "@/models/User.js";

const ADMIN_EMAILS = [
  "pwinthmonnathar@gmail.com",
  "second.admin@au.edu",
];

(async () => {
  try {
    await connectDB();
    const res = await User.updateMany(
      { email: { $in: ADMIN_EMAILS } },
      { $set: { role: "admin" } }
    );
    console.log("Admins promoted:", res.modifiedCount);
  } catch (e) {
    console.error(e);
  } finally {
    await mongoose.connection.close();
  }
})();
