import { getAuthSession } from "@/lib/auth-helpers";
import connectDB from "@/lib/db";
import User from "@/models/User";

export async function PATCH(req, { params }) {
  const session = await getAuthSession();
  if (!session || session.user.role !== "admin") {
    return new Response("Forbidden", { status: 403 });
  }

  const { role } = await req.json();
  if (!["student", "supervisor", "admin"].includes(role)) {
    return new Response("Invalid role", { status: 400 });
  }

  await connectDB();
  await User.findByIdAndUpdate(params.id, { role });
  return new Response(null, { status: 204 });
}
