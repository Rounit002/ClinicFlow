import express from "express";
import multer from "multer";
import db from "../../config/database.js";
import { auth, isAdmin } from "../../middleware/auth.js";

const router = express.Router();

// ✅ Set up storage for file uploads
const storage = multer.diskStorage({
  destination: "./uploads/",
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});
const upload = multer({ storage });

// ✅ Upload multiple documents for a patient
router.post("/:id/documents", auth, upload.array("documents", 10), async (req, res) => {
  try {
    const { id } = req.params;
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: "No files uploaded" });
    }

    const fileRecords = req.files.map((file) => ({
      patient_id: id,
      file_name: file.originalname,
      file_path: `/uploads/${file.filename}`,
    }));

    await Promise.all(
      fileRecords.map((doc) =>
        db.query(
          "INSERT INTO patient_documents (patient_id, file_name, file_path) VALUES ($1, $2, $3)",
          [doc.patient_id, doc.file_name, doc.file_path]
        )
      )
    );

    res.json({ message: "Documents uploaded successfully", files: fileRecords });
  } catch (error) {
    console.error("❌ Error uploading documents:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// ✅ Get all documents for a patient
router.get("/:id/documents", auth, async (req, res) => {
  try {
    const { id } = req.params;
    const result = await db.query(
      "SELECT id, file_name, file_path, uploaded_at FROM patient_documents WHERE patient_id = $1",
      [id]
    );
    res.json(result.rows);
  } catch (error) {
    console.error("❌ Error fetching documents:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// ✅ Delete a document
router.delete("/documents/:docId", auth, isAdmin, async (req, res) => {
  try {
    const { docId } = req.params;
    await db.query("DELETE FROM patient_documents WHERE id = $1", [docId]);
    res.json({ message: "Document deleted successfully" });
  } catch (error) {
    console.error("❌ Error deleting document:", error);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
