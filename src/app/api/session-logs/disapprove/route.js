import connectDB from "@/lib/db";
import SessionLog from "@/models/SessionLog";

export async function POST(req) {
  await connectDB();
  const { logId } = await req.json();
  
  // Mark session log as disapproved (set approved to false and add disapproved flag)
  await SessionLog.findByIdAndUpdate(logId, { 
    approved: false, 
    disapproved: true 
  });
  
  // Note: We don't add minutes to user's workedHours when disapproving
  return Response.json({ success: true });
}
