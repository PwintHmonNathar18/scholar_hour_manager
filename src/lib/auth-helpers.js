import { getServerSession } from "next-auth";
import { authOptions } from "@/auth-v4";

// Helper function to get authenticated session in API routes
export async function getAuthSession() {
  return await getServerSession(authOptions);
}

// Helper function to check if user is authenticated
export async function requireAuth() {
  const session = await getAuthSession();
  if (!session?.user?.email) {
    throw new Error("Unauthorized");
  }
  return session;
}

// Helper function to check if user has specific role
export async function requireRole(role) {
  const session = await requireAuth();
  if (session.user.role !== role) {
    throw new Error(`Unauthorized: Requires ${role} role`);
  }
  return session;
}
