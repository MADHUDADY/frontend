// // import { useState, useEffect } from "react";
// // import { useNavigate } from "react-router-dom";
// // import { doctorAPI } from "../../services/api";

// // const categoryNames: Record<number, string> = {
// //   1:  "Internal Medicine",
// //   2:  "Pediatrician",
// //   3:  "Ophthalmologist",
// //   4:  "Gynecologist",
// //   5:  "Dermatologist",
// //   6:  "Orthodontist",
// //   7:  "Pathologist",
// //   8:  "General Practitioner",
// //   9:  "Dentist",
// //   10: "Homeopathy",
// // };

// // const categoryColors: Record<number, string> = {
// //   1:  "bg-purple-100 text-purple-700",
// //   2:  "bg-blue-100   text-blue-700",
// //   3:  "bg-red-100    text-red-700",
// //   4:  "bg-pink-100   text-pink-700",
// //   5:  "bg-orange-100 text-orange-700",
// //   6:  "bg-yellow-100 text-yellow-700",
// //   7:  "bg-green-100  text-green-700",
// //   8:  "bg-teal-100   text-teal-700",
// //   9:  "bg-indigo-100 text-indigo-700",
// //   10: "bg-rose-100   text-rose-700",
// // };
// // const getCatColor = (id: number) => categoryColors[id] || "bg-gray-100 text-gray-600";

// // const Avatar = ({ name }: { name: string }) => {
// //   const initials = (name || "DR")
// //     .replace(/Dr\.?\s*/i, "")
// //     .split(" ").filter(Boolean)
// //     .map((n: string) => n[0]).slice(0, 2).join("").toUpperCase();
// //   return (
// //     <div style={{ width: 36, height: 36, borderRadius: "50%",
// //       background: "#e0e7ff", color: "#4f46e5",
// //       display: "flex", alignItems: "center", justifyContent: "center",
// //       fontSize: 12, fontWeight: 700, flexShrink: 0 }}>
// //       {initials}
// //     </div>
// //   );
// // };

// // export default function DoctorList() {
// //   const navigate = useNavigate();
// //   const [doctors,       setDoctors]       = useState<any[]>([]);
// //   const [search,        setSearch]        = useState("");
// //   const [loading,       setLoading]       = useState(true);
// //   const [error,         setError]         = useState("");
// //   const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);
// //   const [viewDoctor,    setViewDoctor]    = useState<any | null>(null);
// //   const [deleting,      setDeleting]      = useState(false);

// //   useEffect(() => { fetchDoctors(); }, []);

