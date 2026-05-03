import { useState } from "react";
import { Plus, Search, Pencil, Trash2, X, Eye } from "lucide-react";

// ── Shared ────────────────────────────────────────────────────────────────────
const FadeStyle = () => (
  <style>{`
    @keyframes fadeUp{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}
    @keyframes modalIn{from{opacity:0;transform:scale(0.93)}to{opacity:1;transform:scale(1)}}
    .modal-overlay{position:fixed;inset:0;background:rgba(0,0,0,0.45);display:flex;align-items:center;justify-content:center;z-index:1000;padding:16px}
    .modal-box{background:#fff;border-radius:20px;padding:28px;width:100%;max-width:500px;animation:modalIn .22s ease;max-height:90vh;overflow-y:auto}
    .inp{width:100%;padding:9px 12px;border:1.5px solid #e2e8f0;border-radius:10px;font-size:13px;outline:none;box-sizing:border-box;font-family:inherit}
    .inp:focus{border-color:#4f46e5}
    .sel{width:100%;padding:9px 12px;border:1.5px solid #e2e8f0;border-radius:10px;font-size:13px;outline:none;box-sizing:border-box;background:#fff}
    .btn-primary{background:#4f46e5;color:#fff;border:none;border-radius:10px;padding:9px 20px;font-size:13px;font-weight:700;cursor:pointer}
    .btn-cancel{background:#f1f5f9;color:#64748b;border:none;border-radius:10px;padding:9px 20px;font-size:13px;font-weight:700;cursor:pointer}
    label.lbl{display:block;font-size:12px;font-weight:600;color:#374151;margin-bottom:5px;margin-top:12px}
  `}</style>
);

function useShow() {
  const [show, setShow] = useState(false);
  useState(() => { setTimeout(() => setShow(true), 50); });
  return show;
}

const Overlay = ({ children }: { children: React.ReactNode }) => (
  <div className="modal-overlay">{children}</div>
);

