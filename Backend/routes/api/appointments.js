import express from "express";
import db, { sequelize, models } from "../../config/database.js";
import { auth, isAdmin } from "../../middleware/auth.js";
import { QueryTypes } from "sequelize";
import multer from "multer";
import path from "path";
import fs from "fs";
import cloudinary from "cloudinary";

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

// Get all appointments (admin only)
router.get("/", async (req, res) => {
  try {
    console.log("🔍 Fetching all appointments...");

    const result = await db.query(
      `SELECT a.id, 
              TO_CHAR(a.date, 'YYYY-MM-DD') as date, 
              a.reason, 
              a.status, 
              a.notes, 
              TO_CHAR(p.created_at, 'YYYY-MM-DD HH24:MI:SS') as created_at, 
              TO_CHAR(p.updated_at, 'YYYY-MM-DD HH24:MI:SS') as updated_at,
              p.id as patient_id, 
              p.name as patient_name, 
              p.phone as patient_phone
       FROM appointments a
       JOIN patients p ON a.patient_id = p.id
       ORDER BY a.date DESC`
    );

    console.log("✅ Raw Query Result:", result);

    const appointments = Array.isArray(result) ? result[0] : result.rows;

    if (!appointments || appointments.length === 0) {
      console.warn("⚠️ No appointments found.");
      return res.status(404).json({ message: "No appointments found" });
    }

    res.json(appointments);
  } catch (error) {
    console.error("❌ Database Query Error:", error);
    res.status(500).json({ error: "Server error", details: error.message });
  }
});

// Get appointments for a specific date
router.get("/date/:date", async (req, res) => {
  try {
    const date = req.params.date;
    
    console.log("🔍 Checking for appointments on:", date);
    
    if (!date) {
      return res.status(400).json({ error: "Date parameter is required" });
    }

    const result = await db.query(
      `SELECT a.id, 
              TO_CHAR(a.date, 'YYYY-MM-DD') as date, 
              a.reason, 
              a.status, 
              a.notes, 
              p.name as patient_name, 
              p.phone as patient_phone 
       FROM appointments a
       JOIN patients p ON a.patient_id = p.id
       WHERE a.date::date = $1 
       ORDER BY a.date ASC`,
      [date]
    );

    console.log("✅ API Response for Date Query:", result.rows);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "No appointments found for this date" });
    }

    res.json(result.rows);
  } catch (err) {
    console.error("❌ Database Query Error:", err);
    res.status(500).json({ error: "Server error", details: err.message });
  }
});

