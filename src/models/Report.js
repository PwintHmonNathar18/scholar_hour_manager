import mongoose from "mongoose";

const ReportSchema = new mongoose.Schema({
  reporter: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  reporterRole: { type: String, enum: ["student", "supervisor"], required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  status: { type: String, enum: ["open", "resolved"], default: "open" },
  resolvedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  resolvedAt: Date
});

export default mongoose.models.Report || mongoose.model("Report", ReportSchema);
