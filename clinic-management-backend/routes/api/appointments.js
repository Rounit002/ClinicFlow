import express from "express";
import db, { sequelize } from "../../config/database.js";
import { auth, isAdmin } from "../../middleware/auth.js";
import { QueryTypes } from "sequelize";

const router = express.Router();

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

    console.log("✅ Raw Query Result:", result); // Log full response

    // ✅ Extract the first array if result is nested
    const appointments = Array.isArray(result) ? result[0] : result.rows;

    // ✅ Ensure response is valid
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
    
    console.log("🔍 Checking for appointments on:", date); // Debugging log
    
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

    console.log("✅ API Response for Date Query:", result.rows); // Debugging log

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


router.get("/appointments/:id", async (req, res) => {
  const { id } = req.params;

  console.log("Received patient ID:", id); // 🔍 Debugging

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
              replacements: { patientId: id }, // ✅ Using named parameter
          }
      );

      res.json(result);
  } catch (error) {
      console.error("❌ Error fetching patient appointments:", error);
      res.status(500).json({ error: "Server error" });
  }
});


router.post("/", async (req, res) => {
  const {booked_by, patient_name, patient_phone, date, appointment_time, doctor_type, reason} = req.body;

  try {
    console.log("📥 Received Data:", req.body);

    // ✅ Get current timestamp
    const now = new Date().toISOString();

    // Step 1: Insert Patient if not exists
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

    const patient_id = patientResult[0][0].id; // Extract inserted patient ID
    console.log("✅ Patient ID:", patient_id);

    // Step 2: Insert Appointment with patient_id
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

// Get appointments for a user (where they are either patient or booked_by)
router.get("/user/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const result = await db.query(
      `SELECT a.id, 
              TO_CHAR(a.date, 'YYYY-MM-DD') as date, 
              a.reason, 
              a.status, 
              a.notes, 
              a.patient_id,
              a.booked_by,
              p.name as patient_name, 
              p.phone as patient_phone
       FROM appointments a
       JOIN patients p ON a.patient_id = p.id
       WHERE a.patient_id = $1 OR a.booked_by = $1
       ORDER BY a.date DESC`,
      [userId]
    );

    if (!result.rows || result.rows.length === 0) {
      return res.status(404).json({ message: "No appointments found for this user" });
    }

    res.json(result.rows);
  } catch (error) {
    console.error("❌ Error fetching user appointments:", error);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
