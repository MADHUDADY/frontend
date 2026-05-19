// src/pages/KioskPage.tsx — PUBLIC KIOSK PAGE
// No login required | Queue-Soft API for tokens | Our API for appointments
// v3 — MEDSOFT_ID (DHA license) passed as hisid to Queue-Soft API

import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import axios from "axios";

const QMS_API   = "https://api.keypadticket.queue-soft.com/api";
const OUR_API   = "https://backend-production-2df7.up.railway.app/api";
const CLINIC_ID = 101;

type Screen =
  | "home"
  | "walkin_confirm"
  | "appt_phone" | "appt_list" | "appt_confirm"
  | "ticket";

// ── CHANGE 1: medsoft_id added to Doctor type ─────────────────────────────────
type Doctor = {
  doctorid:    string;
  doctornamen: string;
  departmentid: string;
  departmenten: string;
  docimage:    string;
  walkincount: number;
  roomname:    string;
  medsoft_id:  string;   // ← DHA license number (hisid for Queue-Soft)
};

type Department = {
  id:   string;
  name: string;
};

type TicketInfo = {
  number:    string;
  typeLabel: string;
  doctorName:  string;
  department:  string;
  room:        string;
  date:        string;
  time:        string;
  waiting:     number;
};

type Appt = {
  SLNO:                number;
  AppointNumber:       string;
  PatientName:         string;
  DoctorName:          string;
  DepartmentName:      string;
  AppointmentDateTime: string;
  PatientId:           number;
  DoctorId:            number;
};

const TYPES = [
  { key: "W", label: "Walk In",     bg: "#0f2027" },
  { key: "A", label: "Appointment", bg: "#1a3a5c" },
  { key: "R", label: "Report",      bg: "#1a2a4a" },
  { key: "V", label: "VIP",         bg: "#3d1a6e" },
];

