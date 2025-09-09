"use client";
import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";

export default function ProfilePage() {
  const { data: session } = useSession();
  const [form, setForm] = useState({
    name: "",
    email: "",
    department: "",
    program: "",
    GPA: "",
    workedHours: 0,
    approvedSessions: 0,
  });
  const [editing, setEditing] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (session?.user) {
      // Fetch user info from API (or session)
      fetch(`/api/profile`)
        .then((res) => res.json())
        .then((data) => {
          setForm({
            name: data.name || "",
            email: data.email || "",
            department: data.department || "",
            program: data.program || "",
            GPA: data.GPA || "",
            workedHours: data.workedHours || 0,
            approvedSessions: data.approvedSessions || 0,
          });
        });
    }
  }, [session]);

  const handleChange = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const handleSave = async (e) => {
    e.preventDefault();
    setMessage("");
    const res = await fetch("/api/profile", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    if (res.ok) {
      setMessage("Profile updated!");
      setEditing(false);
    } else {
      setMessage("Failed to update profile.");
    }
  };

  if (!session) return <div className="p-6">Please sign in to view your profile.</div>;

  return (
    <main className="max-w-xl mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-6 text-gray-900">Profile</h1>
      <form onSubmit={handleSave} className="space-y-4 bg-white rounded-xl shadow p-6">
        <div>
          <label className="block text-sm mb-1 text-gray-700 font-medium">ID (email)</label>
          <input type="text" value={form.email} disabled className="border p-2 rounded w-full bg-gray-100 text-gray-700" />
        </div>
        <div>
          <label className="block text-sm mb-1 text-gray-700 font-medium">Name</label>
          <input type="text" value={form.name} onChange={handleChange("name")} disabled={!editing} className="border p-2 rounded w-full text-gray-900" />
        </div>
        <div>
          <label className="block text-sm mb-1 text-gray-700 font-medium">Department</label>
          <input type="text" value={form.department} onChange={handleChange("department")} disabled={!editing} className="border p-2 rounded w-full text-gray-900" />
        </div>
        <div>
          <label className="block text-sm mb-1 text-gray-700 font-medium">Program</label>
          <input type="text" value={form.program} onChange={handleChange("program")} disabled={!editing} className="border p-2 rounded w-full text-gray-900" />
        </div>
        <div>
          <label className="block text-sm mb-1 text-gray-700 font-medium">GPA</label>
          <input type="number" step="0.01" value={form.GPA} onChange={handleChange("GPA")} disabled={!editing} className="border p-2 rounded w-full text-gray-900" />
        </div>
        <div>
          <label className="block text-sm mb-1 text-gray-700 font-medium">Worked Hours</label>
          <input type="text" value={(form.workedHours / 60).toFixed(2)} disabled className="border p-2 rounded w-full text-gray-900" />
        </div>
        <div>
          <label className="block text-sm mb-1 text-gray-700 font-medium">Approved Sessions</label>
          <input type="number" value={form.approvedSessions || 0} disabled className="border p-2 rounded w-full text-gray-900" />
        </div>
        {message && <div className="text-green-600 text-sm">{message}</div>}
        <div className="flex gap-2 mt-4">
          {!editing ? (
            <button type="button" className="bg-black text-white rounded py-2 px-4" onClick={() => setEditing(true)}>
              Edit
            </button>
          ) : (
            <>
              <button type="button" className="bg-black text-white rounded py-2 px-4" onClick={handleSave}>
                Save
              </button>
              <button type="button" className="bg-gray-300 rounded py-2 px-4 text-gray-900" onClick={() => setEditing(false)}>
                Cancel
              </button>
            </>
          )}
        </div>
      </form>
    </main>
  );
}
