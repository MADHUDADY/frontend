// src/pages/KioskPage.tsx
// ── PUBLIC PAGE — No login required ──────────────────────────────────────────
// Access: /kiosk  (direct URL, no JWT needed)
// Patient self check-in: Walk-in OR Appointment confirmation

import { useState, useRef, useEffect } from "react";
import axios from "axios";

const API = "https://backend-production-2df7.up.railway.app/api";

// No auth headers — public page
function genTicket(series: string, num: number) {
  return `${(series || "WK").substring(0, 2).toUpperCase()}${num}`;
}

type Screen =
  | "home"
  | "walkin_phone"
  | "walkin_dept"
  | "walkin_confirm"
  | "appt_phone"
  | "appt_list"
  | "appt_confirm"
  | "token_issued";

export default function KioskPage() {
  const [screen,      setScreen]      = useState<Screen>("home");
  const [phone,       setPhone]       = useState("");
  const [phoneErr,    setPhoneErr]    = useState("");
  const [loading,     setLoading]     = useState(false);
  const [patient,     setPatient]     = useState<any>(null);
  const [categories,  setCategories]  = useState<any[]>([]);
  const [doctors,     setDoctors]     = useState<any[]>([]);
  const [selCat,      setSelCat]      = useState<any>(null);
  const [selDoc,      setSelDoc]      = useState<any>(null);
  const [loadingDoc,  setLoadingDoc]  = useState(false);
  const [appointments,setAppointments]= useState<any[]>([]);
  const [selAppt,     setSelAppt]     = useState<any>(null);
  const [tokenNumber, setTokenNumber] = useState("");
  const [tokenInfo,   setTokenInfo]   = useState<any>(null);
  const phoneRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (screen === "walkin_phone" || screen === "appt_phone") {
      setTimeout(() => phoneRef.current?.focus(), 100);
    }
  }, [screen]);

  // Load categories
  useEffect(() => {
    if (screen === "walkin_dept" && categories.length === 0) {
      axios.get(`${API}/categories/byclinic/101`)
        .then(r => setCategories(r.data.data || []))
        .catch(() => {});
    }
  }, [screen]);

  const handleCatSelect = async (cat: any) => {
    setSelCat(cat); setSelDoc(null); setDoctors([]);
    try {
      setLoadingDoc(true);
      const r = await axios.get(`${API}/doctors/byclinic/101/category/${cat.CATEGORYID}`);
      setDoctors(r.data.data || []);
    } catch { } finally { setLoadingDoc(false); }
  };

  const validatePhone = (p: string) => {
    if (p.length !== 10) { setPhoneErr("Please enter a valid 10-digit mobile number"); return false; }
    setPhoneErr(""); return true;
  };

  // ── Walk-in: phone search ────────────────────────────────────────────────
  const handleWalkinPhone = async () => {
    if (!validatePhone(phone)) return;
    try {
      setLoading(true);
      const r = await axios.get(`${API}/appointments/search-patient/${phone}`);
      const pts = r.data.data || [];
      setPatient(pts.length > 0 ? pts[0] : { PatientName: "Walk-in Patient", Mobile: phone });
    } catch {
      setPatient({ PatientName: "Walk-in Patient", Mobile: phone });
    } finally {
      setLoading(false);
      setScreen("walkin_dept");
    }
  };

  // ── Walk-in: generate token ──────────────────────────────────────────────
  const handleWalkinConfirm = async () => {
    if (!selDoc) return;
    try {
      setLoading(true);
      const seq    = Math.floor(Math.random() * 90) + 1;
      const ticket = genTicket(selDoc.SERIES_W || selDoc.SHORTNAME || "WK", seq);
      await axios.post(`${API}/appointments`, {
        TICKETNUMBER: ticket,
        COUNTERID:    "1",
        SERVICEID:    selDoc.SERVICEID,
        ZONE:         selDoc.ZONE || "1",
        TYPE:         "W",
        CENTERID:     "101",
        PATIENTNAME:  patient?.PatientName || "",
        PHONE:        phone,
      });
      setTokenNumber(ticket);
      setTokenInfo({
        type:    "Walk-in",
        doctor:  selDoc.SERVICE_E,
        dept:    selCat?.CATEGORYE,
        patient: patient?.PatientName || "Walk-in Patient",
        phone,
      });
      setScreen("token_issued");
    } catch (e: any) {
      alert(e?.response?.data?.message || "Failed to generate token. Please try at the reception desk.");
    } finally { setLoading(false); }
  };

  // ── Appointment: phone search ────────────────────────────────────────────
  const handleApptPhone = async () => {
    if (!validatePhone(phone)) return;
    try {
      setLoading(true);
      const [patRes, apptRes] = await Promise.allSettled([
        axios.get(`${API}/appointments/search-patient/${phone}`),
        axios.get(`${API}/appointments/new-list`),
      ]);
      if (patRes.status === "fulfilled") {
        const pts = patRes.value.data.data || [];
        if (pts.length > 0) setPatient(pts[0]);
      }
      if (apptRes.status === "fulfilled") {
        const all  = apptRes.value.data.data || [];
        const mine = all.filter((a: any) => a.Mobile === phone);
        setAppointments(mine);
      }
    } catch { setAppointments([]); }
    finally { setLoading(false); setScreen("appt_list"); }
  };

  // ── Appointment: generate token ──────────────────────────────────────────
  const handleApptConfirm = async () => {
    if (!selAppt) return;
    try {
      setLoading(true);
      const ticket = `AP${selAppt.SLNO || Math.floor(Math.random() * 999)}`;
      await axios.post(`${API}/appointments`, {
        TICKETNUMBER: ticket,
        COUNTERID:    "1",
        SERVICEID:    selAppt.DoctorId,
        ZONE:         "1",
        TYPE:         "D",
        CENTERID:     "101",
        PATIENTNAME:  selAppt.PatientName || patient?.PatientName || "",
        PHONE:        phone,
      });
      setTokenNumber(ticket);
      setTokenInfo({
        type:    "Appointment",
        doctor:  selAppt.DoctorName,
        dept:    selAppt.DepartmentName,
        patient: selAppt.PatientName || patient?.PatientName,
        phone,
        date:    selAppt.AppointmentDateTime
          ? new Date(selAppt.AppointmentDateTime).toLocaleDateString("en-GB", {
              day:"2-digit", month:"short", year:"numeric"
            })
          : "",
        time:    selAppt.AppointmentDateTime
          ? new Date(selAppt.AppointmentDateTime).toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"})
          : "",
        apptNo:  selAppt.AppointNumber,
      });
      setScreen("token_issued");
    } catch (e: any) {
      alert(e?.response?.data?.message || "Failed to generate token.");
    } finally { setLoading(false); }
  };

  const resetAll = () => {
    setScreen("home"); setPhone(""); setPhoneErr("");
    setPatient(null); setSelCat(null); setSelDoc(null);
    setDoctors([]); setAppointments([]); setSelAppt(null);
    setTokenNumber(""); setTokenInfo(null);
  };

  // ─────────────────────────────────────────────────────────────────────────
  return (
    <div style={{
      minHeight:"100vh",
      background:"linear-gradient(135deg,#eef4fb 0%,#e1f5ee 100%)",
      display:"flex", flexDirection:"column", alignItems:"center",
      justifyContent:"center", padding:"24px", fontFamily:"'Plus Jakarta Sans',sans-serif"
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        * { box-sizing: border-box; }
        .ksk-card { background:white; border-radius:24px; box-shadow:0 8px 40px rgba(0,43,107,0.10); padding:36px; width:100%; max-width:560px; animation:fadeUp 0.35s ease; }
        @keyframes fadeUp { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
        .ksk-btn { border:none; cursor:pointer; border-radius:14px; font-family:inherit; font-weight:700; transition:all 0.2s; }
        .ksk-btn:disabled { opacity:0.5; cursor:not-allowed; }
        .ksk-btn:hover:not(:disabled) { transform:translateY(-1px); box-shadow:0 6px 20px rgba(0,0,0,0.15); }
        .ksk-input { width:100%; border:2px solid #dde3ef; border-radius:12px; padding:14px 16px; font-size:20px; font-family:inherit; font-weight:700; text-align:center; letter-spacing:6px; outline:none; transition:all 0.2s; }
        .ksk-input:focus { border-color:#1a7a6e; box-shadow:0 0 0 4px rgba(26,122,110,0.1); }
        .ksk-input.err { border-color:#ef4444; background:#fef2f2; }
        .ksk-tag { display:inline-block; padding:3px 10px; border-radius:50px; font-size:12px; font-weight:700; }
      `}</style>

      {/* Logo */}
      <div style={{ textAlign:"center", marginBottom:24 }}>
        <div style={{
          width:64, height:64, borderRadius:18,
          background:"linear-gradient(135deg,#1a7a6e,#002B6B)",
          display:"flex", alignItems:"center", justifyContent:"center",
          margin:"0 auto 12px", fontSize:32
        }}>🏥</div>
        <h1 style={{ fontSize:26, fontWeight:800, color:"#002B6B", margin:0 }}>Patient Check-In</h1>
        <p style={{ color:"#6b7280", margin:"4px 0 0", fontSize:14 }}>Walk-in or confirm your appointment</p>
      </div>

      {/* ── HOME ── */}
      {screen === "home" && (
        <div className="ksk-card">
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16 }}>

            <button className="ksk-btn" onClick={() => setScreen("walkin_phone")}
              style={{ background:"linear-gradient(135deg,#1a7a6e,#0d5c52)", color:"white", padding:"28px 16px", textAlign:"center" }}>
              <div style={{ fontSize:44, marginBottom:10 }}>🚶</div>
              <div style={{ fontSize:17, marginBottom:6 }}>Walk-in</div>
              <div style={{ fontSize:12, opacity:0.85, fontWeight:400 }}>No prior appointment?<br/>Get a token now</div>
            </button>

            <button className="ksk-btn" onClick={() => setScreen("appt_phone")}
              style={{ background:"linear-gradient(135deg,#002B6B,#0044a8)", color:"white", padding:"28px 16px", textAlign:"center" }}>
              <div style={{ fontSize:44, marginBottom:10 }}>📅</div>
              <div style={{ fontSize:17, marginBottom:6 }}>Appointment</div>
              <div style={{ fontSize:12, opacity:0.85, fontWeight:400 }}>Have a booking?<br/>Check in here</div>
            </button>
          </div>
        </div>
      )}

      {/* ── PHONE INPUT ── */}
      {(screen === "walkin_phone" || screen === "appt_phone") && (
        <div className="ksk-card">
          <div style={{ textAlign:"center", marginBottom:24 }}>
            <div style={{ fontSize:48, marginBottom:8 }}>
              {screen === "walkin_phone" ? "🚶" : "📅"}
            </div>
            <h2 style={{ fontSize:20, fontWeight:800, color:"#111827", margin:"0 0 4px" }}>
              {screen === "walkin_phone" ? "Walk-in Check-in" : "Appointment Check-in"}
            </h2>
            <p style={{ color:"#6b7280", fontSize:14, margin:0 }}>Enter your registered mobile number</p>
          </div>

          <input
            ref={phoneRef}
            className={`ksk-input${phoneErr ? " err" : ""}`}
            type="tel" inputMode="numeric" maxLength={10}
            value={phone} placeholder="0000000000"
            onChange={e => { setPhone(e.target.value.replace(/\D/g,"").slice(0,10)); setPhoneErr(""); }}
            onKeyDown={e => { if (e.key==="Enter") screen==="walkin_phone" ? handleWalkinPhone() : handleApptPhone(); }}
          />
          {phoneErr && <p style={{ color:"#ef4444", fontSize:13, textAlign:"center", marginTop:6 }}>{phoneErr}</p>}

          <div style={{ display:"flex", gap:12, marginTop:20 }}>
            <button className="ksk-btn" onClick={resetAll}
              style={{ flex:1, padding:"13px", background:"#f1f5f9", color:"#374151", fontSize:14 }}>
              ← Back
            </button>
            <button className="ksk-btn"
              onClick={screen==="walkin_phone" ? handleWalkinPhone : handleApptPhone}
              disabled={loading || phone.length !== 10}
              style={{ flex:2, padding:"13px", background: screen==="walkin_phone" ? "#1a7a6e" : "#002B6B", color:"white", fontSize:15 }}>
              {loading ? "⏳ Searching..." : "🔍 Search →"}
            </button>
          </div>
        </div>
      )}

      {/* ── WALK-IN: DEPT + DOCTOR ── */}
      {screen === "walkin_dept" && (
        <div className="ksk-card" style={{ maxWidth:600 }}>
          <div style={{ marginBottom:20 }}>
            <h2 style={{ fontSize:18, fontWeight:800, color:"#111827", margin:"0 0 4px" }}>
              Select Department & Doctor
            </h2>
            {patient?.PatientName && (
              <p style={{ color:"#1a7a6e", fontSize:13, fontWeight:600, margin:0 }}>
                👤 {patient.PatientName} · 📞 {phone}
              </p>
            )}
          </div>

          <p style={{ fontSize:11, fontWeight:700, color:"#9ca3af", textTransform:"uppercase", letterSpacing:1, marginBottom:10 }}>
            Department
          </p>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(2,1fr)", gap:10, marginBottom:20 }}>
            {categories.map(cat => (
              <button key={cat.CATEGORYID} className="ksk-btn"
                onClick={() => handleCatSelect(cat)}
                style={{
                  padding:"12px", textAlign:"left", fontSize:13, fontWeight:600,
                  border:`2px solid ${selCat?.CATEGORYID===cat.CATEGORYID ? "#1a7a6e" : "#e5e7eb"}`,
                  background: selCat?.CATEGORYID===cat.CATEGORYID ? "#e1f5ee" : "white",
                  color: selCat?.CATEGORYID===cat.CATEGORYID ? "#1a7a6e" : "#374151",
                }}>
                {cat.CATEGORYE}
              </button>
            ))}
            {categories.length === 0 && <p style={{ color:"#9ca3af", fontSize:13 }}>Loading...</p>}
          </div>

          {selCat && (
            <>
              <p style={{ fontSize:11, fontWeight:700, color:"#9ca3af", textTransform:"uppercase", letterSpacing:1, marginBottom:10 }}>
                Doctor
              </p>
              {loadingDoc
                ? <p style={{ color:"#9ca3af", fontSize:13 }}>⏳ Loading doctors...</p>
                : (
                  <div style={{ display:"flex", flexDirection:"column", gap:8, marginBottom:20 }}>
                    {doctors.map(doc => (
                      <button key={doc.SERVICEID} className="ksk-btn"
                        onClick={() => setSelDoc(doc)}
                        style={{
                          padding:"12px 16px", display:"flex", alignItems:"center", gap:12,
                          border:`2px solid ${selDoc?.SERVICEID===doc.SERVICEID ? "#002B6B" : "#e5e7eb"}`,
                          background: selDoc?.SERVICEID===doc.SERVICEID ? "#eff6ff" : "white",
                          textAlign:"left",
                        }}>
                        <div style={{
                          width:38, height:38, borderRadius:"50%", background:"#e0e7ff",
                          color:"#4338ca", display:"flex", alignItems:"center", justifyContent:"center",
                          fontWeight:800, fontSize:13, flexShrink:0
                        }}>
                          {(doc.SERVICE_E||"DR").replace(/Dr\.?\s*/i,"").split(" ").map((n:string)=>n[0]).slice(0,2).join("").toUpperCase()||"DR"}
                        </div>
                        <div>
                          <div style={{ fontWeight:700, fontSize:14, color:"#111827" }}>{doc.SERVICE_E}</div>
                          <div style={{ fontSize:12, color:"#6b7280" }}>Zone {doc.ZONE}</div>
                        </div>
                        {selDoc?.SERVICEID===doc.SERVICEID && (
                          <span style={{ marginLeft:"auto", color:"#002B6B", fontWeight:800, fontSize:18 }}>✓</span>
                        )}
                      </button>
                    ))}
                    {doctors.length===0 && <p style={{ color:"#f97316", fontSize:13 }}>No doctors in this department</p>}
                  </div>
                )
              }
            </>
          )}

          <div style={{ display:"flex", gap:12 }}>
            <button className="ksk-btn" onClick={resetAll}
              style={{ flex:1, padding:"13px", background:"#f1f5f9", color:"#374151", fontSize:14 }}>← Back</button>
            <button className="ksk-btn" onClick={() => setScreen("walkin_confirm")} disabled={!selDoc}
              style={{ flex:2, padding:"13px", background:"#1a7a6e", color:"white", fontSize:15 }}>
              Confirm →
            </button>
          </div>
        </div>
      )}

      {/* ── WALK-IN CONFIRM ── */}
      {screen === "walkin_confirm" && (
        <div className="ksk-card" style={{ textAlign:"center" }}>
          <div style={{ fontSize:52, marginBottom:8 }}>✅</div>
          <h2 style={{ fontSize:20, fontWeight:800, color:"#111827", margin:"0 0 20px" }}>Confirm Walk-in</h2>
          <div style={{ background:"#f8faff", borderRadius:14, padding:20, textAlign:"left", marginBottom:24 }}>
            {[
              ["Patient",    patient?.PatientName || "Walk-in"],
              ["Mobile",     phone],
              ["Department", selCat?.CATEGORYE],
              ["Doctor",     selDoc?.SERVICE_E],
              ["Type",       "Walk-in"],
            ].map(([k,v]) => (
              <div key={k} style={{ display:"flex", justifyContent:"space-between", padding:"8px 0", borderBottom:"1px solid #f1f5f9" }}>
                <span style={{ color:"#6b7280", fontSize:14 }}>{k}</span>
                <span style={{ fontWeight:700, fontSize:14, color:"#111827" }}>{v}</span>
              </div>
            ))}
          </div>
          <div style={{ display:"flex", gap:12 }}>
            <button className="ksk-btn" onClick={() => setScreen("walkin_dept")}
              style={{ flex:1, padding:"13px", background:"#f1f5f9", color:"#374151", fontSize:14 }}>← Back</button>
            <button className="ksk-btn" onClick={handleWalkinConfirm} disabled={loading}
              style={{ flex:2, padding:"13px", background:"#1a7a6e", color:"white", fontSize:15 }}>
              {loading ? "⏳ Generating..." : "🎫 Get Token"}
            </button>
          </div>
        </div>
      )}

      {/* ── APPOINTMENT LIST ── */}
      {screen === "appt_list" && (
        <div className="ksk-card" style={{ maxWidth:600 }}>
          <h2 style={{ fontSize:18, fontWeight:800, color:"#111827", margin:"0 0 4px" }}>Your Appointments</h2>
          <p style={{ color:"#6b7280", fontSize:13, margin:"0 0 20px" }}>📞 {phone}</p>

          {appointments.length === 0 ? (
            <div style={{ textAlign:"center", padding:"32px 0" }}>
              <div style={{ fontSize:48, marginBottom:12 }}>😔</div>
              <p style={{ fontWeight:700, color:"#374151", margin:"0 0 4px" }}>No appointments found</p>
              <p style={{ color:"#9ca3af", fontSize:13, margin:"0 0 20px" }}>for mobile {phone}</p>
              <button className="ksk-btn"
                onClick={() => { resetAll(); setTimeout(() => { setScreen("walkin_phone"); setPhone(phone); }, 50); }}
                style={{ padding:"12px 24px", background:"#1a7a6e", color:"white", fontSize:14 }}>
                → Walk-in Instead
              </button>
            </div>
          ) : (
            <div style={{ display:"flex", flexDirection:"column", gap:10, marginBottom:20 }}>
              {appointments.map((a, i) => (
                <button key={i} className="ksk-btn"
                  onClick={() => { setSelAppt(a); setScreen("appt_confirm"); }}
                  style={{
                    padding:"16px", textAlign:"left",
                    border:`2px solid ${selAppt?.SLNO===a.SLNO ? "#002B6B" : "#e5e7eb"}`,
                    background: selAppt?.SLNO===a.SLNO ? "#eff6ff" : "white",
                  }}>
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
                    <div>
                      <div style={{ fontWeight:700, fontSize:15, color:"#111827" }}>{a.DoctorName || "Doctor"}</div>
                      <div style={{ fontSize:13, color:"#6b7280", marginTop:2 }}>{a.DepartmentName}</div>
                      {a.AppointmentDateTime && (
                        <div style={{ fontSize:13, color:"#4338ca", fontWeight:600, marginTop:4 }}>
                          📅 {new Date(a.AppointmentDateTime).toLocaleDateString("en-GB",{day:"2-digit",month:"short",year:"numeric"})}
                          {" · "}
                          {new Date(a.AppointmentDateTime).toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"})}
                        </div>
                      )}
                    </div>
                    <div style={{ textAlign:"right" }}>
                      <span className="ksk-tag" style={{ background:"#e0e7ff", color:"#3730a3", marginBottom:4, display:"block" }}>
                        {a.AppointNumber || `#${a.SLNO}`}
                      </span>
                      <span style={{ fontSize:12, color:"#16a34a", fontWeight:700 }}>Confirm →</span>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}

          <button className="ksk-btn" onClick={resetAll}
            style={{ width:"100%", padding:"12px", background:"#f1f5f9", color:"#6b7280", fontSize:14 }}>
            ← Back
          </button>
        </div>
      )}

      {/* ── APPOINTMENT CONFIRM ── */}
      {screen === "appt_confirm" && selAppt && (
        <div className="ksk-card" style={{ textAlign:"center" }}>
          <div style={{ fontSize:52, marginBottom:8 }}>📋</div>
          <h2 style={{ fontSize:20, fontWeight:800, color:"#111827", margin:"0 0 20px" }}>Confirm Appointment</h2>
          <div style={{ background:"#eff6ff", borderRadius:14, padding:20, textAlign:"left", marginBottom:24, border:"1px solid #c7d2fe" }}>
            {[
              ["Patient",    selAppt.PatientName || patient?.PatientName],
              ["Doctor",     selAppt.DoctorName],
              ["Department", selAppt.DepartmentName],
              ["Date",       selAppt.AppointmentDateTime ? new Date(selAppt.AppointmentDateTime).toLocaleDateString("en-GB",{day:"2-digit",month:"short",year:"numeric"}) : "—"],
              ["Time",       selAppt.AppointmentDateTime ? new Date(selAppt.AppointmentDateTime).toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"}) : "—"],
              ["Appt No.",   selAppt.AppointNumber || `#${selAppt.SLNO}`],
            ].map(([k,v]) => (
              <div key={k} style={{ display:"flex", justifyContent:"space-between", padding:"8px 0", borderBottom:"1px solid #e0e7ff" }}>
                <span style={{ color:"#6b7280", fontSize:14 }}>{k}</span>
                <span style={{ fontWeight:700, fontSize:14, color: k==="Appt No." ? "#4338ca" : "#111827" }}>{v}</span>
              </div>
            ))}
          </div>
          <div style={{ display:"flex", gap:12 }}>
            <button className="ksk-btn" onClick={() => setScreen("appt_list")}
              style={{ flex:1, padding:"13px", background:"#f1f5f9", color:"#374151", fontSize:14 }}>← Back</button>
            <button className="ksk-btn" onClick={handleApptConfirm} disabled={loading}
              style={{ flex:2, padding:"13px", background:"#002B6B", color:"white", fontSize:15 }}>
              {loading ? "⏳ Generating..." : "🎫 Get Token"}
            </button>
          </div>
        </div>
      )}

      {/* ── TOKEN ISSUED ── */}
      {screen === "token_issued" && (
        <div className="ksk-card" style={{ textAlign:"center" }}>
          <div style={{ fontSize:56, marginBottom:4 }}>🎫</div>
          <p style={{ color:"#6b7280", fontSize:12, textTransform:"uppercase", letterSpacing:2, margin:"0 0 8px" }}>
            Your Token Number
          </p>
          <div style={{
            fontSize:80, fontWeight:900, lineHeight:1, margin:"12px 0",
            color: tokenInfo?.type==="Walk-in" ? "#1a7a6e" : "#002B6B"
          }}>
            {tokenNumber}
          </div>
          <p style={{ color:"#6b7280", fontSize:13, margin:"0 0 20px" }}>
            Please wait for your token to be called at the counter
          </p>

          <div style={{ background:"#f8faff", borderRadius:14, padding:16, textAlign:"left", marginBottom:24 }}>
            {[
              tokenInfo?.patient && ["Patient",    tokenInfo.patient],
              tokenInfo?.doctor  && ["Doctor",     tokenInfo.doctor],
              tokenInfo?.dept    && ["Department", tokenInfo.dept],
              tokenInfo?.date    && ["Date",       tokenInfo.date],
              tokenInfo?.time    && ["Time",       tokenInfo.time],
              tokenInfo?.apptNo  && ["Appt No.",   tokenInfo.apptNo],
              ["Type", tokenInfo?.type],
            ].filter(Boolean).map((row: any) => (
              <div key={row[0]} style={{ display:"flex", justifyContent:"space-between", padding:"6px 0", borderBottom:"1px solid #f1f5f9" }}>
                <span style={{ color:"#9ca3af", fontSize:13 }}>{row[0]}</span>
                <span style={{ fontWeight:700, fontSize:13, color:"#111827" }}>
                  {row[0]==="Type"
                    ? <span className="ksk-tag" style={{ background: tokenInfo?.type==="Walk-in" ? "#d1fae5" : "#e0e7ff", color: tokenInfo?.type==="Walk-in" ? "#065f46" : "#3730a3" }}>{row[1]}</span>
                    : row[1]
                  }
                </span>
              </div>
            ))}
          </div>

          <div style={{ display:"flex", gap:12 }}>
            <button className="ksk-btn" onClick={resetAll}
              style={{ flex:1, padding:"13px", background:"#1a7a6e", color:"white", fontSize:14 }}>
              ✅ New Check-in
            </button>
            <button className="ksk-btn" onClick={() => window.print()}
              style={{ flex:1, padding:"13px", background:"#f1f5f9", color:"#374151", fontSize:14 }}>
              🖨️ Print Token
            </button>
          </div>
        </div>
      )}

    </div>
  );
}