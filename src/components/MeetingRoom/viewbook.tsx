import { useState } from "react";

interface Appointment {
  id: string;
  dateTime: string;
  doctor: { name: string; specialty: string; avatar: string };
  mode: string;
  status: "Checked Out" | "Checked In" | "Cancelled" | "Scheduled";
}

const DATA: Appointment[] = [
  {
    id: "1",
    dateTime: "4/30/2025, 9:30:00 AM",
    doctor: { name: "Dr. Mick Thompson", specialty: "Cardiologist", avatar: "MT" },
    mode: "In-person",
    status: "Checked Out",
  },
  {
    id: "2",
    dateTime: "4/15/2025, 11:20:00 AM",
    doctor: { name: "Dr. Sarah Johnson", specialty: "Orthopedic Surgeon", avatar: "SJ" },
    mode: "Online",
    status: "Checked In",
  },
  {
    id: "3",
    dateTime: "4/2/2025, 8:15:00 AM",
    doctor: { name: "Dr. Emily Carter", specialty: "Pediatrician", avatar: "EC" },
    mode: "In-Person",
    status: "Cancelled",
  },
  {
    id: "4",
    dateTime: "5/5/2025, 2:00:00 PM",
    doctor: { name: "Dr. Priya Nair", specialty: "Neurologist", avatar: "PN" },
    mode: "Online",
    status: "Scheduled",
  },
  {
    id: "5",
    dateTime: "5/10/2025, 10:45:00 AM",
    doctor: { name: "Dr. Carlos Reyes", specialty: "Dermatologist", avatar: "CR" },
    mode: "In-Person",
    status: "Scheduled",
  },
];

const STATUS_STYLES: Record<string, string> = {
  "Checked Out": "bg-blue-100 text-blue-500",
  "Checked In":  "bg-yellow-100 text-yellow-600",
  "Cancelled":   "bg-rose-100 text-rose-500",
  "Scheduled":   "bg-emerald-100 text-emerald-600",
};

const AVATAR_COLORS = [
  "bg-indigo-100 text-indigo-500",
  "bg-violet-100 text-violet-500",
  "bg-rose-100 text-rose-500",
  "bg-amber-100 text-amber-500",
  "bg-teal-100 text-teal-500",
];

function Avatar({ initials, idx }: { initials: string; idx: number }) {
  return (
    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${AVATAR_COLORS[idx % AVATAR_COLORS.length]}`}>
      {initials}
    </div>
  );
}

export default function Viewbook() {
  const [rows, setRows] = useState<Appointment[]>(DATA);

  const handleDelete = (id: string) => {
    setRows((prev) => prev.filter((r) => r.id !== id));
  };

  return (
    <div className="min-h-screen bg-slate-100 p-6">
      <div className="w-full bg-white rounded-2xl shadow-sm overflow-hidden border border-slate-200">

        {/* Table Header */}
        <div className="grid grid-cols-[200px_1fr_450px_130px] bg-slate-50 border-b border-slate-200 px-6 py-3">
          {["Date & Time", "Doctor", "Status", "Actions"].map((h) => (
            <div key={h} className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              {h}
            </div>
          ))}
        </div>

        {/* Rows */}
        <div className="divide-y divide-slate-100">
          {rows.map((row, i) => (
            <div
              key={row.id}
              className="grid grid-cols-[200px_1fr_450px_130px] items-center px-6 py-4 hover:bg-slate-50 transition-all"
            >
                  {/* Actions */}
              <div className="flex items-center gap-2">
                {/* View */}
                <button
                  title="View"
                  className="w-9 h-9 rounded-xl bg-emerald-500 hover:bg-emerald-600 active:scale-95 transition-all flex items-center justify-center shadow-sm"
                >
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </button>

                {/* Edit */}
                <button
                  title="Edit"
                  className="w-9 h-9 rounded-xl bg-blue-500 hover:bg-blue-600 active:scale-95 transition-all flex items-center justify-center shadow-sm"
                >
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </button>

                {/* Delete */}
                <button
                  title="Delete"
                  onClick={() => handleDelete(row.id)}
                  className="w-9 h-9 rounded-xl bg-rose-500 hover:bg-rose-600 active:scale-95 transition-all flex items-center justify-center shadow-sm"
                >
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
              {/* Date & Time */}
              <div className="text-sm text-slate-600 font-medium">{row.dateTime}</div>

              {/* Doctor */}
              <div className="flex items-center gap-3">
                <Avatar initials={row.doctor.avatar} idx={i + 2} />
                <div>
                  <p className="text-sm font-semibold text-slate-800">{row.doctor.name}</p>
                  <p className="text-xs text-slate-400">{row.doctor.specialty}</p>
                </div>
              </div>

              {/* Status */}
              <div>
                <span className={`text-xs font-semibold px-4 py-1.5 rounded-full ${STATUS_STYLES[row.status]}`}>
                  {row.status}
                </span>
              </div>

            

            </div>
          ))}
        </div>

      </div>
    </div>
  );
}