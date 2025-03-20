import { Sequelize } from "sequelize";
import dotenv from "dotenv";
import PatientModelFactory from "../models/Patient.js";
import AppointmentModelFactory from "../models/Appointment.js";

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
    logging: false, // ❌ Disable logging for cleaner output
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
  }
);

// ✅ Initialize Models
const Patient = PatientModelFactory(sequelize);
const Appointment = AppointmentModelFactory(sequelize);

// ✅ Define Relationships
Patient.hasMany(Appointment, { foreignKey: "patient_id", onDelete: "CASCADE" });
Appointment.belongsTo(Patient, { foreignKey: "patient_id", onDelete: "CASCADE" });

// ✅ Test Database Connection
const testConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ Database connection established successfully.");
  } catch (error) {
    console.error("❌ Unable to connect to the database:", error);
  }
};

// ✅ Sync Database
const syncDB = async () => {
  try {
    await sequelize.sync({ alter: true }); // ✅ Ensures DB is in sync
    console.log("✅ Database synchronized.");
  } catch (error) {
    console.error("❌ Error synchronizing database:", error);
  }
};

// ✅ Export Models & Functions
export const models = {
  Patient,
  Appointment,
};

export { sequelize, testConnection, syncDB };
export default sequelize;
