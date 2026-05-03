// import React, { useState, useEffect, useRef } from "react";
// import { useNavigate } from "react-router-dom";
// import { appointmentAPI, clinicAPI } from "../../services/api";
// import api from "../../services/api";

// // ── Ticket generator ──────────────────────────────────────────────────────────
// function genTicket(series: string, num: number) {
//   const prefix = (series || "TK").substring(0, 2).toUpperCase();
//   return `${prefix}${num}`;
// }

// const inputCls = (err?: string) =>
//   `w-full border rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-400 text-sm transition ${
//     err ? "border-red-400 bg-red-50" : "border-gray-300 bg-white"
//   }`;

// // ─────────────────────────────────────────────────────────────────────────────
// const NewAppointment: React.FC = () => {
//   const navigate = useNavigate();

//   const [clinics,     setClinics]     = useState<any[]>([]);
//   const [departments, setDepartments] = useState<any[]>([]);
//   const [doctors,     setDoctors]     = useState<any[]>([]);

//   const [selectedClinic,     setSelectedClinic]     = useState("");
//   const [selectedDepartment, setSelectedDepartment] = useState<any>(null);
//   const [selectedDoctor,     setSelectedDoctor]     = useState<any>(null);

//   // ── Patient search state ──────────────────────────────────────────────────
//   const [mobileSearch,      setMobileSearch]      = useState("");
//   const [searchingPatient,  setSearchingPatient]  = useState(false);
//   const [foundPatients,     setFoundPatients]     = useState<any[]>([]);
//   const [selectedPatient,   setSelectedPatient]   = useState<any>(null);
//   const [showPatientPopup,  setShowPatientPopup]  = useState(false);
//   const [patientSearchDone, setPatientSearchDone] = useState(false);
//   const mobileRef = useRef<ReturnType<typeof setTimeout> | null>(null);

//   const [form, setForm] = useState({
//     TICKETNUMBER: "",
//     COUNTERID:    "1",   // default, not shown in UI
//     ZONE:         "1",   // default, not shown in UI
//     TYPE:         "D",   // default, not shown in UI
//     CENTERID:     "101", // default, not shown in UI
//   });
//   const [apptDate,    setApptDate]    = useState(new Date().toISOString().split("T")[0]);
//   const [patientName, setPatientName] = useState("");
//   const [phone,       setPhone]       = useState("");

//   const [errors,         setErrors]         = useState<Record<string, string>>({});
//   const [saving,         setSaving]         = useState(false);
//   const [success,        setSuccess]        = useState(false);
//   const [apiError,       setApiError]       = useState("");
//   const [loading,        setLoading]        = useState(true);
//   const [loadingDepts,   setLoadingDepts]   = useState(false);
//   const [loadingDoctors, setLoadingDoctors] = useState(false);

//   // ── Load clinic on mount ────────────────────────────────────────────────────
//   useEffect(() => {
//     const load = async () => {
//       try {
//         const clinicRes = await clinicAPI.getDetails();
//         const clinicDetail = clinicRes.data.data;
//         if (clinicDetail) {
//           const clinicId = String(clinicDetail.COMPANYID || clinicDetail.ID || "101");
//           setClinics([{ id: clinicId, name: clinicDetail.COMPANYNAME }]);
//         }
//       } catch (err) {
//         console.error("Load failed:", err);
//       } finally {
//         setLoading(false);
//       }
//     };
//     load();
//   }, []);

//   // ── Step 1: Clinic selected → load departments ──────────────────────────────
//   const handleClinicChange = async (clinicId: string) => {
//     setSelectedClinic(clinicId);
//     setSelectedDepartment(null);
//     setSelectedDoctor(null);
//     setDepartments([]);
//     setDoctors([]);
//     setForm((f) => ({ ...f, TICKETNUMBER: "", CENTERID: clinicId || "101" }));
//     setErrors({});
//     setSelectedPatient(null);
//     setMobileSearch("");
//     setPatientSearchDone(false);

//     if (!clinicId) return;
//     try {
//       setLoadingDepts(true);
//       const res = await api.get(`/categories/byclinic/${clinicId}`);
//       setDepartments(res.data.data || []);
//     } catch (err) {
//       console.error("Dept load failed:", err);
//     } finally {
//       setLoadingDepts(false);
//     }
//   };

//   // ── Step 2: Department selected → load doctors ──────────────────────────────
//   const handleDepartmentChange = async (categoryId: string, clinicId: string) => {
//     const dept = departments.find((d) => String(d.CATEGORYID) === categoryId);
//     setSelectedDepartment(dept || null);
//     setSelectedDoctor(null);
//     setDoctors([]);
//     setForm((f) => ({ ...f, TICKETNUMBER: "" }));
//     setErrors((e) => ({ ...e, departmentId: "", doctorId: "" }));

//     if (!categoryId || !clinicId) return;
//     try {
//       setLoadingDoctors(true);
//       const res = await api.get(`/doctors/byclinic/${clinicId}/category/${categoryId}`);
//       setDoctors(res.data.data || []);
//     } catch (err) {
//       console.error("Doctor load failed:", err);
//     } finally {
//       setLoadingDoctors(false);
//     }
//   };

//   // ── Step 3: Doctor selected → auto-fill ticket + zone ──────────────────────
//   const handleDoctorChange = (serviceId: string) => {
//     const doc = doctors.find((d) => String(d.SERVICEID) === serviceId);
//     setSelectedDoctor(doc || null);
//     if (doc) {
//       const seq    = Math.floor(Math.random() * (doc.TICKETEND_W || 99)) + (doc.TICKETSTART_W || 1);
//       const ticket = genTicket(doc.SERIES_W || doc.SHORTNAME || "TK", seq);
//       setForm((f) => ({
//         ...f,
//         TICKETNUMBER: ticket,
//         ZONE:         doc.ZONE ? String(doc.ZONE) : "1",
//       }));
//     }
//     setErrors((e) => ({ ...e, doctorId: "" }));
//     setSelectedPatient(null);
//     setMobileSearch("");
//     setPatientSearchDone(false);
//   };

//   // ── Patient search by mobile ────────────────────────────────────────────────
//   const handlePatientSearch = async () => {
//     if (!mobileSearch.trim() || mobileSearch.trim().length < 7) return;
//     try {
//       setSearchingPatient(true);
//       setPatientSearchDone(false);
//       const res = await api.get(`/appointments/search-patient/${mobileSearch.trim()}`);
//       const patients = res.data.data || [];
//       setFoundPatients(patients);
//       setPatientSearchDone(true);
//       if (patients.length > 0) setShowPatientPopup(true);
//     } catch (err) {
//       console.error("Patient search failed:", err);
//       setFoundPatients([]);
//       setPatientSearchDone(true);
//     } finally {
//       setSearchingPatient(false);
//     }
//   };

//   // Auto-search on mobile input (debounced)
//   const handleMobileInput = (value: string) => {
//     setMobileSearch(value);
//     setPatientSearchDone(false);
//     setSelectedPatient(null);
//     if (mobileRef.current) clearTimeout(mobileRef.current);
//     if (value.trim().length >= 10) {
//       mobileRef.current = setTimeout(() => handlePatientSearch(), 800);
//     }
//   };

