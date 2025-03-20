import express from "express";
import multer from "multer";
import path from "path";
import Document from "../../models/Document.js"; // ✅ Import the Document model

const router = express.Router();

// ✅ Configure multer for file uploads
const storage = multer.diskStorage({
  destination: "./uploads/",
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});
const upload = multer({ storage });

// ✅ Upload multiple documents for a patient
router.post("/:patientId", upload.array("documents", 10), async (req, res) => {
  try {
    const { patientId } = req.params;

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: "No files uploaded" });
    }

    // ✅ Store documents in the database
    const fileRecords = await Promise.all(
      req.files.map(async (file) => {
        return await Document.create({
          patient_id: patientId,
          file_name: file.originalname,
          file_path: `/uploads/${file.filename}`, // ✅ Store path for serving
        });
      })
    );

    res.json({ message: "Documents uploaded successfully", files: fileRecords });
  } catch (error) {
    console.error("❌ Error uploading documents:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// ✅ Get all documents for a patient
router.get("/:patientId", async (req, res) => {
  try {
    const { patientId } = req.params;
    const documents = await Document.findAll({ where: { patient_id: patientId } });

    if (!documents.length) {
      return res.status(404).json({ message: "No documents found for this patient." });
    }

    res.json(documents);
  } catch (error) {
    console.error("❌ Error fetching documents:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// ✅ Delete a document
router.delete("/:documentId", async (req, res) => {
  try {
    const { documentId } = req.params;
    const document = await Document.findByPk(documentId);

    if (!document) {
      return res.status(404).json({ message: "Document not found." });
    }

    await document.destroy(); // ✅ Delete from database
    res.json({ message: "Document deleted successfully" });
  } catch (error) {
    console.error("❌ Error deleting document:", error);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
