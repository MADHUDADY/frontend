import React, { useState, useEffect, useCallback } from "react";
import api from "../../services/api";

// ── Types ─────────────────────────────────────────────────────────────────────
type Priority = "Low" | "Medium" | "High" | "Critical";
type Status   = "Open" | "In Progress" | "On Hold" | "Resolved" | "Closed" | "Cancelled";

interface Ticket {
  id: number; ticket_no: string; title: string; description?: string;
  category_id?: number; category_name?: string; category_icon?: string; category_color?: string;
  priority: Priority; status: Status;
  raised_by_name?: string; raised_by_dept?: string; raised_by_phone?: string; raised_by_email?: string;
  assigned_to?: string; assigned_at?: string;
  location?: string; asset_tag?: string; due_date?: string; resolution_note?: string;
  created_at: string; updated_at: string; resolved_at?: string;
  activities?: Activity[];
}

interface Activity {
  id: number; ticket_id: number; actor: string; action: string; note?: string; created_at: string;
}

interface Category { id: number; name: string; icon: string; color: string; }
interface Stats {
  total: number; open: number; in_progress: number; on_hold: number;
  resolved: number; cancelled: number; critical: number; high: number; today: number; overdue: number;
}

// ── Constants ─────────────────────────────────────────────────────────────────
const PRIORITY_CONFIG: Record<Priority, { color: string; bg: string; dot: string }> = {
  Low:      { color: "text-gray-600",  bg: "bg-gray-100",   dot: "bg-gray-400" },
  Medium:   { color: "text-blue-600",  bg: "bg-blue-50",    dot: "bg-blue-500" },
  High:     { color: "text-orange-600",bg: "bg-orange-50",  dot: "bg-orange-500" },
  Critical: { color: "text-red-600",   bg: "bg-red-50",     dot: "bg-red-500" },
};
const STATUS_CONFIG: Record<Status, { color: string; bg: string; border: string }> = {
  "Open":        { color: "text-indigo-700", bg: "bg-indigo-50",  border: "border-indigo-200" },
  "In Progress": { color: "text-blue-700",   bg: "bg-blue-50",    border: "border-blue-200" },
  "On Hold":     { color: "text-yellow-700", bg: "bg-yellow-50",  border: "border-yellow-200" },
  "Resolved":    { color: "text-green-700",  bg: "bg-green-50",   border: "border-green-200" },
  "Closed":      { color: "text-gray-600",   bg: "bg-gray-100",   border: "border-gray-200" },
  "Cancelled":   { color: "text-red-600",    bg: "bg-red-50",     border: "border-red-200" },
};

const fmtDate = (d?: string) => d ? new Date(d).toLocaleDateString("en-IN", { day:"2-digit", month:"short", year:"numeric" }) : "—";
const fmtTime = (d?: string) => d ? new Date(d).toLocaleString("en-IN", { day:"2-digit", month:"short", hour:"2-digit", minute:"2-digit" }) : "—";
const inputCls = (err?: boolean) =>
  `w-full border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 transition bg-white
   ${err ? "border-red-400 bg-red-50" : "border-gray-200 hover:border-gray-300"}`;

// ═══════════════════════════════════════════════════════════════════════════════
// SUB-COMPONENT: Stat Card
// ═══════════════════════════════════════════════════════════════════════════════
const StatCard = ({ label, value, icon, color, onClick, active }:
  { label: string; value: number; icon: string; color: string; onClick?: () => void; active?: boolean }) => (
  <button onClick={onClick}
    className={`flex-1 min-w-[110px] p-4 rounded-xl border-2 text-left transition-all cursor-pointer
                ${active ? `${color} border-current shadow-md scale-[1.02]` : "bg-white border-gray-100 hover:border-gray-300 hover:shadow-sm"}`}>
    <div className="text-2xl mb-1">{icon}</div>
    <div className={`text-2xl font-black ${active ? "" : "text-gray-800"}`}>{value}</div>
    <div className={`text-xs font-semibold mt-0.5 ${active ? "opacity-80" : "text-gray-500"}`}>{label}</div>
  </button>
);

