import React, { useEffect, useState } from "react";
import PageTitle from "@/components/ui/PageTitle";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Download, Calendar, Eye } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";

const Prescriptions = () => {
  const [appointments, setAppointments] = useState([]);
  const [user, setUser] = useState(null);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

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
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/auth/user`, {
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
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Authentication required");

      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/appointments/user/${user.id}`, {
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      });

      if (response.status === 404) {
        setAppointments([]);
        return;
      }
      if (!response.ok) {
        const errorText = await response.text(); // Log the raw response for debugging
        console.error("❌ Fetch appointments failed:", response.status, errorText);
        throw new Error("Failed to fetch appointments");
      }
      const data = await response.json();
      setAppointments(data);
    } catch (error) {
      console.error("❌ Error fetching appointments:", error);
      setAppointments([]);
    }
  };

  const handleViewDetails = (appointment) => {
    setSelectedAppointment(appointment);
    setIsDialogOpen(true);
  };

  const handleDownload = (documentId) => {
    const token = localStorage.getItem("token");
    const downloadUrl = `${process.env.REACT_APP_API_URL}/api/documents/download/${documentId}`;

    const link = document.createElement("a");
    link.href = downloadUrl;
    link.setAttribute("download", "");
    link.setAttribute("rel", "noopener noreferrer");
    link.setAttribute("Authorization", `Bearer ${token}`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
                    <CardTitle className="text-base">Doctor: {appointment.doctor_type || "N/A"}</CardTitle>
                    <CardDescription className="mt-1 flex items-center text-xs text-muted-foreground gap-1">
                      <Calendar className="h-3 w-3" /> {new Date(appointment.date).toLocaleDateString()}
                    </CardDescription>
                  </div>
                  <Badge variant={appointment.status === "completed" ? "default" : "secondary"}>
                    {appointment.status}
                  </Badge>
                </div>
              </CardHeader>

              <CardContent className="space-y-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full"
                  onClick={() => handleViewDetails(appointment)}
                >
                  <Eye className="h-4 w-4 mr-1" /> View Details
                </Button>

                {appointment.documents && appointment.documents.length > 0 ? (
                  appointment.documents.map((doc) => (
                    <Button
                      key={doc.id}
                      variant="outline"
                      size="sm"
                      className="w-full"
                      onClick={() => handleDownload(doc.id)}
                    >
                      <Download className="h-4 w-4 mr-1" /> Download {doc.file_name}
                    </Button>
                  ))
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

      {selectedAppointment && (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Appointment Details</DialogTitle>
              <DialogDescription>
                Details for the appointment on {new Date(selectedAppointment.date).toLocaleDateString()}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-2">
              <p><strong>Patient:</strong> {selectedAppointment.patient_name || "N/A"}</p>
              <p><strong>Doctor:</strong> {selectedAppointment.doctor_type || "N/A"}</p>
              <p><strong>Date:</strong> {new Date(selectedAppointment.date).toLocaleDateString()}</p>
              <p><strong>Time:</strong> {selectedAppointment.appointment_time || "N/A"}</p>
              <p><strong>Patient Name:</strong> {selectedAppointment.patient_name || "N/A"}</p>
              <p><strong>Patient Phone:</strong> {selectedAppointment.patient_phone || "N/A"}</p>
              <p><strong>Purpose:</strong> {selectedAppointment.reason}</p>
              <p><strong>Status:</strong> {selectedAppointment.status}</p>
              <p><strong>Notes:</strong> {selectedAppointment.notes || "N/A"}</p>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default Prescriptions;