//   const handleSelectPatient = (patient: any) => {
//     setSelectedPatient(patient);
//     setPatientName(patient.PatientName || "");
//     setPhone(patient.Mobile || mobileSearch);
//     setShowPatientPopup(false);
//   };

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
//     setForm({ ...form, [e.target.name]: e.target.value });
//     setErrors({ ...errors, [e.target.name]: "" });
//     setApiError("");
//   };

//   const validate = () => {
//     const errs: Record<string, string> = {};
//     if (!selectedClinic)           errs.clinicId     = "Please select a clinic";
//     if (!selectedDepartment)       errs.departmentId = "Please select a department";
//     if (!selectedDoctor)           errs.doctorId     = "Please select a doctor";
//     if (!form.TICKETNUMBER.trim()) errs.TICKETNUMBER = "Ticket number required";
//     setErrors(errs);
//     return Object.keys(errs).length === 0;
//   };

//   // ── Submit ──────────────────────────────────────────────────────────────────
//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!validate()) return;
//     try {
//       setSaving(true);
//       setApiError("");

//       // 1. callhistory — queue ticket
//       await appointmentAPI.create({
//         TICKETNUMBER: form.TICKETNUMBER,
//         COUNTERID:    form.COUNTERID,
//         SERVICEID:    selectedDoctor?.SERVICEID,
//         ZONE:         form.ZONE,
//         TYPE:         form.TYPE,
//         CENTERID:     form.CENTERID,
//         PATIENTNAME:  patientName || selectedPatient?.PatientName || undefined,
//         PHONE:        phone       || selectedPatient?.Mobile       || undefined,
//       });

//       // 2. appointments — appointment record
//       await api.post('/appointments/new', {
//         ClinicId:            Number(form.CENTERID) || 101,
//         DepartmentId:        selectedDepartment?.CATEGORYID  || null,
//         DoctorId:            selectedDoctor?.SERVICEID       || null,
//         PatientId:           selectedPatient?.SLNO           || null,
//         AppointmentDateTime: `${apptDate} 00:00:00`,
//         CreatedBy:           1,
//       });

//       setSuccess(true);
//       setTimeout(() => navigate("/dashboard/Appointments"), 1500);
//     } catch (err: any) {
//       setApiError(err?.response?.data?.message || "Failed to create appointment.");
//     } finally {
//       setSaving(false);
//     }
//   };

//   // ── Success screen ──────────────────────────────────────────────────────────
//   if (success) {
//     return (
//       <div className="bg-gray-50 min-h-screen p-6 flex items-center justify-center">
//         <div className="bg-white rounded-2xl shadow-lg p-10 text-center max-w-sm w-full"
//           style={{ animation: "fadeIn 0.4s ease" }}>
//           <style>{`@keyframes fadeIn{from{opacity:0;transform:scale(.9)}to{opacity:1;transform:scale(1)}}`}</style>
//           <div style={{ fontSize: 56, marginBottom: 16 }}>✅</div>
//           <h2 className="text-xl font-bold text-green-700 mb-2">Appointment Created!</h2>
//           <p className="text-gray-500 text-sm mb-1">
//             Ticket: <strong className="text-indigo-600">{form.TICKETNUMBER}</strong>
//           </p>
//           {selectedDepartment && (
//             <p className="text-gray-500 text-sm mb-1">Dept: <strong>{selectedDepartment.CATEGORYE}</strong></p>
//           )}
//           {selectedDoctor && (
//             <p className="text-gray-500 text-sm mb-1">Doctor: <strong>{selectedDoctor.SERVICE_E}</strong></p>
//           )}
//           {(patientName || selectedPatient?.PatientName) && (
//             <p className="text-gray-500 text-sm mb-1">
//               Patient: <strong>{patientName || selectedPatient?.PatientName}</strong>
//             </p>
//           )}
//           <p className="text-gray-400 text-xs mt-3">Redirecting to appointments...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="p-6 bg-gray-50 min-h-screen" style={{ animation: "slideIn 0.35s ease" }}>
//       <style>{`@keyframes slideIn{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}`}</style>

//       {/* ── Patient Search Popup ── */}
//       {showPatientPopup && foundPatients.length > 0 && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
//           <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-md mx-4"
//             style={{ animation: "fadeIn 0.3s ease" }}>
//             <div className="flex items-center justify-between mb-4">
//               <div>
//                 <h3 className="text-lg font-bold text-gray-800">Select Patient</h3>
//                 <p className="text-sm text-gray-400">
//                   {foundPatients.length} patient(s) found for <strong>{mobileSearch}</strong>
//                 </p>
//               </div>
//               <button onClick={() => setShowPatientPopup(false)}
//                 className="text-gray-400 hover:text-gray-600 text-xl font-bold">×</button>
//             </div>

//             <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
//               {foundPatients.map((p) => (
//                 <div
//                   key={p.SLNO}
//                   onClick={() => handleSelectPatient(p)}
//                   className="flex items-center justify-between p-3 border border-gray-200 rounded-xl
//                              hover:border-indigo-400 hover:bg-indigo-50 cursor-pointer transition"
//                 >
//                   <div>
//                     <p className="font-semibold text-gray-800 text-sm">{p.PatientName}</p>
//                     <p className="text-xs text-gray-400">
//                       {p.Mobile && `📞 ${p.Mobile}`}
//                       {p.Age    && ` · ${p.Age}y`}
//                       {p.Gender && ` · ${p.Gender}`}
//                     </p>
//                   </div>
//                   <div className="text-right">
//                     <span className="text-xs bg-indigo-100 text-indigo-600 px-2 py-0.5 rounded-full font-medium">
//                       #{p.RegNo || p.SLNO}
//                     </span>
//                     <p className="text-xs text-green-600 mt-1 font-semibold">Select →</p>
//                   </div>
//                 </div>
//               ))}
//             </div>

//             <div className="flex gap-2 mt-4 pt-4 border-t border-gray-100">
//               <button
//                 onClick={() => setShowPatientPopup(false)}
//                 className="flex-1 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-600 hover:bg-gray-50 transition"
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={() => { navigate("/dashboard/NewPatient"); setShowPatientPopup(false); }}
//                 className="flex-1 py-2.5 bg-indigo-600 text-white rounded-lg text-sm font-semibold hover:bg-indigo-700 transition"
//               >
//                 + New Patient
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       <div className="bg-white rounded-2xl shadow-sm p-6 max-w-3xl mx-auto border border-gray-100">

//         {/* Header */}
//         <div className="flex items-center justify-between mb-8">
//           <div>
//             <h2 className="text-xl font-bold text-gray-900">📅 New Appointment</h2>
//             <p className="text-sm text-gray-400 mt-0.5">
//               Select Clinic → Department → Doctor → Patient → Details
//             </p>
//           </div>
//           <button onClick={() => navigate("/dashboard/Appointments")}
//             className="text-sm text-gray-500 border px-3 py-1.5 rounded-lg hover:bg-gray-50 transition">
//             ← Back
//           </button>
//         </div>

