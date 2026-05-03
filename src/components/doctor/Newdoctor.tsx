// import { useState, useEffect, useRef } from "react";
// import { useNavigate, useParams } from "react-router-dom";
// import { doctorAPI, clinicAPI } from "../../services/api";

// const BASE_URL = "http://localhost:5000";

// const departments = [
//   { id: 1,  name: "Internal Medicine" },
//   { id: 2,  name: "Pediatrician" },
//   { id: 3,  name: "Ophthalmologist" },
//   { id: 4,  name: "Gynecologist" },
//   { id: 5,  name: "Dermatologist" },
//   { id: 6,  name: "Orthodontist" },
//   { id: 7,  name: "Pathologist" },
//   { id: 8,  name: "General Practitioner" },
//   { id: 9,  name: "Dentist" },
//   { id: 10, name: "Homeopathy Practitioner" },
// ];

// const LANGUAGES = [
//   "English", "Arabic", "Hindi", "Urdu", "Malayalam",
//   "Tamil", "Telugu", "Tagalog", "French", "Other",
// ];

// const NATIONALITIES = [
//   "UAE", "India", "Pakistan", "Philippines", "Egypt",
//   "Jordan", "UK", "USA", "Bangladesh", "Sri Lanka", "Other",
// ];

// interface FormData {
//   SERVICE_E:    string;
//   SHORTNAME:    string;
//   CATEGORYID:   string;
//   ZONE:         string;
//   CLINICID:     string;
//   ROOMNAME:     string;
//   MEDSOFT_ID:   string;
//   MEDSOFT_NAME: string;
//   PASSWORD:     string;
//   LANGUAGE:     string;
//   NATIONALITY:  string;
//   AGE:          string;
//   DOB:          string;
//   CONTACT:      string;
//   WHATSAPP:     string;
//   ADDRESS:      string;
// }

// const blank: FormData = {
//   SERVICE_E: "", SHORTNAME: "", CATEGORYID: "", ZONE: "1",
//   CLINICID: "101", ROOMNAME: "", MEDSOFT_ID: "", MEDSOFT_NAME: "",
//   PASSWORD: "123", LANGUAGE: "", NATIONALITY: "", AGE: "", DOB: "",
//   CONTACT: "", WHATSAPP: "", ADDRESS: "",
// };

// const inputCls = (hasErr?: boolean) =>
//   `w-full px-3.5 py-2.5 rounded-lg border text-sm text-gray-800 placeholder-gray-400 bg-white
//    transition-all outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400
//    ${hasErr ? "border-red-400 bg-red-50" : "border-gray-200 hover:border-gray-300"}`;

// const labelCls = "block text-sm font-semibold text-gray-700 mb-1";

// export default function NewDoctorForm() {
//   const navigate = useNavigate();
//   const { id }   = useParams<{ id?: string }>();
//   const isEdit   = !!id;
//   const fileRef  = useRef<HTMLInputElement>(null);

//   const [form,          setForm]          = useState<FormData>(blank);
//   const [clinics,       setClinics]       = useState<any[]>([{ id: "101", name: "Main Clinic" }]);
//   const [errors,        setErrors]        = useState<Partial<Record<keyof FormData, string>>>({});
//   const [saving,        setSaving]        = useState(false);
//   const [loading,       setLoading]       = useState(isEdit);
//   const [apiError,      setApiError]      = useState("");
//   const [success,       setSuccess]       = useState(false);
//   const [picFile,       setPicFile]       = useState<File | null>(null);
//   const [picPreview,    setPicPreview]    = useState<string | null>(null);
//   const [existingPhoto, setExistingPhoto] = useState<string | null>(null);

//   // ── License duplicate check state ─────────────────────────────────────────
//   const [licenseWarning,   setLicenseWarning]   = useState("");
//   const [checkingLicense,  setCheckingLicense]  = useState(false);
//   const [licenseOwnerId,   setLicenseOwnerId]   = useState<number | null>(null); // existing doctor's ID
//   const licenseTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

//   // ── Load clinic + doctor data ─────────────────────────────────────────────
//   useEffect(() => {
//     const load = async () => {
//       try {
//         const cRes = await clinicAPI.getDetails();
//         const c    = cRes?.data?.data;
//         if (c && c.COMPANYNAME) {
//           setClinics([{ id: String(c.COMPANYID || "101"), name: c.COMPANYNAME }]);
//         }
//       } catch (err) {
//         console.warn("Clinic load failed, using default:", err);
//       }

//       if (isEdit) {
//         try {
//           const dRes = await doctorAPI.getById(id!);
//           const d    = dRes.data.data;
//           setForm({
//             SERVICE_E:    d.SERVICE_E    || "",
//             SHORTNAME:    d.SHORTNAME    || "",
//             CATEGORYID:   String(d.CATEGORYID || ""),
//             ZONE:         String(d.ZONE  || "1"),
//             CLINICID:     String(d.CLINICID || "101"),
//             ROOMNAME:     d.ROOMNAME     || "",
//             MEDSOFT_ID:   d.MEDSOFT_ID   || "",
//             MEDSOFT_NAME: d.MEDSOFT_NAME || "",
//             PASSWORD:     d.PASSWORD     || "123",
//             LANGUAGE:     d.LANGUAGE     || "",
//             NATIONALITY:  d.NATIONALITY  || "",
//             AGE:          d.AGE          ? String(d.AGE) : "",
//             DOB:          d.DOB          ? d.DOB.slice(0, 10) : "",
//             CONTACT:      d.CONTACT      || "",
//             WHATSAPP:     d.WHATSAPP     || "",
//             ADDRESS:      d.ADDRESS      || "",
//           });
//           if (d.PHOTO) setExistingPhoto(`${BASE_URL}${d.PHOTO}`);
//         } catch (err) {
//           console.error("Doctor load failed:", err);
//           setApiError("Failed to load doctor data.");
//         }
//       }
//       setLoading(false);
//     };
//     load();
//   }, [id, isEdit]);

