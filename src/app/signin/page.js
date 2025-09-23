"use client";

import { useState } from "react";
import { signIn, getCsrfToken } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function SignInPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    
    try {
      const res = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });
      
      if (res?.error) {
        setError("Invalid email or password");
      } else if (res?.ok) {
        router.push("/dashboard");
      }
    } catch (error) {
      console.error("Sign in error:", error);
      setError("An error occurred during sign in");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-4">
      <h1 className="text-2xl font-semibold mb-6">Sign In</h1>
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow w-full max-w-sm space-y-4">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border p-2 rounded w-full"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border p-2 rounded w-full"
          required
        />
        {error && <div className="text-red-500 text-sm">{error}</div>}
        <button 
          className="bg-black text-white rounded py-2 w-full disabled:opacity-50" 
          type="submit"
          disabled={loading}
        >
          {loading ? "Signing In..." : "Sign In"}
        </button>
      </form>
      <div className="mt-4 text-sm text-gray-700">
        Don&apos;t have an account?{' '}
        <Link href="/register" className="text-blue-600 hover:underline">Sign up</Link>
      </div>
    </main>
  );
}
