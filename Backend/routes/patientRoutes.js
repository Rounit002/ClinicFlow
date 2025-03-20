import express from "express";
import { models } from "../config/database.js";
import { getPatientDocuments } from "../controllers/documentController.js";
import { auth } from "../middleware/auth.js"; // ✅ Ensure authentication middleware is imported

const router = express.Router();

// ✅ Get all patients
router.get("/", async (req, res) => {
  try {
    const patients = await models.Patient.findAll();
    res.json(patients);
  } catch (error) {
    console.error("❌ Error fetching patients:", error);
    res.status(500).json({ message: "Error fetching patients", error: error.message });
  }
});

// ✅ Get logged-in patient details (NEW)
router.get("/me", auth, async (req, res) => {
  try {
    const userId = req.user.id; // Get logged-in user ID from the auth middleware

    const result = await models.User.findByPk(userId, {
      attributes: ["id", "name", "email"],
    });

    if (!result) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(result); // Return user details
  } catch (error) {
    console.error("❌ Error fetching user details:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// ✅ Get a patient by ID
router.get("/:id", async (req, res) => {
  try {
    const patient = await models.Patient.findByPk(req.params.id);
    if (!patient) {
      return res.status(404).json({ message: "Patient not found" });
    }
    res.json(patient);
  } catch (error) {
    console.error("❌ Error fetching patient:", error);
    res.status(500).json({ message: "Error fetching patient", error: error.message });
  }
});

// ✅ Fetch patient documents (Ensure patient exists)
router.get("/:id/documents", async (req, res) => {
  try {
    const patient = await models.Patient.findByPk(req.params.id);
    if (!patient) {
      return res.status(404).json({ message: "Patient not found" });
    }
    getPatientDocuments(req, res);
  } catch (error) {
    console.error("❌ Error fetching patient documents:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// ✅ Create a new patient
router.post("/", async (req, res) => {
  try {
    const patient = await models.Patient.create(req.body);
    res.status(201).json(patient);
  } catch (error) {
    console.error("❌ Error creating patient:", error);
    res.status(400).json({ message: "Error creating patient", error: error.message });
  }
});

// ✅ Update a patient
router.put("/:id", async (req, res) => {
  try {
    const updated = await models.Patient.update(req.body, {
      where: { id: req.params.id },
    });

    if (updated[0] > 0) {
      const updatedPatient = await models.Patient.findByPk(req.params.id);
      res.json(updatedPatient);
    } else {
      res.status(404).json({ message: "Patient not found" });
    }
  } catch (error) {
    console.error("❌ Error updating patient:", error);
    res.status(400).json({ message: "Error updating patient", error: error.message });
  }
});

// ✅ Delete a patient
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await models.Patient.destroy({
      where: { id: req.params.id },
    });

    if (deleted) {
      res.json({ message: "Patient deleted successfully" });
    } else {
      res.status(404).json({ message: "Patient not found" });
    }
  } catch (error) {
    console.error("❌ Error deleting patient:", error);
    res.status(500).json({ message: "Error deleting patient", error: error.message });
  }
});

export default router;
