import { useState, useRef, useEffect } from "react";

interface Doctor {
  id: number;
  clinic: string;
  name: string;
  department: string;
  qualification: string;
  mobile: string;
  email: string;
  idNumber: string;
  licenseNumber: string;
  roomNumber: string;
  whatsapp: string;
  picture: string | null;
}

const sampleDoctors: Doctor[] = [
  { id: 1, name: "Dr. Ahmed Al Mansoori", department: "Cardiology", qualification: "MBBS, MD", mobile: "+971 501234567", email: "ahmed@medcare.com", idNumber: "784-1990-1234567-1", licenseNumber: "DHA-12345", clinic: "Medcare Clinic", roomNumber: "101", whatsapp: "+971 501234567", picture: "https://randomuser.me/api/portraits/men/32.jpg" },
  { id: 2, name: "Dr. Sara Al Hashimi", department: "Pediatrics", qualification: "MBBS, FRCP", mobile: "+971 509876543", email: "sara@alnoorclinic.com", idNumber: "784-1985-7654321-2", licenseNumber: "DHA-67890", clinic: "Al Noor Clinic", roomNumber: "205", whatsapp: "+971 509876543", picture: "https://randomuser.me/api/portraits/women/44.jpg" },
  { id: 3, name: "Dr. Khalid Rahman", department: "Orthopedics", qualification: "MBBS, FRCS", mobile: "+971 554433221", email: "khalid@valiantclinic.com", idNumber: "784-1978-1122334-3", licenseNumber: "DHA-11223", clinic: "Valiant Clinic", roomNumber: "308", whatsapp: "+971 554433221", picture: "https://randomuser.me/api/portraits/men/75.jpg" },
  { id: 4, name: "Dr. Fatima Yousuf", department: "Dermatology", qualification: "MBBS, MD", mobile: "+971 551122334", email: "fatima@asterclinic.com", idNumber: "784-1992-5566778-4", licenseNumber: "DHA-33210", clinic: "Aster Clinic", roomNumber: "110", whatsapp: "+971 551122334", picture: "https://randomuser.me/api/portraits/women/68.jpg" },
  { id: 5, name: "Dr. Omar Hassan", department: "Neurology", qualification: "MBBS, DM", mobile: "+971 507788990", email: "omar@asterclinic.com", idNumber: "784-1980-9988776-5", licenseNumber: "DHA-44321", clinic: "Aster Clinic", roomNumber: "112", whatsapp: "+971 507788990", picture: "https://randomuser.me/api/portraits/men/45.jpg" },
  { id: 6, name: "Dr. Layla Al Farsi", department: "Gynecology", qualification: "MBBS, FRCOG", mobile: "+971 503344556", email: "layla@nmcclinic.com", idNumber: "784-1987-1231231-6", licenseNumber: "DHA-55412", clinic: "NMC Clinic", roomNumber: "201", whatsapp: "+971 503344556", picture: "https://randomuser.me/api/portraits/women/22.jpg" },
  { id: 7, name: "Dr. Tariq Mahmood", department: "Cardiology", qualification: "MBBS, MD", mobile: "+971 556677889", email: "tariq@medcare.com", idNumber: "784-1975-3213213-7", licenseNumber: "DHA-66503", clinic: "Medcare Clinic", roomNumber: "103", whatsapp: "+971 556677889", picture: "https://randomuser.me/api/portraits/men/55.jpg" },
  { id: 8, name: "Dr. Nadia Khan", department: "Pediatrics", qualification: "MBBS, DCH", mobile: "+971 509988776", email: "nadia@nmcclinic.com", idNumber: "784-1993-7897897-8", licenseNumber: "DHA-77614", clinic: "NMC Clinic", roomNumber: "203", whatsapp: "+971 509988776", picture: "https://randomuser.me/api/portraits/women/30.jpg" },
  { id: 9, name: "Dr. Saeed Al Blooshi", department: "Orthopedics", qualification: "MBBS, FRCS", mobile: "+971 554455667", email: "saeed@valiantclinic.com", idNumber: "784-1983-4564564-9", licenseNumber: "DHA-88725", clinic: "Valiant Clinic", roomNumber: "310", whatsapp: "+971 554455667", picture: "https://randomuser.me/api/portraits/men/60.jpg" },
  { id: 10, name: "Dr. Reem Al Zaabi", department: "Dermatology", qualification: "MBBS, DDV", mobile: "+971 502233445", email: "reem@alnoorclinic.com", idNumber: "784-1990-6546546-10", licenseNumber: "DHA-99836", clinic: "Al Noor Clinic", roomNumber: "207", whatsapp: "+971 502233445", picture: "https://randomuser.me/api/portraits/women/50.jpg" },
];

