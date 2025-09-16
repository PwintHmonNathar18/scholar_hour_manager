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
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    // Fetch the shift data
    fetch(`/api/shifts/${unwrappedParams.id}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          alert("Shift not found");
          router.push("/browse");
          return;
        }
        setShift(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching shift:", err);
        alert("Error loading shift");
        router.push("/browse");
      });
  }, [unwrappedParams.id, router]);

  const handleBookShift = async () => {
    setActionLoading(true);
    try {
      const response = await fetch(`/api/shifts/${unwrappedParams.id}/book`, {
        method: "POST",
      });

      if (response.ok) {
        alert("Shift booked successfully!");
        // Refresh shift data
        window.location.reload();
      } else {
        const result = await response.json();
        alert(result.error || "Failed to book shift");
      }
    } catch (error) {
      console.error("Error booking shift:", error);
      alert("Error booking shift");
    } finally {
      setActionLoading(false);
    }
  };

  const handleCancelBooking = async () => {
    if (!confirm("Are you sure you want to cancel your booking?")) {
      return;
    }

    setActionLoading(true);
    try {
      const response = await fetch(`/api/shifts/${unwrappedParams.id}/cancel`, {
        method: "POST",
      });

      if (response.ok) {
        alert("Booking cancelled successfully!");
        // Refresh shift data
        window.location.reload();
      } else {
        const result = await response.json();
        alert(result.error || "Failed to cancel booking");
      }
    } catch (error) {
      console.error("Error cancelling booking:", error);
      alert("Error cancelling booking");
    } finally {
      setActionLoading(false);
    }
  };

  // Check if current user has booked this shift
  const isBookedByCurrentUser = () => {
    if (!session?.user?.email || !shift?.bookings) return false;
    return shift.bookings.some(
      booking => booking.student?.email === session.user.email && booking.status === "booked"
    );
  };

  const getAvailableSlots = () => {
    if (!shift) return 0;
    const bookedCount = shift.bookings?.filter(b => b.status === "booked").length || 0;
    return shift.maxSlots - bookedCount;
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

  const availableSlots = getAvailableSlots();
  const isUserBooked = isBookedByCurrentUser();

  return (
    <main className="max-w-4xl mx-auto p-6">
      <div className="mb-6">
        <Link href="/browse" className="text-blue-600 hover:underline">
          ← Back to Browse Shifts
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h1 className="text-3xl font-bold mb-4">{shift.title}</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-gray-700 mb-1">Department</h3>
              <p className="text-lg">{shift.department}</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-700 mb-1">Start Time</h3>
              <p className="text-lg">{new Date(shift.start).toLocaleString()}</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-700 mb-1">End Time</h3>
              <p className="text-lg">{new Date(shift.end).toLocaleString()}</p>
            </div>
          </div>
          
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-gray-700 mb-1">Available Slots</h3>
              <p className="text-lg">
                <span className={availableSlots > 0 ? "text-green-600" : "text-red-600"}>
                  {availableSlots} available
                </span>
                <span className="text-gray-500"> / {shift.maxSlots} total</span>
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-700 mb-1">Current Bookings</h3>
              <p className="text-lg">{shift.bookings?.filter(b => b.status === "booked").length || 0} students booked</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-700 mb-1">Status</h3>
              <span className={`inline-block px-3 py-1 rounded-full text-sm ${
                availableSlots > 0 ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
              }`}>
                {availableSlots > 0 ? "Available" : "Full"}
              </span>
            </div>
          </div>
        </div>

        <div className="mb-6">
          <h3 className="font-semibold text-gray-700 mb-2">Description</h3>
          <p className="text-gray-800 leading-relaxed">{shift.description}</p>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 flex-wrap">
          {session?.user?.role === "student" && (
            <>
              {isUserBooked ? (
                <button
                  onClick={handleCancelBooking}
                  disabled={actionLoading}
                  className="bg-red-600 text-white px-6 py-2 rounded hover:bg-red-700 disabled:bg-red-300"
                >
                  {actionLoading ? "Cancelling..." : "Cancel Booking"}
                </button>
              ) : (
                <button
                  onClick={handleBookShift}
                  disabled={actionLoading || availableSlots <= 0}
                  className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 disabled:bg-blue-300"
                >
                  {actionLoading ? "Booking..." : "Book This Shift"}
                </button>
              )}
            </>
          )}
          
          {session?.user?.role === "supervisor" && (
            <>
              <Link 
                href={`/browse/edit/${shift._id}`}
                className="bg-yellow-500 text-white px-6 py-2 rounded hover:bg-yellow-600"
              >
                Edit Shift
              </Link>
              <Link 
                href={`/supervisor/shifts/${shift._id}`}
                className="bg-purple-600 text-white px-6 py-2 rounded hover:bg-purple-700"
              >
                Manage Attendance
              </Link>
            </>
          )}
        </div>

        {/* User Booking Status */}
        {session?.user?.role === "student" && isUserBooked && (
          <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-md">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-green-800">
                  You have successfully booked this shift!
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Booked Students (visible to all) */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold mb-4">Booked Students</h2>
        
        {shift.bookings && shift.bookings.length > 0 ? (
          <div className="space-y-2">
            {shift.bookings.filter(b => b.status === "booked").map((booking, index) => (
              <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-md">
                <div>
                  <p className="font-medium">{booking.student?.name || "Student"}</p>
                  {session?.user?.role === "supervisor" && (
                    <p className="text-sm text-gray-600">{booking.student?.email}</p>
                  )}
                </div>
                <div className="text-sm text-gray-500">
                  Booked: {new Date(booking.bookedAt).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No students have booked this shift yet.</p>
        )}
      </div>
    </main>
  );
}
