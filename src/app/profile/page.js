"use client";
import { useSession } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { useState, useEffect, Suspense } from "react";

function ProfileContent() {
  const { data: session } = useSession();
  const searchParams = useSearchParams();
  const requestedEmail = searchParams.get("email");
  const [form, setForm] = useState({
    name: "",
    email: "",
    department: "",
    program: "",
    workedHours: 0,
    approvedSessions: 0,
    contact: "",
    availableHour: "",
  });
  const [editing, setEditing] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (session?.user || requestedEmail) {
      // Fetch user info from API (or session)
      const url = requestedEmail ? `/api/profile?email=${encodeURIComponent(requestedEmail)}` : `/api/profile`;
      fetch(url)
        .then((res) => res.json())
        .then((data) => {
          setForm({
            name: data.name || "",
            email: data.email || "",
            department: data.department || "",
            program: data.program || "",
            workedHours: data.workedHours || 0,
            approvedSessions: data.approvedSessions || 0,
            contact: data.contact || "",
            availableHour: data.availableHour || "",
          });
        });
    }
  }, [session]);

  const handleChange = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const handleSave = async (e) => {
    e.preventDefault();
    setMessage("");
    // Only send relevant fields for each role
    let payload = {
      name: form.name,
      department: form.department,
    };
    if (session?.user?.role === "student") {
      payload.program = form.program;
    }
    if (session?.user?.role === "supervisor" || session?.user?.role === "admin") {
      payload.contact = form.contact;
      payload.availableHour = form.availableHour;
    }
    const res = await fetch("/api/profile", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (res.ok) {
      setMessage("Profile updated!");
      setEditing(false);
    } else {
      setMessage("Failed to update profile.");
    }
  };

  if (!session) return <div className="p-6">Please sign in to view your profile.</div>;
  // If viewing another user's profile, do not show edit controls
  const isOwnProfile = !requestedEmail || (session?.user?.email === requestedEmail);

  return (
    <main className="w-full min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-pink-50">
      <div className="max-w-lg w-full bg-white rounded-2xl shadow-xl p-8 flex flex-col items-center">
        <div className="flex flex-col items-center mb-6">
          <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-blue-400 to-pink-400 flex items-center justify-center mb-2 shadow">
            <span className="text-5xl">👤</span>
          </div>
          <h1 className="text-3xl font-extrabold text-gray-900 mb-1">{form.name || "Profile"}</h1>
          <p className="text-gray-500 text-sm">{form.email}</p>
        </div>
        <form onSubmit={handleSave} className="w-full grid grid-cols-1 gap-5">
          <div className="flex items-center gap-3">
            <label className="w-32 text-gray-700 font-medium">Department</label>
            <input type="text" value={form.department} onChange={handleChange("department")} disabled={!editing} className="border p-2 rounded w-full text-gray-900 bg-gray-50" />
          </div>
          {(session?.user?.role === "supervisor" || session?.user?.role === "admin" || (form.role === "supervisor" || form.role === "admin")) && (
            <>
              <div className="flex items-center gap-3">
                <label className="w-32 text-gray-700 font-medium">Contact</label>
                <input type="text" value={form.contact} onChange={handleChange("contact")} disabled={!editing} className="border p-2 rounded w-full text-gray-900 bg-gray-50" />
              </div>
              <div className="flex items-center gap-3">
                <label className="w-32 text-gray-700 font-medium">Available Hour</label>
                <input type="text" value={form.availableHour} onChange={handleChange("availableHour")} disabled={!editing} className="border p-2 rounded w-full text-gray-900 bg-gray-50" />
              </div>
            </>
          )}
          {(session?.user?.role === "student" || form.role === "student") && (
            <>
              <div className="flex items-center gap-3">
                <label className="w-32 text-gray-700 font-medium">Program</label>
                <input type="text" value={form.program} onChange={handleChange("program")} disabled={!editing} className="border p-2 rounded w-full text-gray-900 bg-gray-50" />
              </div>
              <div className="flex items-center gap-3">
                <label className="w-32 text-gray-700 font-medium">Worked Hours</label>
                <input type="text" value={(form.workedHours / 60).toFixed(2) + " hrs"} disabled className="border p-2 rounded w-full text-gray-900 bg-gray-50" />
              </div>
              <div className="flex items-center gap-3">
                <label className="w-32 text-gray-700 font-medium">Approved Sessions</label>
                <input type="number" value={form.approvedSessions || 0} disabled className="border p-2 rounded w-full text-gray-900 bg-gray-50" />
              </div>
            </>
          )}
          {message && <div className="text-green-600 text-sm text-center">{message}</div>}
          { (session?.user?.role === "admin" || session?.user?.email === form.email) && isOwnProfile && (
            <div className="flex gap-4 justify-center mt-4">
              {!editing ? (
                <button type="button" className="bg-gradient-to-r from-blue-500 to-pink-500 text-white rounded-lg py-2 px-6 font-bold shadow" onClick={() => setEditing(true)}>
                  Edit Profile
                </button>
              ) : (
                <>
                  <button type="button" className="bg-gradient-to-r from-blue-500 to-pink-500 text-white rounded-lg py-2 px-6 font-bold shadow" onClick={handleSave}>
                    Save
                  </button>
                  <button type="button" className="bg-gray-200 rounded-lg py-2 px-6 text-gray-900 font-bold shadow" onClick={() => setEditing(false)}>
                    Cancel
                  </button>
                </>
              )}
            </div>
          )}
        </form>
      </div>
    </main>
  );
}

export default function ProfilePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading profile...</p>
        </div>
      </div>
    }>
      <ProfileContent />
    </Suspense>
  );
}
