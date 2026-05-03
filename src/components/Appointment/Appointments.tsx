import React, { useState, useEffect } from "react";
import { CalendarDays, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { appointmentAPI } from "../../services/api";

const statusStyles: Record<string, string> = {
  "Checked Out": "bg-blue-100 text-blue-600",
  "Checked In":  "bg-yellow-100 text-yellow-600",
  "Cancelled":   "bg-red-100 text-red-600",
  "Schedule":    "bg-indigo-100 text-indigo-600",
  "Confirmed":   "bg-green-100 text-green-600",
};

const AppointmentPage: React.FC = () => {
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState<any[]>([]);
  const [search,     setSearch]     = useState("");
  const [loading,    setLoading]    = useState(true);
  const [error,      setError]      = useState("");
  const [startDate,  setStartDate]  = useState("");
  const [endDate,    setEndDate]    = useState("");

  useEffect(() => { fetchAppointments(); }, []);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const res = await appointmentAPI.getAll();
      setAppointments(res.data.data || []);
    } catch {
      setError("Failed to load appointments. Is backend running?");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Delete this appointment?")) return;
    try {
      await appointmentAPI.delete(id);
      setAppointments(appointments.filter((a) => a.SLNO !== id));
    } catch {
      alert("Delete failed!");
    }
  };

  const filtered = appointments.filter((a) => {
    const ticket  = (a.TICKETNUMBER  || "").toLowerCase();
    const doctor  = (a.DoctorName    || "").toLowerCase();
    const patient = (a.PATIENTNAME   || "").toLowerCase();
    const phone   = (a.PHONE         || "").toLowerCase();
    const q       = search.toLowerCase();

    const matchSearch = ticket.includes(q) || doctor.includes(q) ||
                        patient.includes(q) || phone.includes(q);

    const apptDate  = a.TOKENDATE ? new Date(a.TOKENDATE) : null;
    const matchStart = !startDate || (apptDate && apptDate >= new Date(startDate));
    const matchEnd   = !endDate   || (apptDate && apptDate <= new Date(endDate));

    return matchSearch && matchStart && matchEnd;
  });

  return (
    <div className="p-6 bg-gray-50 min-h-screen">

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">Appointments</h1>
        <button
          onClick={() => navigate("/dashboard/NewAppointments")}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg">
          <Plus size={16} /> New Appointment
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-6">
        <input type="text" placeholder="Search ticket, doctor, patient or phone..."
          value={search} onChange={(e) => setSearch(e.target.value)}
          className="px-4 py-2 border rounded-lg w-72 focus:ring-2 focus:ring-indigo-500" />

        <div className="flex items-center gap-2 border px-3 py-2 rounded-lg bg-white">
          <CalendarDays size={16} />
          <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)}
            className="outline-none text-sm" />
        </div>

        <div className="flex items-center gap-2 border px-3 py-2 rounded-lg bg-white">
          <CalendarDays size={16} />
          <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)}
            className="outline-none text-sm" />
        </div>
      </div>

      {loading && <p className="text-center py-10 text-gray-500">Loading appointments...</p>}
      {error   && <p className="text-center py-4 text-red-500">{error}</p>}

      {!loading && !error && (
        <div className="bg-white rounded-xl shadow-sm overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-100 text-gray-600 text-sm">
              <tr>
                <th className="px-6 py-4">Ticket No</th>
                <th className="px-6 py-4">Date & Time</th>
                <th className="px-6 py-4">Patient</th>      {/* ← NEW column */}
                <th className="px-6 py-4">Doctor</th>
                <th className="px-6 py-4">Counter</th>
                <th className="px-6 py-4">Zone</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((item) => (
                <tr key={item.SLNO} className="border-t hover:bg-gray-50">
                  <td className="px-6 py-4 font-semibold text-indigo-600">{item.TICKETNUMBER}</td>
                  <td className="px-6 py-4 text-sm">
                    {item.TOKENDATE ? new Date(item.TOKENDATE).toLocaleString() : "-"}
                  </td>

                  {/* Patient Name + Phone — from DB */}
                  <td className="px-6 py-4">
                    <p className="font-medium text-sm">{item.PATIENTNAME || "—"}</p>
                    {item.PHONE && (
                      <p className="text-xs text-gray-400">{item.PHONE}</p>
                    )}
                  </td>

                  <td className="px-6 py-4">
                    <p className="font-medium text-sm">{item.DoctorName || "-"}</p>
                    <p className="text-xs text-gray-500">Service ID: {item.SERVICEID}</p>
                  </td>
                  <td className="px-6 py-4 text-sm">{item.COUNTERID}</td>
                  <td className="px-6 py-4 text-sm">{item.ZONE}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      item.STATUSCALLDISPLAYALL === 0
                        ? statusStyles["Schedule"]
                        : statusStyles["Checked In"]
                    }`}>
                      {item.STATUSCALLDISPLAYALL === 0 ? "Waiting" : "Called"}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <button onClick={() => handleDelete(item.SLNO)}
                      className="text-red-500 hover:text-red-700 text-sm font-medium">
                      Delete
                    </button>
                  </td>
                </tr>
              ))}

              {filtered.length === 0 && (
                <tr>
                  <td colSpan={8} className="text-center py-6 text-gray-500">
                    No appointments found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AppointmentPage;