import { DataTypes } from "sequelize";

const AppointmentModelFactory = (sequelize) => {
  const Appointment = sequelize.define(
    "Appointment",
    {
      id: {
        type: DataTypes.INTEGER, // Change from UUID to INTEGER
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      patient_name: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      patient_phone: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      date: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      appointment_time: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      doctor_type: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      reason: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      status: {
        type: DataTypes.STRING, // Removed ENUM constraint
        allowNull: false,
        defaultValue: "scheduled",
        validate: {
          isIn: [['scheduled', 'completed', 'cancelled']],
        },
      },      
      notes: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      created_at: {
        type: DataTypes.DATE,
        allowNull: true,
        defaultValue: sequelize.NOW,
      },
      updated_at: {
        type: DataTypes.DATE,
        allowNull: true,
        defaultValue: sequelize.NOW,
      },
      patient_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "patients",
          key: "id",
        },
      },
      booked_by: {  // ✅ Corrected placement
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "users",
          key: "id",
        },
      },
    },
    {
      tableName: "appointments",
      timestamps: false,
      underscored: true,
    }
  );

  return Appointment;
};

export default AppointmentModelFactory;
