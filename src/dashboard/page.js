// app/dashboard/page.js  (Server Component)
import Link from "next/link";
import { auth } from "@/auth";

function Card({ title, children }) {
  return (
    <div className="border rounded-md p-4">
      <h3 className="font-semibold mb-2">{title}</h3>
      <div className="space-x-2 space-y-2">{children}</div>
    </div>
  );
}

export default async function DashboardPage() {
  const session = await auth();

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

      {/* Common quick actions for everyone */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card title="Profile">
          <Link href="/profile" className="inline-block bg-black text-white px-3 py-2 rounded">
            View / Edit Profile
          </Link>
        </Card>

        {/* STUDENT ONLY */}
        {role === "student" && (
          <Card title="Student Actions">
            <Link href="/student/browse-shifts" className="inline-block bg-black text-white px-3 py-2 rounded">
              Browse Shifts
            </Link>
            <Link href="/student/my-shifts" className="inline-block bg-black text-white px-3 py-2 rounded">
              My Shifts
            </Link>
          </Card>
        )}

        {/* SUPERVISOR ONLY */}
        {role === "supervisor" && (
          <>
            <Card title="Supervisor – Shifts">
              <Link href="/supervisor/shifts" className="inline-block bg-black text-white px-3 py-2 rounded">
                Manage Student Shifts
              </Link>
              <Link href="/supervisor/create-shift" className="inline-block bg-black text-white px-3 py-2 rounded">
                Create Shift
              </Link>
            </Card>
            <Card title="Approvals">
              <Link href="/supervisor/approve-sessions" className="inline-block bg-black text-white px-3 py-2 rounded">
                Approve Sessions
              </Link>
            </Card>
          </>
        )}

        {/* ADMIN (optional) */}
        {role === "admin" && (
          <Card title="Admin Tools">
            <Link href="/admin/users" className="inline-block bg-black text-white px-3 py-2 rounded">
              Users
            </Link>
            <Link href="/admin/reports" className="inline-block bg-black text-white px-3 py-2 rounded">
              Reports
            </Link>
          </Card>
        )}
      </div>
    </div>
  );
}