// ✅ Fetch latest appointment for a patient
router.get("/patient/:patientId/latest", async (req, res) => {
  try {
    console.log(`🟡 API Hit: Fetching latest appointment for patient ID ${req.params.patientId}`);

    const result = await sequelize.query(
      `SELECT id, 
              TO_CHAR(date, 'YYYY-MM-DD') as date, 
              reason, 
              status, 
              notes, 
              appointment_time
       FROM appointments
       WHERE patient_id = :patientId OR booked_by = :patientId
       ORDER BY date DESC, appointment_time DESC
       LIMIT 1`,
      {
        type: QueryTypes.SELECT,
        replacements: { patientId: req.params.patientId },
      }
    );

    console.log("✅ Latest Appointment Data:", result);
    res.json(result.length ? result[0] : { message: "No recent appointments found" });
  } catch (error) {
    console.error("❌ Error fetching latest appointment:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// Get appointments for a specific patient
router.get("/appointments/:id", async (req, res) => {
  const { id } = req.params;

  console.log("Received patient ID:", id);

  if (!id) {
    return res.status(400).json({ error: "Patient ID is required" });
  }

  try {
    const result = await sequelize.query(
      `SELECT id, 
              TO_CHAR(date, 'YYYY-MM-DD') as date, 
              reason, 
              status, 
              notes, 
              TO_CHAR(created_at, 'YYYY-MM-DD HH24:MI:SS') as created_at, 
              TO_CHAR(updated_at, 'YYYY-MM-DD HH24:MI:SS') as updated_at 
       FROM appointments
       WHERE patient_id = :patientId
       ORDER BY date DESC`,
      {
        type: QueryTypes.SELECT,
        replacements: { patientId: id },
      }
    );

    res.json(result);
  } catch (error) {
    console.error("❌ Error fetching patient appointments:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// Create a new appointment
router.post("/", async (req, res) => {
  const { booked_by, patient_name, patient_phone, date, appointment_time, doctor_type, reason } = req.body;

  try {
    console.log("📥 Received Data:", req.body);

    const now = new Date().toISOString();

    let patientQuery = `
      INSERT INTO patients (name, phone, created_at, updated_at) 
      VALUES ($1, $2, $3, $4)
      ON CONFLICT (phone) DO UPDATE SET name = EXCLUDED.name, updated_at = EXCLUDED.updated_at
      RETURNING id;
    `;

    const patientValues = [patient_name, patient_phone, now, now];

    console.log("📤 Patient Query String:", patientQuery);
    console.log("📤 Patient Query Values:", patientValues);

    const patientResult = await sequelize.query(patientQuery, {
      bind: patientValues,
      type: QueryTypes.INSERT,
    });

    const patient_id = patientResult[0][0].id;
    console.log("✅ Patient ID:", patient_id);

    let appointmentQuery = `
      INSERT INTO appointments (patient_id, patient_name, patient_phone, date, appointment_time, doctor_type, reason, booked_by) 
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8) 
      RETURNING *;
    `;

    const appointmentValues = [patient_id, patient_name, patient_phone, date, appointment_time, doctor_type, reason, booked_by];

    console.log("📤 Appointment Query String:", appointmentQuery);
    console.log("📤 Appointment Query Values:", appointmentValues);

    const appointmentResult = await sequelize.query(appointmentQuery, {
      bind: appointmentValues,
      type: QueryTypes.INSERT,
    });

    console.log("✅ Query Success:", appointmentResult);

    res.status(201).json({ message: "Appointment booked successfully!", appointment: appointmentResult[0] });
  } catch (err) {
    console.error("❌ Error booking appointment:", err);
    res.status(400).json({ error: err.message });
  }
});

// Update appointment status
router.patch("/:id/status", async (req, res) => {
  try {
    const { status } = req.body;

    if (!["confirmed", "pending", "canceled", "completed"].includes(status)) {
      return res.status(400).json({ error: "Invalid status" });
    }

    const result = await db.query(
      `UPDATE appointments 
       SET status = $1, updated_at = CURRENT_TIMESTAMP 
       WHERE id = $2 
       RETURNING id, TO_CHAR(updated_at, 'YYYY-MM-DD HH24:MI:SS') as updated_at, status`,
      [status, req.params.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Appointment not found" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error("❌ Error updating appointment status:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// ✅ Upload prescription document for an appointment (Doctor only)
router.post("/:appointmentId/prescription", auth, isAdmin, upload.single("prescription"), async (req, res) => {
  try {
    const { appointmentId } = req.params;

    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const appointment = await models.Appointment.findByPk(appointmentId);
    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    console.log("🔍 Uploading prescription to Cloudinary for appointment:", appointmentId);

    // ✅ Determine the resource type based on file extension
    const fileExtension = path.extname(req.file.originalname).toLowerCase();
    const isImage = [".jpg", ".jpeg", ".png", ".gif"].includes(fileExtension);
    const resourceType = isImage ? "image" : "raw";

    // ✅ Upload the file as a stream to prevent corruption
    const result = await new Promise((resolve, reject) => {
      const stream = cloudinary.v2.uploader.upload_stream(
        {
          folder: `appointments/${appointmentId}`,
          public_id: `${Date.now()}-${path.parse(req.file.originalname).name}`,
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
      fs.createReadStream(req.file.path).pipe(stream);
    });

    console.log("✅ Prescription uploaded to Cloudinary:", result.secure_url);

    const document = await models.Document.create({
      patient_id: appointment.patient_id,
      appointment_id: appointmentId,
      file_name: req.file.originalname,
      file_path: result.secure_url,
    });

    console.log("✅ Prescription saved to database:", document.id);

    fs.unlinkSync(req.file.path);
    console.log("✅ Temporary file deleted");

    res.json({ message: "Prescription uploaded successfully", document });
  } catch (error) {
    console.error("❌ Error uploading prescription:", error);
    if (req.file) {
      fs.unlinkSync(req.file.path);
    }
    res.status(500).json({ error: "Server error", details: error.message });
  }
});

router.get("/user/profile", auth, async (req, res) => {
  const userId = req.user.id;
  const user = await models.User.findByPk(userId, {
    attributes: ["id", "username", "email", "phone_number", "role", "created_at", "updated_at"],
  });
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }
  res.json(user);
});

// ✅ Update logged-in user's profile (without bcrypt)
router.patch("/user/profile", auth, async (req, res) => {
  try {
    console.log("🔍 Updating profile for user ID:", req.user.id);
    console.log("📥 Request body:", req.body);

    const userId = req.user.id; // From JWT token via auth middleware
    const { username, email, phone_number, password } = req.body;

    const user = await models.User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update fields if provided
    if (username) user.username = username;
    if (email) user.email = email;
    if (phone_number) user.phone_number = phone_number;
    if (password) user.password = password; // Save password directly (as per request)

    await user.save();

    console.log("✅ Profile updated successfully for user ID:", userId);

    res.json({
      message: "Profile updated successfully",
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        phone_number: user.phone_number,
        role: user.role,
        created_at: user.created_at,
        updated_at: user.updated_at,
      },
    });
  } catch (error) {
    console.error("❌ Error updating user profile:", error);
    res.status(500).json({ error: "Server error", details: error.message });
  }
});

// ✅ Get appointments for a user with associated documents
router.get("/user/:userId", auth, async (req, res) => {
  try {
    const { userId } = req.params;

    // ✅ Ensure the logged-in user can only access their own appointments
    if (req.user.id !== parseInt(userId) && req.user.role !== "admin") {
      return res.status(403).json({ message: "Unauthorized access" });
    }

    const appointments = await models.Appointment.findAll({
      where: {
        [models.Sequelize.Op.or]: [
          { patient_id: userId },
          { booked_by: userId },
        ],
      },
      include: [
        {
          model: models.Document,
          as: "documents",
          required: false,
        },
      ],
      order: [["date", "DESC"]],
    });

    if (!appointments || appointments.length === 0) {
      return res.status(404).json({ message: "No appointments found for this user" });
    }

    res.json(appointments);
  } catch (error) {
    console.error("❌ Error fetching user appointments:", error);
    res.status(500).json({ error: "Server error", details: error.message });
  }
});

export default router;