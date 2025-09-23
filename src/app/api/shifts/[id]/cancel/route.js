import { NextResponse } from "next/server";
import { getAuthSession } from "@/lib/auth-helpers";
import connectDB from "@/lib/db";
import Shift from "@/models/Shift";
import User from "@/models/User";

export async function POST(_req, { params }) {
  const session = await getAuthSession();
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  await connectDB();

  const { id } = await params;
  const shiftId = id;
  const me = await User.findOne({ email: session.user.email }).select("_id").lean();

  const res = await Shift.updateOne(
    { _id: shiftId, "bookings.student": me._id, "bookings.status": "booked" },
    {
      $set: {
        "bookings.$.status": "cancelled",
        "bookings.$.cancelledAt": new Date(),
      },
    }
  );

  if (res.matchedCount === 0) {
    return NextResponse.json({ error: "Active booking not found" }, { status: 404 });
  }

  return NextResponse.json({ ok: true });
}
