// src/app/layout.js
"use client";

import { SessionProvider } from "next-auth/react";
import Sidebar from "./components/Sidebar";
// If you have global Tailwind or CSS, import it here:
import "./globals.css"; // adjust/remove if you don't have this file

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="min-h-screen">
        <SessionProvider>
          {/* Left sidebar (fixed) */}
          <Sidebar />
          {/* Main content area with left padding to avoid overlapping the fixed sidebar (w-64) */}
          <main className="ml-64">
            {children}
          </main>
        </SessionProvider>
      </body>
    </html>
  );
}
