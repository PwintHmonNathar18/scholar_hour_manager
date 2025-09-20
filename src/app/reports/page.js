"use client";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

export default function ReportsPage() {
  const { data: session } = useSession();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (session?.user?.role === "admin") {
      fetch("/api/reports")
        .then(res => res.json())
        .then(data => {
          setReports(data.items || []);
          setLoading(false);
        });
    }
  }, [session]);

  if (!session?.user) return <div className="p-6">Please sign in.</div>;
  if (session.user.role !== "admin") return <div className="p-6">Only admins can view reports.</div>;

  return (
    <main className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Reported Problems</h1>
      {loading ? (
        <div>Loading reports...</div>
      ) : reports.length === 0 ? (
        <div>No reports found.</div>
      ) : (
        <div className="space-y-4">
          {reports.map(report => (
            <div key={report._id} className="border rounded p-4 bg-white shadow">
              <div className="font-bold text-lg">{report.title}</div>
              <div className="text-sm text-gray-600 mb-2">
                Reported by: {report.reporter?.name || "Unknown"} ({report.reporterRole})<br />
                {new Date(report.createdAt).toLocaleString()}
              </div>
              <div>{report.description}</div>
              <div className="mt-2 text-xs text-gray-500">Status: {report.status}</div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
