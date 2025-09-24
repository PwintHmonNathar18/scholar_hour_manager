import connectDB from "@/lib/db";
import User from "@/models/User";

export async function GET() {
  try {
    await connectDB();
    const users = await User.find({}).select('name email password role').lean();
    
    return Response.json({
      message: "Database users:",
      users: users.map(user => ({
        id: user._id,
        name: user.name,
        email: user.email,
        hasPassword: !!user.password,
        passwordLength: user.password ? user.password.length : 0,
        role: user.role
      }))
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
