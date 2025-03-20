import express from "express";
// import db from "../../config/database.js";
import { sequelize } from "../../config/database.js"; // ✅ Fix: Import sequelize
import { QueryTypes } from "sequelize";

const router = express.Router();

// ✅ Fetch user details by ID (FIXED)
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params; // ✅ Get user ID from URL

    console.log("🔍 Received User ID:", id); // Debugging log

    if (!id) {
      return res.status(400).json({ error: "User ID is required" });
    }

    // ✅ Fetch user details
    const result = await db.query(
      "SELECT id, username, email FROM users WHERE id = $1",
      { bind: [id], type: db.QueryTypes.SELECT }
    );

    console.log("✅ Query Result:", result);

    if (result.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(result[0]); // ✅ Return user details
  } catch (error) {
    console.error("❌ Error fetching user:", error);
    res.status(500).json({ error: "Server error", details: error.message });
  }
});

router.get("/patient/:id/recent-activity", async (req, res) => {
  try {
    const { id } = req.params;

    console.log("🟡 API Hit: Fetching recent activity for user ID", id);

    const result = await sequelize.query(
      `SELECT a.id,
              a.patient_name,
              a.patient_phone,
              a.appointment_time, 
              TO_CHAR(a.date, 'YYYY-MM-DD') AS date, 
              a.reason, 
              a.status, 
              a.doctor_type,
              TO_CHAR(a.created_at, 'YYYY-MM-DD HH24:MI:SS') AS created_at 
       FROM appointments a
       WHERE a.booked_by = $1
       ORDER BY a.date DESC
       LIMIT 10;`,
      {
        bind: [id],
        type: QueryTypes.SELECT,
      }
    );

    console.log("✅ Recent Activity Data:", result);
    res.json(result);
  } catch (error) {
    console.error("❌ Error fetching recent activity:", error);
    res.status(500).json({ error: "Server error" });
  }
});


export default router;