//         {loading && <div className="text-center py-10 text-gray-400 text-sm">⏳ Loading...</div>}

//         {apiError && (
//           <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
//             ❌ {apiError}
//           </div>
//         )}

//         {!loading && (
//           <form onSubmit={handleSubmit} className="space-y-6">

//             {/* ── STEP 1: Clinic ── */}
//             <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-4">
//               <p className="text-xs font-bold text-indigo-500 uppercase tracking-wider mb-3">
//                 Step 1 — Select Clinic
//               </p>
//               <div>
//                 <label className="block mb-1.5 font-medium text-sm text-gray-700">
//                   Clinic Name <span className="text-red-500">*</span>
//                 </label>
//                 <select value={selectedClinic} onChange={(e) => handleClinicChange(e.target.value)}
//                   className={inputCls(errors.clinicId)}>
//                   <option value="">-- Select Clinic --</option>
//                   {clinics.map((c) => (
//                     <option key={c.id} value={c.id}>{c.name}</option>
//                   ))}
//                 </select>
//                 {errors.clinicId && <p className="text-red-500 text-xs mt-1">{errors.clinicId}</p>}
//               </div>
//             </div>

//             {/* ── STEP 2: Department ── */}
//             {selectedClinic && (
//               <div className="bg-blue-50 border border-blue-100 rounded-xl p-4"
//                 style={{ animation: "slideIn 0.3s ease" }}>
//                 <p className="text-xs font-bold text-blue-500 uppercase tracking-wider mb-3">
//                   Step 2 — Select Department
//                 </p>
//                 {loadingDepts ? (
//                   <p className="text-sm text-gray-400">⏳ Loading departments...</p>
//                 ) : (
//                   <div>
//                     <label className="block mb-1.5 font-medium text-sm text-gray-700">
//                       Department <span className="text-red-500">*</span>
//                     </label>
//                     <select
//                       value={selectedDepartment?.CATEGORYID || ""}
//                       onChange={(e) => handleDepartmentChange(e.target.value, selectedClinic)}
//                       className={inputCls(errors.departmentId)}
//                     >
//                       <option value="">-- Select Department --</option>
//                       {departments.map((d) => (
//                         <option key={d.CATEGORYID} value={d.CATEGORYID}>{d.CATEGORYE}</option>
//                       ))}
//                     </select>
//                     {errors.departmentId && <p className="text-red-500 text-xs mt-1">{errors.departmentId}</p>}
//                     {!loadingDepts && departments.length === 0 && (
//                       <p className="text-orange-500 text-xs mt-1">No departments found for this clinic</p>
//                     )}
//                   </div>
//                 )}
//               </div>
//             )}

//             {/* ── STEP 3: Doctor ── */}
//             {selectedDepartment && (
//               <div className="bg-purple-50 border border-purple-100 rounded-xl p-4"
//                 style={{ animation: "slideIn 0.3s ease" }}>
//                 <p className="text-xs font-bold text-purple-500 uppercase tracking-wider mb-3">
//                   Step 3 — Select Doctor
//                 </p>
//                 {loadingDoctors ? (
//                   <p className="text-sm text-gray-400">⏳ Loading doctors...</p>
//                 ) : (
//                   <div>
//                     <label className="block mb-1.5 font-medium text-sm text-gray-700">
//                       Doctor <span className="text-red-500">*</span>
//                     </label>
//                     <select
//                       value={selectedDoctor?.SERVICEID || ""}
//                       onChange={(e) => handleDoctorChange(e.target.value)}
//                       className={inputCls(errors.doctorId)}
//                     >
//                       <option value="">-- Select Doctor --</option>
//                       {doctors.map((d) => (
//                         <option key={d.SERVICEID} value={d.SERVICEID}>
//                           {d.SERVICE_E} {d.SHORTNAME ? `(${d.SHORTNAME})` : ""}
//                         </option>
//                       ))}
//                     </select>
//                     {errors.doctorId && <p className="text-red-500 text-xs mt-1">{errors.doctorId}</p>}
//                     {!loadingDoctors && doctors.length === 0 && (
//                       <p className="text-orange-500 text-xs mt-1">No doctors found in this department</p>
//                     )}
//                   </div>
//                 )}
//               </div>
//             )}

//             {/* ── PATIENT SEARCH ── */}
//             {selectedDoctor && (
//               <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4"
//                 style={{ animation: "slideIn 0.3s ease" }}>
//                 <p className="text-xs font-bold text-yellow-600 uppercase tracking-wider mb-3">
//                   Patient Search
//                 </p>

//                 <div className="flex gap-2">
//                   <input
//                     type="tel"
//                     value={mobileSearch}
//                     onChange={(e) => handleMobileInput(e.target.value)}
//                     onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handlePatientSearch())}
//                     placeholder="Enter patient mobile number to search..."
//                     maxLength={15}
//                     className="flex-1 border border-gray-300 rounded-lg px-3 py-2.5 text-sm
//                                focus:outline-none focus:ring-2 focus:ring-yellow-400 bg-white"
//                   />
//                   <button
//                     type="button"
//                     onClick={handlePatientSearch}
//                     disabled={searchingPatient || mobileSearch.trim().length < 7}
//                     className="bg-yellow-500 text-white px-4 py-2.5 rounded-lg text-sm font-semibold
//                                hover:bg-yellow-600 disabled:opacity-50 transition whitespace-nowrap"
//                   >
//                     {searchingPatient ? "⏳" : "🔍 Search"}
//                   </button>
//                 </div>

//                 {/* Selected patient badge */}
//                 {selectedPatient && (
//                   <div className="mt-3 flex items-center gap-3 bg-green-50 border border-green-200
//                                   rounded-xl px-4 py-3">
//                     <div className="w-9 h-9 rounded-full bg-green-200 text-green-700 flex items-center
//                                     justify-center font-bold text-sm">
//                       {(selectedPatient.PatientName || "P").charAt(0).toUpperCase()}
//                     </div>
//                     <div className="flex-1">
//                       <p className="font-semibold text-green-800 text-sm">{selectedPatient.PatientName}</p>
//                       <p className="text-xs text-green-600">
//                         📞 {selectedPatient.Mobile}
//                         {selectedPatient.Age    && ` · ${selectedPatient.Age}y`}
//                         {selectedPatient.Gender && ` · ${selectedPatient.Gender}`}
//                         {(selectedPatient.RegNo || selectedPatient.SLNO) &&
//                           ` · #${selectedPatient.RegNo || selectedPatient.SLNO}`}
//                       </p>
//                     </div>
//                     <button
//                       type="button"
//                       onClick={() => {
//                         setSelectedPatient(null);
//                         setPatientName("");
//                         setPhone("");
//                       }}
//                       className="text-xs text-red-400 hover:text-red-600 hover:underline"
//                     >
//                       ✕ Remove
//                     </button>
//                   </div>
//                 )}