// ── HRM Staffs ────────────────────────────────────────────────────────────────
export function HRMStaffs() {
  const show = useShow();
  const [data, setData] = useState([
    { id:1, name:"Ahmed Al Mansoori", role:"Doctor",    dept:"Cardiology",  join:"2021-03-10", status:"Active",   mobile:"+971 501234567", email:"ahmed@clinic.com"  },
    { id:2, name:"Sara Al Hashimi",   role:"Nurse",     dept:"Pediatrics",  join:"2022-06-15", status:"Active",   mobile:"+971 509876543", email:"sara@clinic.com"   },
    { id:3, name:"John Smith",        role:"Reception", dept:"Front Desk",  join:"2020-01-20", status:"Active",   mobile:"+971 554433221", email:"john@clinic.com"   },
    { id:4, name:"Fatima Yousuf",     role:"Lab Tech",  dept:"Laboratory",  join:"2023-02-28", status:"On Leave", mobile:"+971 551122334", email:"fatima@clinic.com" },
  ]);

  const blank = { name:"", role:"Doctor", dept:"", join:"", status:"Active", mobile:"", email:"" };
  const [search, setSearch]   = useState("");
  const [modal,  setModal]    = useState<"add"|"edit"|"view"|null>(null);
  const [form,   setForm]     = useState(blank);
  const [selId,  setSelId]    = useState<number|null>(null);

  const filtered = data.filter(d =>
    d.name.toLowerCase().includes(search.toLowerCase()) ||
    d.role.toLowerCase().includes(search.toLowerCase())
  );

  const openAdd  = () => { setForm(blank); setModal("add"); };
  const openEdit = (r: any) => { setForm(r); setSelId(r.id); setModal("edit"); };
  const openView = (r: any) => { setForm(r); setModal("view"); };

  const save = () => {
    if (!form.name.trim()) return alert("Name required");
    if (modal === "add") {
      setData(p => [...p, { ...form, id: Date.now() }]);
    } else {
      setData(p => p.map(d => d.id === selId ? { ...form, id: selId! } : d));
    }
    setModal(null);
  };

  const del = (id: number) => {
    if (window.confirm("Delete this staff member?"))
      setData(p => p.filter(d => d.id !== id));
  };

  const sc: Record<string, { bg: string; text: string }> = {
    "Active":   { bg:"#dcfce7", text:"#16a34a" },
    "On Leave": { bg:"#fef9c3", text:"#a16207" },
    "Inactive": { bg:"#fee2e2", text:"#dc2626" },
  };

  return (
    <div style={{ opacity:show?1:0, transform:show?"translateY(0)":"translateY(20px)", transition:"all 0.4s ease", padding:24, minHeight:"100vh", background:"#f8fafc" }}>
      <FadeStyle/>

      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:24 }}>
        <div>
          <h1 style={{ fontSize:22, fontWeight:800, color:"#1e293b", margin:0 }}>👥 HRM — Staffs</h1>
          <p style={{ fontSize:13, color:"#94a3b8", margin:"4px 0 0" }}>{data.length} staff members</p>
        </div>
        <button className="btn-primary" onClick={openAdd} style={{ display:"flex", alignItems:"center", gap:6, borderRadius:10 }}>
          <Plus size={15}/> Add Staff
        </button>
      </div>

      <div style={{ position:"relative", marginBottom:16, maxWidth:300 }}>
        <Search size={14} style={{ position:"absolute", left:11, top:"50%", transform:"translateY(-50%)", color:"#94a3b8" }}/>
        <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search staff..."
          className="inp" style={{ paddingLeft:32 }}/>
      </div>

      <div style={{ background:"#fff", borderRadius:16, border:"1px solid #f1f5f9", overflow:"hidden" }}>
        <table style={{ width:"100%", borderCollapse:"collapse" }}>
          <thead>
            <tr style={{ background:"#f8fafc" }}>
              {["Name","Role","Department","Join Date","Status","Actions"].map(h=>(
                <th key={h} style={{ padding:"11px 14px", textAlign:"left", fontSize:10, fontWeight:700, color:"#64748b", textTransform:"uppercase" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((d,i)=>(
              <tr key={d.id} style={{ borderTop:"1px solid #f1f5f9", animation:`fadeUp 0.3s ease ${i*0.05}s both` }}>
                <td style={{ padding:"13px 14px", fontWeight:600, color:"#1e293b", fontSize:13 }}>{d.name}</td>
                <td style={{ padding:"13px 14px", fontSize:13, color:"#64748b" }}>{d.role}</td>
                <td style={{ padding:"13px 14px", fontSize:13, color:"#64748b" }}>{d.dept}</td>
                <td style={{ padding:"13px 14px", fontSize:12, color:"#94a3b8" }}>{d.join}</td>
                <td style={{ padding:"13px 14px" }}>
                  <span style={{ fontSize:11, fontWeight:700, padding:"3px 9px", borderRadius:50, background:sc[d.status]?.bg, color:sc[d.status]?.text }}>{d.status}</span>
                </td>
                <td style={{ padding:"13px 14px" }}>
                  <div style={{ display:"flex", gap:6 }}>
                    <button onClick={()=>openView(d)} style={{ width:29,height:29,borderRadius:7,background:"#22c55e",border:"none",color:"#fff",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center" }}><Eye size={12}/></button>
                    <button onClick={()=>openEdit(d)} style={{ width:29,height:29,borderRadius:7,background:"#3b82f6",border:"none",color:"#fff",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center" }}><Pencil size={12}/></button>
                    <button onClick={()=>del(d.id)} style={{ width:29,height:29,borderRadius:7,background:"#ef4444",border:"none",color:"#fff",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center" }}><Trash2 size={12}/></button>
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length===0 && <tr><td colSpan={6} style={{ textAlign:"center",padding:40,color:"#94a3b8" }}>No staff found</td></tr>}
          </tbody>
        </table>
      </div>

      {(modal==="add"||modal==="edit") && (
        <Overlay>
          <div className="modal-box">
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16 }}>
              <h2 style={{ margin:0, fontSize:17, fontWeight:800 }}>{modal==="add"?"Add Staff":"Edit Staff"}</h2>
              <button onClick={()=>setModal(null)} style={{ background:"none",border:"none",cursor:"pointer" }}><X size={20}/></button>
            </div>
            {[["Full Name","name","text"],["Department","dept","text"],["Mobile","mobile","tel"],["Email","email","email"],["Join Date","join","date"]].map(([label,key,type])=>(
              <div key={key}>
                <label className="lbl">{label}</label>
                <input className="inp" type={type} value={(form as any)[key]||""} onChange={e=>setForm(f=>({...f,[key]:e.target.value}))} placeholder={`Enter ${label.toLowerCase()}`}/>
              </div>
            ))}
            <div>
              <label className="lbl">Role</label>
              <select className="sel" value={form.role} onChange={e=>setForm(f=>({...f,role:e.target.value}))}>
                {["Doctor","Senior Nurse","Junior Nurse","Receptionist","Lab Technician","Radiologist","Pharmacist","Accountant","IT Support"].map(r=><option key={r}>{r}</option>)}
              </select>
            </div>
            <div>
              <label className="lbl">Status</label>
              <select className="sel" value={form.status} onChange={e=>setForm(f=>({...f,status:e.target.value}))}>
                {["Active","On Leave","Inactive"].map(s=><option key={s}>{s}</option>)}
              </select>
            </div>
            <div style={{ display:"flex", gap:10, marginTop:20 }}>
              <button className="btn-cancel" onClick={()=>setModal(null)} style={{ flex:1 }}>Cancel</button>
              <button className="btn-primary" onClick={save} style={{ flex:1, borderRadius:10 }}>Save</button>
            </div>
          </div>
        </Overlay>
      )}

      {modal==="view" && (
        <Overlay>
          <div className="modal-box">
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:20 }}>
              <h2 style={{ margin:0, fontSize:17, fontWeight:800 }}>Staff Details</h2>
              <button onClick={()=>setModal(null)} style={{ background:"none",border:"none",cursor:"pointer" }}><X size={20}/></button>
            </div>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14 }}>
              {[["Name",form.name],["Role",form.role],["Department",form.dept],["Mobile",form.mobile],["Email",form.email],["Join Date",form.join],["Status",form.status]].map(([l,v])=>(
                <div key={l}>
                  <p style={{ fontSize:11,color:"#94a3b8",fontWeight:600,margin:"0 0 3px",textTransform:"uppercase" }}>{l}</p>
                  <p style={{ fontSize:13,color:"#1e293b",fontWeight:600,margin:0 }}>{v||"—"}</p>
                </div>
              ))}
            </div>
            <button className="btn-cancel" onClick={()=>setModal(null)} style={{ width:"100%",marginTop:20 }}>Close</button>
          </div>
        </Overlay>
      )}
    </div>
  );
}

// ── HRM Departments ───────────────────────────────────────────────────────────
export function HRMDepartments() {
  const show = useShow();
  const [data, setData] = useState([
    { id:1, name:"Cardiology",  head:"Dr. Ahmed",  staff:8, color:"#ef4444", icon:"❤️" },
    { id:2, name:"Pediatrics",  head:"Dr. Sara",   staff:5, color:"#3b82f6", icon:"👶" },
    { id:3, name:"Radiology",   head:"Dr. John",   staff:4, color:"#7c3aed", icon:"🩻" },
    { id:4, name:"Laboratory",  head:"Ms. Fatima", staff:6, color:"#059669", icon:"🧪" },
    { id:5, name:"Front Desk",  head:"Mr. Khalid", staff:3, color:"#f59e0b", icon:"🏢" },
  ]);
  const blank = { name:"", head:"", staff:0, color:"#4f46e5", icon:"🏥" };
  const [modal, setModal] = useState<"add"|"edit"|null>(null);
  const [form,  setForm]  = useState<any>(blank);
  const [selId, setSelId] = useState<number|null>(null);

  const openAdd  = () => { setForm(blank); setModal("add"); };
  const openEdit = (r: any) => { setForm(r); setSelId(r.id); setModal("edit"); };
  const save = () => {
    if (!form.name.trim()) return alert("Name required");
    if (modal==="add") setData(p=>[...p,{...form,id:Date.now(),staff:Number(form.staff)||0}]);
    else setData(p=>p.map(d=>d.id===selId?{...form,id:selId!,staff:Number(form.staff)||0}:d));
    setModal(null);
  };
  const del = (id:number) => { if(window.confirm("Delete department?")) setData(p=>p.filter(d=>d.id!==id)); };

  return (
    <div style={{ opacity:show?1:0,transform:show?"translateY(0)":"translateY(20px)",transition:"all 0.4s ease",padding:24,minHeight:"100vh",background:"#f8fafc" }}>
      <FadeStyle/>
      <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:24 }}>
        <div>
          <h1 style={{ fontSize:22,fontWeight:800,color:"#1e293b",margin:0 }}>🏢 HRM — Departments</h1>
          <p style={{ fontSize:13,color:"#94a3b8",margin:"4px 0 0" }}>{data.length} departments</p>
        </div>
        <button className="btn-primary" onClick={openAdd} style={{ display:"flex",alignItems:"center",gap:6,borderRadius:10 }}><Plus size={15}/> Add Dept</button>
      </div>
      <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(240px,1fr))",gap:14 }}>
        {data.map((d,i)=>(
          <div key={d.id} style={{ background:"#fff",borderRadius:16,padding:20,border:"1px solid #f1f5f9",animation:`fadeUp 0.4s ease ${i*0.07}s both`,transition:"transform .2s" }}
            onMouseEnter={e=>(e.currentTarget as HTMLDivElement).style.transform="translateY(-3px)"}
            onMouseLeave={e=>(e.currentTarget as HTMLDivElement).style.transform="translateY(0)"}>
            <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12 }}>
              <div style={{ fontSize:34 }}>{d.icon}</div>
              <div style={{ display:"flex",gap:6 }}>
                <button onClick={()=>openEdit(d)} style={{ width:28,height:28,borderRadius:7,background:"#3b82f6",border:"none",color:"#fff",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center" }}><Pencil size={11}/></button>
                <button onClick={()=>del(d.id)} style={{ width:28,height:28,borderRadius:7,background:"#ef4444",border:"none",color:"#fff",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center" }}><Trash2 size={11}/></button>
              </div>
            </div>
            <h3 style={{ fontSize:15,fontWeight:700,color:"#1e293b",margin:"0 0 4px" }}>{d.name}</h3>
            <p style={{ fontSize:12,color:"#94a3b8",margin:"0 0 3px" }}>Head: <strong style={{ color:"#64748b" }}>{d.head}</strong></p>
            <p style={{ fontSize:12,color:"#94a3b8",margin:"0 0 12px" }}>Staff: <strong style={{ color:d.color }}>{d.staff}</strong></p>
            <div style={{ height:4,background:d.color+"22",borderRadius:99 }}>
              <div style={{ height:"100%",width:`${Math.min(d.staff*10,100)}%`,background:d.color,borderRadius:99 }}/>
            </div>
          </div>
        ))}
      </div>
      {modal && (
        <Overlay>
          <div className="modal-box">
            <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16 }}>
              <h2 style={{ margin:0,fontSize:17,fontWeight:800 }}>{modal==="add"?"Add Department":"Edit Department"}</h2>
              <button onClick={()=>setModal(null)} style={{ background:"none",border:"none",cursor:"pointer" }}><X size={20}/></button>
            </div>
            {[["Department Name","name","text"],["Head","head","text"],["Staff Count","staff","number"]].map(([l,k,t])=>(
              <div key={k}><label className="lbl">{l}</label>
              <input className="inp" type={t} value={(form as any)[k]||""} onChange={e=>setForm((f:any)=>({...f,[k]:e.target.value}))} placeholder={`Enter ${l.toLowerCase()}`}/></div>
            ))}
            <div><label className="lbl">Icon (emoji)</label>
            <input className="inp" value={form.icon} onChange={e=>setForm((f:any)=>({...f,icon:e.target.value}))} placeholder="e.g. ❤️"/></div>
            <div><label className="lbl">Color</label>
            <input className="inp" type="color" value={form.color} onChange={e=>setForm((f:any)=>({...f,color:e.target.value}))}/></div>
            <div style={{ display:"flex",gap:10,marginTop:20 }}>
              <button className="btn-cancel" onClick={()=>setModal(null)} style={{ flex:1 }}>Cancel</button>
              <button className="btn-primary" onClick={save} style={{ flex:1,borderRadius:10 }}>Save</button>
            </div>
          </div>
        </Overlay>
      )}
    </div>
  );
}

// ── HRM Designation ───────────────────────────────────────────────────────────
export function HRMDesignation() {
  const show = useShow();
  const [data, setData] = useState([
    {id:1,name:"Doctor"},{id:2,name:"Senior Nurse"},{id:3,name:"Junior Nurse"},
    {id:4,name:"Receptionist"},{id:5,name:"Lab Technician"},{id:6,name:"Radiologist"},
    {id:7,name:"Pharmacist"},{id:8,name:"Accountant"},{id:9,name:"IT Support"},{id:10,name:"Cleaner"},
  ]);
  const [modal, setModal] = useState<"add"|"edit"|null>(null);
  const [form,  setForm]  = useState({ name:"" });
  const [selId, setSelId] = useState<number|null>(null);

  const save = () => {
    if (!form.name.trim()) return alert("Name required");
    if (modal==="add") setData(p=>[...p,{id:Date.now(),name:form.name}]);
    else setData(p=>p.map(d=>d.id===selId?{id:selId!,name:form.name}:d));
    setModal(null);
  };
  const del = (id:number) => { if(window.confirm("Delete?")) setData(p=>p.filter(d=>d.id!==id)); };

  return (
    <div style={{ opacity:show?1:0,transform:show?"translateY(0)":"translateY(20px)",transition:"all 0.4s ease",padding:24,minHeight:"100vh",background:"#f8fafc" }}>
      <FadeStyle/>
      <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:24 }}>
        <div><h1 style={{ fontSize:22,fontWeight:800,color:"#1e293b",margin:0 }}>🎯 HRM — Designations</h1></div>
        <button className="btn-primary" onClick={()=>{setForm({name:""});setModal("add");}} style={{ display:"flex",alignItems:"center",gap:6,borderRadius:10 }}><Plus size={15}/> Add</button>
      </div>
      <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(200px,1fr))",gap:12 }}>
        {data.map((d,i)=>(
          <div key={d.id} style={{ background:"#fff",borderRadius:12,padding:"14px 18px",border:"1px solid #f1f5f9",display:"flex",justifyContent:"space-between",alignItems:"center",animation:`fadeUp 0.3s ease ${i*0.05}s both` }}>
            <span style={{ fontSize:13,fontWeight:600,color:"#1e293b" }}>{d.name}</span>
            <div style={{ display:"flex",gap:6 }}>
              <button onClick={()=>{setForm({name:d.name});setSelId(d.id);setModal("edit");}} style={{ width:26,height:26,borderRadius:6,background:"#3b82f6",border:"none",color:"#fff",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center" }}><Pencil size={11}/></button>
              <button onClick={()=>del(d.id)} style={{ width:26,height:26,borderRadius:6,background:"#ef4444",border:"none",color:"#fff",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center" }}><Trash2 size={11}/></button>
            </div>
          </div>
        ))}
      </div>
      {modal && (
        <Overlay>
          <div className="modal-box">
            <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16 }}>
              <h2 style={{ margin:0,fontSize:17,fontWeight:800 }}>{modal==="add"?"Add Designation":"Edit Designation"}</h2>
              <button onClick={()=>setModal(null)} style={{ background:"none",border:"none",cursor:"pointer" }}><X size={20}/></button>
            </div>
            <label className="lbl">Designation Name</label>
            <input className="inp" value={form.name} onChange={e=>setForm({name:e.target.value})} placeholder="Enter designation"/>
            <div style={{ display:"flex",gap:10,marginTop:20 }}>
              <button className="btn-cancel" onClick={()=>setModal(null)} style={{ flex:1 }}>Cancel</button>
              <button className="btn-primary" onClick={save} style={{ flex:1,borderRadius:10 }}>Save</button>
            </div>
          </div>
        </Overlay>
      )}
    </div>
  );
}

