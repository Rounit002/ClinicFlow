import { Patient } from '../models';

// const { Patient } = require('../models');

// Get all patients
export const getAllPatients = async (req, res) => {
  try {
    const patients = await Patient.findAll({
      order: [['createdAt', 'DESC']]
    });
    
    res.render('patients/index', { 
      title: 'All Patients',
      patients 
    });
  } catch (err) {
    console.error(err);
    res.status(500).render('error', { 
      title: 'Error',
      message: 'Server Error' 
    });
  }
};

// Get single patient
export const getPatientById = async (req, res) => {
  try {
    const patient = await Patient.findByPk(req.params.id);
    
    if (!patient) {
      return res.status(404).render('error', { 
        title: 'Not Found',
        message: 'Patient not found' 
      });
    }
    
    res.render('patients/details', { 
      title: patient.name,
      patient 
    });
  } catch (err) {
    console.error(err);
    res.status(500).render('error', { 
      title: 'Error',
      message: 'Server Error' 
    });
  }
};

// Create patient form
export const createPatientForm = (req, res) => {
  res.render('patients/create', { 
    title: 'Add New Patient' 
  });
};

// Create patient
export const createPatient = async (req, res) => {
  try {
    // Convert address from form to JSON
    if (req.body.street || req.body.city || req.body.state || req.body.zipCode) {
      req.body.address = {
        street: req.body.street,
        city: req.body.city,
        state: req.body.state,
        zipCode: req.body.zipCode
      };
    }
    
    // Remove individual address fields from body
    delete req.body.street;
    delete req.body.city;
    delete req.body.state;
    delete req.body.zipCode;
    
    // Handle medical history (convert from comma-separated to array)
    if (req.body.medicalHistory && typeof req.body.medicalHistory === 'string') {
      req.body.medicalHistory = req.body.medicalHistory
        .split(',')
        .map(item => item.trim())
        .filter(item => item.length > 0);
    }
    
    const newPatient = await Patient.create(req.body);
    res.redirect('/patients');
  } catch (err) {
    console.error(err);
    res.status(400).render('patients/create', { 
      title: 'Add New Patient',
      error: err.message 
    });
  }
};
