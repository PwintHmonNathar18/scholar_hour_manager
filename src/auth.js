import NextAuth from "next-auth";
import MicrosoftEntra from "next-auth/providers/microsoft-entra-id";
import connectDB from "@/lib/db";
import User from "@/models/User";

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    MicrosoftEntra({
      clientId: process.env.MS_ENTRA_CLIENT_ID,
      clientSecret: process.env.MS_ENTRA_CLIENT_SECRET,
      tenantId: process.env.MS_ENTRA_TENANT_ID,
    }),
  ],
  callbacks: {
    async jwt({ token }) {
      if (token?.email) {
        await connectDB();
        const u = await User.findOne({ email: token.email }).lean();
        token.role = u?.role || "student";
      }
      return token;
    },
    async session({ session, token }) {
      session.user.role = token?.role || "student";
      return session;
    },
  },
});
