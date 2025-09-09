"use client";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CreateShiftPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [form, setForm] = useState({
    title: "",
    department: "",
    start: "",
    end: "",
    maxSlots: 1,
    description: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  if (!session || session.user.role !== "supervisor") {
    return <div className="p-6">Only supervisors can create shifts.</div>;
  }

  const onChange = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    if (!form.title || !form.department || !form.start || !form.end || !form.maxSlots) {
      setError("Please fill all required fields.");
      return;
    }
    const res = await fetch("/api/shifts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form }),
    });
    if (res.ok) {
      setSuccess("Shift created!");
      setTimeout(() => router.push("/browse"), 1200);
    } else {
      const t = await res.text();
      setError(t || "Failed to create shift.");
    }
  };

  return (
    <main className="max-w-xl mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-6">Create Shift</h1>
      <form onSubmit={handleSubmit} className="space-y-4 bg-white rounded-xl shadow p-6">
        <div>
          <label className="block text-sm mb-1 font-medium">Title</label>
          <input type="text" value={form.title} onChange={onChange("title")} className="border p-2 rounded w-full" required />
        </div>
        <div>
          <label className="block text-sm mb-1 font-medium">Department</label>
          <input type="text" value={form.department} onChange={onChange("department")} className="border p-2 rounded w-full" required />
        </div>
        <div>
          <label className="block text-sm mb-1 font-medium">Start Time</label>
          <input type="datetime-local" value={form.start} onChange={onChange("start")} className="border p-2 rounded w-full" required />
        </div>
        <div>
          <label className="block text-sm mb-1 font-medium">End Time</label>
          <input type="datetime-local" value={form.end} onChange={onChange("end")} className="border p-2 rounded w-full" required />
        </div>
        <div>
          <label className="block text-sm mb-1 font-medium">Max Slots</label>
          <input type="number" min={1} value={form.maxSlots} onChange={onChange("maxSlots")} className="border p-2 rounded w-full" required />
        </div>
        <div>
          <label className="block text-sm mb-1 font-medium">Description</label>
          <textarea value={form.description} onChange={onChange("description")} className="border p-2 rounded w-full" />
        </div>
        {error && <div className="text-red-500 text-sm">{error}</div>}
        {success && <div className="text-green-600 text-sm">{success}</div>}
        <button className="bg-black text-white rounded py-2 px-4" type="submit">
          Create Shift
        </button>
      </form>
    </main>
  );
}
