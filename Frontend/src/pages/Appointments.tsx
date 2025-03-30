import React, { useEffect, useState } from "react";
import PageTitle from "@/components/ui/PageTitle";
import { motion } from "framer-motion";

const Appointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDate, setSelectedDate] = useState("");

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const response = await fetch("https://clinicflow-e7a9.onrender.com/api/appointments");
      if (!response.ok) throw new Error(`Server responded with ${response.status}: ${response.statusText}`);
      const data = await response.json();
      setAppointments(data);
      setFilteredAppointments(data);
    } catch (err) {
      setError(`Failed to fetch appointments: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    let filtered = appointments;
    if (searchTerm) {
      filtered = filtered.filter(
        (apt) => apt.patient_name.toLowerCase().includes(searchTerm.toLowerCase()) || apt.patient_phone.includes(searchTerm)
      );
    }
    if (selectedDate) {
      filtered = filtered.filter((apt) => apt.date === selectedDate);
    }
    setFilteredAppointments(filtered);
  }, [searchTerm, selectedDate, appointments]);

  if (isLoading) return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="text-center text-clinic-800 text-xl min-h-screen flex items-center justify-center"
      style={{ background: 'linear-gradient(135deg, #E0EFFF, #F0F7FF)' }}
    >
      Loading appointments...
    </motion.div>
  );

  if (error) return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="text-center text-clinic-800 text-xl min-h-screen flex items-center justify-center"
      style={{ background: 'linear-gradient(135deg, #E0EFFF, #F0F7FF)' }}
    >
      {error}
    </motion.div>
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="min-h-screen p-8 relative overflow-hidden"
      style={{ background: 'linear-gradient(135deg, #E0EFFF, #F0F7FF)' }} // clinic-100 to clinic-50
    >
      {/* Overlay for better readability */}
      <div className="absolute inset-0 bg-white/30" />
      <div className="relative z-10">
        <PageTitle
          title="Appointments"
          description="Manage your schedule"
          className="text-clinic-800"
        />
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <motion.div whileHover={{ scale: 1.02 }} whileFocus={{ scale: 1.05 }} className="w-full sm:w-1/2">
            <input
              type="text"
              placeholder="Search by name or phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="border border-clinic-200 p-3 rounded-lg w-full bg-clinic-50 text-black placeholder-clinic-600 focus:ring-2 focus:ring-clinic-400 focus:border-transparent transition-all ripple"
            />
          </motion.div>
          <motion.div whileHover={{ scale: 1.02 }} whileFocus={{ scale: 1.05 }} className="w-full sm:w-1/2">
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="border border-clinic-200 p-3 rounded-lg w-full bg-clinic-50 text-black focus:ring-2 focus:ring-clinic-400 focus:border-transparent transition-all ripple"
            />
          </motion.div>
        </div>
        {filteredAppointments.length === 0 ? (
          <p className="text-center text-black text-lg">No appointments found.</p>
        ) : (
          <div className="space-y-6">
            {filteredAppointments.map((apt, index) => (
              <motion.div
                key={apt.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1, duration: 0.4 }}
                whileHover={{ scale: 1.02, boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)" }}
                className="p-6 bg-gradient-to-br from-white to-clinic-50 rounded-xl border border-clinic-200 shadow-sm"
              >
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-bold text-clinic-800">{apt.patient_name}</h3>
                  <span
                    className={`px-4 py-1 text-sm font-medium rounded-full text-clinic-800 ${
                      apt.status === "scheduled"
                        ? "bg-clinic-100"
                        : apt.status === "completed"
                        ? "bg-clinic-200"
                        : "bg-clinic-300"
                    }`}
                  >
                    {apt.status.charAt(0).toUpperCase() + apt.status.slice(1)}
                  </span>
                </div>
                <div className="mt-3 text-black">
                  <p><strong>Date:</strong> {apt.date}</p>
                  <p><strong>Reason:</strong> {apt.reason}</p>
                  <p><strong>Phone:</strong> {apt.patient_phone}</p>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default Appointments;