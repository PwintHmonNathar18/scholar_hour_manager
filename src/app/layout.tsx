"use client";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import SessionProviderWrapper from "./SessionProviderWrapper";
import Sidebar from "./Sidebar";
import { useState } from "react";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <SessionProviderWrapper>
          <Sidebar open={sidebarOpen} setOpen={setSidebarOpen} />
          <div
            style={{
              marginLeft: sidebarOpen ? 256 : 0,
              transition: "margin-left 0.3s",
            }}
          >
            {children}
          </div>
        </SessionProviderWrapper>
      </body>
    </html>
  );
}
