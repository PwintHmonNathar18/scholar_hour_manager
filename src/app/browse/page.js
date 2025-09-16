"use client";
import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import Link from "next/link";

export default function BrowsePage() {
  const { data: session } = useSession();
  const [shifts, setShifts] = useState([]);
  const [filter, setFilter] = useState("");
  const [loadingActions, setLoadingActions] = useState({});

  useEffect(() => {
    fetch(`/api/shifts${filter ? `?department=${encodeURIComponent(filter)}` : ""}`)
      .then((res) => res.json())
      .then((data) => setShifts(data.items || []));
  }, [filter]);

  const refreshShifts = () => {
    fetch(`/api/shifts${filter ? `?department=${encodeURIComponent(filter)}` : ""}`)
      .then((res) => res.json())
      .then((data) => setShifts(data.items || []));
  };

  const handleBookShift = async (shiftId) => {
    setLoadingActions(prev => ({ ...prev, [shiftId]: 'booking' }));
    
    try {
      const response = await fetch(`/api/shifts/${shiftId}/book`, {
        method: "POST",
      });

      if (response.ok) {
        alert("Shift booked successfully!");
        refreshShifts();
      } else {
        const result = await response.json();
        alert(result.error || "Failed to book shift");
      }
    } catch (error) {
      console.error("Error booking shift:", error);
      alert("Error booking shift");
    } finally {
      setLoadingActions(prev => ({ ...prev, [shiftId]: null }));
    }
  };

  const handleCancelBooking = async (shiftId) => {
    if (!confirm("Are you sure you want to cancel your booking?")) {
      return;
    }

    setLoadingActions(prev => ({ ...prev, [shiftId]: 'cancelling' }));
    
    try {
      const response = await fetch(`/api/shifts/${shiftId}/cancel`, {
        method: "POST",
      });

      if (response.ok) {
        alert("Booking cancelled successfully!");
        refreshShifts();
      } else {
        const result = await response.json();
        alert(result.error || "Failed to cancel booking");
      }
    } catch (error) {
      console.error("Error cancelling booking:", error);
      alert("Error cancelling booking");
    } finally {
      setLoadingActions(prev => ({ ...prev, [shiftId]: null }));
    }
  };

  // Check if current user has booked a specific shift
  const isBookedByCurrentUser = (shift) => {
    if (!session?.user?.email || !shift?.bookings) return false;
    return shift.bookings.some(
      booking => booking.student?.email === session.user.email && booking.status === "booked"
    );
  };

  // Get available slots for a shift
  const getAvailableSlots = (shift) => {
    if (!shift) return 0;
    const bookedCount = shift.bookings?.filter(b => b.status === "booked").length || 0;
    return shift.maxSlots - bookedCount;
  };

  const handleDeleteShift = async (shiftId) => {
    if (!confirm("Are you sure you want to delete this shift?")) {
      return;
    }

    try {
      const response = await fetch(`/api/shifts/${shiftId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        alert("Shift deleted successfully!");
        // Refresh the shifts list
        const updatedShifts = shifts.filter(shift => shift._id !== shiftId);
        setShifts(updatedShifts);
      } else {
        const result = await response.json();
        alert(result.error || "Failed to delete shift");
      }
    } catch (error) {
      console.error("Error deleting shift:", error);
      alert("Error deleting shift");
    }
  };

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
              <div className="mt-2 text-sm">
                Slots: {shift.bookings?.filter(b => b.status === "booked").length || 0} / {shift.maxSlots}
                {getAvailableSlots(shift) <= 0 && (
                  <span className="ml-2 text-red-600 font-medium">(Full)</span>
                )}
                {session?.user?.role === "student" && isBookedByCurrentUser(shift) && (
                  <span className="ml-2 text-green-600 font-medium">✓ Booked</span>
                )}
              </div>
              
              {/* Common actions for all users */}
              <div className="mt-3 flex gap-2 flex-wrap">
                <Link 
                  href={`/shifts/${shift._id}`} 
                  className="bg-gray-600 text-white px-3 py-1 rounded text-sm"
                >
                  View Details
                </Link>
                
                {session?.user?.role === "student" && (
                  <>
                    {isBookedByCurrentUser(shift) ? (
                      <button 
                        onClick={() => handleCancelBooking(shift._id)}
                        disabled={loadingActions[shift._id] === 'cancelling'}
                        className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700 disabled:bg-red-300"
                      >
                        {loadingActions[shift._id] === 'cancelling' ? 'Cancelling...' : 'Cancel Booking'}
                      </button>
                    ) : (
                      <button 
                        onClick={() => handleBookShift(shift._id)}
                        disabled={loadingActions[shift._id] === 'booking' || getAvailableSlots(shift) <= 0}
                        className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 disabled:bg-blue-300"
                      >
                        {loadingActions[shift._id] === 'booking' ? 'Booking...' : 
                         getAvailableSlots(shift) <= 0 ? 'Full' : 'Book'}
                      </button>
                    )}
                  </>
                )}
                
                {session?.user?.role === "supervisor" && (
                  <>
                    <Link href={`/browse/edit/${shift._id}`} className="bg-yellow-500 text-white px-3 py-1 rounded text-sm">Edit</Link>
                    <button 
                      onClick={() => handleDeleteShift(shift._id)}
                      className="bg-red-500 text-white px-3 py-1 rounded text-sm"
                    >
                      Delete
                    </button>
                  </>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </main>
  );
}
