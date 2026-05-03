import { useState } from "react";
import { Plus, Search, Pencil, Trash2 } from "lucide-react";

// ── shared fade animation ──────────────────────────────────────────────────────
const FadeStyle = () => (
  <style>{`@keyframes fadeUp{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}`}</style>
);

function useShow() {
  const [show, setShow] = useState(false);
  useState(() => { setTimeout(() => setShow(true), 50); });
  return show;
}

// ── HRM Staffs ────────────────────────────────────────────────────────────────
export function HRMStaffs() {
  const show = useShow();
  const [search, setSearch] = useState("");
  const data = [
    { id:1, name:"Ahmed Al Mansoori", role:"Doctor",    dept:"Cardiology",  join:"2021-03-10", status:"Active"   },
    { id:2, name:"Sara Al Hashimi",   role:"Nurse",     dept:"Pediatrics",  join:"2022-06-15", status:"Active"   },
    { id:3, name:"John Smith",        role:"Reception", dept:"Front Desk",  join:"2020-01-20", status:"Active"   },
    { id:4, name:"Fatima Yousuf",     role:"Lab Tech",  dept:"Laboratory",  join:"2023-02-28", status:"On Leave" },
  ];
  const filtered = data.filter(d => d.name.toLowerCase().includes(search.toLowerCase()));
  return (
    <div style={{ opacity:show?1:0, transform:show?"translateY(0)":"translateY(20px)", transition:"all 0.4s ease", padding:24, minHeight:"100vh", background:"#f8fafc" }}>
      <FadeStyle/>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:24 }}>
        <div><h1 style={{ fontSize:22, fontWeight:800, color:"#1e293b", margin:0 }}>👥 HRM — Staffs</h1>
          <p style={{ fontSize:13, color:"#94a3b8", margin:"4px 0 0" }}>All staff members</p></div>
        <button style={{ display:"flex", alignItems:"center", gap:6, padding:"9px 18px", background:"#4f46e5", color:"#fff", border:"none", borderRadius:10, fontWeight:700, fontSize:13, cursor:"pointer" }}><Plus size={15}/> Add Staff</button>
      </div>
      <div style={{ position:"relative", marginBottom:16, maxWidth:300 }}>
        <Search size={14} style={{ position:"absolute", left:11, top:"50%", transform:"translateY(-50%)", color:"#94a3b8" }}/>
        <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search staff..." style={{ width:"100%", paddingLeft:32, paddingRight:12, paddingTop:9, paddingBottom:9, border:"1.5px solid #e2e8f0", borderRadius:10, fontSize:13, outline:"none", boxSizing:"border-box" }}/>
      </div>
      <div style={{ background:"#fff", borderRadius:16, border:"1px solid #f1f5f9", overflow:"hidden" }}>
        <table style={{ width:"100%", borderCollapse:"collapse" }}>
          <thead><tr style={{ background:"#f8fafc" }}>
            {["Name","Role","Department","Join Date","Status","Actions"].map(h=>(
              <th key={h} style={{ padding:"11px 14px", textAlign:"left", fontSize:10, fontWeight:700, color:"#64748b", textTransform:"uppercase" }}>{h}</th>
            ))}</tr></thead>
          <tbody>{filtered.map((d,i)=>(
            <tr key={d.id} style={{ borderTop:"1px solid #f1f5f9", animation:`fadeUp 0.3s ease ${i*0.06}s both` }}>
              <td style={{ padding:"13px 14px", fontWeight:600, color:"#1e293b", fontSize:13 }}>{d.name}</td>
              <td style={{ padding:"13px 14px", fontSize:13, color:"#64748b" }}>{d.role}</td>
              <td style={{ padding:"13px 14px", fontSize:13, color:"#64748b" }}>{d.dept}</td>
              <td style={{ padding:"13px 14px", fontSize:12, color:"#94a3b8" }}>{d.join}</td>
              <td style={{ padding:"13px 14px" }}><span style={{ fontSize:11, fontWeight:700, padding:"3px 9px", borderRadius:50, background:d.status==="Active"?"#dcfce7":"#fef9c3", color:d.status==="Active"?"#16a34a":"#a16207" }}>{d.status}</span></td>
              <td style={{ padding:"13px 14px" }}><div style={{ display:"flex", gap:6 }}>
                <button style={{ width:29, height:29, borderRadius:7, background:"#3b82f6", border:"none", color:"#fff", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center" }}><Pencil size={12}/></button>
                <button style={{ width:29, height:29, borderRadius:7, background:"#ef4444", border:"none", color:"#fff", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center" }}><Trash2 size={12}/></button>
              </div></td>
            </tr>
          ))}</tbody>
        </table>
      </div>
    </div>
  );
}

// ── HRM Departments ───────────────────────────────────────────────────────────
export function HRMDepartments() {
  const show = useShow();
  const data = [
    { id:1, name:"Cardiology",  head:"Dr. Ahmed",  staff:8,  color:"#ef4444" },
    { id:2, name:"Pediatrics",  head:"Dr. Sara",   staff:5,  color:"#3b82f6" },
    { id:3, name:"Radiology",   head:"Dr. John",   staff:4,  color:"#7c3aed" },
    { id:4, name:"Laboratory",  head:"Ms. Fatima", staff:6,  color:"#059669" },
    { id:5, name:"Front Desk",  head:"Mr. Khalid", staff:3,  color:"#f59e0b" },
  ];
  return (
    <div style={{ opacity:show?1:0, transform:show?"translateY(0)":"translateY(20px)", transition:"all 0.4s ease", padding:24, minHeight:"100vh", background:"#f8fafc" }}>
      <FadeStyle/>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:24 }}>
        <div><h1 style={{ fontSize:22, fontWeight:800, color:"#1e293b", margin:0 }}>🏢 HRM — Departments</h1>
          <p style={{ fontSize:13, color:"#94a3b8", margin:"4px 0 0" }}>Clinic departments overview</p></div>
        <button style={{ display:"flex", alignItems:"center", gap:6, padding:"9px 18px", background:"#4f46e5", color:"#fff", border:"none", borderRadius:10, fontWeight:700, fontSize:13, cursor:"pointer" }}><Plus size={15}/> Add Dept</button>
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill, minmax(240px,1fr))", gap:14 }}>
        {data.map((d,i)=>(
          <div key={d.id} style={{ background:"#fff", borderRadius:16, padding:20, border:"1px solid #f1f5f9", animation:`fadeUp 0.4s ease ${i*0.07}s both`, transition:"transform .2s" }}
            onMouseEnter={e=>(e.currentTarget as HTMLDivElement).style.transform="translateY(-3px)"}
            onMouseLeave={e=>(e.currentTarget as HTMLDivElement).style.transform="translateY(0)"}>
            <div style={{ width:44, height:44, borderRadius:12, background:d.color+"18", display:"flex", alignItems:"center", justifyContent:"center", marginBottom:14, fontSize:22 }}>🏢</div>
            <h3 style={{ fontSize:15, fontWeight:700, color:"#1e293b", margin:"0 0 4px" }}>{d.name}</h3>
            <p style={{ fontSize:12, color:"#94a3b8", margin:"0 0 3px" }}>Head: <strong style={{ color:"#64748b" }}>{d.head}</strong></p>
            <p style={{ fontSize:12, color:"#94a3b8", margin:"0 0 14px" }}>Staff: <strong style={{ color:d.color }}>{d.staff}</strong></p>
            <div style={{ height:4, background:d.color+"22", borderRadius:99 }}>
              <div style={{ height:"100%", width:`${d.staff*10}%`, background:d.color, borderRadius:99 }}/>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── HRM Designation ───────────────────────────────────────────────────────────
export function HRMDesignation() {
  const show = useShow();
  const data = ["Doctor","Senior Nurse","Junior Nurse","Receptionist","Lab Technician","Radiologist","Pharmacist","Accountant","IT Support","Cleaner"];
  return (
    <div style={{ opacity:show?1:0, transform:show?"translateY(0)":"translateY(20px)", transition:"all 0.4s ease", padding:24, minHeight:"100vh", background:"#f8fafc" }}>
      <FadeStyle/>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:24 }}>
        <div><h1 style={{ fontSize:22, fontWeight:800, color:"#1e293b", margin:0 }}>🎯 HRM — Designations</h1></div>
        <button style={{ display:"flex", alignItems:"center", gap:6, padding:"9px 18px", background:"#4f46e5", color:"#fff", border:"none", borderRadius:10, fontWeight:700, fontSize:13, cursor:"pointer" }}><Plus size={15}/> Add</button>
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill, minmax(200px,1fr))", gap:12 }}>
        {data.map((d,i)=>(
          <div key={d} style={{ background:"#fff", borderRadius:12, padding:"14px 18px", border:"1px solid #f1f5f9", display:"flex", justifyContent:"space-between", alignItems:"center", animation:`fadeUp 0.3s ease ${i*0.05}s both` }}>
            <span style={{ fontSize:13, fontWeight:600, color:"#1e293b" }}>{d}</span>
            <div style={{ display:"flex", gap:6 }}>
              <button style={{ width:26, height:26, borderRadius:6, background:"#3b82f6", border:"none", color:"#fff", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center" }}><Pencil size={11}/></button>
              <button style={{ width:26, height:26, borderRadius:6, background:"#ef4444", border:"none", color:"#fff", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center" }}><Trash2 size={11}/></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── HRM Attendance ────────────────────────────────────────────────────────────
export function HRMAttendance() {
  const show = useShow();
  const data = [
    { name:"Ahmed Al Mansoori", role:"Doctor",    in:"08:02", out:"17:05", status:"Present" },
    { name:"Sara Al Hashimi",   role:"Nurse",     in:"07:58", out:"16:55", status:"Present" },
    { name:"John Smith",        role:"Reception", in:"09:10", out:"—",     status:"Late"    },
    { name:"Fatima Yousuf",     role:"Lab Tech",  in:"—",     out:"—",     status:"Absent"  },
  ];
  const sc: Record<string,{bg:string;text:string}> = { Present:{bg:"#dcfce7",text:"#16a34a"}, Late:{bg:"#fef9c3",text:"#a16207"}, Absent:{bg:"#fee2e2",text:"#dc2626"} };
  return (
    <div style={{ opacity:show?1:0, transform:show?"translateY(0)":"translateY(20px)", transition:"all 0.4s ease", padding:24, minHeight:"100vh", background:"#f8fafc" }}>
      <FadeStyle/>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:24 }}>
        <div><h1 style={{ fontSize:22, fontWeight:800, color:"#1e293b", margin:0 }}>🕐 HRM — Attendance</h1>
          <p style={{ fontSize:13, color:"#94a3b8", margin:"4px 0 0" }}>Today — {new Date().toDateString()}</p></div>
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:14, marginBottom:20 }}>
        {[{l:"Present",v:data.filter(d=>d.status==="Present").length,c:"#059669",i:"✅"},{l:"Late",v:data.filter(d=>d.status==="Late").length,c:"#d97706",i:"⏰"},{l:"Absent",v:data.filter(d=>d.status==="Absent").length,c:"#dc2626",i:"❌"}].map((c,i)=>(
          <div key={c.l} style={{ background:"#fff", borderRadius:14, padding:"16px 20px", border:"1px solid #f1f5f9", display:"flex", alignItems:"center", gap:14, animation:`fadeUp 0.3s ease ${i*0.08}s both` }}>
            <span style={{ fontSize:28 }}>{c.i}</span>
            <div><p style={{ fontSize:22, fontWeight:800, color:c.c, margin:0 }}>{c.v}</p><p style={{ fontSize:12, color:"#94a3b8", margin:0 }}>{c.l}</p></div>
          </div>
        ))}
      </div>
      <div style={{ background:"#fff", borderRadius:16, border:"1px solid #f1f5f9", overflow:"hidden" }}>
        <table style={{ width:"100%", borderCollapse:"collapse" }}>
          <thead><tr style={{ background:"#f8fafc" }}>{["Name","Role","Check In","Check Out","Status"].map(h=><th key={h} style={{ padding:"11px 14px", textAlign:"left", fontSize:10, fontWeight:700, color:"#64748b", textTransform:"uppercase" }}>{h}</th>)}</tr></thead>
          <tbody>{data.map((d,i)=>(
            <tr key={d.name} style={{ borderTop:"1px solid #f1f5f9", animation:`fadeUp 0.3s ease ${i*0.06}s both` }}>
              <td style={{ padding:"13px 14px", fontWeight:600, color:"#1e293b", fontSize:13 }}>{d.name}</td>
              <td style={{ padding:"13px 14px", fontSize:13, color:"#64748b" }}>{d.role}</td>
              <td style={{ padding:"13px 14px", fontSize:13, color:"#059669", fontWeight:600 }}>{d.in}</td>
              <td style={{ padding:"13px 14px", fontSize:13, color:"#64748b" }}>{d.out}</td>
              <td style={{ padding:"13px 14px" }}><span style={{ fontSize:11, fontWeight:700, padding:"3px 9px", borderRadius:50, background:sc[d.status]?.bg, color:sc[d.status]?.text }}>{d.status}</span></td>
            </tr>
          ))}</tbody>
        </table>
      </div>
    </div>
  );
}

// ── HRM Leaves ────────────────────────────────────────────────────────────────
export function HRMLeaves() {
  const show = useShow();
  const [data, setData] = useState([
    { id:1, name:"John Smith",   type:"Sick Leave",   from:"2025-04-20", to:"2025-04-22", days:3, status:"Pending"  },
    { id:2, name:"Sara Ahmed",   type:"Annual Leave",  from:"2025-05-01", to:"2025-05-07", days:7, status:"Approved" },
    { id:3, name:"Fatima Yousuf",type:"Emergency",     from:"2025-04-18", to:"2025-04-18", days:1, status:"Approved" },
  ]);
  const sc: Record<string,{bg:string;text:string}> = { Pending:{bg:"#fef9c3",text:"#a16207"}, Approved:{bg:"#dcfce7",text:"#16a34a"}, Rejected:{bg:"#fee2e2",text:"#dc2626"} };
  const approve = (id:number) => setData(p=>p.map(d=>d.id===id?{...d,status:"Approved"}:d));
  const reject  = (id:number) => setData(p=>p.map(d=>d.id===id?{...d,status:"Rejected"}:d));
  return (
    <div style={{ opacity:show?1:0, transform:show?"translateY(0)":"translateY(20px)", transition:"all 0.4s ease", padding:24, minHeight:"100vh", background:"#f8fafc" }}>
      <FadeStyle/>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:24 }}>
        <div><h1 style={{ fontSize:22, fontWeight:800, color:"#1e293b", margin:0 }}>🌴 HRM — Leaves</h1></div>
        <button style={{ display:"flex", alignItems:"center", gap:6, padding:"9px 18px", background:"#4f46e5", color:"#fff", border:"none", borderRadius:10, fontWeight:700, fontSize:13, cursor:"pointer" }}><Plus size={15}/> Apply Leave</button>
      </div>
      <div style={{ background:"#fff", borderRadius:16, border:"1px solid #f1f5f9", overflow:"hidden" }}>
        <table style={{ width:"100%", borderCollapse:"collapse" }}>
          <thead><tr style={{ background:"#f8fafc" }}>{["Employee","Type","From","To","Days","Status","Actions"].map(h=><th key={h} style={{ padding:"11px 14px", textAlign:"left", fontSize:10, fontWeight:700, color:"#64748b", textTransform:"uppercase" }}>{h}</th>)}</tr></thead>
          <tbody>{data.map((d,i)=>(
            <tr key={d.id} style={{ borderTop:"1px solid #f1f5f9", animation:`fadeUp 0.3s ease ${i*0.07}s both` }}>
              <td style={{ padding:"13px 14px", fontWeight:600, color:"#1e293b", fontSize:13 }}>{d.name}</td>
              <td style={{ padding:"13px 14px", fontSize:13, color:"#64748b" }}>{d.type}</td>
              <td style={{ padding:"13px 14px", fontSize:12, color:"#94a3b8" }}>{d.from}</td>
              <td style={{ padding:"13px 14px", fontSize:12, color:"#94a3b8" }}>{d.to}</td>
              <td style={{ padding:"13px 14px", fontSize:13, fontWeight:700, color:"#4f46e5" }}>{d.days}</td>
              <td style={{ padding:"13px 14px" }}><span style={{ fontSize:11, fontWeight:700, padding:"3px 9px", borderRadius:50, background:sc[d.status]?.bg, color:sc[d.status]?.text }}>{d.status}</span></td>
              <td style={{ padding:"13px 14px" }}>
                {d.status==="Pending" && <div style={{ display:"flex", gap:6 }}>
                  <button onClick={()=>approve(d.id)} style={{ padding:"4px 10px", borderRadius:7, background:"#dcfce7", border:"none", color:"#16a34a", fontSize:11, fontWeight:700, cursor:"pointer" }}>✓ Approve</button>
                  <button onClick={()=>reject(d.id)}  style={{ padding:"4px 10px", borderRadius:7, background:"#fee2e2", border:"none", color:"#dc2626", fontSize:11, fontWeight:700, cursor:"pointer" }}>✗ Reject</button>
                </div>}
              </td>
            </tr>
          ))}</tbody>
        </table>
      </div>
    </div>
  );
}

// ── HRM Holidays ──────────────────────────────────────────────────────────────
export function HRMHolidays() {
  const show = useShow();
  const data = [
    { id:1, name:"New Year",         date:"2025-01-01", type:"Public" },
    { id:2, name:"UAE National Day",  date:"2025-12-02", type:"Public" },
    { id:3, name:"Eid Al Fitr",       date:"2025-03-30", type:"Public" },
    { id:4, name:"Eid Al Adha",       date:"2025-06-06", type:"Public" },
    { id:5, name:"Clinic Anniversary",date:"2025-07-15", type:"Company" },
  ];
  return (
    <div style={{ opacity:show?1:0, transform:show?"translateY(0)":"translateY(20px)", transition:"all 0.4s ease", padding:24, minHeight:"100vh", background:"#f8fafc" }}>
      <FadeStyle/>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:24 }}>
        <div><h1 style={{ fontSize:22, fontWeight:800, color:"#1e293b", margin:0 }}>🎉 HRM — Holidays</h1></div>
        <button style={{ display:"flex", alignItems:"center", gap:6, padding:"9px 18px", background:"#4f46e5", color:"#fff", border:"none", borderRadius:10, fontWeight:700, fontSize:13, cursor:"pointer" }}><Plus size={15}/> Add Holiday</button>
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill, minmax(260px,1fr))", gap:14 }}>
        {data.map((d,i)=>(
          <div key={d.id} style={{ background:"#fff", borderRadius:14, padding:20, border:"1px solid #f1f5f9", animation:`fadeUp 0.35s ease ${i*0.07}s both` }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:10 }}>
              <span style={{ fontSize:28 }}>🎉</span>
              <span style={{ fontSize:11, fontWeight:700, padding:"3px 9px", borderRadius:50, background:d.type==="Public"?"#dbeafe":"#fef9c3", color:d.type==="Public"?"#1d4ed8":"#a16207" }}>{d.type}</span>
            </div>
            <h3 style={{ fontSize:14, fontWeight:700, color:"#1e293b", margin:"0 0 4px" }}>{d.name}</h3>
            <p style={{ fontSize:12, color:"#94a3b8", margin:0 }}>📅 {d.date}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── HRM Payroll ───────────────────────────────────────────────────────────────
export function HRMPayroll() {
  const show = useShow();
  const data = [
    { id:1, name:"Ahmed Al Mansoori", role:"Doctor",    basic:"AED 15,000", allowance:"AED 2,000", deduction:"AED 500",  net:"AED 16,500", status:"Paid"    },
    { id:2, name:"Sara Al Hashimi",   role:"Nurse",     basic:"AED 6,000",  allowance:"AED 800",   deduction:"AED 200",  net:"AED 6,600",  status:"Paid"    },
    { id:3, name:"John Smith",        role:"Reception", basic:"AED 4,500",  allowance:"AED 500",   deduction:"AED 150",  net:"AED 4,850",  status:"Pending" },
  ];
  return (
    <div style={{ opacity:show?1:0, transform:show?"translateY(0)":"translateY(20px)", transition:"all 0.4s ease", padding:24, minHeight:"100vh", background:"#f8fafc" }}>
      <FadeStyle/>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:24 }}>
        <div><h1 style={{ fontSize:22, fontWeight:800, color:"#1e293b", margin:0 }}>💳 HRM — Payroll</h1>
          <p style={{ fontSize:13, color:"#94a3b8", margin:"4px 0 0" }}>April 2025</p></div>
        <button style={{ display:"flex", alignItems:"center", gap:6, padding:"9px 18px", background:"#4f46e5", color:"#fff", border:"none", borderRadius:10, fontWeight:700, fontSize:13, cursor:"pointer" }}>Run Payroll</button>
      </div>
      <div style={{ background:"#fff", borderRadius:16, border:"1px solid #f1f5f9", overflow:"hidden" }}>
        <table style={{ width:"100%", borderCollapse:"collapse" }}>
          <thead><tr style={{ background:"#f8fafc" }}>{["Employee","Role","Basic","Allowance","Deduction","Net Pay","Status"].map(h=><th key={h} style={{ padding:"11px 14px", textAlign:"left", fontSize:10, fontWeight:700, color:"#64748b", textTransform:"uppercase" }}>{h}</th>)}</tr></thead>
          <tbody>{data.map((d,i)=>(
            <tr key={d.id} style={{ borderTop:"1px solid #f1f5f9", animation:`fadeUp 0.3s ease ${i*0.07}s both` }}>
              <td style={{ padding:"13px 14px", fontWeight:600, color:"#1e293b", fontSize:13 }}>{d.name}</td>
              <td style={{ padding:"13px 14px", fontSize:13, color:"#64748b" }}>{d.role}</td>
              <td style={{ padding:"13px 14px", fontSize:13, color:"#1e293b" }}>{d.basic}</td>
              <td style={{ padding:"13px 14px", fontSize:13, color:"#059669" }}>+{d.allowance}</td>
              <td style={{ padding:"13px 14px", fontSize:13, color:"#dc2626" }}>-{d.deduction}</td>
              <td style={{ padding:"13px 14px", fontSize:14, fontWeight:800, color:"#4f46e5" }}>{d.net}</td>
              <td style={{ padding:"13px 14px" }}><span style={{ fontSize:11, fontWeight:700, padding:"3px 9px", borderRadius:50, background:d.status==="Paid"?"#dcfce7":"#fef9c3", color:d.status==="Paid"?"#16a34a":"#a16207" }}>{d.status}</span></td>
            </tr>
          ))}</tbody>
        </table>
      </div>
    </div>
  );
}
