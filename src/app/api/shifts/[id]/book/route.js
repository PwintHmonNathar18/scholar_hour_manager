import { NextResponse } from "next/server";
import { auth } from "@/auth";
import connectDB from "@/lib/db";
import Shift from "@/models/Shift";
import User from "@/models/User";

export async function POST(_req, { params }) {
  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  await connectDB();

  const shiftId = params.id;

  const me = await User.findOne({ email: session.user.email }).select("_id").lean();
  if (!me?._id) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  // Optional: capacity guard (maxSlots)
  const shift = await Shift.findById(shiftId).lean();
  if (!shift) return NextResponse.json({ error: "Shift not found" }, { status: 404 });

  const bookedCount = (shift.bookings || []).filter(b => b.status === "booked").length;
  if (typeof shift.maxSlots === "number" && bookedCount >= shift.maxSlots) {
    return NextResponse.json({ error: "Shift is full" }, { status: 400 });
  }

  // Prevent duplicate active booking
  const alreadyBooked = (shift.bookings || []).some(
    b => String(b.student) === String(me._id) && b.status === "booked"
  );
  if (alreadyBooked) {
    return NextResponse.json({ error: "Already booked" }, { status: 400 });
  }

  await Shift.findByIdAndUpdate(shiftId, {
    $push: { bookings: { student: me._id, status: "booked" } },
  });

  return NextResponse.json({ ok: true });
}