// //   const fetchDoctors = async () => {
// //     try {
// //       setLoading(true);
// //       setError("");
// //       const res = await doctorAPI.getAll();
// //       setDoctors(res.data.data || []);
// //     } catch (err: any) {
// //       setError(`Failed to load doctors: ${err?.response?.data?.message || err.message}`);
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   const handleDelete = async (id: number) => {
// //     try {
// //       setDeleting(true);
// //       await doctorAPI.delete(id);
// //       setDoctors((prev) => prev.filter((d) => d.SERVICEID !== id));
// //       setDeleteConfirm(null);
// //     } catch (err: any) {
// //       alert("Delete failed: " + (err?.response?.data?.message || err.message));
// //     } finally {
// //       setDeleting(false);
// //     }
// //   };

// //   const filtered = doctors.filter((d) =>
// //     (d.SERVICE_E  || "").toLowerCase().includes(search.toLowerCase()) ||
// //     (d.SHORTNAME  || "").toLowerCase().includes(search.toLowerCase()) ||
// //     (d.ROOMNAME   || "").toLowerCase().includes(search.toLowerCase()) ||
// //     (d.MEDSOFT_ID || "").toLowerCase().includes(search.toLowerCase())
// //   );

// //   return (
// //     <div style={{ width: "100%", minHeight: "100vh", background: "#f8fafc", padding: 20 }}>

// //       {/* Header */}
// //       <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
// //         <h1 style={{ fontSize: 20, fontWeight: 700, color: "#111827", margin: 0 }}>
// //           Doctor List
// //           {!loading && (
// //             <span style={{ fontSize: 13, fontWeight: 500, color: "#6b7280", marginLeft: 10 }}>
// //               ({filtered.length} doctors)
// //             </span>
// //           )}
// //         </h1>
// //         <button
// //           onClick={() => navigate("/dashboard/Newdoctor")}
// //           style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 16px",
// //             background: "#4f46e5", color: "white", border: "none", borderRadius: 8,
// //             fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
// //           + Add Doctor
// //         </button>
// //       </div>

// //       {/* Search */}
// //       <div style={{ marginBottom: 16 }}>
// //         <input type="text" placeholder="Search by name, license, room..."
// //           value={search} onChange={(e) => setSearch(e.target.value)}
// //           style={{ padding: "9px 14px", border: "1.5px solid #e5e7eb", borderRadius: 10,
// //             fontSize: 13, outline: "none", width: 280 }} />
// //       </div>

// //       {loading && (
// //         <div style={{ textAlign: "center", padding: 60, color: "#6b7280" }}>
// //           ⏳ Loading doctors from database...
// //         </div>
// //       )}

// //       {error && (
// //         <div style={{ background: "#fee2e2", color: "#dc2626", padding: 14, borderRadius: 10,
// //           marginBottom: 16, fontSize: 13 }}>
// //           ❌ {error}
// //           <button onClick={fetchDoctors}
// //             style={{ marginLeft: 12, background: "#dc2626", color: "white", border: "none",
// //               padding: "4px 10px", borderRadius: 6, cursor: "pointer", fontSize: 12 }}>
// //             Retry
// //           </button>
// //         </div>
// //       )}

// //       {!loading && !error && (
// //         <div style={{ background: "white", borderRadius: 16, border: "1px solid #f3f4f6",
// //           boxShadow: "0 1px 3px rgba(0,0,0,0.06)", overflowX: "auto" }}>
// //           <table style={{ width: "100%", borderCollapse: "collapse" }}>
// //             <thead>
// //               <tr style={{ background: "#f9fafb", borderBottom: "1px solid #f3f4f6" }}>
// //                 {["Actions","Doctor Name","Short","Department","Zone","Room","Clinic","License"].map((h) => (
// //                   <th key={h} style={{ padding: "10px 14px", textAlign: "left", fontSize: 11,
// //                     fontWeight: 700, color: "#6b7280", textTransform: "uppercase", whiteSpace: "nowrap" }}>
// //                     {h}
// //                   </th>
// //                 ))}
// //               </tr>
// //             </thead>
// //             <tbody>
// //               {filtered.length === 0 ? (
// //                 <tr>
// //                   <td colSpan={8} style={{ padding: 50, textAlign: "center", color: "#9ca3af", fontSize: 14 }}>
// //                     {doctors.length === 0 ? "No doctors in database — click + Add Doctor" : "No doctors match search"}
// //                   </td>
// //                 </tr>
// //               ) : (
// //                 filtered.map((doc, idx) => (
// //                   <tr key={doc.SERVICEID}
// //                     style={{ borderBottom: "1px solid #f3f4f6",
// //                       background: idx % 2 === 1 ? "#fafafa" : "white",
// //                       transition: "background 0.15s" }}
// //                     onMouseEnter={(e) => (e.currentTarget.style.background = "#eef2ff")}
// //                     onMouseLeave={(e) => (e.currentTarget.style.background = idx % 2 === 1 ? "#fafafa" : "white")}>

// //                     {/* Actions */}
// //                     <td style={{ padding: "10px 14px", whiteSpace: "nowrap" }}>
// //                       <div style={{ display: "flex", gap: 4 }}>
// //                         <button title="View" onClick={() => setViewDoctor(doc)}
// //                           style={{ width: 30, height: 30, borderRadius: 7, background: "#22c55e",
// //                             border: "none", color: "white", cursor: "pointer", fontSize: 14 }}>👁</button>
// //                         {/* ← FIX: navigate with doctor ID for edit */}
// //                         <button title="Edit" onClick={() => navigate(`/dashboard/Newdoctor/${doc.SERVICEID}`)}
// //                           style={{ width: 30, height: 30, borderRadius: 7, background: "#3b82f6",
// //                             border: "none", color: "white", cursor: "pointer", fontSize: 14 }}>✏️</button>
// //                         <button title="Delete" onClick={() => setDeleteConfirm(doc.SERVICEID)}
// //                           style={{ width: 30, height: 30, borderRadius: 7, background: "#ef4444",
// //                             border: "none", color: "white", cursor: "pointer", fontSize: 14 }}>🗑</button>
// //                       </div>
// //                     </td>

// //                     {/* Name */}
// //                     <td style={{ padding: "10px 14px", whiteSpace: "nowrap" }}>
// //                       <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
// //                         <Avatar name={doc.SERVICE_E || "DR"} />
// //                         <span style={{ fontWeight: 600, color: "#111827", fontSize: 13 }}>
// //                           {doc.SERVICE_E}
// //                         </span>
// //                       </div>
// //                     </td>

// //                     <td style={{ padding: "10px 14px", color: "#374151", fontSize: 13 }}>
// //                       {doc.SHORTNAME || "—"}
// //                     </td>

// //                     {/* Department — name instead of just number */}
// //                     <td style={{ padding: "10px 14px" }}>
// //                       <span className={getCatColor(doc.CATEGORYID)}
// //                         style={{ padding: "3px 10px", borderRadius: 999, fontSize: 11, fontWeight: 600 }}>
// //                         {categoryNames[doc.CATEGORYID] || `Cat ${doc.CATEGORYID}`}
// //                       </span>
// //                     </td>

// //                     <td style={{ padding: "10px 14px", color: "#6b7280", fontSize: 13 }}>{doc.ZONE}</td>
// //                     <td style={{ padding: "10px 14px", color: "#6b7280", fontSize: 13 }}>{doc.ROOMNAME || "—"}</td>
// //                     <td style={{ padding: "10px 14px", color: "#6b7280", fontSize: 13 }}>{doc.CLINICID}</td>
// //                     <td style={{ padding: "10px 14px", color: "#6b7280", fontSize: 12, fontFamily: "monospace" }}>
// //                       {doc.MEDSOFT_ID || "—"}
// //                     </td>
// //                   </tr>
// //                 ))
// //               )}
// //             </tbody>
// //           </table>

// //           <div style={{ padding: "10px 16px", borderTop: "1px solid #f3f4f6" }}>
// //             <p style={{ fontSize: 12, color: "#9ca3af", margin: 0 }}>
// //               Showing <strong style={{ color: "#374151" }}>{filtered.length}</strong> of{" "}
// //               <strong style={{ color: "#374151" }}>{doctors.length}</strong> doctors
// //             </p>
// //           </div>
// //         </div>
// //       )}

// //       {/* ── Delete Confirm Modal ─────────────────────────────────────────── */}
// //       {deleteConfirm !== null && (
// //         <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)",
// //           display: "flex", alignItems: "center", justifyContent: "center", zIndex: 200 }}>
// //           <div style={{ background: "white", borderRadius: 16, padding: 28, maxWidth: 320, width: "90%" }}>
// //             <div style={{ textAlign: "center", marginBottom: 16 }}>
// //               <div style={{ fontSize: 40, marginBottom: 8 }}>🗑️</div>
// //               <h3 style={{ fontWeight: 700, color: "#111827", margin: "0 0 6px" }}>Delete Doctor?</h3>
// //               <p style={{ color: "#6b7280", fontSize: 13, margin: 0 }}>This action cannot be undone.</p>
// //             </div>
// //             <div style={{ display: "flex", gap: 10 }}>
// //               <button onClick={() => setDeleteConfirm(null)}
// //                 style={{ flex: 1, padding: "10px 0", borderRadius: 8, border: "1px solid #e5e7eb",
// //                   background: "white", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
// //                 Cancel
// //               </button>
// //               <button onClick={() => handleDelete(deleteConfirm)} disabled={deleting}
// //                 style={{ flex: 1, padding: "10px 0", borderRadius: 8, border: "none",
// //                   background: "#ef4444", color: "white", fontSize: 13, fontWeight: 600,
// //                   cursor: "pointer", opacity: deleting ? 0.6 : 1 }}>
// //                 {deleting ? "Deleting..." : "Delete"}
// //               </button>
// //             </div>
// //           </div>
// //         </div>
// //       )}

// //       {/* ── View Modal ───────────────────────────────────────────────────── */}
// //       {viewDoctor && (
// //         <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)",
// //           display: "flex", alignItems: "center", justifyContent: "center", zIndex: 200, padding: 16 }}>
// //           <div style={{ background: "white", borderRadius: 20, width: "100%", maxWidth: 460,
// //             overflow: "hidden", boxShadow: "0 20px 60px rgba(0,0,0,0.2)" }}>

// //             <div style={{ background: "#4f46e5", padding: "20px 24px",
// //               display: "flex", alignItems: "center", gap: 16 }}>
// //               <div style={{ width: 52, height: 52, borderRadius: 12,
// //                 background: "rgba(255,255,255,0.2)", color: "white",
// //                 display: "flex", alignItems: "center", justifyContent: "center",
// //                 fontSize: 18, fontWeight: 700 }}>
// //                 {(viewDoctor.SERVICE_E || "DR").replace(/Dr\.?\s*/i, "").split(" ")
// //                   .map((n: string) => n[0]).slice(0, 2).join("").toUpperCase()}
// //               </div>
// //               <div>
// //                 <h3 style={{ color: "white", fontWeight: 700, fontSize: 15, margin: 0 }}>
// //                   {viewDoctor.SERVICE_E}
// //                 </h3>
// //                 <p style={{ color: "#a5b4fc", fontSize: 13, margin: "4px 0 0" }}>
// //                   {categoryNames[viewDoctor.CATEGORYID] || `Category ${viewDoctor.CATEGORYID}`}
// //                   {" · "}Zone {viewDoctor.ZONE}
// //                 </p>
// //               </div>
// //               <button onClick={() => setViewDoctor(null)}
// //                 style={{ marginLeft: "auto", width: 32, height: 32, borderRadius: 8,
// //                   background: "rgba(255,255,255,0.15)", border: "none", color: "white",
// //                   cursor: "pointer", fontSize: 16 }}>✕</button>
// //             </div>

// //             <div style={{ padding: "20px 24px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
// //               {[
// //                 { label: "Short Name",    value: viewDoctor.SHORTNAME   || "—" },
// //                 { label: "Department",    value: categoryNames[viewDoctor.CATEGORYID] || `Cat ${viewDoctor.CATEGORYID}` },
// //                 { label: "Zone",          value: viewDoctor.ZONE },
// //                 { label: "Room",          value: viewDoctor.ROOMNAME    || "—" },
// //                 { label: "Clinic ID",     value: viewDoctor.CLINICID },
// //                 { label: "Service ID",    value: viewDoctor.SERVICEID },
// //                 { label: "License No",    value: viewDoctor.MEDSOFT_ID  || "—" },
// //                 { label: "Qualification", value: viewDoctor.MEDSOFT_NAME || "—" },
// //                 { label: "Walk-In",       value: viewDoctor.WALKIN_ACTIVE      === "Y" ? "✅ Active" : "❌ Inactive" },
// //                 { label: "Appointment",   value: viewDoctor.APPOINTMENT_ACTIVE === "Y" ? "✅ Active" : "❌ Inactive" },
// //               ].map(({ label, value }) => (
// //                 <div key={label}>
// //                   <p style={{ fontSize: 11, color: "#9ca3af", fontWeight: 600, margin: "0 0 3px",
// //                     textTransform: "uppercase", letterSpacing: "0.04em" }}>{label}</p>
// //                   <p style={{ fontSize: 13, color: "#111827", fontWeight: 600, margin: 0 }}>{value}</p>
// //                 </div>
// //               ))}
// //             </div>

// //             <div style={{ padding: "0 24px 20px", display: "flex", gap: 10 }}>
// //               <button onClick={() => { setViewDoctor(null); navigate(`/dashboard/Newdoctor/${viewDoctor.SERVICEID}`); }}
// //                 style={{ flex: 1, padding: "11px 0", borderRadius: 10, border: "none",
// //                   background: "#4f46e5", color: "white", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
// //                 ✏️ Edit Doctor
// //               </button>
// //               <button onClick={() => setViewDoctor(null)}
// //                 style={{ flex: 1, padding: "11px 0", borderRadius: 10,
// //                   border: "1px solid #e5e7eb", background: "white", fontSize: 13,
// //                   fontWeight: 600, cursor: "pointer" }}>
// //                 Close
// //               </button>
// //             </div>
// //           </div>
// //         </div>
// //       )}
// //     </div>
// //   );
// // }
// // src/pages/doctors/DoctorList.tsx
// import { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import { doctorAPI } from "../../services/api";

// const BASE_URL = "http://localhost:5000";

// const categoryNames: Record<number, string> = {
//   1:"Internal Medicine", 2:"Pediatrician", 3:"Ophthalmologist",
//   4:"Gynecologist", 5:"Dermatologist", 6:"Orthodontist",
//   7:"Pathologist", 8:"General Practitioner", 9:"Dentist", 10:"Homeopathy",
// };
// const categoryColors: Record<number, { bg: string; color: string }> = {
//   1:{ bg:"#f3e8ff", color:"#7e22ce" }, 2:{ bg:"#dbeafe", color:"#1d4ed8" },
//   3:{ bg:"#fee2e2", color:"#b91c1c" }, 4:{ bg:"#fce7f3", color:"#be185d" },
//   5:{ bg:"#ffedd5", color:"#c2410c" }, 6:{ bg:"#fef9c3", color:"#a16207" },
//   7:{ bg:"#dcfce7", color:"#15803d" }, 8:{ bg:"#ccfbf1", color:"#0f766e" },
//   9:{ bg:"#e0e7ff", color:"#4338ca" }, 10:{ bg:"#ffe4e6", color:"#be123c" },
// };
// const getCat = (id: number) => categoryColors[id] || { bg: "#f3f4f6", color: "#374151" };

// // Shows photo if available, otherwise initials avatar
// const Avatar = ({ name, photo, size = 36 }: { name: string; photo?: string | null; size?: number }) => {
//   const initials = (name || "DR").replace(/Dr\.?\s*/i, "")
//     .split(" ").filter(Boolean).map((n: string) => n[0]).slice(0, 2).join("").toUpperCase();

//   if (photo) {
//     return (
//       <img src={`${BASE_URL}${photo}`} alt={name}
//         onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none"; }}
//         style={{ width: size, height: size, borderRadius: "50%", objectFit: "cover",
//           flexShrink: 0, border: "2px solid #e0e7ff" }} />
//     );
//   }
//   return (
//     <div style={{ width: size, height: size, borderRadius: "50%", background: "#e0e7ff",
//       color: "#4f46e5", display: "flex", alignItems: "center", justifyContent: "center",
//       fontSize: Math.round(size * 0.33), fontWeight: 700, flexShrink: 0 }}>
//       {initials}
//     </div>
//   );
// };

// export default function DoctorList() {
//   const navigate = useNavigate();
//   const [doctors,       setDoctors]       = useState<any[]>([]);
//   const [search,        setSearch]        = useState("");
//   const [loading,       setLoading]       = useState(true);
//   const [error,         setError]         = useState("");
//   const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);
//   const [viewDoctor,    setViewDoctor]    = useState<any | null>(null);
//   const [deleting,      setDeleting]      = useState(false);

//   useEffect(() => { fetchDoctors(); }, []);

//   const fetchDoctors = async () => {
//     try {
//       setLoading(true); setError("");
//       const res = await doctorAPI.getAll();
//       setDoctors(res.data.data || []);
//     } catch (err: any) {
//       setError(err?.response?.data?.message || err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleDelete = async (id: number) => {
//     try {
//       setDeleting(true);
//       await doctorAPI.delete(id);
//       setDoctors((p) => p.filter((d) => d.SERVICEID !== id));
//       setDeleteConfirm(null);
//     } catch (err: any) {
//       alert("Delete failed: " + (err?.response?.data?.message || err.message));
//     } finally {
//       setDeleting(false);
//     }
//   };

//   const filtered = doctors.filter((d) =>
//     [d.SERVICE_E, d.SHORTNAME, d.ROOMNAME, d.MEDSOFT_ID].some(
//       (v) => (v || "").toLowerCase().includes(search.toLowerCase())
//     )
//   );

//   return (
//     <div style={{ width: "100%", minHeight: "100vh", background: "#f8fafc", padding: 20 }}>

//       {/* Header */}
//       <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
//         <h1 style={{ fontSize: 20, fontWeight: 700, color: "#111827", margin: 0 }}>
//           Doctor List
//           {!loading && <span style={{ fontSize: 13, fontWeight: 500, color: "#6b7280", marginLeft: 8 }}>({filtered.length})</span>}
//         </h1>
//         <button onClick={() => navigate("/dashboard/Newdoctor")}
//           style={{ padding: "8px 18px", background: "#4f46e5", color: "white",
//             border: "none", borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
//           + Add Doctor
//         </button>
//       </div>

//       {/* Search */}
//       <input type="text" placeholder="Search name, license, room..."
//         value={search} onChange={(e) => setSearch(e.target.value)}
//         style={{ padding: "9px 14px", border: "1.5px solid #e5e7eb", borderRadius: 10,
//           fontSize: 13, outline: "none", width: 280, marginBottom: 16, display: "block" }} />

//       {loading && <div style={{ textAlign: "center", padding: 60, color: "#6b7280" }}>⏳ Loading...</div>}

//       {error && (
//         <div style={{ background: "#fee2e2", color: "#dc2626", padding: 14, borderRadius: 10, marginBottom: 16, fontSize: 13 }}>
//           ❌ {error}
//           <button onClick={fetchDoctors}
//             style={{ marginLeft: 12, background: "#dc2626", color: "white", border: "none",
//               padding: "4px 10px", borderRadius: 6, cursor: "pointer", fontSize: 12 }}>Retry</button>
//         </div>
//       )}

//       {!loading && !error && (
//         <div style={{ background: "white", borderRadius: 16, border: "1px solid #f3f4f6",
//           boxShadow: "0 1px 3px rgba(0,0,0,0.06)", overflowX: "auto" }}>
//           <table style={{ width: "100%", borderCollapse: "collapse" }}>
//             <thead>
//               <tr style={{ background: "#f9fafb", borderBottom: "1px solid #f3f4f6" }}>
//                 {["Actions", "Doctor", "Short", "Department", "Zone", "Room", "License"].map((h) => (
//                   <th key={h} style={{ padding: "10px 14px", textAlign: "left", fontSize: 11,
//                     fontWeight: 700, color: "#6b7280", textTransform: "uppercase", whiteSpace: "nowrap" }}>{h}</th>
//                 ))}
//               </tr>
//             </thead>
//             <tbody>
//               {filtered.length === 0 ? (
//                 <tr><td colSpan={7} style={{ padding: 50, textAlign: "center", color: "#9ca3af", fontSize: 14 }}>
//                   {doctors.length === 0 ? "No doctors — click + Add Doctor" : "No match found"}
//                 </td></tr>
//               ) : filtered.map((doc, idx) => {
//                 const cat = getCat(doc.CATEGORYID);
//                 return (
//                   <tr key={doc.SERVICEID}
//                     style={{ borderBottom: "1px solid #f3f4f6", background: idx % 2 === 1 ? "#fafafa" : "white" }}
//                     onMouseEnter={(e) => (e.currentTarget.style.background = "#eef2ff")}
//                     onMouseLeave={(e) => (e.currentTarget.style.background = idx % 2 === 1 ? "#fafafa" : "white")}>

//                     <td style={{ padding: "10px 14px", whiteSpace: "nowrap" }}>
//                       <div style={{ display: "flex", gap: 4 }}>
//                         <button onClick={() => setViewDoctor(doc)}
//                           style={{ width: 30, height: 30, borderRadius: 7, background: "#22c55e",
//                             border: "none", color: "white", cursor: "pointer", fontSize: 13 }}>👁</button>
//                         <button onClick={() => navigate(`/dashboard/Newdoctor/${doc.SERVICEID}`)}
//                           style={{ width: 30, height: 30, borderRadius: 7, background: "#3b82f6",
//                             border: "none", color: "white", cursor: "pointer", fontSize: 13 }}>✏️</button>
//                         <button onClick={() => setDeleteConfirm(doc.SERVICEID)}
//                           style={{ width: 30, height: 30, borderRadius: 7, background: "#ef4444",
//                             border: "none", color: "white", cursor: "pointer", fontSize: 13 }}>🗑</button>
//                       </div>
//                     </td>

//                     {/* Doctor name + photo */}
//                     <td style={{ padding: "10px 14px", whiteSpace: "nowrap" }}>
//                       <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
//                         <Avatar name={doc.SERVICE_E} photo={doc.PHOTO} size={36} />
//                         <span style={{ fontWeight: 600, color: "#111827", fontSize: 13 }}>{doc.SERVICE_E}</span>
//                       </div>
//                     </td>

//                     <td style={{ padding: "10px 14px", color: "#374151", fontSize: 13 }}>{doc.SHORTNAME || "—"}</td>

//                     <td style={{ padding: "10px 14px" }}>
//                       <span style={{ padding: "3px 10px", borderRadius: 999, fontSize: 11, fontWeight: 600,
//                         background: cat.bg, color: cat.color }}>
//                         {categoryNames[doc.CATEGORYID] || `Cat ${doc.CATEGORYID}`}
//                       </span>
//                     </td>

//                     <td style={{ padding: "10px 14px", color: "#6b7280", fontSize: 13 }}>{doc.ZONE}</td>
//                     <td style={{ padding: "10px 14px", color: "#6b7280", fontSize: 13 }}>{doc.ROOMNAME || "—"}</td>
//                     <td style={{ padding: "10px 14px", color: "#6b7280", fontSize: 12, fontFamily: "monospace" }}>
//                       {doc.MEDSOFT_ID || "—"}
//                     </td>
//                   </tr>
//                 );
//               })}
//             </tbody>
//           </table>
//           <div style={{ padding: "10px 16px", borderTop: "1px solid #f3f4f6" }}>
//             <p style={{ fontSize: 12, color: "#9ca3af", margin: 0 }}>
//               Showing <strong style={{ color: "#374151" }}>{filtered.length}</strong> of{" "}
//               <strong style={{ color: "#374151" }}>{doctors.length}</strong> doctors
//             </p>
//           </div>
//         </div>
//       )}

//       {/* ── Delete Modal ───────────────────────────────────────────────── */}
//       {deleteConfirm !== null && (
//         <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)",
//           display: "flex", alignItems: "center", justifyContent: "center", zIndex: 200 }}>
//           <div style={{ background: "white", borderRadius: 16, padding: 28, maxWidth: 320, width: "90%" }}>
//             <div style={{ textAlign: "center", marginBottom: 16 }}>
//               <div style={{ fontSize: 40, marginBottom: 8 }}>🗑️</div>
//               <h3 style={{ fontWeight: 700, color: "#111827", margin: "0 0 6px" }}>Delete Doctor?</h3>
//               <p style={{ color: "#6b7280", fontSize: 13, margin: 0 }}>This cannot be undone.</p>
//             </div>
//             <div style={{ display: "flex", gap: 10 }}>
//               <button onClick={() => setDeleteConfirm(null)}
//                 style={{ flex: 1, padding: "10px 0", borderRadius: 8, border: "1px solid #e5e7eb",
//                   background: "white", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>Cancel</button>
//               <button onClick={() => handleDelete(deleteConfirm!)} disabled={deleting}
//                 style={{ flex: 1, padding: "10px 0", borderRadius: 8, border: "none",
//                   background: "#ef4444", color: "white", fontSize: 13, fontWeight: 600,
//                   cursor: "pointer", opacity: deleting ? 0.6 : 1 }}>
//                 {deleting ? "Deleting..." : "Delete"}
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* ── View Modal — shows BIG photo ──────────────────────────────── */}
//       {viewDoctor && (
//         <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)",
//           display: "flex", alignItems: "center", justifyContent: "center", zIndex: 200, padding: 16 }}>
//           <div style={{ background: "white", borderRadius: 20, width: "100%", maxWidth: 460,
//             overflow: "hidden", boxShadow: "0 20px 60px rgba(0,0,0,0.2)" }}>