// ═══════════════════════════════════════════════════════════════════════════════
// SUB-COMPONENT: New Ticket Form
// ═══════════════════════════════════════════════════════════════════════════════
const NewTicketForm = ({ categories, onCreated, onCancel }:
  { categories: Category[]; onCreated: () => void; onCancel: () => void }) => {
  const [form, setForm] = useState({
    title: "", description: "", category_id: "", priority: "Medium" as Priority,
    raised_by_name: "", raised_by_dept: "", raised_by_phone: "", raised_by_email: "",
    location: "", asset_tag: "", due_date: "",
  });
  const [errors,  setErrors]  = useState<Record<string, string>>({});
  const [saving,  setSaving]  = useState(false);
  const [success, setSuccess] = useState<string | null>(null);

  const set = (k: string, v: string) => {
    setForm(f => ({ ...f, [k]: v }));
    setErrors(e => ({ ...e, [k]: "" }));
  };

  const submit = async () => {
    const errs: Record<string, string> = {};
    if (!form.title.trim())          errs.title          = "Title is required";
    if (!form.raised_by_name.trim()) errs.raised_by_name = "Your name is required";
    if (Object.keys(errs).length) { setErrors(errs); return; }
    try {
      setSaving(true);
      const res = await api.post("/helpdesk/tickets", form);
      setSuccess(res.data.ticket_no);
      setTimeout(() => { onCreated(); }, 2000);
    } catch (err: any) {
      setErrors({ api: err?.response?.data?.message || "Failed to create ticket" });
    } finally {
      setSaving(false);
    }
  };

  if (success) return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="text-6xl mb-4">🎫</div>
      <h3 className="text-xl font-bold text-green-700 mb-1">Ticket Raised!</h3>
      <p className="text-gray-500 text-sm">Your ticket number is</p>
      <div className="mt-2 text-2xl font-black text-indigo-600 tracking-wider">{success}</div>
      <p className="text-gray-400 text-xs mt-3">IT team will contact you shortly</p>
    </div>
  );

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
        <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white text-lg">🎫</div>
        <div>
          <h3 className="font-bold text-gray-900">Raise a Support Ticket</h3>
          <p className="text-xs text-gray-400">Describe your issue and our IT team will get back to you</p>
        </div>
      </div>

      {errors.api && <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">❌ {errors.api}</div>}

      {/* Issue Info */}
      <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-4 space-y-3">
        <p className="text-xs font-bold text-indigo-600 uppercase tracking-wider">Issue Details</p>
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1">Issue Title <span className="text-red-500">*</span></label>
          <input value={form.title} onChange={e => set("title", e.target.value)}
            placeholder="e.g. Printer not working in Room 3A"
            className={inputCls(!!errors.title)} />
          {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title}</p>}
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">Category</label>
            <select value={form.category_id} onChange={e => set("category_id", e.target.value)} className={inputCls()}>
              <option value="">-- Select --</option>
              {categories.map(c => <option key={c.id} value={c.id}>{c.icon} {c.name}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">Priority</label>
            <select value={form.priority} onChange={e => set("priority", e.target.value as Priority)} className={inputCls()}>
              <option value="Low">🟢 Low</option>
              <option value="Medium">🔵 Medium</option>
              <option value="High">🟠 High</option>
              <option value="Critical">🔴 Critical</option>
            </select>
          </div>
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1">Description</label>
          <textarea value={form.description} onChange={e => set("description", e.target.value)}
            rows={3} placeholder="Explain the issue in detail..."
            className={`${inputCls()} resize-none`} />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">📍 Location / Room</label>
            <input value={form.location} onChange={e => set("location", e.target.value)}
              placeholder="e.g. Room 3A, Reception" className={inputCls()} />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">🏷️ Asset / Device Tag</label>
            <input value={form.asset_tag} onChange={e => set("asset_tag", e.target.value)}
              placeholder="e.g. PC-042, PRT-01" className={inputCls()} />
          </div>
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1">Due Date (optional)</label>
          <input type="date" value={form.due_date} onChange={e => set("due_date", e.target.value)} className={inputCls()} />
        </div>
      </div>

      {/* Raised By */}
      <div className="bg-yellow-50 border border-yellow-100 rounded-xl p-4 space-y-3">
        <p className="text-xs font-bold text-yellow-600 uppercase tracking-wider">Your Information</p>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">Your Name <span className="text-red-500">*</span></label>
            <input value={form.raised_by_name} onChange={e => set("raised_by_name", e.target.value)}
              placeholder="e.g. Ahmed Ali" className={inputCls(!!errors.raised_by_name)} />
            {errors.raised_by_name && <p className="text-red-500 text-xs mt-1">{errors.raised_by_name}</p>}
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">Department</label>
            <input value={form.raised_by_dept} onChange={e => set("raised_by_dept", e.target.value)}
              placeholder="e.g. Reception, Pharmacy" className={inputCls()} />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">📞 Phone</label>
            <input value={form.raised_by_phone} onChange={e => set("raised_by_phone", e.target.value)}
              placeholder="e.g. 0501234567" className={inputCls()} />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">📧 Email</label>
            <input type="email" value={form.raised_by_email} onChange={e => set("raised_by_email", e.target.value)}
              placeholder="you@clinic.com" className={inputCls()} />
          </div>
        </div>
      </div>

      <div className="flex gap-3 pt-1">
        <button onClick={onCancel}
          className="flex-1 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-600 hover:bg-gray-50 transition">
          Cancel
        </button>
        <button onClick={submit} disabled={saving}
          className="flex-1 py-2.5 bg-indigo-600 text-white rounded-lg text-sm font-semibold
                     hover:bg-indigo-700 disabled:opacity-50 transition flex items-center justify-center gap-2">
          {saving ? <><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"/>Raising...</> : "🎫 Raise Ticket"}
        </button>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// SUB-COMPONENT: Ticket Detail Panel
// ═══════════════════════════════════════════════════════════════════════════════
const TicketDetail = ({ ticket, onClose, onRefresh }:
  { ticket: Ticket; onClose: () => void; onRefresh: () => void }) => {
  const [comment,    setComment]    = useState("");
  const [assignTo,   setAssignTo]   = useState(ticket.assigned_to || "");
  const [resolveNote,setResolveNote]= useState("");
  const [saving,     setSaving]     = useState(false);
  const [activeTab,  setActiveTab]  = useState<"info" | "activity">("info");

  const changeStatus = async (status: Status) => {
    try {
      setSaving(true);
      await api.patch(`/helpdesk/tickets/${ticket.id}/status`, { status, actor: "Admin" });
      onRefresh();
    } finally { setSaving(false); }
  };

  const assign = async () => {
    if (!assignTo.trim()) return;
    try {
      setSaving(true);
      await api.patch(`/helpdesk/tickets/${ticket.id}/assign`, { assigned_to: assignTo, actor: "Admin" });
      onRefresh();
    } finally { setSaving(false); }
  };

  const resolve = async () => {
    try {
      setSaving(true);
      await api.patch(`/helpdesk/tickets/${ticket.id}/resolve`, { resolution_note: resolveNote, actor: "IT Staff" });
      onRefresh();
    } finally { setSaving(false); }
  };

  const addComment = async () => {
    if (!comment.trim()) return;
    try {
      setSaving(true);
      await api.post(`/helpdesk/tickets/${ticket.id}/comment`, { note: comment, actor: "Admin" });
      setComment("");
      onRefresh();
    } finally { setSaving(false); }
  };

  const sc = STATUS_CONFIG[ticket.status];
  const pc = PRIORITY_CONFIG[ticket.priority];

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-start justify-between pb-4 border-b border-gray-100 mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-black text-indigo-600 tracking-wider">{ticket.ticket_no}</span>
            <span className={`text-xs px-2 py-0.5 rounded-full font-semibold border ${sc.bg} ${sc.color} ${sc.border}`}>
              {ticket.status}
            </span>
            <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${pc.bg} ${pc.color}`}>
              <span className={`inline-block w-1.5 h-1.5 rounded-full mr-1 ${pc.dot}`}></span>{ticket.priority}
            </span>
          </div>
          <h3 className="font-bold text-gray-900 text-base leading-tight">{ticket.title}</h3>
          <p className="text-xs text-gray-400 mt-0.5">
            {ticket.category_icon} {ticket.category_name || "General"} · Raised by {ticket.raised_by_name || "Unknown"} · {fmtDate(ticket.created_at)}
          </p>
        </div>
        <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl font-bold ml-3">×</button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-4 bg-gray-100 rounded-lg p-1">
        {(["info","activity"] as const).map(t => (
          <button key={t} onClick={() => setActiveTab(t)}
            className={`flex-1 py-1.5 text-xs font-semibold rounded-md capitalize transition
                        ${activeTab === t ? "bg-white shadow-sm text-indigo-600" : "text-gray-500 hover:text-gray-700"}`}>
            {t === "info" ? "📋 Details" : `💬 Activity (${ticket.activities?.length || 0})`}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto space-y-4 pr-1">
        {activeTab === "info" && (
          <>
            {/* Description */}
            {ticket.description && (
              <div className="bg-gray-50 rounded-xl p-3">
                <p className="text-xs font-bold text-gray-400 uppercase mb-2">Description</p>
                <p className="text-sm text-gray-700 whitespace-pre-wrap">{ticket.description}</p>
              </div>
            )}

            {/* Info grid */}
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: "Raised By",   value: ticket.raised_by_name },
                { label: "Department",  value: ticket.raised_by_dept },
                { label: "Phone",       value: ticket.raised_by_phone },
                { label: "Email",       value: ticket.raised_by_email },
                { label: "Location",    value: ticket.location },
                { label: "Asset Tag",   value: ticket.asset_tag },
                { label: "Created",     value: fmtTime(ticket.created_at) },
                { label: "Due Date",    value: fmtDate(ticket.due_date) },
                { label: "Assigned To", value: ticket.assigned_to },
                { label: "Resolved At", value: fmtTime(ticket.resolved_at) },
              ].map(({ label, value }) => value ? (
                <div key={label} className="bg-gray-50 rounded-lg p-2.5">
                  <p className="text-xs text-gray-400 font-semibold">{label}</p>
                  <p className="text-sm text-gray-800 font-medium mt-0.5 break-words">{value}</p>
                </div>
              ) : null)}
            </div>

            {/* Resolution note */}
            {ticket.resolution_note && (
              <div className="bg-green-50 border border-green-200 rounded-xl p-3">
                <p className="text-xs font-bold text-green-600 uppercase mb-1">Resolution Note</p>
                <p className="text-sm text-green-800">{ticket.resolution_note}</p>
              </div>
            )}

            {/* Actions */}
            {!["Resolved","Closed","Cancelled"].includes(ticket.status) && (
              <div className="space-y-3 border-t border-gray-100 pt-3">
                <p className="text-xs font-bold text-gray-400 uppercase">Actions</p>

                {/* Assign */}
                <div className="flex gap-2">
                  <input value={assignTo} onChange={e => setAssignTo(e.target.value)}
                    placeholder="Assign to IT staff name..."
                    className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400" />
                  <button onClick={assign} disabled={saving || !assignTo.trim()}
                    className="bg-indigo-600 text-white px-3 py-2 rounded-lg text-xs font-semibold
                               hover:bg-indigo-700 disabled:opacity-50 whitespace-nowrap transition">
                    👤 Assign
                  </button>
                </div>

                {/* Status buttons */}
                <div className="flex flex-wrap gap-2">
                  {(["Open","In Progress","On Hold"] as Status[])
                    .filter(s => s !== ticket.status)
                    .map(s => (
                      <button key={s} onClick={() => changeStatus(s)} disabled={saving}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition disabled:opacity-50
                                    ${STATUS_CONFIG[s].bg} ${STATUS_CONFIG[s].color} ${STATUS_CONFIG[s].border}
                                    hover:brightness-95`}>
                        → {s}
                      </button>
                    ))}
                  <button onClick={() => changeStatus("Cancelled")} disabled={saving}
                    className="px-3 py-1.5 rounded-lg text-xs font-semibold border border-red-200 bg-red-50 text-red-600 hover:bg-red-100 transition disabled:opacity-50">
                    ✕ Cancel
                  </button>
                </div>

                {/* Resolve */}
                <div className="bg-green-50 border border-green-200 rounded-xl p-3 space-y-2">
                  <p className="text-xs font-bold text-green-700">✅ Mark as Resolved</p>
                  <textarea value={resolveNote} onChange={e => setResolveNote(e.target.value)}
                    placeholder="Describe how the issue was resolved..."
                    rows={2} className="w-full border border-green-200 rounded-lg px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-green-400 bg-white" />
                  <button onClick={resolve} disabled={saving}
                    className="w-full py-2 bg-green-600 text-white rounded-lg text-xs font-semibold
                               hover:bg-green-700 disabled:opacity-50 transition">
                    Resolve Ticket
                  </button>
                </div>
              </div>
            )}

            {/* Close ticket if resolved */}
            {ticket.status === "Resolved" && (
              <button onClick={() => changeStatus("Closed")} disabled={saving}
                className="w-full py-2.5 border-2 border-gray-300 text-gray-600 rounded-xl text-sm font-semibold hover:bg-gray-50 transition">
                🔒 Close Ticket
              </button>
            )}
          </>
        )}

        {activeTab === "activity" && (
          <div className="space-y-3">
            {(ticket.activities || []).length === 0 ? (
              <p className="text-center text-gray-400 text-sm py-8">No activity yet</p>
            ) : (
              [...(ticket.activities || [])].reverse().map((a) => (
                <div key={a.id} className="flex gap-3">
                  <div className="w-7 h-7 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                    {(a.actor || "S").charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 bg-gray-50 rounded-xl p-3">
                    <div className="flex justify-between items-start">
                      <span className="text-xs font-bold text-gray-700">{a.actor}</span>
                      <span className="text-xs text-gray-400">{fmtTime(a.created_at)}</span>
                    </div>
                    <p className="text-xs text-indigo-600 font-semibold mt-0.5">{a.action}</p>
                    {a.note && <p className="text-sm text-gray-600 mt-1 whitespace-pre-wrap">{a.note}</p>}
                  </div>
                </div>
              ))
            )}

            {/* Add comment */}
            <div className="border-t border-gray-100 pt-3 space-y-2">
              <textarea value={comment} onChange={e => setComment(e.target.value)}
                placeholder="Add a comment or update..."
                rows={2} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-indigo-400" />
              <button onClick={addComment} disabled={saving || !comment.trim()}
                className="w-full py-2 bg-indigo-600 text-white rounded-lg text-xs font-semibold
                           hover:bg-indigo-700 disabled:opacity-50 transition">
                💬 Add Comment
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN PAGE COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════
const HelpdeskPage: React.FC = () => {
  const [tickets,       setTickets]       = useState<Ticket[]>([]);
  const [stats,         setStats]         = useState<Stats | null>(null);
  const [categories,    setCategories]    = useState<Category[]>([]);
  const [loading,       setLoading]       = useState(true);
  const [search,        setSearch]        = useState("");
  const [filterStatus,  setFilterStatus]  = useState("");
  const [filterPriority,setFilterPriority]= useState("");
  const [showNew,       setShowNew]       = useState(false);
  const [selectedTicket,setSelectedTicket]= useState<Ticket | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);

  // ── Load data ──────────────────────────────────────────────────────────────
  const loadAll = useCallback(async () => {
    try {
      setLoading(true);
      const params: any = {};
      if (filterStatus)   params.status   = filterStatus;
      if (filterPriority) params.priority = filterPriority;
      if (search.trim())  params.search   = search.trim();

      const [tRes, sRes, cRes] = await Promise.all([
        api.get("/helpdesk/tickets",       { params }),
        api.get("/helpdesk/tickets/stats"),
        api.get("/helpdesk/categories"),
      ]);
      setTickets(tRes.data.data || []);
      setStats(sRes.data.data);
      setCategories(cRes.data.data || []);
    } catch (err) {
      console.error("Helpdesk load failed:", err);
    } finally {
      setLoading(false);
    }
  }, [filterStatus, filterPriority, search]);

  useEffect(() => { loadAll(); }, [loadAll]);

  // ── Open ticket detail ─────────────────────────────────────────────────────
  const openDetail = async (id: number) => {
    try {
      setDetailLoading(true);
      const res = await api.get(`/helpdesk/tickets/${id}`);
      setSelectedTicket(res.data.data);
    } finally {
      setDetailLoading(false);
    }
  };

  const refreshDetail = async () => {
    if (!selectedTicket) return;
    await Promise.all([openDetail(selectedTicket.id), loadAll()]);
  };

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div className="p-5 bg-gray-50 min-h-screen" style={{ animation: "fadeIn .3s ease" }}>
      <style>{`
        @keyframes fadeIn{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}
        .slide-in{animation:fadeIn .25s ease}
      `}</style>

      {/* ── Header ── */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-black text-gray-900">🛠️ IT Helpdesk</h1>
          <p className="text-sm text-gray-400 mt-0.5">Raise, track and resolve support tickets</p>
        </div>
        <button onClick={() => { setShowNew(true); setSelectedTicket(null); }}
          className="bg-indigo-600 text-white px-5 py-2.5 rounded-xl text-sm font-bold
                     hover:bg-indigo-700 transition shadow-sm flex items-center gap-2">
          <span className="text-base">🎫</span> New Ticket
        </button>
      </div>

      {/* ── Stat Cards ── */}
      {stats && (
        <div className="flex gap-3 mb-6 overflow-x-auto pb-1">
          <StatCard label="Total"       value={stats.total}       icon="📋" color="bg-indigo-50 text-indigo-700 border-indigo-300"
            onClick={() => setFilterStatus("")} active={!filterStatus} />
          <StatCard label="Open"        value={stats.open}        icon="🔓" color="bg-blue-50 text-blue-700 border-blue-300"
            onClick={() => setFilterStatus("Open")} active={filterStatus==="Open"} />
          <StatCard label="In Progress" value={stats.in_progress} icon="⚙️" color="bg-violet-50 text-violet-700 border-violet-300"
            onClick={() => setFilterStatus("In Progress")} active={filterStatus==="In Progress"} />
          <StatCard label="On Hold"     value={stats.on_hold}     icon="⏸️" color="bg-yellow-50 text-yellow-700 border-yellow-300"
            onClick={() => setFilterStatus("On Hold")} active={filterStatus==="On Hold"} />
          <StatCard label="Resolved"    value={stats.resolved}    icon="✅" color="bg-green-50 text-green-700 border-green-300"
            onClick={() => setFilterStatus("Resolved")} active={filterStatus==="Resolved"} />
          <StatCard label="Critical"    value={stats.critical}    icon="🔴" color="bg-red-50 text-red-700 border-red-300"
            onClick={() => setFilterPriority(filterPriority==="Critical" ? "" : "Critical")} active={filterPriority==="Critical"} />
          <StatCard label="Today"       value={stats.today}       icon="📅" color="bg-teal-50 text-teal-700 border-teal-300"
            onClick={() => {}} />
          {stats.overdue > 0 && (
            <StatCard label="Overdue" value={stats.overdue} icon="⚠️" color="bg-red-100 text-red-800 border-red-400"
              onClick={() => {}} />
          )}
        </div>
      )}

      {/* ── Main layout: list + detail/form ── */}
      <div className={`flex gap-4 ${selectedTicket || showNew ? "items-start" : ""}`}>

        {/* ── Ticket List ── */}
        <div className={`flex-1 min-w-0 transition-all ${selectedTicket || showNew ? "max-w-[55%]" : ""}`}>

          {/* Search + Filter bar */}
          <div className="flex gap-2 mb-4">
            <div className="relative flex-1">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">🔍</span>
              <input value={search} onChange={e => setSearch(e.target.value)}
                placeholder="Search tickets, names..."
                className="w-full pl-9 pr-3 py-2.5 border border-gray-200 rounded-xl text-sm
                           focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-white" />
            </div>
            <select value={filterPriority} onChange={e => setFilterPriority(e.target.value)}
              className="border border-gray-200 rounded-xl px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-400">
              <option value="">All Priority</option>
              <option value="Critical">🔴 Critical</option>
              <option value="High">🟠 High</option>
              <option value="Medium">🔵 Medium</option>
              <option value="Low">🟢 Low</option>
            </select>
            <button onClick={loadAll}
              className="border border-gray-200 rounded-xl px-3 py-2 text-sm bg-white hover:bg-gray-50 transition">
              🔄
            </button>
          </div>

          {/* List */}
          {loading ? (
            <div className="text-center py-16 text-gray-400 text-sm">⏳ Loading tickets...</div>
          ) : tickets.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-5xl mb-3">🎉</div>
              <p className="text-gray-500 font-semibold">No tickets found</p>
              <p className="text-gray-400 text-sm mt-1">Everything looks good!</p>
            </div>
          ) : (
            <div className="space-y-2">
              {tickets.map(t => {
                const sc = STATUS_CONFIG[t.status];
                const pc = PRIORITY_CONFIG[t.priority];
                const isSelected = selectedTicket?.id === t.id;
                return (
                  <div key={t.id} onClick={() => { openDetail(t.id); setShowNew(false); }}
                    className={`bg-white rounded-xl border-2 p-4 cursor-pointer transition-all hover:shadow-md
                                ${isSelected ? "border-indigo-400 shadow-md" : "border-gray-100 hover:border-gray-200"}`}>
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <span className="text-xs font-black text-indigo-600">{t.ticket_no}</span>
                          {t.category_icon && <span className="text-sm">{t.category_icon}</span>}
                          <span className={`text-xs px-2 py-0.5 rounded-full font-semibold border ${sc.bg} ${sc.color} ${sc.border}`}>
                            {t.status}
                          </span>
                          <span className={`text-xs px-2 py-0.5 rounded-full font-semibold flex items-center gap-1 ${pc.bg} ${pc.color}`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${pc.dot}`}></span>{t.priority}
                          </span>
                        </div>
                        <p className="font-semibold text-gray-800 text-sm truncate">{t.title}</p>
                        <p className="text-xs text-gray-400 mt-0.5">
                          {t.raised_by_name && `👤 ${t.raised_by_name}`}
                          {t.raised_by_dept && ` · ${t.raised_by_dept}`}
                          {t.location      && ` · 📍 ${t.location}`}
                        </p>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="text-xs text-gray-400">{fmtDate(t.created_at)}</p>
                        {t.assigned_to && (
                          <p className="text-xs text-indigo-500 font-semibold mt-1">👤 {t.assigned_to}</p>
                        )}
                        {t.due_date && new Date(t.due_date) < new Date() && !["Resolved","Closed","Cancelled"].includes(t.status) && (
                          <p className="text-xs text-red-500 font-semibold mt-1">⚠️ Overdue</p>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* ── Right Panel: Detail or New Form ── */}
        {(selectedTicket || showNew) && (
          <div className="w-[420px] flex-shrink-0 bg-white rounded-2xl border border-gray-100 shadow-sm p-5 sticky top-5 max-h-[85vh] overflow-y-auto slide-in">
            {detailLoading ? (
              <div className="flex items-center justify-center py-20 text-gray-400 text-sm">⏳ Loading...</div>
            ) : showNew ? (
              <NewTicketForm categories={categories} onCancel={() => setShowNew(false)} onCreated={() => { setShowNew(false); loadAll(); }} />
            ) : selectedTicket ? (
              <TicketDetail ticket={selectedTicket} onClose={() => setSelectedTicket(null)} onRefresh={refreshDetail} />
            ) : null}
          </div>
        )}
      </div>
    </div>
  );
};

export default HelpdeskPage;