import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const API = "http://localhost:5000/api";

export default function LoginCard() {
  const [mode,     setMode]    = useState<"login" | "register">("login");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [focused,  setFocused]  = useState<string | null>(null);
  const [loading,  setLoading]  = useState(false);
  const [success,  setSuccess]  = useState(false);
  const [shake,    setShake]    = useState(false);
  const [errMsg,   setErrMsg]   = useState("");
  const [particles, setParticles] = useState<any[]>([]);
  const navigate  = useNavigate();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Register fields
  const [reg, setReg] = useState({
    EMPNAME: "", EMPID: "", PWD: "", CONFIRMPWD: "",
    MOBILE: "", EMAILID: "", ROLE: "Staff", GENDER: "", CENTERID: "101"
  });

  useEffect(() => {
    const colors = ["#1a7a6e","#002B6B","#4fb8ac","#a8d8d0","#d0e8f5"];
    setParticles(Array.from({ length: 18 }, (_, i) => ({
      id: i, x: Math.random() * 100, y: Math.random() * 100,
      size: 6 + Math.random() * 18, delay: Math.random() * 7,
      dur: 6 + Math.random() * 9,
      color: colors[Math.floor(Math.random() * colors.length)],
    })));
  }, []);

  // ECG canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    let frame = 0, animId: number;
    const draw = () => {
      const W = canvas.width, H = canvas.height;
      ctx.clearRect(0, 0, W, H);
      ctx.beginPath();
      ctx.strokeStyle = "rgba(26,122,110,0.85)";
      ctx.lineWidth = 2.5; ctx.shadowBlur = 10; ctx.shadowColor = "#1a7a6e";
      const speed = 1.8, offset = (frame * speed) % W;
      for (let x = 0; x < W; x++) {
        const pos = (x - offset + W) % W; let y = H / 2; const c = pos % 130;
        if (c < 10) y = H/2; else if (c < 16) y = H/2-8; else if (c < 20) y = H/2+6;
        else if (c < 23) y = H/2-44; else if (c < 28) y = H/2+22; else if (c < 34) y = H/2-12;
        else if (c < 44) y = H/2-4; else if (c < 54) y = H/2+7; else if (c < 58) y = H/2+3; else y = H/2;
        if (x === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
      }
      ctx.stroke();
      const fx = (frame * speed) % W;
      ctx.beginPath(); ctx.arc(fx, H/2, 5, 0, Math.PI*2);
      ctx.fillStyle = "#1a7a6e"; ctx.shadowBlur = 18; ctx.fill();
      frame++; animId = requestAnimationFrame(draw);
    };
    draw();
    return () => cancelAnimationFrame(animId);
  }, []);

  const doShake = () => { setShake(true); setTimeout(() => setShake(false), 620); };

  // ── LOGIN ─────────────────────────────────────────────────────────────────
  const handleLogin = async () => {
    if (!username.trim() || !password.trim()) {
      setErrMsg("Please enter username and password"); doShake(); return;
    }
    try {
      setLoading(true); setErrMsg("");
      const res = await axios.post(`${API}/employees/login`, { EMPID: username, PWD: password });
      if (res.data.success) {
        const user = res.data.data;
        localStorage.setItem("user",     user.EMPNAME);
        localStorage.setItem("role",     user.ROLE);
        localStorage.setItem("empId",    user.EMPID);
        localStorage.setItem("centerId", user.CENTERID);
        setSuccess(true);
        setTimeout(() => navigate("/dashboard"), 1200);
      }
    } catch (err: any) {
      setErrMsg(err?.response?.data?.message || "Invalid credentials"); doShake();
    } finally { setLoading(false); }
  };

  // ── REGISTER ──────────────────────────────────────────────────────────────
  const handleRegister = async () => {
    if (!reg.EMPNAME.trim() || !reg.EMPID.trim() || !reg.PWD.trim()) {
      setErrMsg("Name, Employee ID and Password are required"); doShake(); return;
    }
    if (reg.PWD !== reg.CONFIRMPWD) {
      setErrMsg("Passwords do not match"); doShake(); return;
    }
    if (reg.PWD.length < 3) {
      setErrMsg("Password must be at least 3 characters"); doShake(); return;
    }
    try {
      setLoading(true); setErrMsg("");
      await axios.post(`${API}/employees`, {
        EMPNAME:   reg.EMPNAME,
        EMPID:     reg.EMPID,
        PWD:       reg.PWD,
        MOBILE:    reg.MOBILE,
        EMAILID:   reg.EMAILID,
        ROLE:      reg.ROLE,
        GENDER:    reg.GENDER,
        CENTERID:  reg.CENTERID,
        EMPTYPE:   "Permanent",
      });
      // Auto-login after register
      const loginRes = await axios.post(`${API}/employees/login`, { EMPID: reg.EMPID, PWD: reg.PWD });
      const user = loginRes.data.data;
      localStorage.setItem("user",     user.EMPNAME);
      localStorage.setItem("role",     user.ROLE);
      localStorage.setItem("empId",    user.EMPID);
      localStorage.setItem("centerId", user.CENTERID);
      setSuccess(true);
      setTimeout(() => navigate("/dashboard"), 1200);
    } catch (err: any) {
      setErrMsg(err?.response?.data?.message || "Registration failed"); doShake();
    } finally { setLoading(false); }
  };

  const switchMode = (m: "login" | "register") => {
    setMode(m); setErrMsg(""); setSuccess(false);
    setUsername(""); setPassword("");
    setReg({ EMPNAME:"", EMPID:"", PWD:"", CONFIRMPWD:"", MOBILE:"", EMAILID:"", ROLE:"Staff", GENDER:"", CENTERID:"101" });
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Playfair+Display:wght@700;800&display=swap');
        *{box-sizing:border-box;margin:0;padding:0}
        .lp-root{font-family:'Plus Jakarta Sans',sans-serif;min-height:100vh;background:#eef4fb;display:flex;align-items:center;justify-content:center;overflow:hidden;position:relative;}
        .lp-bg{position:fixed;inset:0;background:radial-gradient(ellipse 80% 60% at 18% 28%,rgba(26,122,110,0.13) 0%,transparent 60%),radial-gradient(ellipse 65% 75% at 82% 72%,rgba(0,43,107,0.11) 0%,transparent 60%),#eef4fb;}
        .lp-grid{position:fixed;inset:0;pointer-events:none;background-image:linear-gradient(rgba(26,122,110,0.045) 1px,transparent 1px),linear-gradient(90deg,rgba(26,122,110,0.045) 1px,transparent 1px);background-size:50px 50px;}
        .lp-bubble{position:fixed;border-radius:50%;opacity:0.12;pointer-events:none;animation:bubFloat var(--d) ease-in-out var(--dl) infinite alternate;}
        @keyframes bubFloat{0%{transform:translateY(0)}100%{transform:translateY(-45px)}}
        .lp-layout{position:relative;z-index:10;display:flex;align-items:center;gap:60px;padding:32px;width:100%;max-width:1080px;}
        .lp-left{flex:1;display:flex;flex-direction:column;align-items:center;gap:28px;}
        .lp-brand{text-align:center;}
        .lp-brand-icon{width:74px;height:74px;background:linear-gradient(135deg,#1a7a6e,#002B6B);border-radius:22px;display:flex;align-items:center;justify-content:center;margin:0 auto 14px;box-shadow:0 14px 34px rgba(26,122,110,0.38);}
        .lp-brand h2{font-family:'Playfair Display',serif;font-size:28px;color:#002B6B;line-height:1.25;}
        .lp-brand span{font-size:12px;color:#1a7a6e;font-weight:700;letter-spacing:2.2px;text-transform:uppercase;}
        .lp-ecg{width:100%;max-width:420px;background:rgba(255,255,255,.62);border:1px solid rgba(26,122,110,.16);border-radius:16px;padding:12px 16px;backdrop-filter:blur(10px);}
        .lp-ecg-label{font-size:11px;font-weight:700;color:#1a7a6e;letter-spacing:1.6px;text-transform:uppercase;margin-bottom:8px;display:flex;align-items:center;gap:7px;}
        .lp-ecg-dot{width:7px;height:7px;background:#1a7a6e;border-radius:50%;animation:blink 1.1s ease infinite}
        @keyframes blink{0%,100%{opacity:1}50%{opacity:.2}}
        canvas{width:100%;height:60px;display:block}
        .lp-stats{display:flex;gap:14px;width:100%;max-width:420px;}
        .lp-stat{flex:1;background:rgba(255,255,255,.68);border:1px solid rgba(26,122,110,.12);border-radius:14px;padding:14px;text-align:center;}
        .lp-stat-num{font-size:22px;font-weight:800;color:#002B6B;display:block}
        .lp-stat-lbl{font-size:11px;color:#7a8fb0;font-weight:600;letter-spacing:.8px;text-transform:uppercase}
        .lp-card{width:440px;flex-shrink:0;background:rgba(255,255,255,.93);backdrop-filter:blur(22px);border-radius:28px;padding:36px 40px;box-shadow:0 22px 64px rgba(0,43,107,.12);border:1px solid rgba(255,255,255,.82);position:relative;max-height:90vh;overflow-y:auto;}
        .lp-card.lp-shake{animation:shk .55s ease both}
        @keyframes shk{0%,100%{transform:translateX(0)}20%{transform:translateX(-9px)}40%{transform:translateX(9px)}60%{transform:translateX(-6px)}80%{transform:translateX(6px)}}
        .lp-prog{position:absolute;top:0;left:0;height:3px;background:linear-gradient(90deg,#1a7a6e,#4fb8ac);border-radius:3px 3px 0 0;width:0;transition:width 1.6s cubic-bezier(.4,0,.2,1);}
        .lp-prog.go{width:90%} .lp-prog.done{width:100%;background:linear-gradient(90deg,#22c55e,#4ade80)}
        .lp-tabs{display:flex;background:#f1f5f9;border-radius:12px;padding:4px;margin-bottom:24px;gap:4px;}
        .lp-tab{flex:1;padding:9px 0;border:none;border-radius:9px;font-family:'Plus Jakarta Sans',sans-serif;font-size:13px;font-weight:700;cursor:pointer;transition:all .2s;}
        .lp-tab.active{background:white;color:#002B6B;box-shadow:0 2px 8px rgba(0,0,0,0.08);}
        .lp-tab.inactive{background:transparent;color:#94a3b8;}
        .lp-badge{display:inline-flex;align-items:center;gap:7px;background:rgba(26,122,110,.1);color:#1a7a6e;font-size:11px;font-weight:700;letter-spacing:1.6px;text-transform:uppercase;padding:5px 13px;border-radius:50px;margin-bottom:12px;}
        .lp-badge-dot{width:6px;height:6px;background:#1a7a6e;border-radius:50%;animation:blink 1.3s ease infinite}
        .lp-card h1{font-family:'Playfair Display',serif;font-size:26px;color:#002B6B;line-height:1.22;margin-bottom:4px;}
        .lp-sub{font-size:13px;color:#7a8fb0;margin-bottom:20px;}
        .lp-err{background:#fee2e2;color:#dc2626;border-radius:10px;padding:10px 14px;font-size:13px;font-weight:600;margin-bottom:14px;text-align:center;border:1px solid #fecaca;}
        .lp-hint{background:rgba(26,122,110,0.07);border:1px solid rgba(26,122,110,0.15);border-radius:10px;padding:8px 14px;font-size:12px;color:#1a7a6e;margin-bottom:14px;text-align:center;}
        .lp-field{margin-bottom:14px;}
        .lp-field label{display:block;font-size:12px;font-weight:700;color:#374151;margin-bottom:5px;}
        .lp-iw{position:relative}
        .lp-iw input, .lp-iw select{width:100%;padding:12px 44px 12px 14px;border:2px solid #dde3ef;border-radius:12px;font-family:'Plus Jakarta Sans',sans-serif;font-size:14px;color:#1e2d50;background:#f8faff;outline:none;transition:all .2s;}
        .lp-iw input:focus, .lp-iw select:focus{border-color:#1a7a6e;background:white;box-shadow:0 0 0 4px rgba(26,122,110,.08);}
        .lp-iw input::placeholder{color:#b0bcd4}
        .lp-ico{position:absolute;right:14px;top:50%;transform:translateY(-50%);color:#c5cfe0;pointer-events:none;}
        .lp-grid2{display:grid;grid-template-columns:1fr 1fr;gap:10px;}
        .lp-btn{width:100%;padding:14px;background:linear-gradient(135deg,#002B6B 0%,#0044a8 100%);color:white;border:none;border-radius:50px;font-family:'Plus Jakarta Sans',sans-serif;font-size:15px;font-weight:800;cursor:pointer;transition:transform .2s,box-shadow .2s;box-shadow:0 8px 26px rgba(0,43,107,.3);margin-top:6px;}
        .lp-btn:hover:not(:disabled){transform:translateY(-2px);box-shadow:0 12px 32px rgba(0,43,107,.38)}
        .lp-btn:disabled{cursor:not-allowed;opacity:.7}
        .lp-spin{display:inline-block;width:17px;height:17px;border:2.5px solid rgba(255,255,255,.35);border-top-color:white;border-radius:50%;animation:spin .7s linear infinite;vertical-align:middle;margin-right:6px;}
        @keyframes spin{to{transform:rotate(360deg)}}
        @media(max-width:860px){.lp-layout{flex-direction:column;gap:28px}.lp-card{width:100%;max-width:440px}}
      `}</style>

      <div className="lp-root">
        <div className="lp-bg" />
        <div className="lp-grid" />
        {particles.map(p => (
          <div key={p.id} className="lp-bubble" style={{
            left:`${p.x}%`,top:`${p.y}%`,width:p.size,height:p.size,
            background:p.color,"--d":`${p.dur}s`,"--dl":`${p.delay}s`
          } as any} />
        ))}

        <div className="lp-layout">
          {/* LEFT */}
          <div className="lp-left">
            <div className="lp-brand">
              <div className="lp-brand-icon">
                <svg width="38" height="38" viewBox="0 0 36 36" fill="none">
                  <path d="M16 10h4v6h6v4h-6v6h-4v-6h-6v-4h6V10z" fill="white"/>
                </svg>
              </div>
              <h2>Patient Appointments<br/>System</h2>
              <span>Healthcare Portal</span>
            </div>
            <div className="lp-ecg">
              <div className="lp-ecg-label"><div className="lp-ecg-dot"/>Live ECG Monitor</div>
              <canvas ref={canvasRef} width={360} height={60}/>
            </div>
            <div className="lp-stats">
              {[{ico:"🏥",num:"1,240+",lbl:"Patients"},{ico:"👨‍⚕️",num:"86",lbl:"Doctors"},{ico:"⭐",num:"4.9",lbl:"Rating"}].map((s,i)=>(
                <div className="lp-stat" key={i}>
                  <div style={{fontSize:17,marginBottom:3}}>{s.ico}</div>
                  <span className="lp-stat-num">{s.num}</span>
                  <span className="lp-stat-lbl">{s.lbl}</span>
                </div>
              ))}
            </div>
          </div>

          {/* CARD */}
          <div className={`lp-card ${shake ? "lp-shake" : ""}`}>
            <div className={`lp-prog ${loading ? "go" : ""} ${success ? "done" : ""}`}/>

            {/* Tabs */}
            <div className="lp-tabs">
              <button className={`lp-tab ${mode==="login"?"active":"inactive"}`} onClick={() => switchMode("login")}>
                🔐 Login
              </button>
              <button className={`lp-tab ${mode==="register"?"active":"inactive"}`} onClick={() => switchMode("register")}>
                ✨ Create Account
              </button>
            </div>

            {mode === "login" ? (
              /* ── LOGIN FORM ─────────────────────────────────────────── */
              <>
                <div className="lp-badge"><div className="lp-badge-dot"/>Secure Login</div>
                <h1>Welcome Back 👋</h1>
                <p className="lp-sub">Sign in to your hospital portal</p>

                {errMsg && <div className="lp-err">❌ {errMsg}</div>}
                <div className="lp-hint">🔑 Default: <strong>ADMIN</strong> / <strong>123</strong></div>

                <div className="lp-field">
                  <label>Username</label>
                  <div className="lp-iw">
                    <input type="text" placeholder="Enter username" value={username}
                      onChange={e => setUsername(e.target.value)}
                      onFocus={() => setFocused("user")} onBlur={() => setFocused(null)}
                      onKeyDown={e => e.key==="Enter" && !loading && handleLogin()} />
                    <span className="lp-ico">👤</span>
                  </div>
                </div>

                <div className="lp-field">
                  <label>Password</label>
                  <div className="lp-iw">
                    <input type="password" placeholder="Enter password" value={password}
                      onChange={e => setPassword(e.target.value)}
                      onFocus={() => setFocused("pass")} onBlur={() => setFocused(null)}
                      onKeyDown={e => e.key==="Enter" && !loading && handleLogin()} />
                    <span className="lp-ico">🔒</span>
                  </div>
                </div>

                <button className="lp-btn" onClick={handleLogin} disabled={loading}>
                  {success ? "✅ Login Successful!" : loading ? <span><span className="lp-spin"/>Signing in...</span> : "Login"}
                </button>
              </>
            ) : (
              /* ── REGISTER FORM ─────────────────────────────────────── */
              <>
                <div className="lp-badge"><div className="lp-badge-dot"/>New Account</div>
                <h1>Create Account ✨</h1>
                <p className="lp-sub">Register as hospital staff member</p>

                {errMsg && <div className="lp-err">❌ {errMsg}</div>}

                <div className="lp-grid2">
                  <div className="lp-field">
                    <label>Full Name *</label>
                    <div className="lp-iw">
                      <input type="text" placeholder="Your name" value={reg.EMPNAME}
                        onChange={e => setReg({...reg, EMPNAME: e.target.value})} />
                    </div>
                  </div>
                  <div className="lp-field">
                    <label>Employee ID *</label>
                    <div className="lp-iw">
                      <input type="text" placeholder="e.g. EMP001" value={reg.EMPID}
                        onChange={e => setReg({...reg, EMPID: e.target.value})} />
                    </div>
                  </div>
                </div>

                <div className="lp-grid2">
                  <div className="lp-field">
                    <label>Password *</label>
                    <div className="lp-iw">
                      <input type="password" placeholder="Create password" value={reg.PWD}
                        onChange={e => setReg({...reg, PWD: e.target.value})} />
                    </div>
                  </div>
                  <div className="lp-field">
                    <label>Confirm Password *</label>
                    <div className="lp-iw">
                      <input type="password" placeholder="Repeat password" value={reg.CONFIRMPWD}
                        onChange={e => setReg({...reg, CONFIRMPWD: e.target.value})} />
                    </div>
                  </div>
                </div>

                <div className="lp-grid2">
                  <div className="lp-field">
                    <label>Mobile</label>
                    <div className="lp-iw">
                      <input type="tel" placeholder="+971 ..." value={reg.MOBILE}
                        onChange={e => setReg({...reg, MOBILE: e.target.value})} />
                    </div>
                  </div>
                  <div className="lp-field">
                    <label>Email</label>
                    <div className="lp-iw">
                      <input type="email" placeholder="email@clinic.com" value={reg.EMAILID}
                        onChange={e => setReg({...reg, EMAILID: e.target.value})} />
                    </div>
                  </div>
                </div>

                <div className="lp-grid2">
                  <div className="lp-field">
                    <label>Role</label>
                    <div className="lp-iw">
                      <select value={reg.ROLE} onChange={e => setReg({...reg, ROLE: e.target.value})}>
                        <option value="Staff">Staff</option>
                        <option value="Admin">Admin</option>
                        <option value="Doctor">Doctor</option>
                        <option value="Reception">Reception</option>
                        <option value="Call Centre">Call Centre</option>
                      </select>
                    </div>
                  </div>
                  <div className="lp-field">
                    <label>Gender</label>
                    <div className="lp-iw">
                      <select value={reg.GENDER} onChange={e => setReg({...reg, GENDER: e.target.value})}>
                        <option value="">Select</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                  </div>
                </div>

                <button className="lp-btn" onClick={handleRegister} disabled={loading}>
                  {success ? "✅ Account Created!" : loading ? <span><span className="lp-spin"/>Creating account...</span> : "Create Account & Login"}
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}