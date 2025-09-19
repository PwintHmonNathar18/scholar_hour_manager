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

  // 👇 Added: force-create user with default role on first sign-in
  events: {
    async signIn({ user }) {
      try {
        await connectDB();
        const existing = await User.findOne({ email: user?.email });
        if (!existing) {
          await User.create({
            name: user?.name || "",
            email: user?.email,
            image: user?.image || "",
            role: "student", // default role; no admin signup via UI
          });
        } else if (!existing.role) {
          // Backfill if old docs lack role
          existing.role = "student";
          await existing.save();
        }
      } catch (err) {
        console.error("signIn event error:", err);
        // do not throw; avoid blocking OAuth
      }
    },
  },

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
