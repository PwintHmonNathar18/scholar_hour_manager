import connectDB from "@/lib/db";
import Shift from "@/models/Shift";
import { getServerSession } from "next-auth";
import authConfig from "@/auth-v4";
import User from "@/models/User";

export async function GET(req) {
  await connectDB();
  const { searchParams } = new URL(req.url);
  const department = searchParams.get("department");
  const q = department ? { department } : {};
  try {
    const items = await Shift.find(q)
      .populate("bookings.student", "name email")
      .populate("attendances.student", "name email")
      .populate("supervisor", "name email")
      .sort({ start: 1 });
    return Response.json({ items });
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req) {
  await connectDB();
  try {
    const session = await getServerSession(authConfig);
    if (!session?.user || session.user.role !== "supervisor") {
      return Response.json({ error: "Unauthorized: Not a supervisor" }, { status: 401 });
    }
    const body = await req.json();
    const supervisor = await User.findOne({ email: session.user.email });
    if (!supervisor) return Response.json({ error: "Supervisor not found" }, { status: 404 });
    const shift = await Shift.create({
      ...body,
      supervisor: supervisor._id,
      bookings: [],
      attendances: [],
    });
    return Response.json(shift, { status: 201 });
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}