//   // ── License number duplicate check ───────────────────────────────────────
//   const checkLicense = async (licenseNo: string) => {
//     if (!licenseNo.trim() || licenseNo.trim().length < 4) {
//       setLicenseWarning("");
//       setLicenseOwnerId(null);
//       return;
//     }
//     try {
//       setCheckingLicense(true);
//       const res = await doctorAPI.checkLicense(licenseNo.trim());
//       if (res.data.exists) {
//         const ownerId = res.data.doctor?.SERVICEID;
//         setLicenseOwnerId(ownerId || null);
//         // Edit mode లో same doctor అయితే warning చూపించకు
//         if (isEdit && String(ownerId) === String(id)) {
//           setLicenseWarning("");
//         } else {
//           setLicenseWarning(res.data.message || "License already registered.");
//         }
//       } else {
//         setLicenseWarning("");
//         setLicenseOwnerId(null);
//       }
//     } catch {
//       setLicenseWarning("");
//     } finally {
//       setCheckingLicense(false);
//     }
//   };

//   // ── Field change handler ──────────────────────────────────────────────────
//   const handleChange = (
//     e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
//   ) => {
//     const { name, value } = e.target;
//     setForm((prev) => {
//       const updated = { ...prev, [name]: value };
//       if (name === "CONTACT" && prev.WHATSAPP === "") {
//         updated.WHATSAPP = value;
//       }
//       return updated;
//     });
//     setErrors((prev) => ({ ...prev, [name]: "" }));
//     setApiError("");

//     // License check — debounced
//     if (name === "MEDSOFT_ID") {
//       if (licenseTimerRef.current) clearTimeout(licenseTimerRef.current);
//       licenseTimerRef.current = setTimeout(() => checkLicense(value), 700);
//     }
//   };

//   // ── File / photo handler ──────────────────────────────────────────────────
//   const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0] || null;
//     if (file && file.size > 5 * 1024 * 1024) {
//       setApiError("Photo must be under 5MB.");
//       if (fileRef.current) fileRef.current.value = "";
//       return;
//     }
//     setPicFile(file);
//     if (file) {
//       const reader = new FileReader();
//       reader.onloadend = () => setPicPreview(reader.result as string);
//       reader.readAsDataURL(file);
//       setExistingPhoto(null);
//     } else {
//       setPicPreview(null);
//     }
//   };

//   // ── Validation ────────────────────────────────────────────────────────────
//   const validate = (): boolean => {
//     const errs: Partial<Record<keyof FormData, string>> = {};

//     if (!form.SERVICE_E.trim())
//       errs.SERVICE_E = "Doctor name is required";

//     if (!form.CATEGORYID)
//       errs.CATEGORYID = "Department is required";

//     if (!form.CLINICID)
//       errs.CLINICID = "Clinic is required";

//     if (!form.MEDSOFT_ID.trim())
//       errs.MEDSOFT_ID = "License number is required";

//     if (form.CONTACT && !/^\+?[\d\s\-]{7,15}$/.test(form.CONTACT))
//       errs.CONTACT = "Enter a valid contact number";

//     if (form.WHATSAPP && !/^\+?[\d\s\-]{7,15}$/.test(form.WHATSAPP))
//       errs.WHATSAPP = "Enter a valid WhatsApp number";

//     if (form.AGE && (isNaN(Number(form.AGE)) || Number(form.AGE) < 18 || Number(form.AGE) > 100))
//       errs.AGE = "Enter a valid age (18–100)";

//     setErrors(errs);

//     // Block submit if license is duplicate
//     if (licenseWarning) {
//       setApiError("⚠️ Duplicate license number detected. Please check the license field.");
//       return false;
//     }

//     return Object.keys(errs).length === 0;
//   };

//   // ── Submit ────────────────────────────────────────────────────────────────
//   const handleSubmit = async () => {
//     if (!validate()) return;
//     try {
//       setSaving(true);
//       setApiError("");

//       const fd = new FormData();
//       fd.append("SERVICE_E",    form.SERVICE_E.trim());
//       fd.append("SHORTNAME",    (form.SHORTNAME || form.SERVICE_E).substring(0, 5));
//       fd.append("CATEGORYID",   form.CATEGORYID);
//       fd.append("ZONE",         form.ZONE || "1");
//       fd.append("CLINICID",     form.CLINICID || "101");
//       fd.append("ROOMNAME",     form.ROOMNAME || "");
//       fd.append("MEDSOFT_ID",   form.MEDSOFT_ID.trim());
//       fd.append("MEDSOFT_NAME", form.MEDSOFT_NAME || "");
//       fd.append("PASSWORD",     form.PASSWORD || "123");
//       fd.append("LANGUAGE",     form.LANGUAGE || "");
//       fd.append("NATIONALITY",  form.NATIONALITY || "");
//       fd.append("AGE",          form.AGE || "");
//       fd.append("DOB",          form.DOB || "");
//       fd.append("CONTACT",      form.CONTACT || "");
//       fd.append("WHATSAPP",     form.WHATSAPP || "");
//       fd.append("ADDRESS",      form.ADDRESS || "");
//       if (picFile) fd.append("PHOTO", picFile);

//       if (isEdit) {
//         await doctorAPI.updateFormData(Number(id), fd);
//       } else {
//         await doctorAPI.createFormData(fd);
//       }

//       setSuccess(true);
//       setTimeout(() => navigate("/dashboard/DoctorList"), 1500);
//     } catch (err: any) {
//       const msg = err?.response?.data?.message || err?.message || "Save failed. Please try again.";
//       setApiError(msg);
//     } finally {
//       setSaving(false);
//     }
//   };

