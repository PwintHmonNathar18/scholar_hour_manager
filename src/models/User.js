import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  role: { type: String, enum: ["student", "admin"], default: "student" },
}, { timestamps: true });

export default mongoose.models.User || mongoose.model("User", UserSchema);
