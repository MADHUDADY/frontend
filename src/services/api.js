// src/services/api.js
import axios from 'axios';

const BASE_URL = 'https://backend-production-2df7.up.railway.app/api';

const api = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: false
});

// ── Auto-attach JWT token to every request ────────────────────────────────────
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ── Auto-logout when token expires ────────────────────────────────────────────
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.status === 401) {
      localStorage.clear();
      window.location.href = '/';
    }
    console.error('API Error:', error?.response?.data || error.message);
    return Promise.reject(error);
  }
);

export const dashboardAPI = {
  getStats:              () => api.get('/dashboard/stats'),
  getAppointmentsChart:  () => api.get('/dashboard/appointments-chart'),
  getRecentAppointments: () => api.get('/dashboard/recent-appointments'),
};

export const patientAPI = {
  getAll:      ()       => api.get('/patients'),
  getById:     (id)     => api.get(`/patients/${id}`),
  getByRegNo:  (regNo)  => api.get(`/patients/reg/${regNo}`),
  create:      (data)   => api.post('/patients', data),
  update:      (id, d)  => api.put(`/patients/${id}`, d),
  delete:      (id)     => api.delete(`/patients/${id}`),
  checkMobile: (mobile) => api.get(`/patients/check/mobile/${mobile}`),
  checkName:   (name)   => api.get(`/patients/check/name/${encodeURIComponent(name)}`),
};

export const doctorAPI = {
  getAll:                ()                     => api.get('/doctors'),
  getById:               (id)                   => api.get(`/doctors/${id}`),
  getByCategory:         (categoryId)           => api.get(`/doctors/category/${categoryId}`),
  getByClinicAndCategory:(clinicId, categoryId) => api.get(`/doctors/byclinic/${clinicId}/category/${categoryId}`),
  delete:                (id)                   => api.delete(`/doctors/${id}`),
  createFormData: (formData) =>
    api.post('/doctors', formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
  updateFormData: (id, formData) =>
    api.put(`/doctors/${id}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
};

export const appointmentAPI = {
  getAll:       ()         => api.get('/appointments'),
  getToday:     ()         => api.get('/appointments/today'),
  getById:      (id)       => api.get(`/appointments/${id}`),
  getByTicket:  (ticketNo) => api.get(`/appointments/ticket/${ticketNo}`),
  create:       (data)     => api.post('/appointments', data),
  updateStatus: (id, data) => api.put(`/appointments/${id}`, data),
  update:       (id, data) => api.put(`/appointments/${id}`, data),
  delete:       (id)       => api.delete(`/appointments/${id}`),
};

export const employeeAPI = {
  getAll:  ()         => api.get('/employees'),
  getById: (id)       => api.get(`/employees/${id}`),
  login:   (creds)    => api.post('/employees/login', creds),
  create:  (data)     => api.post('/employees', data),
  update:  (id, data) => api.put(`/employees/${id}`, data),
  delete:  (id)       => api.delete(`/employees/${id}`),
};

export const clinicAPI = {
  getDetails:    ()         => api.get('/clinic'),
  getCategories: ()         => api.get('/clinic/categories'),
  getServices:   ()         => api.get('/clinic/services'),
  getCounters:   ()         => api.get('/clinic/counters'),
  getEmployees:  ()         => api.get('/clinic/employees'),
  updateDetails: (id, data) => api.put(`/clinic/${id}`, data),
};

export const categoryAPI = {
  getAll:      ()          => api.get('/categories'),
  getByClinic: (centerId)  => api.get(`/categories/byclinic/${centerId}`),
};

export default api;