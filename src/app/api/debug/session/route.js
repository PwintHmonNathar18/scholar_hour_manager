// Debug endpoint to check current session
import { NextResponse } from "next/server";
import { getAuthSession } from "@/lib/auth-helpers";

export async function GET() {
  try {
    const session = await getAuthSession();
    
    return NextResponse.json({
      hasSession: !!session,
      user: session?.user || null,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    return NextResponse.json({
      error: error.message,
      hasSession: false
    }, { status: 500 });
  }
}
