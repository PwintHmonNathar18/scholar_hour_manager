"use client";
import { useSession } from "next-auth/react";
import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function ShiftDetailsPage({ params }) {
  const { data: session } = useSession();
  const router = useRouter();
  const unwrappedParams = use(params);
  const [shift, setShift] = useState(null);
  const [loading, setLoading] = useState(true);
  const [attendanceForm, setAttendanceForm] = useState({
    studentEmail: "",
    checkInAt: "",
    checkOutAt: "",
    hours: "",
    note: "",
    action: "verify" // verify or reject
  });

  useEffect(() => {
    if (session?.user?.role !== "supervisor") {
      router.push("/dashboard");
      return;
    }

    // Fetch the shift data
    fetch(`/api/shifts/${unwrappedParams.id}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          alert("Shift not found");
          router.push("/supervisor/student-shifts");
          return;
        }
        setShift(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching shift:", err);
        alert("Error loading shift");
        router.push("/supervisor/student-shifts");
      });
  }, [session, unwrappedParams.id, router]);

  const handleAttendanceSubmit = async (e) => {
    e.preventDefault();
    
    if (!attendanceForm.studentEmail) {
      alert("Please enter student email");
      return;
    }

    const endpoint = attendanceForm.action === "verify" 
      ? `/api/shifts/${unwrappedParams.id}/attendance/verify`
      : `/api/shifts/${unwrappedParams.id}/attendance/reject`;

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          studentEmail: attendanceForm.studentEmail,
          checkInAt: attendanceForm.checkInAt || undefined,
          checkOutAt: attendanceForm.checkOutAt || undefined,
          hours: attendanceForm.hours ? parseFloat(attendanceForm.hours) : undefined,
          note: attendanceForm.note,
        }),
      });

      if (response.ok) {
        alert(`Attendance ${attendanceForm.action}d successfully!`);
        // Refresh shift data
        window.location.reload();
      } else {
        const result = await response.json();
        alert(result.error || `Failed to ${attendanceForm.action} attendance`);
      }
    } catch (error) {
      console.error("Error submitting attendance:", error);
      alert("Error submitting attendance");
    }
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setAttendanceForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  if (loading) {
    return (
      <main className="max-w-4xl mx-auto p-6">
        <div className="text-center">Loading shift details...</div>
      </main>
    );
  }

  if (!shift) {
    return (
      <main className="max-w-4xl mx-auto p-6">
        <div className="text-center text-red-500">Shift not found</div>
      </main>
    );
  }

  return (
    <main className="max-w-4xl mx-auto p-6">
      <div className="mb-6">
        <Link href="/supervisor/student-shifts" className="text-blue-600 hover:underline">
          ← Back to Student Shifts
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h1 className="text-2xl font-bold mb-4">{shift.title}</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <h3 className="font-semibold text-gray-700">Department</h3>
            <p>{shift.department}</p>
          </div>
          <div>
            <h3 className="font-semibold text-gray-700">Max Slots</h3>
            <p>{shift.maxSlots}</p>
          </div>
          <div>
            <h3 className="font-semibold text-gray-700">Start Time</h3>
            <p>{new Date(shift.start).toLocaleString()}</p>
          </div>
          <div>
            <h3 className="font-semibold text-gray-700">End Time</h3>
            <p>{new Date(shift.end).toLocaleString()}</p>
          </div>
        </div>

        <div className="mb-4">
          <h3 className="font-semibold text-gray-700">Description</h3>
          <p>{shift.description}</p>
        </div>

        <div className="flex gap-4 mb-6">
          <Link 
            href={`/browse/edit/${shift._id}`}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Edit Shift
          </Link>
        </div>
      </div>

      {/* Bookings Section */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-bold mb-4">Booked Students ({shift.bookings?.filter(b => b.status === "booked").length || 0})</h2>
        
        {shift.bookings && shift.bookings.length > 0 ? (
          <div className="space-y-3">
            {shift.bookings.filter(b => b.status === "booked").map((booking, index) => (
              <div key={index} className="border rounded-md p-3 bg-gray-50">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium">{booking.student?.name || "Unknown Student"}</p>
                    <p className="text-sm text-gray-600">{booking.student?.email}</p>
                    <p className="text-xs text-gray-500">Booked: {new Date(booking.bookedAt).toLocaleString()}</p>
                  </div>
                  <div className="text-sm">
                    <span className="bg-green-100 text-green-800 px-2 py-1 rounded">Booked</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No students have booked this shift yet.</p>
        )}
      </div>

      {/* Attendance Section */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-bold mb-4">Attendance Records ({shift.attendances?.length || 0})</h2>
        
        {shift.attendances && shift.attendances.length > 0 ? (
          <div className="space-y-3 mb-6">
            {shift.attendances.map((attendance, index) => (
              <div key={index} className="border rounded-md p-3 bg-gray-50">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium">{attendance.student?.name || "Unknown Student"}</p>
                    <p className="text-sm text-gray-600">{attendance.student?.email}</p>
                    {attendance.checkInAt && (
                      <p className="text-xs text-gray-500">Check In: {new Date(attendance.checkInAt).toLocaleString()}</p>
                    )}
                    {attendance.checkOutAt && (
                      <p className="text-xs text-gray-500">Check Out: {new Date(attendance.checkOutAt).toLocaleString()}</p>
                    )}
                    {attendance.hours && (
                      <p className="text-xs text-gray-500">Hours: {attendance.hours}</p>
                    )}
                    {attendance.note && (
                      <p className="text-xs text-gray-500">Note: {attendance.note}</p>
                    )}
                    {attendance.verifiedAt && (
                      <p className="text-xs text-gray-500">Verified: {new Date(attendance.verifiedAt).toLocaleString()}</p>
                    )}
                  </div>
                  <div className="text-sm">
                    <span className={`px-2 py-1 rounded ${
                      attendance.status === "verified" ? "bg-green-100 text-green-800" :
                      attendance.status === "rejected" ? "bg-red-100 text-red-800" :
                      "bg-yellow-100 text-yellow-800"
                    }`}>
                      {attendance.status}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 mb-6">No attendance records yet.</p>
        )}

        {/* Add Attendance Form */}
        <div className="border-t pt-6">
          <h3 className="text-lg font-semibold mb-4">Record Attendance</h3>
          <form onSubmit={handleAttendanceSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Student Email *</label>
                <input
                  type="email"
                  name="studentEmail"
                  value={attendanceForm.studentEmail}
                  onChange={handleFormChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Hours Worked</label>
                <input
                  type="number"
                  name="hours"
                  value={attendanceForm.hours}
                  onChange={handleFormChange}
                  step="0.1"
                  min="0"
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Check In Time</label>
                <input
                  type="datetime-local"
                  name="checkInAt"
                  value={attendanceForm.checkInAt}
                  onChange={handleFormChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Check Out Time</label>
                <input
                  type="datetime-local"
                  name="checkOutAt"
                  value={attendanceForm.checkOutAt}
                  onChange={handleFormChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Note</label>
              <textarea
                name="note"
                value={attendanceForm.note}
                onChange={handleFormChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
                rows="3"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Action</label>
              <div className="flex gap-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="action"
                    value="verify"
                    checked={attendanceForm.action === "verify"}
                    onChange={handleFormChange}
                    className="mr-2"
                  />
                  Verify Attendance
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="action"
                    value="reject"
                    checked={attendanceForm.action === "reject"}
                    onChange={handleFormChange}
                    className="mr-2"
                  />
                  Reject Attendance
                </label>
              </div>
            </div>

            <button
              type="submit"
              className={`px-6 py-2 rounded text-white ${
                attendanceForm.action === "verify" 
                  ? "bg-green-600 hover:bg-green-700" 
                  : "bg-red-600 hover:bg-red-700"
              }`}
            >
              {attendanceForm.action === "verify" ? "Verify" : "Reject"} Attendance
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