// ── HRM Attendance ────────────────────────────────────────────────────────────
export function HRMAttendance() {
  const show = useShow();
  const [data, setData] = useState([
    { id:1, name:"Ahmed Al Mansoori", role:"Doctor",    in:"08:02", out:"17:05", status:"Present" },
    { id:2, name:"Sara Al Hashimi",   role:"Nurse",     in:"07:58", out:"16:55", status:"Present" },
    { id:3, name:"John Smith",        role:"Reception", in:"09:10", out:"—",     status:"Late"    },
    { id:4, name:"Fatima Yousuf",     role:"Lab Tech",  in:"—",     out:"—",     status:"Absent"  },
  ]);
  const [modal, setModal] = useState(false);
  const [form,  setForm]  = useState({ name:"", role:"", in:"", out:"", status:"Present" });
  const [selId, setSelId] = useState<number|null>(null);

  const sc: Record<string,{bg:string;text:string}> = { Present:{bg:"#dcfce7",text:"#16a34a"}, Late:{bg:"#fef9c3",text:"#a16207"}, Absent:{bg:"#fee2e2",text:"#dc2626"} };

  const openEdit = (r:any) => { setForm(r); setSelId(r.id); setModal(true); };
  const save = () => {
    setData(p=>p.map(d=>d.id===selId?{...form,id:selId!}:d));
    setModal(false);
  };

  return (
    <div style={{ opacity:show?1:0,transform:show?"translateY(0)":"translateY(20px)",transition:"all 0.4s ease",padding:24,minHeight:"100vh",background:"#f8fafc" }}>
      <FadeStyle/>
      <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:24 }}>
        <div>
          <h1 style={{ fontSize:22,fontWeight:800,color:"#1e293b",margin:0 }}>🕐 HRM — Attendance</h1>
          <p style={{ fontSize:13,color:"#94a3b8",margin:"4px 0 0" }}>Today — {new Date().toDateString()}</p>
        </div>
      </div>
      <div style={{ display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:14,marginBottom:20 }}>
        {[{l:"Present",c:"#059669",i:"✅"},{l:"Late",c:"#d97706",i:"⏰"},{l:"Absent",c:"#dc2626",i:"❌"}].map((s,i)=>(
          <div key={s.l} style={{ background:"#fff",borderRadius:14,padding:"16px 20px",border:"1px solid #f1f5f9",display:"flex",alignItems:"center",gap:14,animation:`fadeUp 0.3s ease ${i*0.08}s both` }}>
            <span style={{ fontSize:28 }}>{s.i}</span>
            <div>
              <p style={{ fontSize:22,fontWeight:800,color:s.c,margin:0 }}>{data.filter(d=>d.status===s.l).length}</p>
              <p style={{ fontSize:12,color:"#94a3b8",margin:0 }}>{s.l}</p>
            </div>
          </div>
        ))}
      </div>
      <div style={{ background:"#fff",borderRadius:16,border:"1px solid #f1f5f9",overflow:"hidden" }}>
        <table style={{ width:"100%",borderCollapse:"collapse" }}>
          <thead><tr style={{ background:"#f8fafc" }}>{["Name","Role","Check In","Check Out","Status","Action"].map(h=><th key={h} style={{ padding:"11px 14px",textAlign:"left",fontSize:10,fontWeight:700,color:"#64748b",textTransform:"uppercase" }}>{h}</th>)}</tr></thead>
          <tbody>{data.map((d,i)=>(
            <tr key={d.id} style={{ borderTop:"1px solid #f1f5f9",animation:`fadeUp 0.3s ease ${i*0.06}s both` }}>
              <td style={{ padding:"13px 14px",fontWeight:600,color:"#1e293b",fontSize:13 }}>{d.name}</td>
              <td style={{ padding:"13px 14px",fontSize:13,color:"#64748b" }}>{d.role}</td>
              <td style={{ padding:"13px 14px",fontSize:13,color:"#059669",fontWeight:600 }}>{d.in}</td>
              <td style={{ padding:"13px 14px",fontSize:13,color:"#64748b" }}>{d.out}</td>
              <td style={{ padding:"13px 14px" }}><span style={{ fontSize:11,fontWeight:700,padding:"3px 9px",borderRadius:50,background:sc[d.status]?.bg,color:sc[d.status]?.text }}>{d.status}</span></td>
              <td style={{ padding:"13px 14px" }}>
                <button onClick={()=>openEdit(d)} style={{ width:28,height:28,borderRadius:7,background:"#3b82f6",border:"none",color:"#fff",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center" }}><Pencil size={12}/></button>
              </td>
            </tr>
          ))}</tbody>
        </table>
      </div>
      {modal && (
        <Overlay>
          <div className="modal-box">
            <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16 }}>
              <h2 style={{ margin:0,fontSize:17,fontWeight:800 }}>Edit Attendance</h2>
              <button onClick={()=>setModal(false)} style={{ background:"none",border:"none",cursor:"pointer" }}><X size={20}/></button>
            </div>
            <label className="lbl">Check In</label>
            <input className="inp" type="time" value={form.in} onChange={e=>setForm(f=>({...f,in:e.target.value}))}/>
            <label className="lbl">Check Out</label>
            <input className="inp" type="time" value={form.out==="—"?"":form.out} onChange={e=>setForm(f=>({...f,out:e.target.value}))}/>
            <label className="lbl">Status</label>
            <select className="sel" value={form.status} onChange={e=>setForm(f=>({...f,status:e.target.value}))}>
              {["Present","Late","Absent"].map(s=><option key={s}>{s}</option>)}
            </select>
            <div style={{ display:"flex",gap:10,marginTop:20 }}>
              <button className="btn-cancel" onClick={()=>setModal(false)} style={{ flex:1 }}>Cancel</button>
              <button className="btn-primary" onClick={save} style={{ flex:1,borderRadius:10 }}>Save</button>
            </div>
          </div>
        </Overlay>
      )}
    </div>
  );
}

