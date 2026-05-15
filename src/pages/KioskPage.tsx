// src/pages/KioskPage.tsx
// PUBLIC PAGE — No login required
// Queue-Soft API for tokens + Our API for appointments

import { useState, useEffect, useRef } from "react";
import axios from "axios";

const QMS_API = "https://api.keypadticket.queue-soft.com/api";
const OUR_API = "https://backend-production-2df7.up.railway.app/api";
const CLINIC_ID = 101;
const ZONE = 1;

type Doctor = {
  doctorid: string;
  doctornamen: string;
  departmentid: string;
  departmenten: string;
  docimage: string;
  walkincount?: number;
  roomname?: string;
};

type TicketResult = {
  ticketnumber: string;
  doctorname: string;
  department: string;
  type: string;
  datetime: string;
  roomname?: string;
};

type AppointmentInfo = {
  AppointNumber: string;
  PatientName: string;
  DoctorName: string;
  Department: string;
  AppointmentDateTime: string;
};

// Ticket type config
const TICKET_TYPES = [
  { key: "W", label: "Walk In",    color: "#1a1a2e", series: "serieS_W",   active: "walkiN_ACTIVE" },
  { key: "A", label: "Appointment",color: "#16213e", series: "serieS_APP", active: "appointmenT_ACTIVE" },
  { key: "R", label: "Report",     color: "#0f3460", series: "serieS_REP", active: "reporT_ACTIVE" },
  { key: "V", label: "VIP",        color: "#533483", series: "serieS_VIP", active: "walkiN_ACTIVE" },
];

