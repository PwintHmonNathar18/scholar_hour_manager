import dbConnect from "@/lib/db";
import SessionLog from "@/models/SessionLog";

export async function GET(req) {
  await dbConnect();
  const { searchParams } = new URL(req.url);
  const email = searchParams.get("email");
  const q = email ? { userEmail: email } : {};
  const items = await SessionLog.find(q).sort({ createdAt: -1 });
  return Response.json({ items });
}

export async function POST(req) {
  await dbConnect();
  const body = await req.json();
  const start = new Date(body.startAt), end = new Date(body.endAt);
  const minutes = Math.max(0, Math.round((end - start) / 60000));
  const created = await SessionLog.create({ ...body, minutes });
  return Response.json(created, { status: 201 });
}