//                 {/* Patient not found */}
//                 {patientSearchDone && !selectedPatient && foundPatients.length === 0 && mobileSearch.trim().length >= 7 && (
//                   <div className="mt-3 flex items-center justify-between p-3 bg-orange-50
//                                   border border-orange-200 rounded-xl text-sm text-orange-700">
//                     <span>⚠️ No patient found for <strong>{mobileSearch}</strong></span>
//                     <button
//                       type="button"
//                       onClick={() => navigate("/dashboard/NewPatient")}
//                       className="ml-3 bg-orange-500 text-white px-3 py-1.5 rounded-lg text-xs
//                                  hover:bg-orange-600 transition font-semibold whitespace-nowrap"
//                     >
//                       + Create New Patient
//                     </button>
//                   </div>
//                 )}

//                 {/* Show results again */}
//                 {patientSearchDone && foundPatients.length > 0 && !selectedPatient && (
//                   <button
//                     type="button"
//                     onClick={() => setShowPatientPopup(true)}
//                     className="mt-2 text-xs text-indigo-500 hover:underline"
//                   >
//                     Show {foundPatients.length} found patient(s) again
//                   </button>
//                 )}
//               </div>
//             )}

//             {/* ── STEP 4: Appointment Details ── */}
//             {selectedDoctor && (
//               <div className="bg-green-50 border border-green-100 rounded-xl p-4"
//                 style={{ animation: "slideIn 0.3s ease" }}>
//                 <p className="text-xs font-bold text-green-600 uppercase tracking-wider mb-3">
//                   Appointment Details
//                 </p>

//                 {/* Doctor info card */}
//                 <div className="flex items-center gap-3 mb-5 p-3 bg-white rounded-xl border border-green-200">
//                   <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-600 flex items-center
//                                   justify-center font-bold text-sm">
//                     {(selectedDoctor.SERVICE_E || "DR")
//                       .replace(/Dr\.?\s*/i, "").split(" ")
//                       .map((n: string) => n[0]).slice(0, 2).join("").toUpperCase()}
//                   </div>
//                   <div>
//                     <p className="font-semibold text-gray-800 text-sm">{selectedDoctor.SERVICE_E}</p>
//                     <p className="text-xs text-gray-400">
//                       {selectedDepartment?.CATEGORYE} · Zone {selectedDoctor.ZONE} · Clinic {selectedDoctor.CLINICID}
//                     </p>
//                   </div>
//                   <div className="ml-auto text-right">
//                     <p className="text-xs text-gray-400">Auto Ticket</p>
//                     <p className="font-bold text-indigo-600">{form.TICKETNUMBER}</p>
//                   </div>
//                 </div>

//                 {/* ── Only 4 visible fields now ── */}
//                 <div className="grid md:grid-cols-2 gap-4">

//                   <div>
//                     <label className="block mb-1.5 font-medium text-sm text-gray-700">
//                       Ticket Number <span className="text-red-500">*</span>
//                     </label>
//                     <input
//                       name="TICKETNUMBER"
//                       value={form.TICKETNUMBER}
//                       onChange={handleChange}
//                       placeholder="e.g. AS1, ML21"
//                       className={inputCls(errors.TICKETNUMBER)}
//                     />
//                     {errors.TICKETNUMBER && <p className="text-red-500 text-xs mt-1">{errors.TICKETNUMBER}</p>}
//                   </div>

//                   <div>
//                     <label className="block mb-1.5 font-medium text-sm text-gray-700">
//                       Appointment Date
//                     </label>
//                     <input
//                       type="date"
//                       value={apptDate}
//                       onChange={(e) => setApptDate(e.target.value)}
//                       className={inputCls()}
//                     />
//                   </div>

//                   <div>
//                     <label className="block mb-1.5 font-medium text-sm text-gray-700">Patient Name</label>
//                     <input
//                       value={patientName}
//                       onChange={(e) => setPatientName(e.target.value)}
//                       placeholder={selectedPatient ? selectedPatient.PatientName : "Enter patient name"}
//                       className={inputCls()}
//                     />
//                   </div>

//                   <div>
//                     <label className="block mb-1.5 font-medium text-sm text-gray-700">Phone Number</label>
//                     <input
//                       value={phone}
//                       onChange={(e) => setPhone(e.target.value)}
//                       placeholder={selectedPatient ? selectedPatient.Mobile : "+971 ..."}
//                       className={inputCls()}
//                     />
//                   </div>

//                 </div>
//                 {/* Counter, Type, Zone, Center ID are sent as hidden defaults — not shown in UI */}
//               </div>
//             )}

//             {/* Actions */}
//             <div className="flex justify-end gap-3 pt-2">
//               <button
//                 type="button"
//                 onClick={() => navigate("/dashboard/Appointments")}
//                 className="px-5 py-2.5 border border-gray-300 rounded-lg text-gray-600
//                            hover:bg-gray-50 text-sm transition"
//               >
//                 Cancel
//               </button>
//               <button
//                 type="submit"
//                 disabled={saving || !selectedDoctor}
//                 className="bg-indigo-600 text-white px-7 py-2.5 rounded-lg hover:bg-indigo-700
//                            disabled:opacity-50 flex items-center gap-2 text-sm font-semibold transition"
//               >
//                 {saving ? (
//                   <>
//                     <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
//                     Creating...
//                   </>
//                 ) : "✅ Create Appointment"}
//               </button>
//             </div>

//           </form>
//         )}
//       </div>
//     </div>
//   );
// };

