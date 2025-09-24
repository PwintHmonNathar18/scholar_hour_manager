import NextAuth from "next-auth";
import AzureADProvider from "next-auth/providers/azure-ad";
import CredentialsProvider from "next-auth/providers/credentials";
import connectDB from "@/lib/db";
import User from "@/models/User";

console.log("🚀 AUTH.JS FILE IS BEING LOADED!");

export const authOptions = {
  debug: true,
  providers: [
    AzureADProvider({
      clientId: process.env.AZURE_AD_CLIENT_ID,
      clientSecret: process.env.AZURE_AD_CLIENT_SECRET,
      tenantId: process.env.AZURE_AD_TENANT_ID,
    }),
    // Fallback credentials provider for testing
    CredentialsProvider({
      id: "credentials",
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials, req) {
        console.log("🔍 AUTHORIZE FUNCTION CALLED!");
        console.log("🔍 Credentials received:", credentials);
        
        // Always return test user for now to see if function is called
        if (credentials?.email && credentials?.password) {
          console.log("✅ Returning test user for any credentials");
          return {
            id: "1",
            name: "Test User",
            email: credentials.email,
            role: "student"
          };
        }
        
        console.log("❌ No credentials provided");
        return null;
      }
    })
  ],

  pages: {
    signIn: '/signin',
    error: '/auth/error',
  },

  session: {
    strategy: "jwt",
  },

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
};

export default NextAuth(authOptions);
