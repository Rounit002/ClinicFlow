import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const EditPatient = () => {
  const { patientId } = useParams();
  const [patient, setPatient] = useState(null);
  const [documents, setDocuments] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [documentsError, setDocumentsError] = useState<string | null>(null);

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
      if (!token) {
        throw new Error('Authentication required');
      }
  
      const response = await fetch(`https://clinicflow-e7a9.onrender.com/api/documents/${patientId}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
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
    if (!selectedFiles.length) {
      alert("Please select files to upload.");
      return;
    }
    const formData = new FormData();
    selectedFiles.forEach((file) => formData.append("documents", file));
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Authentication required');
      }
  
      const response = await fetch(`https://clinicflow-e7a9.onrender.com/api/documents/${patientId}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
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
      if (!token) {
        throw new Error('Authentication required');
      }
  
      const response = await fetch(`https://clinicflow-e7a9.onrender.com/api/documents/${documentId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) throw new Error("Delete failed");
      fetchDocuments();
    } catch (error) {
      console.error("❌ Error deleting document:", error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-8 bg-white shadow-lg rounded-lg space-y-6">
      {patient ? (
        <>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800">{patient.name}'s Profile</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-gray-100 p-4 rounded-lg">
            <p>
              <strong>Email:</strong> {patient.email}
            </p>
            <p>
              <strong>Phone:</strong> {patient.phone}
            </p>
            <p>
              <strong>Address:</strong> {patient.address || "N/A"}
            </p>
            <p>
              <strong>Medical History:</strong> {patient.medical_history || "N/A"}
            </p>
            <p>
              <strong>Last Visit:</strong> {patient.lastVisit || "N/A"}
            </p>
          </div>

          <div className="border-t pt-4">
            <h3 className="text-lg font-semibold">Upload Documents</h3>
            <div className="flex flex-col sm:flex-row gap-2 mt-2">
              <input
                type="file"
                multiple
                onChange={handleFileChange}
                className="w-full border p-2 rounded"
              />
              <button
                onClick={handleUpload}
                className="w-full sm:w-auto bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition disabled:bg-gray-400"
                disabled={!selectedFiles.length}
              >
                Upload
              </button>
            </div>
          </div>

          <div>
          <h3 className="text-lg font-semibold mt-6">Uploaded Documents</h3>
          <ul className="bg-gray-50 p-4 rounded-lg border">
            {documentsError ? (
              <p className="text-red-600">{documentsError}</p>
            ) : documents.length === 0 ? (
              <p className="text-gray-600">No documents uploaded yet.</p>
            ) : (
              documents.map((doc) => (
                <li
                  key={doc.id}
                  className="p-3 flex flex-col sm:flex-row sm:justify-between sm:items-center border-b last:border-b-0 space-y-2 sm:space-y-0"
                >
                  <a
                    href={`https://clinicflow-e7a9.onrender.com${doc.file_path}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:underline"
                  >
                    {doc.file_name}
                  </a>
                  <button
                    onClick={() => handleDelete(doc.id)}
                    className="w-full sm:w-auto text-red-500 hover:text-red-700 px-3 py-1 rounded border border-red-500 sm:border-0"
                  >
                    Delete
                  </button>
                </li>
              ))
            )}
          </ul>
        </div>
        </>
      ) : (
        <p className="text-gray-600">Loading patient details...</p>
      )}
    </div>
  );
};

export default EditPatient;