import Document from "../models/Document.js"; // ✅ Correct import (no destructuring)

// ✅ Fetch all documents for a patient
export const getPatientDocuments = async (req, res) => {
  try {
    const { id } = req.params; // ✅ Get patient ID from the request
    const documents = await Document.findAll({ where: { patient_id: id } });

    if (!documents.length) {
      return res.status(404).json({ message: "No documents found for this patient." });
    }

    res.json(documents);
  } catch (error) {
    console.error("❌ Error fetching documents:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ Upload document
export const uploadPatientDocument = async (req, res) => {
  try {
    const { patientId } = req.params; // ✅ Get patient ID
    if (!req.file) return res.status(400).json({ message: "No file uploaded" });

    // ✅ Save document details in the database
    const document = await Document.create({
      patient_id: patientId,
      file_name: req.file.originalname,
      file_path: `/uploads/${req.file.filename}`,
    });

    res.status(201).json({ message: "Document uploaded successfully", document });
  } catch (error) {
    console.error("❌ Error uploading document:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ Delete document
export const deletePatientDocument = async (req, res) => {
  try {
    const { documentId } = req.params; // ✅ Get document ID

    const document = await Document.findByPk(documentId);
    if (!document) {
      return res.status(404).json({ message: "Document not found" });
    }

    await document.destroy(); // ✅ Delete document from the database

    res.json({ message: "Document deleted successfully" });
  } catch (error) {
    console.error("❌ Error deleting document:", error);
    res.status(500).json({ message: "Server error" });
  }
};
