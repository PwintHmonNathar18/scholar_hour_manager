import mongoose from "mongoose";

const SessionLogSchema = new mongoose.Schema({
  userEmail: { type: String, index: true },
  activity: { type: String, required: true },
  startAt: { type: Date, required: true },
  endAt:   { type: Date, required: true },
  minutes: { type: Number, required: true },
  type: { type: String, enum: ["internal", "external"], required: true },
  organizer: { type: String, required: true },
  approved: { type: Boolean, default: false },
  disapproved: { type: Boolean, default: false },
},{ timestamps:true });

// 👇 explicit, unique collection name
export default mongoose.models.SessionLog
  || mongoose.model("SessionLog", SessionLogSchema, "shm_session_logs_lili");