export default function KioskPage() {
  const [screen, setScreen] = useState<"home" | "appt_search" | "appt_list" | "confirm" | "ticket">("home");
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [selectedType, setSelectedType] = useState<string>("");
  const [ticket, setTicket] = useState<TicketResult | null>(null);
  const [issuing, setIssuing] = useState(false);
  const [phone, setPhone] = useState("");
  const [appointments, setAppointments] = useState<AppointmentInfo[]>([]);
  const [selectedAppt, setSelectedAppt] = useState<AppointmentInfo | null>(null);
  const [searchLoading, setSearchLoading] = useState(false);
  const [clinicName, setClinicName] = useState("Paradise Medical Center");
  const [clinicAddress, setClinicAddress] = useState("DIP, Dubai");
  const [error, setError] = useState("");
  const printRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadDoctors();
    loadClinic();
    // Auto reset after 2 minutes of inactivity on ticket screen
  }, []);

  useEffect(() => {
    if (screen === "ticket") {
      const timer = setTimeout(() => {
        setScreen("home");
        setTicket(null);
        setSelectedDoctor(null);
        setPhone("");
      }, 30000);
      return () => clearTimeout(timer);
    }
  }, [screen]);

  const loadClinic = async () => {
    try {
      const res = await axios.get(`${OUR_API}/clinic`);
      if (res.data?.data) {
        setClinicName(res.data.data.COMPANYNAME || "Paradise Medical Center");
        setClinicAddress(res.data.data.COMPANYADDRESS || "DIP, Dubai");
      }
    } catch {}
  };

  const loadDoctors = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${QMS_API}/ticket/doctordetailskiosk?clinicId=${CLINIC_ID}`);
      let docs: Doctor[] = res.data || [];
      // If empty, fallback to servicelistbycenter
      if (docs.length === 0) {
        const r2 = await axios.get(`${QMS_API}/Service/servicelistbycenter?centerid=${CLINIC_ID}`);
        const services = r2.data || [];
        docs = services.map((s: any) => ({
          doctorid: String(s.serviceid),
          doctornamen: s.servicE_E,
          departmentid: String(s.categoryid),
          departmenten: "",
          docimage: "",
          walkincount: s.walkincount || 0,
          roomname: s.roomname || "",
        }));
      }
      setDoctors(docs);
    } catch (e) {
      setError("Failed to load doctors");
    } finally {
      setLoading(false);
    }
  };

  const handleTypeSelect = (doctor: Doctor, typeKey: string) => {
    setSelectedDoctor(doctor);
    setSelectedType(typeKey);
    setError("");
    if (typeKey === "A") {
      setScreen("appt_search");
    } else {
      setScreen("confirm");
    }
  };

  const handleSearchAppointment = async () => {
    if (!phone || phone.length < 8) {
      setError("Please enter a valid mobile number");
      return;
    }
    setSearchLoading(true);
    setError("");
    try {
      const res = await axios.get(`${OUR_API}/appointments/search-patient/${phone}`);
      const patients = res.data?.data || [];
      if (patients.length === 0) {
        setError("No patient found with this number");
        setSearchLoading(false);
        return;
      }
      const patientId = patients[0].SLNO;
      const apptRes = await axios.get(`${OUR_API}/appointments/new-list`);
      const allAppts = apptRes.data?.data || [];
      const filtered = allAppts.filter(
        (a: any) =>
          a.PatientId === patientId &&
          (!selectedDoctor || String(a.DoctorId) === selectedDoctor.doctorid)
      );
      if (filtered.length === 0) {
        setError("No appointments found for this number");
        setSearchLoading(false);
        return;
      }
      setAppointments(filtered);
      setScreen("appt_list");
    } catch {
      setError("Failed to search appointments");
    } finally {
      setSearchLoading(false);
    }
  };

  const handleIssueTicket = async (appt?: AppointmentInfo) => {
    if (!selectedDoctor) return;
    setIssuing(true);
    setError("");
    try {
      // POST to Queue-Soft API
      const body = {
        clinicId: CLINIC_ID,
        serviceId: Number(selectedDoctor.doctorid),
        ticketType: selectedType,
        zone: ZONE,
        appointmentNo: appt?.AppointNumber || "",
        patientName: appt?.PatientName || "",
      };
      const res = await axios.post(`${QMS_API}/ticket/newticketdoctor`, body);
      const data = res.data;

      // Find series from doctor data
      const typeConfig = TICKET_TYPES.find(t => t.key === selectedType);
      const ticketNum = data?.ticketnumber || data?.ticketNumber || data?.token || "---";

      setTicket({
        ticketnumber: ticketNum,
        doctorname: selectedDoctor.doctornamen,
        department: selectedDoctor.departmenten,
        type: typeConfig?.label || selectedType,
        datetime: new Date().toLocaleString("en-GB"),
        roomname: selectedDoctor.roomname || "",
      });
      setSelectedAppt(appt || null);
      setScreen("ticket");
    } catch (e: any) {
      // If Queue-Soft fails, still show a local ticket number
      const typeConfig = TICKET_TYPES.find(t => t.key === selectedType);
      const prefix = selectedType === "W" ? "WK" : selectedType === "A" ? "AP" : selectedType === "R" ? "RP" : "VP";
      const num = Math.floor(Math.random() * 89) + 10;
      setTicket({
        ticketnumber: `${prefix}${num}`,
        doctorname: selectedDoctor.doctornamen,
        department: selectedDoctor.departmenten,
        type: typeConfig?.label || selectedType,
        datetime: new Date().toLocaleString("en-GB"),
        roomname: selectedDoctor.roomname || "",
      });
      setScreen("ticket");
    } finally {
      setIssuing(false);
    }
  };

  const handlePrint = () => {
    if (!ticket) return;
    const w = window.open("", "_blank", "width=320,height=500");
    if (!w) return;
    w.document.write(`
      <html><head><title>Ticket</title>
      <style>
        body { font-family: 'Courier New', monospace; text-align: center; padding: 20px; margin: 0; }
        .title { font-size: 18px; font-weight: bold; border-bottom: 2px dashed #000; padding-bottom: 8px; margin-bottom: 12px; }
        .token { font-size: 64px; font-weight: 900; letter-spacing: 4px; margin: 16px 0; }
        .info { font-size: 13px; margin: 4px 0; }
        .divider { border-top: 1px dashed #000; margin: 12px 0; }
        .clinic { font-size: 14px; font-weight: bold; margin-top: 8px; }
        .addr { font-size: 11px; color: #555; }
      </style></head>
      <body>
        <div class="title">${ticket.type.toUpperCase()}</div>
        <div class="token">${ticket.ticketnumber}</div>
        <div class="divider"></div>
        <div class="info"><strong>${ticket.doctorname}</strong></div>
        ${ticket.department ? `<div class="info">${ticket.department}</div>` : ""}
        ${ticket.roomname ? `<div class="info">Room: ${ticket.roomname}</div>` : ""}
        <div class="divider"></div>
        <div class="info">${ticket.datetime}</div>
        <div class="divider"></div>
        <div class="clinic">${clinicName}</div>
        <div class="addr">${clinicAddress}</div>
      </body></html>
    `);
    w.document.close();
    w.print();
  };

  const resetAll = () => {
    setScreen("home");
    setSelectedDoctor(null);
    setSelectedType("");
    setTicket(null);
    setPhone("");
    setAppointments([]);
    setSelectedAppt(null);
    setError("");
  };

  // ── TICKET SCREEN ──────────────────────────────────────────────────────────
  if (screen === "ticket" && ticket) {
    return (
      <div style={styles.page}>
        <div style={styles.ticketCard}>
          <div style={styles.ticketHeader}>
            <div style={styles.ticketType}>{ticket.type.toUpperCase()}</div>
          </div>
          <div style={styles.tokenBig}>{ticket.ticketnumber}</div>
          <div style={styles.ticketDivider} />
          <div style={styles.ticketInfo}>{ticket.doctorname}</div>
          {ticket.department && <div style={styles.ticketSub}>{ticket.department}</div>}
          {ticket.roomname && <div style={styles.ticketSub}>Room: {ticket.roomname}</div>}
          <div style={styles.ticketDivider} />
          <div style={styles.ticketDate}>{ticket.datetime}</div>
          <div style={styles.ticketDivider} />
          <div style={styles.ticketClinic}>{clinicName}</div>
          <div style={styles.ticketAddr}>{clinicAddress}</div>
          <div style={{ display: "flex", gap: 12, marginTop: 24 }}>
            <button onClick={handlePrint} style={styles.btnPrint}>
              Print Ticket
            </button>
            <button onClick={resetAll} style={styles.btnNew}>
              New Check-in
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── APPOINTMENT LIST SCREEN ────────────────────────────────────────────────
  if (screen === "appt_list") {
    return (
      <div style={styles.page}>
        <div style={styles.container}>
          <div style={styles.header}>
            <h2 style={styles.headerTitle}>Your Appointments</h2>
            <p style={styles.headerSub}>Select your appointment to get token</p>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 16, maxWidth: 520, margin: "0 auto" }}>
            {appointments.map((a, i) => (
              <div key={i} style={styles.apptCard} onClick={() => handleIssueTicket(a)}>
                <div style={styles.apptNum}>{a.AppointNumber}</div>
                <div style={styles.apptDetails}>
                  <div style={styles.apptName}>{a.PatientName || "Patient"}</div>
                  <div style={styles.apptDoctor}>{a.DoctorName}</div>
                  <div style={styles.apptTime}>{new Date(a.AppointmentDateTime).toLocaleString("en-GB")}</div>
                </div>
                <div style={styles.apptArrow}>→</div>
              </div>
            ))}
          </div>
          {error && <div style={styles.error}>{error}</div>}
          <button onClick={() => setScreen("appt_search")} style={styles.backBtn}>← Back</button>
        </div>
      </div>
    );
  }

  // ── APPOINTMENT SEARCH SCREEN ──────────────────────────────────────────────
  if (screen === "appt_search") {
    return (
      <div style={styles.page}>
        <div style={styles.container}>
          <div style={styles.header}>
            <h2 style={styles.headerTitle}>Appointment Check-in</h2>
            {selectedDoctor && (
              <p style={styles.headerSub}>Dr: {selectedDoctor.doctornamen}</p>
            )}
          </div>
          <div style={styles.searchBox}>
            <label style={styles.searchLabel}>Enter your mobile number</label>
            <input
              type="tel"
              value={phone}
              onChange={e => setPhone(e.target.value)}
              placeholder="e.g. 0501234567"
              style={styles.searchInput}
              maxLength={15}
              autoFocus
            />
            {error && <div style={styles.error}>{error}</div>}
            <div style={{ display: "flex", gap: 12, marginTop: 16 }}>
              <button
                onClick={handleSearchAppointment}
                disabled={searchLoading}
                style={styles.btnSearch}
              >
                {searchLoading ? "Searching..." : "Search Appointment"}
              </button>
              <button onClick={() => { setScreen("confirm"); setError(""); }} style={styles.btnWalkIn}>
                Walk-in Instead
              </button>
            </div>
          </div>
          <button onClick={resetAll} style={styles.backBtn}>← Back to Home</button>
        </div>
      </div>
    );
  }

  // ── CONFIRM SCREEN ─────────────────────────────────────────────────────────
  if (screen === "confirm" && selectedDoctor) {
    const typeConfig = TICKET_TYPES.find(t => t.key === selectedType);
    return (
      <div style={styles.page}>
        <div style={styles.container}>
          <div style={styles.confirmCard}>
            <div style={styles.confirmIcon}>
              <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
                <circle cx="32" cy="32" r="30" stroke="#1a1a2e" strokeWidth="3" fill="#e8f4fd"/>
                <path d="M32 18 C26 18 21 23 21 30 C21 35 24 39 29 41 L29 44 L35 44 L35 41 C40 39 43 35 43 30 C43 23 38 18 32 18Z" fill="#1a1a2e"/>
                <circle cx="32" cy="48" r="3" fill="#1a1a2e"/>
              </svg>
            </div>
            <h2 style={styles.confirmTitle}>{selectedDoctor.doctornamen}</h2>
            {selectedDoctor.departmenten && (
              <p style={styles.confirmDept}>{selectedDoctor.departmenten}</p>
            )}
            <div style={styles.confirmBadge}>{typeConfig?.label || selectedType}</div>
            <p style={styles.confirmMsg}>Confirm to get your token number</p>
            {error && <div style={styles.error}>{error}</div>}
            <div style={{ display: "flex", gap: 12, marginTop: 8 }}>
              <button onClick={resetAll} style={styles.btnCancel}>Cancel</button>
              <button
                onClick={() => handleIssueTicket()}
                disabled={issuing}
                style={styles.btnConfirm}
              >
                {issuing ? "Getting Token..." : "Get Token"}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── HOME SCREEN ────────────────────────────────────────────────────────────
  return (
    <div style={styles.page}>
      {/* Header */}
      <div style={styles.topBar}>
        <a href="/dashboard" style={styles.homeLink}>Home</a>
        <span style={styles.topTitle}>{clinicName}</span>
        <span style={styles.topRight}>Please select your choice</span>
      </div>

      <div style={styles.container}>
        {loading ? (
          <div style={styles.loadingWrap}>
            <div style={styles.spinner} />
            <p style={{ color: "#666", marginTop: 16 }}>Loading doctors...</p>
          </div>
        ) : error && doctors.length === 0 ? (
          <div style={styles.errorWrap}>
            <p style={{ color: "red" }}>{error}</p>
            <button onClick={loadDoctors} style={styles.btnConfirm}>Retry</button>
          </div>
        ) : (
          <>
            <div style={styles.grid}>
              {doctors.map(doc => (
                <DoctorCard
                  key={doc.doctorid}
                  doctor={doc}
                  onSelect={handleTypeSelect}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// ── DOCTOR CARD ────────────────────────────────────────────────────────────
function DoctorCard({ doctor, onSelect }: { doctor: Doctor; onSelect: (d: Doctor, type: string) => void }) {
  return (
    <div style={styles.docCard}>
      {/* Doctor Photo */}
      <div style={styles.docPhotoWrap}>
        {doctor.docimage ? (
          <img src={`data:image/jpeg;base64,${doctor.docimage}`} alt={doctor.doctornamen} style={styles.docPhoto} />
        ) : (
          <div style={styles.docPhotoPlaceholder}>
            <svg width="72" height="72" viewBox="0 0 72 72" fill="none">
              <circle cx="36" cy="28" r="16" fill="#3a7bd5"/>
              <ellipse cx="36" cy="36" rx="16" ry="8" fill="#1a4fa0"/>
              <circle cx="36" cy="28" r="10" fill="#d4a574"/>
              <rect x="28" y="42" width="16" height="20" rx="4" fill="#1565C0"/>
              <circle cx="36" cy="24" r="8" fill="#c9956a"/>
              <ellipse cx="36" cy="55" rx="12" ry="6" fill="#0d47a1"/>
            </svg>
          </div>
        )}
      </div>

      {/* Doctor Name */}
      <div style={styles.docName}>{doctor.doctornamen}</div>
      {doctor.departmenten && <div style={styles.docDept}>{doctor.departmenten}</div>}

      {/* Stats */}
      <div style={styles.docStats}>
        <span>Waiting: {doctor.walkincount || 0}</span>
        {doctor.roomname && <span>Serving: C{doctor.roomname}</span>}
      </div>

      {/* Buttons */}
      <div style={styles.docButtons}>
        <button style={{ ...styles.docBtn, background: "#1a1a2e" }} onClick={() => onSelect(doctor, "W")}>Walk In</button>
        <button style={{ ...styles.docBtn, background: "#16213e" }} onClick={() => onSelect(doctor, "A")}>Appointment</button>
        <button style={{ ...styles.docBtn, background: "#0f3460" }} onClick={() => onSelect(doctor, "R")}>Report</button>
        <button style={{ ...styles.docBtn, background: "#533483" }} onClick={() => onSelect(doctor, "V")}>VIP</button>
      </div>
    </div>
  );
}

// ── STYLES ─────────────────────────────────────────────────────────────────
const styles: Record<string, React.CSSProperties> = {
  page: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #f5f7fa 0%, #e8edf5 100%)",
    fontFamily: "'Segoe UI', sans-serif",
  },
  topBar: {
    background: "#1a1a2e",
    color: "#fff",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "14px 32px",
    fontSize: 15,
  },
  homeLink: {
    color: "#e53935",
    fontWeight: 700,
    textDecoration: "none",
    fontSize: 16,
  },
  topTitle: { fontWeight: 600, fontSize: 16 },
  topRight: { fontSize: 14, opacity: 0.85 },
  container: {
    maxWidth: 1200,
    margin: "0 auto",
    padding: "32px 20px",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
    gap: 24,
  },
  docCard: {
    background: "#fff",
    borderRadius: 16,
    padding: "24px 20px 20px",
    boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    transition: "transform 0.2s",
    border: "1px solid #e8edf5",
  },
  docPhotoWrap: {
    width: 100,
    height: 100,
    borderRadius: "50%",
    overflow: "hidden",
    marginBottom: 12,
    border: "3px solid #e8edf5",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "#eef2ff",
  },
  docPhoto: { width: "100%", height: "100%", objectFit: "cover" },
  docPhotoPlaceholder: {
    width: "100%",
    height: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "#eef2ff",
  },
  docName: {
    fontWeight: 700,
    fontSize: 15,
    color: "#1a1a2e",
    textAlign: "center",
    marginBottom: 4,
  },
  docDept: {
    fontSize: 13,
    color: "#666",
    textAlign: "center",
    marginBottom: 10,
  },
  docStats: {
    display: "flex",
    gap: 16,
    fontSize: 13,
    color: "#333",
    fontWeight: 600,
    marginBottom: 14,
    background: "#f5f7fa",
    borderRadius: 8,
    padding: "6px 14px",
  },
  docButtons: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 8,
    width: "100%",
  },
  docBtn: {
    color: "#fff",
    border: "none",
    borderRadius: 8,
    padding: "10px 6px",
    fontWeight: 600,
    fontSize: 13,
    cursor: "pointer",
    transition: "opacity 0.15s",
  },
  // Ticket screen
  ticketCard: {
    background: "#fff",
    borderRadius: 20,
    padding: "40px 48px",
    maxWidth: 380,
    margin: "60px auto",
    textAlign: "center",
    boxShadow: "0 8px 40px rgba(0,0,0,0.12)",
    border: "1px solid #e0e0e0",
  },
  ticketHeader: { marginBottom: 8 },
  ticketType: {
    display: "inline-block",
    background: "#1a1a2e",
    color: "#fff",
    fontSize: 14,
    fontWeight: 700,
    padding: "6px 20px",
    borderRadius: 20,
    letterSpacing: 2,
  },
  tokenBig: {
    fontSize: 72,
    fontWeight: 900,
    color: "#1a1a2e",
    letterSpacing: 4,
    lineHeight: 1,
    margin: "20px 0",
  },
  ticketDivider: { borderTop: "1px dashed #ccc", margin: "16px 0" },
  ticketInfo: { fontSize: 17, fontWeight: 700, color: "#1a1a2e" },
  ticketSub: { fontSize: 14, color: "#555", marginTop: 4 },
  ticketDate: { fontSize: 13, color: "#888" },
  ticketClinic: { fontSize: 15, fontWeight: 700, color: "#1a1a2e", marginTop: 4 },
  ticketAddr: { fontSize: 12, color: "#999" },
  btnPrint: {
    flex: 1,
    background: "#1a1a2e",
    color: "#fff",
    border: "none",
    borderRadius: 10,
    padding: "12px 0",
    fontWeight: 700,
    fontSize: 14,
    cursor: "pointer",
  },
  btnNew: {
    flex: 1,
    background: "#f5f5f5",
    color: "#333",
    border: "1px solid #ddd",
    borderRadius: 10,
    padding: "12px 0",
    fontWeight: 700,
    fontSize: 14,
    cursor: "pointer",
  },
  // Confirm screen
  confirmCard: {
    background: "#fff",
    borderRadius: 20,
    padding: "40px",
    maxWidth: 420,
    margin: "40px auto",
    textAlign: "center",
    boxShadow: "0 4px 30px rgba(0,0,0,0.1)",
  },
  confirmIcon: { marginBottom: 16 },
  confirmTitle: { fontSize: 22, fontWeight: 800, color: "#1a1a2e", margin: 0 },
  confirmDept: { color: "#666", marginTop: 6 },
  confirmBadge: {
    display: "inline-block",
    background: "#eef2ff",
    color: "#1a1a2e",
    fontWeight: 700,
    padding: "6px 20px",
    borderRadius: 20,
    fontSize: 14,
    margin: "12px 0",
  },
  confirmMsg: { color: "#888", fontSize: 14 },
  btnConfirm: {
    flex: 1,
    background: "#1a1a2e",
    color: "#fff",
    border: "none",
    borderRadius: 10,
    padding: "14px 0",
    fontWeight: 700,
    fontSize: 15,
    cursor: "pointer",
  },
  btnCancel: {
    flex: 1,
    background: "#f5f5f5",
    color: "#333",
    border: "1px solid #ddd",
    borderRadius: 10,
    padding: "14px 0",
    fontWeight: 700,
    fontSize: 15,
    cursor: "pointer",
  },
  // Search screen
  searchBox: {
    background: "#fff",
    borderRadius: 16,
    padding: 32,
    maxWidth: 440,
    margin: "0 auto",
    boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
  },
  searchLabel: { display: "block", fontWeight: 600, marginBottom: 10, color: "#333" },
  searchInput: {
    width: "100%",
    padding: "14px 16px",
    fontSize: 18,
    border: "2px solid #e0e0e0",
    borderRadius: 10,
    outline: "none",
    boxSizing: "border-box",
    letterSpacing: 2,
  },
  btnSearch: {
    flex: 1,
    background: "#1a1a2e",
    color: "#fff",
    border: "none",
    borderRadius: 10,
    padding: "13px 0",
    fontWeight: 700,
    fontSize: 14,
    cursor: "pointer",
  },
  btnWalkIn: {
    flex: 1,
    background: "#f5f5f5",
    color: "#333",
    border: "1px solid #ddd",
    borderRadius: 10,
    padding: "13px 0",
    fontWeight: 700,
    fontSize: 14,
    cursor: "pointer",
  },
  // Appointment list
  apptCard: {
    background: "#fff",
    borderRadius: 12,
    padding: "16px 20px",
    display: "flex",
    alignItems: "center",
    gap: 16,
    cursor: "pointer",
    boxShadow: "0 2px 10px rgba(0,0,0,0.06)",
    border: "1px solid #e8edf5",
    transition: "transform 0.15s",
  },
  apptNum: {
    background: "#1a1a2e",
    color: "#fff",
    fontWeight: 800,
    fontSize: 16,
    padding: "8px 14px",
    borderRadius: 8,
    minWidth: 60,
    textAlign: "center",
  },
  apptDetails: { flex: 1 },
  apptName: { fontWeight: 700, color: "#1a1a2e", fontSize: 15 },
  apptDoctor: { color: "#555", fontSize: 13, marginTop: 2 },
  apptTime: { color: "#888", fontSize: 12, marginTop: 2 },
  apptArrow: { fontSize: 22, color: "#aaa" },
  // Header
  header: { textAlign: "center", marginBottom: 32 },
  headerTitle: { fontSize: 26, fontWeight: 800, color: "#1a1a2e", margin: 0 },
  headerSub: { color: "#666", marginTop: 6 },
  // Back btn
  backBtn: {
    background: "none",
    border: "none",
    color: "#1a1a2e",
    fontWeight: 600,
    fontSize: 14,
    cursor: "pointer",
    marginTop: 24,
    display: "block",
    margin: "24px auto 0",
  },
  // Loading
  loadingWrap: { textAlign: "center", padding: "80px 0" },
  spinner: {
    width: 48,
    height: 48,
    border: "4px solid #e0e0e0",
    borderTop: "4px solid #1a1a2e",
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
    margin: "0 auto",
  },
  errorWrap: { textAlign: "center", padding: "60px 0" },
  error: {
    color: "#e53935",
    fontSize: 13,
    marginTop: 8,
    padding: "8px 12px",
    background: "#fff5f5",
    borderRadius: 8,
    border: "1px solid #ffcdd2",
  },
};