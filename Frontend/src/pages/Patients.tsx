import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PageTitle from "@/components/ui/PageTitle";
import PatientList from "@/components/patients/PatientList";
import { useToast } from "@/hooks/use-toast";
import { toast } from "sonner";
import { motion } from "framer-motion";

const Patients = () => {
  const navigate = useNavigate();
  const { toast: uiToast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [patients, setPatients] = useState([]);
  const [error, setError] = useState(null);

  const fetchPatients = async () => {
    setIsLoading(true);
    setError(null);

    try {
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

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to fetch patients");
      }

      const data = await response.json();
      setPatients(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch patients");
      toast.error("Failed to load patients data");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  const handleAddPatient = () => {
    uiToast({
      title: "Patient Management",
      description: "Add patient feature coming soon",
    });
  };

  const handleEditPatient = (patient) => {
    if (!patient || !patient.id) {
      toast.error("Invalid patient data. Cannot edit.");
      return;
    }
    navigate(`/patients/${patient.id}/edit`);
  };

  const handleDeletePatient = (patient) => {
    uiToast({
      title: "Patient Management",
      description: `Delete patient feature coming soon`,
      variant: "destructive",
    });
  };

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
          title="Patients"
          description="Manage patient records"
          className="text-clinic-700"
        />
        {error && (
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.4 }}
            className="bg-clinic-50 border border-clinic-300 text-clinic-800 px-4 py-3 rounded-xl mb-6"
          >
            {error}
          </motion.div>
        )}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="gradient-border"
        >
          <PatientList
            patients={patients}
            isLoading={isLoading}
            onAddPatient={handleAddPatient}
            onEditPatient={handleEditPatient}
            onDeletePatient={handleDeletePatient}
          />
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Patients;