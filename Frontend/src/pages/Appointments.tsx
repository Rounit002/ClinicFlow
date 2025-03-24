import React, { useEffect, useState } from "react";
import PageTitle from "@/components/ui/PageTitle";

const Appointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  // Filters
  const [searchTerm, setSearchTerm] = useState(""); // Name & Phone search
  const [selectedDate, setSelectedDate] = useState(""); // Date filter

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/appointments");

      if (!response.ok) {
        throw new Error(`Server responded with ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      console.log("✅ Appointments Data:", data);

      setAppointments(data);
      setFilteredAppointments(data);
    } catch (err) {
      console.error("❌ Error fetching appointments:", err);
      setError(`Failed to fetch appointments: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Apply Filters
  useEffect(() => {
    let filtered = appointments;

    // Filter by Name or Phone
    if (searchTerm) {
      filtered = filtered.filter(
        (apt) =>
          apt.patient_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          apt.patient_phone.includes(searchTerm)
      );
    }

    // Filter by Date
    if (selectedDate) {
      filtered = filtered.filter((apt) => apt.date === selectedDate);
    }

    setFilteredAppointments(filtered);
  }, [searchTerm, selectedDate, appointments]);

  if (isLoading) return <p className="text-center text-gray-600">Loading appointments...</p>;
  if (error) return <p className="text-red-500 text-center">{error}</p>;

  return (
    <div className="max-w-5xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <PageTitle title="Appointments" description="Manage and view all scheduled appointments" />

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <input
          type="text"
          placeholder="Search by name or phone..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border p-3 rounded-md w-full sm:w-1/2 focus:ring-2 focus:ring-blue-400"
        />

        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="border p-3 rounded-md w-full sm:w-1/2 focus:ring-2 focus:ring-blue-400"
        />
      </div>

      {/* Appointments List */}
      {filteredAppointments.length === 0 ? (
        <p className="text-center text-gray-500">No appointments found.</p>
      ) : (
        <div className="space-y-4">
          {filteredAppointments.map((apt) => (
            <div
              key={apt.id}
              className="p-5 bg-gray-50 border border-gray-200 rounded-lg shadow-sm transition-transform hover:scale-[1.02]"
            >
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-800">{apt.patient_name}</h3>
                <span
                  className={`px-3 py-1 text-sm font-medium rounded-lg ${
                    apt.status === "scheduled"
                      ? "bg-blue-100 text-blue-700"
                      : apt.status === "completed"
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {apt.status.charAt(0).toUpperCase() + apt.status.slice(1)}
                </span>
              </div>

              <div className="mt-2 text-gray-600">
                <p>
                  <strong>Date:</strong> {apt.date}
                </p>
                <p>
                  <strong>Reason:</strong> {apt.reason}
                </p>
                <p>
                  <strong>Phone:</strong> {apt.patient_phone}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Appointments;
