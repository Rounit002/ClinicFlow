import sequelize from "../config/database.js";
import Patient from "./Patient";
import Appointment from "./Appointment";

// const sequelize = require('../config/database');
// const Patient = require('./Patient');
// const Appointment = require('./Appointment');

const initializeDatabase = async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connection established successfully.');
    
    // Sync all models with database
    await sequelize.sync({ alter: true });
    console.log('Database models synchronized.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
};

// module.exports = {
//   sequelize,
//   Patient,
//   Appointment,
//   initializeDatabase
// };

export {sequelize,Patient,Appointment,initializeDatabase};
