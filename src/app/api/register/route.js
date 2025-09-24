import dbConnect from "@/lib/db";
import User from "@/models/User";

export async function POST(req) {
  await dbConnect();
  const body = await req.json();
  if (!body.name || !body.email || !body.password || !body.role) {
    return Response.json({ error: "Missing fields" }, { status: 400 });
  }
  // For demo: do not hash password
  const exists = await User.findOne({ email: body.email });
  if (exists) {
    return Response.json({ error: "Email already registered" }, { status: 400 });
  }
  const user = await User.create({
    name: body.name,
    email: body.email,
    password: body.password, // Now storing password (should be hashed in production)
    role: body.role,
    department: body.department,
  });
  return Response.json({ id: user._id, email: user.email, role: user.role });
}
