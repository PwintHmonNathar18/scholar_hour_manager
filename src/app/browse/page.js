"use client";
import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import Link from "next/link";

export default function BrowsePage() {
  const { data: session } = useSession();
  const [shifts, setShifts] = useState([]);
  const [filter, setFilter] = useState("");

  useEffect(() => {
    fetch(`/api/shifts${filter ? `?department=${encodeURIComponent(filter)}` : ""}`)
      .then((res) => res.json())
      .then((data) => setShifts(data.items || []));
  }, [filter]);

  // Supervisor: show create shift link
  // Student: show book/cancel buttons
  return (
    <main className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-6">Browse Shifts</h1>
      <div className="mb-4 flex gap-2">
        <input
          className="border p-2 rounded"
          placeholder="Filter by department"
          value={filter}
          onChange={e => setFilter(e.target.value)}
        />
        {session?.user?.role === "supervisor" && (
          <Link href="/browse/create" className="bg-black text-white px-4 py-2 rounded">Create Shift</Link>
        )}
      </div>
      <div className="space-y-4">
        {shifts.length === 0 ? (
          <div className="text-gray-500">No shifts found.</div>
        ) : (
          shifts.map(shift => (
            <div key={shift._id} className="border rounded-xl p-4 bg-white shadow">
              <div className="font-bold text-lg">{shift.title}</div>
              <div className="text-sm text-gray-600">{shift.department} | {new Date(shift.start).toLocaleString()} - {new Date(shift.end).toLocaleString()}</div>
              <div className="mt-2">{shift.description}</div>
              <div className="mt-2 text-sm">Slots: {shift.bookedBy.length} / {shift.maxSlots}</div>
              {session?.user?.role === "student" && (
                <div className="mt-2 flex gap-2">
                  {/* Book/cancel buttons will be implemented next */}
                  <button className="bg-blue-600 text-white px-3 py-1 rounded">Book</button>
                  <button className="bg-gray-300 px-3 py-1 rounded">Cancel</button>
                </div>
              )}
              {session?.user?.role === "supervisor" && (
                <div className="mt-2 flex gap-2">
                  <Link href={`/browse/edit/${shift._id}`} className="bg-yellow-500 text-white px-3 py-1 rounded">Edit</Link>
                  <button className="bg-red-500 text-white px-3 py-1 rounded">Delete</button>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </main>
  );
}
