import { useState } from "react";
import { Plus, Search, Pencil, Trash2, X, Eye } from "lucide-react";

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

// ── Expenses ──────────────────────────────────────────────────────────────────
export function FinanceExpenses() {
  const show = useShow();
  const [data, setData] = useState([
    { id:1, desc:"Medical Supplies",  category:"Supplies",    amount:3200,  date:"2025-04-01", by:"Admin"   },
    { id:2, desc:"Electricity Bill",  category:"Utility",     amount:1800,  date:"2025-04-05", by:"Finance" },
    { id:3, desc:"Staff Salary",      category:"Payroll",     amount:45000, date:"2025-04-10", by:"HR"      },
    { id:4, desc:"Equipment Repair",  category:"Maintenance", amount:2500,  date:"2025-04-12", by:"Admin"   },
    { id:5, desc:"Marketing Ads",     category:"Marketing",   amount:5000,  date:"2025-04-15", by:"Admin"   },
  ]);
  const blank = { desc:"", category:"Supplies", amount:0, date:"", by:"Admin" };
  const [modal, setModal] = useState<"add"|"edit"|null>(null);
  const [form,  setForm]  = useState<any>(blank);
  const [selId, setSelId] = useState<number|null>(null);
  const [search,setSearch]= useState("");

  const catColor: Record<string,string> = { Supplies:"#4f46e5",Utility:"#f59e0b",Payroll:"#0891b2",Maintenance:"#d97706",Marketing:"#ec4899" };
  const total = data.reduce((s,d)=>s+d.amount,0);
  const filtered = data.filter(d=>d.desc.toLowerCase().includes(search.toLowerCase())||d.category.toLowerCase().includes(search.toLowerCase()));

  const save = () => {
    if (!form.desc.trim()) return alert("Description required");
    if (modal==="add") setData(p=>[...p,{...form,id:Date.now(),amount:Number(form.amount)||0}]);
    else setData(p=>p.map(d=>d.id===selId?{...form,id:selId!,amount:Number(form.amount)||0}:d));
    setModal(null);
  };
  const del = (id:number) => { if(window.confirm("Delete expense?")) setData(p=>p.filter(d=>d.id!==id)); };

  return (
    <div style={{ opacity:show?1:0,transform:show?"translateY(0)":"translateY(20px)",transition:"all 0.4s ease",padding:24,minHeight:"100vh",background:"#f8fafc" }}>
      <FadeStyle/>
      <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20 }}>
        <div>
          <h1 style={{ fontSize:22,fontWeight:800,color:"#1e293b",margin:0 }}>💸 Finance — Expenses</h1>
          <p style={{ fontSize:13,color:"#94a3b8",margin:"4px 0 0" }}>Total: <strong style={{ color:"#ef4444" }}>AED {total.toLocaleString()}</strong></p>
        </div>
        <button className="btn-primary" onClick={()=>{setForm(blank);setModal("add");}} style={{ display:"flex",alignItems:"center",gap:6,borderRadius:10 }}><Plus size={15}/> Add Expense</button>
      </div>

      <div style={{ position:"relative",marginBottom:16,maxWidth:300 }}>
        <Search size={14} style={{ position:"absolute",left:11,top:"50%",transform:"translateY(-50%)",color:"#94a3b8" }}/>
        <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search expenses..." className="inp" style={{ paddingLeft:32 }}/>
      </div>

      <div style={{ background:"#fff",borderRadius:16,border:"1px solid #f1f5f9",overflow:"hidden" }}>
        <table style={{ width:"100%",borderCollapse:"collapse" }}>
          <thead><tr style={{ background:"#f8fafc" }}>{["Description","Category","Amount","Date","By","Actions"].map(h=><th key={h} style={{ padding:"11px 14px",textAlign:"left",fontSize:10,fontWeight:700,color:"#64748b",textTransform:"uppercase" }}>{h}</th>)}</tr></thead>
          <tbody>
            {filtered.map((d,i)=>(
              <tr key={d.id} style={{ borderTop:"1px solid #f1f5f9",animation:`fadeUp 0.3s ease ${i*0.06}s both` }}>
                <td style={{ padding:"13px 14px",fontWeight:600,color:"#1e293b",fontSize:13 }}>{d.desc}</td>
                <td style={{ padding:"13px 14px" }}><span style={{ fontSize:11,fontWeight:700,padding:"3px 9px",borderRadius:50,background:(catColor[d.category]||"#4f46e5")+"18",color:catColor[d.category]||"#4f46e5" }}>{d.category}</span></td>
                <td style={{ padding:"13px 14px",fontSize:13,fontWeight:700,color:"#ef4444" }}>AED {d.amount.toLocaleString()}</td>
                <td style={{ padding:"13px 14px",fontSize:12,color:"#94a3b8" }}>{d.date}</td>
                <td style={{ padding:"13px 14px",fontSize:13,color:"#64748b" }}>{d.by}</td>
                <td style={{ padding:"13px 14px" }}>
                  <div style={{ display:"flex",gap:6 }}>
                    <button onClick={()=>{setForm(d);setSelId(d.id);setModal("edit");}} style={{ width:28,height:28,borderRadius:7,background:"#3b82f6",border:"none",color:"#fff",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center" }}><Pencil size={12}/></button>
                    <button onClick={()=>del(d.id)} style={{ width:28,height:28,borderRadius:7,background:"#ef4444",border:"none",color:"#fff",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center" }}><Trash2 size={12}/></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {modal && (
        <Overlay>
          <div className="modal-box">
            <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16 }}>
              <h2 style={{ margin:0,fontSize:17,fontWeight:800 }}>{modal==="add"?"Add Expense":"Edit Expense"}</h2>
              <button onClick={()=>setModal(null)} style={{ background:"none",border:"none",cursor:"pointer" }}><X size={20}/></button>
            </div>
            <label className="lbl">Description</label>
            <input className="inp" value={form.desc} onChange={e=>setForm((f:any)=>({...f,desc:e.target.value}))} placeholder="Expense description"/>
            <label className="lbl">Amount (AED)</label>
            <input className="inp" type="number" value={form.amount} onChange={e=>setForm((f:any)=>({...f,amount:e.target.value}))}/>
            <label className="lbl">Category</label>
            <select className="sel" value={form.category} onChange={e=>setForm((f:any)=>({...f,category:e.target.value}))}>
              {["Supplies","Utility","Payroll","Maintenance","Marketing","Other"].map(c=><option key={c}>{c}</option>)}
            </select>
            <label className="lbl">Date</label>
            <input className="inp" type="date" value={form.date} onChange={e=>setForm((f:any)=>({...f,date:e.target.value}))}/>
            <label className="lbl">Added By</label>
            <input className="inp" value={form.by} onChange={e=>setForm((f:any)=>({...f,by:e.target.value}))} placeholder="Your name"/>
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

// ── Income ────────────────────────────────────────────────────────────────────
export function FinanceIncome() {
  const show = useShow();
  const [data, setData] = useState([
    { id:1, source:"Consultation Fees", amount:28000, date:"2025-04-01", patients:187 },
    { id:2, source:"Lab Tests",         amount:12500, date:"2025-04-05", patients:95  },
    { id:3, source:"Pharmacy Sales",    amount:8300,  date:"2025-04-10", patients:0   },
    { id:4, source:"Insurance Claims",  amount:35000, date:"2025-04-15", patients:120 },
  ]);
  const blank = { source:"", amount:0, date:"", patients:0 };
  const [modal, setModal] = useState<"add"|"edit"|null>(null);
  const [form,  setForm]  = useState<any>(blank);
  const [selId, setSelId] = useState<number|null>(null);

  const total = data.reduce((s,d)=>s+d.amount,0);

  const save = () => {
    if (!form.source.trim()) return alert("Source required");
    if (modal==="add") setData(p=>[...p,{...form,id:Date.now(),amount:Number(form.amount)||0,patients:Number(form.patients)||0}]);
    else setData(p=>p.map(d=>d.id===selId?{...form,id:selId!,amount:Number(form.amount)||0,patients:Number(form.patients)||0}:d));
    setModal(null);
  };
  const del = (id:number) => { if(window.confirm("Delete?")) setData(p=>p.filter(d=>d.id!==id)); };

  return (
    <div style={{ opacity:show?1:0,transform:show?"translateY(0)":"translateY(20px)",transition:"all 0.4s ease",padding:24,minHeight:"100vh",background:"#f8fafc" }}>
      <FadeStyle/>
      <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20 }}>
        <div>
          <h1 style={{ fontSize:22,fontWeight:800,color:"#1e293b",margin:0 }}>💰 Finance — Income</h1>
          <p style={{ fontSize:13,color:"#94a3b8",margin:"4px 0 0" }}>Total: <strong style={{ color:"#059669" }}>AED {total.toLocaleString()}</strong></p>
        </div>
        <button className="btn-primary" onClick={()=>{setForm(blank);setModal("add");}} style={{ display:"flex",alignItems:"center",gap:6,borderRadius:10 }}><Plus size={15}/> Add Income</button>
      </div>
      <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(240px,1fr))",gap:14,marginBottom:20 }}>
        {data.map((d,i)=>(
          <div key={d.id} style={{ background:"#fff",borderRadius:14,padding:20,border:"1px solid #f1f5f9",animation:`fadeUp 0.35s ease ${i*0.07}s both` }}>
            <div style={{ display:"flex",justifyContent:"space-between",marginBottom:8 }}>
              <p style={{ fontSize:12,color:"#94a3b8",margin:0 }}>{d.source}</p>
              <div style={{ display:"flex",gap:5 }}>
                <button onClick={()=>{setForm(d);setSelId(d.id);setModal("edit");}} style={{ width:24,height:24,borderRadius:6,background:"#3b82f6",border:"none",color:"#fff",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center" }}><Pencil size={10}/></button>
                <button onClick={()=>del(d.id)} style={{ width:24,height:24,borderRadius:6,background:"#ef4444",border:"none",color:"#fff",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center" }}><Trash2 size={10}/></button>
              </div>
            </div>
            <p style={{ fontSize:22,fontWeight:800,color:"#059669",margin:"0 0 6px" }}>AED {d.amount.toLocaleString()}</p>
            <p style={{ fontSize:11,color:"#94a3b8",margin:0 }}>📅 {d.date}{d.patients>0?` · 👤 ${d.patients} patients`:""}</p>
          </div>
        ))}
      </div>
      {modal && (
        <Overlay>
          <div className="modal-box">
            <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16 }}>
              <h2 style={{ margin:0,fontSize:17,fontWeight:800 }}>{modal==="add"?"Add Income":"Edit Income"}</h2>
              <button onClick={()=>setModal(null)} style={{ background:"none",border:"none",cursor:"pointer" }}><X size={20}/></button>
            </div>
            <label className="lbl">Source</label>
            <input className="inp" value={form.source} onChange={e=>setForm((f:any)=>({...f,source:e.target.value}))} placeholder="e.g. Consultation Fees"/>
            <label className="lbl">Amount (AED)</label>
            <input className="inp" type="number" value={form.amount} onChange={e=>setForm((f:any)=>({...f,amount:e.target.value}))}/>
            <label className="lbl">Date</label>
            <input className="inp" type="date" value={form.date} onChange={e=>setForm((f:any)=>({...f,date:e.target.value}))}/>
            <label className="lbl">Patients Count</label>
            <input className="inp" type="number" value={form.patients} onChange={e=>setForm((f:any)=>({...f,patients:e.target.value}))}/>
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

// ── Invoices ──────────────────────────────────────────────────────────────────
export function FinanceInvoices() {
  const show = useShow();
  const [data, setData] = useState([
    { id:"INV-001", patient:"Alex Philip",   doctor:"Dr. Ahmed",  amount:350, date:"2025-04-01", status:"Paid"    },
    { id:"INV-002", patient:"Sara Khan",     doctor:"Dr. Sara",   amount:180, date:"2025-04-03", status:"Pending" },
    { id:"INV-003", patient:"John Doe",      doctor:"Dr. Mohamed",amount:520, date:"2025-04-05", status:"Paid"    },
    { id:"INV-004", patient:"Fatima Al Ali", doctor:"Dr. Ahmed",  amount:240, date:"2025-04-08", status:"Overdue" },
  ]);
  const blank = { id:"", patient:"", doctor:"", amount:0, date:"", status:"Pending" };
  const [modal, setModal] = useState<"add"|"view"|null>(null);
  const [form,  setForm]  = useState<any>(blank);
  const sc: Record<string,{bg:string;text:string}> = { Paid:{bg:"#dcfce7",text:"#16a34a"}, Pending:{bg:"#fef9c3",text:"#a16207"}, Overdue:{bg:"#fee2e2",text:"#dc2626"} };

  const genId = () => "INV-" + String(Date.now()).slice(-3);
  const save  = () => {
    if (!form.patient.trim()) return alert("Patient required");
    setData(p=>[...p,{...form,id:genId(),amount:Number(form.amount)||0}]);
    setModal(null);
  };
  const del = (id:string) => { if(window.confirm("Delete invoice?")) setData(p=>p.filter(d=>d.id!==id)); };
  const markPaid = (id:string) => setData(p=>p.map(d=>d.id===id?{...d,status:"Paid"}:d));

  return (
    <div style={{ opacity:show?1:0,transform:show?"translateY(0)":"translateY(20px)",transition:"all 0.4s ease",padding:24,minHeight:"100vh",background:"#f8fafc" }}>
      <FadeStyle/>
      <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20 }}>
        <div><h1 style={{ fontSize:22,fontWeight:800,color:"#1e293b",margin:0 }}>🧾 Finance — Invoices</h1></div>
        <button className="btn-primary" onClick={()=>{setForm(blank);setModal("add");}} style={{ display:"flex",alignItems:"center",gap:6,borderRadius:10 }}><Plus size={15}/> New Invoice</button>
      </div>
      <div style={{ background:"#fff",borderRadius:16,border:"1px solid #f1f5f9",overflow:"hidden" }}>
        <table style={{ width:"100%",borderCollapse:"collapse" }}>
          <thead><tr style={{ background:"#f8fafc" }}>{["Invoice #","Patient","Doctor","Amount","Date","Status","Actions"].map(h=><th key={h} style={{ padding:"11px 14px",textAlign:"left",fontSize:10,fontWeight:700,color:"#64748b",textTransform:"uppercase" }}>{h}</th>)}</tr></thead>
          <tbody>{data.map((d,i)=>(
            <tr key={d.id} style={{ borderTop:"1px solid #f1f5f9",animation:`fadeUp 0.3s ease ${i*0.06}s both` }}>
              <td style={{ padding:"13px 14px",fontWeight:700,color:"#4f46e5",fontSize:13 }}>{d.id}</td>
              <td style={{ padding:"13px 14px",fontWeight:600,color:"#1e293b",fontSize:13 }}>{d.patient}</td>
              <td style={{ padding:"13px 14px",fontSize:13,color:"#64748b" }}>{d.doctor}</td>
              <td style={{ padding:"13px 14px",fontSize:13,fontWeight:700,color:"#1e293b" }}>AED {d.amount.toLocaleString()}</td>
              <td style={{ padding:"13px 14px",fontSize:12,color:"#94a3b8" }}>{d.date}</td>
              <td style={{ padding:"13px 14px" }}><span style={{ fontSize:11,fontWeight:700,padding:"3px 9px",borderRadius:50,background:sc[d.status]?.bg,color:sc[d.status]?.text }}>{d.status}</span></td>
              <td style={{ padding:"13px 14px" }}>
                <div style={{ display:"flex",gap:5 }}>
                  <button onClick={()=>{setForm(d);setModal("view");}} style={{ width:28,height:28,borderRadius:7,background:"#22c55e",border:"none",color:"#fff",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center" }}><Eye size={11}/></button>
                  {d.status!=="Paid" && <button onClick={()=>markPaid(d.id)} style={{ padding:"4px 8px",borderRadius:7,background:"#dcfce7",border:"none",color:"#16a34a",fontSize:11,fontWeight:700,cursor:"pointer" }}>Mark Paid</button>}
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
              <h2 style={{ margin:0,fontSize:17,fontWeight:800 }}>New Invoice</h2>
              <button onClick={()=>setModal(null)} style={{ background:"none",border:"none",cursor:"pointer" }}><X size={20}/></button>
            </div>
            {[["Patient Name","patient","text"],["Doctor","doctor","text"],["Amount (AED)","amount","number"],["Date","date","date"]].map(([l,k,t])=>(
              <div key={k}><label className="lbl">{l}</label>
              <input className="inp" type={t} value={(form as any)[k]||""} onChange={e=>setForm((f:any)=>({...f,[k]:e.target.value}))} placeholder={l}/></div>
            ))}
            <div style={{ display:"flex",gap:10,marginTop:20 }}>
              <button className="btn-cancel" onClick={()=>setModal(null)} style={{ flex:1 }}>Cancel</button>
              <button className="btn-primary" onClick={save} style={{ flex:1,borderRadius:10 }}>Create Invoice</button>
            </div>
          </div>
        </Overlay>
      )}
      {modal==="view" && (
        <Overlay>
          <div className="modal-box">
            <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20 }}>
              <h2 style={{ margin:0,fontSize:17,fontWeight:800 }}>Invoice {form.id}</h2>
              <button onClick={()=>setModal(null)} style={{ background:"none",border:"none",cursor:"pointer" }}><X size={20}/></button>
            </div>
            <div style={{ background:"#f8fafc",borderRadius:12,padding:16,marginBottom:16 }}>
              {[["Patient",form.patient],["Doctor",form.doctor],["Date",form.date],["Status",form.status]].map(([l,v])=>(
                <div key={l} style={{ display:"flex",justifyContent:"space-between",marginBottom:8 }}>
                  <span style={{ fontSize:13,color:"#64748b" }}>{l}</span>
                  <span style={{ fontSize:13,fontWeight:600,color:"#1e293b" }}>{v}</span>
                </div>
              ))}
              <div style={{ borderTop:"1px solid #e2e8f0",paddingTop:10,display:"flex",justifyContent:"space-between" }}>
                <span style={{ fontSize:15,fontWeight:700,color:"#1e293b" }}>Total</span>
                <span style={{ fontSize:15,fontWeight:800,color:"#4f46e5" }}>AED {form.amount?.toLocaleString()}</span>
              </div>
            </div>
            <button className="btn-cancel" onClick={()=>setModal(null)} style={{ width:"100%" }}>Close</button>
          </div>
        </Overlay>
      )}
    </div>
  );
}

// ── Payments ──────────────────────────────────────────────────────────────────
export function FinancePayments() {
  const show = useShow();
  const [data, setData] = useState([
    { id:1, ref:"PAY-1001", from:"Alex Philip",   method:"Cash",          amount:350,  date:"2025-04-01", status:"Completed"  },
    { id:2, ref:"PAY-1002", from:"Sara Khan",     method:"Card",          amount:180,  date:"2025-04-03", status:"Completed"  },
    { id:3, ref:"PAY-1003", from:"Insurance Co.", method:"Bank Transfer",  amount:5200, date:"2025-04-05", status:"Processing" },
  ]);
  const blank = { ref:"", from:"", method:"Cash", amount:0, date:"", status:"Completed" };
  const [modal, setModal] = useState(false);
  const [form,  setForm]  = useState<any>(blank);
  const sc: Record<string,{bg:string;text:string}> = { Completed:{bg:"#dcfce7",text:"#16a34a"}, Processing:{bg:"#dbeafe",text:"#1d4ed8"}, Failed:{bg:"#fee2e2",text:"#dc2626"} };

  const save = () => {
    if (!form.from.trim()) return alert("Payer required");
    setData(p=>[...p,{...form,id:Date.now(),ref:"PAY-"+(Date.now()%10000),amount:Number(form.amount)||0}]);
    setModal(false);
  };
  const del = (id:number) => { if(window.confirm("Delete?")) setData(p=>p.filter(d=>d.id!==id)); };

  return (
    <div style={{ opacity:show?1:0,transform:show?"translateY(0)":"translateY(20px)",transition:"all 0.4s ease",padding:24,minHeight:"100vh",background:"#f8fafc" }}>
      <FadeStyle/>
      <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20 }}>
        <div><h1 style={{ fontSize:22,fontWeight:800,color:"#1e293b",margin:0 }}>💳 Finance — Payments</h1></div>
        <button className="btn-primary" onClick={()=>{setForm(blank);setModal(true);}} style={{ display:"flex",alignItems:"center",gap:6,borderRadius:10 }}><Plus size={15}/> Add Payment</button>
      </div>
      <div style={{ background:"#fff",borderRadius:16,border:"1px solid #f1f5f9",overflow:"hidden" }}>
        <table style={{ width:"100%",borderCollapse:"collapse" }}>
          <thead><tr style={{ background:"#f8fafc" }}>{["Ref #","From","Method","Amount","Date","Status","Actions"].map(h=><th key={h} style={{ padding:"11px 14px",textAlign:"left",fontSize:10,fontWeight:700,color:"#64748b",textTransform:"uppercase" }}>{h}</th>)}</tr></thead>
          <tbody>{data.map((d,i)=>(
            <tr key={d.id} style={{ borderTop:"1px solid #f1f5f9",animation:`fadeUp 0.3s ease ${i*0.07}s both` }}>
              <td style={{ padding:"13px 14px",fontWeight:700,color:"#4f46e5",fontSize:13 }}>{d.ref}</td>
              <td style={{ padding:"13px 14px",fontWeight:600,color:"#1e293b",fontSize:13 }}>{d.from}</td>
              <td style={{ padding:"13px 14px",fontSize:13,color:"#64748b" }}>{d.method}</td>
              <td style={{ padding:"13px 14px",fontSize:13,fontWeight:700,color:"#059669" }}>AED {d.amount.toLocaleString()}</td>
              <td style={{ padding:"13px 14px",fontSize:12,color:"#94a3b8" }}>{d.date}</td>
              <td style={{ padding:"13px 14px" }}><span style={{ fontSize:11,fontWeight:700,padding:"3px 9px",borderRadius:50,background:sc[d.status]?.bg,color:sc[d.status]?.text }}>{d.status}</span></td>
              <td style={{ padding:"13px 14px" }}>
                <button onClick={()=>del(d.id)} style={{ width:28,height:28,borderRadius:7,background:"#ef4444",border:"none",color:"#fff",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center" }}><Trash2 size={11}/></button>
              </td>
            </tr>
          ))}</tbody>
        </table>
      </div>
      {modal && (
        <Overlay>
          <div className="modal-box">
            <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16 }}>
              <h2 style={{ margin:0,fontSize:17,fontWeight:800 }}>Add Payment</h2>
              <button onClick={()=>setModal(false)} style={{ background:"none",border:"none",cursor:"pointer" }}><X size={20}/></button>
            </div>
            <label className="lbl">Payer / From</label>
            <input className="inp" value={form.from} onChange={e=>setForm((f:any)=>({...f,from:e.target.value}))} placeholder="Patient or company name"/>
            <label className="lbl">Amount (AED)</label>
            <input className="inp" type="number" value={form.amount} onChange={e=>setForm((f:any)=>({...f,amount:e.target.value}))}/>
            <label className="lbl">Payment Method</label>
            <select className="sel" value={form.method} onChange={e=>setForm((f:any)=>({...f,method:e.target.value}))}>
              {["Cash","Card","Bank Transfer","Cheque","Online"].map(m=><option key={m}>{m}</option>)}
            </select>
            <label className="lbl">Date</label>
            <input className="inp" type="date" value={form.date} onChange={e=>setForm((f:any)=>({...f,date:e.target.value}))}/>
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

// ── Transactions ──────────────────────────────────────────────────────────────
export function FinanceTransactions() {
  const show = useShow();
  const [data, setData] = useState([
    { id:1, desc:"Patient Payment - Alex",   type:"Credit", amount:350,  date:"2025-04-01", balance:83350  },
    { id:2, desc:"Electricity Bill",         type:"Debit",  amount:1800, date:"2025-04-05", balance:81550  },
    { id:3, desc:"Insurance Claim Received", type:"Credit", amount:35000,date:"2025-04-10", balance:116550 },
    { id:4, desc:"Salary Disbursement",      type:"Debit",  amount:45000,date:"2025-04-10", balance:71550  },
    { id:5, desc:"Medical Supplies",         type:"Debit",  amount:3200, date:"2025-04-12", balance:68350  },
  ]);
  const blank = { desc:"", type:"Credit", amount:0, date:"" };
  const [modal, setModal] = useState(false);
  const [form,  setForm]  = useState<any>(blank);

  const save = () => {
    if (!form.desc.trim()) return alert("Description required");
    const lastBal = data.length ? data[data.length-1].balance : 0;
    const amt = Number(form.amount)||0;
    const bal = form.type==="Credit" ? lastBal+amt : lastBal-amt;
    setData(p=>[...p,{...form,id:Date.now(),amount:amt,balance:bal}]);
    setModal(false);
  };
  const del = (id:number) => { if(window.confirm("Delete?")) setData(p=>p.filter(d=>d.id!==id)); };

  return (
    <div style={{ opacity:show?1:0,transform:show?"translateY(0)":"translateY(20px)",transition:"all 0.4s ease",padding:24,minHeight:"100vh",background:"#f8fafc" }}>
      <FadeStyle/>
      <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20 }}>
        <div>
          <h1 style={{ fontSize:22,fontWeight:800,color:"#1e293b",margin:0 }}>📊 Finance — Transactions</h1>
          <p style={{ fontSize:13,color:"#94a3b8",margin:"4px 0 0" }}>Full ledger history</p>
        </div>
        <button className="btn-primary" onClick={()=>{setForm(blank);setModal(true);}} style={{ display:"flex",alignItems:"center",gap:6,borderRadius:10 }}><Plus size={15}/> Add Entry</button>
      </div>
      <div style={{ background:"#fff",borderRadius:16,border:"1px solid #f1f5f9",overflow:"hidden" }}>
        <table style={{ width:"100%",borderCollapse:"collapse" }}>
          <thead><tr style={{ background:"#f8fafc" }}>{["Description","Type","Amount","Date","Balance","Actions"].map(h=><th key={h} style={{ padding:"11px 14px",textAlign:"left",fontSize:10,fontWeight:700,color:"#64748b",textTransform:"uppercase" }}>{h}</th>)}</tr></thead>
          <tbody>{data.map((d,i)=>(
            <tr key={d.id} style={{ borderTop:"1px solid #f1f5f9",animation:`fadeUp 0.3s ease ${i*0.06}s both` }}>
              <td style={{ padding:"13px 14px",fontWeight:600,color:"#1e293b",fontSize:13 }}>{d.desc}</td>
              <td style={{ padding:"13px 14px" }}><span style={{ fontSize:11,fontWeight:700,padding:"3px 9px",borderRadius:50,background:d.type==="Credit"?"#dcfce7":"#fee2e2",color:d.type==="Credit"?"#16a34a":"#dc2626" }}>{d.type==="Credit"?"↑ Credit":"↓ Debit"}</span></td>
              <td style={{ padding:"13px 14px",fontSize:13,fontWeight:700,color:d.type==="Credit"?"#059669":"#ef4444" }}>{d.type==="Debit"?"-":"+"}AED {d.amount.toLocaleString()}</td>
              <td style={{ padding:"13px 14px",fontSize:12,color:"#94a3b8" }}>{d.date}</td>
              <td style={{ padding:"13px 14px",fontSize:13,fontWeight:700,color:"#4f46e5" }}>AED {d.balance.toLocaleString()}</td>
              <td style={{ padding:"13px 14px" }}>
                <button onClick={()=>del(d.id)} style={{ width:28,height:28,borderRadius:7,background:"#ef4444",border:"none",color:"#fff",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center" }}><Trash2 size={11}/></button>
              </td>
            </tr>
          ))}</tbody>
        </table>
      </div>
      {modal && (
        <Overlay>
          <div className="modal-box">
            <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16 }}>
              <h2 style={{ margin:0,fontSize:17,fontWeight:800 }}>Add Transaction</h2>
              <button onClick={()=>setModal(false)} style={{ background:"none",border:"none",cursor:"pointer" }}><X size={20}/></button>
            </div>
            <label className="lbl">Description</label>
            <input className="inp" value={form.desc} onChange={e=>setForm((f:any)=>({...f,desc:e.target.value}))} placeholder="Transaction description"/>
            <label className="lbl">Type</label>
            <select className="sel" value={form.type} onChange={e=>setForm((f:any)=>({...f,type:e.target.value}))}>
              <option>Credit</option><option>Debit</option>
            </select>
            <label className="lbl">Amount (AED)</label>
            <input className="inp" type="number" value={form.amount} onChange={e=>setForm((f:any)=>({...f,amount:e.target.value}))}/>
            <label className="lbl">Date</label>
            <input className="inp" type="date" value={form.date} onChange={e=>setForm((f:any)=>({...f,date:e.target.value}))}/>
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