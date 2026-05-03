import { useState } from "react";
import { Send } from "lucide-react";

const contacts = [
  { id:1, name:"Dr. Ahmed",    role:"Cardiologist", last:"Patient rescheduled for tomorrow", time:"2m",  unread:2, color:"#4f46e5" },
  { id:2, name:"Reception",    role:"Staff",        last:"New walk-in patient arrived",       time:"15m", unread:1, color:"#0891b2" },
  { id:3, name:"Dr. Sara",     role:"Pediatrician", last:"Lab results are ready",             time:"1h",  unread:0, color:"#7c3aed" },
  { id:4, name:"Admin",        role:"Admin",        last:"System maintenance tonight",        time:"3h",  unread:0, color:"#059669" },
  { id:5, name:"Dr. Mohamed",  role:"GP",           last:"Can we shift my 4pm slot?",        time:"1d",  unread:0, color:"#f59e0b" },
];

const initChats: Record<number, {from:string;text:string;mine:boolean}[]> = {
  1: [
    { from:"Dr. Ahmed", text:"Patient rescheduled for tomorrow morning.", mine:false },
    { from:"Me", text:"Noted, I will update the schedule.", mine:true },
    { from:"Dr. Ahmed", text:"Thank you!", mine:false },
  ],
  2: [
    { from:"Reception", text:"New walk-in patient arrived for Dr. Ahmed.", mine:false },
    { from:"Me", text:"Please ask them to wait, he'll be free in 10 min.", mine:true },
  ],
};

export default function Messages() {
  const [selected, setSelected]   = useState(1);
  const [chats, setChats]         = useState(initChats);
  const [input, setInput]         = useState("");
  const [show, setShow]           = useState(false);
  useState(() => { setTimeout(() => setShow(true), 50); });

  const activeContact = contacts.find(c => c.id === selected)!;
  const msgs = chats[selected] || [];

  const send = () => {
    if (!input.trim()) return;
    setChats(prev => ({
      ...prev,
      [selected]: [...(prev[selected]||[]), { from:"Me", text:input.trim(), mine:true }],
    }));
    setInput("");
  };

  const init = (name:string) => name.split(" ").map(n=>n[0]).slice(0,2).join("").toUpperCase();

  return (
    <div style={{ opacity:show?1:0, transform:show?"translateY(0)":"translateY(20px)",
      transition:"all 0.4s ease", padding:24, minHeight:"100vh", background:"#f8fafc" }}>
      <style>{`@keyframes fadeUp{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}`}</style>

      <h1 style={{ fontSize:22, fontWeight:800, color:"#1e293b", margin:"0 0 20px" }}>💬 Messages</h1>

      <div style={{ display:"flex", gap:16, height:"calc(100vh - 140px)" }}>

        {/* Contacts list */}
        <div style={{ width:280, background:"#fff", borderRadius:16,
          border:"1px solid #f1f5f9", overflow:"hidden", display:"flex", flexDirection:"column" }}>
          <div style={{ padding:"14px 16px", borderBottom:"1px solid #f1f5f9" }}>
            <input placeholder="Search..."
              style={{ width:"100%", padding:"8px 12px", border:"1.5px solid #e2e8f0",
                borderRadius:10, fontSize:13, outline:"none", boxSizing:"border-box" }}/>
          </div>
          <div style={{ flex:1, overflowY:"auto" }}>
            {contacts.map((c, i) => (
              <div key={c.id} onClick={() => setSelected(c.id)}
                style={{
                  display:"flex", gap:12, alignItems:"center", padding:"14px 16px",
                  cursor:"pointer", borderBottom:"1px solid #f8fafc",
                  background: selected===c.id ? "#eef2ff" : "transparent",
                  animation:`fadeUp 0.3s ease ${i*0.06}s both`,
                  transition:"background .15s",
                }}>
                <div style={{ width:40, height:40, borderRadius:"50%", background:c.color+"22",
                  color:c.color, display:"flex", alignItems:"center", justifyContent:"center",
                  fontWeight:800, fontSize:13, flexShrink:0 }}>{init(c.name)}</div>
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ display:"flex", justifyContent:"space-between" }}>
                    <span style={{ fontSize:13, fontWeight:700, color:"#1e293b" }}>{c.name}</span>
                    <span style={{ fontSize:11, color:"#94a3b8" }}>{c.time}</span>
                  </div>
                  <p style={{ fontSize:11, color:"#94a3b8", margin:"2px 0 0",
                    overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{c.last}</p>
                </div>
                {c.unread > 0 && (
                  <span style={{ width:18, height:18, borderRadius:"50%", background:c.color,
                    color:"#fff", fontSize:10, fontWeight:800, display:"flex",
                    alignItems:"center", justifyContent:"center", flexShrink:0 }}>{c.unread}</span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Chat area */}
        <div style={{ flex:1, background:"#fff", borderRadius:16,
          border:"1px solid #f1f5f9", display:"flex", flexDirection:"column", overflow:"hidden" }}>
          {/* Header */}
          <div style={{ padding:"14px 20px", borderBottom:"1px solid #f1f5f9",
            display:"flex", alignItems:"center", gap:12 }}>
            <div style={{ width:38, height:38, borderRadius:"50%",
              background:activeContact.color+"22", color:activeContact.color,
              display:"flex", alignItems:"center", justifyContent:"center",
              fontWeight:800, fontSize:13 }}>{init(activeContact.name)}</div>
            <div>
              <p style={{ fontSize:14, fontWeight:700, color:"#1e293b", margin:0 }}>{activeContact.name}</p>
              <p style={{ fontSize:11, color:"#94a3b8", margin:0 }}>{activeContact.role}</p>
            </div>
          </div>
          {/* Messages */}
          <div style={{ flex:1, overflowY:"auto", padding:20, display:"flex", flexDirection:"column", gap:10 }}>
            {msgs.map((m, i) => (
              <div key={i} style={{
                display:"flex", justifyContent: m.mine ? "flex-end" : "flex-start",
                animation:`fadeUp 0.25s ease both`,
              }}>
                <div style={{
                  maxWidth:"70%", padding:"10px 14px", borderRadius: m.mine ? "16px 16px 4px 16px" : "16px 16px 16px 4px",
                  background: m.mine ? "#4f46e5" : "#f1f5f9",
                  color: m.mine ? "#fff" : "#1e293b",
                  fontSize:13, lineHeight:1.5,
                }}>{m.text}</div>
              </div>
            ))}
            {msgs.length === 0 && (
              <p style={{ textAlign:"center", color:"#94a3b8", fontSize:13, marginTop:40 }}>No messages yet. Start the conversation!</p>
            )}
          </div>
          {/* Input */}
          <div style={{ padding:"12px 16px", borderTop:"1px solid #f1f5f9",
            display:"flex", gap:10, alignItems:"center" }}>
            <input value={input} onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === "Enter" && send()}
              placeholder="Type a message..."
              style={{ flex:1, padding:"10px 14px", border:"1.5px solid #e2e8f0",
                borderRadius:50, fontSize:13, outline:"none" }}/>
            <button onClick={send}
              style={{ width:42, height:42, borderRadius:"50%", background:"#4f46e5",
                border:"none", color:"#fff", cursor:"pointer", display:"flex",
                alignItems:"center", justifyContent:"center" }}>
              <Send size={16}/>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}