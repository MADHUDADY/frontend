import { useState } from "react";
import { Plus, Search, Pencil, Trash2 } from "lucide-react";

const initial = [
  { id:1,  name:"Cardiology",        icon:"❤️",  doctors:4, color:"#ef4444" },
  { id:2,  name:"Pediatrics",        icon:"👶",  doctors:3, color:"#3b82f6" },
  { id:3,  name:"Orthopedics",       icon:"🦴",  doctors:5, color:"#f59e0b" },
  { id:4,  name:"Neurology",         icon:"🧠",  doctors:2, color:"#8b5cf6" },
  { id:5,  name:"Dermatology",       icon:"🩺",  doctors:3, color:"#ec4899" },
  { id:6,  name:"Gynecology",        icon:"🌸",  doctors:2, color:"#f43f5e" },
  { id:7,  name:"General Practice",  icon:"🏥",  doctors:6, color:"#0891b2" },
  { id:8,  name:"Ophthalmology",     icon:"👁️",  doctors:2, color:"#059669" },
  { id:9,  name:"Dentistry",         icon:"🦷",  doctors:3, color:"#d97706" },
  { id:10, name:"Psychiatry",        icon:"🧘",  doctors:1, color:"#6366f1" },
];

export default function Specializations() {
  const [specs, setSpecs] = useState(initial);
  const [search, setSearch] = useState("");
  const [show, setShow] = useState(false);
  useState(() => { setTimeout(() => setShow(true), 50); });

  const filtered = specs.filter(s => s.name.toLowerCase().includes(search.toLowerCase()));
  const del = (id: number) => { if (window.confirm("Delete?")) setSpecs(p => p.filter(s => s.id !== id)); };

  return (
    <div style={{ opacity:show?1:0, transform:show?"translateY(0)":"translateY(20px)",
      transition:"all 0.4s ease", padding:24, minHeight:"100vh", background:"#f8fafc" }}>
      <style>{`@keyframes fadeUp{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)}}`}</style>

      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:24 }}>
        <div>
          <h1 style={{ fontSize:22, fontWeight:800, color:"#1e293b", margin:0 }}>🏅 Specializations</h1>
          <p style={{ fontSize:13, color:"#94a3b8", margin:"4px 0 0" }}>Medical specializations offered</p>
        </div>
        <button style={{ display:"flex", alignItems:"center", gap:6, padding:"9px 18px",
          background:"#4f46e5", color:"#fff", border:"none", borderRadius:10,
          fontWeight:700, fontSize:13, cursor:"pointer" }}>
          <Plus size={15}/> Add Specialization
        </button>
      </div>

      <div style={{ position:"relative", marginBottom:20, maxWidth:320 }}>
        <Search size={14} style={{ position:"absolute", left:11, top:"50%", transform:"translateY(-50%)", color:"#94a3b8" }}/>
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search specializations..."
          style={{ width:"100%", paddingLeft:32, paddingRight:12, paddingTop:9, paddingBottom:9,
            border:"1.5px solid #e2e8f0", borderRadius:10, fontSize:13, outline:"none", boxSizing:"border-box" }}/>
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill, minmax(220px,1fr))", gap:14 }}>
        {filtered.map((s, i) => (
          <div key={s.id} style={{
            background:"#fff", borderRadius:16, padding:20,
            border:"1px solid #f1f5f9", boxShadow:"0 1px 3px rgba(0,0,0,0.05)",
            animation:`fadeUp 0.4s ease ${i*0.06}s both`,
            transition:"box-shadow .2s, transform .2s",
          }}
            onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.transform="translateY(-3px)"; (e.currentTarget as HTMLDivElement).style.boxShadow="0 8px 24px rgba(0,0,0,0.1)"; }}
            onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.transform="translateY(0)"; (e.currentTarget as HTMLDivElement).style.boxShadow="0 1px 3px rgba(0,0,0,0.05)"; }}
          >
            <div style={{ fontSize:36, marginBottom:12 }}>{s.icon}</div>
            <h3 style={{ fontSize:15, fontWeight:700, color:"#1e293b", margin:"0 0 6px" }}>{s.name}</h3>
            <p style={{ fontSize:12, color:"#94a3b8", margin:"0 0 14px" }}>
              <span style={{ fontWeight:700, color:s.color }}>{s.doctors}</span> Doctors
            </p>
            <div style={{ height:3, background:s.color+"22", borderRadius:99 }}>
              <div style={{ height:"100%", width:`${Math.min(s.doctors*15, 100)}%`, background:s.color, borderRadius:99 }}/>
            </div>
            <div style={{ display:"flex", gap:8, marginTop:14 }}>
              <button style={{ flex:1, padding:"6px 0", borderRadius:8, border:"none",
                background:s.color+"18", color:s.color, fontSize:12, fontWeight:700, cursor:"pointer" }}>
                <Pencil size={11} style={{ display:"inline", marginRight:4 }}/>Edit
              </button>
              <button onClick={() => del(s.id)}
                style={{ width:32, borderRadius:8, border:"none",
                  background:"#fee2e2", color:"#dc2626", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center" }}>
                <Trash2 size={12}/>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}