import { DataTypes } from "sequelize";

const AppointmentModelFactory = (sequelize) => {
  const Appointment = sequelize.define(
    "Appointment",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
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
        type: DataTypes.ENUM("scheduled", "completed", "cancelled"),
        allowNull: false,
        defaultValue: "scheduled",
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
        type: DataTypes.UUID,
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
