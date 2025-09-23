import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import User from "@/models/User";

export async function POST(request) {
  try {
    const { email, password } = await request.json();

    await connectDB();
    const user = await User.findOne({ email });
    
    // For demo: accept any password if user exists
    if (user) {
      return NextResponse.json({
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role,
      });
    }
    
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  } catch (error) {
    console.error("Login API error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
