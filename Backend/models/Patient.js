import { DataTypes } from "sequelize";

const PatientModelFactory = (sequelize) => {
  const Patient = sequelize.define(
    "Patient",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      phone: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      age: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      gender: {
        type: DataTypes.STRING, // Remove ENUM constraint
        allowNull: false,
        validate: {
          isIn: [['male', 'female', 'other']],
        },
      },
      address: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
    },
    {
      tableName: "patients",
      timestamps: true,
      underscored: true,
    }
  );

  return Patient;
};

export default PatientModelFactory;