const departmentColors: Record<string, string> = {
  Cardiology: "bg-red-100 text-red-600",
  Pediatrics: "bg-blue-100 text-blue-600",
  Orthopedics: "bg-orange-100 text-orange-600",
  Neurology: "bg-purple-100 text-purple-600",
  Dermatology: "bg-pink-100 text-pink-600",
  Gynecology: "bg-rose-100 text-rose-600",
  default: "bg-green-100 text-green-600",
};
const getDeptColor = (dept: string) => departmentColors[dept] || departmentColors.default;

const ALL_CLINICS = Array.from(new Set(sampleDoctors.map((d) => d.clinic))).sort();

// ── Searchable Clinic Dropdown ──────────────────────────────────────────────
function ClinicDropdown({
  selected,
  onSelect,
  doctorCounts,
}: {
  selected: string;
  onSelect: (clinic: string) => void;
  doctorCounts: Record<string, number>;
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const ref = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Focus input when opens
  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 50);
    else setQuery("");
  }, [open]);

  const filtered = ALL_CLINICS.filter((c) =>
    c.toLowerCase().includes(query.toLowerCase())
  );

  const totalCount = Object.values(doctorCounts).reduce((a, b) => a + b, 0);
  const displayLabel = selected === "All" ? "All Clinics" : selected;

  return (
    <div ref={ref} style={{ position: "relative", userSelect: "none" }}>
      {/* Trigger button */}
      <button
        onClick={() => setOpen((v) => !v)}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          padding: "8px 14px",
          background: "white",
          border: "1.5px solid #e5e7eb",
          borderRadius: 10,
          fontSize: 13,
          fontWeight: 600,
          color: "#374151",
          cursor: "pointer",
          minWidth: 220,
          justifyContent: "space-between",
          boxShadow: open ? "0 0 0 3px #e0e7ff" : "0 1px 2px rgba(0,0,0,0.05)",
          borderColor: open ? "#6366f1" : "#e5e7eb",
          transition: "all 0.15s",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          {/* Clinic icon */}
          <div style={{ width: 22, height: 22, borderRadius: 6, background: "#eef2ff", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="#6366f1" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
          <span style={{ color: selected === "All" ? "#6b7280" : "#111827" }}>{displayLabel}</span>
          {selected !== "All" && (
            <span style={{ background: "#6366f1", color: "white", borderRadius: 999, padding: "1px 7px", fontSize: 11, fontWeight: 700 }}>
              {doctorCounts[selected] ?? 0}
            </span>
          )}
          {selected === "All" && (
            <span style={{ background: "#6b7280", color: "white", borderRadius: 999, padding: "1px 7px", fontSize: 11, fontWeight: 700 }}>
              {totalCount}
            </span>
          )}
        </div>
        {/* Chevron */}
        <svg
          width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="#9ca3af" strokeWidth={2}
          style={{ transform: open ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s", flexShrink: 0 }}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Dropdown panel */}
      {open && (
        <div style={{
          position: "absolute",
          top: "calc(100% + 6px)",
          left: 0,
          zIndex: 100,
          background: "white",
          border: "1px solid #e5e7eb",
          borderRadius: 12,
          boxShadow: "0 10px 40px rgba(0,0,0,0.12)",
          width: 280,
          overflow: "hidden",
        }}>
          {/* Search inside dropdown */}
          <div style={{ padding: "10px 10px 8px", borderBottom: "1px solid #f3f4f6" }}>
            <div style={{ position: "relative" }}>
              <svg style={{ position: "absolute", left: 9, top: "50%", transform: "translateY(-50%)" }} width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="#9ca3af" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                ref={inputRef}
                type="text"
                placeholder="Search clinic..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                style={{
                  width: "100%",
                  paddingLeft: 28,
                  paddingRight: 10,
                  paddingTop: 7,
                  paddingBottom: 7,
                  border: "1px solid #e5e7eb",
                  borderRadius: 8,
                  fontSize: 12,
                  color: "#374151",
                  outline: "none",
                  background: "#f9fafb",
                  boxSizing: "border-box",
                }}
              />
            </div>
          </div>

          {/* Options list */}
          <div style={{ maxHeight: 240, overflowY: "auto" }}>
            {/* All option */}
            <button
              onClick={() => { onSelect("All"); setOpen(false); }}
              style={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "9px 14px",
                background: selected === "All" ? "#eef2ff" : "white",
                border: "none",
                cursor: "pointer",
                fontSize: 13,
                fontWeight: selected === "All" ? 700 : 500,
                color: selected === "All" ? "#4f46e5" : "#374151",
                borderBottom: "1px solid #f9fafb",
                textAlign: "left",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                {selected === "All" && (
                  <svg width="12" height="12" fill="#4f46e5" viewBox="0 0 24 24"><path d="M20.285 6.709l-11.285 11.291-5.285-5.291 1.414-1.414 3.871 3.877 9.871-9.877z" /></svg>
                )}
                {selected !== "All" && <span style={{ width: 12 }} />}
                All Clinics
              </div>
              <span style={{ background: "#6b7280", color: "white", borderRadius: 999, padding: "1px 8px", fontSize: 11, fontWeight: 700 }}>
                {totalCount}
              </span>
            </button>

            {filtered.length === 0 ? (
              <div style={{ padding: "20px", textAlign: "center", color: "#9ca3af", fontSize: 12 }}>No clinics found</div>
            ) : (
              filtered.map((clinic) => {
                const isSelected = selected === clinic;
                return (
                  <button
                    key={clinic}
                    onClick={() => { onSelect(clinic); setOpen(false); }}
                    style={{
                      width: "100%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: "9px 14px",
                      background: isSelected ? "#eef2ff" : "white",
                      border: "none",
                      cursor: "pointer",
                      fontSize: 13,
                      fontWeight: isSelected ? 700 : 400,
                      color: isSelected ? "#4f46e5" : "#374151",
                      borderBottom: "1px solid #f9fafb",
                      textAlign: "left",
                      transition: "background 0.1s",
                    }}
                    onMouseEnter={(e) => { if (!isSelected) e.currentTarget.style.background = "#f5f3ff"; }}
                    onMouseLeave={(e) => { if (!isSelected) e.currentTarget.style.background = "white"; }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      {isSelected ? (
                        <svg width="12" height="12" fill="#4f46e5" viewBox="0 0 24 24"><path d="M20.285 6.709l-11.285 11.291-5.285-5.291 1.414-1.414 3.871 3.877 9.871-9.877z" /></svg>
                      ) : (
                        <span style={{ width: 12 }} />
                      )}
                      {clinic}
                    </div>
                    <span style={{
                      background: isSelected ? "#6366f1" : "#e5e7eb",
                      color: isSelected ? "white" : "#6b7280",
                      borderRadius: 999,
                      padding: "1px 8px",
                      fontSize: 11,
                      fontWeight: 700,
                    }}>
                      {doctorCounts[clinic] ?? 0}
                    </span>
                  </button>
                );
              })
            )}
          </div>

          {/* Clear footer */}
          {selected !== "All" && (
            <div style={{ padding: "8px 14px", borderTop: "1px solid #f3f4f6" }}>
              <button
                onClick={() => { onSelect("All"); setOpen(false); }}
                style={{ fontSize: 12, color: "#6366f1", background: "none", border: "none", cursor: "pointer", fontWeight: 600, padding: 0 }}
              >
                ✕ Clear filter
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ── Avatar ───────────────────────────────────────────────────────────────────
const Avatar = ({ name, picture }: { name: string; picture: string | null }) => {
  const [imgError, setImgError] = useState(false);
  const initials = name.replace("Dr. ", "").split(" ").map((n) => n[0]).slice(0, 2).join("");
  if (picture && !imgError) {
    return <img src={picture} alt={name} onError={() => setImgError(true)} style={{ width: 32, height: 32, borderRadius: "50%", objectFit: "cover", flexShrink: 0, border: "2px solid white", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }} />;
  }
  return <div style={{ width: 32, height: 32, borderRadius: "50%", background: "#e0e7ff", color: "#4f46e5", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, flexShrink: 0 }}>{initials}</div>;
};

const ModalAvatar = ({ name, picture }: { name: string; picture: string | null }) => {
  const [imgError, setImgError] = useState(false);
  const initials = name.replace("Dr. ", "").split(" ").map((n) => n[0]).slice(0, 2).join("");
  if (picture && !imgError) {
    return <img src={picture} alt={name} onError={() => setImgError(true)} style={{ width: 56, height: 56, borderRadius: 12, objectFit: "cover", flexShrink: 0, border: "2px solid rgba(255,255,255,0.4)" }} />;
  }
  return <div style={{ width: 56, height: 56, borderRadius: 12, background: "rgba(255,255,255,0.2)", color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, fontWeight: 700, flexShrink: 0 }}>{initials}</div>;
};

// ── Main Component ────────────────────────────────────────────────────────────
export default function DoctorList() {
  const [doctors, setDoctors] = useState<Doctor[]>(sampleDoctors);
  const [search, setSearch] = useState("");
  const [selectedClinic, setSelectedClinic] = useState("All");
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);
  const [viewDoctor, setViewDoctor] = useState<Doctor | null>(null);

  const doctorCounts = ALL_CLINICS.reduce((acc, clinic) => {
    acc[clinic] = doctors.filter((d) => d.clinic === clinic).length;
    return acc;
  }, {} as Record<string, number>);

  const filtered = doctors.filter((d) => {
    const matchSearch =
      d.name.toLowerCase().includes(search.toLowerCase()) ||
      d.department.toLowerCase().includes(search.toLowerCase()) ||
      d.email.toLowerCase().includes(search.toLowerCase());
    const matchClinic = selectedClinic === "All" || d.clinic === selectedClinic;
    return matchSearch && matchClinic;
  });

  const handleDelete = (id: number) => {
    setDoctors((prev) => prev.filter((d) => d.id !== id));
    setDeleteConfirm(null);
  };

  return (
    <div style={{ width: "100%", minHeight: "100vh", background: "#f8fafc", boxSizing: "border-box", overflowX: "hidden" }}>
      <div style={{ padding: "20px", maxWidth: "100%", boxSizing: "border-box" }}>

        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
          <h1 style={{ fontSize: 20, fontWeight: 700, color: "#111827", margin: 0 }}>Doctor List</h1>
          <button style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 16px", background: "#4f46e5", color: "white", border: "none", borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: "pointer", whiteSpace: "nowrap" }}>
            <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
            Add Doctor
          </button>
        </div>

        {/* ✅ Filters Row: Clinic Dropdown + Search */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16, flexWrap: "wrap" }}>
          <ClinicDropdown
            selected={selectedClinic}
            onSelect={setSelectedClinic}
            doctorCounts={doctorCounts}
          />

          {/* Doctor name search */}
          <div style={{ position: "relative" }}>
            <svg style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)" }} width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="#9ca3af" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search doctor, department..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ paddingLeft: 30, paddingRight: 12, paddingTop: 8, paddingBottom: 8, border: "1.5px solid #e5e7eb", borderRadius: 10, fontSize: 13, color: "#374151", outline: "none", background: "white", width: 230, boxSizing: "border-box" }}
            />
          </div>

          {/* Active filter badge */}
          {selectedClinic !== "All" && (
            <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "5px 12px", background: "#eef2ff", borderRadius: 999, border: "1px solid #c7d2fe" }}>
              <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="#6366f1" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5" />
              </svg>
              <span style={{ fontSize: 12, color: "#4f46e5", fontWeight: 600 }}>{selectedClinic}</span>
              <button
                onClick={() => setSelectedClinic("All")}
                style={{ background: "none", border: "none", cursor: "pointer", color: "#6366f1", fontSize: 14, lineHeight: 1, padding: 0, display: "flex" }}
              >✕</button>
            </div>
          )}
        </div>

        {/* Table */}
        <div style={{ background: "white", borderRadius: 16, border: "1px solid #f3f4f6", boxShadow: "0 1px 3px rgba(0,0,0,0.06)", width: "100%", overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", tableLayout: "auto" }}>
            <thead>
              <tr style={{ background: "#f9fafb", borderBottom: "1px solid #f3f4f6" }}>
                {["Actions", "Clinic", "Name", "Department", "Qualification", "Mobile", "Email", "License No."].map((h) => (
                  <th key={h} style={{ padding: "10px 12px", textAlign: "left", fontSize: 11, fontWeight: 700, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.04em", whiteSpace: "nowrap" }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} style={{ padding: 40, textAlign: "center", color: "#9ca3af", fontSize: 13 }}>
                    No doctors found{selectedClinic !== "All" ? ` in ${selectedClinic}` : ""}.
                  </td>
                </tr>
              ) : (
                filtered.map((doctor, idx) => (
                  <tr
                    key={doctor.id}
                    style={{ borderBottom: "1px solid #f3f4f6", background: idx % 2 === 1 ? "#fafafa" : "white", transition: "background 0.15s" }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = "#eef2ff")}
                    onMouseLeave={(e) => (e.currentTarget.style.background = idx % 2 === 1 ? "#fafafa" : "white")}
                  >
                    {/* Actions */}
                    <td style={{ padding: "10px 12px", whiteSpace: "nowrap" }}>
                      <div style={{ display: "flex", gap: 4 }}>
                        <button onClick={() => setViewDoctor(doctor)} title="View" style={{ width: 28, height: 28, borderRadius: 7, background: "#22c55e", border: "none", color: "white", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
                          <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                        </button>
                        <button title="Edit" style={{ width: 28, height: 28, borderRadius: 7, background: "#3b82f6", border: "none", color: "white", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
                          <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                        </button>
                        <button onClick={() => setDeleteConfirm(doctor.id)} title="Delete" style={{ width: 28, height: 28, borderRadius: 7, background: "#ef4444", border: "none", color: "white", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
                          <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                        </button>
                      </div>
                    </td>
                    <td style={{ padding: "10px 12px", fontSize: 13, color: "#374151", whiteSpace: "nowrap", fontWeight: 500 }}>{doctor.clinic}</td>
                    <td style={{ padding: "10px 12px", whiteSpace: "nowrap" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <Avatar name={doctor.name} picture={doctor.picture} />
                        <span style={{ fontWeight: 600, color: "#111827", fontSize: 13 }}>{doctor.name}</span>
                      </div>
                    </td>
                    <td style={{ padding: "10px 12px", whiteSpace: "nowrap" }}>
                      <span className={getDeptColor(doctor.department)} style={{ padding: "2px 10px", borderRadius: 999, fontSize: 11, fontWeight: 600, display: "inline-block" }}>
                        {doctor.department}
                      </span>
                    </td>
                    <td style={{ padding: "10px 12px", color: "#6b7280", fontSize: 13, whiteSpace: "nowrap" }}>{doctor.qualification}</td>
                    <td style={{ padding: "10px 12px", color: "#6b7280", fontSize: 13, whiteSpace: "nowrap" }}>{doctor.mobile}</td>
                    <td style={{ padding: "10px 12px", color: "#6b7280", fontSize: 13 }}>
                      <span style={{ display: "block", maxWidth: 170, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{doctor.email}</span>
                    </td>
                    <td style={{ padding: "10px 12px", color: "#6b7280", fontSize: 12, fontFamily: "monospace", whiteSpace: "nowrap" }}>{doctor.licenseNumber}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          {/* Footer */}
          <div style={{ padding: "10px 16px", borderTop: "1px solid #f3f4f6", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <p style={{ fontSize: 12, color: "#9ca3af", margin: 0 }}>
              Showing <strong style={{ color: "#374151" }}>{filtered.length}</strong> of{" "}
              <strong style={{ color: "#374151" }}>{doctors.length}</strong> doctors
              {selectedClinic !== "All" && <span style={{ color: "#6366f1", fontWeight: 600 }}> · {selectedClinic}</span>}
            </p>
          </div>
        </div>
      </div>

      {/* Delete Modal */}
      {deleteConfirm !== null && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 200, padding: 16 }}>
          <div style={{ background: "white", borderRadius: 16, padding: 24, width: "100%", maxWidth: 320, boxShadow: "0 20px 60px rgba(0,0,0,0.2)" }}>
            <div style={{ width: 48, height: 48, borderRadius: "50%", background: "#fee2e2", color: "#ef4444", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
              <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
            </div>
            <h3 style={{ textAlign: "center", fontWeight: 700, color: "#111827", margin: "0 0 6px", fontSize: 15 }}>Delete Doctor</h3>
            <p style={{ textAlign: "center", color: "#6b7280", fontSize: 13, margin: "0 0 20px" }}>Are you sure? This action cannot be undone.</p>
            <div style={{ display: "flex", gap: 10 }}>
              <button onClick={() => setDeleteConfirm(null)} style={{ flex: 1, padding: "9px 0", borderRadius: 8, border: "1px solid #e5e7eb", background: "white", fontSize: 13, fontWeight: 600, color: "#374151", cursor: "pointer" }}>Cancel</button>
              <button onClick={() => handleDelete(deleteConfirm)} style={{ flex: 1, padding: "9px 0", borderRadius: 8, border: "none", background: "#ef4444", color: "white", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>Delete</button>
            </div>
          </div>
        </div>
      )}

      {/* View Modal */}
      {viewDoctor && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 200, padding: 16 }}>
          <div style={{ background: "white", borderRadius: 16, width: "100%", maxWidth: 440, overflow: "hidden", boxShadow: "0 20px 60px rgba(0,0,0,0.2)" }}>
            <div style={{ background: "#4f46e5", padding: "18px 24px", display: "flex", alignItems: "center", gap: 16 }}>
              <ModalAvatar name={viewDoctor.name} picture={viewDoctor.picture} />
              <div style={{ minWidth: 0 }}>
                <h3 style={{ color: "white", fontWeight: 700, fontSize: 15, margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{viewDoctor.name}</h3>
                <p style={{ color: "#a5b4fc", fontSize: 13, margin: "2px 0 0" }}>{viewDoctor.department} · {viewDoctor.clinic}</p>
              </div>
              <button onClick={() => setViewDoctor(null)} style={{ marginLeft: "auto", width: 30, height: 30, borderRadius: 8, background: "rgba(255,255,255,0.15)", border: "none", color: "white", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            <div style={{ padding: "20px 24px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              {[
                { label: "Qualification", value: viewDoctor.qualification },
                { label: "License No.", value: viewDoctor.licenseNumber },
                { label: "Mobile", value: viewDoctor.mobile },
                { label: "WhatsApp", value: viewDoctor.whatsapp },
                { label: "Email", value: viewDoctor.email, full: true },
                { label: "ID Number", value: viewDoctor.idNumber, full: true },
                { label: "Room", value: viewDoctor.roomNumber },
                { label: "Clinic", value: viewDoctor.clinic },
              ].map(({ label, value, full }) => (
                <div key={label} style={full ? { gridColumn: "1 / -1" } : {}}>
                  <p style={{ fontSize: 11, color: "#9ca3af", fontWeight: 600, margin: "0 0 2px", textTransform: "uppercase", letterSpacing: "0.04em" }}>{label}</p>
                  <p style={{ fontSize: 13, color: "#111827", fontWeight: 600, margin: 0, wordBreak: "break-all" }}>{value || "—"}</p>
                </div>
              ))}
            </div>
            <div style={{ padding: "0 24px 20px" }}>
              <button onClick={() => setViewDoctor(null)} style={{ width: "100%", padding: "10px 0", borderRadius: 8, border: "1px solid #e5e7eb", background: "white", fontSize: 13, fontWeight: 600, color: "#374151", cursor: "pointer" }}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}