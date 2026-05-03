import { useState } from "react";
import { Plus, Search, Pencil, Trash2 } from "lucide-react";

const initial = [
  { id:1, name:"General Consultation", category:"General",    duration:"30 min", fee:"AED 150", active:true  },
  { id:2, name:"Blood Test",           category:"Lab",        duration:"15 min", fee:"AED 80",  active:true  },
  { id:3, name:"X-Ray",                category:"Radiology",  duration:"20 min", fee:"AED 200", active:true  },
  { id:4, name:"ECG",                  category:"Cardiology", duration:"20 min", fee:"AED 250", active:false },
  { id:5, name:"Physiotherapy",        category:"Therapy",    duration:"45 min", fee:"AED 300", active:true  },
  { id:6, name:"Vaccination",          category:"Preventive", duration:"10 min", fee:"AED 100", active:true  },
];

const catColors: Record<string,string> = {
  General:"#4f46e5", Lab:"#0891b2", Radiology:"#7c3aed",
  Cardiology:"#dc2626", Therapy:"#059669", Preventive:"#d97706",
};

export default function Services() {
  const [services, setServices] = useState(initial);
  const [search, setSearch]     = useState("");
  const [show, setShow]         = useState(false);
  useState(() => { setTimeout(() => setShow(true), 50); });

  const filtered = services.filter(s =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.category.toLowerCase().includes(search.toLowerCase())
  );

  const del = (id: number) => {
    if (window.confirm("Delete service?")) setServices(p => p.filter(s => s.id !== id));
  };

  return (
    <div style={{ opacity:show?1:0, transform:show?"translateY(0)":"translateY(20px)",
      transition:"all 0.4s ease", padding:24, minHeight:"100vh", background:"#f8fafc" }}>
      <style>{`@keyframes fadeUp{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}`}</style>

      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:24 }}>
        <div>
          <h1 style={{ fontSize:22, fontWeight:800, color:"#1e293b", margin:0 }}>⚙️ Services</h1>
          <p style={{ fontSize:13, color:"#94a3b8", margin:"4px 0 0" }}>Manage clinic services & pricing</p>
        </div>
        <button style={{ display:"flex", alignItems:"center", gap:6, padding:"9px 18px",
          background:"#4f46e5", color:"#fff", border:"none", borderRadius:10,
          fontWeight:700, fontSize:13, cursor:"pointer" }}>
          <Plus size={15}/> Add Service
        </button>
      </div>

      <div style={{ position:"relative", marginBottom:20, maxWidth:320 }}>
        <Search size={14} style={{ position:"absolute", left:11, top:"50%", transform:"translateY(-50%)", color:"#94a3b8" }}/>
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search services..."
          style={{ width:"100%", paddingLeft:32, paddingRight:12, paddingTop:9, paddingBottom:9,
            border:"1.5px solid #e2e8f0", borderRadius:10, fontSize:13, outline:"none", boxSizing:"border-box" }}/>
      </div>

      <div style={{ background:"#fff", borderRadius:16, border:"1px solid #f1f5f9", overflow:"hidden" }}>
        <table style={{ width:"100%", borderCollapse:"collapse" }}>
          <thead>
            <tr style={{ background:"#f8fafc" }}>
              {["Service Name","Category","Duration","Fee","Status","Actions"].map(h => (
                <th key={h} style={{ padding:"12px 16px", textAlign:"left", fontSize:11,
                  fontWeight:700, color:"#64748b", textTransform:"uppercase", letterSpacing:"0.05em" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((s, i) => (
              <tr key={s.id} style={{ borderTop:"1px solid #f1f5f9",
                animation:`fadeUp 0.35s ease ${i*0.05}s both` }}>
                <td style={{ padding:"14px 16px", fontWeight:600, color:"#1e293b", fontSize:14 }}>{s.name}</td>
                <td style={{ padding:"14px 16px" }}>
                  <span style={{ fontSize:11, fontWeight:700, padding:"3px 10px", borderRadius:50,
                    background:(catColors[s.category]||"#4f46e5")+"18",
                    color:catColors[s.category]||"#4f46e5" }}>{s.category}</span>
                </td>
                <td style={{ padding:"14px 16px", fontSize:13, color:"#64748b" }}>⏱ {s.duration}</td>
                <td style={{ padding:"14px 16px", fontSize:13, fontWeight:700, color:"#1e293b" }}>{s.fee}</td>
                <td style={{ padding:"14px 16px" }}>
                  <span style={{ fontSize:11, fontWeight:700, padding:"3px 10px", borderRadius:50,
                    background:s.active?"#dcfce7":"#fee2e2", color:s.active?"#16a34a":"#dc2626" }}>
                    {s.active?"Active":"Inactive"}
                  </span>
                </td>
                <td style={{ padding:"14px 16px" }}>
                  <div style={{ display:"flex", gap:6 }}>
                    <button style={{ width:30, height:30, borderRadius:7, background:"#3b82f6",
                      border:"none", color:"#fff", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center" }}>
                      <Pencil size={13}/>
                    </button>
                    <button onClick={() => del(s.id)}
                      style={{ width:30, height:30, borderRadius:7, background:"#ef4444",
                        border:"none", color:"#fff", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center" }}>
                      <Trash2 size={13}/>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}