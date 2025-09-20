"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminUserProfilePage({ params }) {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    role: "student",
    department: "",
    program: "",
    maxHoursPerWeek: ""
  });

  useEffect(() => {
    fetch(`/api/admin/users/${params.id}`)
      .then((res) => res.json())
      .then((data) => {
        setUser(data);
        setForm({
          name: data.name || "",
          email: data.email || "",
          role: data.role || "student",
          department: data.department || "",
          program: data.program || "",
          maxHoursPerWeek: data.maxHoursPerWeek || ""
        });
        setLoading(false);
      });
  }, [params.id]);

  const handleChange = (k, v) => {
    setForm(f => ({ ...f, [k]: v }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    const res = await fetch(`/api/admin/users/${params.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setSaving(false);
    if (res.ok) {
      alert("User profile updated.");
      router.push("/admin/users");
    } else {
      alert("Failed to update user profile.");
    }
  };

  if (loading) return <div className="p-6">Loading user profile...</div>;
  if (!user) return <div className="p-6 text-red-600">User not found.</div>;

  return (
    <main className="max-w-xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Edit User Profile</h1>
      <form onSubmit={handleSave} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Name</label>
          <input
            type="text"
            value={form.name}
            onChange={e => handleChange("name", e.target.value)}
            className="w-full border rounded px-3 py-2"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Email</label>
          <input
            type="email"
            value={form.email}
            onChange={e => handleChange("email", e.target.value)}
            className="w-full border rounded px-3 py-2"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Role</label>
          <select
            value={form.role}
            onChange={e => handleChange("role", e.target.value)}
            className="w-full border rounded px-3 py-2"
          >
            <option value="student">Student</option>
            <option value="supervisor">Supervisor</option>
            <option value="admin">Admin</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Department</label>
          <input
            type="text"
            value={form.department}
            onChange={e => handleChange("department", e.target.value)}
            className="w-full border rounded px-3 py-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Program</label>
          <input
            type="text"
            value={form.program}
            onChange={e => handleChange("program", e.target.value)}
            className="w-full border rounded px-3 py-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Max Hours Per Week</label>
          <input
            type="number"
            value={form.maxHoursPerWeek}
            onChange={e => handleChange("maxHoursPerWeek", e.target.value)}
            className="w-full border rounded px-3 py-2"
            min="0"
          />
        </div>
        <div className="flex gap-4 pt-4">
          <button
            type="submit"
            disabled={saving}
            className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 disabled:bg-green-300"
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
          <button
            type="button"
            onClick={() => router.push("/admin/users")}
            className="bg-gray-300 text-gray-700 px-6 py-2 rounded hover:bg-gray-400"
          >
            Cancel
          </button>
        </div>
      </form>
    </main>
  );
    const handleDelete = async () => {
      if (!confirm("Are you sure you want to delete this user?")) return;
      const res = await fetch(`/api/admin/users/${params.id}`, { method: "DELETE" });
      if (res.ok) {
        alert("User deleted.");
        router.push("/admin/users");
      } else {
        alert("Failed to delete user.");
      }
    };
}