//   // ── Reset ─────────────────────────────────────────────────────────────────
//   const handleReset = () => {
//     setForm(blank);
//     setPicFile(null);
//     setPicPreview(null);
//     setExistingPhoto(null);
//     setErrors({});
//     setApiError("");
//     setLicenseWarning("");
//     setLicenseOwnerId(null);
//     if (fileRef.current) fileRef.current.value = "";
//   };

//   const displayImage = picPreview || existingPhoto;

//   // ── Success screen ────────────────────────────────────────────────────────
//   if (success) {
//     return (
//       <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//         <div className="bg-white rounded-2xl shadow-lg p-10 text-center max-w-sm w-full"
//           style={{ animation: "pop .4s ease" }}>
//           <style>{`@keyframes pop{from{opacity:0;transform:scale(.85)}to{opacity:1;transform:scale(1)}}`}</style>
//           <div style={{ fontSize: 52, marginBottom: 12 }}>✅</div>
//           <h2 className="text-lg font-bold text-green-700">
//             Doctor {isEdit ? "Updated" : "Saved"}!
//           </h2>
//           <p className="text-gray-500 text-sm mt-1">{form.SERVICE_E}</p>
//           <p className="text-gray-400 text-xs mt-3">Redirecting to doctor list...</p>
//         </div>
//       </div>
//     );
//   }

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gray-50 flex items-center justify-center text-gray-400 text-sm">
//         ⏳ Loading doctor data...
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-50 flex items-start justify-center py-10 px-4">
//       <div className="w-full max-w-4xl bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">

//         {/* Header */}
//         <div className="bg-white border-b border-gray-100 px-8 py-5 flex items-center justify-between">
//           <div className="flex items-center gap-3">
//             <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center">
//               <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
//                   d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
//               </svg>
//             </div>
//             <div>
//               <h1 className="text-lg font-bold text-gray-900">
//                 {isEdit ? "✏️ Edit Doctor" : "👨‍⚕️ New Doctor"}
//               </h1>
//               <p className="text-xs text-gray-400">
//                 {isEdit ? "Update doctor information" : "Register a new doctor"}
//               </p>
//             </div>
//           </div>
//           <button onClick={() => navigate("/dashboard/DoctorList")}
//             className="text-sm text-gray-500 border px-3 py-1.5 rounded-lg hover:bg-gray-50 transition">
//             ← Back
//           </button>
//         </div>

//         <div className="px-8 py-7 space-y-6">

//           {/* API error */}
//           {apiError && (
//             <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
//               ❌ {apiError}
//             </div>
//           )}

//           {/* Photo Upload */}
//           <div className="flex items-center gap-6">
//             <div onClick={() => fileRef.current?.click()}
//               className="relative w-24 h-24 rounded-2xl border-2 border-dashed border-gray-200
//                          bg-gray-50 flex items-center justify-center overflow-hidden
//                          cursor-pointer hover:border-indigo-400 transition-colors group">
//               {displayImage ? (
//                 <>
//                   <img src={displayImage} alt="Doctor" className="w-full h-full object-cover" />
//                   <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center
//                                   justify-center opacity-0 group-hover:opacity-100 transition-opacity">
//                     <span className="text-white text-xs font-semibold">Change</span>
//                   </div>
//                 </>
//               ) : (
//                 <div className="flex flex-col items-center gap-1 text-gray-300">
//                   <svg className="w-9 h-9" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
//                       d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
//                   </svg>
//                   <span className="text-xs">Photo</span>
//                 </div>
//               )}
//             </div>
//             <div>
//               <p className="text-sm font-semibold text-gray-700 mb-2">Doctor Photo</p>
//               <button type="button" onClick={() => fileRef.current?.click()}
//                 className="text-xs px-4 py-2 rounded-lg border border-gray-200 text-gray-600
//                            hover:border-indigo-400 hover:text-indigo-600 transition font-medium">
//                 📷 {displayImage ? "Change Photo" : "Upload Photo"}
//               </button>
//               <p className="text-xs text-gray-400 mt-1.5">JPG, PNG, WEBP · Max 5MB</p>
//               {picFile && <p className="text-xs text-green-600 mt-1">✅ {picFile.name}</p>}
//               <input ref={fileRef} type="file" accept="image/jpeg,image/png,image/webp"
//                 className="hidden" onChange={handleFile} />
//             </div>
//           </div>

//           {/* Clinic Info */}
//           <div>
//             <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Clinic Info</h3>
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
//               <div>
//                 <label className={labelCls}>Clinic <span className="text-red-500">*</span></label>
//                 <select name="CLINICID" value={form.CLINICID} onChange={handleChange}
//                   className={inputCls(!!errors.CLINICID)}>
//                   {clinics.map((c) => (
//                     <option key={c.id} value={c.id}>{c.name}</option>
//                   ))}
//                 </select>
//                 {errors.CLINICID && <p className="text-xs text-red-500 mt-1">{errors.CLINICID}</p>}
//               </div>
//               <div>
//                 <label className={labelCls}>Room Number</label>
//                 <input type="text" name="ROOMNAME" value={form.ROOMNAME} onChange={handleChange}
//                   placeholder="e.g. Room 3A" className={inputCls()} />
//               </div>
//             </div>
//           </div>

