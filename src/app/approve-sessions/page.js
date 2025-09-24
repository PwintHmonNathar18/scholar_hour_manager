"use client";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function ApproveSessionsPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [logs, setLogs] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (!session || session.user.role !== "supervisor") return;
    fetch("/api/session-logs?pending=true")
      .then((res) => res.json())
      .then((data) => setLogs(data.items || []));
  }, [session]);

  const approveLog = async (log) => {
    setError(""); setSuccess("");
    const res = await fetch(`/api/session-logs/approve`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ logId: log._id, userEmail: log.userEmail, minutes: log.minutes }),
    });
    if (res.ok) {
      setSuccess("Session approved!");
      setLogs((prev) => prev.filter((l) => l._id !== log._id));
    } else {
      setError("Failed to approve session.");
    }
  };

  const disapproveLog = async (log) => {
    setError(""); setSuccess("");
    const res = await fetch(`/api/session-logs/disapprove`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ logId: log._id }),
    });
    if (res.ok) {
      setSuccess("Session disapproved!");
      setLogs((prev) => prev.filter((l) => l._id !== log._id));
    } else {
      setError("Failed to disapprove session.");
    }
  };

  if (!session || session.user.role !== "supervisor") {
    return <div className="p-6">Only supervisors can approve sessions.</div>;
  }

  return (
    <main className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-6">Approve Session Logs</h1>
      {error && <div className="text-red-500 text-sm mb-2">{error}</div>}
      {success && <div className="text-green-600 text-sm mb-2">{success}</div>}
      <ul className="space-y-4">
        {logs.map((log) => (
          <li key={log._id} className="bg-white rounded shadow p-4">
            <div><b>User:</b> {log.userEmail}</div>
            <div><b>Start:</b> {new Date(log.startAt).toLocaleString()}</div>
            <div><b>End:</b> {new Date(log.endAt).toLocaleString()}</div>
            <div><b>Minutes:</b> {log.minutes}</div>
            <div className="flex gap-2 mt-3">
              <button 
                className="bg-green-600 text-white rounded py-2 px-4 hover:bg-green-700" 
                onClick={() => approveLog(log)}
              >
                Approve
              </button>
              <button 
                className="bg-red-600 text-white rounded py-2 px-4 hover:bg-red-700" 
                onClick={() => disapproveLog(log)}
              >
                Disapprove
              </button>
            </div>
          </li>
        ))}
      </ul>
    </main>
  );
}
