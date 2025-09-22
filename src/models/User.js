// models/User.js
import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    name: String,
    email: { type: String, unique: true, required: true, index: true },
    role: { type: String, enum: ["student", "supervisor", "admin"], default: "student", index: true },
  program: String,
  GPA: Number,
  maxHoursPerWeek: Number,
  department: String,
  workedHours: { type: Number, default: 0 },
  contact: { type: String, default: "" },
  department: { type: String, default: "" },        // NEW
  contact: { type: String, default: "" },           // NEW
  availableHour: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.models.User || mongoose.model("User", UserSchema);
