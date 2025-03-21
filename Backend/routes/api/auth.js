import express from "express";
import { sequelize } from "../../config/database.js";
import jwt from "jsonwebtoken";
import db from "../../config/database.js";

const router = express.Router();

// 🔹 Register User Route
router.post("/register", async (req, res) => {
  try {
    console.log("Incoming registration request:", req.body);

    const { username, email, password, phone_number, role } = req.body;

    if (!username || !email || !password || !phone_number || !role) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Check if user already exists (by email or phone number)
    const [existingUser] = await sequelize.query(
      "SELECT * FROM users WHERE email = :email OR phone_number = :phone_number",
      { replacements: { email, phone_number }, type: sequelize.QueryTypes.SELECT }
    );

    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Insert new user into the database
    const [newUser] = await sequelize.query(
      `INSERT INTO users (username, email, password, phone_number, role, created_at, updated_at) 
      VALUES (:username, :email, :password, :phone_number, :role, :created_at, :updated_at) 
      RETURNING id, username, email, phone_number, role`,
      {
        replacements: {
          username,
          email,
          password,
          phone_number,
          role,
          created_at: new Date(), // Provide a value for created_at
          updated_at: new Date(), // Provide a value for updated_at
        },
        type: sequelize.QueryTypes.INSERT,
      }
    );

    res.status(201).json({
      message: "User registered successfully",
      user: newUser,
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ LOGIN Route (Username OR Phone Number)
router.post("/login", async (req, res) => {
  try {
    const { loginIdentifier, password } = req.body;

    if (!loginIdentifier || !password) {
      return res.status(400).json({ error: "Username/Phone and password are required" });
    }

    console.log("🔍 Checking for user:", loginIdentifier);

    // ✅ Fetch user by username OR phone_number
    const query = `
      SELECT id, username, phone_number, password, role
      FROM users 
      WHERE username = :loginIdentifier OR phone_number = :loginIdentifier
      LIMIT 1
    `;

    const users = await db.query(query, {
      replacements: { loginIdentifier },
      type: db.QueryTypes.SELECT,
    });

    console.log("✅ Query Result:", users);

    if (users.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    const user = users[0];

    // ❌ Directly Compare Password (INSECURE)
    if (user.password !== password) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // ✅ Generate JWT Token
    const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    console.log("✅ Login successful:", user.username);

    res.json({
      message: "Login successful",
      user: {
        id: user.id,
        username: user.username,
        phone_number: user.phone_number,
        role: user.role,
      },
      token,
    });
  } catch (error) {
    console.error("❌ Login error:", error);
    res.status(500).json({ error: "Server error", details: error.message });
  }
});


// ✅ Get Current Logged-in User
router.get("/user", async (req, res) => {
  try {
    const authHeader = req.header("Authorization");
    if (!authHeader) {
      return res.status(401).json({ message: "No token, authorization denied" });
    }

    const token = authHeader.replace("Bearer ", "");
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const [user] = await sequelize.query(
      "SELECT id, username, email FROM users WHERE id = :id",
      {
        replacements: { id: decoded.id },
        type: sequelize.QueryTypes.SELECT,
      }
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (error) {
    console.error("❌ Error fetching user:", error);
    res.status(500).json({ message: "Server error" });
  }
});


export default router;
