import mongoose from "mongoose";

const SessionLogSchema = new mongoose.Schema({
  userEmail: { type: String, index: true },
  activity: { type: String, required: true },
  startAt: { type: Date, required: true },
  endAt: { type: Date, required: true },
  minutes: { type: Number, required: true },
  approved: { type: Boolean, default: false },
}, { timestamps: true });

export default mongoose.models.SessionLog || mongoose.model("SessionLog", SessionLogSchema);
