import React, { useEffect, useState } from "react";
import PageTitle from "@/components/ui/PageTitle";
import StatCard from "@/components/dashboard/StatCard";
import AppointmentPreview from "@/components/dashboard/AppointmentPreview";
import { Users, Calendar, Activity } from "lucide-react";

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
      const statsRes = await fetch("http://localhost:3000/api/dashboard/stats");
      const statsData = await statsRes.json();
      setStats(statsData);

      const appointmentsRes = await fetch("http://localhost:3000/api/appointments");

      if (!appointmentsRes.ok) {
        throw new Error(`Failed to fetch appointments: ${appointmentsRes.status}`);
      }

      const appointmentsData = await appointmentsRes.json();
      console.log("✅ Appointments Data:", appointmentsData); // Debugging log

      // ✅ Get today's date in YYYY-MM-DD format
      const today = new Date().toISOString().split("T")[0];

      // ✅ Filter appointments that match today's date
      const todaysAppointments = appointmentsData
        .filter((apt) => apt.date === today)
        .map((apt) => ({
          id: apt.id,
          patientName: apt.patient_name, // ✅ Match API `patient_name`
          patientPhone: apt.patient_phone, // ✅ Match API `patient_phone`
          date: apt.date,
          time: "N/A", // ✅ Use "N/A" if time is not provided
          status: apt.status,
          type: apt.reason, // ✅ Map `reason` to `type`
        }));

      setAppointments(todaysAppointments);
    } catch (error) {
      console.error("❌ Error fetching dashboard data:", error);
      setError("Failed to load dashboard data.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div>
      <PageTitle title="Dashboard" description="Overview of clinic activity and performance." />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard title="Total Patients" value={stats.totalPatients} icon={Users} trend="up" />
        <StatCard title="Appointments" value={stats.totalAppointments} icon={Calendar} trend="up" />
        <StatCard title="Patient Satisfaction" value={`${stats.satisfaction}%`} icon={Activity} trend="neutral" />
      </div>

      {/* Pass only today's appointments */}
      <AppointmentPreview appointments={appointments} />
    </div>
  );
};

export default Dashboard;
