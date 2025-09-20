import connectDB from "@/lib/db";
import Shift from "@/models/Shift";
import User from "@/models/User";
import { auth } from "@/auth.config";

export async function GET(req, { params }) {
  await connectDB();
  try {
    const { id } = await params;
    const shift = await Shift.findById(id)
      .populate("bookings.student", "name email")
      .populate("attendances.student", "name email");
    
    // Try to populate supervisor if it exists
    if (shift && shift.supervisor) {
      await shift.populate("supervisor", "name email");
    }
    
    if (!shift) {
      return Response.json({ error: "Shift not found" }, { status: 404 });
    }
    
    return Response.json(shift);
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}

export async function PUT(req, { params }) {
  await connectDB();
  try {
    const { id } = await params;
    const session = await auth();
    if (!session?.user || session.user.role !== "supervisor") {
      return Response.json({ error: "Unauthorized: Not a supervisor" }, { status: 401 });
    }

    const body = await req.json();
    const supervisor = await User.findOne({ email: session.user.email });
    if (!supervisor) {
      return Response.json({ error: "Supervisor not found" }, { status: 404 });
    }

    // Find the shift and check if the current supervisor owns it
    const existingShift = await Shift.findById(id);
    if (!existingShift) {
      return Response.json({ error: "Shift not found" }, { status: 404 });
    }

    // Check if the supervisor owns this shift (allow editing if no supervisor is set for backward compatibility)
    if (existingShift.supervisor && existingShift.supervisor.toString() !== supervisor._id.toString()) {
      return Response.json({ error: "Unauthorized: You can only edit your own shifts" }, { status: 403 });
    }

    // Update the shift
    const updatedShift = await Shift.findByIdAndUpdate(
      id,
      {
        title: body.title,
        description: body.description,
        department: body.department,
        start: body.start,
        end: body.end,
        maxSlots: body.maxSlots,
      },
      { new: true }
    )
      .populate("bookings.student", "name email")
      .populate("attendances.student", "name email");

    return Response.json(updatedShift);
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  await connectDB();
  try {
    const { id } = await params;
    const session = await auth();
    if (!session?.user || (session.user.role !== "supervisor" && session.user.role !== "admin")) {
      return Response.json({ error: "Unauthorized: Not a supervisor or admin" }, { status: 401 });
    }

    // For supervisor, check ownership. For admin, allow delete any shift.
    let supervisor;
    if (session.user.role === "supervisor") {
      supervisor = await User.findOne({ email: session.user.email });
      if (!supervisor) {
        return Response.json({ error: "Supervisor not found" }, { status: 404 });
      }
    }

    const existingShift = await Shift.findById(id);
    if (!existingShift) {
      return Response.json({ error: "Shift not found" }, { status: 404 });
    }

    if (session.user.role === "supervisor") {
      // Check if the supervisor owns this shift (allow deleting if no supervisor is set for backward compatibility)
      if (existingShift.supervisor && existingShift.supervisor.toString() !== supervisor._id.toString()) {
        return Response.json({ error: "Unauthorized: You can only delete your own shifts" }, { status: 403 });
      }
    }

    // Check if there are active bookings
    const activeBookings = existingShift.bookings.filter(b => b.status === "booked");
    if (activeBookings.length > 0) {
      return Response.json({ error: "Cannot delete shift with active bookings" }, { status: 400 });
    }

    await Shift.findByIdAndDelete(id);
    return Response.json({ message: "Shift deleted successfully" });
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}
