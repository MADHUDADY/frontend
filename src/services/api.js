// src/services/api.js
import axios from "axios";

const BASE_URL = "https://backend-production-2df7.up.railway.app/api";

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (res) => res,
  (error) => {
    const status = error?.response?.status;
    if (status === 401) {
      ["token", "user", "role", "empId", "centerId"].forEach((k) => localStorage.removeItem(k));
      window.location.href = "/";
    }
    if (status === 403) console.warn("Access denied:", error?.response?.data?.message);
    return Promise.reject(error);
  }
);

export const authAPI = {
  login: (EMPID, PWD) => api.post("/clinic/login", { EMPID, PWD }),
};

export const clinicAPI = {
  getDetails:    ()          => api.get("/clinic"),
  update:        (id, data)  => api.put(`/clinic/${id}`, data),
  updateDetails: (id, data)  => api.put(`/clinic/${id}`, data),
  getCategories: ()          => api.get("/clinic/categories"),
  getServices:   ()          => api.get("/clinic/services"),
  getCounters:   ()          => api.get("/clinic/counters"),
  getEmployees:  ()          => api.get("/clinic/employees"),
};

export const patientAPI = {
  getAll:         ()         => api.get("/patients"),
  getById:        (id)       => api.get(`/patients/${id}`),
  getByRegNo:     (regNo)    => api.get(`/patients/reg/${regNo}`),
  searchByMobile: (mobile)   => api.get(`/patients/check/mobile/${mobile}`),
  searchByName:   (name)     => api.get(`/patients/check/name/${name}`),
  create:         (data)     => api.post("/patients", data),
  update:         (id, data) => api.put(`/patients/${id}`, data),
  delete:         (id)       => api.delete(`/patients/${id}`),
};

export const appointmentAPI = {
  getAll:        ()          => api.get("/appointments"),
  getToday:      ()          => api.get("/appointments/today"),
  getById:       (id)        => api.get(`/appointments/${id}`),
  getByTicket:   (no)        => api.get(`/appointments/ticket/${no}`),
  getNewList:    ()          => api.get("/appointments/new-list"),
  searchPatient: (mobile)    => api.get(`/appointments/search-patient/${mobile}`),
  create:        (data)      => api.post("/appointments", data),        // ← alias added
  createToken:   (data)      => api.post("/appointments", data),
  createNew:     (data)      => api.post("/appointments/new", data),
  updateStatus:  (id, data)  => api.put(`/appointments/${id}`, data),
  delete:        (id)        => api.delete(`/appointments/${id}`),
};

export const doctorAPI = {
  getAll:              ()                 => api.get("/doctors"),
  getById:             (id)              => api.get(`/doctors/${id}`),
  getByCategory:       (catId)           => api.get(`/doctors/category/${catId}`),
  getByClinicCategory: (clinicId, catId) => api.get(`/doctors/byclinic/${clinicId}/category/${catId}`),
  checkLicense:        (licNo)           => api.get(`/doctors/check-license/${encodeURIComponent(licNo)}`),
  create: (formData) => api.post("/doctors", formData, { headers: { "Content-Type": "multipart/form-data" } }),
  update: (id, formData) => api.put(`/doctors/${id}`, formData, { headers: { "Content-Type": "multipart/form-data" } }),
  delete: (id) => api.delete(`/doctors/${id}`),
};

export const categoryAPI = {
  getAll:      ()          => api.get("/categories"),
  getByClinic: (centerId)  => api.get(`/categories/byclinic/${centerId}`),
  create:      (data)      => api.post("/categories", data),
  update:      (id, data)  => api.put(`/categories/${id}`, data),
  delete:      (id)        => api.delete(`/categories/${id}`),
};

export const employeeAPI = {
  getAll:  ()          => api.get("/employees"),
  getById: (id)        => api.get(`/employees/${id}`),
  create:  (data)      => api.post("/employees", data),
  update:  (id, data)  => api.put(`/employees/${id}`, data),
  delete:  (id)        => api.delete(`/employees/${id}`),
};

export const helpdeskAPI = {
  getCategories: ()          => api.get("/helpdesk/categories"),
  getStats:      ()          => api.get("/helpdesk/tickets/stats"),
  getAll:        ()          => api.get("/helpdesk/tickets"),
  getById:       (id)        => api.get(`/helpdesk/tickets/${id}`),
  create:        (data)      => api.post("/helpdesk/tickets", data),
  updateStatus:  (id, data)  => api.patch(`/helpdesk/tickets/${id}/status`, data),
  assign:        (id, data)  => api.patch(`/helpdesk/tickets/${id}/assign`, data),
  resolve:       (id, data)  => api.patch(`/helpdesk/tickets/${id}/resolve`, data),
  comment:       (id, data)  => api.post(`/helpdesk/tickets/${id}/comment`, data),
  cancel:        (id)        => api.delete(`/helpdesk/tickets/${id}`),
};

export default api;