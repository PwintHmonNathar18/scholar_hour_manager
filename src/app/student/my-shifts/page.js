"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function MyShiftsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [shifts, setShifts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (status === "loading") return;
    
    if (!session) {
      router.replace("/signin");
      return;
    }

    fetchMyShifts();
  }, [session, status, router]);

  const fetchMyShifts = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/shifts/my-shifts`);
      const data = await response.json();
      
      if (response.ok) {
        setShifts(data.shifts || []);
      } else {
        setError(data.error || "Failed to fetch shifts");
      }
    } catch (err) {
      setError("Error loading shifts");
    } finally {
      setLoading(false);
    }
  };

  const cancelShift = async (shiftId) => {
    if (!confirm("Are you sure you want to cancel this shift?")) return;

    try {
      const response = await fetch(`/api/shifts/${shiftId}/cancel`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      if (response.ok) {
        // Refresh the shifts list
        fetchMyShifts();
      } else {
        const data = await response.json();
        setError(data.error || "Failed to cancel shift");
      }
    } catch (err) {
      setError("Error canceling shift");
    }
  };

  const deleteShift = async (shiftId) => {
    if (!window.confirm("Are you sure you want to delete this cancelled shift?")) return;
    try {
      const response = await fetch(`/api/shifts/${shiftId}/delete-booking`, {
        method: "DELETE",
      });
      if (response.ok) {
        setShifts(shifts.filter(s => s._id !== shiftId));
      } else {
        alert("Failed to delete shift.");
      }
    } catch (err) {
      alert("Error deleting shift.");
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (status === "loading" || loading) {
    return (
      <main className="max-w-4xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-6">My Shifts</h1>
        <p>Loading...</p>
      </main>
    );
  }

  if (!session) return null;

  return (
    <main className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">My Shifts</h1>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {shifts.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-600 mb-4">You haven&apos;t booked any shifts yet.</p>
          <a
            href="/browse"
            className="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Browse Available Shifts
          </a>
        </div>
      ) : (
        <div className="space-y-4">
          {shifts.map((shift) => {
            const booking = shift.bookings.find(b => b.student._id === session.user.id || b.student.email === session.user.email);
            const attendance = shift.attendances?.find(a => a.student._id === session.user.id || a.student.email === session.user.email);
            
            return (
              <div key={shift._id} className="border rounded-lg p-6 bg-white shadow-sm">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold">{shift.title}</h3>
                    <p className="text-gray-600">{shift.department}</p>
                    <p className="text-sm text-gray-500 mt-1">{shift.description}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-gray-600">
                      {formatDate(shift.start)}
                    </div>
                    <div className="font-medium">
                      {formatTime(shift.start)} - {formatTime(shift.end)}
                    </div>
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <div className="flex gap-4 text-sm">
                    <span className={`px-2 py-1 rounded ${
                      booking?.status === "booked" 
                        ? "bg-green-100 text-green-800" 
                        : "bg-red-100 text-red-800"
                    }`}>
                      {booking?.status === "booked" ? "Booked" : "Cancelled"}
                    </span>
                    
                    {booking?.bookedAt && (
                      <span className="text-gray-500">
                        Booked: {new Date(booking.bookedAt).toLocaleDateString()}
                      </span>
                    )}
                    
                    {attendance && (
                      <span className={`px-2 py-1 rounded ${
                        attendance.status === "verified" 
                          ? "bg-blue-100 text-blue-800"
                          : attendance.status === "rejected"
                          ? "bg-red-100 text-red-800" 
                          : "bg-yellow-100 text-yellow-800"
                      }`}>
                        Attendance: {attendance.status}
                      </span>
                    )}
                  </div>

                  {booking?.status === "booked" && new Date(shift.start) > new Date() && (
                    <button
                      onClick={() => cancelShift(shift._id)}
                      className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700"
                    >
                      Cancel Booking
                    </button>
                  )}
                  {booking?.status === "cancelled" && (
                    <button
                      onClick={() => deleteShift(shift._id)}
                      className="bg-gray-400 text-white px-3 py-1 rounded text-sm hover:bg-gray-600"
                    >
                      Delete
                    </button>
                  )}
                </div>

                {attendance?.note && (
                  <div className="mt-3 p-3 bg-gray-50 rounded">
                    <p className="text-sm"><strong>Note:</strong> {attendance.note}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </main>
  );
}
