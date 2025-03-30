import React, { useEffect, useState } from "react";
import PageTitle from "@/components/ui/PageTitle";
import StatCard from "@/components/dashboard/StatCard";
import AppointmentPreview from "@/components/dashboard/AppointmentPreview";
import { Users, Calendar, Activity } from "lucide-react";
import { motion } from "framer-motion";

const Dashboard = () => {
  const [stats, setStats] = useState({ totalPatients: 0, totalAppointments: 0, revenue: 0, satisfaction: 0 });
  const [appointments, setAppointments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const statsRes = await fetch("https://clinicflow-e7a9.onrender.com/api/dashboard/stats");
      const statsData = await statsRes.json();
      setStats(statsData);

      const appointmentsRes = await fetch("https://clinicflow-e7a9.onrender.com/api/appointments");
      if (!appointmentsRes.ok) throw new Error(`Failed to fetch appointments: ${appointmentsRes.status}`);
      const appointmentsData = await appointmentsRes.json();
      const today = new Date().toISOString().split("T")[0];
      const todaysAppointments = appointmentsData
        .filter((apt) => apt.date === today)
        .map((apt) => ({
          id: apt.id,
          patientName: apt.patient_name,
          patientPhone: apt.patient_phone,
          date: apt.date,
          time: "N/A",
          status: apt.status,
          type: apt.reason,
        }));
      setAppointments(todaysAppointments);
    } catch (error) {
      setError("Failed to load dashboard data.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="text-center text-gray-600 text-xl min-h-screen flex items-center justify-center"
      style={{ background: 'linear-gradient(135deg, #E8F0FE, #F7F9FB)' }}
    >
      Loading...
    </motion.div>
  );

  if (error) return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="text-red-500 text-center text-xl min-h-screen flex items-center justify-center"
      style={{ background: 'linear-gradient(135deg, #E8F0FE, #F7F9FB)' }}
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
      style={{ background: 'linear-gradient(135deg, #E8F0FE, #F7F9FB)' }}
    >
      {/* Overlay for better readability */}
      <div className="absolute inset-0 bg-white/30" />
      <div className="relative z-10">
        <PageTitle
          title="Dashboard"
          description="Clinic activity at a glance"
          className="text-blue-700"
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ y: 50, rotateX: 20, opacity: 0 }}
            animate={{ y: 0, rotateX: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            whileHover={{ scale: 1.05, boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)" }}
            className="p-6 bg-white rounded-xl border-2 border-transparent gradient-border"
          >
            <StatCard title="Total Patients" value={stats.totalPatients} icon={Users} trend="up" />
          </motion.div>
          <motion.div
            initial={{ y: 50, rotateX: 20, opacity: 0 }}
            animate={{ y: 0, rotateX: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            whileHover={{ scale: 1.05, boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)" }}
            className="p-6 bg-white rounded-xl border-2 border-transparent gradient-border"
          >
            <StatCard title="Appointments" value={stats.totalAppointments} icon={Calendar} trend="up" />
          </motion.div>
          <motion.div
            initial={{ y: 50, rotateX: 20, opacity: 0 }}
            animate={{ y: 0, rotateX: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            whileHover={{ scale: 1.05, boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)" }}
            className="p-6 bg-white rounded-xl border-2 border-transparent gradient-border"
          >
            <StatCard title="Satisfaction" value={`${stats.satisfaction}%`} icon={Activity} trend="neutral" />
          </motion.div>
        </div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="bg-white rounded-xl shadow-lg border-2 border-transparent gradient-border p-6"
        >
          <AppointmentPreview appointments={appointments} />
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Dashboard;