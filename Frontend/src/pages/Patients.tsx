import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // ✅ Import navigation
import PageTitle from "@/components/ui/PageTitle";
import PatientList, { Patient } from "@/components/patients/PatientList";
import { useToast } from "@/hooks/use-toast";
import { toast } from "sonner";

const Patients = () => {
  const navigate = useNavigate(); // ✅ Initialize navigation
  const { toast: uiToast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [error, setError] = useState<string | null>(null);

  // ✅ Fetch patients from API
  const fetchPatients = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // ✅ Get token from localStorage
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Authentication required");
        setIsLoading(false);
        return;
      }

      const response = await fetch("https://clinicflow-e7a9.onrender.com/api/patients", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      console.log("Patient fetch response status:", response.status);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to fetch patients");
      }

      const data = await response.json();
      console.log("Patients data received:", data);

      setPatients(data);
    } catch (err) {
      console.error("Error fetching patients:", err);
      setError(err instanceof Error ? err.message : "Failed to fetch patients");
      toast.error("Failed to load patients data");
    } finally {
      setIsLoading(false);
    }
  };

  // ✅ Fetch patients on component mount
  useEffect(() => {
    fetchPatients();
  }, []);

  const handleAddPatient = () => {
    console.log("Add new patient");
    uiToast({
      title: "Patient Management",
      description: "Add patient feature coming soon",
    });
  };

  const handleEditPatient = (patient: Patient) => {
    if (!patient || !patient.id) {
      console.error("❌ Error: Patient ID is missing");
      toast.error("Invalid patient data. Cannot edit.");
      return;
    }
  
    const editUrl = `/patients/${patient.id}/edit`;
    console.log(`🔄 Navigating to: ${editUrl}`); // ✅ Debugging log
    navigate(editUrl); // ✅ Navigate to Edit Page
  };
  

  const handleDeletePatient = (patient: Patient) => {
    console.log("Delete patient:", patient);
    uiToast({
      title: "Patient Management",
      description: `Delete patient feature coming soon`,
      variant: "destructive",
    });
  };

  return (
    <div>
      <PageTitle title="Patients" description="Manage and view patient records." />

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
      )}

      <PatientList
        patients={patients}
        isLoading={isLoading}
        onAddPatient={handleAddPatient}
        onEditPatient={handleEditPatient} // ✅ Pass edit function
        onDeletePatient={handleDeletePatient}
      />
    </div>
  );
};

export default Patients;
