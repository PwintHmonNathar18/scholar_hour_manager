import NextAuth from "@/auth-v4";

// NextAuth v4 uses default export
const handler = NextAuth;

export { handler as GET, handler as POST };