//             <div style={{ background: "#4f46e5", padding: "24px", display: "flex", alignItems: "center", gap: 16 }}>
//               <Avatar name={viewDoctor.SERVICE_E} photo={viewDoctor.PHOTO} size={64} />
//               <div>
//                 <h3 style={{ color: "white", fontWeight: 700, fontSize: 16, margin: 0 }}>{viewDoctor.SERVICE_E}</h3>
//                 <p style={{ color: "#a5b4fc", fontSize: 13, margin: "4px 0 0" }}>
//                   {categoryNames[viewDoctor.CATEGORYID] || `Cat ${viewDoctor.CATEGORYID}`} · Zone {viewDoctor.ZONE}
//                 </p>
//               </div>
//               <button onClick={() => setViewDoctor(null)}
//                 style={{ marginLeft: "auto", width: 32, height: 32, borderRadius: 8,
//                   background: "rgba(255,255,255,0.15)", border: "none", color: "white", cursor: "pointer", fontSize: 16 }}>✕</button>
//             </div>

//             <div style={{ padding: "20px 24px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
//               {[
//                 { label: "Short Name",    value: viewDoctor.SHORTNAME    || "—" },
//                 { label: "License No",    value: viewDoctor.MEDSOFT_ID   || "—" },
//                 { label: "Qualification", value: viewDoctor.MEDSOFT_NAME || "—" },
//                 { label: "Room",          value: viewDoctor.ROOMNAME     || "—" },
//                 { label: "Clinic ID",     value: viewDoctor.CLINICID },
//                 { label: "Service ID",    value: viewDoctor.SERVICEID },
//                 { label: "Walk-In",       value: viewDoctor.WALKIN_ACTIVE      === "Y" ? "✅ Active" : "❌ No" },
//                 { label: "Appointment",   value: viewDoctor.APPOINTMENT_ACTIVE === "Y" ? "✅ Active" : "❌ No" },
//               ].map(({ label, value }) => (
//                 <div key={label}>
//                   <p style={{ fontSize: 11, color: "#9ca3af", fontWeight: 600, margin: "0 0 3px",
//                     textTransform: "uppercase", letterSpacing: "0.04em" }}>{label}</p>
//                   <p style={{ fontSize: 13, color: "#111827", fontWeight: 600, margin: 0 }}>{value}</p>
//                 </div>
//               ))}
//             </div>

