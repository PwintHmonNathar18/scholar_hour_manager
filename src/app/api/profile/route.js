import dbConnect from "@/lib/db";
import User from "@/models/User";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/route";

export async function GET(req) {
  await dbConnect();
  const session = await getServerSession(req, authOptions);
  if (!session?.user?.email) return new Response("Unauthorized", { status: 401 });
  const user = await User.findOne({ email: session.user.email });
  if (!user) return new Response("Not found", { status: 404 });
  return Response.json({
    name: user.name,
    email: user.email,
    program: user.program,
    GPA: user.GPA,
    maxHoursPerWeek: user.maxHoursPerWeek,
  });
}

export async function POST(req) {
  await dbConnect();
  const session = await getServerSession(req, authOptions);
  if (!session?.user?.email) return new Response("Unauthorized", { status: 401 });
  const body = await req.json();
  const user = await User.findOneAndUpdate(
    { email: session.user.email },
    {
      name: body.name,
      program: body.program,
      GPA: body.GPA,
      maxHoursPerWeek: body.maxHoursPerWeek,
    },
    { new: true }
  );
  if (!user) return new Response("Not found", { status: 404 });
  return Response.json({ success: true });
}
