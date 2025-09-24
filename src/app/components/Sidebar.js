"use client";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";

export default function Sidebar() {
  const { data: session } = useSession();

  return (
    <aside className="w-64 h-screen fixed left-0 top-0 bg-gray-100 border-r flex flex-col p-6 space-y-4">
      <h2 className="text-xl font-bold mb-6">Menu</h2>
      <nav className="flex flex-col gap-3">
        <Link href="/dashboard" className="hover:underline">Dashboard</Link>
        <Link href="/profile" className="hover:underline">Profile</Link>
      </nav>

      {session && (
        <div className="mt-auto flex flex-col gap-2 text-sm text-gray-600">
          <span className="font-semibold text-gray-800">
            {session.user.name || session.user.email}
          </span>
          {session.user.role && (
            <span className="text-xs text-gray-500">Role: {session.user.role}</span>
          )}
          <button
            className="bg-red-500 text-white rounded px-3 py-1 mt-2 hover:bg-red-600"
            onClick={() => signOut({ callbackUrl: "/register" })}
          >
            Log Out
          </button>
        </div>
      )}
    </aside>
  );
}
