// app/dashboard/page.js  (Client Component)
"use client";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { FaRegClock, FaUserFriends, FaClipboardList, FaUserCheck, FaExclamationCircle, FaUserCog } from "react-icons/fa";

function Card({ title, children, color, icon }) {
  return (
    <div
      className={`rounded-2xl shadow-lg p-6 bg-white transition-transform hover:-translate-y-1 hover:shadow-xl border border-gray-200 flex flex-col min-h-[150px]`}
      style={{ borderTop: color ? `4px solid ${color}` : undefined }}
    >
      <div className="flex items-center gap-2 mb-3">
        {icon && <span className="text-xl">{icon}</span>}
        <h3 className="font-semibold text-lg text-gray-800">{title}</h3>
      </div>
      <div className="flex-1 flex flex-col justify-center gap-2">{children}</div>
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

  let roleTitle = "Dashboard";
  if (role === "student") roleTitle = "🎓 Student's Dashboard";
  else if (role === "supervisor") roleTitle = "🧑‍🏫 Supervisor's Dashboard";
  else if (role === "admin") roleTitle = "🛡️ Admin's Dashboard";

  return (
    <div className="w-full min-h-screen flex flex-col items-center justify-center">
      <div className="max-w-5xl w-full p-6">
        <h1 className="text-3xl font-extrabold mb-10 text-gray-900 tracking-tight text-center">{roleTitle}</h1>
        {/* Main Services */}
        <div className="flex flex-wrap justify-center items-center gap-8 mb-12">
          {/* STUDENT ONLY: Log Session */}
          {role === "student" && (
            <div
              className="rounded-2xl shadow-lg bg-white border-t-4 flex flex-col items-center justify-center"
              style={{ borderTopColor: "#2563eb", width: '320px', height: '260px' }}
            >
              <div className="flex items-center mb-4 text-2xl font-bold text-gray-900">
                <FaRegClock />
                <span className="ml-2">Log Session</span>
              </div>
              <Link
                href="/log-session"
                className="w-56 py-3 rounded-lg font-semibold text-white text-lg mb-4 bg-blue-600 hover:bg-blue-700 transition flex justify-center items-center"
              >
                Log Your Hours
              </Link>
              <p className="text-gray-500 text-center">
                Track your work sessions and hours
              </p>
            </div>
          )}
          <div
            className="rounded-2xl shadow-lg bg-white border-t-4 flex flex-col items-center justify-center"
            style={{ borderTopColor: "#22c55e", width: '320px', height: '260px' }}
          >
            <div className="flex items-center mb-4 text-2xl font-bold text-gray-900">
              <FaUserFriends />
              <span className="ml-2">Browse Shifts</span>
            </div>
            <Link
              href="/browse"
              className="w-56 py-3 rounded-lg font-semibold text-white text-lg mb-4 bg-green-600 hover:bg-green-700 transition flex justify-center items-center"
            >
              Find Shifts
            </Link>
            <p className="text-gray-500 text-center">
              Browse and book available shifts
            </p>
          </div>
          {/* SUPERVISOR ONLY: Approve Sessions */}
          {role === "supervisor" && (
            <div
              className="rounded-2xl shadow-lg bg-white border-t-4 flex flex-col items-center justify-center"
              style={{ borderTopColor: "#a21caf", width: '320px', height: '260px' }}
            >
              <div className="flex items-center mb-4 text-2xl font-bold text-gray-900">
                <FaUserCheck />
                <span className="ml-2">Approve Sessions</span>
              </div>
              <Link
                href="/approve-sessions"
                className="w-56 py-3 rounded-lg font-semibold text-white text-lg mb-4 bg-purple-600 hover:bg-purple-700 transition flex justify-center items-center"
              >
                Review Sessions
              </Link>
              <p className="text-gray-500 text-center">
                Approve student work sessions
              </p>
            </div>
          )}
        </div>
        {/* Role-specific sections */}
        <div className="flex flex-wrap justify-center items-center gap-8">
          {/* STUDENT ONLY */}
          {role === "student" && (
            <>
              <div
                className="rounded-2xl shadow-lg bg-white border-t-4 flex flex-col items-center justify-center"
                style={{ borderTopColor: "#6366f1", width: '320px', height: '260px' }}
              >
                <div className="flex items-center mb-4 text-2xl font-bold text-gray-900">
                  <FaClipboardList />
                  <span className="ml-2">My Activity</span>
                </div>
                <Link
                  href="/student/my-shifts"
                  className="w-56 py-3 rounded-lg font-semibold text-white text-lg mb-4 bg-indigo-600 hover:bg-indigo-700 transition flex justify-center items-center"
                >
                  My Shifts
                </Link>
              </div>
              <div
                className="rounded-2xl shadow-lg bg-white border-t-4 flex flex-col items-center justify-center"
                style={{ borderTopColor: "#ec4899", width: '320px', height: '260px' }}
              >
                <div className="flex items-center mb-4 text-2xl font-bold text-gray-900">
                  <FaExclamationCircle />
                  <span className="ml-2">Report a Problem</span>
                </div>
                <Link
                  href="/reports/new"
                  className="w-56 py-3 rounded-lg font-semibold text-white text-lg mb-4 bg-pink-600 hover:bg-pink-700 transition flex justify-center items-center"
                >
                  Report a Problem
                </Link>
                <p className="text-gray-500 text-center">Report issues to admins</p>
              </div>
            </>
          )}
          {/* SUPERVISOR ONLY */}
          {role === "supervisor" && (
            <>
              <div
                className="rounded-2xl shadow-lg bg-white border-t-4 flex flex-col items-center justify-center"
                style={{ borderTopColor: "#f59e42", width: '320px', height: '260px' }}
              >
                <div className="flex items-center mb-4 text-2xl font-bold text-gray-900">
                  <FaUserCog />
                  <span className="ml-2">Supervisor Tools</span>
                </div>
                <div className="flex flex-wrap gap-3">
                  <Link
                    href="/browse/create"
                    className="w-28 py-2 rounded-lg font-semibold text-white text-center bg-orange-600 hover:bg-orange-700 transition"
                  >
                    Create Shift
                  </Link>
                  <Link
                    href="/supervisor/student-shifts"
                    className="w-28 py-2 rounded-lg font-semibold text-white text-center bg-black hover:bg-gray-900 transition"
                  >
                    View Student Shifts
                  </Link>
                </div>
              </div>
              <div
                className="rounded-2xl shadow-lg bg-white border-t-4 flex flex-col items-center justify-center"
                style={{ borderTopColor: "#ec4899", width: '320px', height: '260px' }}
              >
                <div className="flex items-center mb-4 text-2xl font-bold text-gray-900">
                  <FaExclamationCircle />
                  <span className="ml-2">Report a Problem</span>
                </div>
                <Link
                  href="/reports/new"
                  className="w-56 py-3 rounded-lg font-semibold text-white text-lg mb-4 bg-pink-600 hover:bg-pink-700 transition flex justify-center items-center"
                >
                  Report a Problem
                </Link>
                <p className="text-gray-500 text-center">Report issues to admins</p>
              </div>
            </>
          )}
          {/* ADMIN ONLY: Manage Users and Reports in separate cards */}
          {role === "admin" && (
            <>
              <div
                className="rounded-2xl shadow-lg bg-white border-t-4 flex flex-col items-center justify-center"
                style={{ borderTopColor: "#ef4444", width: '320px', height: '260px' }}
              >
                <div className="flex items-center mb-4 text-2xl font-bold text-gray-900">
                  <FaUserCog />
                  <span className="ml-2">Manage Users</span>
                </div>
                <Link
                  href="/admin/users"
                  className="w-56 py-3 rounded-lg font-semibold text-white text-lg mb-4 bg-red-600 hover:bg-red-700 transition flex justify-center items-center"
                >
                  Manage Users
                </Link>
              </div>
              <div
                className="rounded-2xl shadow-lg bg-white border-t-4 flex flex-col items-center justify-center"
                style={{ borderTopColor: "#ef4444", width: '320px', height: '260px' }}
              >
                <div className="flex items-center mb-4 text-2xl font-bold text-gray-900">
                  <FaExclamationCircle />
                  <span className="ml-2">Reports</span>
                </div>
                <Link
                  href="/reports"
                  className="w-56 py-3 rounded-lg font-semibold text-white text-lg mb-4 bg-red-600 hover:bg-red-700 transition flex justify-center items-center"
                >
                  Reports
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
