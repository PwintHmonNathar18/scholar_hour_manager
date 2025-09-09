import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  role: { type: String, enum: ["student", "supervisor", "admin"], default: "student" },
  program: String,
  GPA: Number,
  maxHoursPerWeek: Number,
  department: String,
}, { timestamps: true });

export default mongoose.models.User || mongoose.model("User", UserSchema);
