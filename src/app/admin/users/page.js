"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingUser, setEditingUser] = useState(null);
  const [editForm, setEditForm] = useState({ name: "", email: "", role: "student" });

  useEffect(() => {
    fetch("/api/admin/users")
      .then((res) => res.json())
      .then((data) => {
        setUsers(data.items || []);
        setLoading(false);
      });
  }, []);

  const handleDelete = async (userId) => {
    if (!confirm("Are you sure you want to delete this user?")) return;
    const res = await fetch(`/api/admin/users/${userId}`, { method: "DELETE" });
    if (res.ok) {
      setUsers(users.filter(u => u._id !== userId));
      alert("User deleted.");
    } else {
      alert("Failed to delete user.");
    }
  };

  const startEdit = (user) => {
    setEditingUser(user._id);
    setEditForm({ name: user.name, email: user.email, role: user.role });
  };

  const cancelEdit = () => {
    setEditingUser(null);
    setEditForm({ name: "", email: "", role: "student" });
  };

  const handleEditChange = (k, v) => {
    setEditForm(f => ({ ...f, [k]: v }));
  };

  const saveEdit = async () => {
    const res = await fetch(`/api/admin/users/${editingUser}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editForm),
    });
    if (res.ok) {
      const updated = await res.json();
      setUsers(users.map(u => u._id === editingUser ? updated : u));
      cancelEdit();
      alert("User updated.");
    } else {
      alert("Failed to update user.");
    }
  };

  return (
    <main className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Manage Users</h1>
      {loading ? (
        <div>Loading users...</div>
      ) : (
        <table className="w-full border rounded shadow text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 text-left">Name</th>
              <th className="p-3 text-left">Email</th>
              <th className="p-3 text-left">Role</th>
              <th className="p-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user._id} className="border-t">
                <td className="p-3">
                  {editingUser === user._id ? (
                    <input
                      value={editForm.name}
                      onChange={e => handleEditChange("name", e.target.value)}
                      className="border p-1 rounded w-full"
                    />
                  ) : (
                    user.name
                  )}
                </td>
                <td className="p-3">
                  {editingUser === user._id ? (
                    <input
                      value={editForm.email}
                      onChange={e => handleEditChange("email", e.target.value)}
                      className="border p-1 rounded w-full"
                    />
                  ) : (
                    user.email
                  )}
                </td>
                <td className="p-3">
                  {editingUser === user._id ? (
                    <select
                      value={editForm.role}
                      onChange={e => handleEditChange("role", e.target.value)}
                      className="border p-1 rounded w-full"
                    >
                      <option value="student">Student</option>
                      <option value="supervisor">Supervisor</option>
                      <option value="admin">Admin</option>
                    </select>
                  ) : (
                    user.role
                  )}
                </td>
                <td className="p-3 text-right">
                  <Link
                    href={`/admin/users/${user._id}`}
                    className="bg-blue-600 text-white px-2 py-1 rounded mr-2"
                  >
                    View
                  </Link>
                  <button
                    onClick={() => handleDelete(user._id)}
                    className="bg-red-600 text-white px-2 py-1 rounded"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </main>
  );
}
