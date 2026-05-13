// src/pages/KioskPage.tsx — PUBLIC PAGE
import { useState, useRef, useEffect } from "react";
import axios from "axios";

const API = "https://backend-production-2df7.up.railway.app/api";

let CLINIC = {
  name:    "Al Shifa Medical Centre",
  address: "DIP, Dubai",
  tagline: "Dedication meets healing",
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

  // Fetch ticket config from DB
  useEffect(() => {
    axios.get(`${API}/clinic/ticket-config`).then(r => {
      if (r.data?.mode) {
        localStorage.setItem("ticketConfig", JSON.stringify({ mode: r.data.mode }));
      }
    }).catch(() => {});
  }, []);

  useEffect(() => {
    axios.get(`${API}/clinic`).then(r => {
      if (r.data?.data) {
        CLINIC.name    = r.data.data.COMPANYNAME    || CLINIC.name;
        CLINIC.address = r.data.data.COMPANYADDRESS || CLINIC.address;
        CLINIC.tagline = r.data.data.KIOSKMESSAGE1  || CLINIC.tagline;
      }
    }).catch(() => {});
  }, []);

  // Auto print/SMS based on clinic config when token issued
  useEffect(() => {
    if (screen !== "token_issued" || !tokenInfo || !tokenNumber) return;
    const cfg = localStorage.getItem("ticketConfig");
    const mode = cfg ? JSON.parse(cfg).mode : "print";
    if (mode === "print" || mode === "both") {
      setTimeout(() => printTicket(), 600);
    }
    // SMS — add gateway here when ready
  }, [screen, tokenNumber]);

  const validatePhone = (p: string) => {
    if (p.length !== 10) { setPhoneErr("Please enter a valid 10-digit mobile number"); return false; }
    setPhoneErr(""); return true;
  };

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

  const handleWalkinConfirm = async () => {
    try {
      setLoading(true);
      const seq = Math.floor(Math.random() * 90) + 1;
      const ticket = `WK${seq}`;
      await axios.post(`${API}/appointments`, {
        TICKETNUMBER: ticket, COUNTERID: "1", SERVICEID: 1,
        ZONE: "1", TYPE: "W", CENTERID: "101",
        PATIENTNAME: patient?.PatientName || "", PHONE: phone,
      });
      const now = new Date();
      setWaitingCount(Math.floor(Math.random() * 6));
      setTokenNumber(ticket);
      setTokenInfo({
        type: "Walk-in", patient: patient?.PatientName || "Walk-in Patient", phone,
        dept: null, doctor: null, room: null,
        date: now.toLocaleDateString("en-GB", { day:"2-digit", month:"2-digit", year:"2-digit" }),
        time: now.toLocaleTimeString([], { hour:"2-digit", minute:"2-digit", second:"2-digit" }),
      });
      setScreen("token_issued");
    } catch (e: any) {
      alert(e?.response?.data?.message || "Failed. Please try at reception.");
    } finally { setLoading(false); }
  };

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
      const now = new Date();
      setWaitingCount(Math.floor(Math.random() * 6));
      setTokenNumber(ticket);
      setTokenInfo({
        type: "Appointment", patient: selAppt.PatientName || patient?.PatientName, phone,
        dept: selAppt.DepartmentName, doctor: selAppt.DoctorName, room: null,
        date: selAppt.AppointmentDateTime
          ? new Date(selAppt.AppointmentDateTime).toLocaleDateString("en-GB", { day:"2-digit", month:"2-digit", year:"2-digit" })
          : now.toLocaleDateString("en-GB", { day:"2-digit", month:"2-digit", year:"2-digit" }),
        time: selAppt.AppointmentDateTime
          ? new Date(selAppt.AppointmentDateTime).toLocaleTimeString([], { hour:"2-digit", minute:"2-digit", second:"2-digit" })
          : now.toLocaleTimeString([], { hour:"2-digit", minute:"2-digit", second:"2-digit" }),
        apptNo: selAppt.AppointNumber,
      });
      setScreen("token_issued");
    } catch (e: any) {
      alert(e?.response?.data?.message || "Failed.");
    } finally { setLoading(false); }
  };

  // ── Print ticket — exact client PDF format ────────────────────────────────
  const printTicket = () => {
    const isAppt = tokenInfo?.type === "Appointment";
    const w = window.open("", "_blank", "width=320,height=550");
    if (!w) { alert("Please allow popups to print."); return; }
    w.document.write(`<!DOCTYPE html><html><head><title>Token</title>
<style>
  @media print { @page { margin:4mm; } }
  * { margin:0; padding:0; box-sizing:border-box; }
  body { font-family:'Arial',sans-serif; width:280px; margin:0 auto; padding:6px; }
  .dash { border-top:2px dashed #000; margin:6px 0; }
  .dept { font-size:16px; font-weight:900; text-align:center; padding:4px 0; text-transform:uppercase; }
  .token { font-size:58px; font-weight:900; text-align:center; letter-spacing:3px; margin:4px 0; line-height:1; }
  .bold { font-size:13px; font-weight:bold; text-align:center; margin:3px 0; }
  .sm { font-size:12px; text-align:center; margin:2px 0; }
  .logo { text-align:center; padding:4px 0; font-size:28px; }
  .cname { font-size:14px; font-weight:bold; text-align:center; margin:2px 0; }
  .csub { font-size:11px; text-align:center; margin:1px 0; }
</style></head><body>
<div class="dash"></div>
<div class="dept">${isAppt ? (tokenInfo?.dept || "General") : "Walk-in"}</div>
<div class="dash"></div>
<div class="token">${tokenNumber}</div>
${isAppt && tokenInfo?.doctor ? `<div class="bold">Doctor:${tokenInfo.doctor}</div>` : ""}
${isAppt && tokenInfo?.room   ? `<div class="sm">Serving in Room No.${tokenInfo.room}</div>` : ""}
<div class="sm">${tokenInfo?.date || ""} ${tokenInfo?.time || ""}</div>
<div class="bold">Patient Waiting ${waitingCount}</div>
<div class="dash"></div>
<div class="logo">🏥</div>
<div class="cname">${CLINIC.name}</div>
<div class="csub">${CLINIC.address}</div>
<div class="csub">${CLINIC.tagline}</div>
<div class="dash"></div>
<script>window.onload=function(){window.print();setTimeout(()=>window.close(),500);}<\/script>
</body></html>`);
    w.document.close();
  };

  const resetAll = () => {
    setScreen("home"); setPhone(""); setPhoneErr("");
    setPatient(null); setAppointments([]); setSelAppt(null);
    setTokenNumber(""); setTokenInfo(null); setWaitingCount(0);
  };

  // ── Shared styles ─────────────────────────────────────────────────────────
  const card: React.CSSProperties = {
    background:"white", borderRadius:24,
    boxShadow:"0 8px 40px rgba(0,43,107,0.10)",
    padding:36, width:"100%", maxWidth:520,
  };
  const btn = (bg: string, color = "white"): React.CSSProperties => ({
    border:"none", cursor:"pointer", borderRadius:14,
    fontFamily:"inherit", fontWeight:700, fontSize:15,
    padding:"14px 20px", background:bg, color,
    transition:"all 0.2s",
  });
  const row = (k: string, v: any) => (
    <div key={k} style={{ display:"flex", justifyContent:"space-between", padding:"9px 0", borderBottom:"1px solid #f1f5f9" }}>
      <span style={{ color:"#6b7280", fontSize:14 }}>{k}</span>
      <span style={{ fontWeight:700, fontSize:14, color:"#111827" }}>{v}</span>
    </div>
  );

  return (
    <div style={{ minHeight:"100vh", background:"linear-gradient(135deg,#eef4fb,#e1f5ee)", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:24, fontFamily:"'Plus Jakarta Sans',sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700;800&display=swap');
        *{box-sizing:border-box;}
        .kb:hover{transform:translateY(-1px);box-shadow:0 6px 20px rgba(0,0,0,0.12);}
        .kb:disabled{opacity:0.5;cursor:not-allowed;}
        .kinput{width:100%;border:2px solid #dde3ef;border-radius:12px;padding:14px;font-size:22px;font-family:inherit;font-weight:700;text-align:center;letter-spacing:6px;outline:none;transition:all 0.2s;}
        .kinput:focus{border-color:#1a7a6e;box-shadow:0 0 0 4px rgba(26,122,110,0.1);}
        .kinput.err{border-color:#ef4444;background:#fef2f2;}
        @keyframes fadeUp{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)}}
        .fade{animation:fadeUp 0.3s ease;}
      `}</style>

      {/* Header */}
      <div style={{ textAlign:"center", marginBottom:24 }}>
        <div style={{ width:64,height:64,borderRadius:18,background:"linear-gradient(135deg,#1a7a6e,#002B6B)",display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 12px",fontSize:32 }}>🏥</div>
        <h1 style={{ fontSize:26,fontWeight:800,color:"#002B6B",margin:0 }}>Patient Check-In</h1>
        <p style={{ color:"#6b7280",margin:"4px 0 0",fontSize:14 }}>Walk-in or confirm your appointment</p>
      </div>

      {/* HOME */}
      {screen === "home" && (
        <div style={card} className="fade">
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16 }}>
            <button className="kb" onClick={() => setScreen("walkin_phone")}
              style={{ ...btn("linear-gradient(135deg,#1a7a6e,#0d5c52)"), padding:"28px 16px", borderRadius:18, textAlign:"center" }}>
              <div style={{ fontSize:44,marginBottom:10 }}>🚶</div>
              <div style={{ fontSize:17,marginBottom:6 }}>Walk-in</div>
              <div style={{ fontSize:12,opacity:0.85,fontWeight:400 }}>No appointment?<br/>Get token now</div>
            </button>
            <button className="kb" onClick={() => setScreen("appt_phone")}
              style={{ ...btn("linear-gradient(135deg,#002B6B,#0044a8)"), padding:"28px 16px", borderRadius:18, textAlign:"center" }}>
              <div style={{ fontSize:44,marginBottom:10 }}>📅</div>
              <div style={{ fontSize:17,marginBottom:6 }}>Appointment</div>
              <div style={{ fontSize:12,opacity:0.85,fontWeight:400 }}>Have a booking?<br/>Check in here</div>
            </button>
          </div>
        </div>
      )}

      {/* PHONE INPUT */}
      {(screen === "walkin_phone" || screen === "appt_phone") && (
        <div style={card} className="fade">
          <div style={{ textAlign:"center", marginBottom:24 }}>
            <div style={{ fontSize:48,marginBottom:8 }}>{screen==="walkin_phone"?"🚶":"📅"}</div>
            <h2 style={{ fontSize:20,fontWeight:800,color:"#111827",margin:"0 0 4px" }}>
              {screen==="walkin_phone" ? "Walk-in Check-in" : "Appointment Check-in"}
            </h2>
            <p style={{ color:"#6b7280",fontSize:14,margin:0 }}>Enter your registered mobile number</p>
          </div>
          <input ref={phoneRef} className={`kinput${phoneErr?" err":""}`}
            type="tel" inputMode="numeric" maxLength={10} value={phone} placeholder="0000000000"
            onChange={e=>{setPhone(e.target.value.replace(/\D/g,"").slice(0,10));setPhoneErr("");}}
            onKeyDown={e=>{if(e.key==="Enter") screen==="walkin_phone"?handleWalkinPhone():handleApptPhone();}}
          />
          {phoneErr && <p style={{ color:"#ef4444",fontSize:13,textAlign:"center",marginTop:6 }}>{phoneErr}</p>}
          <div style={{ display:"flex",gap:12,marginTop:20 }}>
            <button className="kb" onClick={resetAll} style={{ ...btn("#f1f5f9","#374151"), flex:1 }}>← Back</button>
            <button className="kb" onClick={screen==="walkin_phone"?handleWalkinPhone:handleApptPhone}
              disabled={loading||phone.length!==10}
              style={{ ...btn(screen==="walkin_phone"?"#1a7a6e":"#002B6B"), flex:2 }}>
              {loading?"⏳ Searching...":"Next →"}
            </button>
          </div>
        </div>
      )}

      {/* WALK-IN CONFIRM */}
      {screen === "walkin_confirm" && (
        <div style={card} className="fade">
          <div style={{ textAlign:"center",marginBottom:20 }}>
            <div style={{ fontSize:48,marginBottom:8 }}>🎫</div>
            <h2 style={{ fontSize:20,fontWeight:800,color:"#111827",margin:0 }}>Confirm Walk-in</h2>
          </div>
          <div style={{ background:"#f8faff",borderRadius:14,padding:"4px 16px",marginBottom:24 }}>
            {row("Patient", patient?.PatientName||"Walk-in Patient")}
            {row("Mobile",  phone)}
            {row("Type",    "Walk-in")}
            {row("Date",    new Date().toLocaleDateString("en-GB"))}
            {row("Time",    new Date().toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"}))}
          </div>
          <div style={{ display:"flex",gap:12 }}>
            <button className="kb" onClick={()=>setScreen("walkin_phone")} style={{ ...btn("#f1f5f9","#374151"),flex:1 }}>← Back</button>
            <button className="kb" onClick={handleWalkinConfirm} disabled={loading} style={{ ...btn("#1a7a6e"),flex:2 }}>
              {loading?"⏳ Generating...":"🎫 Get Token"}
            </button>
          </div>
        </div>
      )}

      {/* APPOINTMENT LIST */}
      {screen === "appt_list" && (
        <div style={{...card,maxWidth:580}} className="fade">
          <h2 style={{ fontSize:18,fontWeight:800,color:"#111827",margin:"0 0 4px" }}>Your Appointments</h2>
          <p style={{ color:"#6b7280",fontSize:13,margin:"0 0 20px" }}>📞 {phone}</p>
          {appointments.length===0 ? (
            <div style={{ textAlign:"center",padding:"32px 0" }}>
              <div style={{ fontSize:48,marginBottom:12 }}>😔</div>
              <p style={{ fontWeight:700,color:"#374151",margin:"0 0 4px" }}>No appointments found</p>
              <p style={{ color:"#9ca3af",fontSize:13,margin:"0 0 20px" }}>for mobile {phone}</p>
              <button className="kb" onClick={()=>{resetAll();setTimeout(()=>setScreen("walkin_phone"),50);}}
                style={{ ...btn("#1a7a6e"),padding:"12px 24px" }}>→ Walk-in Instead</button>
            </div>
          ) : (
            <div style={{ display:"flex",flexDirection:"column",gap:10,marginBottom:20 }}>
              {appointments.map((a,i)=>(
                <button key={i} className="kb" onClick={()=>{setSelAppt(a);setScreen("appt_confirm");}}
                  style={{ padding:16,textAlign:"left",border:`2px solid ${selAppt?.SLNO===a.SLNO?"#002B6B":"#e5e7eb"}`,background:selAppt?.SLNO===a.SLNO?"#eff6ff":"white",borderRadius:14 }}>
                  <div style={{ display:"flex",justifyContent:"space-between",alignItems:"flex-start" }}>
                    <div>
                      <div style={{ fontWeight:700,fontSize:15,color:"#111827" }}>{a.DoctorName||"Doctor"}</div>
                      <div style={{ fontSize:13,color:"#6b7280",marginTop:2 }}>{a.DepartmentName}</div>
                      {a.AppointmentDateTime&&(
                        <div style={{ fontSize:13,color:"#4338ca",fontWeight:600,marginTop:4 }}>
                          📅 {new Date(a.AppointmentDateTime).toLocaleDateString("en-GB")} · {new Date(a.AppointmentDateTime).toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"})}
                        </div>
                      )}
                    </div>
                    <div style={{ textAlign:"right" }}>
                      <span style={{ background:"#e0e7ff",color:"#3730a3",padding:"2px 8px",borderRadius:50,fontSize:12,fontWeight:700 }}>
                        {a.AppointNumber||`#${a.SLNO}`}
                      </span>
                      <p style={{ fontSize:12,color:"#16a34a",fontWeight:700,marginTop:4 }}>Confirm →</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
          <button className="kb" onClick={resetAll} style={{ ...btn("#f1f5f9","#6b7280"),width:"100%" }}>← Back</button>
        </div>
      )}

      {/* APPOINTMENT CONFIRM */}
      {screen === "appt_confirm" && selAppt && (
        <div style={card} className="fade">
          <div style={{ textAlign:"center",marginBottom:20 }}>
            <div style={{ fontSize:48,marginBottom:8 }}>📋</div>
            <h2 style={{ fontSize:20,fontWeight:800,color:"#111827",margin:0 }}>Confirm Appointment</h2>
          </div>
          <div style={{ background:"#eff6ff",borderRadius:14,padding:"4px 16px",marginBottom:24,border:"1px solid #c7d2fe" }}>
            {row("Patient",    selAppt.PatientName||patient?.PatientName)}
            {row("Doctor",     selAppt.DoctorName)}
            {row("Department", selAppt.DepartmentName)}
            {row("Date",       selAppt.AppointmentDateTime?new Date(selAppt.AppointmentDateTime).toLocaleDateString("en-GB"):"—")}
            {row("Time",       selAppt.AppointmentDateTime?new Date(selAppt.AppointmentDateTime).toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"}):"—")}
            {row("Appt No.",   selAppt.AppointNumber||`#${selAppt.SLNO}`)}
          </div>
          <div style={{ display:"flex",gap:12 }}>
            <button className="kb" onClick={()=>setScreen("appt_list")} style={{ ...btn("#f1f5f9","#374151"),flex:1 }}>← Back</button>
            <button className="kb" onClick={handleApptConfirm} disabled={loading} style={{ ...btn("#002B6B"),flex:2 }}>
              {loading?"⏳ Generating...":"🎫 Get Token"}
            </button>
          </div>
        </div>
      )}

      {/* TOKEN ISSUED */}
      {screen === "token_issued" && (
        <div style={card} className="fade">
          {/* Ticket preview — client format */}
          <div style={{ border:"2px dashed #374151",borderRadius:8,padding:"14px 20px",marginBottom:20,background:"#fff",fontFamily:"'Courier New',monospace",maxWidth:300,margin:"0 auto 20px" }}>
            <div style={{ borderBottom:"1px dashed #374151",paddingBottom:6,marginBottom:6,textAlign:"center" }}>
              <strong style={{ fontSize:15,textTransform:"uppercase" }}>
                {tokenInfo?.type==="Appointment"?(tokenInfo?.dept||"General"):"Walk-in"}
              </strong>
            </div>
            <div style={{ fontSize:56,fontWeight:900,textAlign:"center",letterSpacing:3,lineHeight:1.1,margin:"6px 0" }}>
              {tokenNumber}
            </div>
            {tokenInfo?.type==="Appointment"&&tokenInfo?.doctor&&(
              <p style={{ fontSize:13,fontWeight:700,textAlign:"center",margin:"3px 0" }}>Doctor:{tokenInfo.doctor}</p>
            )}
            {tokenInfo?.room&&(
              <p style={{ fontSize:12,textAlign:"center",margin:"2px 0" }}>Serving in Room No.{tokenInfo.room}</p>
            )}
            <p style={{ fontSize:12,textAlign:"center",margin:"4px 0" }}>{tokenInfo?.date} {tokenInfo?.time}</p>
            <p style={{ fontSize:13,fontWeight:700,textAlign:"center",margin:"3px 0" }}>Patient Waiting {waitingCount}</p>
            <div style={{ borderTop:"1px dashed #374151",borderBottom:"1px dashed #374151",padding:"6px 0",margin:"6px 0",textAlign:"center",fontSize:24 }}>🏥</div>
            <p style={{ fontSize:13,fontWeight:700,textAlign:"center",margin:"2px 0" }}>{CLINIC.name}</p>
            <p style={{ fontSize:11,textAlign:"center",margin:"1px 0" }}>{CLINIC.address}</p>
            <p style={{ fontSize:11,textAlign:"center",margin:"1px 0" }}>{CLINIC.tagline}</p>
            <div style={{ borderTop:"1px dashed #374151",marginTop:6 }}></div>
          </div>

          <p style={{ color:"#6b7280",fontSize:13,textAlign:"center",marginBottom:16 }}>
            Please wait for your token to be called at the counter
          </p>

          <div style={{ display:"flex",gap:12,maxWidth:320,margin:"0 auto" }}>
            <button className="kb" onClick={printTicket}
              style={{ ...btn("#002B6B"),flex:1,display:"flex",alignItems:"center",justifyContent:"center",gap:8 }}>
              🖨️ Print Ticket
            </button>
            <button className="kb" onClick={resetAll}
              style={{ ...btn("#1a7a6e"),flex:1,display:"flex",alignItems:"center",justifyContent:"center",gap:8 }}>
              ✅ New Check-in
            </button>
          </div>
        </div>
      )}
    </div>
  );
}