//             <div style={{ padding: "0 24px 20px", display: "flex", gap: 10 }}>
//               <button onClick={() => { setViewDoctor(null); navigate(`/dashboard/Newdoctor/${viewDoctor.SERVICEID}`); }}
//                 style={{ flex: 1, padding: "11px 0", borderRadius: 10, border: "none",
//                   background: "#4f46e5", color: "white", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
//                 ✏️ Edit
//               </button>
//               <button onClick={() => setViewDoctor(null)}
//                 style={{ flex: 1, padding: "11px 0", borderRadius: 10, border: "1px solid #e5e7eb",
//                   background: "white", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
//                 Close
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }
// Appointments/src/components/doctor/DoctorList.tsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { doctorAPI } from "../../services/api";

const BASE_URL = "https://backend-production-2df7.up.railway.app";

const categoryNames: Record<number, string> = {
  1: "Internal Medicine", 2: "Pediatrician",  3: "Ophthalmologist",
  4: "Gynecologist",      5: "Dermatologist",  6: "Orthodontist",
  7: "Pathologist",       8: "General Practitioner", 9: "Dentist",
  10: "Homeopathy",
};

const categoryColors: Record<number, { bg: string; color: string }> = {
  1:  { bg: "#f3e8ff", color: "#7e22ce" },
  2:  { bg: "#dbeafe", color: "#1d4ed8" },
  3:  { bg: "#fee2e2", color: "#b91c1c" },
  4:  { bg: "#fce7f3", color: "#be185d" },
  5:  { bg: "#ffedd5", color: "#c2410c" },
  6:  { bg: "#fef9c3", color: "#a16207" },
  7:  { bg: "#dcfce7", color: "#15803d" },
  8:  { bg: "#ccfbf1", color: "#0f766e" },
  9:  { bg: "#e0e7ff", color: "#4338ca" },
  10: { bg: "#ffe4e6", color: "#be123c" },
};

