import connectDB from "@/lib/db";
import Shift from "@/models/Shift";
import User from "@/models/User";
import { auth } from "@/auth.config";

export async function GET(req) {
  try {
    await connectDB();
    
    const session = await auth();
    if (!session?.user?.email) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Find the user to get their ID
    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return Response.json({ error: "User not found" }, { status: 404 });
    }

    // Find all shifts where this user has a booking
    const shifts = await Shift.find({
      "bookings.student": user._id
    })
    .populate("bookings.student", "name email")
    .populate("attendances.student", "name email")
    .sort({ start: -1 }); // Most recent first

    return Response.json({ shifts });
  } catch (error) {
    console.error("Error fetching my shifts:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
