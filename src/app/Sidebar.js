"use client";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";

export default function Sidebar() {
  const { data: session, status } = useSession();
  
  return (
    <aside className="w-64 h-screen fixed left-0 top-0 bg-gray-100 border-r flex flex-col p-6 space-y-4">
      <h2 className="text-xl font-bold mb-6">Scholar Hour Manager</h2>
      <nav className="flex flex-col gap-3">
        <Link href="/dashboard" className="hover:underline">Dashboard</Link>
        <Link href="/profile" className="hover:underline">Profile</Link>
        {/* Add more general navigation links as needed */}
      </nav>
      
      <div className="mt-auto">
        {status === "loading" && (
          <div className="text-sm text-gray-500">Loading...</div>
        )}
        
        {status === "authenticated" && session && (
          <div className="flex flex-col gap-2 text-sm text-gray-600">
            <span>Signed in as:</span>
            <span className="font-semibold">{session.user.email}</span>
            <span className="text-xs text-gray-500">Role: {session.user.role}</span>
            <button
              className="bg-red-500 text-white rounded px-3 py-2 mt-2 hover:bg-red-600 transition-colors"
              onClick={() => signOut({ callbackUrl: "/" })}
            >
              Log Out
            </button>
          </div>
        )}
        
        {status === "unauthenticated" && (
          <div className="flex flex-col gap-2">
            <Link href="/signin" className="bg-black text-white rounded px-3 py-2 text-center hover:bg-gray-800">
              Sign In
            </Link>
            <Link href="/register" className="bg-gray-500 text-white rounded px-3 py-2 text-center hover:bg-gray-600">
              Register
            </Link>
          </div>
        )}
      </div>
    </aside>
  );
}