//           {/* Doctor Info */}
//           <div>
//             <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Doctor Info</h3>
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
//               <div>
//                 <label className={labelCls}>Doctor Name <span className="text-red-500">*</span></label>
//                 <input type="text" name="SERVICE_E" value={form.SERVICE_E} onChange={handleChange}
//                   placeholder="e.g. Dr. Ahmed Al Mansoori" className={inputCls(!!errors.SERVICE_E)} />
//                 {errors.SERVICE_E && <p className="text-xs text-red-500 mt-1">{errors.SERVICE_E}</p>}
//               </div>
//               <div>
//                 <label className={labelCls}>Short Name / Prefix</label>
//                 <input type="text" name="SHORTNAME" value={form.SHORTNAME} onChange={handleChange}
//                   placeholder="e.g. AM → ticket AM1, AM2..." maxLength={5} className={inputCls()} />
//                 <p className="text-xs text-gray-400 mt-1">Used as ticket number prefix (max 5 chars)</p>
//               </div>
//               <div>
//                 <label className={labelCls}>Department <span className="text-red-500">*</span></label>
//                 <select name="CATEGORYID" value={form.CATEGORYID} onChange={handleChange}
//                   className={inputCls(!!errors.CATEGORYID)}>
//                   <option value="">Select department</option>
//                   {departments.map((d) => (
//                     <option key={d.id} value={d.id}>{d.name}</option>
//                   ))}
//                 </select>
//                 {errors.CATEGORYID && <p className="text-xs text-red-500 mt-1">{errors.CATEGORYID}</p>}
//               </div>
//               <div>
//                 <label className={labelCls}>Zone</label>
//                 <select name="ZONE" value={form.ZONE} onChange={handleChange} className={inputCls()}>
//                   <option value="1">Zone 1</option>
//                   <option value="2">Zone 2</option>
//                   <option value="3">Zone 3</option>
//                 </select>
//               </div>

//               {/* ── License Number — with duplicate check ── */}
//               <div>
//                 <label className={labelCls}>
//                   License Number <span className="text-red-500">*</span>
//                   {checkingLicense && (
//                     <span className="ml-2 text-xs text-gray-400 font-normal">checking...</span>
//                   )}
//                 </label>
//                 <input
//                   type="text"
//                   name="MEDSOFT_ID"
//                   value={form.MEDSOFT_ID}
//                   onChange={handleChange}
//                   placeholder="e.g. DHA-P-12345"
//                   className={inputCls(!!(errors.MEDSOFT_ID || licenseWarning))}
//                 />
//                 {errors.MEDSOFT_ID && (
//                   <p className="text-xs text-red-500 mt-1">{errors.MEDSOFT_ID}</p>
//                 )}
//                 {/* ✅ Duplicate license warning */}
//                 {licenseWarning && (
//                   <div className="mt-2 p-3 bg-orange-50 border border-orange-300 rounded-xl text-xs">
//                     <div className="flex items-start gap-2">
//                       <span className="text-orange-500 text-base">⚠️</span>
//                       <div>
//                         <p className="font-semibold text-orange-700">{licenseWarning}</p>
//                         <p className="text-orange-600 mt-1">
//                           Each doctor has a unique license. This license is already registered.
//                           To assign this doctor to a different clinic, please edit the existing record.
//                         </p>
//                         {licenseOwnerId && (
//                           <button
//                             type="button"
//                             onClick={() => navigate(`/dashboard/EditDoctor/${licenseOwnerId}`)}
//                             className="mt-2 text-indigo-600 hover:underline font-semibold"
//                           >
//                             → Go to existing doctor record
//                           </button>
//                         )}
//                       </div>
//                     </div>
//                   </div>
//                 )}
//               </div>

//               <div>
//                 <label className={labelCls}>Qualification</label>
//                 <input type="text" name="MEDSOFT_NAME" value={form.MEDSOFT_NAME} onChange={handleChange}
//                   placeholder="e.g. MBBS, MD, FRCS" className={inputCls()} />
//               </div>
//             </div>
//           </div>

//           {/* Personal Details */}
//           <div>
//             <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Personal Details</h3>
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
//               <div>
//                 <label className={labelCls}>Language</label>
//                 <select name="LANGUAGE" value={form.LANGUAGE} onChange={handleChange} className={inputCls()}>
//                   <option value="">Select language</option>
//                   {LANGUAGES.map((l) => <option key={l} value={l}>{l}</option>)}
//                 </select>
//               </div>
//               <div>
//                 <label className={labelCls}>Nationality</label>
//                 <select name="NATIONALITY" value={form.NATIONALITY} onChange={handleChange} className={inputCls()}>
//                   <option value="">Select nationality</option>
//                   {NATIONALITIES.map((n) => <option key={n} value={n}>{n}</option>)}
//                 </select>
//               </div>
//               <div>
//                 <label className={labelCls}>Age</label>
//                 <input type="number" name="AGE" value={form.AGE} onChange={handleChange}
//                   placeholder="e.g. 35" min={18} max={100} className={inputCls(!!errors.AGE)} />
//                 {errors.AGE && <p className="text-xs text-red-500 mt-1">{errors.AGE}</p>}
//               </div>
//               <div>
//                 <label className={labelCls}>Date of Birth</label>
//                 <input type="date" name="DOB" value={form.DOB} onChange={handleChange} className={inputCls()} />
//               </div>
//             </div>
//           </div>

//           {/* Contact Details */}
//           <div>
//             <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Contact Details</h3>
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
//               <div>
//                 <label className={labelCls}>Contact Number</label>
//                 <input type="tel" name="CONTACT" value={form.CONTACT} onChange={handleChange}
//                   placeholder="e.g. +971501234567" className={inputCls(!!errors.CONTACT)} />
//                 {errors.CONTACT && <p className="text-xs text-red-500 mt-1">{errors.CONTACT}</p>}
//               </div>
//               <div>
//                 <label className={labelCls}>WhatsApp Number</label>
//                 <div className="relative">
//                   <span className="absolute left-3 top-1/2 -translate-y-1/2 text-green-500 text-sm">📱</span>
//                   <input type="tel" name="WHATSAPP" value={form.WHATSAPP} onChange={handleChange}
//                     placeholder="e.g. +971501234567"
//                     className={`${inputCls(!!errors.WHATSAPP)} pl-9`} />
//                 </div>
//                 {errors.WHATSAPP && <p className="text-xs text-red-500 mt-1">{errors.WHATSAPP}</p>}
//                 {form.CONTACT && form.WHATSAPP === "" && (
//                   <button type="button" onClick={() => setForm((p) => ({ ...p, WHATSAPP: p.CONTACT }))}
//                     className="text-xs text-indigo-500 mt-1 hover:underline">
//                     Same as contact number
//                   </button>
//                 )}
//               </div>
//               <div className="md:col-span-2">
//                 <label className={labelCls}>Address</label>
//                 <textarea name="ADDRESS" value={form.ADDRESS} onChange={handleChange}
//                   placeholder="Enter full address" rows={3}
//                   className={`${inputCls()} resize-none`} />
//               </div>
//             </div>
//           </div>

