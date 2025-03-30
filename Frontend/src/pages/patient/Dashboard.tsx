import React, { useEffect, useState } from 'react';
import PageTitle from '@/components/ui/PageTitle';
import { Button } from '@/components/ui/button';
import { CalendarPlus, CreditCard, Clock, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { motion } from 'framer-motion';
import { format, isToday, isBefore, isAfter } from 'date-fns';
import { cn } from '@/lib/utils'; // Import cn to fix the error

const PatientDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [user, setUser] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);

  useEffect(() => {
    fetchUserData();
  }, []);

  useEffect(() => {
    if (user?.id) {
      fetchAppointments();
      fetchRecentActivity();
    }
  }, [user]);

  const fetchUserData = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;
      const response = await fetch("https://clinicflow-e7a9.onrender.com/api/auth/user", {
        method: "GET",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      });
      if (!response.ok) throw new Error("Failed to fetch user");
      const userData = await response.json();
      setUser(userData);
    } catch (error) {
      console.error("❌ Error fetching user data:", error);
    }
  };

  const fetchAppointments = async () => {
    try {
      const response = await fetch(`https://clinicflow-e7a9.onrender.com/api/appointments/patient/${user.id}/latest`);
      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
      const data = await response.json();
      setAppointments(data.message ? [] : [data]);
    } catch (error) {
      console.error("Error fetching latest appointment:", error);
    }
  };

  const fetchRecentActivity = async () => {
    try {
      if (!user?.id) return;
      const response = await fetch(`https://clinicflow-e7a9.onrender.com/api/users/patient/${user.id}/recent-activity`);
      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
      const data = await response.json();
      setRecentActivity(data);
    } catch (error) {
      console.error("❌ Error fetching recent activity:", error);
    }
  };

  // Function to determine the date color based on the appointment date
  const getDateColor = (dateStr: string) => {
    const appointmentDate = new Date(dateStr);
    const today = new Date();
    if (isToday(appointmentDate)) {
      return "text-blue-600"; // Current date: Blue
    } else if (isBefore(appointmentDate, today)) {
      return "text-red-600"; // Previous date: Red
    } else if (isAfter(appointmentDate, today)) {
      return "text-orange-400"; // Upcoming date: Light Orange
    }
    return "text-gray-500"; // Fallback
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="relative min-h-screen p-6 md:p-8 max-w-5xl mx-auto"
      style={{ background: 'linear-gradient(135deg, #F7FAFF, #F0F7FF)' }} // clinic-50 to clinic-100
    >
      {/* Overlay for better readability */}
      <div className="absolute inset-0 bg-white/30" />

      <div className="relative z-10">
        <PageTitle
          title="Patient Dashboard"
          description="View your health information and upcoming appointments."
          titleClassName="text-clinic-800"
          descriptionClassName="text-black"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-2xl p-6 border border-clinic-200 shadow-md"
          >
            <div className="flex items-start">
              <div className="h-12 w-12 rounded-full bg-clinic-50 flex items-center justify-center mr-4">
                <User className="h-6 w-6 text-clinic-600" />
              </div>
              <div>
                <h3 className="font-medium text-clinic-800">Welcome back</h3>
                <p className="text-2xl font-bold text-black">{user ? user.username : "Loading..."}</p>
              </div>
            </div>
          </motion.div>
          <motion.div
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="bg-green-50 rounded-2xl p-6 border border-clinic-200 shadow-md"
          >
            <div className="flex items-start">
              <div className="h-12 w-12 rounded-full bg-white flex items-center justify-center mr-4">
                <Clock className="h-6 w-6 text-clinic-600" />
              </div>
              <div>
                <h3 className="font-medium text-clinic-800">Next Appointment</h3>
                <p className="text-lg font-semibold text-black">
                  {appointments.length > 0 ? `${appointments[0].date} - ${appointments[0].appointment_time}` : "No upcoming appointments"}
                </p>
                <motion.div whileHover={{ scale: 1.05 }}>
                  <Button
                    variant="link"
                    className="p-0 h-auto text-clinic-600 hover:text-clinic-700 ripple"
                    onClick={() => navigate('/patient/book-appointment')}
                  >
                    {appointments.length > 0 ? "Reschedule" : "Book Appointment"}
                  </Button>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-2xl p-6 border border-clinic-200 shadow-md mb-8"
        >
          <h3 className="font-semibold mb-4 text-lg text-clinic-800">Quick Actions</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <motion.div whileHover={{ scale: 1.05 }}>
              <Button
                variant="outline"
                className="w-full h-auto p-4 flex flex-col items-center justify-center gap-2 border-clinic-200 hover:bg-clinic-50 text-clinic-800 ripple"
                onClick={() => navigate('/patient/book-appointment')}
              >
                <CalendarPlus className="h-6 w-6 text-clinic-600" />
                <span>Book Appointment</span>
              </Button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }}>
              <Button
                variant="outline"
                className="w-full h-auto p-4 flex flex-col items-center justify-center gap-2 border-clinic-200 hover:bg-clinic-50 text-clinic-800 ripple"
                onClick={() => navigate('/patient/prescriptions')}
              >
                <CreditCard className="h-6 w-6 text-clinic-600" />
                <span>My Appointment</span>
              </Button>
            </motion.div>
          </div>
        </motion.div>
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-2xl p-6 border border-clinic-200 shadow-md"
        >
          <h3 className="font-semibold mb-4 text-lg text-clinic-800">Recent Activity</h3>
          <div className="border-l-2 border-clinic-200 pl-4 space-y-4">
            {recentActivity.length > 0 ? (
              recentActivity.map((activity: any, index: number) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <p className={cn("text-sm", getDateColor(activity.date))}>
                    {activity.date} at {activity.created_at}
                  </p>
                  <p className="font-medium text-black">
                    {activity.patient_name}, {activity.patient_phone}, appointment with {activity.doctor_type} ({activity.date}) at {activity.appointment_time}
                  </p>
                </motion.div>
              ))
            ) : (
              <p className="text-black">No recent activity</p>
            )}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default PatientDashboard;