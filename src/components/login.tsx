import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

export default function LoginCard() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [focused, setFocused] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [shake, setShake] = useState(false);
  const [particles, setParticles] = useState<{id:number;x:number;y:number;size:number;delay:number;dur:number;color:string}[]>([]);
  const navigate = useNavigate();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const colors = ["#1a7a6e","#002B6B","#4fb8ac","#a8d8d0","#d0e8f5"];
    setParticles(Array.from({length: 24}, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: 6 + Math.random() * 20,
      delay: Math.random() * 7,
      dur: 6 + Math.random() * 9,
      color: colors[Math.floor(Math.random() * colors.length)],
    })));
  }, []);

  // Live ECG canvas
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
      ctx.lineWidth = 2.5;
      ctx.shadowBlur = 10;
      ctx.shadowColor = "#1a7a6e";
      const speed = 1.8, offset = (frame * speed) % W;
      for (let x = 0; x < W; x++) {
        const pos = (x - offset + W) % W;
        let y = H / 2;
        const c = pos % 130;
        if (c < 10) y = H/2;
        else if (c < 16) y = H/2 - 8;
        else if (c < 20) y = H/2 + 6;
        else if (c < 23) y = H/2 - 44;
        else if (c < 28) y = H/2 + 22;
        else if (c < 34) y = H/2 - 12;
        else if (c < 44) y = H/2 - 4;
        else if (c < 54) y = H/2 + 7;
        else if (c < 58) y = H/2 + 3;
        else y = H/2;
        if (x === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
      }
      ctx.stroke();
      const fx = (frame * speed) % W;
      ctx.beginPath();
      ctx.arc(fx, H/2, 5, 0, Math.PI * 2);
      ctx.fillStyle = "#1a7a6e";
      ctx.shadowBlur = 18;
      ctx.fill();
      frame++;
      animId = requestAnimationFrame(draw);
    };
    draw();
    return () => cancelAnimationFrame(animId);
  }, []);

  const handleLogin = () => {
    if (username === "Admin" && password === "123") {
      setLoading(true);
      setTimeout(() => {
        setSuccess(true);
        setTimeout(() => { localStorage.setItem("user", username); navigate("/dashboard"); }, 1200);
      }, 1600);
    } else {
      setShake(true);
      setTimeout(() => setShake(false), 620);
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Playfair+Display:wght@700;800&display=swap');

        *{box-sizing:border-box;margin:0;padding:0}

        .lp-root{
          font-family:'Plus Jakarta Sans',sans-serif;
          min-height:100vh;
          background:#eef4fb;
          display:flex;align-items:center;justify-content:center;
          overflow:hidden;position:relative;
        }

        /* mesh bg */
        .lp-bg{
          position:fixed;inset:0;
          background:
            radial-gradient(ellipse 80% 60% at 18% 28%, rgba(26,122,110,0.13) 0%,transparent 60%),
            radial-gradient(ellipse 65% 75% at 82% 72%, rgba(0,43,107,0.11) 0%,transparent 60%),
            radial-gradient(ellipse 50% 45% at 55% 8%, rgba(79,184,172,0.09) 0%,transparent 55%),
            #eef4fb;
          animation:meshPulse 14s ease-in-out infinite alternate;
        }
        @keyframes meshPulse{0%{filter:brightness(1) hue-rotate(0deg)}100%{filter:brightness(1.04) hue-rotate(9deg)}}

        /* grid */
        .lp-grid{
          position:fixed;inset:0;pointer-events:none;
          background-image:linear-gradient(rgba(26,122,110,0.045) 1px,transparent 1px),linear-gradient(90deg,rgba(26,122,110,0.045) 1px,transparent 1px);
          background-size:50px 50px;
          animation:gridDrift 30s linear infinite;
        }
        @keyframes gridDrift{0%{background-position:0 0}100%{background-position:50px 50px}}

        /* bubbles */
        .lp-bubble{
          position:fixed;border-radius:50%;
          opacity:0.12;pointer-events:none;
          animation:bubFloat var(--d) ease-in-out var(--dl) infinite alternate;
        }
        @keyframes bubFloat{0%{transform:translateY(0) scale(1)}100%{transform:translateY(-45px) scale(1.14)}}

        /* layout */
        .lp-layout{
          position:relative;z-index:10;
          display:flex;align-items:center;gap:60px;
          padding:32px;width:100%;max-width:1080px;
        }

        /* ── LEFT ── */
        .lp-left{
          flex:1;display:flex;flex-direction:column;align-items:center;gap:28px;
        }

        /* brand */
        .lp-brand{
          text-align:center;
          animation:fadeD .7s ease both;
        }
        @keyframes fadeD{from{opacity:0;transform:translateY(-22px)}to{opacity:1;transform:translateY(0)}}

        .lp-brand-icon{
          width:74px;height:74px;
          background:linear-gradient(135deg,#1a7a6e,#002B6B);
          border-radius:22px;
          display:flex;align-items:center;justify-content:center;
          margin:0 auto 14px;
          box-shadow:0 14px 34px rgba(26,122,110,0.38);
          animation:iconPop .9s cubic-bezier(.22,.68,0,1.4) .3s both;
        }
        @keyframes iconPop{from{opacity:0;transform:scale(.3) rotate(-20deg)}to{opacity:1;transform:scale(1) rotate(0)}}

        .lp-brand h2{
          font-family:'Playfair Display',serif;
          font-size:28px;color:#002B6B;line-height:1.25;
        }
        .lp-brand span{
          font-size:12px;color:#1a7a6e;font-weight:700;
          letter-spacing:2.2px;text-transform:uppercase;
        }

        /* orbit */
        .lp-orbit{
          position:relative;width:210px;height:210px;margin:0 auto;
          animation:fadeU .8s ease .4s both;
        }
        @keyframes fadeU{from{opacity:0;transform:translateY(22px)}to{opacity:1;transform:translateY(0)}}

        .lp-ring{
          position:absolute;border-radius:50%;
          top:50%;left:50%;transform:translate(-50%,-50%);
        }
        .lp-ring-1{width:115px;height:115px;border:1.5px solid rgba(26,122,110,.28);animation:rRot 8s linear infinite}
        .lp-ring-2{width:165px;height:165px;border:1.5px dashed rgba(0,43,107,.18);animation:rRot 15s linear infinite reverse}
        .lp-ring-3{width:210px;height:210px;border:1px solid rgba(26,122,110,.1);animation:rRot 22s linear infinite}
        @keyframes rRot{from{transform:translate(-50%,-50%) rotate(0)}to{transform:translate(-50%,-50%) rotate(360deg)}}

        .lp-rdot{
          position:absolute;border-radius:50%;
          top:-5px;left:50%;margin-left:-5px;
          width:10px;height:10px;
          background:#1a7a6e;box-shadow:0 0 9px #1a7a6e;
        }
        .lp-ring-2 .lp-rdot{background:#002B6B;box-shadow:0 0 9px #002B6B;width:8px;height:8px;top:-4px;margin-left:-4px}
        .lp-ring-3 .lp-rdot{background:#4fb8ac;box-shadow:0 0 9px #4fb8ac;width:7px;height:7px;top:-3.5px;margin-left:-3.5px}

        .lp-core{
          position:absolute;inset:0;display:flex;align-items:center;justify-content:center;
        }
        .lp-core-inner{
          width:74px;height:74px;border-radius:50%;
          background:linear-gradient(135deg,#1a7a6e,#002B6B);
          display:flex;align-items:center;justify-content:center;
          box-shadow:0 0 28px rgba(26,122,110,.45),0 0 60px rgba(26,122,110,.18);
          animation:corePulse 2.8s ease-in-out infinite;
        }
        @keyframes corePulse{0%,100%{box-shadow:0 0 22px rgba(26,122,110,.45),0 0 52px rgba(26,122,110,.18)}50%{box-shadow:0 0 44px rgba(26,122,110,.7),0 0 88px rgba(26,122,110,.28)}}

        /* ECG */
        .lp-ecg{
          width:100%;max-width:420px;
          background:rgba(255,255,255,.62);
          border:1px solid rgba(26,122,110,.16);
          border-radius:16px;padding:12px 16px;
          backdrop-filter:blur(10px);
          animation:fadeU .8s ease .55s both;
        }
        .lp-ecg-label{
          font-size:11px;font-weight:700;color:#1a7a6e;
          letter-spacing:1.6px;text-transform:uppercase;
          margin-bottom:8px;display:flex;align-items:center;gap:7px;
        }
        .lp-ecg-dot{width:7px;height:7px;background:#1a7a6e;border-radius:50%;animation:blink 1.1s ease infinite}
        @keyframes blink{0%,100%{opacity:1}50%{opacity:.2}}

        canvas{width:100%;height:60px;display:block}

        /* stats */
        .lp-stats{
          display:flex;gap:14px;width:100%;max-width:420px;
          animation:fadeU .8s ease .7s both;
        }
        .lp-stat{
          flex:1;background:rgba(255,255,255,.68);
          border:1px solid rgba(26,122,110,.12);
          border-radius:14px;padding:14px;
          backdrop-filter:blur(8px);text-align:center;
          transition:transform .22s,box-shadow .22s;
        }
        .lp-stat:hover{transform:translateY(-5px);box-shadow:0 10px 26px rgba(26,122,110,.16)}
        .lp-stat-num{font-size:22px;font-weight:800;color:#002B6B;display:block}
        .lp-stat-lbl{font-size:11px;color:#7a8fb0;font-weight:600;letter-spacing:.8px;text-transform:uppercase}
        .lp-stat-ico{font-size:17px;margin-bottom:3px}

        /* ── CARD ── */
        .lp-card{
          width:420px;flex-shrink:0;
          background:rgba(255,255,255,.93);
          backdrop-filter:blur(22px);
          border-radius:28px;
          padding:44px 40px;
          box-shadow:0 4px 6px rgba(0,0,0,.02),0 22px 64px rgba(0,43,107,.12),inset 0 1px 0 rgba(255,255,255,.9);
          border:1px solid rgba(255,255,255,.82);
          position:relative;
          animation:cardIn .9s cubic-bezier(.22,.68,0,1.1) .2s both;
        }
        @keyframes cardIn{from{opacity:0;transform:translateX(42px) scale(.96)}to{opacity:1;transform:translateX(0) scale(1)}}

        .lp-card.lp-shake{animation:shk .55s ease both}
        @keyframes shk{0%,100%{transform:translateX(0)}15%{transform:translateX(-9px)}30%{transform:translateX(9px)}45%{transform:translateX(-6px)}60%{transform:translateX(6px)}75%{transform:translateX(-3px)}90%{transform:translateX(3px)}}

        /* progress bar */
        .lp-prog{
          position:absolute;top:0;left:0;height:3px;
          background:linear-gradient(90deg,#1a7a6e,#4fb8ac);
          border-radius:3px 3px 0 0;width:0;
          transition:width 1.6s cubic-bezier(.4,0,.2,1);
        }
        .lp-prog.go{width:90%}
        .lp-prog.done{width:100%;background:linear-gradient(90deg,#22c55e,#4ade80)}

        /* header */
        .lp-badge{
          display:inline-flex;align-items:center;gap:7px;
          background:rgba(26,122,110,.1);color:#1a7a6e;
          font-size:11px;font-weight:700;letter-spacing:1.6px;text-transform:uppercase;
          padding:5px 13px;border-radius:50px;margin-bottom:16px;
          animation:fadeD .6s ease .45s both;
        }
        .lp-badge-dot{width:6px;height:6px;background:#1a7a6e;border-radius:50%;animation:blink 1.3s ease infinite}

        .lp-card h1{
          font-family:'Playfair Display',serif;
          font-size:30px;color:#002B6B;line-height:1.22;
          animation:fadeD .6s ease .55s both;
        }
        .lp-card>div>p{
          font-size:14px;color:#7a8fb0;margin-top:6px;margin-bottom:30px;
          animation:fadeD .6s ease .65s both;
        }

        /* field */
        .lp-field{margin-bottom:20px;animation:fadeU .5s ease both}
        .lp-field:nth-of-type(1){animation-delay:.72s}
        .lp-field:nth-of-type(2){animation-delay:.84s}

        .lp-field label{
          display:block;font-size:13px;font-weight:700;color:#002B6B;
          margin-bottom:8px;transition:color .2s;
        }
        .lp-field.lp-active label{color:#1a7a6e}

        .lp-iw{position:relative}
        .lp-iw input{
          width:100%;padding:15px 48px 15px 18px;
          border:2px solid #dde3ef;border-radius:14px;
          font-family:'Plus Jakarta Sans',sans-serif;font-size:15px;color:#1e2d50;
          background:#f8faff;outline:none;
          transition:all .25s cubic-bezier(.22,.68,0,1.2);
        }
        .lp-iw input:focus{
          border-color:#1a7a6e;background:white;
          box-shadow:0 0 0 4px rgba(26,122,110,.1),0 4px 14px rgba(26,122,110,.09);
          transform:translateY(-1px);
        }
        .lp-iw input::placeholder{color:#b0bcd4}
        .lp-ico{
          position:absolute;right:16px;top:50%;transform:translateY(-50%);
          font-size:16px;color:#c5cfe0;pointer-events:none;transition:color .2s;
        }
        .lp-field.lp-active .lp-ico{color:#1a7a6e}

        /* forgot */
        .lp-forgot{
          display:flex;justify-content:space-between;
          margin:8px 0 28px;animation:fadeU .5s ease .9s both;
        }
        .lp-forgot button{
          background:none;border:none;cursor:pointer;
          font-family:'Plus Jakarta Sans',sans-serif;
          font-size:13px;font-weight:600;color:#1a7a6e;
          transition:color .2s,transform .15s;padding:2px 0;
        }
        .lp-forgot button:hover{color:#002B6B;transform:translateY(-1px)}

        /* login btn */
        .lp-btn{
          width:100%;padding:16px;
          background:linear-gradient(135deg,#002B6B 0%,#0044a8 100%);
          color:white;border:none;border-radius:50px;
          font-family:'Plus Jakarta Sans',sans-serif;
          font-size:16px;font-weight:800;cursor:pointer;
          letter-spacing:.5px;position:relative;overflow:hidden;
          transition:transform .2s,box-shadow .2s;
          box-shadow:0 8px 26px rgba(0,43,107,.3);
          animation:fadeU .5s ease 1.02s both;
        }
        .lp-btn::before{
          content:'';position:absolute;inset:0;
          background:linear-gradient(135deg,rgba(255,255,255,.16) 0%,transparent 55%);
          opacity:0;transition:opacity .3s;
        }
        .lp-btn:hover::before{opacity:1}
        .lp-btn:hover:not(:disabled){transform:translateY(-3px);box-shadow:0 15px 38px rgba(0,43,107,.38)}
        .lp-btn:active:not(:disabled){transform:translateY(0)}
        .lp-btn:disabled{cursor:not-allowed;opacity:.88}

        /* shimmer on btn */
        .lp-btn::after{
          content:'';position:absolute;
          top:0;left:-120%;width:60%;height:100%;
          background:linear-gradient(120deg,transparent,rgba(255,255,255,.22),transparent);
          animation:shimmer 2.8s ease infinite;
        }
        @keyframes shimmer{0%{left:-120%}60%,100%{left:160%}}

        /* spinner */
        .lp-spin{
          display:inline-block;width:19px;height:19px;
          border:2.5px solid rgba(255,255,255,.35);border-top-color:white;
          border-radius:50%;animation:spin .7s linear infinite;
          vertical-align:middle;margin-right:8px;
        }
        @keyframes spin{to{transform:rotate(360deg)}}

        /* check */
        .lp-check{
          display:inline-flex;align-items:center;gap:8px;
        }
        .lp-check-c{
          width:22px;height:22px;background:rgba(255,255,255,.25);
          border-radius:50%;display:flex;align-items:center;justify-content:center;
          animation:popIn .4s cubic-bezier(.22,.68,0,1.5) both;
        }
        @keyframes popIn{from{transform:scale(0)}to{transform:scale(1)}}

        /* divider */
        .lp-div{
          display:flex;align-items:center;gap:12px;
          margin:22px 0;color:#b0bcd4;font-size:12px;font-weight:600;
          animation:fadeU .5s ease 1.14s both;
        }
        .lp-div::before,.lp-div::after{content:'';flex:1;height:1px;background:#e8edf5}

        /* footer */
        .lp-footer{
          text-align:center;font-size:13px;color:#7a8fb0;
          animation:fadeU .5s ease 1.22s both;
        }
        .lp-footer button{
          background:none;border:none;cursor:pointer;
          font-family:'Plus Jakarta Sans',sans-serif;
          font-weight:700;color:#002B6B;transition:color .2s;
        }
        .lp-footer button:hover{color:#1a7a6e}

        @media(max-width:860px){
          .lp-layout{flex-direction:column;gap:28px}
          .lp-left{flex-direction:row;flex-wrap:wrap;justify-content:center}
          .lp-card{width:100%;max-width:420px}
        }
      `}</style>

      <div className="lp-root">
        <div className="lp-bg" />
        <div className="lp-grid" />

        {particles.map(p => (
          <div key={p.id} className="lp-bubble" style={{
            left:`${p.x}%`, top:`${p.y}%`,
            width:p.size, height:p.size,
            background:p.color,
            "--d":`${p.dur}s`, "--dl":`${p.delay}s`,
          } as any} />
        ))}

        <div className="lp-layout">

          {/* LEFT */}
          <div className="lp-left">

            <div className="lp-brand">
              <div className="lp-brand-icon">
                <svg width="38" height="38" viewBox="0 0 36 36" fill="none">
                  <path d="M18 4C10.27 4 4 10.27 4 18s6.27 14 14 14 14-6.27 14-14S25.73 4 18 4z" fill="white" opacity="0.15"/>
                  <path d="M16 10h4v6h6v4h-6v6h-4v-6h-6v-4h6V10z" fill="white"/>
                </svg>
              </div>
              <h2>Patient Appointments<br/>System</h2>
              <span>Healthcare Portal</span>
            </div>

            {/* orbit */}
            <div className="lp-orbit">
              <div className="lp-ring lp-ring-1"><div className="lp-rdot"/></div>
              <div className="lp-ring lp-ring-2"><div className="lp-rdot"/></div>
              <div className="lp-ring lp-ring-3"><div className="lp-rdot"/></div>
              <div className="lp-core">
                <div className="lp-core-inner">
                  <svg width="34" height="34" viewBox="0 0 32 32" fill="none">
                    <path d="M16 6C10.48 6 6 10.48 6 16s4.48 10 10 10 10-4.48 10-10S21.52 6 16 6z" fill="white" opacity="0.18"/>
                    <path d="M16 10a6 6 0 100 12A6 6 0 0016 10z" fill="white" opacity="0.45"/>
                    <circle cx="16" cy="16" r="3" fill="white"/>
                    <path d="M16 8v2M16 22v2M8 16h2M22 16h2" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
                </div>
              </div>
            </div>

            {/* ECG */}
            <div className="lp-ecg">
              <div className="lp-ecg-label">
                <div className="lp-ecg-dot"/>Live ECG Monitor
              </div>
              <canvas ref={canvasRef} width={360} height={60}/>
            </div>

            {/* stats */}
            <div className="lp-stats">
              {[{ico:"🏥",num:"1,240+",lbl:"Patients"},{ico:"👨‍⚕️",num:"86",lbl:"Doctors"},{ico:"⭐",num:"4.9",lbl:"Rating"}].map((s,i)=>(
                <div className="lp-stat" key={i}>
                  <div className="lp-stat-ico">{s.ico}</div>
                  <span className="lp-stat-num">{s.num}</span>
                  <span className="lp-stat-lbl">{s.lbl}</span>
                </div>
              ))}
            </div>
          </div>

          {/* CARD */}
          <div className={`lp-card ${shake?"lp-shake":""}`}>
            <div className={`lp-prog ${loading?"go":""} ${success?"done":""}`}/>

            <div>
              <div className="lp-badge">
                <div className="lp-badge-dot"/>Secure Login
              </div>
              <h1>Welcome<br/>Back 👋</h1>
              <p>Sign in to your hospital portal</p>
            </div>

            <div className={`lp-field ${focused==="user"?"lp-active":""}`}>
              <label>Username</label>
              <div className="lp-iw">
                <input
                  type="text" placeholder="Enter your username"
                  value={username} onChange={e=>setUsername(e.target.value)}
                  onFocus={()=>setFocused("user")} onBlur={()=>setFocused(null)}
                />
                <span className="lp-ico">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
                  </svg>
                </span>
              </div>
            </div>

            <div className={`lp-field ${focused==="pass"?"lp-active":""}`}>
              <label>Password</label>
              <div className="lp-iw">
                <input
                  type="password" placeholder="Enter your password"
                  value={password} onChange={e=>setPassword(e.target.value)}
                  onFocus={()=>setFocused("pass")} onBlur={()=>setFocused(null)}
                  onKeyDown={e=>e.key==="Enter"&&!loading&&handleLogin()}
                />
                <span className="lp-ico">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                  </svg>
                </span>
              </div>
            </div>

            <div className="lp-forgot">
              <button>Forgot Password?</button>
              <button>Forgot Username?</button>
            </div>

            <button className="lp-btn" onClick={handleLogin} disabled={loading}>
              {success ? (
                <span className="lp-check">
                  <span className="lp-check-c">
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                      <path d="M2 6l3 3 5-5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </span>
                  Login Successful!
                </span>
              ) : loading ? (
                <span><span className="lp-spin"/>Signing in...</span>
              ) : "Login"}
            </button>

            <div className="lp-div">or</div>

            <div className="lp-footer">
              Don't have an account? <button>Register Here</button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}