//           {/* Actions */}
//           <div className="flex items-center justify-end gap-3 pt-2 border-t border-gray-100">
//             <button type="button" onClick={handleReset}
//               className="px-5 py-2.5 rounded-lg border border-gray-200 text-sm font-semibold
//                          text-gray-600 hover:bg-gray-50 transition-colors">
//               Reset
//             </button>
//             <button type="button" onClick={handleSubmit} disabled={saving || !!licenseWarning}
//               className="px-6 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-700
//                          disabled:opacity-50 text-white text-sm font-semibold
//                          transition-colors shadow-sm flex items-center gap-2">
//               {saving ? (
//                 <>
//                   <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
//                   {isEdit ? "Updating..." : "Saving..."}
//                 </>
//               ) : (
//                 isEdit ? "💾 Update Doctor" : "✅ Save Doctor"
//               )}
//             </button>
//           </div>

//         </div>
//       </div>
//     </div>
//   );
// }
import { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { doctorAPI, clinicAPI } from "../../services/api";

const BASE_URL = "http://localhost:5000";

const departments = [
  { id: 1,  name: "Internal Medicine" },
  { id: 2,  name: "Pediatrician" },
  { id: 3,  name: "Ophthalmologist" },
  { id: 4,  name: "Gynecologist" },
  { id: 5,  name: "Dermatologist" },
  { id: 6,  name: "Orthodontist" },
  { id: 7,  name: "Pathologist" },
  { id: 8,  name: "General Practitioner" },
  { id: 9,  name: "Dentist" },
  { id: 10, name: "Homeopathy Practitioner" },
];

const LANGUAGES = [
  "English", "Arabic", "Hindi", "Urdu", "Malayalam",
  "Tamil", "Telugu", "Tagalog", "French", "Other",
];

const NATIONALITIES = [
  "UAE", "India", "Pakistan", "Philippines", "Egypt",
  "Jordan", "UK", "USA", "Bangladesh", "Sri Lanka", "Other",
];

interface FormData {
  SERVICE_E:    string;
  SHORTNAME:    string;
  CATEGORYID:   string;
  ZONE:         string;
  CLINICID:     string;
  ROOMNAME:     string;
  MEDSOFT_ID:   string;
  MEDSOFT_NAME: string;
  PASSWORD:     string;
  LANGUAGE:     string;
  NATIONALITY:  string;
  AGE:          string;
  DOB:          string;
  CONTACT:      string;
  WHATSAPP:     string;
  ADDRESS:      string;
}

const blank: FormData = {
  SERVICE_E: "", SHORTNAME: "", CATEGORYID: "", ZONE: "1",
  CLINICID: "101", ROOMNAME: "", MEDSOFT_ID: "", MEDSOFT_NAME: "",
  PASSWORD: "123", LANGUAGE: "", NATIONALITY: "", AGE: "", DOB: "",
  CONTACT: "", WHATSAPP: "", ADDRESS: "",
};

const inputCls = (hasErr?: boolean) =>
  `w-full px-3.5 py-2.5 rounded-lg border text-sm text-gray-800 placeholder-gray-400 bg-white
   transition-all outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400
   ${hasErr ? "border-red-400 bg-red-50" : "border-gray-200 hover:border-gray-300"}`;

const labelCls = "block text-sm font-semibold text-gray-700 mb-1";

export default function NewDoctorForm() {
  const navigate = useNavigate();
  const { id }   = useParams<{ id?: string }>();
  const isEdit   = !!id;
  const fileRef  = useRef<HTMLInputElement>(null);

  const [form,          setForm]          = useState<FormData>(blank);
  const [clinics,       setClinics]       = useState<any[]>([{ id: "101", name: "Main Clinic" }]);
  const [errors,        setErrors]        = useState<Partial<Record<keyof FormData, string>>>({});
  const [saving,        setSaving]        = useState(false);
  const [loading,       setLoading]       = useState(isEdit);
  const [apiError,      setApiError]      = useState("");
  const [success,       setSuccess]       = useState(false);
  const [picFile,       setPicFile]       = useState<File | null>(null);
  const [picPreview,    setPicPreview]    = useState<string | null>(null);
  const [existingPhoto, setExistingPhoto] = useState<string | null>(null);

  // ── License duplicate check state ─────────────────────────────────────────
  const [licenseWarning,  setLicenseWarning]  = useState("");
  const [checkingLicense, setCheckingLicense] = useState(false);
  const [licenseOwnerId,  setLicenseOwnerId]  = useState<number | null>(null);
  const licenseTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ── Load clinic + doctor data ─────────────────────────────────────────────
  useEffect(() => {
    const load = async () => {
      try {
        const cRes = await clinicAPI.getDetails();
        const c    = cRes?.data?.data;
        if (c && c.COMPANYNAME) {
          setClinics([{ id: String(c.COMPANYID || "101"), name: c.COMPANYNAME }]);
        }
      } catch (err) {
        console.warn("Clinic load failed, using default:", err);
      }

      if (isEdit) {
        try {
          const dRes = await doctorAPI.getById(id!);
          const d    = dRes.data.data;
          setForm({
            SERVICE_E:    d.SERVICE_E    || "",
            SHORTNAME:    d.SHORTNAME    || "",
            CATEGORYID:   String(d.CATEGORYID || ""),
            ZONE:         String(d.ZONE  || "1"),
            CLINICID:     String(d.CLINICID || "101"),
            ROOMNAME:     d.ROOMNAME     || "",
            MEDSOFT_ID:   d.MEDSOFT_ID   || "",
            MEDSOFT_NAME: d.MEDSOFT_NAME || "",
            PASSWORD:     d.PASSWORD     || "123",
            LANGUAGE:     d.LANGUAGE     || "",
            NATIONALITY:  d.NATIONALITY  || "",
            AGE:          d.AGE          ? String(d.AGE) : "",
            DOB:          d.DOB          ? d.DOB.slice(0, 10) : "",
            CONTACT:      d.CONTACT      || "",
            WHATSAPP:     d.WHATSAPP     || "",
            ADDRESS:      d.ADDRESS      || "",
          });
          if (d.PHOTO) setExistingPhoto(`${BASE_URL}${d.PHOTO}`);
        } catch (err) {
          console.error("Doctor load failed:", err);
          setApiError("Failed to load doctor data.");
        }
      }
      setLoading(false);
    };
    load();
  }, [id, isEdit]);

  // ── License real-time check ───────────────────────────────────────────────
  const checkLicense = async (licenseNo: string) => {
    if (!licenseNo.trim() || licenseNo.trim().length < 4) {
      setLicenseWarning("");
      setLicenseOwnerId(null);
      return;
    }
    try {
      setCheckingLicense(true);
      const res = await doctorAPI.checkLicense(licenseNo.trim());
      if (res.data.exists) {
        const ownerId = res.data.doctor?.SERVICEID;
        setLicenseOwnerId(ownerId || null);
        // Edit mode లో same doctor అయితే warning వద్దు
        if (isEdit && String(ownerId) === String(id)) {
          setLicenseWarning("");
        } else {
          setLicenseWarning(res.data.message || "License already registered.");
        }
      } else {
        setLicenseWarning("");
        setLicenseOwnerId(null);
      }
    } catch {
      setLicenseWarning("");
    } finally {
      setCheckingLicense(false);
    }
  };

  // ── Field change handler ──────────────────────────────────────────────────
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => {
      const updated = { ...prev, [name]: value };
      if (name === "CONTACT" && prev.WHATSAPP === "") {
        updated.WHATSAPP = value;
      }
      return updated;
    });
    setErrors((prev) => ({ ...prev, [name]: "" }));
    setApiError("");

    if (name === "MEDSOFT_ID") {
      if (licenseTimerRef.current) clearTimeout(licenseTimerRef.current);
      licenseTimerRef.current = setTimeout(() => checkLicense(value), 700);
    }
  };

  // ── File / photo handler ──────────────────────────────────────────────────
  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (file && file.size > 5 * 1024 * 1024) {
      setApiError("Photo must be under 5MB.");
      if (fileRef.current) fileRef.current.value = "";
      return;
    }
    setPicFile(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPicPreview(reader.result as string);
      reader.readAsDataURL(file);
      setExistingPhoto(null);
    } else {
      setPicPreview(null);
    }
  };

  // ── Validation ────────────────────────────────────────────────────────────
  const validate = (): boolean => {
    const errs: Partial<Record<keyof FormData, string>> = {};
    if (!form.SERVICE_E.trim())   errs.SERVICE_E  = "Doctor name is required";
    if (!form.CATEGORYID)         errs.CATEGORYID = "Department is required";
    if (!form.CLINICID)           errs.CLINICID   = "Clinic is required";
    if (!form.MEDSOFT_ID.trim())  errs.MEDSOFT_ID = "License number is required";
    if (form.CONTACT  && !/^\+?[\d\s\-]{7,15}$/.test(form.CONTACT))
      errs.CONTACT  = "Enter a valid contact number";
    if (form.WHATSAPP && !/^\+?[\d\s\-]{7,15}$/.test(form.WHATSAPP))
      errs.WHATSAPP = "Enter a valid WhatsApp number";
    if (form.AGE && (isNaN(Number(form.AGE)) || Number(form.AGE) < 18 || Number(form.AGE) > 100))
      errs.AGE = "Enter a valid age (18–100)";

    setErrors(errs);

    if (licenseWarning) {
      setApiError("⚠️ Duplicate license number. Please check the license field.");
      return false;
    }
    return Object.keys(errs).length === 0;
  };

  // ── Submit ────────────────────────────────────────────────────────────────
  const handleSubmit = async () => {
    if (!validate()) return;
    try {
      setSaving(true);
      setApiError("");

      const fd = new FormData();
      fd.append("SERVICE_E",    form.SERVICE_E.trim());
      fd.append("SHORTNAME",    (form.SHORTNAME || form.SERVICE_E).substring(0, 5));
      fd.append("CATEGORYID",   form.CATEGORYID);
      fd.append("ZONE",         form.ZONE || "1");
      fd.append("CLINICID",     form.CLINICID || "101");
      fd.append("ROOMNAME",     form.ROOMNAME || "");
      fd.append("MEDSOFT_ID",   form.MEDSOFT_ID.trim());
      fd.append("MEDSOFT_NAME", form.MEDSOFT_NAME || "");
      fd.append("PASSWORD",     form.PASSWORD || "123");
      fd.append("LANGUAGE",     form.LANGUAGE || "");
      fd.append("NATIONALITY",  form.NATIONALITY || "");
      fd.append("AGE",          form.AGE || "");
      fd.append("DOB",          form.DOB || "");
      fd.append("CONTACT",      form.CONTACT || "");
      fd.append("WHATSAPP",     form.WHATSAPP || "");
      fd.append("ADDRESS",      form.ADDRESS || "");
      if (picFile) fd.append("PHOTO", picFile);

      if (isEdit) {
        await doctorAPI.updateFormData(Number(id), fd);
      } else {
        await doctorAPI.createFormData(fd);
      }

      setSuccess(true);
      setTimeout(() => navigate("/dashboard/DoctorList"), 1500);

    } catch (err: any) {
      const data = err?.response?.data;

      // ✅ Backend isDuplicate: true — license field దగ్గర warning చూపించు
      if (data?.isDuplicate) {
        setLicenseWarning(data.message || "License already registered.");
        setLicenseOwnerId(data.existingDoctorId || null);
        setApiError(""); // top error కాదు
      } else {
        setApiError(data?.message || err?.message || "Save failed. Please try again.");
      }
    } finally {
      setSaving(false);
    }
  };

  // ── Reset ─────────────────────────────────────────────────────────────────
  const handleReset = () => {
    setForm(blank);
    setPicFile(null);
    setPicPreview(null);
    setExistingPhoto(null);
    setErrors({});
    setApiError("");
    setLicenseWarning("");
    setLicenseOwnerId(null);
    if (fileRef.current) fileRef.current.value = "";
  };

  const displayImage = picPreview || existingPhoto;

  // ── Success ───────────────────────────────────────────────────────────────
  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-lg p-10 text-center max-w-sm w-full"
          style={{ animation: "pop .4s ease" }}>
          <style>{`@keyframes pop{from{opacity:0;transform:scale(.85)}to{opacity:1;transform:scale(1)}}`}</style>
          <div style={{ fontSize: 52, marginBottom: 12 }}>✅</div>
          <h2 className="text-lg font-bold text-green-700">
            Doctor {isEdit ? "Updated" : "Saved"}!
          </h2>
          <p className="text-gray-500 text-sm mt-1">{form.SERVICE_E}</p>
          <p className="text-gray-400 text-xs mt-3">Redirecting to doctor list...</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center text-gray-400 text-sm">
        ⏳ Loading doctor data...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-start justify-center py-10 px-4">
      <div className="w-full max-w-4xl bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">

        {/* Header */}
        <div className="bg-white border-b border-gray-100 px-8 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-900">
                {isEdit ? "✏️ Edit Doctor" : "👨‍⚕️ New Doctor"}
              </h1>
              <p className="text-xs text-gray-400">
                {isEdit ? "Update doctor information" : "Register a new doctor"}
              </p>
            </div>
          </div>
          <button onClick={() => navigate("/dashboard/DoctorList")}
            className="text-sm text-gray-500 border px-3 py-1.5 rounded-lg hover:bg-gray-50 transition">
            ← Back
          </button>
        </div>

        <div className="px-8 py-7 space-y-6">

          {/* Top error banner */}
          {apiError && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
              ❌ {apiError}
            </div>
          )}

          {/* Photo Upload */}
          <div className="flex items-center gap-6">
            <div onClick={() => fileRef.current?.click()}
              className="relative w-24 h-24 rounded-2xl border-2 border-dashed border-gray-200
                         bg-gray-50 flex items-center justify-center overflow-hidden
                         cursor-pointer hover:border-indigo-400 transition-colors group">
              {displayImage ? (
                <>
                  <img src={displayImage} alt="Doctor" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center
                                  justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="text-white text-xs font-semibold">Change</span>
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center gap-1 text-gray-300">
                  <svg className="w-9 h-9" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <span className="text-xs">Photo</span>
                </div>
              )}
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-700 mb-2">Doctor Photo</p>
              <button type="button" onClick={() => fileRef.current?.click()}
                className="text-xs px-4 py-2 rounded-lg border border-gray-200 text-gray-600
                           hover:border-indigo-400 hover:text-indigo-600 transition font-medium">
                📷 {displayImage ? "Change Photo" : "Upload Photo"}
              </button>
              <p className="text-xs text-gray-400 mt-1.5">JPG, PNG, WEBP · Max 5MB</p>
              {picFile && <p className="text-xs text-green-600 mt-1">✅ {picFile.name}</p>}
              <input ref={fileRef} type="file" accept="image/jpeg,image/png,image/webp"
                className="hidden" onChange={handleFile} />
            </div>
          </div>

          {/* Clinic Info */}
          <div>
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Clinic Info</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className={labelCls}>Clinic <span className="text-red-500">*</span></label>
                <select name="CLINICID" value={form.CLINICID} onChange={handleChange}
                  className={inputCls(!!errors.CLINICID)}>
                  {clinics.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
                {errors.CLINICID && <p className="text-xs text-red-500 mt-1">{errors.CLINICID}</p>}
              </div>
              <div>
                <label className={labelCls}>Room Number</label>
                <input type="text" name="ROOMNAME" value={form.ROOMNAME} onChange={handleChange}
                  placeholder="e.g. Room 3A" className={inputCls()} />
              </div>
            </div>
          </div>

          {/* Doctor Info */}
          <div>
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Doctor Info</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className={labelCls}>Doctor Name <span className="text-red-500">*</span></label>
                <input type="text" name="SERVICE_E" value={form.SERVICE_E} onChange={handleChange}
                  placeholder="e.g. Dr. Ahmed Al Mansoori" className={inputCls(!!errors.SERVICE_E)} />
                {errors.SERVICE_E && <p className="text-xs text-red-500 mt-1">{errors.SERVICE_E}</p>}
              </div>
              <div>
                <label className={labelCls}>Short Name / Prefix</label>
                <input type="text" name="SHORTNAME" value={form.SHORTNAME} onChange={handleChange}
                  placeholder="e.g. AM → ticket AM1, AM2..." maxLength={5} className={inputCls()} />
                <p className="text-xs text-gray-400 mt-1">Used as ticket number prefix (max 5 chars)</p>
              </div>
              <div>
                <label className={labelCls}>Department <span className="text-red-500">*</span></label>
                <select name="CATEGORYID" value={form.CATEGORYID} onChange={handleChange}
                  className={inputCls(!!errors.CATEGORYID)}>
                  <option value="">Select department</option>
                  {departments.map((d) => (
                    <option key={d.id} value={d.id}>{d.name}</option>
                  ))}
                </select>
                {errors.CATEGORYID && <p className="text-xs text-red-500 mt-1">{errors.CATEGORYID}</p>}
              </div>
              <div>
                <label className={labelCls}>Zone</label>
                <select name="ZONE" value={form.ZONE} onChange={handleChange} className={inputCls()}>
                  <option value="1">Zone 1</option>
                  <option value="2">Zone 2</option>
                  <option value="3">Zone 3</option>
                </select>
              </div>

              {/* ── License Number ── */}
              <div>
                <label className={labelCls}>
                  License Number <span className="text-red-500">*</span>
                  {checkingLicense && (
                    <span className="ml-2 text-xs text-gray-400 font-normal animate-pulse">checking...</span>
                  )}
                  {!checkingLicense && form.MEDSOFT_ID.trim().length >= 4 && !licenseWarning && (
                    <span className="ml-2 text-xs text-green-500 font-normal">✓ Available</span>
                  )}
                </label>
                <input
                  type="text"
                  name="MEDSOFT_ID"
                  value={form.MEDSOFT_ID}
                  onChange={handleChange}
                  placeholder="e.g. DHA-P-12345"
                  className={inputCls(!!(errors.MEDSOFT_ID || licenseWarning))}
                />
                {errors.MEDSOFT_ID && (
                  <p className="text-xs text-red-500 mt-1">{errors.MEDSOFT_ID}</p>
                )}
                {/* ✅ Duplicate warning — real-time + submit error */}
                {licenseWarning && (
                  <div className="mt-2 p-3 bg-orange-50 border border-orange-300 rounded-xl text-xs">
                    <div className="flex items-start gap-2">
                      <span className="text-orange-500 text-base flex-shrink-0">⚠️</span>
                      <div>
                        <p className="font-semibold text-orange-700">{licenseWarning}</p>
                        <p className="text-orange-600 mt-1">
                          Each doctor has a unique license number. This license is already registered.
                          To update the clinic, please edit the existing doctor record.
                        </p>
                        {licenseOwnerId && (
                          <button
                            type="button"
                            onClick={() => navigate(`/dashboard/Newdoctor/${licenseOwnerId}`)}
                            className="mt-2 text-indigo-600 hover:underline font-semibold text-xs"
                          >
                            → Go to existing doctor record
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div>
                <label className={labelCls}>Qualification</label>
                <input type="text" name="MEDSOFT_NAME" value={form.MEDSOFT_NAME} onChange={handleChange}
                  placeholder="e.g. MBBS, MD, FRCS" className={inputCls()} />
              </div>
            </div>
          </div>

          {/* Personal Details */}
          <div>
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Personal Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className={labelCls}>Language</label>
                <select name="LANGUAGE" value={form.LANGUAGE} onChange={handleChange} className={inputCls()}>
                  <option value="">Select language</option>
                  {LANGUAGES.map((l) => <option key={l} value={l}>{l}</option>)}
                </select>
              </div>
              <div>
                <label className={labelCls}>Nationality</label>
                <select name="NATIONALITY" value={form.NATIONALITY} onChange={handleChange} className={inputCls()}>
                  <option value="">Select nationality</option>
                  {NATIONALITIES.map((n) => <option key={n} value={n}>{n}</option>)}
                </select>
              </div>
              <div>
                <label className={labelCls}>Age</label>
                <input type="number" name="AGE" value={form.AGE} onChange={handleChange}
                  placeholder="e.g. 35" min={18} max={100} className={inputCls(!!errors.AGE)} />
                {errors.AGE && <p className="text-xs text-red-500 mt-1">{errors.AGE}</p>}
              </div>
              <div>
                <label className={labelCls}>Date of Birth</label>
                <input type="date" name="DOB" value={form.DOB} onChange={handleChange} className={inputCls()} />
              </div>
            </div>
          </div>

          {/* Contact Details */}
          <div>
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Contact Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className={labelCls}>Contact Number</label>
                <input type="tel" name="CONTACT" value={form.CONTACT} onChange={handleChange}
                  placeholder="e.g. +971501234567" className={inputCls(!!errors.CONTACT)} />
                {errors.CONTACT && <p className="text-xs text-red-500 mt-1">{errors.CONTACT}</p>}
              </div>
              <div>
                <label className={labelCls}>WhatsApp Number</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-green-500 text-sm">📱</span>
                  <input type="tel" name="WHATSAPP" value={form.WHATSAPP} onChange={handleChange}
                    placeholder="e.g. +971501234567"
                    className={`${inputCls(!!errors.WHATSAPP)} pl-9`} />
                </div>
                {errors.WHATSAPP && <p className="text-xs text-red-500 mt-1">{errors.WHATSAPP}</p>}
                {form.CONTACT && form.WHATSAPP === "" && (
                  <button type="button" onClick={() => setForm((p) => ({ ...p, WHATSAPP: p.CONTACT }))}
                    className="text-xs text-indigo-500 mt-1 hover:underline">
                    Same as contact number
                  </button>
                )}
              </div>
              <div className="md:col-span-2">
                <label className={labelCls}>Address</label>
                <textarea name="ADDRESS" value={form.ADDRESS} onChange={handleChange}
                  placeholder="Enter full address" rows={3}
                  className={`${inputCls()} resize-none`} />
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-2 border-t border-gray-100">
            <button type="button" onClick={handleReset}
              className="px-5 py-2.5 rounded-lg border border-gray-200 text-sm font-semibold
                         text-gray-600 hover:bg-gray-50 transition-colors">
              Reset
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={saving || !!licenseWarning || checkingLicense}
              className="px-6 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-700
                         disabled:opacity-50 text-white text-sm font-semibold
                         transition-colors shadow-sm flex items-center gap-2"
            >
              {saving ? (
                <>
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  {isEdit ? "Updating..." : "Saving..."}
                </>
              ) : (
                isEdit ? "💾 Update Doctor" : "✅ Save Doctor"
              )}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}