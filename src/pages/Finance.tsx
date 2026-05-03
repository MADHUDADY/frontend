import { useState } from "react";
import { Plus, Search, Pencil, Trash2 } from "lucide-react";

const FadeStyle = () => (
  <style>{`@keyframes fadeUp{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}`}</style>
);
function useShow() {
  const [show, setShow] = useState(false);
  useState(() => { setTimeout(() => setShow(true), 50); });
  return show;
}

// ── Expenses ──────────────────────────────────────────────────────────────────
export function FinanceExpenses() {
  const show = useShow();
  const [data] = useState([
    { id:1, desc:"Medical Supplies",   category:"Supplies",   amount:"AED 3,200", date:"2025-04-01", by:"Admin"   },
    { id:2, desc:"Electricity Bill",   category:"Utility",    amount:"AED 1,800", date:"2025-04-05", by:"Finance" },
    { id:3, desc:"Staff Salary",       category:"Payroll",    amount:"AED 45,000",date:"2025-04-10", by:"HR"      },
    { id:4, desc:"Equipment Repair",   category:"Maintenance",amount:"AED 2,500", date:"2025-04-12", by:"Admin"   },
    { id:5, desc:"Marketing Ads",      category:"Marketing",  amount:"AED 5,000", date:"2025-04-15", by:"Admin"   },
  ]);
  const total = "AED 57,500";
  const catColor: Record<string,string> = { Supplies:"#0891b2", Utility:"#f59e0b", Payroll:"#4f46e5", Maintenance:"#d97706", Marketing:"#ec4899" };

  return (
    <div style={{ opacity:show?1:0, transform:show?"translateY(0)":"translateY(20px)", transition:"all 0.4s ease", padding:24, minHeight:"100vh", background:"#f8fafc" }}>
      <FadeStyle/>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:20 }}>
        <div><h1 style={{ fontSize:22, fontWeight:800, color:"#1e293b", margin:0 }}>💸 Finance — Expenses</h1>
          <p style={{ fontSize:13, color:"#94a3b8", margin:"4px 0 0" }}>April 2025 · Total: <strong style={{ color:"#ef4444" }}>{total}</strong></p></div>
        <button style={{ display:"flex", alignItems:"center", gap:6, padding:"9px 18px", background:"#4f46e5", color:"#fff", border:"none", borderRadius:10, fontWeight:700, fontSize:13, cursor:"pointer" }}><Plus size={15}/> Add Expense</button>
      </div>
      <div style={{ background:"#fff", borderRadius:16, border:"1px solid #f1f5f9", overflow:"hidden" }}>
        <table style={{ width:"100%", borderCollapse:"collapse" }}>
          <thead><tr style={{ background:"#f8fafc" }}>{["Description","Category","Amount","Date","By","Actions"].map(h=><th key={h} style={{ padding:"11px 14px", textAlign:"left", fontSize:10, fontWeight:700, color:"#64748b", textTransform:"uppercase" }}>{h}</th>)}</tr></thead>
          <tbody>{data.map((d,i)=>(
            <tr key={d.id} style={{ borderTop:"1px solid #f1f5f9", animation:`fadeUp 0.3s ease ${i*0.06}s both` }}>
              <td style={{ padding:"13px 14px", fontWeight:600, color:"#1e293b", fontSize:13 }}>{d.desc}</td>
              <td style={{ padding:"13px 14px" }}><span style={{ fontSize:11, fontWeight:700, padding:"3px 9px", borderRadius:50, background:(catColor[d.category]||"#4f46e5")+"18", color:catColor[d.category]||"#4f46e5" }}>{d.category}</span></td>
              <td style={{ padding:"13px 14px", fontSize:13, fontWeight:700, color:"#ef4444" }}>{d.amount}</td>
              <td style={{ padding:"13px 14px", fontSize:12, color:"#94a3b8" }}>{d.date}</td>
              <td style={{ padding:"13px 14px", fontSize:13, color:"#64748b" }}>{d.by}</td>
              <td style={{ padding:"13px 14px" }}><div style={{ display:"flex", gap:6 }}>
                <button style={{ width:28, height:28, borderRadius:7, background:"#3b82f6", border:"none", color:"#fff", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center" }}><Pencil size={12}/></button>
                <button style={{ width:28, height:28, borderRadius:7, background:"#ef4444", border:"none", color:"#fff", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center" }}><Trash2 size={12}/></button>
              </div></td>
            </tr>
          ))}</tbody>
        </table>
      </div>
    </div>
  );
}

// ── Income ────────────────────────────────────────────────────────────────────
export function FinanceIncome() {
  const show = useShow();
  const data = [
    { id:1, source:"Consultation Fees", amount:"AED 28,000", date:"2025-04-01", patients:187 },
    { id:2, source:"Lab Tests",         amount:"AED 12,500", date:"2025-04-05", patients:95  },
    { id:3, source:"Pharmacy Sales",    amount:"AED 8,300",  date:"2025-04-10", patients:0   },
    { id:4, source:"Insurance Claims",  amount:"AED 35,000", date:"2025-04-15", patients:120 },
  ];
  return (
    <div style={{ opacity:show?1:0, transform:show?"translateY(0)":"translateY(20px)", transition:"all 0.4s ease", padding:24, minHeight:"100vh", background:"#f8fafc" }}>
      <FadeStyle/>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:20 }}>
        <div><h1 style={{ fontSize:22, fontWeight:800, color:"#1e293b", margin:0 }}>💰 Finance — Income</h1>
          <p style={{ fontSize:13, color:"#94a3b8", margin:"4px 0 0" }}>April 2025 · Total: <strong style={{ color:"#059669" }}>AED 83,800</strong></p></div>
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(240px,1fr))", gap:14, marginBottom:20 }}>
        {data.map((d,i)=>(
          <div key={d.id} style={{ background:"#fff", borderRadius:14, padding:20, border:"1px solid #f1f5f9", animation:`fadeUp 0.35s ease ${i*0.07}s both` }}>
            <p style={{ fontSize:12, color:"#94a3b8", margin:"0 0 6px" }}>{d.source}</p>
            <p style={{ fontSize:22, fontWeight:800, color:"#059669", margin:"0 0 6px" }}>{d.amount}</p>
            <p style={{ fontSize:11, color:"#94a3b8", margin:0 }}>📅 {d.date}{d.patients>0?` · 👤 ${d.patients} patients`:""}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Invoices ──────────────────────────────────────────────────────────────────
export function FinanceInvoices() {
  const show = useShow();
  const data = [
    { id:"INV-001", patient:"Alex Philip",   doctor:"Dr. Ahmed",  amount:"AED 350", date:"2025-04-01", status:"Paid"    },
    { id:"INV-002", patient:"Sara Khan",     doctor:"Dr. Sara",   amount:"AED 180", date:"2025-04-03", status:"Pending" },
    { id:"INV-003", patient:"John Doe",      doctor:"Dr. Mohamed",amount:"AED 520", date:"2025-04-05", status:"Paid"    },
    { id:"INV-004", patient:"Fatima Al Ali", doctor:"Dr. Ahmed",  amount:"AED 240", date:"2025-04-08", status:"Overdue" },
  ];
  const sc: Record<string,{bg:string;text:string}> = { Paid:{bg:"#dcfce7",text:"#16a34a"}, Pending:{bg:"#fef9c3",text:"#a16207"}, Overdue:{bg:"#fee2e2",text:"#dc2626"} };
  return (
    <div style={{ opacity:show?1:0, transform:show?"translateY(0)":"translateY(20px)", transition:"all 0.4s ease", padding:24, minHeight:"100vh", background:"#f8fafc" }}>
      <FadeStyle/>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:20 }}>
        <div><h1 style={{ fontSize:22, fontWeight:800, color:"#1e293b", margin:0 }}>🧾 Finance — Invoices</h1></div>
        <button style={{ display:"flex", alignItems:"center", gap:6, padding:"9px 18px", background:"#4f46e5", color:"#fff", border:"none", borderRadius:10, fontWeight:700, fontSize:13, cursor:"pointer" }}><Plus size={15}/> New Invoice</button>
      </div>
      <div style={{ background:"#fff", borderRadius:16, border:"1px solid #f1f5f9", overflow:"hidden" }}>
        <table style={{ width:"100%", borderCollapse:"collapse" }}>
          <thead><tr style={{ background:"#f8fafc" }}>{["Invoice #","Patient","Doctor","Amount","Date","Status","Actions"].map(h=><th key={h} style={{ padding:"11px 14px", textAlign:"left", fontSize:10, fontWeight:700, color:"#64748b", textTransform:"uppercase" }}>{h}</th>)}</tr></thead>
          <tbody>{data.map((d,i)=>(
            <tr key={d.id} style={{ borderTop:"1px solid #f1f5f9", animation:`fadeUp 0.3s ease ${i*0.06}s both` }}>
              <td style={{ padding:"13px 14px", fontWeight:700, color:"#4f46e5", fontSize:13 }}>{d.id}</td>
              <td style={{ padding:"13px 14px", fontWeight:600, color:"#1e293b", fontSize:13 }}>{d.patient}</td>
              <td style={{ padding:"13px 14px", fontSize:13, color:"#64748b" }}>{d.doctor}</td>
              <td style={{ padding:"13px 14px", fontSize:13, fontWeight:700, color:"#1e293b" }}>{d.amount}</td>
              <td style={{ padding:"13px 14px", fontSize:12, color:"#94a3b8" }}>{d.date}</td>
              <td style={{ padding:"13px 14px" }}><span style={{ fontSize:11, fontWeight:700, padding:"3px 9px", borderRadius:50, background:sc[d.status]?.bg, color:sc[d.status]?.text }}>{d.status}</span></td>
              <td style={{ padding:"13px 14px" }}><div style={{ display:"flex", gap:6 }}>
                <button style={{ padding:"4px 10px", borderRadius:7, background:"#eef2ff", border:"none", color:"#4f46e5", fontSize:11, fontWeight:700, cursor:"pointer" }}>Print</button>
                <button style={{ width:28, height:28, borderRadius:7, background:"#ef4444", border:"none", color:"#fff", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center" }}><Trash2 size={12}/></button>
              </div></td>
            </tr>
          ))}</tbody>
        </table>
      </div>
    </div>
  );
}

// ── Payments ──────────────────────────────────────────────────────────────────
export function FinancePayments() {
  const show = useShow();
  const data = [
    { id:1, ref:"PAY-1001", from:"Alex Philip",   method:"Cash",        amount:"AED 350", date:"2025-04-01", status:"Completed" },
    { id:2, ref:"PAY-1002", from:"Sara Khan",     method:"Card",        amount:"AED 180", date:"2025-04-03", status:"Completed" },
    { id:3, ref:"PAY-1003", from:"Insurance Co.", method:"Bank Transfer",amount:"AED 5,200",date:"2025-04-05",status:"Processing"},
  ];
  const sc: Record<string,{bg:string;text:string}> = { Completed:{bg:"#dcfce7",text:"#16a34a"}, Processing:{bg:"#dbeafe",text:"#1d4ed8"} };
  return (
    <div style={{ opacity:show?1:0, transform:show?"translateY(0)":"translateY(20px)", transition:"all 0.4s ease", padding:24, minHeight:"100vh", background:"#f8fafc" }}>
      <FadeStyle/>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:20 }}>
        <div><h1 style={{ fontSize:22, fontWeight:800, color:"#1e293b", margin:0 }}>💳 Finance — Payments</h1></div>
      </div>
      <div style={{ background:"#fff", borderRadius:16, border:"1px solid #f1f5f9", overflow:"hidden" }}>
        <table style={{ width:"100%", borderCollapse:"collapse" }}>
          <thead><tr style={{ background:"#f8fafc" }}>{["Ref #","From","Method","Amount","Date","Status"].map(h=><th key={h} style={{ padding:"11px 14px", textAlign:"left", fontSize:10, fontWeight:700, color:"#64748b", textTransform:"uppercase" }}>{h}</th>)}</tr></thead>
          <tbody>{data.map((d,i)=>(
            <tr key={d.id} style={{ borderTop:"1px solid #f1f5f9", animation:`fadeUp 0.3s ease ${i*0.07}s both` }}>
              <td style={{ padding:"13px 14px", fontWeight:700, color:"#4f46e5", fontSize:13 }}>{d.ref}</td>
              <td style={{ padding:"13px 14px", fontWeight:600, color:"#1e293b", fontSize:13 }}>{d.from}</td>
              <td style={{ padding:"13px 14px", fontSize:13, color:"#64748b" }}>{d.method}</td>
              <td style={{ padding:"13px 14px", fontSize:13, fontWeight:700, color:"#059669" }}>{d.amount}</td>
              <td style={{ padding:"13px 14px", fontSize:12, color:"#94a3b8" }}>{d.date}</td>
              <td style={{ padding:"13px 14px" }}><span style={{ fontSize:11, fontWeight:700, padding:"3px 9px", borderRadius:50, background:sc[d.status]?.bg, color:sc[d.status]?.text }}>{d.status}</span></td>
            </tr>
          ))}</tbody>
        </table>
      </div>
    </div>
  );
}

// ── Transactions ──────────────────────────────────────────────────────────────
export function FinanceTransactions() {
  const show = useShow();
  const data = [
    { id:1, desc:"Patient Payment - Alex",    type:"Credit", amount:"AED 350",    date:"2025-04-01", balance:"AED 83,350" },
    { id:2, desc:"Electricity Bill",          type:"Debit",  amount:"AED 1,800",  date:"2025-04-05", balance:"AED 81,550" },
    { id:3, desc:"Insurance Claim Received",  type:"Credit", amount:"AED 35,000", date:"2025-04-10", balance:"AED 116,550"},
    { id:4, desc:"Salary Disbursement",       type:"Debit",  amount:"AED 45,000", date:"2025-04-10", balance:"AED 71,550" },
    { id:5, desc:"Medical Supplies Purchase", type:"Debit",  amount:"AED 3,200",  date:"2025-04-12", balance:"AED 68,350" },
  ];
  return (
    <div style={{ opacity:show?1:0, transform:show?"translateY(0)":"translateY(20px)", transition:"all 0.4s ease", padding:24, minHeight:"100vh", background:"#f8fafc" }}>
      <FadeStyle/>
      <div style={{ marginBottom:20 }}>
        <h1 style={{ fontSize:22, fontWeight:800, color:"#1e293b", margin:0 }}>📊 Finance — Transactions</h1>
        <p style={{ fontSize:13, color:"#94a3b8", margin:"4px 0 0" }}>Full ledger history</p>
      </div>
      <div style={{ background:"#fff", borderRadius:16, border:"1px solid #f1f5f9", overflow:"hidden" }}>
        <table style={{ width:"100%", borderCollapse:"collapse" }}>
          <thead><tr style={{ background:"#f8fafc" }}>{["Description","Type","Amount","Date","Balance"].map(h=><th key={h} style={{ padding:"11px 14px", textAlign:"left", fontSize:10, fontWeight:700, color:"#64748b", textTransform:"uppercase" }}>{h}</th>)}</tr></thead>
          <tbody>{data.map((d,i)=>(
            <tr key={d.id} style={{ borderTop:"1px solid #f1f5f9", animation:`fadeUp 0.3s ease ${i*0.06}s both` }}>
              <td style={{ padding:"13px 14px", fontWeight:600, color:"#1e293b", fontSize:13 }}>{d.desc}</td>
              <td style={{ padding:"13px 14px" }}><span style={{ fontSize:11, fontWeight:700, padding:"3px 9px", borderRadius:50, background:d.type==="Credit"?"#dcfce7":"#fee2e2", color:d.type==="Credit"?"#16a34a":"#dc2626" }}>{d.type==="Credit"?"↑ Credit":"↓ Debit"}</span></td>
              <td style={{ padding:"13px 14px", fontSize:13, fontWeight:700, color:d.type==="Credit"?"#059669":"#ef4444" }}>{d.type==="Debit"?"-":"+"}  {d.amount}</td>
              <td style={{ padding:"13px 14px", fontSize:12, color:"#94a3b8" }}>{d.date}</td>
              <td style={{ padding:"13px 14px", fontSize:13, fontWeight:700, color:"#4f46e5" }}>{d.balance}</td>
            </tr>
          ))}</tbody>
        </table>
      </div>
    </div>
  );
}