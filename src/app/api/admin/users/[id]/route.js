import connectDB from "@/lib/db";
import User from "@/models/User";
import { getAuthSession } from "@/lib/auth-helpers";

export async function GET(req, { params }) {
  await connectDB();
  const session = await getAuthSession();
  if (!session?.user || session.user.role !== "admin") {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await params;
  const user = await User.findById(id).lean();
  if (!user) return Response.json({ error: "User not found" }, { status: 404 });
  return Response.json(user);
}

export async function PUT(req, { params }) {
  await connectDB();
  const session = await getAuthSession();
  if (!session?.user || session.user.role !== "admin") {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await params;
  const body = await req.json();
  const updated = await User.findByIdAndUpdate(id, body, { new: true }).lean();
  if (!updated) return Response.json({ error: "User not found" }, { status: 404 });
  return Response.json(updated);
}

export async function DELETE(req, { params }) {
  await connectDB();
  const session = await getAuthSession();
  if (!session?.user || session.user.role !== "admin") {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await params;
  await User.findByIdAndDelete(id);
  return Response.json({ ok: true });
}
