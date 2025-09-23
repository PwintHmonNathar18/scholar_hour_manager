import connectDB from "@/lib/db";
import Shift from "@/models/Shift";
import { getAuthSession } from "@/lib/auth-helpers";

export async function DELETE(req, { params }) {
  await connectDB();
  const session = await getAuthSession();
  if (!session?.user?.email) return Response.json({ error: "Unauthorized" }, { status: 401 });
  const shiftId = params.id;
  // Remove the booking for this user from the shift
  const result = await Shift.updateOne(
    { _id: shiftId },
    { $pull: { bookings: { userEmail: session.user.email, status: "cancelled" } } }
  );
  if (result.modifiedCount === 0) {
    return Response.json({ error: "Booking not found or not cancelled." }, { status: 404 });
  }
  return Response.json({ success: true });
}
