// src/app/supervisor/student-shifts/page.js
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function StudentShiftsPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/supervisor/shifts-with-students")
      .then((r) => r.json())
      .then((d) => {
        setData(d);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="p-6">Loading…</div>;
  if (!Array.isArray(data)) return <div className="p-6">No data.</div>;

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Students per Shift</h1>

      <div className="space-y-4">
        {data.map((shift) => (
          <div key={shift._id} className="border rounded-md p-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-semibold text-lg">{shift.title}</h2>
                <p className="text-sm text-gray-600">
                  {new Date(shift.start).toLocaleString()} – {new Date(shift.end).toLocaleString()}
                </p>
              </div>
              <Link
                href={`/supervisor/shifts/${shift._id}`}
                className="text-sm bg-black text-white px-3 py-1 rounded"
              >
                Shift Detail
              </Link>
            </div>

            {/* Booked students */}
            <div className="mt-4">
              <h3 className="font-medium">Booked Students</h3>
              {shift.bookings?.length ? (
                <ul className="list-disc pl-6">
                  {shift.bookings
                    .filter((b) => b.status === "booked")
                    .map((b, i) => (
                      <li key={i}>
                        {b.student?.name || "(no name)"} – {b.student?.email}
                        <span className="text-xs text-gray-500">
                          {"  "}({new Date(b.bookedAt).toLocaleString()})
                        </span>
                      </li>
                    ))}
                </ul>
              ) : (
                <p className="text-sm text-gray-500">No bookings.</p>
              )}
            </div>

            {/* Worked students (attendances) */}
            <div className="mt-4">
              <h3 className="font-medium">Worked / Attendance</h3>
              {shift.attendances?.length ? (
                <ul className="list-disc pl-6">
                  {shift.attendances.map((a, i) => (
                    <li key={i}>
                      {a.student?.name || "(no name)"} – {a.student?.email} ·{" "}
                      <span className="uppercase text-xs">{a.status}</span>
                      {a.hours ? ` · ${a.hours}h` : ""}
                      {a.verifiedBy ? ` · verified by ${a.verifiedBy.name}` : ""}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-gray-500">No attendance records.</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
