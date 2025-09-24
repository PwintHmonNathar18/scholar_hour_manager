"use client";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useState } from "react";
import { FaHome, FaUser, FaSignOutAlt } from "react-icons/fa";

export default function Sidebar(props) {
  const { open = true, setOpen } = props;
  const { data: session, status } = useSession();

  return (
    <>
      <button
        className="fixed top-4 left-4 z-50 bg-gray-800 text-white px-3 py-2 rounded shadow-lg md:hidden"
        onClick={() => setOpen && setOpen(o => !o)}
        aria-label={open ? "Close sidebar" : "Open sidebar"}
      >
        {open ? "✕" : "☰"}
      </button>
      <aside
        className={`h-screen fixed left-0 top-0 bg-gradient-to-b from-gray-100 to-gray-200 border-r flex flex-col p-6 space-y-4 z-40 transition-all duration-300 ${open ? "w-64" : "w-0 overflow-hidden"}`}
        style={{ boxShadow: open ? "2px 0 8px rgba(0,0,0,0.04)" : "none" }}
      >
        {open && (
          <>
            <h2 className="text-2xl font-extrabold mb-8 text-gray-900 tracking-tight flex items-center gap-2">
              <span role="img" aria-label="logo">🎓</span> Scholar Hour Manager
            </h2>
            <nav className="flex flex-col gap-3 mb-8">
              <Link href="/dashboard" className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-blue-100 text-gray-800 font-medium transition">
                <FaHome className="text-blue-600" /> Dashboard
              </Link>
              <Link href="/profile" className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-blue-100 text-gray-800 font-medium transition">
                <FaUser className="text-green-600" /> Profile
              </Link>
            </nav>
            <div className="mt-auto">
              {status === "loading" && (
                <div className="text-sm text-gray-500">Loading...</div>
              )}
              {status === "authenticated" && session && (
                <div className="flex flex-col gap-2 text-sm text-gray-700 bg-white rounded-lg p-3 shadow">
              
                  <span className="text-xs text-gray-500">Role: {session.user.role}</span>
                  <button
                    className="flex items-center gap-2 bg-red-500 text-white rounded px-3 py-2 mt-2 hover:bg-red-600 transition-colors font-semibold"
                    onClick={() => signOut({ callbackUrl: "/" })}
                  >
                    <FaSignOutAlt /> Log Out
                  </button>
                </div>
              )}
              {status === "unauthenticated" && (
                <div className="flex flex-col gap-2">
                  <Link href="/signin" className="bg-black text-white rounded px-3 py-2 text-center hover:bg-gray-800 font-semibold">
                    Sign In
                  </Link>
                  <Link href="/register" className="bg-gray-500 text-white rounded px-3 py-2 text-center hover:bg-gray-600 font-semibold">
                    Register
                  </Link>
                </div>
              )}
            </div>
          </>
        )}
      </aside>
    </>
  );
}
