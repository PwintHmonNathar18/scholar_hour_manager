import dbConnect from "@/lib/db";
import Shift from "@/models/Shift";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/route";
import User from "@/models/User";

export async function GET(req) {
  await dbConnect();
  const { searchParams } = new URL(req.url);
  const department = searchParams.get("department");
  const q = department ? { department } : {};
  try {
    const items = await Shift.find(q).populate("supervisor", "name email").populate("bookedBy", "name email").sort({ start: 1 });
    return Response.json({ items });
  } catch (err) {
    return new Response("Error: " + err.message, { status: 500 });
  }
}

export async function POST(req) {
  await dbConnect();
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== "supervisor") {
      return new Response("Unauthorized: Not a supervisor", { status: 401 });
    }
    const body = await req.json();
    const supervisor = await User.findOne({ email: session.user.email });
    if (!supervisor) return new Response("Supervisor not found", { status: 404 });
    const shift = await Shift.create({
      ...body,
      supervisor: supervisor._id,
      bookedBy: [],
    });
    return Response.json(shift, { status: 201 });
  } catch (err) {
    return new Response("Error: " + err.message, { status: 500 });
  }
}