export default function KioskPage() {
  const [screen,       setScreen]       = useState<Screen>("home");
  const [allDoctors,   setAllDoctors]   = useState<Doctor[]>([]);
  const [departments,  setDepartments]  = useState<Department[]>([]);
  const [selDept,      setSelDept]      = useState<string>("all");
  const [loading,      setLoading]      = useState(true);
  const [clinic,       setClinic]       = useState({
    name:    "Paradise Medical Center",
    address: "DIP, Dubai",
    tagline: "Dedication meets healing",
  });
  const [selDoctor,    setSelDoctor]    = useState<Doctor | null>(null);
  const [selType,      setSelType]      = useState("");
  const [phone,        setPhone]        = useState("");
  const [phoneErr,     setPhoneErr]     = useState("");
  const [appointments, setAppointments] = useState<Appt[]>([]);
  const [selAppt,      setSelAppt]      = useState<Appt | null>(null);
  const [ticket,       setTicket]       = useState<TicketInfo | null>(null);
  const [busy,         setBusy]         = useState(false);
  const [clock,        setClock]        = useState(new Date());
  const phoneRef   = useRef<HTMLInputElement>(null);
  const deptScroll = useRef<HTMLDivElement>(null);

  // Live clock
  useEffect(() => {
    const t = setInterval(() => setClock(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  // Load clinic info from our API
  useEffect(() => {
    axios.get(`${OUR_API}/clinic`).then(r => {
      const d = r.data?.data;
      if (d) setClinic({
        name:    d.COMPANYNAME    || "Paradise Medical Center",
        address: d.COMPANYADDRESS || "DIP, Dubai",
        tagline: d.KIOSKMESSAGE1  || "Dedication meets healing",
      });
    }).catch(() => {});
  }, []);

  // ── CHANGE 2: Load doctors from OUR API (with MEDSOFT_ID) ────────────────────
  useEffect(() => {
    setLoading(true);
    const loadDocs = async () => {
      try {
        let docs: Doctor[] = [];

        // Primary: our own backend — includes MEDSOFT_ID (DHA license)
        try {
          const r = await axios.get(`${OUR_API}/doctors/byclinic/${CLINIC_ID}/all`);
          const data = r.data?.data || [];
          docs = data.map((d: any) => ({
            doctorid:     String(d.SERVICEID),
            doctornamen:  d.SERVICE_E,
            departmentid: String(d.CATEGORYID),
            departmenten: d.CATEGORYE || "",
            docimage:     d.PHOTO     || "",
            walkincount:  0,
            roomname:     d.ROOMNAME  || "",
            medsoft_id:   d.MEDSOFT_ID || "",  // ← DHA license
          }));
        } catch {}

        // Fallback: Queue-Soft doctordetailskiosk (no MEDSOFT_ID available here)
        if (!docs.length) {
          try {
            const r2 = await axios.get(`${QMS_API}/ticket/doctordetailskiosk?clinicId=${CLINIC_ID}`);
            docs = (r2.data || []).map((d: any) => ({
              doctorid:     String(d.doctorid),
              doctornamen:  d.doctornamen,
              departmentid: String(d.departmentid),
              departmenten: d.departmenten,
              docimage:     d.docimage || "",
              walkincount:  0,
              roomname:     "",
              medsoft_id:   "",  // not available from Queue-Soft kiosk API
            }));
          } catch {}
        }

        // Second fallback: servicelistbycenter
        if (!docs.length) {
          try {
            const r3 = await axios.get(`${QMS_API}/Service/servicelistbycenter?centerid=${CLINIC_ID}`);
            docs = (r3.data || []).map((s: any) => ({
              doctorid:     String(s.serviceid),
              doctornamen:  s.servicE_E,
              departmentid: String(s.categoryid),
              departmenten: "",
              docimage:     "",
              walkincount:  s.walkincount || 0,
              roomname:     s.roomname || "",
              medsoft_id:   "",
            }));
          } catch {}
        }

        setAllDoctors(docs);

        // Build departments list
        const deptMap = new Map<string, string>();
        docs.forEach(d => {
          if (d.departmentid && d.departmenten)
            deptMap.set(d.departmentid, d.departmenten);
        });

        // Also try QMS categories
        try {
          const cr = await axios.get(`${QMS_API}/Category/categorylistbycenter?centerid=${CLINIC_ID}`);
          (cr.data || []).forEach((c: any) => {
            deptMap.set(String(c.categoryid), c.categorye);
          });
        } catch {}

        // Fallback: our categories API
        if (deptMap.size === 0) {
          try {
            const cr2 = await axios.get(`${OUR_API}/categories/byclinic/${CLINIC_ID}`);
            (cr2.data?.data || []).forEach((c: any) => {
              deptMap.set(String(c.CATEGORYID), c.CATEGORYE);
            });
          } catch {}
        }

        const depts: Department[] = Array.from(deptMap.entries())
          .map(([id, name]) => ({ id, name }))
          .sort((a, b) => a.name.localeCompare(b.name));
        setDepartments(depts);

      } catch {}
      finally { setLoading(false); }
    };
    loadDocs();
  }, []);

  // Filtered doctors by department
  const doctors = useMemo(() => {
    if (selDept === "all") return allDoctors;
    return allDoctors.filter(d => d.departmentid === selDept);
  }, [allDoctors, selDept]);

  // Auto focus phone input
  useEffect(() => {
    if (screen === "appt_phone") setTimeout(() => phoneRef.current?.focus(), 100);
  }, [screen]);

  // Auto reset after 45s on ticket screen
  useEffect(() => {
    if (screen !== "ticket") return;
    const t = setTimeout(reset, 45000);
    return () => clearTimeout(t);
  }, [screen]);

  const reset = useCallback(() => {
    setScreen("home"); setSelDoctor(null); setSelType("");
    setPhone(""); setPhoneErr(""); setAppointments([]);
    setSelAppt(null); setTicket(null); setBusy(false);
  }, []);

  const handleSelect = (doc: Doctor, type: string) => {
    setSelDoctor(doc); setSelType(type);
    setScreen(type === "A" ? "appt_phone" : "walkin_confirm");
  };

  // ── CHANGE 3: issueToken — hisid = doctor's MEDSOFT_ID (DHA license) ─────────
  const issueToken = async (type: string, doc: Doctor, appt?: Appt) => {
    setBusy(true);
    try {
      let num      = "";
      let waiting  = 0;
      let doctorName  = doc.doctornamen;
      let deptName    = doc.departmenten;

      try {
        const res = await axios.post(`${QMS_API}/ticket/newticketdoctor`, {
          serviceID:   String(doc.doctorid),
          hisid:       doc.medsoft_id || "",   // ← DHA license number
          ticketType:  type,
          clinicID:    String(CLINIC_ID),
          appTime:     new Date().toISOString().split("T")[0],
          opdate:      new Date().toISOString().split("T")[0],
          regNo:       appt?.AppointNumber || "",
          pName:       appt?.PatientName   || "",
          reception:   "",
          opnumber:    "",
          opreference: "",
          mobile:      phone || "",
        });

        // Client response format: newTicket, waiting, doctorName, departmentName
        num        = res.data?.newTicket      || res.data?.ticketnumber || "";
        waiting    = Number(res.data?.waiting || 0);
        doctorName = res.data?.doctorName     || doc.doctornamen;
        deptName   = res.data?.departmentName || doc.departmenten;

      } catch (err) {
        console.warn("Queue-Soft API failed, using fallback ticket number", err);
      }

      // Fallback ticket number if Queue-Soft fails
      if (!num) {
        const pfx: Record<string, string> = { W: "WK", A: "AP", R: "RP", V: "VP" };
        num = `${pfx[type] || "TK"}${Math.floor(Math.random() * 89) + 10}`;
      }

      const now = new Date();
      setTicket({
        number:    num,
        typeLabel: TYPES.find(t => t.key === type)?.label || type,
        doctorName:  doctorName,
        department:  deptName,
        room:        doc.roomname,
        date: now.toLocaleDateString("en-GB",  { day: "2-digit", month: "2-digit", year: "2-digit" }),
        time: now.toLocaleTimeString("en-GB",  { hour: "2-digit", minute: "2-digit", second: "2-digit" }),
        waiting,
      });
      setScreen("ticket");

    } finally { setBusy(false); }
  };

  const searchAppointments = async () => {
    if (phone.length < 8) { setPhoneErr("Enter a valid mobile number"); return; }
    setPhoneErr(""); setBusy(true);
    try {
      const [pr, ar] = await Promise.all([
        axios.get(`${OUR_API}/appointments/search-patient/${phone}`),
        axios.get(`${OUR_API}/appointments/new-list`),
      ]);
      const slno = (pr.data?.data || [])[0]?.SLNO;
      const mine = (ar.data?.data || []).filter((a: any) =>
        a.PatientId === slno || (selDoctor && String(a.DoctorId) === selDoctor.doctorid)
      );
      setAppointments(mine);
      setScreen("appt_list");
    } catch {
      setAppointments([]);
      setScreen("appt_list");
    } finally { setBusy(false); }
  };

  const printTicket = () => {
    if (!ticket) return;
    const w = window.open("", "_blank", "width=320,height=600");
    if (!w) return;
    w.document.write(`<!DOCTYPE html><html><head><title>Token</title>
<style>
  /* ── 80mm thermal printer ── */
  @media print {
    @page {
      size: 80mm auto;
      margin: 4mm;
    }
    body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
  }
  * { margin:0; padding:0; box-sizing:border-box; }
  body {
    font-family: 'Arial', sans-serif;
    width: 72mm;
    margin: 0 auto;
    padding: 4mm 2mm;
    font-size: 12px;
    color: #000;
  }
  /* Header */
  .header {
    text-align: center;
    border-bottom: 2px solid #000;
    padding-bottom: 6px;
    margin-bottom: 6px;
  }
  .clinic-name {
    font-size: 15px;
    font-weight: 900;
    text-transform: uppercase;
    letter-spacing: 1px;
  }
  .tagline {
    font-size: 10px;
    font-style: italic;
    color: #333;
    margin-top: 2px;
  }
  /* Divider */
  .d { border-top: 1px dashed #555; margin: 5px 0; }
  /* Center */
  .c { text-align: center; }
  /* Department */
  .dept {
    text-align: center;
    font-size: 13px;
    font-weight: 700;
    margin: 4px 0;
  }
  /* Token number — BIG */
  .tok {
    text-align: center;
    font-size: 58px;
    font-weight: 900;
    letter-spacing: 3px;
    line-height: 1.1;
    margin: 6px 0;
  }
  /* Doctor / Patient */
  .doc {
    text-align: center;
    font-size: 12px;
    font-weight: 700;
    margin: 3px 0;
  }
  /* Room */
  .room {
    text-align: center;
    font-size: 11px;
    font-weight: 600;
    margin: 2px 0;
  }
  /* Date/time, waiting */
  .info {
    text-align: center;
    font-size: 11px;
    margin: 2px 0;
  }
  .waiting {
    text-align: center;
    font-size: 12px;
    font-weight: 700;
    margin: 3px 0;
  }
  /* Footer */
  .footer {
    text-align: center;
    border-top: 2px solid #000;
    padding-top: 5px;
    margin-top: 5px;
  }
  .footer-clinic {
    font-size: 12px;
    font-weight: 900;
    text-transform: uppercase;
  }
  .footer-addr {
    font-size: 10px;
    color: #333;
    margin: 2px 0;
  }
  .thanks {
    font-size: 11px;
    font-weight: 700;
    margin-top: 5px;
  }
</style></head><body>

<!-- HEADER -->
<div class="header">
  <div class="clinic-name">${clinic.name}</div>
  <div class="tagline">${clinic.tagline}</div>
</div>

<div class="d"></div>

<!-- DEPARTMENT -->
${ticket.department ? `<div class="dept">${ticket.department}</div>` : `<div class="dept">${ticket.typeLabel}</div>`}

<div class="d"></div>

<!-- TOKEN NUMBER -->
<div class="tok">${ticket.number}</div>

<div class="d"></div>

<!-- DOCTOR -->
${ticket.doctorName ? `<div class="doc">${ticket.doctorName}</div>` : ""}

<!-- ROOM -->
${ticket.room ? `<div class="room">Serving in Room No.${ticket.room}</div>` : ""}

<!-- DATE TIME -->
<div class="info">${ticket.date} &nbsp; ${ticket.time}</div>

<!-- WAITING -->
<div class="waiting">Patient Waiting: ${ticket.waiting}</div>

<div class="d"></div>

<!-- FOOTER -->
<div class="footer">
  <div class="footer-clinic">${clinic.name}</div>
  <div class="footer-addr">${clinic.address}</div>
  <div class="thanks">Thanks You For Visit</div>
</div>

<script>window.onload=()=>{window.print();setTimeout(()=>window.close(),800);}<\/script>
</body></html>`);
    w.document.close();
  };

  const fmtDT = (dt: string) => {
    const d = new Date(dt);
    return `${d.toLocaleDateString("en-GB")} · ${d.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })}`;
  };

  // ── RENDER ──────────────────────────────────────────────────────────────────
  return (
    <div style={S.root}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400&family=DM+Serif+Display&display=swap');
        *{box-sizing:border-box;}
        .kb{transition:all 0.17s ease;cursor:pointer;font-family:'DM Sans',sans-serif;}
        .kb:hover{filter:brightness(1.1);transform:translateY(-1px);}
        .kb:active{transform:scale(0.98);filter:brightness(0.95);}
        .kb:disabled{opacity:0.45;cursor:not-allowed;transform:none;filter:none;}
        .dc{background:#fff;border-radius:20px;padding:22px 16px 16px;display:flex;flex-direction:column;
            align-items:center;box-shadow:0 2px 16px rgba(15,32,60,0.07);border:1px solid #e8edf5;transition:all 0.22s ease;}
        .dc:hover{box-shadow:0 8px 36px rgba(15,32,60,0.14);transform:translateY(-3px);}
        .fa{animation:fadeUp 0.32s ease both;}
        @keyframes fadeUp{from{opacity:0;transform:translateY(18px)}to{opacity:1;transform:none}}
        .ki{width:100%;border:2px solid #dde3ef;border-radius:14px;padding:15px;font-size:22px;
            font-family:'DM Sans',sans-serif;font-weight:700;text-align:center;letter-spacing:5px;
            outline:none;transition:border 0.2s,box-shadow 0.2s;background:#fafbff;}
        .ki:focus{border-color:#1a4a8a;box-shadow:0 0 0 4px rgba(26,74,138,0.1);}
        .ki.err{border-color:#e53935;background:#fff5f5;}
        .ar{background:#fff;border:1.5px solid #e8edf5;border-radius:14px;padding:15px 18px;
            display:flex;align-items:center;gap:14px;cursor:pointer;transition:all 0.18s;}
        .ar:hover{border-color:#1a4a8a;box-shadow:0 4px 18px rgba(26,74,138,0.1);}
        .dept-pill{display:inline-flex;align-items:center;padding:7px 16px;border-radius:50px;
            font-size:13px;font-weight:600;cursor:pointer;border:2px solid transparent;transition:all 0.18s;
            white-space:nowrap;}
        .dept-pill.active{background:#0f2027;color:#fff;border-color:#0f2027;}
        .dept-pill:not(.active){background:#fff;color:#374151;border-color:#dde3ef;}
        .dept-pill:not(.active):hover{border-color:#1a4a8a;color:#1a4a8a;}
        .dept-pills-wrap{display:flex;flex-wrap:nowrap;gap:8px;flex:1;overflow-x:auto;
            scrollbar-width:none;-ms-overflow-style:none;padding-bottom:2px;cursor:grab;}
        .dept-pills-wrap:active{cursor:grabbing;}
        .dept-pills-wrap::-webkit-scrollbar{display:none;}
        @keyframes spin{to{transform:rotate(360deg)}}
      `}</style>

      {/* TOP BAR */}
      <div style={S.bar}>
        <div style={S.barL}>
          <div style={S.barClinic}>{clinic.name}</div>
          <div style={S.barAddr}>{clinic.address}</div>
        </div>
        <div style={S.barC}>
          <div style={S.barTime}>
            {clock.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
          </div>
          <div style={S.barDate}>
            {clock.toLocaleDateString("en-GB", { weekday: "long", day: "2-digit", month: "long", year: "numeric" })}
          </div>
        </div>
        <div style={S.barR}>
          <div style={S.barMsg}>Please select your choice</div>
          <div style={S.barTag}>{clinic.tagline}</div>
        </div>
      </div>

      {/* MAIN */}
      <div style={S.main}>

        {/* HOME */}
        {screen === "home" && (
          <div className="fa" style={{ width: "100%", maxWidth: 1280 }}>
            {loading ? (
              <div style={S.lw}>
                <div style={S.spin} />
                <p style={{ color: "#6b7280", marginTop: 16, fontFamily: "'DM Sans',sans-serif" }}>Loading...</p>
              </div>
            ) : (
              <>
                {/* Department Filter */}
                {departments.length > 0 && (
                  <div style={S.deptBar}>
                    <span style={S.deptLabel}>Department:</span>
                    <div style={{ position: "relative", flex: 1, minWidth: 0 }}>
                      <div style={{ position:"absolute",left:0,top:0,bottom:0,width:40,
                        background:"linear-gradient(to left, transparent, #fff)",
                        display:"flex",alignItems:"center",pointerEvents:"none",zIndex:1 }}>
                        <span style={{ fontSize:20,color:"#1a4a8a",fontWeight:700,marginLeft:2,opacity:0.7 }}>‹</span>
                      </div>
                      <div ref={deptScroll} className="dept-pills-wrap" style={{ paddingLeft:20,paddingRight:20 }}>
                        <span className={`dept-pill${selDept==="all"?" active":""}`} onClick={() => setSelDept("all")}>
                          All ({allDoctors.length})
                        </span>
                        {departments.map(dept => {
                          const count = allDoctors.filter(d => d.departmentid === dept.id).length;
                          if (!count) return null;
                          return (
                            <span key={dept.id}
                              className={`dept-pill${selDept===dept.id?" active":""}`}
                              onClick={() => setSelDept(dept.id)}>
                              {dept.name} ({count})
                            </span>
                          );
                        })}
                      </div>
                      <div style={{ position:"absolute",right:0,top:0,bottom:0,width:40,
                        background:"linear-gradient(to right, transparent, #fff)",
                        display:"flex",alignItems:"center",justifyContent:"flex-end",pointerEvents:"none",zIndex:1 }}>
                        <span style={{ fontSize:20,color:"#1a4a8a",fontWeight:700,marginRight:2,opacity:0.8 }}>›</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Doctor Grid */}
                {doctors.length === 0 ? (
                  <div style={S.lw}>
                    <p style={{ fontSize: 48, margin: "0 0 12px" }}>🔍</p>
                    <p style={{ color: "#6b7280", fontFamily: "'DM Sans',sans-serif", fontWeight: 600 }}>
                      No doctors in this department
                    </p>
                    <button className="kb" onClick={() => setSelDept("all")}
                      style={{ ...S.bpri, marginTop: 16, padding: "10px 24px", flex: "none" }}>
                      Show All Doctors
                    </button>
                  </div>
                ) : (
                  <div style={S.grid}>
                    {doctors.map((doc, i) => (
                      <div key={doc.doctorid} className="dc" style={{ animationDelay: `${i * 0.04}s` }}>
                        <div style={S.av}>
                          {doc.docimage ? (
                            <img src={doc.docimage.startsWith("data:") ? doc.docimage : `data:image/jpeg;base64,${doc.docimage}`}
                              style={S.avImg} alt={doc.doctornamen} />
                          ) : (
                            <DoctorSVG />
                          )}
                        </div>
                        <div style={S.dname}>{doc.doctornamen}</div>
                        {doc.departmenten && <div style={S.ddept}>{doc.departmenten}</div>}
                        {doc.medsoft_id && (
                          <div style={{ fontSize:10, color:"#9ca3af", marginBottom:6 }}>
                            🪪 {doc.medsoft_id}
                          </div>
                        )}
                        <div style={S.dstats}>
                          <span>Waiting: <b>{doc.walkincount}</b></span>
                          {doc.roomname && <span>Room: <b>{doc.roomname}</b></span>}
                        </div>
                        <div style={S.dbg}>
                          {TYPES.map(tp => (
                            <button key={tp.key} className="kb"
                              onClick={() => handleSelect(doc, tp.key)}
                              style={{ ...S.tbtn, background: tp.bg }}>
                              {tp.label}
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {/* WALK-IN CONFIRM */}
        {screen === "walkin_confirm" && selDoctor && (
          <div className="fa" style={S.card}>
            <div style={S.cicon}>{selType==="R"?"📋":selType==="V"?"👑":"🚶"}</div>
            <h2 style={S.ctitle}>Confirm {TYPES.find(t => t.key===selType)?.label}</h2>
            <div style={S.ib}>
              <IR label="Doctor"     value={selDoctor.doctornamen} />
              {selDoctor.departmenten && <IR label="Department" value={selDoctor.departmenten} />}
              {selDoctor.roomname     && <IR label="Room"       value={selDoctor.roomname} />}
              {selDoctor.medsoft_id   && <IR label="DHA License" value={selDoctor.medsoft_id} />}
              <IR label="Type" value={TYPES.find(t => t.key===selType)?.label || ""} />
              <IR label="Date" value={new Date().toLocaleDateString("en-GB")} />
              <IR label="Time" value={new Date().toLocaleTimeString("en-GB", { hour:"2-digit", minute:"2-digit" })} />
            </div>
            <div style={S.rbtn}>
              <button className="kb" onClick={reset} style={S.bback}>← Back</button>
              <button className="kb" disabled={busy} style={S.bpri}
                onClick={() => issueToken(selType, selDoctor)}>
                {busy ? "Getting Token..." : "Get Token →"}
              </button>
            </div>
          </div>
        )}

        {/* APPT PHONE */}
        {screen === "appt_phone" && (
          <div className="fa" style={S.card}>
            <div style={S.cicon}>📅</div>
            <h2 style={S.ctitle}>Appointment Check-in</h2>
            {selDoctor && <p style={S.csub}>{selDoctor.doctornamen}</p>}
            <p style={{ ...S.csub, marginBottom: 20 }}>Enter your registered mobile number</p>
            <input ref={phoneRef}
              className={`ki${phoneErr ? " err" : ""}`}
              type="tel" inputMode="numeric"
              maxLength={15} value={phone} placeholder="0501234567"
              onChange={e => { setPhone(e.target.value.replace(/\D/g, "")); setPhoneErr(""); }}
              onKeyDown={e => { if (e.key === "Enter") searchAppointments(); }}
            />
            {phoneErr && <p style={S.errtxt}>{phoneErr}</p>}
            <div style={{ ...S.rbtn, marginTop: 20 }}>
              <button className="kb" onClick={reset} style={S.bback}>← Back</button>
              <button className="kb" disabled={busy || phone.length < 8} style={S.bpri}
                onClick={searchAppointments}>
                {busy ? "Searching..." : "Search →"}
              </button>
            </div>
          </div>
        )}

        {/* APPT LIST */}
        {screen === "appt_list" && (
          <div className="fa" style={{ ...S.card, maxWidth: 560 }}>
            <div style={S.cicon}>📋</div>
            <h2 style={S.ctitle}>Your Appointments</h2>
            <p style={S.csub}>Mobile: {phone}</p>
            {appointments.length === 0 ? (
              <div style={{ textAlign: "center", padding: "20px 0 8px" }}>
                <p style={{ fontWeight: 700, color: "#374151", marginBottom: 6 }}>No appointments found</p>
                <p style={{ color: "#9ca3af", fontSize: 13, marginBottom: 20 }}>Try walk-in instead</p>
                <button className="kb" style={{ ...S.bpri, padding: "12px 28px", flex: "none" }}
                  onClick={() => { setSelType("W"); setScreen("walkin_confirm"); }}>
                  Walk-in Instead
                </button>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 10, width: "100%", margin: "14px 0 20px" }}>
                {appointments.map((a, i) => (
                  <div key={i} className="ar" onClick={() => { setSelAppt(a); setScreen("appt_confirm"); }}>
                    <div style={{ background: "#1a4a8a", color: "#fff", borderRadius: 10, padding: "8px 14px",
                      fontWeight: 800, fontSize: 14, minWidth: 60, textAlign: "center" }}>
                      {a.AppointNumber || `#${a.SLNO}`}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 700, color: "#111827", fontSize: 14 }}>{a.PatientName || "Patient"}</div>
                      <div style={{ color: "#6b7280", fontSize: 12 }}>{a.DoctorName} · {a.DepartmentName}</div>
                      {a.AppointmentDateTime && (
                        <div style={{ color: "#2563eb", fontSize: 12, fontWeight: 600, marginTop: 2 }}>
                          {fmtDT(a.AppointmentDateTime)}
                        </div>
                      )}
                    </div>
                    <div style={{ color: "#9ca3af", fontSize: 22 }}>›</div>
                  </div>
                ))}
              </div>
            )}
            <button className="kb" onClick={() => setScreen("appt_phone")} style={{ ...S.bback, width: "100%" }}>← Back</button>
          </div>
        )}

        {/* APPT CONFIRM */}
        {screen === "appt_confirm" && selAppt && selDoctor && (
          <div className="fa" style={S.card}>
            <div style={S.cicon}>✅</div>
            <h2 style={S.ctitle}>Confirm Appointment</h2>
            <div style={S.ib}>
              <IR label="Patient"     value={selAppt.PatientName} />
              <IR label="Doctor"      value={selAppt.DoctorName} />
              <IR label="Department"  value={selAppt.DepartmentName} />
              <IR label="Date & Time" value={selAppt.AppointmentDateTime ? fmtDT(selAppt.AppointmentDateTime) : "—"} />
              <IR label="Appt No."    value={selAppt.AppointNumber || `#${selAppt.SLNO}`} />
            </div>
            <div style={S.rbtn}>
              <button className="kb" onClick={() => setScreen("appt_list")} style={S.bback}>← Back</button>
              <button className="kb" disabled={busy} style={S.bpri}
                onClick={() => issueToken("A", selDoctor, selAppt)}>
                {busy ? "Getting Token..." : "Get Token →"}
              </button>
            </div>
          </div>
        )}

        {/* TICKET ISSUED */}
        {screen === "ticket" && ticket && (
          <div className="fa" style={{ ...S.card, maxWidth: 400 }}>
            <div style={S.slip}>
              <div style={S.sd} />
              <div style={S.stype}>{ticket.typeLabel}</div>
              <div style={S.sd} />
              <div style={S.stok}>{ticket.number}</div>
              {ticket.department && <div style={S.sb}>{ticket.department}</div>}
              {ticket.doctorName && <div style={S.sb}>Doctor: {ticket.doctorName}</div>}
              {ticket.room       && <div style={S.ss}>Room No. {ticket.room}</div>}
              <div style={S.sd} />
              <div style={S.ss}>{ticket.date} &nbsp; {ticket.time}</div>
              <div style={S.sb}>Patient Waiting: {ticket.waiting}</div>
              <div style={S.sd} />
              <div style={{ textAlign: "center", fontSize: 24, margin: "4px 0" }}>🏥</div>
              <div style={S.sclinic}>{clinic.name}</div>
              <div style={S.ss}>{clinic.address}</div>
              <div style={S.ss}>{clinic.tagline}</div>
              <div style={S.sd} />
            </div>
            <p style={{ color: "#6b7280", fontSize: 13, textAlign: "center", margin: "14px 0 4px" }}>
              Please wait — your token will be called at the counter
            </p>
            <div style={S.rbtn}>
              <button className="kb" onClick={printTicket} style={S.bprint}>🖨️ Print</button>
              <button className="kb" onClick={reset} style={S.bpri}>New Check-in</button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

function IR({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", padding: "9px 0", borderBottom: "1px solid #f0f2f7" }}>
      <span style={{ color: "#6b7280", fontSize: 14 }}>{label}</span>
      <span style={{ fontWeight: 700, fontSize: 14, color: "#111827", textAlign: "right", maxWidth: "60%" }}>{value || "—"}</span>
    </div>
  );
}

function DoctorSVG() {
  return (
    <svg width="72" height="72" viewBox="0 0 80 80" fill="none">
      <circle cx="40" cy="26" r="16" fill="#d4e4f7"/>
      <circle cx="40" cy="24" r="11" fill="#c0a882"/>
      <rect x="33" y="35" width="14" height="5" rx="2.5" fill="#c0a882"/>
      <rect x="26" y="40" width="28" height="20" rx="8" fill="#1a4a8a"/>
      <rect x="35" y="40" width="10" height="6" rx="1" fill="white" opacity="0.35"/>
      <circle cx="34" cy="52" r="2.5" fill="white" opacity="0.6"/>
      <circle cx="46" cy="52" r="2.5" fill="white" opacity="0.6"/>
      <path d="M34 52 Q40 58 46 52" stroke="white" strokeWidth="1.5" fill="none" opacity="0.6"/>
    </svg>
  );
}

const S: Record<string, React.CSSProperties> = {
  root:    { minHeight:"100vh", background:"#f0f2f7", fontFamily:"'DM Sans',sans-serif", display:"flex", flexDirection:"column" },
  bar:     { background:"linear-gradient(135deg,#0d1b2a 0%,#1a3a5c 60%,#0f2c45 100%)", color:"#fff", display:"flex", alignItems:"center", justifyContent:"space-between", padding:"16px 36px", gap:20, borderBottom:"1px solid rgba(255,255,255,0.08)" },
  barL:    { flex:1 },
  barClinic:{ fontWeight:700, fontSize:17, letterSpacing:0.3 },
  barAddr: { fontSize:12, opacity:0.55, marginTop:2 },
  barC:    { textAlign:"center", flex:1 },
  barTime: { fontSize:30, fontWeight:700, letterSpacing:2, fontFamily:"'DM Serif Display',serif" },
  barDate: { fontSize:12, opacity:0.65, marginTop:2 },
  barR:    { flex:1, textAlign:"right" },
  barMsg:  { fontSize:14, fontWeight:500, opacity:0.85 },
  barTag:  { fontSize:11, opacity:0.45, marginTop:2, fontStyle:"italic" },
  main:    { flex:1, padding:"24px 20px", display:"flex", justifyContent:"center" },
  deptBar: { display:"flex", alignItems:"center", gap:12, marginBottom:20, padding:"12px 18px", background:"#fff", borderRadius:14, boxShadow:"0 2px 10px rgba(15,32,60,0.06)", border:"1px solid #e8edf5" },
  deptLabel:{ fontSize:13, fontWeight:700, color:"#6b7280", whiteSpace:"nowrap" as const, minWidth:88 },
  grid:    { display:"grid", gridTemplateColumns:"repeat(auto-fill, minmax(210px, 1fr))", gap:18, width:"100%" },
  av:      { width:96, height:96, borderRadius:"50%", overflow:"hidden", marginBottom:14, background:"#e8edf8", display:"flex", alignItems:"center", justifyContent:"center", border:"3px solid #dde8f8" },
  avImg:   { width:"100%", height:"100%", objectFit:"cover" },
  dname:   { fontWeight:700, fontSize:14, color:"#0f2027", textAlign:"center", marginBottom:3 },
  ddept:   { fontSize:12, color:"#6b7280", textAlign:"center", marginBottom:10 },
  dstats:  { display:"flex", gap:12, fontSize:12, color:"#555", fontWeight:500, background:"#f5f7fc", borderRadius:8, padding:"5px 12px", marginBottom:14 },
  dbg:     { display:"grid", gridTemplateColumns:"1fr 1fr", gap:7, width:"100%" },
  tbtn:    { border:"none", borderRadius:9, padding:"9px 4px", fontWeight:700, fontSize:12, cursor:"pointer", color:"#fff" },
  card:    { background:"#fff", borderRadius:24, padding:"36px 40px", maxWidth:480, width:"100%", boxShadow:"0 4px 32px rgba(15,32,60,0.10)", border:"1px solid #e8edf5", display:"flex", flexDirection:"column", alignItems:"center" },
  cicon:   { fontSize:52, marginBottom:12 },
  ctitle:  { fontSize:22, fontWeight:800, color:"#0f2027", marginBottom:6, textAlign:"center" },
  csub:    { fontSize:14, color:"#6b7280", marginBottom:4, textAlign:"center" },
  ib:      { background:"#f8faff", borderRadius:14, padding:"4px 18px", width:"100%", margin:"16px 0 24px", border:"1px solid #eef2ff" },
  rbtn:    { display:"flex", gap:12, width:"100%" },
  bback:   { flex:1, background:"#f0f2f7", color:"#374151", border:"none", borderRadius:12, padding:"13px 0", fontWeight:700, fontSize:14 },
  bpri:    { flex:2, background:"linear-gradient(135deg,#1a4a8a,#0f2c60)", color:"#fff", border:"none", borderRadius:12, padding:"13px 0", fontWeight:700, fontSize:14 },
  bprint:  { flex:1, background:"#0f2027", color:"#fff", border:"none", borderRadius:12, padding:"13px 0", fontWeight:700, fontSize:14 },
  errtxt:  { color:"#e53935", fontSize:13, marginTop:8, textAlign:"center" },
  slip:    { border:"2px dashed #c0c8d8", borderRadius:10, padding:"14px 22px", width:"100%", background:"#fff", fontFamily:"'Courier New',monospace" },
  sd:      { borderTop:"1.5px dashed #c0c8d8", margin:"8px 0" },
  stype:   { textAlign:"center", fontWeight:900, fontSize:14, letterSpacing:3, textTransform:"uppercase", color:"#0f2027" },
  stok:    { textAlign:"center", fontSize:62, fontWeight:900, letterSpacing:5, color:"#0f2027", lineHeight:1.05, margin:"6px 0" },
  sb:      { textAlign:"center", fontWeight:700, fontSize:13, margin:"3px 0", color:"#0f2027" },
  ss:      { textAlign:"center", fontSize:11, color:"#555", margin:"2px 0" },
  sclinic: { textAlign:"center", fontWeight:900, fontSize:14, margin:"3px 0", color:"#0f2027" },
  lw:      { display:"flex", flexDirection:"column", alignItems:"center", padding:"60px 0", width:"100%" },
  spin:    { width:44, height:44, border:"4px solid #dde3ef", borderTop:"4px solid #1a4a8a", borderRadius:"50%", animation:"spin 0.85s linear infinite" },
};