// ── HRM Leaves ────────────────────────────────────────────────────────────────
export function HRMLeaves() {
  const show = useShow();
  const [data, setData] = useState([
    { id:1, name:"John Smith",    type:"Sick Leave",   from:"2025-04-20", to:"2025-04-22", days:3, status:"Pending",  reason:"Fever and cold" },
    { id:2, name:"Sara Ahmed",    type:"Annual Leave", from:"2025-05-01", to:"2025-05-07", days:7, status:"Approved", reason:"Family vacation" },
    { id:3, name:"Fatima Yousuf", type:"Emergency",    from:"2025-04-18", to:"2025-04-18", days:1, status:"Approved", reason:"Family emergency" },
  ]);
  const blank = { name:"", type:"Sick Leave", from:"", to:"", days:1, status:"Pending", reason:"" };
  const [modal, setModal] = useState<"add"|"view"|null>(null);
  const [form,  setForm]  = useState<any>(blank);

  const sc: Record<string,{bg:string;text:string}> = { Pending:{bg:"#fef9c3",text:"#a16207"}, Approved:{bg:"#dcfce7",text:"#16a34a"}, Rejected:{bg:"#fee2e2",text:"#dc2626"} };

  const approve = (id:number) => setData(p=>p.map(d=>d.id===id?{...d,status:"Approved"}:d));
  const reject  = (id:number) => setData(p=>p.map(d=>d.id===id?{...d,status:"Rejected"}:d));
  const del     = (id:number) => { if(window.confirm("Delete?")) setData(p=>p.filter(d=>d.id!==id)); };

  const save = () => {
    if (!form.name.trim()||!form.from) return alert("Name and date required");
    setData(p=>[...p,{...form,id:Date.now(),days:Number(form.days)||1}]);
    setModal(null);
  };

  return (
    <div style={{ opacity:show?1:0,transform:show?"translateY(0)":"translateY(20px)",transition:"all 0.4s ease",padding:24,minHeight:"100vh",background:"#f8fafc" }}>
      <FadeStyle/>
      <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:24 }}>
        <div><h1 style={{ fontSize:22,fontWeight:800,color:"#1e293b",margin:0 }}>🌴 HRM — Leaves</h1></div>
        <button className="btn-primary" onClick={()=>{setForm(blank);setModal("add");}} style={{ display:"flex",alignItems:"center",gap:6,borderRadius:10 }}><Plus size={15}/> Apply Leave</button>
      </div>
      <div style={{ background:"#fff",borderRadius:16,border:"1px solid #f1f5f9",overflow:"hidden" }}>
        <table style={{ width:"100%",borderCollapse:"collapse" }}>
          <thead><tr style={{ background:"#f8fafc" }}>{["Employee","Type","From","To","Days","Status","Actions"].map(h=><th key={h} style={{ padding:"11px 14px",textAlign:"left",fontSize:10,fontWeight:700,color:"#64748b",textTransform:"uppercase" }}>{h}</th>)}</tr></thead>
          <tbody>{data.map((d,i)=>(
            <tr key={d.id} style={{ borderTop:"1px solid #f1f5f9",animation:`fadeUp 0.3s ease ${i*0.07}s both` }}>
              <td style={{ padding:"13px 14px",fontWeight:600,color:"#1e293b",fontSize:13 }}>{d.name}</td>
              <td style={{ padding:"13px 14px",fontSize:13,color:"#64748b" }}>{d.type}</td>
              <td style={{ padding:"13px 14px",fontSize:12,color:"#94a3b8" }}>{d.from}</td>
              <td style={{ padding:"13px 14px",fontSize:12,color:"#94a3b8" }}>{d.to}</td>
              <td style={{ padding:"13px 14px",fontSize:13,fontWeight:700,color:"#4f46e5" }}>{d.days}</td>
              <td style={{ padding:"13px 14px" }}><span style={{ fontSize:11,fontWeight:700,padding:"3px 9px",borderRadius:50,background:sc[d.status]?.bg,color:sc[d.status]?.text }}>{d.status}</span></td>
              <td style={{ padding:"13px 14px" }}>
                <div style={{ display:"flex",gap:5 }}>
                  <button onClick={()=>{setForm(d);setModal("view");}} style={{ width:28,height:28,borderRadius:7,background:"#22c55e",border:"none",color:"#fff",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center" }}><Eye size={11}/></button>
                  {d.status==="Pending" && <>
                    <button onClick={()=>approve(d.id)} style={{ padding:"4px 8px",borderRadius:7,background:"#dcfce7",border:"none",color:"#16a34a",fontSize:11,fontWeight:700,cursor:"pointer" }}>✓</button>
                    <button onClick={()=>reject(d.id)}  style={{ padding:"4px 8px",borderRadius:7,background:"#fee2e2",border:"none",color:"#dc2626",fontSize:11,fontWeight:700,cursor:"pointer" }}>✗</button>
                  </>}
                  <button onClick={()=>del(d.id)} style={{ width:28,height:28,borderRadius:7,background:"#ef4444",border:"none",color:"#fff",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center" }}><Trash2 size={11}/></button>
                </div>
              </td>
            </tr>
          ))}</tbody>
        </table>
      </div>

      {modal==="add" && (
        <Overlay>
          <div className="modal-box">
            <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16 }}>
              <h2 style={{ margin:0,fontSize:17,fontWeight:800 }}>Apply Leave</h2>
              <button onClick={()=>setModal(null)} style={{ background:"none",border:"none",cursor:"pointer" }}><X size={20}/></button>
            </div>
            {[["Employee Name","name","text"],["From","from","date"],["To","to","date"],["Days","days","number"]].map(([l,k,t])=>(
              <div key={k}><label className="lbl">{l}</label>
              <input className="inp" type={t} value={(form as any)[k]||""} onChange={e=>setForm((f:any)=>({...f,[k]:e.target.value}))} placeholder={`Enter ${l.toLowerCase()}`}/></div>
            ))}
            <div><label className="lbl">Leave Type</label>
            <select className="sel" value={form.type} onChange={e=>setForm((f:any)=>({...f,type:e.target.value}))}>
              {["Sick Leave","Annual Leave","Emergency","Casual Leave","Maternity Leave"].map(t=><option key={t}>{t}</option>)}
            </select></div>
            <div><label className="lbl">Reason</label>
            <input className="inp" value={form.reason} onChange={e=>setForm((f:any)=>({...f,reason:e.target.value}))} placeholder="Reason for leave"/></div>
            <div style={{ display:"flex",gap:10,marginTop:20 }}>
              <button className="btn-cancel" onClick={()=>setModal(null)} style={{ flex:1 }}>Cancel</button>
              <button className="btn-primary" onClick={save} style={{ flex:1,borderRadius:10 }}>Submit</button>
            </div>
          </div>
        </Overlay>
      )}

      {modal==="view" && (
        <Overlay>
          <div className="modal-box">
            <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20 }}>
              <h2 style={{ margin:0,fontSize:17,fontWeight:800 }}>Leave Details</h2>
              <button onClick={()=>setModal(null)} style={{ background:"none",border:"none",cursor:"pointer" }}><X size={20}/></button>
            </div>
            <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:14 }}>
              {[["Employee",form.name],["Type",form.type],["From",form.from],["To",form.to],["Days",form.days],["Status",form.status],["Reason",form.reason]].map(([l,v])=>(
                <div key={l} style={{ gridColumn: l==="Reason"?"1/-1":"auto" }}>
                  <p style={{ fontSize:11,color:"#94a3b8",fontWeight:600,margin:"0 0 3px",textTransform:"uppercase" }}>{l}</p>
                  <p style={{ fontSize:13,color:"#1e293b",fontWeight:600,margin:0 }}>{v||"—"}</p>
                </div>
              ))}
            </div>
            <button className="btn-cancel" onClick={()=>setModal(null)} style={{ width:"100%",marginTop:20 }}>Close</button>
          </div>
        </Overlay>
      )}
    </div>
  );
}

