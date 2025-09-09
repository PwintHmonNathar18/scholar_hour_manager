import mongoose from "mongoose";

const ShiftSchema = new mongoose.Schema({
  department: String,
  supervisor: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  start: Date,
  end: Date,
  bookedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], // students who booked
  maxSlots: Number,
  title: String,
  description: String,
}, { timestamps: true });

export default mongoose.models.Shift || mongoose.model("Shift", ShiftSchema);
