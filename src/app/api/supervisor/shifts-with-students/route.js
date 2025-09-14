// src/app/api/supervisor/shifts-with-students/route.js
import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Shift from "@/models/Shift";
import { auth } from "@/auth";

export async function GET() {
  const session = await auth();
  if (!session?.user || !["supervisor", "admin"].includes(session.user.role)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await connectDB();

  const shifts = await Shift.find({})
    .sort({ start: -1 })
    .populate("bookings.student", "name email image")
    .populate("attendances.student", "name email image")
    .populate("attendances.verifiedBy", "name email")
    .lean();

  return NextResponse.json(shifts, { status: 200 });
}
