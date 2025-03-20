import React, { useEffect, useState } from 'react';
import PageTitle from '@/components/ui/PageTitle';
import { Button } from '@/components/ui/button';
import { CalendarPlus, CreditCard, Calendar, Clock, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

const PatientDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [user, setUser] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);

  // ✅ Fetch user details on component mount
  useEffect(() => {
    fetchUserData();
  }, []);

  useEffect(() => {
    if (user?.id) {
      fetchAppointments();
      fetchRecentActivity();
    }
  }, [user]); // ✅ Ensures appointments & activity load only after user data is set

  const fetchUserData = async () => {
    try {
      console.log("🔍 Fetching logged-in user data...");

      const token = localStorage.getItem("token");
      if (!token) {
        console.error("❌ No token found");
        return;
      }

      const response = await fetch("http://localhost:3000/api/auth/user", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) throw new Error("Failed to fetch user");

      const userData = await response.json();
      console.log("✅ Logged-in User:", userData);

      setUser(userData);
    } catch (error) {
      console.error("❌ Error fetching user data:", error);
    }
  };

  const fetchAppointments = async () => {
    try {
      const response = await fetch(`http://localhost:3000/api/appointments/patient/${user.id}/latest`);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      console.log("Latest Appointment:", data);
  
      if (data.message) {
        setAppointments([]); // No appointment found
      } else {
        setAppointments([data]); // Store as an array
      }
    } catch (error) {
      console.error("Error fetching latest appointment:", error);
    }
  };  

  const fetchRecentActivity = async () => {
    try {
      if (!user?.id) return;
  
      console.log("🟡 Fetching recent activity for user:", user.id);
  
      const response = await fetch(`http://localhost:3000/api/users/patient/${user.id}/recent-activity`);
  
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
  
      const data = await response.json();
      console.log("✅ Recent Activity:", data);
      setRecentActivity(data);
    } catch (error) {
      console.error("❌ Error fetching recent activity:", error);
    }
  };  
  
  return (
    <div className="max-w-5xl mx-auto">
      <PageTitle title="Patient Dashboard" description="View your health information and upcoming appointments." />

      {/* ✅ User Info & Next Appointment */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-2xl p-6 border shadow">
          <div className="flex items-start">
            <div className="h-12 w-12 rounded-full bg-gray-100 flex items-center justify-center mr-4">
              <User className="h-6 w-6 text-gray-600" />
            </div>
            <div>
              <h3 className="font-medium">Welcome back</h3>
              <p className="text-2xl font-bold">{user ? user.username : "Loading..."}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border shadow">
          <div className="flex items-start">
            <div className="h-12 w-12 rounded-full bg-gray-100 flex items-center justify-center mr-4">
              <Clock className="h-6 w-6 text-gray-600" />
            </div>
            <div>
              <h3 className="font-medium">Next Appointment</h3>
                <p className="text-lg font-semibold">
                {appointments.length > 0 ? `${appointments[0].date} - ${appointments[0].appointment_time}` : "No upcoming appointments"}
                </p>

              <Button variant="link" className="p-0 h-auto text-blue-600" onClick={() => navigate('/patient/book-appointment')}>
                {appointments.length > 0 ? "Reschedule" : "Book Appointment"}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* ✅ Quick Actions */}
      <div className="grid grid-cols-1 gap-6 mb-8">
        <div className="bg-white rounded-2xl p-6 border shadow">
          <h3 className="font-medium mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Button variant="outline" className="h-auto p-4 flex flex-col items-center justify-center gap-2" onClick={() => navigate('/patient/book-appointment')}>
              <CalendarPlus className="h-6 w-6 text-blue-600" />
              <span>Book Appointment</span>
            </Button>

            <Button variant="outline" className="h-auto p-4 flex flex-col items-center justify-center gap-2" onClick={() => navigate('/patient/bills')}>
              <CreditCard className="h-6 w-6 text-blue-600" />
              <span>View Bills</span>
            </Button>
          </div>
        </div>
      </div>

      {/* ✅ Recent Activity */}
<div className="bg-white rounded-2xl p-6 border shadow">
  <h3 className="font-medium mb-4">Recent Activity</h3>
  <div className="border-l-2 border-gray-200 pl-4 space-y-4">
    {recentActivity.length > 0 ? (
      recentActivity.map((activity, index) => (
        <div key={index}>
          <p className="text-sm text-gray-500">{activity.date} at {activity.created_at}</p>
          <p className="font-medium">
            {activity.patient_name},{activity.patient_phone}, appointment with {activity.doctor_type} ({activity.date}) at {activity.appointment_time}
          </p>
        </div>
      ))
    ) : (
      <p>No recent activity</p>
    )}
  </div>
</div>

    </div>
  );
};

export default PatientDashboard;
