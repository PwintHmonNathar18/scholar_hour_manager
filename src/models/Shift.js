// src/models/Shift.js (only the new/changed parts)
import mongoose, { Schema } from "mongoose";

const BookingSchema = new Schema(
  {
    student: { type: Schema.Types.ObjectId, ref: "User", required: true },
    bookedAt: { type: Date, default: Date.now },
    status: {
      type: String,
      enum: ["booked", "cancelled"],
      default: "booked",
    },
    cancelledAt: Date,
  },
  { _id: false }
);

const AttendanceSchema = new Schema(
  {
    student: { type: Schema.Types.ObjectId, ref: "User", required: true },
    checkInAt: Date,
    checkOutAt: Date,
    hours: Number, // optional – compute from checkIn/checkOut
    verifiedBy: { type: Schema.Types.ObjectId, ref: "User" }, // supervisor
    verifiedAt: Date,
    status: {
      type: String,
      enum: ["pending", "verified", "rejected"],
      default: "pending",
    },
    note: String,
  },
  { _id: false }
);

const ShiftSchema = new Schema(
  {
    title: String,
    description: String,
    department: String,
    start: Date,
    end: Date,
    maxSlots: Number,

    // NEW:
    bookings: [BookingSchema],      // students who booked the shift
    attendances: [AttendanceSchema],// students who actually worked (with verification)
  },
  { timestamps: true }
);

export default mongoose.models.Shift || mongoose.model("Shift", ShiftSchema);
