import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Pencil, Trash2, Eye, MapPin, Plus, Search } from "lucide-react";

const initialLocations = [
  { id: 1, name: "Dubai Main Clinic",    address: "Plot 333, Satwa, Dubai",    phone: "+971 4 561 5645", manager: "Dr. Ahmed",  active: true  },
  { id: 2, name: "Abu Dhabi Branch",     address: "Corniche Road, Abu Dhabi",  phone: "+971 2 444 3333", manager: "Dr. Sara",   active: true  },
  { id: 3, name: "Sharjah Clinic",       address: "Al Nahda, Sharjah",         phone: "+971 6 555 1111", manager: "Dr. John",   active: false },
  { id: 4, name: "Ajman Health Center",  address: "Al Jurf, Ajman",            phone: "+971 6 742 0000", manager: "Dr. Fatima", active: true  },
];

export default function Locations() {
  const navigate = useNavigate();
  const [locations, setLocations] = useState(initialLocations);
  const [search, setSearch] = useState("");
  const [visible, setVisible] = useState(false);

  // mount animation
  useState(() => { setTimeout(() => setVisible(true), 50); });

  const filtered = locations.filter(l =>
    l.name.toLowerCase().includes(search.toLowerCase()) ||
    l.address.toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = (id: number) => {
    if (window.confirm("Delete this location?"))
      setLocations(prev => prev.filter(l => l.id !== id));
  };

  return (
    <div style={{
      opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(20px)",
      transition: "all 0.4s ease", padding: 24, minHeight: "100vh", background: "#f8fafc",
    }}>
      {/* Header */}
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:24 }}>
        <div>
          <h1 style={{ fontSize:22, fontWeight:800, color:"#1e293b", margin:0 }}>📍 Locations</h1>
          <p style={{ fontSize:13, color:"#94a3b8", margin:"4px 0 0" }}>Manage clinic locations & branches</p>
        </div>
        <button onClick={() => navigate("/dashboard/NewClinic")}
          style={{ display:"flex", alignItems:"center", gap:6, padding:"9px 18px", background:"#4f46e5",
            color:"#fff", border:"none", borderRadius:10, fontWeight:700, fontSize:13, cursor:"pointer" }}>
          <Plus size={15}/> Add Location
        </button>
      </div>

      {/* Search */}
      <div style={{ position:"relative", marginBottom:20, maxWidth:320 }}>
        <Search size={14} style={{ position:"absolute", left:11, top:"50%", transform:"translateY(-50%)", color:"#94a3b8" }}/>
        <input value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Search locations..."
          style={{ width:"100%", paddingLeft:32, paddingRight:12, paddingTop:9, paddingBottom:9,
            border:"1.5px solid #e2e8f0", borderRadius:10, fontSize:13, outline:"none", boxSizing:"border-box" }}/>
      </div>

      {/* Cards */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill, minmax(300px,1fr))", gap:16 }}>
        {filtered.map((loc, i) => (
          <div key={loc.id} style={{
            background:"#fff", borderRadius:16, padding:20,
            border:"1px solid #f1f5f9", boxShadow:"0 1px 3px rgba(0,0,0,0.06)",
            opacity:0, animation:`fadeUp 0.4s ease ${i*0.07}s forwards`,
          }}>
            <style>{`@keyframes fadeUp{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}`}</style>
            <div style={{ display:"flex", justifyContent:"space-between", marginBottom:12 }}>
              <div style={{ width:42, height:42, borderRadius:12, background:"#eef2ff",
                display:"flex", alignItems:"center", justifyContent:"center" }}>
                <MapPin size={20} color="#4f46e5"/>
              </div>
              <span style={{ fontSize:11, fontWeight:700, padding:"3px 10px", borderRadius:50,
                background: loc.active ? "#dcfce7" : "#fee2e2",
                color: loc.active ? "#16a34a" : "#dc2626" }}>
                {loc.active ? "Active" : "Inactive"}
              </span>
            </div>
            <h3 style={{ fontSize:15, fontWeight:700, color:"#1e293b", margin:"0 0 4px" }}>{loc.name}</h3>
            <p style={{ fontSize:12, color:"#64748b", margin:"0 0 3px" }}>📍 {loc.address}</p>
            <p style={{ fontSize:12, color:"#64748b", margin:"0 0 3px" }}>📞 {loc.phone}</p>
            <p style={{ fontSize:12, color:"#64748b", margin:"0 0 16px" }}>👤 {loc.manager}</p>
            <div style={{ display:"flex", gap:8 }}>
              <button style={{ flex:1, padding:"7px 0", borderRadius:8, border:"1px solid #e2e8f0",
                background:"#f8fafc", fontSize:12, fontWeight:600, cursor:"pointer", color:"#475569" }}>
                <Eye size={12} style={{ display:"inline", marginRight:4 }}/>View
              </button>
              <button style={{ flex:1, padding:"7px 0", borderRadius:8, border:"none",
                background:"#4f46e5", color:"#fff", fontSize:12, fontWeight:600, cursor:"pointer" }}>
                <Pencil size={12} style={{ display:"inline", marginRight:4 }}/>Edit
              </button>
              <button onClick={() => handleDelete(loc.id)}
                style={{ width:34, borderRadius:8, border:"none",
                  background:"#fee2e2", color:"#dc2626", fontSize:12, cursor:"pointer" }}>
                <Trash2 size={13}/>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}