import express from "express";
import multer from "multer";
import path from "path";
import { models } from "../../config/database.js";
import { auth } from "../../middleware/auth.js";
import fs from "fs";
import cloudinary from "cloudinary";
import https from "https";

const router = express.Router();

// ✅ Configure Cloudinary
cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// ✅ Configure multer for temporary file storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = "./uploads/";
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});
const upload = multer({ storage });

// ✅ Upload multiple documents for a patient
router.post("/:patientId", auth, upload.array("documents", 10), async (req, res) => {
  try {
    const { patientId } = req.params;

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: "No files uploaded" });
    }

    const latestAppointment = await models.Appointment.findOne({
      where: {
        patient_id: patientId,
      },
      order: [["date", "DESC"], ["appointment_time", "DESC"]],
    });

    console.log("🔍 Uploading files to Cloudinary for patient:", patientId);

    const fileRecords = [];
    for (const file of req.files) {
      console.log("🔍 Uploading file to Cloudinary:", file.originalname);

      const fileExtension = path.extname(file.originalname).toLowerCase();
      const isImage = [".jpg", ".jpeg", ".png", ".gif"].includes(fileExtension);
      const resourceType = isImage ? "image" : "raw";

      const result = await new Promise((resolve, reject) => {
        const stream = cloudinary.v2.uploader.upload_stream(
          {
            folder: `patients/${patientId}`,
            public_id: `${Date.now()}-${path.parse(file.originalname).name}`,
            resource_type: resourceType,
          },
          (error, result) => {
            if (error) {
              reject(error);
            } else {
              resolve(result);
            }
          }
        );
        fs.createReadStream(file.path).pipe(stream);
      });

      console.log("✅ File uploaded to Cloudinary:", result.secure_url);

      if (!result.secure_url) {
        console.error("❌ Cloudinary upload failed, skipping document creation for file:", file.originalname);
        continue;
      }

      console.log("🔍 Saving document to database:", file.originalname);
      const document = await models.Document.create({
        patient_id: patientId,
        appointment_id: latestAppointment ? latestAppointment.id : null,
        file_name: file.originalname,
        file_path: result.secure_url,
      });
      console.log("✅ Document saved to database:", document.id);

      console.log("🔍 Cleaning up temporary file:", file.path);
      fs.unlinkSync(file.path);
      console.log("✅ Temporary file deleted");

      fileRecords.push(document);
    }

    res.json({ message: "Documents uploaded successfully", files: fileRecords });
  } catch (error) {
    console.error("❌ Error uploading documents:", error);
    if (req.files) {
      req.files.forEach((file) => {
        fs.unlinkSync(file.path);
      });
    }
    res.status(500).json({ error: "Server error", details: error.message });
  }
});

// ✅ Get all documents for a patient
router.get("/:patientId", auth, async (req, res) => {
  try {
    const { patientId } = req.params;
    const documents = await models.Document.findAll({ where: { patient_id: patientId } });

    if (!documents.length) {
      return res.status(404).json({ message: "No documents found for this patient." });
    }

    res.json(documents);
  } catch (error) {
    console.error("❌ Error fetching documents:", error);
    res.status(500).json({ error: "Server error", details: error.message });
  }
});

// ✅ Download a document
router.get("/download/:documentId", auth, async (req, res) => {
  try {
    const { documentId } = req.params;
    const document = await models.Document.findByPk(documentId);

    if (!document) {
      return res.status(404).json({ message: "Document not found." });
    }

    const fileUrl = document.file_path;
    const fileName = document.file_name;

    // ✅ Determine the Content-Type based on file extension
    const fileExtension = path.extname(fileName).toLowerCase();
    let contentType = "application/octet-stream";
    if (fileExtension === ".pdf") {
      contentType = "application/pdf";
    } else if ([".jpg", ".jpeg"].includes(fileExtension)) {
      contentType = "image/jpeg";
    } else if (fileExtension === ".png") {
      contentType = "image/png";
    } else if (fileExtension === ".gif") {
      contentType = "image/gif";
    }

    // ✅ Set headers to force download for all file types
    res.setHeader("Content-Type", contentType);
    res.setHeader("Content-Disposition", `attachment; filename="${fileName}"`);

    // ✅ Stream the file from Cloudinary
    https.get(fileUrl, (response) => {
      if (response.statusCode !== 200) {
        return res.status(response.statusCode).json({ message: "Failed to fetch file from Cloudinary" });
      }
      response.pipe(res);
    }).on("error", (error) => {
      console.error("❌ Error downloading file from Cloudinary:", error);
      res.status(500).json({ error: "Failed to download file", details: error.message });
    });
  } catch (error) {
    console.error("❌ Error downloading document:", error);
    res.status(500).json({ error: "Server error", details: error.message });
  }
});

// ✅ Delete a document
router.delete("/:documentId", auth, async (req, res) => {
  try {
    const { documentId } = req.params;
    console.log("🔍 Attempting to delete document with ID:", documentId);

    const document = await models.Document.findByPk(documentId);
    if (!document) {
      console.log("❌ Document not found for ID:", documentId);
      return res.status(404).json({ message: "Document not found." });
    }

    console.log("🔍 Document found:", document.file_path);

    if (document.file_path) {
      const publicId = document.file_path
        .split("/")
        .slice(-2)
        .join("/")
        .replace(/\.[^/.]+$/, "");
      console.log("🔍 Extracted publicId:", publicId);

      if (!publicId || publicId.trim() === "") {
        console.warn("⚠️ Invalid or missing publicId, skipping Cloudinary deletion");
      } else {
        try {
          const cloudinaryResult = await cloudinary.v2.uploader.destroy(publicId, { resource_type: "raw" });
          console.log("✅ Cloudinary deletion result:", cloudinaryResult);
          if (cloudinaryResult.result !== "ok" && cloudinaryResult.result !== "not found") {
            console.error("❌ Cloudinary deletion failed:", cloudinaryResult);
            throw new Error("Failed to delete file from Cloudinary");
          }
        } catch (cloudinaryError) {
          console.warn("⚠️ Could not delete file from Cloudinary (might already be deleted):", cloudinaryError.message);
        }
      }
    } else {
      console.warn("⚠️ file_path is missing for document ID:", documentId);
    }

    await document.destroy();
    console.log("✅ Document deleted from database:", documentId);

    res.json({ message: "Document deleted successfully" });
  } catch (error) {
    console.error("❌ Error deleting document:", error);
    res.status(500).json({ error: "Server error", details: error.message });
  }
});

export default router;