import connectDB from "@/lib/db";
import Report from "@/models/Report";
import User from "@/models/User";
import { getAuthSession } from "@/lib/auth-helpers";

export async function GET(req) {
  await connectDB();
  const session = await getAuthSession();
  if (!session?.user || session.user.role !== "admin") {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }
  const reports = await Report.find().populate("reporter", "name email role").lean();
  return Response.json({ items: reports });
}

export async function POST(req) {
  await connectDB();
  const session = await getAuthSession();
  if (!session?.user || (session.user.role !== "student" && session.user.role !== "supervisor")) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }
  const body = await req.json();
  const user = await User.findOne({ email: session.user.email });
  if (!user) {
    return Response.json({ error: "User not found" }, { status: 404 });
  }
  const report = await Report.create({
    reporter: user._id,
    reporterRole: session.user.role,
    title: body.title,
    description: body.description
  });
  return Response.json(report);
}
