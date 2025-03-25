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
      const response = await fetch(`https://clinicflow-e7a9.onrender.com/api/auth/user`, {
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

      const response = await fetch(`https://clinicflow-e7a9.onrender.com/api/appointments/user/${user.id}`, {
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      });

      if (response.status === 404) {
        setAppointments([]);
        return;
      }
      if (!response.ok) {
        const errorText = await response.text();
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

  const handleViewDetails = (appointment: any) => {
    setSelectedAppointment(appointment);
    setIsDialogOpen(true);
  };

  const handleDownload = async (documentId: string, fileName: string) => {
    const token = localStorage.getItem("token");
    const downloadUrl = `https://clinicflow-e7a9.onrender.com/api/documents/download/${documentId}`;
  
    const isCordova = !!window.cordova;
  
    try {
      if (!token) {
        console.error("❌ No token found in localStorage");
        alert("You are not authenticated. Please log in and try again.");
        return;
      }
  
      if (isCordova) {
        // Wait for deviceready event to ensure plugins are loaded
        await new Promise<void>((resolve) => {
          document.addEventListener("deviceready", () => {
            console.log("✅ deviceready event fired");
            resolve();
          }, false);
        });
  
        // Check network status
        if (navigator.connection && navigator.connection.type === "none") {
          console.error("❌ No internet connection");
          alert("No internet connection. Please connect to the internet and try again.");
          return;
        }
  
        // Sanitize fileName to remove invalid characters
        const sanitizedFileName = fileName.replace(/[^a-zA-Z0-9.-]/g, "_");
        console.log("Sanitized file name:", sanitizedFileName);
  
        // Log available directories
        console.log("Documents directory:", cordova.file.documentsDirectory);
        console.log("External data directory:", cordova.file.externalDataDirectory);
        console.log("Cache directory:", cordova.file.cacheDirectory);
  
        // Download using fetch and save using cordova-plugin-file
        console.log("Fetching from:", downloadUrl);
        console.log("Token:", token);
  
        const response = await fetch(downloadUrl, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
  
        if (!response.ok) {
          let errorMessage = "Failed to download file";
          try {
            const errorData = await response.json();
            console.error("❌ Download failed:", {
              status: response.status,
              statusText: response.statusText,
              errorData,
            });
            errorMessage = errorData.message || errorMessage;
          } catch (jsonError) {
            console.error("❌ Failed to parse error response:", jsonError);
            errorMessage = `Server error (Status: ${response.status})`;
          }
          throw new Error(errorMessage);
        }
  
        const blob = await response.blob();
        console.log("✅ File downloaded, blob size:", blob.size);
  
        // Try multiple directories as a fallback
        const directories = [
          cordova.file.externalDataDirectory, // App-specific external storage (preferred for Android 10+)
          cordova.file.cacheDirectory,        // Temporary storage (usually works without permissions)
          cordova.file.documentsDirectory,    // Documents directory (might require permissions)
        ].filter(dir => dir); // Filter out null/undefined directories
  
        let targetPath = null;
        let fileSaved = false;
        let lastError = null;
  
        for (const directory of directories) {
          try {
            targetPath = `${directory}${sanitizedFileName}`;
            console.log("Attempting to save to:", targetPath);
  
            await new Promise((resolve, reject) => {
              window.resolveLocalFileSystemURL(
                directory,
                (dirEntry: any) => {
                  console.log(`✅ Accessed directory: ${directory}`);
                  dirEntry.getFile(
                    sanitizedFileName,
                    { create: true, exclusive: false },
                    (fileEntry: any) => {
                      console.log("✅ Created file entry");
                      fileEntry.createWriter(
                        (fileWriter: any) => {
                          fileWriter.onwriteend = () => {
                            console.log("✅ File saved to: " + fileEntry.toURL());
                            resolve(fileEntry.toURL());
                          };
                          fileWriter.onerror = (e: any) => {
                            console.error("❌ Failed to write file:", e);
                            reject(new Error("Failed to write file"));
                          };
                          fileWriter.write(blob);
                        },
                        (error: any) => {
                          console.error("❌ Error creating file writer:", error);
                          reject(new Error("Failed to create file writer"));
                        }
                      );
                    },
                    (error: any) => {
                      console.error("❌ Error getting file:", {
                        errorCode: error.code,
                        errorMessage: error.message || "Unknown error",
                      });
                      reject(new Error("Failed to access file system"));
                    }
                  );
                },
                (error: any) => {
                  console.error(`❌ Error accessing directory ${directory}:`, {
                    errorCode: error.code,
                    errorMessage: error.message || "Unknown error",
                  });
                  reject(new Error("Failed to access directory"));
                }
              );
            });
  
            fileSaved = true;
            break; // Exit the loop if successful
          } catch (error) {
            lastError = error;
            console.error(`❌ Failed to save file in ${directory}:`, error);
          }
        }
  
        if (!fileSaved) {
          throw new Error(`Failed to save file in any directory: ${lastError?.message || "Unknown error"}`);
        }
  
        alert("File downloaded successfully: " + sanitizedFileName);
  
        // Optionally open the file
        if (window.cordova.plugins.fileOpener2) {
          window.cordova.plugins.fileOpener2.open(
            targetPath,
            "application/pdf", // Adjust MIME type based on file
            {
              error: (e: any) => {
                console.error("❌ Error opening file:", e);
                alert("Failed to open file.");
              },
              success: () => {
                console.log("✅ File opened successfully");
              },
            }
          );
        }
      } else {
        // Browser download
        console.log("Fetching from:", downloadUrl);
        console.log("Token:", token);
  
        const response = await fetch(downloadUrl, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
  
        if (!response.ok) {
          let errorMessage = "Failed to download file";
          try {
            const errorData = await response.json();
            console.error("❌ Download failed:", {
              status: response.status,
              statusText: response.statusText,
              errorData,
            });
            errorMessage = errorData.message || errorMessage;
          } catch (jsonError) {
            console.error("❌ Failed to parse error response:", jsonError);
            errorMessage = `Server error (Status: ${response.status})`;
          }
          throw new Error(errorMessage);
        }
  
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      }
    } catch (error) {
      console.error("❌ Error downloading file:", error);
      alert(`Failed to download: ${error.message}`);
      throw error;
    }
  };

  return (
    <div className="space-y-6">
      <PageTitle title="My Prescriptions" description="Your booked appointments and uploaded prescriptions by doctor." />

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {appointments.length > 0 ? (
          appointments.map((appointment: any) => (
            <Card key={appointment.id} className="overflow-hidden">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-base">Patient: {appointment.patient_name || "N/A"}</CardTitle>
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
                  appointment.documents.map((doc: any) => (
                    <Button
                      key={doc.id}
                      variant="outline"
                      size="sm"
                      className="w-full"
                      onClick={() => handleDownload(doc.id, doc.file_name)}
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