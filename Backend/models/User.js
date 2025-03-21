import { DataTypes } from "sequelize";

const UserModelFactory = (sequelize) => {
  const User = sequelize.define("User", {
    id: {
      type: DataTypes.INTEGER, // Change from UUID to INTEGER
      autoIncrement: true, // Enable auto-increment
      primaryKey: true,
      allowNull: false,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    role: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "patient",
    },
    phone_number: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      allowNull: false,
    },
    updated_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      allowNull: false,
    },
  }, {
    tableName: "users",
    timestamps: false,
  });

  return User;
};

export default UserModelFactory;
