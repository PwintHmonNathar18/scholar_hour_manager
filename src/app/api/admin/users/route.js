import connectDB from "@/lib/db";
import User from "@/models/User";
import { auth } from "@/auth.config";

export async function GET() {
  await connectDB();
  // Only allow admins
  const session = await auth();
  if (!session?.user || session.user.role !== "admin") {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }
  const items = await User.find().lean();
  return Response.json({ items });
}
