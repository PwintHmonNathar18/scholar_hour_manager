"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "loading") return;
    
    if (!session) {
      // If not signed in, redirect to sign in page
      router.replace("/signin");
    } else {
      // If signed in, redirect to dashboard
      router.replace("/dashboard");
    }
  }, [session, status, router]);

  // Show loading while redirecting
  return (
    <main className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <h1 className="text-2xl font-semibold mb-4">Scholar Hour Manager</h1>
        <p className="text-gray-600">Loading...</p>
      </div>
    </main>
  );
}
