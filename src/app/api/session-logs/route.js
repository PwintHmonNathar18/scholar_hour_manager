import connectDB from "@/lib/db";
import SessionLog from "@/models/SessionLog";
import mongoose from "mongoose";
import { auth } from "@/auth.config";

export async function GET(req) {
  await connectDB();
  console.log("[Mongo] host:", mongoose.connection.host, "db:", mongoose.connection.name);
  const { searchParams } = new URL(req.url);
  const email = searchParams.get("email");
  const pending = searchParams.get("pending"); // Add pending parameter
  
  let q = email ? { userEmail: email } : {};
  
  // If pending=true, only show sessions that haven't been approved or disapproved
  if (pending === "true") {
    q = { ...q, approved: false, disapproved: { $ne: true } };
  }
  
  const items = await SessionLog.find(q).sort({ createdAt: -1 });
  return Response.json({ items });
}

export async function POST(req) {
  await connectDB();
  const body = await req.json();
  const start = new Date(body.startAt), end = new Date(body.endAt);
  const minutes = Math.max(0, Math.round((end - start) / 60000));
  const created = await SessionLog.create({ ...body, minutes });
  return Response.json(created, { status: 201 });
}