// ── HRM Holidays ──────────────────────────────────────────────────────────────
export function HRMHolidays() {
  const show = useShow();
  const [data, setData] = useState([
    { id:1, name:"New Year",          date:"2025-01-01", type:"Public"  },
    { id:2, name:"UAE National Day",  date:"2025-12-02", type:"Public"  },
    { id:3, name:"Eid Al Fitr",       date:"2025-03-30", type:"Public"  },
    { id:4, name:"Eid Al Adha",       date:"2025-06-06", type:"Public"  },
    { id:5, name:"Clinic Anniversary",date:"2025-07-15", type:"Company" },
  ]);
  const blank = { name:"", date:"", type:"Public" };
  const [modal, setModal] = useState<"add"|"edit"|null>(null);
  const [form,  setForm]  = useState(blank);
  const [selId, setSelId] = useState<number|null>(null);

  const save = () => {
    if (!form.name.trim()||!form.date) return alert("Name and date required");
    if (modal==="add") setData(p=>[...p,{...form,id:Date.now()}]);
    else setData(p=>p.map(d=>d.id===selId?{...form,id:selId!}:d));
    setModal(null);
  };
  const del = (id:number) => { if(window.confirm("Delete holiday?")) setData(p=>p.filter(d=>d.id!==id)); };

  return (
    <div style={{ opacity:show?1:0,transform:show?"translateY(0)":"translateY(20px)",transition:"all 0.4s ease",padding:24,minHeight:"100vh",background:"#f8fafc" }}>
      <FadeStyle/>
      <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:24 }}>
        <div><h1 style={{ fontSize:22,fontWeight:800,color:"#1e293b",margin:0 }}>🎉 HRM — Holidays</h1></div>
        <button className="btn-primary" onClick={()=>{setForm(blank);setModal("add");}} style={{ display:"flex",alignItems:"center",gap:6,borderRadius:10 }}><Plus size={15}/> Add Holiday</button>
      </div>
      <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(260px,1fr))",gap:14 }}>
        {data.map((d,i)=>(
          <div key={d.id} style={{ background:"#fff",borderRadius:14,padding:20,border:"1px solid #f1f5f9",animation:`fadeUp 0.35s ease ${i*0.07}s both` }}>
            <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10 }}>
              <span style={{ fontSize:28 }}>🎉</span>
              <div style={{ display:"flex",gap:6,alignItems:"center" }}>
                <span style={{ fontSize:11,fontWeight:700,padding:"3px 9px",borderRadius:50,background:d.type==="Public"?"#dbeafe":"#fef9c3",color:d.type==="Public"?"#1d4ed8":"#a16207" }}>{d.type}</span>
                <button onClick={()=>{setForm(d);setSelId(d.id);setModal("edit");}} style={{ width:26,height:26,borderRadius:6,background:"#3b82f6",border:"none",color:"#fff",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center" }}><Pencil size={10}/></button>
                <button onClick={()=>del(d.id)} style={{ width:26,height:26,borderRadius:6,background:"#ef4444",border:"none",color:"#fff",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center" }}><Trash2 size={10}/></button>
              </div>
            </div>
            <h3 style={{ fontSize:14,fontWeight:700,color:"#1e293b",margin:"0 0 4px" }}>{d.name}</h3>
            <p style={{ fontSize:12,color:"#94a3b8",margin:0 }}>📅 {d.date}</p>
          </div>
        ))}
      </div>
      {modal && (
        <Overlay>
          <div className="modal-box">
            <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16 }}>
              <h2 style={{ margin:0,fontSize:17,fontWeight:800 }}>{modal==="add"?"Add Holiday":"Edit Holiday"}</h2>
              <button onClick={()=>setModal(null)} style={{ background:"none",border:"none",cursor:"pointer" }}><X size={20}/></button>
            </div>
            <label className="lbl">Holiday Name</label>
            <input className="inp" value={form.name} onChange={e=>setForm(f=>({...f,name:e.target.value}))} placeholder="Holiday name"/>
            <label className="lbl">Date</label>
            <input className="inp" type="date" value={form.date} onChange={e=>setForm(f=>({...f,date:e.target.value}))}/>
            <label className="lbl">Type</label>
            <select className="sel" value={form.type} onChange={e=>setForm(f=>({...f,type:e.target.value}))}>
              <option>Public</option><option>Company</option><option>Optional</option>
            </select>
            <div style={{ display:"flex",gap:10,marginTop:20 }}>
              <button className="btn-cancel" onClick={()=>setModal(null)} style={{ flex:1 }}>Cancel</button>
              <button className="btn-primary" onClick={save} style={{ flex:1,borderRadius:10 }}>Save</button>
            </div>
          </div>
        </Overlay>
      )}
    </div>
  );
}

