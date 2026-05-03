import { useState } from "react";

const initial = [
  { id:1, action:"New patient registered",        user:"Admin",     time:"2 min ago",   icon:"👤", color:"#4f46e5" },
  { id:2, action:"Appointment booked — Dr. Ahmed", user:"Reception", time:"10 min ago",  icon:"📅", color:"#0891b2" },
  { id:3, action:"Invoice #1045 generated",       user:"Cashier",   time:"25 min ago",  icon:"💰", color:"#059669" },
  { id:4, action:"Doctor schedule updated",       user:"Admin",     time:"1 hr ago",    icon:"👨‍⚕️", color:"#7c3aed" },
  { id:5, action:"New employee added",            user:"HR",        time:"2 hrs ago",   icon:"🧑‍💼", color:"#f59e0b" },
  { id:6, action:"Clinic settings updated",       user:"Admin",     time:"3 hrs ago",   icon:"⚙️", color:"#64748b" },
  { id:7, action:"Appointment cancelled",         user:"Reception", time:"4 hrs ago",   icon:"❌", color:"#ef4444" },
  { id:8, action:"Report downloaded",             user:"Doctor",    time:"Yesterday",   icon:"📄", color:"#0891b2" },
];

export default function Activities() {
  const [show, setShow] = useState(false);

  useState(() => {
    setTimeout(() => setShow(true), 50);
  });

  return (
    <div
      style={{
        opacity: show ? 1 : 0,
        transform: show ? "translateY(0)" : "translateY(20px)",
        transition: "all 0.4s ease",
        padding: 24,
        minHeight: "100vh",
        background: "#f8fafc",
      }}
    >
      <style>{`
        @keyframes fadeUp {
          from { opacity:0; transform:translateY(12px) }
          to { opacity:1; transform:translateY(0) }
        }
      `}</style>

      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 22, fontWeight: 800, color: "#1e293b", margin: 0 }}>
          ⚡ Activities
        </h1>
        <p style={{ fontSize: 13, color: "#94a3b8", margin: "4px 0 0" }}>
          Recent system activity log
        </p>
      </div>

      <div
        style={{
          background: "#fff",
          borderRadius: 16,
          border: "1px solid #f1f5f9",
          padding: 24,
          maxWidth: 720,
        }}
      >
        <div style={{ position: "relative" }}>
          {/* vertical line */}
          <div
            style={{
              position: "absolute",
              left: 18,
              top: 0,
              bottom: 0,
              width: 2,
              background: "linear-gradient(to bottom, #4f46e5, #e2e8f0)",
              borderRadius: 99,
            }}
          />

          {initial.map((a, i) => (
            <div
              key={a.id}
              style={{
                display: "flex",
                gap: 16,
                alignItems: "flex-start",
                paddingBottom: 24,
                paddingLeft: 4,
                animation: `fadeUp 0.4s ease ${i * 0.07}s both`,
              }}
            >
              {/* icon bubble */}
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: "50%",
                  flexShrink: 0,
                  background: a.color + "18", // ✅ fixed (only one background)
                  border: `2px solid ${a.color}44`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 16,
                  zIndex: 1,
                  boxShadow: `0 0 0 3px ${a.color}22`,
                }}
              >
                {a.icon}
              </div>

              <div style={{ flex: 1, paddingTop: 6 }}>
                <p
                  style={{
                    fontSize: 14,
                    fontWeight: 600,
                    color: "#1e293b",
                    margin: "0 0 3px",
                  }}
                >
                  {a.action}
                </p>

                <div style={{ display: "flex", gap: 10 }}>
                  <span style={{ fontSize: 12, color: "#94a3b8" }}>
                    by{" "}
                    <strong style={{ color: "#64748b" }}>
                      {a.user}
                    </strong>
                  </span>
                  <span style={{ fontSize: 12, color: "#94a3b8" }}>·</span>
                  <span style={{ fontSize: 12, color: "#94a3b8" }}>
                    {a.time}
                  </span>
                </div>
              </div>

              <span
                style={{
                  fontSize: 11,
                  padding: "3px 9px",
                  borderRadius: 50,
                  background: a.color + "18",
                  color: a.color,
                  fontWeight: 700,
                  marginTop: 6,
                  flexShrink: 0,
                }}
              >
                Log
              </span>
            </div>
          ))}
        </div>

        <button
          style={{
            width: "100%",
            padding: "10px 0",
            borderRadius: 10,
            border: "1px solid #e2e8f0",
            background: "#f8fafc",
            fontSize: 13,
            fontWeight: 600,
            color: "#64748b",
            cursor: "pointer",
            marginTop: 4,
          }}
        >
          Load More Activities
        </button>
      </div>
    </div>
  );
}