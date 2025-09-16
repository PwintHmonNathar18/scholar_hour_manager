import connectDB from "@/lib/db";
import User from "@/models/User";
import SessionLog from "@/models/SessionLog";
import { auth } from "@/auth.config";

export async function GET(req) {
  await connectDB();
  const session = await auth();
  if (!session?.user?.email) return Response.json({ error: "Unauthorized" }, { status: 401 });
  const user = await User.findOne({ email: session.user.email });
  if (!user) return Response.json({ error: "Not found" }, { status: 404 });
  return Response.json({
    name: user.name,
    email: user.email,
    department: user.department,
    program: user.program,
    workedHours: await SessionLog.aggregate([
      { $match: { userEmail: user.email, approved: true } },
      { $group: { _id: null, total: { $sum: "$minutes" } } }
    ]).then(r => r[0]?.total || 0),
    approvedSessions: await SessionLog.countDocuments({ userEmail: user.email, approved: true }),
  });
}

export async function POST(req) {
  await connectDB();
  const session = await auth();
  if (!session?.user?.email) return Response.json({ error: "Unauthorized" }, { status: 401 });
  const body = await req.json();
  const user = await User.findOneAndUpdate(
    { email: session.user.email },
    {
      name: body.name,
      department: body.department,
      program: body.program,
      maxHoursPerWeek: body.maxHoursPerWeek,
    },
    { new: true }
  );
  if (!user) return Response.json({ error: "Not found" }, { status: 404 });
  return Response.json({ success: true });
}
