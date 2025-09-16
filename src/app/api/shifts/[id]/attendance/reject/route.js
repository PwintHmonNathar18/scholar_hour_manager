import { NextResponse } from "next/server";
import { auth } from "@/auth.config";
import connectDB from "@/lib/db";
import Shift from "@/models/Shift";
import User from "@/models/User";

/**
 * Body: { "studentEmail": "s123@au.edu", "note": "No show" }
 */
export async function POST(req, { params }) {
  const session = await auth();
  if (!session?.user || !["supervisor", "admin"].includes(session.user.role)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { studentEmail, note } = await req.json();
  await connectDB();

  const { id } = await params;
  const shiftId = id;
  const student = await User.findOne({ email: studentEmail }).select("_id").lean();
  const supervisor = await User.findOne({ email: session.user.email }).select("_id").lean();

  await Shift.findByIdAndUpdate(shiftId, {
    $push: {
      attendances: {
        student: student._id,
        verifiedBy: supervisor?._id,
        verifiedAt: new Date(),
        status: "rejected",
        note,
      },
    },
  });

  return NextResponse.json({ ok: true });
}
