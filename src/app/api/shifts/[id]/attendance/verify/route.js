import { NextResponse } from "next/server";
import { getAuthSession } from "@/lib/auth-helpers";
import connectDB from "@/lib/db";
import Shift from "@/models/Shift";
import User from "@/models/User";

/**
 * Body JSON example:
 * {
 *   "studentEmail": "s123@au.edu",
 *   "checkInAt": "2025-09-14T08:00:00.000Z",   // optional
 *   "checkOutAt": "2025-09-14T12:00:00.000Z",  // optional
 *   "hours": 4,                                 // optional (if not computing from times)
 *   "note": "Good work"
 * }
 */
export async function POST(req, { params }) {
  const session = await getAuthSession();
  if (!session?.user || !["supervisor", "admin"].includes(session.user.role)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { studentEmail, checkInAt, checkOutAt, hours, note } = await req.json();
  if (!studentEmail) {
    return NextResponse.json({ error: "studentEmail required" }, { status: 400 });
  }

  await connectDB();

  const { id } = await params;
  const shiftId = id;
  const student = await User.findOne({ email: studentEmail }).select("_id").lean();
  if (!student?._id) return NextResponse.json({ error: "Student not found" }, { status: 404 });

  const supervisor = await User.findOne({ email: session.user.email }).select("_id").lean();

  // Optional: compute hours from times if not provided
  let finalHours = hours;
  if (!finalHours && checkInAt && checkOutAt) {
    const start = new Date(checkInAt).getTime();
    const end = new Date(checkOutAt).getTime();
    if (Number.isFinite(start) && Number.isFinite(end) && end > start) {
      finalHours = (end - start) / (1000 * 60 * 60);
    }
  }

  await Shift.findByIdAndUpdate(shiftId, {
    $push: {
      attendances: {
        student: student._id,
        checkInAt: checkInAt ? new Date(checkInAt) : undefined,
        checkOutAt: checkOutAt ? new Date(checkOutAt) : undefined,
        hours: finalHours,
        verifiedBy: supervisor?._id,
        verifiedAt: new Date(),
        status: "verified",
        note,
      },
    },
  });

  return NextResponse.json({ ok: true });
}
