import { useState } from "react";
import { Plus, Search, Pencil, Trash2 } from "lucide-react";

const initial = [
  { id:1, name:"MRI Machine",       category:"Equipment", location:"Radiology Dept", value:"AED 450,000", status:"Active",      date:"2022-03-15" },
  { id:2, name:"ECG Machine",       category:"Equipment", location:"Cardiology",     value:"AED 12,000",  status:"Active",      date:"2023-01-10" },
  { id:3, name:"X-Ray Machine",     category:"Equipment", location:"Radiology Dept", value:"AED 85,000",  status:"Maintenance", date:"2021-11-20" },
  { id:4, name:"Reception Desk",    category:"Furniture", location:"Reception",      value:"AED 3,500",   status:"Active",      date:"2020-06-01" },
  { id:5, name:"Ambulance Van",     category:"Vehicle",   location:"Parking",        value:"AED 120,000", status:"Active",      date:"2023-05-18" },
  { id:6, name:"Ultrasound Device", category:"Equipment", location:"OB/GYN",         value:"AED 60,000",  status:"Active",      date:"2022-09-05" },
];

const statusColor: Record<string,{bg:string;text:string}> = {
  Active:      { bg:"#dcfce7", text:"#16a34a" },
  Maintenance: { bg:"#fef9c3", text:"#a16207" },
  Inactive:    { bg:"#fee2e2", text:"#dc2626" },
};
const catColor: Record<string,string> = { Equipment:"#4f46e5", Furniture:"#0891b2", Vehicle:"#059669" };

export default function Assets() {
  const [assets, setAssets] = useState(initial);
  const [search, setSearch] = useState("");
  const [show, setShow] = useState(false);
  useState(() => { setTimeout(() => setShow(true), 50); });

  const filtered = assets.filter(a =>
    a.name.toLowerCase().includes(search.toLowerCase()) ||
    a.category.toLowerCase().includes(search.toLowerCase())
  );
  const del = (id:number) => { if (window.confirm("Delete asset?")) setAssets(p => p.filter(a => a.id !== id)); };

  return (
    <div style={{ opacity:show?1:0, transform:show?"translateY(0)":"translateY(20px)",
      transition:"all 0.4s ease", padding:24, minHeight:"100vh", background:"#f8fafc" }}>
      <style>{`@keyframes fadeUp{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}`}</style>

      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:24 }}>
        <div>
          <h1 style={{ fontSize:22, fontWeight:800, color:"#1e293b", margin:0 }}>🏗️ Assets</h1>
          <p style={{ fontSize:13, color:"#94a3b8", margin:"4px 0 0" }}>Track clinic equipment & assets</p>
        </div>
        <button style={{ display:"flex", alignItems:"center", gap:6, padding:"9px 18px",
          background:"#4f46e5", color:"#fff", border:"none", borderRadius:10,
          fontWeight:700, fontSize:13, cursor:"pointer" }}>
          <Plus size={15}/> Add Asset
        </button>
      </div>

      {/* Summary cards */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:14, marginBottom:20 }}>
        {[
          { label:"Total Assets", value:assets.length, color:"#4f46e5", icon:"🏗️" },
          { label:"Active",       value:assets.filter(a=>a.status==="Active").length, color:"#059669", icon:"✅" },
          { label:"Maintenance",  value:assets.filter(a=>a.status==="Maintenance").length, color:"#d97706", icon:"🔧" },
        ].map((c, i) => (
          <div key={c.label} style={{ background:"#fff", borderRadius:14, padding:"16px 20px",
            border:"1px solid #f1f5f9", animation:`fadeUp 0.35s ease ${i*0.08}s both`,
            display:"flex", alignItems:"center", gap:14 }}>
            <span style={{ fontSize:28 }}>{c.icon}</span>
            <div>
              <p style={{ fontSize:22, fontWeight:800, color:c.color, margin:0 }}>{c.value}</p>
              <p style={{ fontSize:12, color:"#94a3b8", margin:0 }}>{c.label}</p>
            </div>
          </div>
        ))}
      </div>

      <div style={{ position:"relative", marginBottom:16, maxWidth:320 }}>
        <Search size={14} style={{ position:"absolute", left:11, top:"50%", transform:"translateY(-50%)", color:"#94a3b8" }}/>
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search assets..."
          style={{ width:"100%", paddingLeft:32, paddingRight:12, paddingTop:9, paddingBottom:9,
            border:"1.5px solid #e2e8f0", borderRadius:10, fontSize:13, outline:"none", boxSizing:"border-box" }}/>
      </div>

      <div style={{ background:"#fff", borderRadius:16, border:"1px solid #f1f5f9", overflow:"hidden" }}>
        <table style={{ width:"100%", borderCollapse:"collapse" }}>
          <thead>
            <tr style={{ background:"#f8fafc" }}>
              {["Asset Name","Category","Location","Value","Status","Date Added","Actions"].map(h => (
                <th key={h} style={{ padding:"11px 14px", textAlign:"left", fontSize:10,
                  fontWeight:700, color:"#64748b", textTransform:"uppercase", letterSpacing:"0.05em" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((a, i) => (
              <tr key={a.id} style={{ borderTop:"1px solid #f1f5f9", animation:`fadeUp 0.35s ease ${i*0.05}s both` }}>
                <td style={{ padding:"13px 14px", fontWeight:600, color:"#1e293b", fontSize:13 }}>{a.name}</td>
                <td style={{ padding:"13px 14px" }}>
                  <span style={{ fontSize:11, fontWeight:700, padding:"3px 9px", borderRadius:50,
                    background:(catColor[a.category]||"#4f46e5")+"18", color:catColor[a.category]||"#4f46e5" }}>
                    {a.category}
                  </span>
                </td>
                <td style={{ padding:"13px 14px", fontSize:13, color:"#64748b" }}>{a.location}</td>
                <td style={{ padding:"13px 14px", fontSize:13, fontWeight:700, color:"#1e293b" }}>{a.value}</td>
                <td style={{ padding:"13px 14px" }}>
                  <span style={{ fontSize:11, fontWeight:700, padding:"3px 9px", borderRadius:50,
                    background:statusColor[a.status]?.bg, color:statusColor[a.status]?.text }}>
                    {a.status}
                  </span>
                </td>
                <td style={{ padding:"13px 14px", fontSize:12, color:"#94a3b8" }}>{a.date}</td>
                <td style={{ padding:"13px 14px" }}>
                  <div style={{ display:"flex", gap:6 }}>
                    <button style={{ width:29, height:29, borderRadius:7, background:"#3b82f6", border:"none", color:"#fff", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center" }}><Pencil size={12}/></button>
                    <button onClick={() => del(a.id)} style={{ width:29, height:29, borderRadius:7, background:"#ef4444", border:"none", color:"#fff", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center" }}><Trash2 size={12}/></button>
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