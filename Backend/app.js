import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { sequelize, testConnection } from "./config/database.js";
import patientRoutes from "./routes/patientRoutes.js";
import authRoutes from "./routes/api/auth.js";
import dashboardRoutes from "./routes/api/dashboard.js";
import appointmentRoutes from "./routes/api/appointments.js";
import documentRoutes from "./routes/api/documents.js";
import userRoutes from "./routes/api/userRoutes.js";
import path from "path";

// ✅ Initialize express app
dotenv.config();
const app = express();

const _dirname = path.resolve();

// ✅ Middleware to handle preflight OPTIONS requests
app.options("*", cors({
  origin: (origin, callback) => {
    const allowedOrigins = [
      "https://clinicflow-e7a9.onrender.com",
      "http://localhost",
      "https://localhost",
      "file://"
    ];
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
  optionsSuccessStatus: 204
}));

// ✅ Apply CORS middleware to all routes
// app.use(cors({
//   origin: (origin, callback) => {
//     const allowedOrigins = [
//       "https://clinicflow-e7a9.onrender.com",
//       "http://localhost",
//       "https://localhost",
//       "file://"
//     ];
//     if (!origin || allowedOrigins.includes(origin)) {
//       callback(null, true);
//     } else {
//       callback(new Error("Not allowed by CORS"));
//     }
//   },
//   methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
//   allowedHeaders: ["Content-Type", "Authorization"],
//   credentials: true,
//   optionsSuccessStatus: 204
// }));

app.use(express.json());
app.use(express.urlencoded({ extended: true })); // ✅ Handle form data
app.use("/uploads", express.static("uploads")); // ✅ Serve uploaded files

// ✅ Test database connection
testConnection();

// ✅ Register Routes
app.use("/api/patients", patientRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/appointments", appointmentRoutes);
app.use("/api/documents", documentRoutes); // ✅ Register document API
app.use("/api/users", userRoutes);

app.use(express.static(path.join(_dirname, "/Frontend/dist")));
app.get('*', (_, res) => {
  res.sendFile(path.resolve(_dirname, "Frontend", "dist", "index.html"));
});

// ✅ Handle 404 for Undefined Routes
app.use((req, res) => {
  console.error(`❌ 404 Error: User attempted to access non-existent route: ${req.originalUrl}`);
  res.status(404).json({ message: "Route not found" });
});

// ✅ Error Handling Middleware
app.use((err, req, res, next) => {
  console.error("❌ Server Error:", err.stack);
  res.status(500).json({
    message: "Server error",
    error: process.env.NODE_ENV === "development" ? err.message : undefined
  });
});

// ✅ Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});

// Sync Database (Force sync to recreate tables)
// sequelize.sync({ force: true }).then(() => {
//   console.log("✅ Database synced successfully with force: true.");
// });

// ✅ Sync Database (Development Mode Only)
if (process.env.NODE_ENV !== "production") {
  sequelize.sync({ alter: true }).then(() => {
    console.log("✅ Database synced successfully.");
  });
}

export default app;