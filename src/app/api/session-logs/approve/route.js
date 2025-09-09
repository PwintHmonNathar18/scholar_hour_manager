import dbConnect from "@/lib/db";
import User from "@/models/User";
import SessionLog from "@/models/SessionLog";

export async function POST(req) {
  await dbConnect();
  const { logId, userEmail, minutes } = await req.json();
  // Mark session log as approved (add approved field if needed)
  await SessionLog.findByIdAndUpdate(logId, { approved: true });
  // Add minutes to user's workedHours
  await User.findOneAndUpdate(
    { email: userEmail },
    { $inc: { workedHours: minutes } }
  );
  return Response.json({ success: true });
}
