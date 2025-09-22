import connectDB from "@/lib/db";
import User from "@/models/User";
import SessionLog from "@/models/SessionLog";
import { auth } from "@/auth.config";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function PATCH(req) {
  return POST(req);
}

export async function GET(req) {
  await connectDB();
  const session = await auth();
  if (!session?.user?.email) return Response.json({ error: "Unauthorized" }, { status: 401 });
  const { searchParams } = new URL(req.url);
  const requestedEmail = searchParams.get("email");
  const emailToFind = requestedEmail || session.user.email;
  const user = await User.findOne({ email: emailToFind });

  if (!user) return Response.json({ error: "Not found" }, { status: 404 });

  const workedMinutes = await SessionLog.aggregate([
    { $match: { userEmail: user.email, approved: true } },
    { $group: { _id: null, total: { $sum: "$minutes" } } }
  ]).then(r => r[0]?.total || 0);

  // CHANGED: coerce to number so "12" becomes 12 (and doesn't fall back to 0)
  const availableHourNum = Number(user.availableHour);                 // CHANGED

  return Response.json({
    name: user.name ?? "",
    email: user.email ?? "",
    department: user.department ?? "",
    program: user.program ?? "",
    contact: user.contact ?? "",
    availableHour: Number.isFinite(availableHourNum) ? availableHourNum : 0, // CHANGED
    workedHours: workedMinutes,
    approvedSessions: await SessionLog.countDocuments({ userEmail: user.email, approved: true }),
  });
}

export async function POST(req) {
  await connectDB();
  const session = await auth();
  if (!session?.user?.email) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();

  const update = {};
  if ("name" in body) update.name = body.name ?? "";
  if ("department" in body) update.department = body.department ?? "";
  if ("program" in body) update.program = body.program ?? "";
  if ("maxHoursPerWeek" in body) update.maxHoursPerWeek = body.maxHoursPerWeek ?? 0;
  if ("contact" in body) update.contact = body.contact ?? "";
  if ("availableHour" in body) {
    const ah = Number(body.availableHour);
    update.availableHour = Number.isFinite(ah) ? ah : 0;
  }

  const user = await User.findOneAndUpdate(
    { email: session.user.email },
    { $set: update },
    { new: true, upsert: true }
  );

  if (!user) return Response.json({ error: "Not found" }, { status: 404 });

  // Optional (no behavior change): mirror the GET’s coercion in the response
  const availableHourNumResp = Number(user.availableHour);

  return Response.json({
    success: true,
    name: user.name ?? "",
    email: user.email ?? "",
    department: user.department ?? "",
    program: user.program ?? "",
    contact: user.contact ?? "",
    availableHour: Number.isFinite(availableHourNumResp) ? availableHourNumResp : 0,
  });
}
