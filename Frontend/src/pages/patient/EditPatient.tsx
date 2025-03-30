import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { motion } from 'framer-motion';

const EditPatient = () => {
  const { patientId } = useParams();
  const [patient, setPatient] = useState(null);
  const [documents, setDocuments] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [documentsError, setDocumentsError] = useState(null);

  useEffect(() => {
    if (patientId) {
      fetchPatientDetails();
      fetchDocuments();
    }
  }, [patientId]);

  const fetchPatientDetails = async () => {
    try {
      const response = await fetch(`https://clinicflow-e7a9.onrender.com/api/patients/${patientId}`);
      if (!response.ok) throw new Error("Failed to fetch patient details");
      const data = await response.json();
      setPatient(data);
    } catch (error) {
      console.error("❌ Error fetching patient details:", error);
    }
  };

  const fetchDocuments = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Authentication required');
      const response = await fetch(`https://clinicflow-e7a9.onrender.com/api/documents/${patientId}`, {
        method: 'GET',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      });
      if (!response.ok) throw new Error("Failed to fetch documents");
      const data = await response.json();
      setDocuments(data);
      setDocumentsError(null);
    } catch (error) {
      console.error("❌ Error fetching documents:", error);
      setDocumentsError(error.message);
    }
  };

  const handleFileChange = (event) => {
    setSelectedFiles([...event.target.files]);
  };

  const handleUpload = async (event) => {
    event.preventDefault();
    if (!selectedFiles.length) return alert("Please select files to upload.");
    const formData = new FormData();
    selectedFiles.forEach((file) => formData.append("documents", file));
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Authentication required');
      const response = await fetch(`https://clinicflow-e7a9.onrender.com/api/documents/${patientId}`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      if (!response.ok) throw new Error("Upload failed");
      fetchDocuments();
      setSelectedFiles([]);
    } catch (error) {
      console.error("❌ Error uploading documents:", error.message);
    }
  };

  const handleDelete = async (documentId) => {
    if (!window.confirm("Are you sure you want to delete this document?")) return;
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Authentication required');
      const response = await fetch(`https://clinicflow-e7a9.onrender.com/api/documents/${documentId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error("Delete failed");
      fetchDocuments();
    } catch (error) {
      console.error("❌ Error deleting document:", error);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="max-w-4xl mx-auto p-6 bg-card shadow-lg rounded-lg space-y-6"
    >
      {patient ? (
        <>
          <motion.h2
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.4 }}
            className="text-2xl font-bold text-foreground"
          >
            {patient.name}'s Profile
          </motion.h2>
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.4 }}
            className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-muted p-4 rounded-lg shadow-sm"
          >
            <p className="text-foreground"><strong>Email:</strong> {patient.email}</p>
            <p className="text-foreground"><strong>Phone:</strong> {patient.phone}</p>
            <p className="text-foreground"><strong>Address:</strong> {patient.address || "N/A"}</p>
            <p className="text-foreground"><strong>Medical History:</strong> {patient.medical_history || "N/A"}</p>
            <p className="text-foreground"><strong>Last Visit:</strong> {patient.lastVisit || "N/A"}</p>
          </motion.div>
          <div className="border-t border-border pt-4">
            <h3 className="text-lg font-semibold text-foreground">Upload Documents</h3>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4 }}
              className="flex flex-col sm:flex-row gap-2 mt-2"
            >
              <input
                type="file"
                multiple
                onChange={handleFileChange}
                className="w-full border border-border p-2 rounded focus:ring-2 focus:ring-violet-400"
              />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleUpload}
                className="w-full sm:w-auto bg-violet-600 text-white px-4 py-2 rounded-lg hover:bg-violet-700 transition disabled:bg-gray-400"
                disabled={!selectedFiles.length}
              >
                Upload
              </motion.button>
            </motion.div>
          </div>
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.4 }}
          >
            <h3 className="text-lg font-semibold text-foreground mt-6">Uploaded Documents</h3>
            <ul className="bg-muted p-4 rounded-lg border border-border">
              {documentsError ? (
                <p className="text-red-600">{documentsError}</p>
              ) : documents.length === 0 ? (
                <p className="text-muted-foreground">No documents uploaded yet.</p>
              ) : (
                documents.map((doc, index) => (
                  <motion.li
                    key={doc.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: index * 0.1 }}
                    className="p-3 flex flex-col sm:flex-row sm:justify-between sm:items-center border-b border-border last:border-b-0 space-y-2 sm:space-y-0"
                  >
                    <a
                      href={`https://clinicflow-e7a9.onrender.com${doc.file_path}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-violet-600 hover:underline"
                    >
                      {doc.file_name}
                    </a>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      onClick={() => handleDelete(doc.id)}
                      className="w-full sm:w-auto text-red-600 hover:text-red-700 px-3 py-1 rounded border border-red-600 sm:border-0"
                    >
                      Delete
                    </motion.button>
                  </motion.li>
                ))
              )}
            </ul>
          </motion.div>
        </>
      ) : (
        <p className="text-muted-foreground">Loading patient details...</p>
      )}
    </motion.div>
  );
};

export default EditPatient;