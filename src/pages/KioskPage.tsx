// src/pages/KioskPage.tsx
// PUBLIC PAGE — No login required
import { useState, useRef, useEffect } from "react";
import axios from "axios";

const API = "https://backend-production-2df7.up.railway.app/api";

let CLINIC = {
  name:    "Al Shifa Medical Centre",
  address: "DIP, Dubai",
  tagline: "Dedication meets healing",
  logo:    "/images/logo/logod.png",
};

type Screen = "home" | "walkin_phone" | "walkin_confirm" | "appt_phone" | "appt_list" | "appt_confirm" | "token_issued";

export default function KioskPage() {
  const [screen,       setScreen]       = useState<Screen>("home");
  const [phone,        setPhone]        = useState("");
  const [phoneErr,     setPhoneErr]     = useState("");
  const [loading,      setLoading]      = useState(false);
  const [patient,      setPatient]      = useState<any>(null);
  const [appointments, setAppointments] = useState<any[]>([]);
  const [selAppt,      setSelAppt]      = useState<any>(null);
  const [tokenNumber,  setTokenNumber]  = useState("");
  const [tokenInfo,    setTokenInfo]    = useState<any>(null);
  const [waitingCount, setWaitingCount] = useState(0);
  const phoneRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (screen === "walkin_phone" || screen === "appt_phone")
      setTimeout(() => phoneRef.current?.focus(), 100);
  }, [screen]);

  useEffect(() => {
    axios.get(`${API}/clinic`).then(r => {
      if (r.data?.data) {
        CLINIC.name    = r.data.data.COMPANYNAME    || CLINIC.name;
        CLINIC.address = r.data.data.COMPANYADDRESS || CLINIC.address;
        CLINIC.tagline = r.data.data.KIOSKMESSAGE1  || CLINIC.tagline;
      }
    }).catch(() => {});
  }, []);

  const validatePhone = (p: string) => {
    if (p.length !== 10) { setPhoneErr("Please enter a valid 10-digit mobile number"); return false; }
    setPhoneErr(""); return true;
  };

  // Walk-in: phone → confirm
  const handleWalkinPhone = async () => {
    if (!validatePhone(phone)) return;
    try {
      setLoading(true);
      const r = await axios.get(`${API}/appointments/search-patient/${phone}`);
      const pts = r.data.data || [];
      setPatient(pts[0] || { PatientName: "Walk-in Patient", Mobile: phone });
      setScreen("walkin_confirm");
    } catch {
      setPatient({ PatientName: "Walk-in Patient", Mobile: phone });
      setScreen("walkin_confirm");
    } finally { setLoading(false); }
  };

  // Walk-in: generate token
  const handleWalkinConfirm = async () => {
    try {
      setLoading(true);
      const seq    = Math.floor(Math.random() * 90) + 1;
      const ticket = `WK${seq}`;
      await axios.post(`${API}/appointments`, {
        TICKETNUMBER: ticket, COUNTERID: "1", SERVICEID: 1,
        ZONE: "1", TYPE: "W", CENTERID: "101",
        PATIENTNAME: patient?.PatientName || "", PHONE: phone,
      });
      setWaitingCount(Math.floor(Math.random() * 5));
      setTokenNumber(ticket);
      setTokenInfo({
        type: "Walk-in", patient: patient?.PatientName || "Walk-in Patient",
        phone, dept: null, doctor: null,
        date: new Date().toLocaleDateString("en-GB", { day:"2-digit", month:"2-digit", year:"2-digit" }),
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" }),
      });
      setScreen("token_issued");
    } catch (e: any) {
      alert(e?.response?.data?.message || "Failed. Please try at reception.");
    } finally { setLoading(false); }
  };

  // Appointment: phone search
  const handleApptPhone = async () => {
    if (!validatePhone(phone)) return;
    try {
      setLoading(true);
      const [patRes, apptRes] = await Promise.all([
        axios.get(`${API}/appointments/search-patient/${phone}`),
        axios.get(`${API}/appointments/new-list`),
      ]);
      const pts = patRes.data.data || [];
      if (pts.length > 0) setPatient(pts[0]);
      const patientSlno = pts[0]?.SLNO || null;
      const all  = apptRes.data.data || [];
      const mine = all.filter((a: any) =>
        a.Mobile === phone || (patientSlno && a.PatientId === patientSlno)
      );
      setAppointments(mine);
      setScreen("appt_list");
    } catch {
      setAppointments([]);
      setScreen("appt_list");
    } finally { setLoading(false); }
  };

  // Appointment: confirm token
  const handleApptConfirm = async () => {
    if (!selAppt) return;
    try {
      setLoading(true);
      const ticket = `AP${selAppt.SLNO}`;
      await axios.post(`${API}/appointments`, {
        TICKETNUMBER: ticket, COUNTERID: "1", SERVICEID: selAppt.DoctorId || 1,
        ZONE: "1", TYPE: "D", CENTERID: "101",
        PATIENTNAME: selAppt.PatientName || patient?.PatientName || "", PHONE: phone,
      });
      setWaitingCount(Math.floor(Math.random() * 5));
      setTokenNumber(ticket);
      setTokenInfo({
        type:   "Appointment",
        patient: selAppt.PatientName || patient?.PatientName,
        phone,
        dept:   selAppt.DepartmentName,
        doctor: selAppt.DoctorName,
        room:   selAppt.RoomNo || "",
        date:   selAppt.AppointmentDateTime
          ? new Date(selAppt.AppointmentDateTime).toLocaleDateString("en-GB", { day:"2-digit", month:"2-digit", year:"2-digit" })
          : new Date().toLocaleDateString("en-GB", { day:"2-digit", month:"2-digit", year:"2-digit" }),
        time:   selAppt.AppointmentDateTime
          ? new Date(selAppt.AppointmentDateTime).toLocaleTimeString([], { hour:"2-digit", minute:"2-digit", second:"2-digit" })
          : new Date().toLocaleTimeString([], { hour:"2-digit", minute:"2-digit", second:"2-digit" }),
        apptNo: selAppt.AppointNumber,
      });
      setScreen("token_issued");
    } catch (e: any) {
      alert(e?.response?.data?.message || "Failed to generate token.");
    } finally { setLoading(false); }
  };

  // Print ticket — exact client format
  const printTicket = () => {
    const w = window.open("", "_blank", "width=320,height=600");
    if (!w) return;
    const isAppt = tokenInfo?.type === "Appointment";
    w.document.write(`
<!DOCTYPE html><html><head><title>Token</title>
<style>
  * { margin:0; padding:0; box-sizing:border-box; }
  body { font-family:'Arial',sans-serif; width:300px; margin:0 auto; padding:8px; }
  .divider { border-top:2px dashed #000; margin:6px 0; }
  .center { text-align:center; }
  .dept { font-size:18px; font-weight:bold; text-align:center; padding:4px 0; }
  .token { font-size:56px; font-weight:900; text-align:center; letter-spacing:2px; margin:4px 0; line-height:1; }
  .info { font-size:13px; font-weight:bold; text-align:center; margin:3px 0; }
  .small { font-size:12px; text-align:center; margin:2px 0; }
  .logo-area { text-align:center; margin:6px 0; }
  .logo-area img { max-width:100px; max-height:60px; }
  .clinic { font-size:14px; font-weight:bold; text-align:center; margin:3px 0; }
  .clinic-sub { font-size:12px; text-align:center; margin:2px 0; }
</style>
</head><body>
  <div class="divider"></div>
  <div class="dept">${isAppt ? (tokenInfo?.dept || "General") : "Walk-in"}</div>
  <div class="divider"></div>
  <div class="token">${tokenNumber}</div>
  ${isAppt && tokenInfo?.doctor ? `<div class="info">Doctor:${tokenInfo.doctor}</div>` : ""}
  ${isAppt && tokenInfo?.room   ? `<div class="small">Serving in Room No.${tokenInfo.room}</div>` : ""}
  <div class="small">${tokenInfo?.date || ""} ${tokenInfo?.time || ""}</div>
  <div class="info">Patient Waiting ${waitingCount}</div>
  <div class="divider"></div>
  <div class="logo-area">
    <img src="${window.location.origin}${CLINIC.logo}" onerror="this.style.display='none'" />
  </div>
  <div class="clinic">${CLINIC.name}</div>
  <div class="clinic-sub">${CLINIC.address}</div>
  <div class="clinic-sub">${CLINIC.tagline}</div>
  <div class="divider"></div>
  <script>window.onload=()=>{window.print();window.close();}<\/script>
</body></html>`);
    w.document.close();
  };

  const resetAll = () => {
    setScreen("home"); setPhone(""); setPhoneErr("");
    setPatient(null); setAppointments([]); setSelAppt(null);
    setTokenNumber(""); setTokenInfo(null); setWaitingCount(0);
  };

  return (
    <div style={{ minHeight:"100vh", background:"linear-gradient(135deg,#eef4fb 0%,#e1f5ee 100%)", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:"24px", fontFamily:"'Plus Jakarta Sans',sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700;800&display=swap');
        * { box-sizing:border-box; }
        .ksk-card { background:white; border-radius:24px; box-shadow:0 8px 40px rgba(0,43,107,0.10); padding:36px; width:100%; max-width:520px; animation:fadeUp 0.35s ease; }
        @keyframes fadeUp { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
        .ksk-btn { border:none; cursor:pointer; border-radius:14px; font-family:inherit; font-weight:700; transition:all 0.2s; }
        .ksk-btn:disabled { opacity:0.5; cursor:not-allowed; }
        .ksk-btn:hover:not(:disabled) { transform:translateY(-1px); box-shadow:0 6px 20px rgba(0,0,0,0.12); }
        .ksk-input { width:100%; border:2px solid #dde3ef; border-radius:12px; padding:14px 16px; font-size:22px; font-family:inherit; font-weight:700; text-align:center; letter-spacing:6px; outline:none; transition:all 0.2s; }
        .ksk-input:focus { border-color:#1a7a6e; box-shadow:0 0 0 4px rgba(26,122,110,0.1); }
        .ksk-input.err { border-color:#ef4444; background:#fef2f2; }
      `}</style>

      {/* Header */}
      <div style={{ textAlign:"center", marginBottom:24 }}>
        <div style={{ width:64, height:64, borderRadius:18, background:"linear-gradient(135deg,#1a7a6e,#002B6B)", display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 12px", fontSize:32 }}>🏥</div>
        <h1 style={{ fontSize:26, fontWeight:800, color:"#002B6B", margin:0 }}>Patient Check-In</h1>
        <p style={{ color:"#6b7280", margin:"4px 0 0", fontSize:14 }}>Walk-in or confirm your appointment</p>
      </div>

      {/* HOME */}
      {screen === "home" && (
        <div className="ksk-card">
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16 }}>
            <button className="ksk-btn" onClick={() => setScreen("walkin_phone")}
              style={{ background:"linear-gradient(135deg,#1a7a6e,#0d5c52)", color:"white", padding:"28px 16px", textAlign:"center" }}>
              <div style={{ fontSize:44, marginBottom:10 }}>🚶</div>
              <div style={{ fontSize:17, marginBottom:6 }}>Walk-in</div>
              <div style={{ fontSize:12, opacity:0.85, fontWeight:400 }}>No appointment?<br/>Get token now</div>
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

      {/* PHONE INPUT */}
      {(screen === "walkin_phone" || screen === "appt_phone") && (
        <div className="ksk-card">
          <div style={{ textAlign:"center", marginBottom:24 }}>
            <div style={{ fontSize:48, marginBottom:8 }}>{screen === "walkin_phone" ? "🚶" : "📅"}</div>
            <h2 style={{ fontSize:20, fontWeight:800, color:"#111827", margin:"0 0 4px" }}>
              {screen === "walkin_phone" ? "Walk-in Check-in" : "Appointment Check-in"}
            </h2>
            <p style={{ color:"#6b7280", fontSize:14, margin:0 }}>Enter your registered mobile number</p>
          </div>
          <input ref={phoneRef} className={`ksk-input${phoneErr ? " err" : ""}`}
            type="tel" inputMode="numeric" maxLength={10} value={phone} placeholder="0000000000"
            onChange={e => { setPhone(e.target.value.replace(/\D/g,"").slice(0,10)); setPhoneErr(""); }}
            onKeyDown={e => { if (e.key==="Enter") screen==="walkin_phone" ? handleWalkinPhone() : handleApptPhone(); }}
          />
          {phoneErr && <p style={{ color:"#ef4444", fontSize:13, textAlign:"center", marginTop:6 }}>{phoneErr}</p>}
          <div style={{ display:"flex", gap:12, marginTop:20 }}>
            <button className="ksk-btn" onClick={resetAll}
              style={{ flex:1, padding:"13px", background:"#f1f5f9", color:"#374151", fontSize:14 }}>← Back</button>
            <button className="ksk-btn"
              onClick={screen==="walkin_phone" ? handleWalkinPhone : handleApptPhone}
              disabled={loading || phone.length !== 10}
              style={{ flex:2, padding:"13px", background:screen==="walkin_phone" ? "#1a7a6e" : "#002B6B", color:"white", fontSize:15 }}>
              {loading ? "⏳ Searching..." : "Next →"}
            </button>
          </div>
        </div>
      )}

      {/* WALK-IN CONFIRM */}
      {screen === "walkin_confirm" && (
        <div className="ksk-card" style={{ textAlign:"center" }}>
          <div style={{ fontSize:52, marginBottom:8 }}>🎫</div>
          <h2 style={{ fontSize:20, fontWeight:800, color:"#111827", margin:"0 0 20px" }}>Confirm Walk-in</h2>
          <div style={{ background:"#f8faff", borderRadius:14, padding:20, textAlign:"left", marginBottom:24 }}>
            {[
              ["Patient", patient?.PatientName || "Walk-in Patient"],
              ["Mobile",  phone],
              ["Type",    "Walk-in"],
              ["Date",    new Date().toLocaleDateString("en-GB")],
              ["Time",    new Date().toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"})],
            ].map(([k,v]) => (
              <div key={k} style={{ display:"flex", justifyContent:"space-between", padding:"8px 0", borderBottom:"1px solid #f1f5f9" }}>
                <span style={{ color:"#6b7280", fontSize:14 }}>{k}</span>
                <span style={{ fontWeight:700, fontSize:14, color:"#111827" }}>{v}</span>
              </div>
            ))}
          </div>
          <div style={{ display:"flex", gap:12 }}>
            <button className="ksk-btn" onClick={() => setScreen("walkin_phone")}
              style={{ flex:1, padding:"13px", background:"#f1f5f9", color:"#374151", fontSize:14 }}>← Back</button>
            <button className="ksk-btn" onClick={handleWalkinConfirm} disabled={loading}
              style={{ flex:2, padding:"13px", background:"#1a7a6e", color:"white", fontSize:15 }}>
              {loading ? "⏳ Generating..." : "🎫 Get Token"}
            </button>
          </div>
        </div>
      )}

      {/* APPOINTMENT LIST */}
      {screen === "appt_list" && (
        <div className="ksk-card" style={{ maxWidth:580 }}>
          <h2 style={{ fontSize:18, fontWeight:800, color:"#111827", margin:"0 0 4px" }}>Your Appointments</h2>
          <p style={{ color:"#6b7280", fontSize:13, margin:"0 0 20px" }}>📞 {phone}</p>
          {appointments.length === 0 ? (
            <div style={{ textAlign:"center", padding:"32px 0" }}>
              <div style={{ fontSize:48, marginBottom:12 }}>😔</div>
              <p style={{ fontWeight:700, color:"#374151", margin:"0 0 4px" }}>No appointments found</p>
              <p style={{ color:"#9ca3af", fontSize:13, margin:"0 0 20px" }}>for mobile {phone}</p>
              <button className="ksk-btn" onClick={() => { resetAll(); setTimeout(()=>setScreen("walkin_phone"),50); }}
                style={{ padding:"12px 24px", background:"#1a7a6e", color:"white", fontSize:14 }}>
                → Walk-in Instead
              </button>
            </div>
          ) : (
            <div style={{ display:"flex", flexDirection:"column", gap:10, marginBottom:20 }}>
              {appointments.map((a,i) => (
                <button key={i} className="ksk-btn" onClick={() => { setSelAppt(a); setScreen("appt_confirm"); }}
                  style={{ padding:"16px", textAlign:"left", border:`2px solid ${selAppt?.SLNO===a.SLNO?"#002B6B":"#e5e7eb"}`, background:selAppt?.SLNO===a.SLNO?"#eff6ff":"white" }}>
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
                    <div>
                      <div style={{ fontWeight:700, fontSize:15, color:"#111827" }}>{a.DoctorName||"Doctor"}</div>
                      <div style={{ fontSize:13, color:"#6b7280", marginTop:2 }}>{a.DepartmentName}</div>
                      {a.AppointmentDateTime && (
                        <div style={{ fontSize:13, color:"#4338ca", fontWeight:600, marginTop:4 }}>
                          📅 {new Date(a.AppointmentDateTime).toLocaleDateString("en-GB")} · {new Date(a.AppointmentDateTime).toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"})}
                        </div>
                      )}
                    </div>
                    <div style={{ textAlign:"right" }}>
                      <span style={{ background:"#e0e7ff", color:"#3730a3", padding:"2px 8px", borderRadius:50, fontSize:12, fontWeight:700 }}>
                        {a.AppointNumber||`#${a.SLNO}`}
                      </span>
                      <p style={{ fontSize:12, color:"#16a34a", fontWeight:700, marginTop:4 }}>Confirm →</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
          <button className="ksk-btn" onClick={resetAll}
            style={{ width:"100%", padding:"12px", background:"#f1f5f9", color:"#6b7280", fontSize:14 }}>← Back</button>
        </div>
      )}

      {/* APPOINTMENT CONFIRM */}
      {screen === "appt_confirm" && selAppt && (
        <div className="ksk-card" style={{ textAlign:"center" }}>
          <div style={{ fontSize:52, marginBottom:8 }}>📋</div>
          <h2 style={{ fontSize:20, fontWeight:800, color:"#111827", margin:"0 0 20px" }}>Confirm Appointment</h2>
          <div style={{ background:"#eff6ff", borderRadius:14, padding:20, textAlign:"left", marginBottom:24, border:"1px solid #c7d2fe" }}>
            {[
              ["Patient",    selAppt.PatientName||patient?.PatientName],
              ["Doctor",     selAppt.DoctorName],
              ["Department", selAppt.DepartmentName],
              ["Date",       selAppt.AppointmentDateTime ? new Date(selAppt.AppointmentDateTime).toLocaleDateString("en-GB") : "—"],
              ["Time",       selAppt.AppointmentDateTime ? new Date(selAppt.AppointmentDateTime).toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"}) : "—"],
              ["Appt No.",   selAppt.AppointNumber||`#${selAppt.SLNO}`],
            ].map(([k,v]) => (
              <div key={k} style={{ display:"flex", justifyContent:"space-between", padding:"8px 0", borderBottom:"1px solid #e0e7ff" }}>
                <span style={{ color:"#6b7280", fontSize:14 }}>{k}</span>
                <span style={{ fontWeight:700, fontSize:14, color:k==="Appt No."?"#4338ca":"#111827" }}>{v}</span>
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

      {/* TOKEN ISSUED */}
      {screen === "token_issued" && (
        <div className="ksk-card" style={{ textAlign:"center" }}>
          {/* Ticket preview — exact client format */}
          <div style={{ border:"2px dashed #374151", borderRadius:8, padding:"16px 20px", marginBottom:20, background:"#fff", maxWidth:280, margin:"0 auto 20px", fontFamily:"'Courier New',monospace" }}>
            <div style={{ borderBottom:"1px dashed #374151", paddingBottom:6, marginBottom:6 }}>
              <p style={{ fontSize:15, fontWeight:900, textAlign:"center", textTransform:"uppercase" }}>
                {tokenInfo?.type==="Appointment" ? (tokenInfo?.dept||"General") : "Walk-in"}
              </p>
            </div>
            <p style={{ fontSize:52, fontWeight:900, textAlign:"center", letterSpacing:2, lineHeight:1.1, margin:"6px 0" }}>
              {tokenNumber}
            </p>
            {tokenInfo?.type==="Appointment" && tokenInfo?.doctor && (
              <p style={{ fontSize:13, fontWeight:700, textAlign:"center" }}>Doctor:{tokenInfo.doctor}</p>
            )}
            {tokenInfo?.type==="Appointment" && tokenInfo?.room && (
              <p style={{ fontSize:12, textAlign:"center" }}>Serving in Room No.{tokenInfo.room}</p>
            )}
            <p style={{ fontSize:12, textAlign:"center", margin:"4px 0" }}>{tokenInfo?.date} {tokenInfo?.time}</p>
            <p style={{ fontSize:13, fontWeight:700, textAlign:"center" }}>Patient Waiting {waitingCount}</p>
            <div style={{ borderTop:"1px dashed #374151", borderBottom:"1px dashed #374151", padding:"6px 0", margin:"6px 0", textAlign:"center" }}>
              <img src={CLINIC.logo} alt="logo" style={{ maxWidth:80, maxHeight:50 }} onError={(e:any)=>e.target.style.display="none"} />
            </div>
            <p style={{ fontSize:13, fontWeight:700, textAlign:"center" }}>{CLINIC.name}</p>
            <p style={{ fontSize:11, textAlign:"center" }}>{CLINIC.address}</p>
            <p style={{ fontSize:11, textAlign:"center" }}>{CLINIC.tagline}</p>
            <div style={{ borderTop:"1px dashed #374151", marginTop:6 }}></div>
          </div>

          <div style={{ display:"flex", gap:12, maxWidth:280, margin:"0 auto" }}>
            <button className="ksk-btn" onClick={printTicket}
              style={{ flex:1, padding:"13px", background:"#002B6B", color:"white", fontSize:14 }}>
              🖨️ Print
            </button>
            <button className="ksk-btn" onClick={resetAll}
              style={{ flex:1, padding:"13px", background:"#1a7a6e", color:"white", fontSize:14 }}>
              ✅ New
            </button>
          </div>
        </div>
      )}
    </div>
  );
}