// ── HRM Payroll ───────────────────────────────────────────────────────────────
export function HRMPayroll() {
  const show = useShow();
  const [data, setData] = useState([
    { id:1, name:"Ahmed Al Mansoori", role:"Doctor",    basic:15000, allowance:2000, deduction:500,  status:"Paid"    },
    { id:2, name:"Sara Al Hashimi",   role:"Nurse",     basic:6000,  allowance:800,  deduction:200,  status:"Paid"    },
    { id:3, name:"John Smith",        role:"Reception", basic:4500,  allowance:500,  deduction:150,  status:"Pending" },
    { id:4, name:"Fatima Yousuf",     role:"Lab Tech",  basic:5000,  allowance:600,  deduction:180,  status:"Pending" },
  ]);
  const [modal, setModal] = useState(false);
  const [form,  setForm]  = useState<any>({});
  const [selId, setSelId] = useState<number|null>(null);

  const openEdit = (r:any) => { setForm(r); setSelId(r.id); setModal(true); };
  const save = () => {
    setData(p=>p.map(d=>d.id===selId?{...form,id:selId!,basic:Number(form.basic),allowance:Number(form.allowance),deduction:Number(form.deduction)}:d));
    setModal(false);
  };
  const markPaid = (id:number) => setData(p=>p.map(d=>d.id===id?{...d,status:"Paid"}:d));

  return (
    <div style={{ opacity:show?1:0,transform:show?"translateY(0)":"translateY(20px)",transition:"all 0.4s ease",padding:24,minHeight:"100vh",background:"#f8fafc" }}>
      <FadeStyle/>
      <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:24 }}>
        <div>
          <h1 style={{ fontSize:22,fontWeight:800,color:"#1e293b",margin:0 }}>💳 HRM — Payroll</h1>
          <p style={{ fontSize:13,color:"#94a3b8",margin:"4px 0 0" }}>{new Date().toLocaleString("default",{month:"long",year:"numeric"})}</p>
        </div>
        <button className="btn-primary" onClick={()=>setData(p=>p.map(d=>({...d,status:"Paid"})))} style={{ borderRadius:10 }}>Run Payroll (All)</button>
      </div>
      <div style={{ background:"#fff",borderRadius:16,border:"1px solid #f1f5f9",overflow:"hidden" }}>
        <table style={{ width:"100%",borderCollapse:"collapse" }}>
          <thead><tr style={{ background:"#f8fafc" }}>{["Employee","Role","Basic","Allowance","Deduction","Net Pay","Status","Actions"].map(h=><th key={h} style={{ padding:"11px 14px",textAlign:"left",fontSize:10,fontWeight:700,color:"#64748b",textTransform:"uppercase" }}>{h}</th>)}</tr></thead>
          <tbody>{data.map((d,i)=>{
            const net = d.basic + d.allowance - d.deduction;
            return (
              <tr key={d.id} style={{ borderTop:"1px solid #f1f5f9",animation:`fadeUp 0.3s ease ${i*0.07}s both` }}>
                <td style={{ padding:"13px 14px",fontWeight:600,color:"#1e293b",fontSize:13 }}>{d.name}</td>
                <td style={{ padding:"13px 14px",fontSize:13,color:"#64748b" }}>{d.role}</td>
                <td style={{ padding:"13px 14px",fontSize:13 }}>AED {d.basic.toLocaleString()}</td>
                <td style={{ padding:"13px 14px",fontSize:13,color:"#059669" }}>+AED {d.allowance.toLocaleString()}</td>
                <td style={{ padding:"13px 14px",fontSize:13,color:"#dc2626" }}>-AED {d.deduction.toLocaleString()}</td>
                <td style={{ padding:"13px 14px",fontSize:14,fontWeight:800,color:"#4f46e5" }}>AED {net.toLocaleString()}</td>
                <td style={{ padding:"13px 14px" }}><span style={{ fontSize:11,fontWeight:700,padding:"3px 9px",borderRadius:50,background:d.status==="Paid"?"#dcfce7":"#fef9c3",color:d.status==="Paid"?"#16a34a":"#a16207" }}>{d.status}</span></td>
                <td style={{ padding:"13px 14px" }}>
                  <div style={{ display:"flex",gap:5 }}>
                    <button onClick={()=>openEdit(d)} style={{ width:28,height:28,borderRadius:7,background:"#3b82f6",border:"none",color:"#fff",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center" }}><Pencil size={11}/></button>
                    {d.status==="Pending" && <button onClick={()=>markPaid(d.id)} style={{ padding:"4px 8px",borderRadius:7,background:"#dcfce7",border:"none",color:"#16a34a",fontSize:11,fontWeight:700,cursor:"pointer" }}>Pay</button>}
                  </div>
                </td>
              </tr>
            );
          })}</tbody>
        </table>
      </div>
      {modal && (
        <Overlay>
          <div className="modal-box">
            <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16 }}>
              <h2 style={{ margin:0,fontSize:17,fontWeight:800 }}>Edit Payroll</h2>
              <button onClick={()=>setModal(false)} style={{ background:"none",border:"none",cursor:"pointer" }}><X size={20}/></button>
            </div>
            {[["Basic Salary","basic"],["Allowance","allowance"],["Deduction","deduction"]].map(([l,k])=>(
              <div key={k}><label className="lbl">{l} (AED)</label>
              <input className="inp" type="number" value={(form as any)[k]||0} onChange={e=>setForm((f:any)=>({...f,[k]:e.target.value}))}/></div>
            ))}
            <div style={{ marginTop:12,padding:12,background:"#f8fafc",borderRadius:10 }}>
              <p style={{ margin:0,fontSize:13,fontWeight:700,color:"#4f46e5" }}>
                Net Pay: AED {(Number(form.basic||0)+Number(form.allowance||0)-Number(form.deduction||0)).toLocaleString()}
              </p>
            </div>
            <div style={{ display:"flex",gap:10,marginTop:20 }}>
              <button className="btn-cancel" onClick={()=>setModal(false)} style={{ flex:1 }}>Cancel</button>
              <button className="btn-primary" onClick={save} style={{ flex:1,borderRadius:10 }}>Save</button>
            </div>
          </div>
        </Overlay>
      )}
    </div>
  );
}