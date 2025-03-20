import React, { useEffect, useState } from "react";
import PageTitle from "@/components/ui/PageTitle";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Download, Calendar } from "lucide-react";

const Prescriptions = () => {
  const [appointments, setAppointments] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetchUserData();
  }, []);

  useEffect(() => {
    if (user?.id) {
      fetchAppointments();
    }
  }, [user]);

  const fetchUserData = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const response = await fetch("http://localhost:3000/api/auth/user", {
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      });
      if (!response.ok) throw new Error("Failed to fetch user");
      const data = await response.json();
      setUser(data);
    } catch (error) {
      console.error("❌ Error fetching user:", error);
    }
  };

  const fetchAppointments = async () => {
    try {
      const response = await fetch(`http://localhost:3000/api/appointments/user/${user.id}`);
      if (!response.ok) throw new Error("Failed to fetch appointments");
      const data = await response.json();
      setAppointments(data);
    } catch (error) {
      console.error("❌ Error fetching appointments:", error);
    }
  };

  return (
    <div className="space-y-6">
      <PageTitle title="My Prescriptions" description="Your booked appointments and uploaded prescriptions by doctor." />

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {appointments.length > 0 ? (
          appointments.map((appointment) => (
            <Card key={appointment.id} className="overflow-hidden">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-base">Doctor: {appointment.doctor_name}</CardTitle>
                    <CardDescription className="mt-1 flex items-center text-xs text-muted-foreground gap-1">
                      <Calendar className="h-3 w-3" /> {appointment.date}
                    </CardDescription>
                  </div>
                  <Badge variant="default">{appointment.status}</Badge>
                </div>
              </CardHeader>

              <CardContent>
                {/* Download Button if prescription uploaded */}
                {appointment.prescription_file ? (
                  <Button variant="outline" size="sm" className="h-8 w-full">
                    <a
                      href={`http://localhost:3000${appointment.prescription_file}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Download className="h-4 w-4 mr-1" /> Download Prescription
                    </a>
                  </Button>
                ) : (
                  <p className="text-sm text-gray-500">No prescription uploaded yet.</p>
                )}
              </CardContent>
            </Card>
          ))
        ) : (
          <p className="text-center text-gray-500">No appointments found.</p>
        )}
      </div>
    </div>
  );
};

export default Prescriptions;
