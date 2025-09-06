"use client";

import { useEffect, useState } from "react";

export default function Home() {
  const [form, setForm] = useState({
    userEmail: "",
    activity: "",
    startAt: "",
    endAt: "",
  });
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [filterEmail, setFilterEmail] = useState("");

  const load = async (email = "") => {
    setLoading(true);
    const url = email
      ? `/api/session-logs?email=${encodeURIComponent(email)}`
      : "/api/session-logs";
    const res = await fetch(url, { cache: "no-store" });
    const data = await res.json();
    setLogs(data.items || []);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const onChange = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    // basic validation
    if (!form.userEmail || !form.activity || !form.startAt || !form.endAt) {
      alert("Please fill all fields.");
      return;
    }
    setSaving(true);
    const res = await fetch("/api/session-logs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setSaving(false);
    if (!res.ok) {
      const t = await res.text();
      alert("Failed to save: " + t);
      return;
    }
    // clear activity/time; keep email for convenience
    setForm((f) => ({ ...f, activity: "", startAt: "", endAt: "" }));
    await load(filterEmail || "");
  };

  const fmt = (d) => (d ? new Date(d).toLocaleString() : "");

  return (
    <main className="mx-auto max-w-4xl p-6 space-y-6">
      <h1 className="text-2xl font-semibold">Scholar Hour Manager</h1>

      {/* Create form */}
      <form
        onSubmit={submit}
        className="grid gap-3 sm:grid-cols-2 bg-white rounded-2xl p-4 shadow"
      >
        <input
          className="border p-2 rounded"
          placeholder="Student email"
          value={form.userEmail}
          onChange={onChange("userEmail")}
        />
        <input
          className="border p-2 rounded"
          placeholder="Activity (e.g., Library, Tutoring)"
          value={form.activity}
          onChange={onChange("activity")}
        />
        <label className="text-sm text-gray-600">Start</label>
        <label className="text-sm text-gray-600">End</label>
        <input
          type="datetime-local"
          className="border p-2 rounded"
          value={form.startAt}
          onChange={onChange("startAt")}
        />
        <input
          type="datetime-local"
          className="border p-2 rounded"
          value={form.endAt}
          onChange={onChange("endAt")}
        />

        <button
          className="col-span-full bg-black text-white rounded py-2 disabled:opacity-60"
          disabled={saving}
        >
          {saving ? "Saving..." : "Add Session Log"}
        </button>
      </form>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
        <input
          className="border p-2 rounded w-full sm:w-80"
          placeholder="Filter by email (optional)"
          value={filterEmail}
          onChange={(e) => setFilterEmail(e.target.value)}
        />
        <div className="flex gap-2">
          <button
            onClick={() => load(filterEmail)}
            className="px-3 py-2 rounded border"
          >
            Apply Filter
          </button>
          <button
            onClick={() => {
              setFilterEmail("");
              load("");
            }}
            className="px-3 py-2 rounded border"
          >
            Clear
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left p-3">Email</th>
              <th className="text-left p-3">Activity</th>
              <th className="text-left p-3">Start</th>
              <th className="text-left p-3">End</th>
              <th className="text-right p-3">Minutes</th>
              <th className="text-center p-3">Approved</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td className="p-4" colSpan={6}>
                  Loading…
                </td>
              </tr>
            ) : logs.length === 0 ? (
              <tr>
                <td className="p-4" colSpan={6}>
                  No logs yet.
                </td>
              </tr>
            ) : (
              logs.map((l) => (
                <tr key={l._id} className="border-t">
                  <td className="p-3">{l.userEmail}</td>
                  <td className="p-3">{l.activity}</td>
                  <td className="p-3">{fmt(l.startAt)}</td>
                  <td className="p-3">{fmt(l.endAt)}</td>
                  <td className="p-3 text-right">{l.minutes}</td>
                  <td className="p-3 text-center">{l.approved ? "✅" : "—"}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </main>
  );
}
