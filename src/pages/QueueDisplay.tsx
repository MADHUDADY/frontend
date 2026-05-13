// src/pages/QueueDisplay.tsx
// PUBLIC PAGE — No login required
// TV/Monitor lo show avutundi — Reception screen
import { useState, useEffect } from "react";
import axios from "axios";

const API = "https://backend-production-2df7.up.railway.app/api";

export default function QueueDisplay() {
  const [tokens,      setTokens]      = useState<any[]>([]);
  const [lastRefresh, setLastRefresh] = useState("");
  const [clinicName,  setClinicName]  = useState("Al Shifa Medical Centre");
  const [time,        setTime]        = useState("");

  // Clock
  useEffect(() => {
    const id = setInterval(() => {
      setTime(new Date().toLocaleTimeString([], { hour:"2-digit", minute:"2-digit", second:"2-digit" }));
    }, 1000);
    return () => clearInterval(id);
  }, []);

  // Clinic name
  useEffect(() => {
    axios.get(`${API}/clinic`).then(r => {
      if (r.data?.data?.COMPANYNAME) setClinicName(r.data.data.COMPANYNAME);
    }).catch(() => {});
  }, []);

  // Fetch today's queue every 5 seconds
  const fetchQueue = async () => {
    try {
      const r = await axios.get(`${API}/appointments/today`);
      setTokens(r.data.data || []);
      setLastRefresh(new Date().toLocaleTimeString([], { hour:"2-digit", minute:"2-digit" }));
    } catch { }
  };

  useEffect(() => {
    fetchQueue();
    const id = setInterval(fetchQueue, 5000);
    return () => clearInterval(id);
  }, []);

  const waiting = tokens.filter(t => t.STATUSCALLDISPLAYALL === 0);
  const called  = tokens.filter(t => t.STATUSCALLDISPLAYALL === 1);

  return (
    <div style={{
      minHeight:"100vh", background:"#0a0f1e",
      color:"white", fontFamily:"'Plus Jakarta Sans',sans-serif",
      display:"flex", flexDirection:"column",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700;800;900&display=swap');
        * { box-sizing:border-box; margin:0; padding:0; }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.5} }
        @keyframes fadeIn { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
        .token-card { animation: fadeIn 0.4s ease; }
      `}</style>

      {/* Header */}
      <div style={{
        background:"linear-gradient(135deg,#1a1a2e,#16213e)",
        padding:"16px 32px",
        display:"flex", alignItems:"center", justifyContent:"space-between",
        borderBottom:"2px solid #1a7a6e",
      }}>
        <div style={{ display:"flex", alignItems:"center", gap:16 }}>
          <div style={{ fontSize:36 }}>🏥</div>
          <div>
            <h1 style={{ fontSize:22, fontWeight:900, color:"#fff" }}>{clinicName}</h1>
            <p style={{ fontSize:13, color:"#1a7a6e", fontWeight:600 }}>Patient Queue Display</p>
          </div>
        </div>
        <div style={{ textAlign:"right" }}>
          <p style={{ fontSize:28, fontWeight:900, color:"#4fb8ac", letterSpacing:2 }}>{time}</p>
          <p style={{ fontSize:12, color:"#6b7280" }}>
            🟢 Live · {lastRefresh}
          </p>
        </div>
      </div>

      {/* Stats bar */}
      <div style={{
        display:"flex", gap:0,
        background:"#0d1117",
        borderBottom:"1px solid #1f2937",
      }}>
        {[
          { label:"Total Today", value:tokens.length,  color:"#4338ca", bg:"#1e1b4b" },
          { label:"Waiting",     value:waiting.length, color:"#d97706", bg:"#1c1400" },
          { label:"Called",      value:called.length,  color:"#16a34a", bg:"#0a1f0a" },
        ].map(s => (
          <div key={s.label} style={{
            flex:1, padding:"12px 24px", textAlign:"center",
            background:s.bg, borderRight:"1px solid #1f2937",
          }}>
            <p style={{ fontSize:32, fontWeight:900, color:s.color }}>{s.value}</p>
            <p style={{ fontSize:12, color:"#9ca3af", fontWeight:600, textTransform:"uppercase", letterSpacing:1 }}>{s.label}</p>
          </div>
        ))}
      </div>

      {/* Main content */}
      <div style={{ flex:1, display:"flex", gap:0 }}>

        {/* Waiting — left side (larger) */}
        <div style={{ flex:2, padding:"24px", borderRight:"2px solid #1f2937" }}>
          <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:20 }}>
            <span style={{ fontSize:20 }}>⏳</span>
            <h2 style={{ fontSize:18, fontWeight:800, color:"#d97706" }}>Waiting</h2>
            <span style={{
              background:"#d97706", color:"#000", borderRadius:50,
              padding:"2px 10px", fontSize:13, fontWeight:900,
            }}>{waiting.length}</span>
          </div>

          {waiting.length === 0 ? (
            <div style={{ textAlign:"center", padding:"60px 0", color:"#374151" }}>
              <p style={{ fontSize:48 }}>🎉</p>
              <p style={{ fontSize:16, marginTop:12 }}>No patients waiting</p>
            </div>
          ) : (
            <div style={{
              display:"grid",
              gridTemplateColumns:"repeat(auto-fill, minmax(160px, 1fr))",
              gap:16,
            }}>
              {waiting.map(t => (
                <div key={t.SLNO} className="token-card" style={{
                  background:"linear-gradient(135deg,#1c1400,#2d1f00)",
                  border:"2px solid #d97706",
                  borderRadius:16, padding:"20px 12px", textAlign:"center",
                }}>
                  <p style={{ fontSize:42, fontWeight:900, color:"#fbbf24", lineHeight:1 }}>{t.TICKETNUMBER}</p>
                  {t.PATIENTNAME && (
                    <p style={{ fontSize:13, color:"#e5e7eb", marginTop:6, fontWeight:600, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>
                      {t.PATIENTNAME}
                    </p>
                  )}
                  {t.DoctorName && (
                    <p style={{ fontSize:11, color:"#9ca3af", marginTop:2, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>
                      {t.DoctorName}
                    </p>
                  )}
                  <p style={{ fontSize:11, color:"#6b7280", marginTop:4 }}>
                    {t.TOKENDATE ? new Date(t.TOKENDATE).toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"}) : ""}
                  </p>
                  <span style={{
                    display:"inline-block", marginTop:8,
                    background:"#d97706", color:"#000",
                    borderRadius:50, padding:"2px 10px", fontSize:11, fontWeight:700,
                  }}>Waiting</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Called — right side */}
        <div style={{ flex:1, padding:"24px" }}>
          <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:20 }}>
            <span style={{ fontSize:20 }}>✅</span>
            <h2 style={{ fontSize:18, fontWeight:800, color:"#16a34a" }}>Called</h2>
            <span style={{
              background:"#16a34a", color:"#fff", borderRadius:50,
              padding:"2px 10px", fontSize:13, fontWeight:900,
            }}>{called.length}</span>
          </div>

          {called.length === 0 ? (
            <div style={{ textAlign:"center", padding:"40px 0", color:"#374151" }}>
              <p style={{ fontSize:14 }}>No tokens called yet</p>
            </div>
          ) : (
            <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
              {called.slice(0, 10).map(t => (
                <div key={t.SLNO} className="token-card" style={{
                  background:"linear-gradient(135deg,#0a1f0a,#0d260d)",
                  border:"1px solid #16a34a",
                  borderRadius:12, padding:"12px 16px",
                  display:"flex", alignItems:"center", justifyContent:"space-between",
                }}>
                  <div>
                    <p style={{ fontSize:24, fontWeight:900, color:"#4ade80" }}>{t.TICKETNUMBER}</p>
                    {t.PATIENTNAME && <p style={{ fontSize:12, color:"#9ca3af" }}>{t.PATIENTNAME}</p>}
                  </div>
                  <span style={{
                    background:"#16a34a", color:"#fff",
                    borderRadius:50, padding:"2px 8px", fontSize:11, fontWeight:700,
                  }}>Called</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div style={{
        background:"#0d1117", padding:"8px 32px", textAlign:"center",
        borderTop:"1px solid #1f2937",
      }}>
        <p style={{ fontSize:12, color:"#374151" }}>
          Please wait for your token number to be called · Auto-refresh every 5 seconds
        </p>
      </div>
    </div>
  );
}