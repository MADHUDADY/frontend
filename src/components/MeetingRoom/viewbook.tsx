import { useState, useEffect } from "react";
import axios from "axios";

const API = "http://localhost:5000/api";

const STATUS_STYLES: Record<string, string> = {
  "Waiting":   "bg-yellow-100 text-yellow-600",
  "Called":    "bg-blue-100 text-blue-600",
  "Completed": "bg-emerald-100 text-emerald-600",
};

const AVATAR_COLORS = [
  "bg-indigo-100 text-indigo-500",
  "bg-violet-100 text-violet-500",
  "bg-teal-100 text-teal-500",
  "bg-amber-100 text-amber-500",
  "bg-rose-100 text-rose-500",
];

function Avatar({ name, idx }: { name: string; idx: number }) {
  const initials = (name || "DR").replace(/Dr\.?\s*/i,"").split(" ").filter(Boolean).map((n:string)=>n[0]).slice(0,2).join("").toUpperCase();
  return (
    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${AVATAR_COLORS[idx % AVATAR_COLORS.length]}`}>
      {initials}
    </div>
  );
}

export default function Viewbook() {
  const [rows,    setRows]    = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState("");
  const [search,  setSearch]  = useState("");

  useEffect(() => { fetchBookings(); }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true); setError("");
      // Get all appointments (type A = appointment/booking)
      const res = await axios.get(`${API}/appointments`);
      const all = res.data.data || [];
      // Filter type A (Appointment/Meeting bookings)
      const bookings = all.filter((r: any) => r.TYPE === "A" || !r.TYPE || r.TYPE === "D");
      setRows(bookings);
    } catch (err: any) {
      setError("Failed to load bookings: " + (err?.response?.data?.message || err.message));
    } finally { setLoading(false); }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Delete this booking?")) return;
    try {
      await axios.delete(`${API}/appointments/${id}`);
      setRows(prev => prev.filter(r => r.SLNO !== id));
    } catch (err: any) {
      alert("Delete failed: " + (err?.response?.data?.message || err.message));
    }
  };

  const getStatus = (row: any) => {
    if (row.STATUSCALLDISPLAYALL === 1) return "Called";
    if (row.STATUSSCREENDISPLAYALL === 0) return "Completed";
    return "Waiting";
  };

  const filtered = rows.filter(r =>
    (r.TICKETNUMBER   || "").toLowerCase().includes(search.toLowerCase()) ||
    (r.DoctorName     || "").toLowerCase().includes(search.toLowerCase()) ||
    (r.COUNTERID      || "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-100 p-6">

      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="text-xl font-bold text-slate-800">Meeting Room Bookings</h1>
          <p className="text-sm text-slate-500">From database (callhistory table)</p>
        </div>
        <button onClick={fetchBookings}
          className="flex items-center gap-2 px-4 py-2 border border-slate-200 bg-white rounded-xl text-sm text-slate-600 hover:bg-slate-50">
          🔄 Refresh
        </button>
      </div>

      {/* Search */}
      <div className="mb-4">
        <input type="text" placeholder="Search by ticket, doctor..."
          value={search} onChange={e => setSearch(e.target.value)}
          className="px-4 py-2 border border-slate-200 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-400 w-64"/>
      </div>

      {/* Loading */}
      {loading && <div className="text-center py-16 text-slate-400">⏳ Loading bookings from database...</div>}

      {/* Error */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl text-sm mb-4">
          ❌ {error}
          <button onClick={fetchBookings} className="ml-3 bg-red-600 text-white px-3 py-1 rounded-lg text-xs">Retry</button>
        </div>
      )}

      {/* Table */}
      {!loading && !error && (
        <div className="w-full bg-white rounded-2xl shadow-sm overflow-hidden border border-slate-200">

          {/* Header */}
          <div className="bg-slate-50 border-b border-slate-200 px-6 py-3 grid grid-cols-[140px_1fr_160px_120px_120px]">
            {["Ticket No","Doctor","Date & Time","Counter","Actions"].map(h => (
              <div key={h} className="text-xs font-bold text-slate-500 uppercase tracking-wider">{h}</div>
            ))}
          </div>

          {/* Rows */}
          <div className="divide-y divide-slate-100">
            {filtered.length === 0 ? (
              <div className="text-center py-16 text-slate-400">
                {rows.length === 0 ? "No bookings found in database" : "No matches found"}
              </div>
            ) : (
              filtered.map((row, i) => {
                const status = getStatus(row);
                const date   = row.TOKENDATE ? new Date(row.TOKENDATE).toLocaleString() : "—";
                return (
                  <div key={row.SLNO}
                    className="grid grid-cols-[140px_1fr_160px_120px_120px] items-center px-6 py-4 hover:bg-slate-50 transition-all">

                    {/* Ticket */}
                    <div>
                      <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded-lg">
                        {row.TICKETNUMBER}
                      </span>
                      <div className={`mt-1 text-xs font-semibold px-2 py-0.5 rounded-full inline-block ${STATUS_STYLES[status] || "bg-gray-100 text-gray-600"}`}>
                        {status}
                      </div>
                    </div>

                    {/* Doctor */}
                    <div className="flex items-center gap-3">
                      <Avatar name={row.DoctorName || "DR"} idx={i} />
                      <div>
                        <p className="text-sm font-semibold text-slate-800">{row.DoctorName || `Service #${row.SERVICEID}`}</p>
                        <p className="text-xs text-slate-400">Zone {row.ZONE} · Type {row.TYPE}</p>
                      </div>
                    </div>

                    {/* Date */}
                    <div className="text-sm text-slate-600">{date}</div>

                    {/* Counter */}
                    <div className="text-sm text-slate-500">Counter {row.COUNTERID}</div>

                    {/* Actions */}
                    <div className="flex gap-2">
                      <button onClick={() => handleDelete(row.SLNO)}
                        className="w-8 h-8 rounded-xl bg-rose-500 hover:bg-rose-600 text-white flex items-center justify-center text-sm transition-all"
                        title="Delete">
                        🗑
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer */}
          <div className="px-6 py-3 border-t border-slate-100 bg-slate-50">
            <p className="text-xs text-slate-400">
              Total: <strong className="text-slate-600">{rows.length}</strong> bookings in database
              {search && ` · Showing ${filtered.length} matches`}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}