import axios from 'axios';

const API_URL = 'https://clinicflow-e7a9.onrender.com/api';

// Add a request interceptor to include the auth token
axios.interceptors.request.use(
  (config) => {
    const userStr = localStorage.getItem('user');
    const user = userStr ? JSON.parse(userStr) : null;
    
    if (user && user.token) {
      config.headers['x-auth-token'] = user.token;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Authentication API
export const login = async (email: string, password: string) => {
  const response = await axios.post(`${API_URL}/auth/login`, { email, password });
  return response.data;
};

// Patients API
export const getAllPatients = async () => {
  const response = await axios.get(`${API_URL}/patients`);
  return response.data;
};

export const getPatientById = async (id: string) => {
  const response = await axios.get(`${API_URL}/patients/${id}`);
  return response.data;
};

export const createPatient = async (patientData: any) => {
  const response = await axios.post(`${API_URL}/patients`, patientData);
  return response.data;
};

export const updatePatient = async (id: string, patientData: any) => {
  const response = await axios.put(`${API_URL}/patients/${id}`, patientData);
  return response.data;
};

export const deletePatient = async (id: string) => {
  const response = await axios.delete(`${API_URL}/patients/${id}`);
  return response.data;
};

// Appointments API
export const getAllAppointments = async () => {
  const response = await axios.get(`${API_URL}/appointments`);
  return response.data;
};

export const getAppointmentsByDate = async (date: string) => {
  const response = await axios.get(`${API_URL}/appointments/date/${date}`);
  return response.data;
};

export const createAppointment = async (appointmentData: any) => {
  const response = await axios.post(`${API_URL}/appointments`, appointmentData);
  return response.data;
};

export const updateAppointmentStatus = async (id: string, status: string) => {
  const response = await axios.patch(`${API_URL}/appointments/${id}/status`, { status });
  return response.data;
};
