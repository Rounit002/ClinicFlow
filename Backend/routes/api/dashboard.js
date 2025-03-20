import express from "express";
import { sequelize } from "../../config/database.js"; 
import { QueryTypes } from "sequelize";

const router = express.Router();

router.get("/stats", async (req, res) => {
  try {
    console.log("Fetching dashboard stats...");

    const patientsData = await sequelize.query(
      "SELECT COUNT(*) AS count FROM patients",
      { type: QueryTypes.SELECT }
    );
    const totalPatients = patientsData[0]?.count || 0;
    console.log("Total Patients:", totalPatients);

    const appointmentsData = await sequelize.query(
      "SELECT COUNT(*) AS count FROM appointments",
      { type: QueryTypes.SELECT }
    );
    const totalAppointments = appointmentsData[0]?.count || 0;
    console.log("Total Appointments:", totalAppointments);

    let satisfaction = 0;
    const feedbackExists = await sequelize.query(
      "SELECT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'feedback') AS exists",
      { type: QueryTypes.SELECT }
    );

    if (feedbackExists[0].exists) {
      const feedbackData = await sequelize.query(
        "SELECT COALESCE(AVG(rating), 0) AS satisfaction FROM feedback",
        { type: QueryTypes.SELECT }
      );
      satisfaction = feedbackData[0]?.satisfaction || 0;
    }
    console.log("Patient Satisfaction:", satisfaction);

    return res.json({ totalPatients, totalAppointments, satisfaction });
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    return res.status(500).json({ message: "Server error" });
  }
});

// ✅ FIX: Export as default
export default router;
