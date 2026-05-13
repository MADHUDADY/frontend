import React, { useState, useEffect, useCallback } from "react";
import { CalendarDays, Plus, RefreshCw, Monitor } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { appointmentAPI } from "../../services/api";

const AppointmentPage: React.FC = () => {
  const navigate = useNavigate();
  const [tab,          setTab]          = useState<"queue"|"all">("queue");
  const [appointments, setAppointments] = useState<any[]>([]);
  const [todayTokens,  setTodayTokens]  = useState<any[]>([]);
  const [search,       setSearch]       = useState("");
  const [loading,      setLoading]      = useState(true);
  const [error,        setError]        = useState("");
  const [startDate,    setStartDate]    = useState("");
  const [endDate,      setEndDate]      = useState("");
  const [lastRefresh,  setLastRefresh]  = useState("");

  const fetchAll = useCallback(async () => {
    try {
      setLoading(true); setError("");
      const [allRes, todayRes] = await Promise.all([
        appointmentAPI.getAll(),
        appointmentAPI.getToday(),
      ]);
      setAppointments(allRes.data.data   || []);
      setTodayTokens(todayRes.data.data  || []);
      setLastRefresh(new Date().toLocaleTimeString());
    } catch {
      setError("Failed to load. Is backend running?");
    } finally { setLoading(false); }
  }, []);

  useEffect(() => {
    fetchAll();
    // Auto-refresh every 10 seconds for queue
    const id = setInterval(fetchAll, 10000);
    return () => clearInterval(id);
  }, [fetchAll]);

  const handleDelete = async (id: number) => {
    if (!window.confirm("Delete this token?")) return;
    try {
      await appointmentAPI.delete(id);
      setAppointments(prev => prev.filter(a => a.SLNO !== id));
      setTodayTokens(prev  => prev.filter(a => a.SLNO !== id));
    } catch { alert("Delete failed!"); }
  };

  const filtered = appointments.filter(a => {
    const q = search.toLowerCase();
    const match = [a.TICKETNUMBER, a.DoctorName, a.PATIENTNAME, a.PHONE]
      .some(v => (v||"").toLowerCase().includes(q));
    const d = a.TOKENDATE ? new Date(a.TOKENDATE) : null;
    return match
      && (!startDate || (d && d >= new Date(startDate)))
      && (!endDate   || (d && d <= new Date(endDate)));
  });

  const waiting  = todayTokens.filter(t => t.STATUSCALLDISPLAYALL === 0);
  const called   = todayTokens.filter(t => t.STATUSCALLDISPLAYALL === 1);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold">Appointments & Queue</h1>
          {lastRefresh && <p className="text-xs text-gray-400 mt-0.5">🟢 Live · refreshed at {lastRefresh}</p>}
        </div>
        <div className="flex gap-2">
          <button onClick={fetchAll}
            className="flex items-center gap-2 px-3 py-2 border rounded-lg text-gray-600 hover:bg-gray-100 text-sm">
            <RefreshCw size={14} /> Refresh
          </button>
          <button onClick={() => navigate("/dashboard/NewAppointments")}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm">
            <Plus size={16} /> New Appointment
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        <button onClick={() => setTab("queue")}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition ${
            tab === "queue" ? "bg-indigo-600 text-white" : "bg-white border text-gray-600 hover:bg-gray-50"
          }`}>
          <Monitor size={15} /> Today's Queue
          <span className={`ml-1 px-2 py-0.5 rounded-full text-xs font-bold ${
            tab==="queue" ? "bg-white text-indigo-600" : "bg-indigo-100 text-indigo-600"
          }`}>{todayTokens.length}</span>
        </button>
        <button onClick={() => setTab("all")}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition ${
            tab === "all" ? "bg-indigo-600 text-white" : "bg-white border text-gray-600 hover:bg-gray-50"
          }`}>
          <CalendarDays size={15} /> All Appointments
        </button>
      </div>

      {loading && <p className="text-center py-10 text-gray-500">⏳ Loading...</p>}
      {error   && <p className="text-center py-4 text-red-500">{error}</p>}

      {/* ── TODAY'S QUEUE ── */}
      {!loading && !error && tab === "queue" && (
        <div>
          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            {[
              { label:"Total Today", value:todayTokens.length, color:"bg-indigo-50 border-indigo-200 text-indigo-700" },
              { label:"Waiting",     value:waiting.length,     color:"bg-yellow-50 border-yellow-200 text-yellow-700" },
              { label:"Called",      value:called.length,      color:"bg-green-50 border-green-200 text-green-700" },
            ].map(s => (
              <div key={s.label} className={`border rounded-xl p-4 text-center ${s.color}`}>
                <p className="text-3xl font-black">{s.value}</p>
                <p className="text-sm font-semibold mt-1">{s.label}</p>
              </div>
            ))}
          </div>

          {/* Waiting tokens — reception calls patient from here */}
          <div className="mb-6">
            <h2 className="text-lg font-bold text-gray-800 mb-3">⏳ Waiting</h2>
            {waiting.length === 0 ? (
              <div className="bg-white rounded-xl p-8 text-center text-gray-400 border">
                No patients waiting
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {waiting.map(t => (
                  <div key={t.SLNO} className="bg-white border-2 border-yellow-200 rounded-xl p-4 text-center hover:border-yellow-400 transition">
                    <div className="text-3xl font-black text-yellow-600 mb-1">{t.TICKETNUMBER}</div>
                    {t.PATIENTNAME && <p className="text-xs font-semibold text-gray-700 truncate">{t.PATIENTNAME}</p>}
                    {t.DoctorName  && <p className="text-xs text-gray-400 truncate">{t.DoctorName}</p>}
                    <p className="text-xs text-gray-400 mt-1">
                      {t.TOKENDATE ? new Date(t.TOKENDATE).toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"}) : ""}
                    </p>
                    <span className="inline-block mt-2 px-2 py-0.5 bg-yellow-100 text-yellow-700 text-xs font-bold rounded-full">Waiting</span>
                    <button
                      onClick={async () => {
                        try {
                          await appointmentAPI.updateStatus(t.SLNO, { STATUSCALLDISPLAYALL: 1, STATUSSCREENDISPLAYALL: 1 });
                          fetchAll();
                        } catch { alert("Failed to call patient"); }
                      }}
                      className="mt-2 w-full py-1.5 bg-green-600 hover:bg-green-700 text-white text-xs font-bold rounded-lg transition">
                      📢 Call Patient
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Called tokens */}
          <div>
            <h2 className="text-lg font-bold text-gray-800 mb-3">✅ Called</h2>
            {called.length === 0 ? (
              <div className="bg-white rounded-xl p-6 text-center text-gray-400 border">No tokens called yet</div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {called.map(t => (
                  <div key={t.SLNO} className="bg-white border-2 border-green-200 rounded-xl p-4 text-center opacity-70">
                    <div className="text-3xl font-black text-green-600 mb-1">{t.TICKETNUMBER}</div>
                    {t.PATIENTNAME && <p className="text-xs font-semibold text-gray-700 truncate">{t.PATIENTNAME}</p>}
                    {t.DoctorName  && <p className="text-xs text-gray-400 truncate">{t.DoctorName}</p>}
                    <span className="inline-block mt-2 px-2 py-0.5 bg-green-100 text-green-700 text-xs font-bold rounded-full">Called</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── ALL APPOINTMENTS ── */}
      {!loading && !error && tab === "all" && (
        <>
          <div className="flex flex-wrap gap-4 mb-4">
            <input type="text" placeholder="Search ticket, doctor, patient..."
              value={search} onChange={e => setSearch(e.target.value)}
              className="px-4 py-2 border rounded-lg w-72 focus:ring-2 focus:ring-indigo-500 text-sm" />
            <div className="flex items-center gap-2 border px-3 py-2 rounded-lg bg-white">
              <CalendarDays size={16} />
              <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} className="outline-none text-sm" />
            </div>
            <div className="flex items-center gap-2 border px-3 py-2 rounded-lg bg-white">
              <CalendarDays size={16} />
              <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} className="outline-none text-sm" />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-100 text-gray-600 text-sm">
                <tr>
                  <th className="px-6 py-4">Ticket No</th>
                  <th className="px-6 py-4">Date & Time</th>
                  <th className="px-6 py-4">Patient</th>
                  <th className="px-6 py-4">Doctor</th>
                  <th className="px-6 py-4">Counter</th>
                  <th className="px-6 py-4">Zone</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(item => (
                  <tr key={item.SLNO} className="border-t hover:bg-gray-50">
                    <td className="px-6 py-4 font-semibold text-indigo-600">{item.TICKETNUMBER}</td>
                    <td className="px-6 py-4 text-sm">{item.TOKENDATE ? new Date(item.TOKENDATE).toLocaleString() : "-"}</td>
                    <td className="px-6 py-4">
                      <p className="font-medium text-sm">{item.PATIENTNAME || "—"}</p>
                      {item.PHONE && <p className="text-xs text-gray-400">{item.PHONE}</p>}
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-medium text-sm">{item.DoctorName || "-"}</p>
                      <p className="text-xs text-gray-500">ID: {item.SERVICEID}</p>
                    </td>
                    <td className="px-6 py-4 text-sm">{item.COUNTERID}</td>
                    <td className="px-6 py-4 text-sm">{item.ZONE}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        item.STATUSCALLDISPLAYALL === 0
                          ? "bg-yellow-100 text-yellow-600"
                          : "bg-green-100 text-green-600"
                      }`}>
                        {item.STATUSCALLDISPLAYALL === 0 ? "Waiting" : "Called"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <button onClick={() => handleDelete(item.SLNO)}
                        className="text-red-500 hover:text-red-700 text-sm font-medium">Delete</button>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr><td colSpan={8} className="text-center py-6 text-gray-500">No appointments found</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
};

export default AppointmentPage;