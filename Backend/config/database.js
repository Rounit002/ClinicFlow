import { Sequelize } from "sequelize";
import dotenv from "dotenv";
import PatientModelFactory from "../models/Patient.js";
import AppointmentModelFactory from "../models/Appointment.js";
import UserModelFactory from "../models/User.js";

dotenv.config();

// ✅ Initialize Sequelize
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: "postgres",
    port: process.env.DB_PORT,
    logging: false,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
        sslmode: "require",
        minVersion: "TLSv1.2", // Ensure compatibility with Render
      },
    },
  }
);

// ✅ Initialize Models
const Patient = PatientModelFactory(sequelize);
const Appointment = AppointmentModelFactory(sequelize);
const User=UserModelFactory(sequelize);

// ✅ Define Relationships
Patient.hasMany(Appointment, { foreignKey: "patient_id", onDelete: "CASCADE" });
Appointment.belongsTo(Patient, { foreignKey: "patient_id", onDelete: "CASCADE" });

// ✅ Test Database Connection with Retry Logic
const testConnection = async () => {
  for (let i = 0; i < 5; i++) {
    try {
      await sequelize.authenticate();
      console.log("✅ Database connection established successfully.");
      break;
    } catch (error) {
      console.error("❌ Unable to connect to the database:", error);
      if (i === 4) throw error; // Throw error after max retries
      await new Promise(resolve => setTimeout(resolve, 5000)); // Wait 5 seconds
    }
  }
};

// ✅ Sync Database
const syncDB = async () => {
  try {
    await sequelize.sync({ alter: true });
    console.log("✅ Database synchronized.");
  } catch (error) {
    console.error("❌ Error synchronizing database:", error);
  }
};

// ✅ Export Models & Functions
export const models = {
  Patient,
  Appointment,
  User,
};

export { sequelize, testConnection, syncDB };
export default sequelize;