const getCat = (id: number) =>
  categoryColors[id] || { bg: "#f3f4f6", color: "#374151" };

// ── Avatar — shows photo if available, else initials ─────────────────────────
const Avatar = ({
  name,
  photo,
  size = 36,
}: {
  name: string;
  photo?: string | null;
  size?: number;
}) => {
  const initials = (name || "DR")
    .replace(/Dr\.?\s*/i, "")
    .split(" ")
    .filter(Boolean)
    .map((n: string) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  if (photo) {
    return (
      <img
        src={`${BASE_URL}${photo}`}
        alt={name}
        onError={(e) => {
          (e.currentTarget as HTMLImageElement).style.display = "none";
        }}
        style={{
          width: size, height: size, borderRadius: "50%",
          objectFit: "cover", flexShrink: 0, border: "2px solid #e0e7ff",
        }}
      />
    );
  }
  return (
    <div
      style={{
        width: size, height: size, borderRadius: "50%",
        background: "#e0e7ff", color: "#4f46e5",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: Math.round(size * 0.33), fontWeight: 700, flexShrink: 0,
      }}
    >
      {initials}
    </div>
  );
};

// ── Main Component ────────────────────────────────────────────────────────────
export default function DoctorList() {
  const navigate = useNavigate();

  const [doctors,       setDoctors]       = useState<any[]>([]);
  const [search,        setSearch]        = useState("");
  const [loading,       setLoading]       = useState(true);
  const [error,         setError]         = useState("");
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);
  const [viewDoctor,    setViewDoctor]    = useState<any | null>(null);
  const [deleting,      setDeleting]      = useState(false);

  useEffect(() => { fetchDoctors(); }, []);

  const fetchDoctors = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await doctorAPI.getAll();
      setDoctors(res.data.data || []);
    } catch (err: any) {
      setError(err?.response?.data?.message || err.message || "Failed to load doctors");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      setDeleting(true);
      await doctorAPI.delete(id);
      setDoctors((p) => p.filter((d) => d.SERVICEID !== id));
      setDeleteConfirm(null);
    } catch (err: any) {
      alert("Delete failed: " + (err?.response?.data?.message || err.message));
    } finally {
      setDeleting(false);
    }
  };

  const filtered = doctors.filter((d) =>
    [d.SERVICE_E, d.SHORTNAME, d.ROOMNAME, d.MEDSOFT_ID].some((v) =>
      (v || "").toLowerCase().includes(search.toLowerCase())
    )
  );

  return (
    <div style={{ width: "100%", minHeight: "100vh", background: "#f8fafc", padding: 20 }}>

      {/* ── Header ────────────────────────────────────────────────────────── */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
        <h1 style={{ fontSize: 20, fontWeight: 700, color: "#111827", margin: 0 }}>
          Doctor List
          {!loading && (
            <span style={{ fontSize: 13, fontWeight: 500, color: "#6b7280", marginLeft: 8 }}>
              ({filtered.length})
            </span>
          )}
        </h1>
        <button
          onClick={() => navigate("/dashboard/Newdoctor")}
          style={{ padding: "8px 18px", background: "#4f46e5", color: "white",
            border: "none", borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: "pointer" }}
        >
          + Add Doctor
        </button>
      </div>

      {/* ── Search ────────────────────────────────────────────────────────── */}
      <input
        type="text"
        placeholder="Search name, license, room..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{ padding: "9px 14px", border: "1.5px solid #e5e7eb", borderRadius: 10,
          fontSize: 13, outline: "none", width: 280, marginBottom: 16, display: "block" }}
      />

      {/* ── Loading ───────────────────────────────────────────────────────── */}
      {loading && (
        <div style={{ textAlign: "center", padding: 60, color: "#6b7280" }}>
          ⏳ Loading...
        </div>
      )}

      {/* ── Error ─────────────────────────────────────────────────────────── */}
      {error && (
        <div style={{ background: "#fee2e2", color: "#dc2626", padding: 14,
          borderRadius: 10, marginBottom: 16, fontSize: 13 }}>
          ❌ {error}
          <button
            onClick={fetchDoctors}
            style={{ marginLeft: 12, background: "#dc2626", color: "white",
              border: "none", padding: "4px 10px", borderRadius: 6,
              cursor: "pointer", fontSize: 12 }}
          >
            Retry
          </button>
        </div>
      )}

      {/* ── Table ─────────────────────────────────────────────────────────── */}
      {!loading && !error && (
        <div style={{ background: "white", borderRadius: 16, border: "1px solid #f3f4f6",
          boxShadow: "0 1px 3px rgba(0,0,0,0.06)", overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "#f9fafb", borderBottom: "1px solid #f3f4f6" }}>
                {["Actions", "Doctor", "Short", "Department", "Zone", "Room", "License"].map((h) => (
                  <th key={h} style={{ padding: "10px 14px", textAlign: "left", fontSize: 11,
                    fontWeight: 700, color: "#6b7280", textTransform: "uppercase", whiteSpace: "nowrap" }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ padding: 50, textAlign: "center", color: "#9ca3af", fontSize: 14 }}>
                    {doctors.length === 0 ? "No doctors — click + Add Doctor" : "No match found"}
                  </td>
                </tr>
              ) : (
                filtered.map((doc, idx) => {
                  const cat = getCat(doc.CATEGORYID);
                  return (
                    <tr
                      key={doc.SERVICEID}
                      style={{ borderBottom: "1px solid #f3f4f6",
                        background: idx % 2 === 1 ? "#fafafa" : "white" }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = "#eef2ff")}
                      onMouseLeave={(e) => (e.currentTarget.style.background = idx % 2 === 1 ? "#fafafa" : "white")}
                    >
                      {/* Actions */}
                      <td style={{ padding: "10px 14px", whiteSpace: "nowrap" }}>
                        <div style={{ display: "flex", gap: 4 }}>
                          <button
                            title="View"
                            onClick={() => setViewDoctor(doc)}
                            style={{ width: 30, height: 30, borderRadius: 7, background: "#22c55e",
                              border: "none", color: "white", cursor: "pointer", fontSize: 13 }}
                          >👁</button>
                          <button
                            title="Edit"
                            onClick={() => navigate(`/dashboard/Newdoctor/${doc.SERVICEID}`)}
                            style={{ width: 30, height: 30, borderRadius: 7, background: "#3b82f6",
                              border: "none", color: "white", cursor: "pointer", fontSize: 13 }}
                          >✏️</button>
                          <button
                            title="Delete"
                            onClick={() => setDeleteConfirm(doc.SERVICEID)}
                            style={{ width: 30, height: 30, borderRadius: 7, background: "#ef4444",
                              border: "none", color: "white", cursor: "pointer", fontSize: 13 }}
                          >🗑</button>
                        </div>
                      </td>

                      {/* Doctor name + photo */}
                      <td style={{ padding: "10px 14px", whiteSpace: "nowrap" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                          <Avatar name={doc.SERVICE_E} photo={doc.PHOTO} size={36} />
                          <span style={{ fontWeight: 600, color: "#111827", fontSize: 13 }}>
                            {doc.SERVICE_E}
                          </span>
                        </div>
                      </td>

                      <td style={{ padding: "10px 14px", color: "#374151", fontSize: 13 }}>
                        {doc.SHORTNAME || "—"}
                      </td>

                      {/* Department badge */}
                      <td style={{ padding: "10px 14px" }}>
                        <span style={{ padding: "3px 10px", borderRadius: 999, fontSize: 11,
                          fontWeight: 600, background: cat.bg, color: cat.color }}>
                          {categoryNames[doc.CATEGORYID] || `Cat ${doc.CATEGORYID}`}
                        </span>
                      </td>

                      <td style={{ padding: "10px 14px", color: "#6b7280", fontSize: 13 }}>{doc.ZONE}</td>
                      <td style={{ padding: "10px 14px", color: "#6b7280", fontSize: 13 }}>{doc.ROOMNAME || "—"}</td>
                      <td style={{ padding: "10px 14px", color: "#6b7280", fontSize: 12, fontFamily: "monospace" }}>
                        {doc.MEDSOFT_ID || "—"}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>

          {/* Row count */}
          <div style={{ padding: "10px 16px", borderTop: "1px solid #f3f4f6" }}>
            <p style={{ fontSize: 12, color: "#9ca3af", margin: 0 }}>
              Showing{" "}
              <strong style={{ color: "#374151" }}>{filtered.length}</strong> of{" "}
              <strong style={{ color: "#374151" }}>{doctors.length}</strong> doctors
            </p>
          </div>
        </div>
      )}

      {/* ── Delete Confirm Modal ───────────────────────────────────────────── */}
      {deleteConfirm !== null && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)",
          display: "flex", alignItems: "center", justifyContent: "center", zIndex: 200 }}>
          <div style={{ background: "white", borderRadius: 16, padding: 28, maxWidth: 320, width: "90%" }}>
            <div style={{ textAlign: "center", marginBottom: 16 }}>
              <div style={{ fontSize: 40, marginBottom: 8 }}>🗑️</div>
              <h3 style={{ fontWeight: 700, color: "#111827", margin: "0 0 6px" }}>Delete Doctor?</h3>
              <p style={{ color: "#6b7280", fontSize: 13, margin: 0 }}>This cannot be undone.</p>
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              <button
                onClick={() => setDeleteConfirm(null)}
                style={{ flex: 1, padding: "10px 0", borderRadius: 8,
                  border: "1px solid #e5e7eb", background: "white",
                  fontSize: 13, fontWeight: 600, cursor: "pointer" }}
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirm!)}
                disabled={deleting}
                style={{ flex: 1, padding: "10px 0", borderRadius: 8, border: "none",
                  background: "#ef4444", color: "white", fontSize: 13, fontWeight: 600,
                  cursor: "pointer", opacity: deleting ? 0.6 : 1 }}
              >
                {deleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── View Modal ────────────────────────────────────────────────────── */}
      {viewDoctor && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)",
          display: "flex", alignItems: "center", justifyContent: "center",
          zIndex: 200, padding: 16 }}>
          <div style={{ background: "white", borderRadius: 20, width: "100%", maxWidth: 460,
            overflow: "hidden", boxShadow: "0 20px 60px rgba(0,0,0,0.2)" }}>

            {/* Modal header with photo */}
            <div style={{ background: "#4f46e5", padding: "24px",
              display: "flex", alignItems: "center", gap: 16 }}>
              <Avatar name={viewDoctor.SERVICE_E} photo={viewDoctor.PHOTO} size={64} />
              <div>
                <h3 style={{ color: "white", fontWeight: 700, fontSize: 16, margin: 0 }}>
                  {viewDoctor.SERVICE_E}
                </h3>
                <p style={{ color: "#a5b4fc", fontSize: 13, margin: "4px 0 0" }}>
                  {categoryNames[viewDoctor.CATEGORYID] || `Cat ${viewDoctor.CATEGORYID}`}
                  {" · "}Zone {viewDoctor.ZONE}
                </p>
              </div>
              <button
                onClick={() => setViewDoctor(null)}
                style={{ marginLeft: "auto", width: 32, height: 32, borderRadius: 8,
                  background: "rgba(255,255,255,0.15)", border: "none",
                  color: "white", cursor: "pointer", fontSize: 16 }}
              >✕</button>
            </div>

            {/* Modal fields */}
            <div style={{ padding: "20px 24px", display: "grid",
              gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              {[
                { label: "Short Name",    value: viewDoctor.SHORTNAME    || "—" },
                { label: "License No",    value: viewDoctor.MEDSOFT_ID   || "—" },
                { label: "Qualification", value: viewDoctor.MEDSOFT_NAME || "—" },
                { label: "Room",          value: viewDoctor.ROOMNAME     || "—" },
                { label: "Clinic ID",     value: viewDoctor.CLINICID },
                { label: "Service ID",    value: viewDoctor.SERVICEID },
                { label: "Language",      value: viewDoctor.LANGUAGE     || "—" },
                { label: "Nationality",   value: viewDoctor.NATIONALITY  || "—" },
                { label: "Contact",       value: viewDoctor.CONTACT      || "—" },
                { label: "WhatsApp",      value: viewDoctor.WHATSAPP     || "—" },
                { label: "Walk-In",       value: viewDoctor.WALKIN_ACTIVE      === "Y" ? "✅ Active" : "❌ No" },
                { label: "Appointment",   value: viewDoctor.APPOINTMENT_ACTIVE === "Y" ? "✅ Active" : "❌ No" },
              ].map(({ label, value }) => (
                <div key={label}>
                  <p style={{ fontSize: 11, color: "#9ca3af", fontWeight: 600,
                    margin: "0 0 3px", textTransform: "uppercase", letterSpacing: "0.04em" }}>
                    {label}
                  </p>
                  <p style={{ fontSize: 13, color: "#111827", fontWeight: 600, margin: 0 }}>
                    {value}
                  </p>
                </div>
              ))}
            </div>

            {/* Modal address — full width */}
            {viewDoctor.ADDRESS && (
              <div style={{ padding: "0 24px 16px" }}>
                <p style={{ fontSize: 11, color: "#9ca3af", fontWeight: 600,
                  margin: "0 0 3px", textTransform: "uppercase", letterSpacing: "0.04em" }}>
                  Address
                </p>
                <p style={{ fontSize: 13, color: "#111827", fontWeight: 600, margin: 0 }}>
                  {viewDoctor.ADDRESS}
                </p>
              </div>
            )}

            {/* Modal actions */}
            <div style={{ padding: "0 24px 20px", display: "flex", gap: 10 }}>
              <button
                onClick={() => {
                  setViewDoctor(null);
                  navigate(`/dashboard/Newdoctor/${viewDoctor.SERVICEID}`);
                }}
                style={{ flex: 1, padding: "11px 0", borderRadius: 10, border: "none",
                  background: "#4f46e5", color: "white", fontSize: 13,
                  fontWeight: 600, cursor: "pointer" }}
              >
                ✏️ Edit
              </button>
              <button
                onClick={() => setViewDoctor(null)}
                style={{ flex: 1, padding: "11px 0", borderRadius: 10,
                  border: "1px solid #e5e7eb", background: "white",
                  fontSize: 13, fontWeight: 600, cursor: "pointer" }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}