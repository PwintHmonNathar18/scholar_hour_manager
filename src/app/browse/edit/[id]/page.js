"use client";
import { useSession } from "next-auth/react";
import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";

export default function EditShiftPage({ params }) {
  const { data: session } = useSession();
  const router = useRouter();
  const unwrappedParams = use(params);
  const [shift, setShift] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    department: "",
    start: "",
    end: "",
    maxSlots: 1
  });

  useEffect(() => {
    if (session?.user?.role !== "supervisor") {
      router.push("/browse");
      return;
    }

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
        setFormData({
          title: data.title || "",
          description: data.description || "",
          department: data.department || "",
          start: data.start ? new Date(data.start).toISOString().slice(0, 16) : "",
          end: data.end ? new Date(data.end).toISOString().slice(0, 16) : "",
          maxSlots: data.maxSlots || 1
        });
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching shift:", err);
        alert("Error loading shift");
        router.push("/browse");
      });
  }, [session, unwrappedParams.id, router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const response = await fetch(`/api/shifts/${unwrappedParams.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.ok) {
        alert("Shift updated successfully!");
        router.push("/browse");
      } else {
        alert(result.error || "Failed to update shift");
      }
    } catch (error) {
      console.error("Error updating shift:", error);
      alert("Error updating shift");
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === "maxSlots" ? parseInt(value) || 1 : value
    }));
  };

  if (loading) {
    return (
      <main className="max-w-2xl mx-auto p-6">
        <div className="text-center">Loading shift...</div>
      </main>
    );
  }

  if (!shift) {
    return (
      <main className="max-w-2xl mx-auto p-6">
        <div className="text-center text-red-500">Shift not found</div>
      </main>
    );
  }

  return (
    <main className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-6">Edit Shift</h1>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Title</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md px-3 py-2"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md px-3 py-2"
            rows="3"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Department</label>
          <input
            type="text"
            name="department"
            value={formData.department}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md px-3 py-2"
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Start Time</label>
            <input
              type="datetime-local"
              name="start"
              value={formData.start}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">End Time</label>
            <input
              type="datetime-local"
              name="end"
              value={formData.end}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Maximum Slots</label>
          <input
            type="number"
            name="maxSlots"
            value={formData.maxSlots}
            onChange={handleChange}
            min="1"
            className="w-full border border-gray-300 rounded-md px-3 py-2"
            required
          />
        </div>

        <div className="bg-gray-50 p-4 rounded-md">
          <h3 className="font-medium mb-2">Current Bookings</h3>
          {shift.bookings && shift.bookings.length > 0 ? (
            <div className="space-y-1">
              {shift.bookings.filter(b => b.status === "booked").map((booking, index) => (
                <div key={index} className="text-sm text-gray-600">
                  • {booking.student?.name || booking.student?.email || "Unknown student"}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-sm text-gray-500">No bookings yet</div>
          )}
        </div>

        <div className="flex gap-4 pt-4">
          <button
            type="submit"
            disabled={saving}
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 disabled:bg-blue-300"
          >
            {saving ? "Saving..." : "Update Shift"}
          </button>
          
          <button
            type="button"
            onClick={() => router.push("/browse")}
            className="bg-gray-300 text-gray-700 px-6 py-2 rounded-md hover:bg-gray-400"
          >
            Cancel
          </button>
        </div>
      </form>
    </main>
  );
}
