"use client";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";

export default function Sidebar() {
  const { data: session } = useSession();
  return (
    <aside className="w-64 h-screen fixed left-0 top-0 bg-gray-100 border-r flex flex-col p-6 space-y-4">
      <h2 className="text-xl font-bold mb-6">Menu</h2>
      <nav className="flex flex-col gap-3">
        <Link href="/" className="hover:underline">Main Page</Link>
        <Link href="/profile" className="hover:underline">Profile</Link>
        <Link href="/browse" className="hover:underline">Browse Shifts</Link>
        {/* Add more links as needed */}
      </nav>
      {session && (
        <div className="mt-auto flex flex-col gap-2 text-sm text-gray-600">
          <span>Signed in as <span className="font-semibold">{session.user.email}</span></span>
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