// export default NewAppointment;
import React, { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { appointmentAPI, clinicAPI } from "../../services/api";
import api from "../../services/api";

// ── Ticket generator ──────────────────────────────────────────────────────────
function genTicket(series: string, num: number) {
  const prefix = (series || "TK").substring(0, 2).toUpperCase();
  return `${prefix}${num}`;
}

// FIX 3: Strict 10-digit validation regex
const MOBILE_REGEX = /^\d{10}$/;

const inputCls = (err?: string) =>
  `w-full border rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-400 text-sm transition ${
    err ? "border-red-400 bg-red-50" : "border-gray-300 bg-white"
  }`;

// ─────────────────────────────────────────────────────────────────────────────
const NewAppointment: React.FC = () => {
  const navigate = useNavigate();

  const [clinics,     setClinics]     = useState<any[]>([]);
  const [departments, setDepartments] = useState<any[]>([]);
  const [doctors,     setDoctors]     = useState<any[]>([]);

  const [selectedClinic,     setSelectedClinic]     = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState<any>(null);
  const [selectedDoctor,     setSelectedDoctor]     = useState<any>(null);

  // ── Patient search state ──────────────────────────────────────────────────
  const [mobileSearch,      setMobileSearch]      = useState("");
  const [mobileError,       setMobileError]       = useState("");      // FIX 3
  const [searchingPatient,  setSearchingPatient]  = useState(false);
  const [foundPatients,     setFoundPatients]     = useState<any[]>([]);
  const [selectedPatient,   setSelectedPatient]   = useState<any>(null);
  const [showPatientPopup,  setShowPatientPopup]  = useState(false);
  const [patientSearchDone, setPatientSearchDone] = useState(false);

  // FIX 4: One ref for debounce timer, one flag for in-flight guard
  const debounceRef    = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isSearchingRef = useRef(false);

  // FIX 1: Inline new-patient form state (no navigation away)
  const [showNewPatientForm, setShowNewPatientForm] = useState(false);
  const [newPatientName,     setNewPatientName]     = useState("");
  const [newPatientGender,   setNewPatientGender]   = useState("Male");
  const [creatingPatient,    setCreatingPatient]    = useState(false);
  const [newPatientError,    setNewPatientError]    = useState("");

  const [form, setForm] = useState({
    TICKETNUMBER: "",
    COUNTERID:    "1",    // hidden default
    ZONE:         "1",    // hidden default
    TYPE:         "D",    // hidden default
    CENTERID:     "101",  // hidden default
  });

  // FIX 6: Use local date (avoids UTC offset shifting date by -1 day)
  const todayLocal = (): string => {
    const d    = new Date();
    const yyyy = d.getFullYear();
    const mm   = String(d.getMonth() + 1).padStart(2, "0");
    const dd   = String(d.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  };
  const [apptDate, setApptDate] = useState(todayLocal);

  const [patientName, setPatientName] = useState("");
  const [phone,       setPhone]       = useState("");

  const [errors,         setErrors]         = useState<Record<string, string>>({});
  const [saving,         setSaving]         = useState(false);
  const [success,        setSuccess]        = useState(false);
  const [apiError,       setApiError]       = useState("");
  const [loading,        setLoading]        = useState(true);
  const [loadingDepts,   setLoadingDepts]   = useState(false);
  const [loadingDoctors, setLoadingDoctors] = useState(false);

  // ── Load clinic on mount ────────────────────────────────────────────────────
  useEffect(() => {
    const load = async () => {
      try {
        const clinicRes    = await clinicAPI.getDetails();
        const clinicDetail = clinicRes.data.data;
        if (clinicDetail) {
          const clinicId = String(clinicDetail.COMPANYID || clinicDetail.ID || "101");
          setClinics([{ id: clinicId, name: clinicDetail.COMPANYNAME }]);
        }
      } catch (err) {
        console.error("Load failed:", err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  // ── FIX 5: Centralised reset for all patient-related state ───────────────
  const resetPatientSearch = useCallback(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    isSearchingRef.current = false;
    setMobileSearch("");
    setMobileError("");
    setFoundPatients([]);
    setSelectedPatient(null);
    setPatientSearchDone(false);
    setShowPatientPopup(false);
    setShowNewPatientForm(false);
    setNewPatientName("");
    setNewPatientGender("Male");
    setNewPatientError("");
    setPatientName("");
    setPhone("");
  }, []);

  // ── Step 1: Clinic → departments ─────────────────────────────────────────
  const handleClinicChange = async (clinicId: string) => {
    setSelectedClinic(clinicId);
    setSelectedDepartment(null);
    setSelectedDoctor(null);
    setDepartments([]);
    setDoctors([]);
    setForm((f) => ({ ...f, TICKETNUMBER: "", CENTERID: clinicId || "101" }));
    setErrors({});
    resetPatientSearch(); // FIX 5

    if (!clinicId) return;
    try {
      setLoadingDepts(true);
      const res = await api.get(`/categories/byclinic/${clinicId}`);
      setDepartments(res.data.data || []);
    } catch (err) {
      console.error("Dept load failed:", err);
    } finally {
      setLoadingDepts(false);
    }
  };

  // ── Step 2: Department → doctors ──────────────────────────────────────────
  const handleDepartmentChange = async (categoryId: string, clinicId: string) => {
    const dept = departments.find((d) => String(d.CATEGORYID) === categoryId);
    setSelectedDepartment(dept || null);
    setSelectedDoctor(null);
    setDoctors([]);
    setForm((f) => ({ ...f, TICKETNUMBER: "" }));
    setErrors((e) => ({ ...e, departmentId: "", doctorId: "" }));

    if (!categoryId || !clinicId) return;
    try {
      setLoadingDoctors(true);
      const res = await api.get(`/doctors/byclinic/${clinicId}/category/${categoryId}`);
      setDoctors(res.data.data || []);
    } catch (err) {
      console.error("Doctor load failed:", err);
    } finally {
      setLoadingDoctors(false);
    }
  };

  // ── Step 3: Doctor → ticket ───────────────────────────────────────────────
  const handleDoctorChange = (serviceId: string) => {
    const doc = doctors.find((d) => String(d.SERVICEID) === serviceId);
    setSelectedDoctor(doc || null);
    if (doc) {
      const seq    = Math.floor(Math.random() * (doc.TICKETEND_W || 99)) + (doc.TICKETSTART_W || 1);
      const ticket = genTicket(doc.SERIES_W || doc.SHORTNAME || "TK", seq);
      setForm((f) => ({
        ...f,
        TICKETNUMBER: ticket,
        ZONE: doc.ZONE ? String(doc.ZONE) : "1",
      }));
    }
    setErrors((e) => ({ ...e, doctorId: "" }));
    resetPatientSearch(); // FIX 5
  };

  // ── FIX 4: Core search — in-flight guard prevents duplicate API calls ─────
  const executeSearch = useCallback(async (mobile: string) => {
    if (isSearchingRef.current) return; // already running — skip
    isSearchingRef.current = true;
    setSearchingPatient(true);
    setPatientSearchDone(false);
    setShowNewPatientForm(false);
    try {
      const res      = await api.get(`/appointments/search-patient/${mobile}`);
      const patients = res.data.data || [];
      setFoundPatients(patients);
      setPatientSearchDone(true);
      setShowPatientPopup(patients.length > 0);
    } catch (err) {
      console.error("Patient search failed:", err);
      setFoundPatients([]);
      setPatientSearchDone(true);
    } finally {
      setSearchingPatient(false);
      isSearchingRef.current = false;
    }
  }, []);

  // ── FIX 3 + 4 + 5: Mobile input handler ──────────────────────────────────
  const handleMobileInput = (raw: string) => {
    // FIX 3: Strip non-digits, cap at 10
    const digits = raw.replace(/\D/g, "").slice(0, 10);
    setMobileSearch(digits);

    // FIX 5: Clear old results whenever number changes
    setSelectedPatient(null);
    setFoundPatients([]);
    setPatientSearchDone(false);
    setShowPatientPopup(false);
    setShowNewPatientForm(false);
    setNewPatientName("");
    setNewPatientError("");

    // FIX 3: Live length validation
    if (digits.length > 0 && digits.length < 10) {
      setMobileError("Mobile number must be exactly 10 digits");
    } else {
      setMobileError("");
    }

    // FIX 4: Cancel previous debounce before scheduling a new one
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (digits.length === 10) {
      debounceRef.current = setTimeout(() => executeSearch(digits), 800);
    }
  };

  // FIX 4: Search button cancels the pending debounce so there's exactly one call
  const handleSearchButton = () => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (!MOBILE_REGEX.test(mobileSearch)) {
      setMobileError("Please enter a valid 10-digit mobile number");
      return;
    }
    setMobileError("");
    executeSearch(mobileSearch);
  };

  const handleSelectPatient = (patient: any) => {
    setSelectedPatient(patient);
    setPatientName(patient.PatientName || "");
    setPhone(patient.Mobile || mobileSearch);
    setShowPatientPopup(false);
    setShowNewPatientForm(false);
  };

  // ── FIX 1 + 2: Create new patient inline, immediately capture PatientId ──
  const handleCreateNewPatient = async () => {
    if (!newPatientName.trim()) {
      setNewPatientError("Patient name is required");
      return;
    }
    if (!MOBILE_REGEX.test(mobileSearch)) {
      setNewPatientError("Valid 10-digit mobile is required");
      return;
    }
    try {
      setCreatingPatient(true);
      setNewPatientError("");

      const res     = await api.post("/patients", {
        PatientName: newPatientName.trim(),
        Mobile:      mobileSearch,
        Gender:      newPatientGender,
      });
      const created = res.data.data || res.data;

      // FIX 2: Immediately populate selectedPatient so PatientId is never null
      handleSelectPatient({
        SLNO:        created.SLNO || created.id || created.PatientId,
        PatientName: newPatientName.trim(),
        Mobile:      mobileSearch,
        Gender:      newPatientGender,
        RegNo:       created.RegNo || null,
      });
    } catch (err: any) {
      setNewPatientError(
        err?.response?.data?.message || "Failed to create patient. Please try again."
      );
    } finally {
      setCreatingPatient(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
    setApiError("");
  };

  // ── FIX 2: Validation — patient is now required ───────────────────────────
  const validate = () => {
    const errs: Record<string, string> = {};
    if (!selectedClinic)           errs.clinicId     = "Please select a clinic";
    if (!selectedDepartment)       errs.departmentId = "Please select a department";
    if (!selectedDoctor)           errs.doctorId     = "Please select a doctor";
    if (!form.TICKETNUMBER.trim()) errs.TICKETNUMBER = "Ticket number is required";
    if (!selectedPatient?.SLNO)    errs.patient      = "Please search and select a patient before booking";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  // ── Submit ────────────────────────────────────────────────────────────────
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    try {
      setSaving(true);
      setApiError("");

      const patientId = selectedPatient.SLNO; // FIX 2: guaranteed non-null here

      // 1. callhistory — queue ticket
      await appointmentAPI.create({
        TICKETNUMBER: form.TICKETNUMBER,
        COUNTERID:    form.COUNTERID,
        SERVICEID:    selectedDoctor?.SERVICEID,
        ZONE:         form.ZONE,
        TYPE:         form.TYPE,
        CENTERID:     form.CENTERID,
        PATIENTNAME:  patientName || selectedPatient?.PatientName,
        PHONE:        phone       || selectedPatient?.Mobile,
      });

      // 2. appointments table
      await api.post("/appointments/new", {
        ClinicId:            Number(form.CENTERID) || 101,
        DepartmentId:        selectedDepartment?.CATEGORYID || null,
        DoctorId:            selectedDoctor?.SERVICEID      || null,
        PatientId:           patientId,                       // FIX 2: never null
        AppointmentDateTime: `${apptDate} 00:00:00`,          // FIX 6: local date
        CreatedBy:           1,
      });

      setSuccess(true);
      setTimeout(() => navigate("/dashboard/Appointments"), 1800);
    } catch (err: any) {
      setApiError(err?.response?.data?.message || "Failed to create appointment.");
    } finally {
      setSaving(false);
    }
  };

  // ── Success screen ────────────────────────────────────────────────────────
  if (success) {
    return (
      <div className="bg-gray-50 min-h-screen p-6 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-lg p-10 text-center max-w-sm w-full"
          style={{ animation: "fadeIn 0.4s ease" }}>
          <style>{`@keyframes fadeIn{from{opacity:0;transform:scale(.9)}to{opacity:1;transform:scale(1)}}`}</style>
          <div style={{ fontSize: 56, marginBottom: 16 }}>✅</div>
          <h2 className="text-xl font-bold text-green-700 mb-2">Appointment Created!</h2>
          <p className="text-gray-500 text-sm mb-1">
            Ticket: <strong className="text-indigo-600">{form.TICKETNUMBER}</strong>
          </p>
          {selectedDepartment && (
            <p className="text-gray-500 text-sm mb-1">Dept: <strong>{selectedDepartment.CATEGORYE}</strong></p>
          )}
          {selectedDoctor && (
            <p className="text-gray-500 text-sm mb-1">Doctor: <strong>{selectedDoctor.SERVICE_E}</strong></p>
          )}
          {selectedPatient?.PatientName && (
            <p className="text-gray-500 text-sm mb-1">Patient: <strong>{selectedPatient.PatientName}</strong></p>
          )}
          <p className="text-gray-400 text-xs mt-3">Redirecting to appointments...</p>
        </div>
      </div>
    );
  }

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="p-6 bg-gray-50 min-h-screen" style={{ animation: "slideIn 0.35s ease" }}>
      <style>{`@keyframes slideIn{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}`}</style>

      {/* ── Patient select popup ── */}
      {showPatientPopup && foundPatients.length > 0 && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-md mx-4"
            style={{ animation: "fadeIn 0.3s ease" }}>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-bold text-gray-800">Select Patient</h3>
                <p className="text-sm text-gray-400">
                  {foundPatients.length} patient(s) found for <strong>{mobileSearch}</strong>
                </p>
              </div>
              <button onClick={() => setShowPatientPopup(false)}
                className="text-gray-400 hover:text-gray-600 text-xl font-bold">×</button>
            </div>

            <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
              {foundPatients.map((p) => (
                <div key={p.SLNO} onClick={() => handleSelectPatient(p)}
                  className="flex items-center justify-between p-3 border border-gray-200 rounded-xl
                             hover:border-indigo-400 hover:bg-indigo-50 cursor-pointer transition">
                  <div>
                    <p className="font-semibold text-gray-800 text-sm">{p.PatientName}</p>
                    <p className="text-xs text-gray-400">
                      {p.Mobile && `📞 ${p.Mobile}`}
                      {p.Age    && ` · ${p.Age}y`}
                      {p.Gender && ` · ${p.Gender}`}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-xs bg-indigo-100 text-indigo-600 px-2 py-0.5 rounded-full font-medium">
                      #{p.RegNo || p.SLNO}
                    </span>
                    <p className="text-xs text-green-600 mt-1 font-semibold">Select →</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex gap-2 mt-4 pt-4 border-t border-gray-100">
              <button onClick={() => setShowPatientPopup(false)}
                className="flex-1 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-600 hover:bg-gray-50 transition">
                Cancel
              </button>
              {/* FIX 1: Opens inline form instead of navigating away */}
              <button
                onClick={() => { setShowPatientPopup(false); setShowNewPatientForm(true); }}
                className="flex-1 py-2.5 bg-indigo-600 text-white rounded-lg text-sm font-semibold hover:bg-indigo-700 transition">
                + New Patient
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Main form card ── */}
      <div className="bg-white rounded-2xl shadow-sm p-6 max-w-3xl mx-auto border border-gray-100">

        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-xl font-bold text-gray-900">📅 New Appointment</h2>
            <p className="text-sm text-gray-400 mt-0.5">
              Clinic → Department → Doctor → Patient → Details
            </p>
          </div>
          <button onClick={() => navigate("/dashboard/Appointments")}
            className="text-sm text-gray-500 border px-3 py-1.5 rounded-lg hover:bg-gray-50 transition">
            ← Back
          </button>
        </div>

        {loading && <div className="text-center py-10 text-gray-400 text-sm">⏳ Loading...</div>}

        {apiError && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
            ❌ {apiError}
          </div>
        )}

        {!loading && (
          <form onSubmit={handleSubmit} className="space-y-6">

            {/* ── STEP 1: Clinic ── */}
            <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-4">
              <p className="text-xs font-bold text-indigo-500 uppercase tracking-wider mb-3">
                Step 1 — Select Clinic
              </p>
              <label className="block mb-1.5 font-medium text-sm text-gray-700">
                Clinic <span className="text-red-500">*</span>
              </label>
              <select value={selectedClinic} onChange={(e) => handleClinicChange(e.target.value)}
                className={inputCls(errors.clinicId)}>
                <option value="">-- Select Clinic --</option>
                {clinics.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
              {errors.clinicId && <p className="text-red-500 text-xs mt-1">{errors.clinicId}</p>}
            </div>

            {/* ── STEP 2: Department ── */}
            {selectedClinic && (
              <div className="bg-blue-50 border border-blue-100 rounded-xl p-4"
                style={{ animation: "slideIn 0.3s ease" }}>
                <p className="text-xs font-bold text-blue-500 uppercase tracking-wider mb-3">
                  Step 2 — Select Department
                </p>
                {loadingDepts ? (
                  <p className="text-sm text-gray-400">⏳ Loading departments...</p>
                ) : (
                  <>
                    <label className="block mb-1.5 font-medium text-sm text-gray-700">
                      Department <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={selectedDepartment?.CATEGORYID || ""}
                      onChange={(e) => handleDepartmentChange(e.target.value, selectedClinic)}
                      className={inputCls(errors.departmentId)}>
                      <option value="">-- Select Department --</option>
                      {departments.map((d) => (
                        <option key={d.CATEGORYID} value={d.CATEGORYID}>{d.CATEGORYE}</option>
                      ))}
                    </select>
                    {errors.departmentId && <p className="text-red-500 text-xs mt-1">{errors.departmentId}</p>}
                    {!loadingDepts && departments.length === 0 && (
                      <p className="text-orange-500 text-xs mt-1">No departments found for this clinic</p>
                    )}
                  </>
                )}
              </div>
            )}

            {/* ── STEP 3: Doctor ── */}
            {selectedDepartment && (
              <div className="bg-purple-50 border border-purple-100 rounded-xl p-4"
                style={{ animation: "slideIn 0.3s ease" }}>
                <p className="text-xs font-bold text-purple-500 uppercase tracking-wider mb-3">
                  Step 3 — Select Doctor
                </p>
                {loadingDoctors ? (
                  <p className="text-sm text-gray-400">⏳ Loading doctors...</p>
                ) : (
                  <>
                    <label className="block mb-1.5 font-medium text-sm text-gray-700">
                      Doctor <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={selectedDoctor?.SERVICEID || ""}
                      onChange={(e) => handleDoctorChange(e.target.value)}
                      className={inputCls(errors.doctorId)}>
                      <option value="">-- Select Doctor --</option>
                      {doctors.map((d) => (
                        <option key={d.SERVICEID} value={d.SERVICEID}>
                          {d.SERVICE_E} {d.SHORTNAME ? `(${d.SHORTNAME})` : ""}
                        </option>
                      ))}
                    </select>
                    {errors.doctorId && <p className="text-red-500 text-xs mt-1">{errors.doctorId}</p>}
                    {!loadingDoctors && doctors.length === 0 && (
                      <p className="text-orange-500 text-xs mt-1">No doctors found in this department</p>
                    )}
                  </>
                )}
              </div>
            )}

            {/* ── STEP 4: Patient Search ── */}
            {selectedDoctor && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4"
                style={{ animation: "slideIn 0.3s ease" }}>
                <p className="text-xs font-bold text-yellow-600 uppercase tracking-wider mb-3">
                  Step 4 — Search Patient <span className="text-red-500">*</span>
                </p>

                {/* FIX 2: Patient required error */}
                {errors.patient && (
                  <p className="mb-2 text-red-500 text-xs font-medium">⚠️ {errors.patient}</p>
                )}

                {/* Mobile input row — only when no patient selected yet */}
                {!selectedPatient && (
                  <div className="space-y-1">
                    <div className="flex gap-2">
                      <input
                        type="tel"
                        inputMode="numeric"                   // FIX 3: numeric keyboard on mobile
                        value={mobileSearch}
                        onChange={(e) => handleMobileInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") { e.preventDefault(); handleSearchButton(); }
                        }}
                        placeholder="Enter 10-digit mobile number"
                        maxLength={10}                        // FIX 3
                        className={`flex-1 border rounded-lg px-3 py-2.5 text-sm
                                   focus:outline-none focus:ring-2 focus:ring-yellow-400 bg-white
                                   ${mobileError ? "border-red-400 bg-red-50" : "border-gray-300"}`}
                      />
                      <button
                        type="button"
                        onClick={handleSearchButton}          // FIX 4: cancels debounce
                        disabled={searchingPatient || mobileSearch.length !== 10}
                        className="bg-yellow-500 text-white px-4 py-2.5 rounded-lg text-sm font-semibold
                                   hover:bg-yellow-600 disabled:opacity-50 transition whitespace-nowrap"
                      >
                        {searchingPatient ? "⏳" : "🔍 Search"}
                      </button>
                    </div>
                    {/* FIX 3: Inline validation feedback */}
                    {mobileError && <p className="text-red-500 text-xs">{mobileError}</p>}
                    {mobileSearch.length === 10 && !mobileError && !searchingPatient && !patientSearchDone && (
                      <p className="text-gray-400 text-xs">Searching automatically...</p>
                    )}
                  </div>
                )}

                {/* Selected patient badge */}
                {selectedPatient && (
                  <div className="flex items-center gap-3 bg-green-50 border border-green-200 rounded-xl px-4 py-3">
                    <div className="w-9 h-9 rounded-full bg-green-200 text-green-700 flex items-center
                                    justify-center font-bold text-sm">
                      {(selectedPatient.PatientName || "P").charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-green-800 text-sm">{selectedPatient.PatientName}</p>
                      <p className="text-xs text-green-600">
                        📞 {selectedPatient.Mobile}
                        {selectedPatient.Age    && ` · ${selectedPatient.Age}y`}
                        {selectedPatient.Gender && ` · ${selectedPatient.Gender}`}
                        {(selectedPatient.RegNo || selectedPatient.SLNO) &&
                          ` · #${selectedPatient.RegNo || selectedPatient.SLNO}`}
                      </p>
                    </div>
                    <button type="button" onClick={resetPatientSearch}  // FIX 5: full reset
                      className="text-xs text-red-400 hover:text-red-600 hover:underline">
                      ✕ Change
                    </button>
                  </div>
                )}

                {/* Not found banner */}
                {patientSearchDone && !selectedPatient && foundPatients.length === 0
                  && mobileSearch.length === 10 && !showNewPatientForm && (
                  <div className="mt-3 flex items-center justify-between p-3 bg-orange-50
                                  border border-orange-200 rounded-xl text-sm text-orange-700">
                    <span>⚠️ No patient found for <strong>{mobileSearch}</strong></span>
                    {/* FIX 1: Inline form, not navigate away */}
                    <button type="button" onClick={() => setShowNewPatientForm(true)}
                      className="ml-3 bg-orange-500 text-white px-3 py-1.5 rounded-lg text-xs
                                 hover:bg-orange-600 transition font-semibold whitespace-nowrap">
                      + Create New Patient
                    </button>
                  </div>
                )}

                {/* Show results again */}
                {patientSearchDone && foundPatients.length > 0 && !selectedPatient && !showNewPatientForm && (
                  <button type="button" onClick={() => setShowPatientPopup(true)}
                    className="mt-2 text-xs text-indigo-500 hover:underline">
                    Show {foundPatients.length} found patient(s) again
                  </button>
                )}

                {/* ── FIX 1: Inline new-patient mini-form ── */}
                {showNewPatientForm && !selectedPatient && (
                  <div className="mt-3 p-4 bg-white border border-orange-200 rounded-xl space-y-3"
                    style={{ animation: "slideIn 0.3s ease" }}>
                    <p className="text-sm font-bold text-orange-700">
                      📝 Create New Patient —{" "}
                      <span className="font-normal text-gray-500">{mobileSearch}</span>
                    </p>

                    {newPatientError && (
                      <p className="text-red-500 text-xs">❌ {newPatientError}</p>
                    )}

                    <div className="grid grid-cols-2 gap-3">
                      <div className="col-span-2">
                        <label className="block text-xs font-semibold text-gray-600 mb-1">
                          Full Name <span className="text-red-500">*</span>
                        </label>
                        <input
                          value={newPatientName}
                          onChange={(e) => { setNewPatientName(e.target.value); setNewPatientError(""); }}
                          placeholder="e.g. John Smith"
                          className={inputCls(newPatientError && !newPatientName.trim() ? "err" : undefined)}
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-gray-600 mb-1">Gender</label>
                        <select value={newPatientGender} onChange={(e) => setNewPatientGender(e.target.value)}
                          className={inputCls()}>
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-gray-600 mb-1">Mobile</label>
                        <input value={mobileSearch} disabled
                          className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm
                                     bg-gray-50 text-gray-500 cursor-not-allowed" />
                      </div>
                    </div>

                    <div className="flex gap-2 pt-1">
                      <button type="button"
                        onClick={() => { setShowNewPatientForm(false); setNewPatientError(""); }}
                        className="flex-1 py-2 border border-gray-300 rounded-lg text-sm text-gray-600 hover:bg-gray-50 transition">
                        Cancel
                      </button>
                      <button type="button" onClick={handleCreateNewPatient}
                        disabled={creatingPatient || !newPatientName.trim()}
                        className="flex-1 py-2 bg-green-600 text-white rounded-lg text-sm font-semibold
                                   hover:bg-green-700 disabled:opacity-50 transition
                                   flex items-center justify-center gap-2">
                        {creatingPatient ? (
                          <>
                            <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            Saving...
                          </>
                        ) : "✅ Save & Select Patient"}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* ── STEP 5: Appointment Details ── */}
            {selectedDoctor && (
              <div className="bg-green-50 border border-green-100 rounded-xl p-4"
                style={{ animation: "slideIn 0.3s ease" }}>
                <p className="text-xs font-bold text-green-600 uppercase tracking-wider mb-3">
                  Step 5 — Appointment Details
                </p>

                {/* Doctor info card */}
                <div className="flex items-center gap-3 mb-5 p-3 bg-white rounded-xl border border-green-200">
                  <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-600 flex items-center
                                  justify-center font-bold text-sm">
                    {(selectedDoctor.SERVICE_E || "DR")
                      .replace(/Dr\.?\s*/i, "").split(" ")
                      .map((n: string) => n[0]).slice(0, 2).join("").toUpperCase()}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800 text-sm">{selectedDoctor.SERVICE_E}</p>
                    <p className="text-xs text-gray-400">
                      {selectedDepartment?.CATEGORYE} · Zone {selectedDoctor.ZONE} · Clinic {selectedDoctor.CLINICID}
                    </p>
                  </div>
                  <div className="ml-auto text-right">
                    <p className="text-xs text-gray-400">Auto Ticket</p>
                    <p className="font-bold text-indigo-600">{form.TICKETNUMBER}</p>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block mb-1.5 font-medium text-sm text-gray-700">
                      Ticket Number <span className="text-red-500">*</span>
                    </label>
                    <input name="TICKETNUMBER" value={form.TICKETNUMBER} onChange={handleChange}
                      placeholder="e.g. AS1, ML21" className={inputCls(errors.TICKETNUMBER)} />
                    {errors.TICKETNUMBER && <p className="text-red-500 text-xs mt-1">{errors.TICKETNUMBER}</p>}
                  </div>

                  <div>
                    <label className="block mb-1.5 font-medium text-sm text-gray-700">
                      Appointment Date <span className="text-red-500">*</span>
                    </label>
                    {/* FIX 6: min=today prevents past dates; fallback to today if cleared */}
                    <input type="date" value={apptDate} min={todayLocal()}
                      onChange={(e) => setApptDate(e.target.value || todayLocal())}
                      className={inputCls()} />
                  </div>

                  <div>
                    <label className="block mb-1.5 font-medium text-sm text-gray-700">Patient Name</label>
                    {/* Read-only when patient selected from search */}
                    <input value={patientName}
                      onChange={(e) => setPatientName(e.target.value)}
                      placeholder="Auto-filled from patient search"
                      readOnly={!!selectedPatient}
                      className={inputCls()} />
                  </div>

                  <div>
                    <label className="block mb-1.5 font-medium text-sm text-gray-700">Phone Number</label>
                    <input value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="Auto-filled from patient search"
                      readOnly={!!selectedPatient}
                      className={inputCls()} />
                  </div>
                </div>
              </div>
            )}

            {/* ── Actions ── */}
            <div className="flex justify-end gap-3 pt-2">
              <button type="button" onClick={() => navigate("/dashboard/Appointments")}
                className="px-5 py-2.5 border border-gray-300 rounded-lg text-gray-600
                           hover:bg-gray-50 text-sm transition">
                Cancel
              </button>
              <button type="submit" disabled={saving || !selectedDoctor}
                className="bg-indigo-600 text-white px-7 py-2.5 rounded-lg hover:bg-indigo-700
                           disabled:opacity-50 flex items-center gap-2 text-sm font-semibold transition">
                {saving ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Creating...
                  </>
                ) : "✅ Create Appointment"}
              </button>
            </div>

          </form>
        )}
      </div>
    </div>
  );
};

export default NewAppointment;