// app/dashboard/page.js  (Client Component)
"use client";
import Link from "next/link";
import { useSession } from "next-auth/react";

function Card({ title, children }) {
  return (
    <div className="border rounded-md p-4">
      <h3 className="font-semibold mb-2">{title}</h3>
      <div className="space-x-2 space-y-2">{children}</div>
    </div>
  );
}

export default function DashboardPage() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
        <p>Loading...</p>
      </div>
    );
  }

  if (!session?.user?.email) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
        <p>Please sign in to continue.</p>
      </div>
    );
  }

  const role = session.user.role || "student";

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

      {/* Main Services */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mb-8">
        <Card title="Log Session">
          <Link href="/" className="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
            Log Your Hours
          </Link>
          <p className="text-sm text-gray-600 mt-2">Track your work sessions and hours</p>
        </Card>

        <Card title="Browse Shifts">
          <Link href="/browse" className="inline-block bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
            Find Shifts
          </Link>
          <p className="text-sm text-gray-600 mt-2">Browse and book available shifts</p>
        </Card>

        {/* SUPERVISOR & ADMIN ONLY */}
        {(role === "supervisor" || role === "admin") && (
          <Card title="Approve Sessions">
            <Link href="/approve-sessions" className="inline-block bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700">
              Review Sessions
            </Link>
            <p className="text-sm text-gray-600 mt-2">Approve student work sessions</p>
          </Card>
        )}
      </div>

      {/* Role-specific sections */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card title="Profile">
          <Link href="/profile" className="inline-block bg-gray-600 text-white px-3 py-2 rounded hover:bg-gray-700">
            View / Edit Profile
          </Link>
        </Card>

        {/* STUDENT ONLY */}
        {role === "student" && (
          <Card title="My Activity">
            <Link href="/student/my-shifts" className="inline-block bg-indigo-600 text-white px-3 py-2 rounded hover:bg-indigo-700">
              My Shifts
            </Link>
          </Card>
        )}

        {/* SUPERVISOR ONLY */}
        {role === "supervisor" && (
          <Card title="Supervisor Tools">
            <Link href="/browse/create" className="inline-block bg-orange-600 text-white px-3 py-2 rounded hover:bg-orange-700">
              Create New Shift
            </Link>
          </Card>
        )}

        {/* ADMIN (optional) */}
        {role === "admin" && (
          <Card title="Admin Tools">
            <Link href="/admin/users" className="inline-block bg-red-600 text-white px-3 py-2 rounded mr-2 hover:bg-red-700">
              Manage Users
            </Link>
            <Link href="/admin/reports" className="inline-block bg-red-600 text-white px-3 py-2 rounded hover:bg-red-700">
              Reports
            </Link>
          </Card>
        )}
      </div>
    </div>
  );
}
