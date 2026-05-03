// #D3AF37
import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell,
} from "recharts";

const API = "http://localhost:5000/api";

// ─── status helper ────────────────────────────────────────────────────────────
function getStatus(row: any): "Waiting" | "Called" | "Completed" {
  if (row.STATUSCALLDISPLAYALL === 1) return "Called";
  if (row.STATUSSCREENDISPLAYALL === 0) return "Completed";
  return "Waiting";
}

// ─── EXACT same static helpers as original ────────────────────────────────────
const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

const deptPieData = [
  { name: "Cardiology", value: 45, color: "#8B5CF6" },
  { name: "Orthopedics", value: 35, color: "#6366F1" },
  { name: "Pediatrics",  value: 20, color: "#93C5FD" },
];

const COLORS = ["#8B5CF6","#6366F1","#93C5FD"];

const DAYS = ["Su","Mo","Tu","We","Th","Fr","Sa"];
const calendarRows = [
  [1,  2,  3,  4,  5,  6,  7],
  [8,  9,  10, 11, 12, 13, 14],
  [15, 16, 17, 18, 19, 20, 21],
  [22, 23, 24, 25, 26, 27, 28],
  [29, 30, 31, null, null, null, null],
];

// ─── EXACT same Micro Components as original ──────────────────────────────────
const SparkBar = ({ color }: { color: string }) => {
  const bars = [3, 5, 4, 7, 5, 8, 6];
  return (
    <div className="flex items-end gap-[2px] h-10 flex-shrink-0">
      {bars.map((v, i) => (
        <div key={i} className="w-[6px] rounded-sm" style={{ height: `${(v / 8) * 100}%`, backgroundColor: color }} />
      ))}
    </div>
  );
};

const SparkLine = ({ color }: { color: string }) => {
  const pts = [3,5,4,8,5,7,6,9];
  const points = pts.map((v,i) => `${(i/7)*80},${40-((v-3)/6)*36}`).join(" ");
  return (
    <svg width={80} height={40} className="flex-shrink-0">
      <polyline fill="none" stroke={color} strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" points={points} />
    </svg>
  );
};

const Av = ({ i, c, sm }: { i: string; c: string; sm?: boolean }) => (
  <div className={`rounded-full flex items-center justify-center text-white font-bold flex-shrink-0 ${sm ? "w-8 h-8 text-xs" : "w-10 h-10 text-sm"}`}
    style={{ backgroundColor: c }}>
    {i}
  </div>
);

// ─── EXACT same Stat Card as original ────────────────────────────────────────
type MetricCardProps = {
  icon: React.ReactNode;
  title: string;
  amount: string;
  color: string;
};

const StatCard = ({ icon, label, value, change, bar, color, bg }: {
  icon: string; label: string; value: string; change: number; bar: boolean; color: string; bg: string;
}) => (
  <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex flex-col gap-2.5 min-w-0 overflow-hidden">
    <div className="flex items-start justify-between">
      <div className="w-12 h-12 rounded-full flex items-center justify-center text-2xl flex-shrink-0" style={{ backgroundColor: bg }}>
        {icon}
      </div>
      <span className={`text-xs font-bold px-2 py-0.5 rounded-full flex-shrink-0 ${change >= 0 ? "bg-green-100 text-green-600" : "bg-red-100 text-red-500"}`}>
        {change >= 0 ? "+" : ""}{change}%
      </span>
    </div>
    <div className="min-w-0">
      <p className="text-sm text-gray-500">{label}</p>
      <p className="text-xl font-extrabold text-gray-800 truncate">{value}</p>
    </div>
    <div className="flex items-end justify-between gap-2">
      <span className="text-xs text-gray-400 leading-snug">in last<br />7 Days</span>
      {bar ? <SparkBar color={color} /> : <SparkLine color={color} />}
    </div>
  </div>
);

// ─── MAIN DASHBOARD ───────────────────────────────────────────────────────────
export default function AdminDashboard() {
  const navigate = useNavigate();
  const [sel, setSel] = useState(3);

  // ── real data state ──
  const [totalDoctors,    setTotalDoctors]    = useState(247);
  const [totalPatients,   setTotalPatients]   = useState(4178);
  const [todayTickets,    setTodayTickets]    = useState(0);
  const [completedToday,  setCompletedToday]  = useState(0);
  const [waitingNow,      setWaitingNow]      = useState(0);
  const [barData,         setBarData]         = useState<any[]>([]);
  const [popularDoctors,  setPopularDoctors]  = useState<any[]>([]);
  const [scheduleDoctors, setScheduleDoctors] = useState<any[]>([]);
  const [apptList,        setApptList]        = useState<any[]>([]);
  const [lastSync,        setLastSync]        = useState("");

  // ── fetch real data ──
  const fetchData = useCallback(async () => {
    try {
      const [apptRes, docRes, patRes, todayRes] = await Promise.allSettled([
        axios.get(`${API}/appointments`),
        axios.get(`${API}/doctors`),
        axios.get(`${API}/patients`),
        axios.get(`${API}/appointments/today`),
      ]);

      // doctors
      if (docRes.status === "fulfilled") {
        const docs: any[] = docRes.value.data.data || [];
        if (docs.length) setTotalDoctors(docs.length);

        const AVCOLS = ["#6366F1","#06B6D4","#8B5CF6","#F59E0B","#10B981"];
        const mkInit = (name: string) =>
          (name || "DR").replace(/Dr\.?\s*/i, "").split(" ")
            .filter(Boolean).map((n: string) => n[0]).slice(0, 2).join("").toUpperCase() || "DR";

        if (docs.length >= 3) {
          setPopularDoctors(docs.slice(0, 3).map((d, i) => ({
            name:     d.SERVICE_E,
            specialty:`Zone ${d.ZONE}`,
            bookings: [258, 125, 115][i] ?? 100,
            initials: mkInit(d.SERVICE_E),
            color:    AVCOLS[i % AVCOLS.length],
            online:   i < 2,
          })));
          setScheduleDoctors(docs.slice(3, 6).map((d, i) => ({
            name:     d.SERVICE_E,
            specialty:`Zone ${d.ZONE}`,
            initials: mkInit(d.SERVICE_E),
            color:    AVCOLS[(i + 2) % AVCOLS.length],
          })));
        }
      }

      // patients
      if (patRes.status === "fulfilled") {
        const p = (patRes.value.data.data || []).length;
        if (p) setTotalPatients(p);
      }

      // today tickets
      if (todayRes.status === "fulfilled") {
        const todayData: any[] = todayRes.value.data.data || [];
        setTodayTickets(todayData.length);
        setCompletedToday(todayData.filter(r => getStatus(r) === "Completed").length);
        setWaitingNow(todayData.filter(r => getStatus(r) === "Waiting").length);

        const APPT_BG  = ["#FFF0F5","#EEF2FF","#FFF0F5"];
        const APPT_CLR = ["#F472B6","#6366F1","#F472B6"];
        setApptList(todayData.slice(0, 3).map((a: any, i: number) => ({
          type:     "General Visit",
          date:     a.TOKENDATE ? new Date(a.TOKENDATE).toLocaleString() : "—",
          bg:       APPT_BG[i % APPT_BG.length],
          initials: (a.TICKETNUMBER || "PT").substring(0, 2).toUpperCase(),
          ac:       APPT_CLR[i % APPT_CLR.length],
        })));
      }

      // all appointments → monthly bar
      if (apptRes.status === "fulfilled") {
        const all: any[] = apptRes.value.data.data || [];
        const map: Record<number, { completed: number; ongoing: number; rescheduled: number }> = {};
        for (let m = 0; m < 12; m++) map[m] = { completed: 0, ongoing: 0, rescheduled: 0 };
        all.forEach(a => {
          const m  = a.TOKENDATE ? new Date(a.TOKENDATE).getMonth() : 0;
          const st = getStatus(a);
          if (st === "Completed") map[m].completed++;
          else if (st === "Called") map[m].ongoing++;
          else map[m].rescheduled++;
        });
        // if no real data keep original-looking fallback
        const generated = MONTHS.map((month, m) => ({ month, ...map[m] }));
        const hasData = all.length > 0;
        setBarData(hasData ? generated : [
          { month:"Jan", completed:1100, ongoing:600, rescheduled:300 },
          { month:"Feb", completed:1300, ongoing:700, rescheduled:600 },
          { month:"Mar", completed:1800, ongoing:900, rescheduled:500 },
          { month:"Apr", completed:2000, ongoing:800, rescheduled:400 },
          { month:"May", completed:2500, ongoing:1200, rescheduled:700 },
          { month:"Jun", completed:900,  ongoing:500, rescheduled:300 },
          { month:"Jul", completed:1200, ongoing:400, rescheduled:200 },
          { month:"Aug", completed:1600, ongoing:700, rescheduled:600 },
          { month:"Sep", completed:2400, ongoing:1100, rescheduled:800 },
          { month:"Oct", completed:2200, ongoing:1000, rescheduled:750 },
          { month:"Nov", completed:1500, ongoing:900, rescheduled:600 },
          { month:"Dec", completed:1400, ongoing:800, rescheduled:500 },
        ]);
      }

      setLastSync(new Date().toLocaleTimeString());
    } catch (e) {
      console.error("dashboard fetch:", e);
    }
  }, []);

  useEffect(() => {
    fetchData();
    const id = setInterval(fetchData, 10000);
    return () => clearInterval(id);
  }, [fetchData]);

  // ── derived ──
  const allCompleted   = barData.reduce((s,d) => s + d.completed,   0);
  const allOngoing     = barData.reduce((s,d) => s + d.ongoing,     0);
  const allRescheduled = barData.reduce((s,d) => s + d.rescheduled, 0);
  const allTickets     = allCompleted + allOngoing + allRescheduled;

  // fallback display doctors (same as original sample)
  const displayPopular = popularDoctors.length ? popularDoctors : [
    { name:"Dr. Alex Morgan",  specialty:"Cardiologist",  bookings:258, initials:"AM", color:"#6366F1", online:true  },
    { name:"Dr. Emily Carter", specialty:"Pediatrician",  bookings:125, initials:"EC", color:"#06B6D4", online:true  },
    { name:"Dr. David Lee",    specialty:"Gynecologist",  bookings:115, initials:"DL", color:"#8B5CF6", online:false },
  ];
  const displaySchedule = scheduleDoctors.length ? scheduleDoctors : [
    { name:"Dr. Sarah Johnson", specialty:"Orthopedic Surgeon", initials:"SJ", color:"#6366F1" },
    { name:"Dr. Emily Carter",  specialty:"Pediatrician",       initials:"EC", color:"#06B6D4" },
    { name:"Dr. David Lee",     specialty:"Gynecologist",       initials:"DL", color:"#8B5CF6" },
  ];
  const displayAppts = apptList.length ? apptList : [
    { type:"General Visit", date:"Wed, 05 Apr 2025, 06:30 PM", bg:"#FFF0F5", initials:"PT", ac:"#F472B6" },
    { type:"General Visit", date:"Wed, 05 Apr 2025, 04:10 PM", bg:"#EEF2FF", initials:"DR", ac:"#6366F1" },
    { type:"General Visit", date:"Wed, 05 Apr 2025, 10:00 AM", bg:"#FFF0F5", initials:"PT", ac:"#F472B6" },
  ];

  const treatments = [
    { name:"Cardiology",     appointments:4556, income:"$5,985" },
    { name:"Radiology",      appointments:4125, income:"$5,194" },
    { name:"Dental Surgery", appointments:1796, income:"$2,716" },
    { name:"Orthopaedics",   appointments:3827, income:"$4,682" },
  ];

  // ─── RENDER — 100% same layout/colors as original ────────────────────────
  return (
    <div className="min-h-screen w-full bg-slate-100 p-4 md:p-6 space-y-4 font-sans">

      {/* Header — same as original + live badge */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900">Admin Dashboard</h1>
          {lastSync && (
            <p className="text-xs text-gray-400 mt-0.5">
              🟢 Live · synced at <span className="text-green-500 font-semibold">{lastSync}</span>
            </p>
          )}
        </div>
        <div className="flex gap-2">
          {/* ✅ working button */}
          <button
            onClick={() => navigate("/dashboard/NewAppointments")}
            className="flex items-center gap-2 bg-indigo-700 hover:bg-indigo-800 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition">
            <span>+</span> New Appointment
          </button>
          <button
            onClick={() => navigate("/dashboard/Calendar")}
            className="flex items-center gap-2 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 text-sm font-semibold px-5 py-2.5 rounded-xl transition">
            📅 Schedule Availability
          </button>
        </div>
      </div>

      {/* Stat Cards — same as original */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon="👨‍⚕️" label="Doctors"     value={String(totalDoctors)}  change={95}  bar  color="#4F46E5" bg="#EEF2FF" />
        <StatCard icon="🩺"   label="Patients"    value={String(totalPatients)} change={25}  bar={false} color="#EF4444" bg="#FEE2E2" />
        <StatCard icon="📅"   label="Appointment" value={String(todayTickets || allTickets)} change={-15} bar  color="#0891B2" bg="#CFFAFE" />
        <StatCard icon="💰"   label="Revenue"     value="$55,1240"              change={25}  bar={false} color="#059669" bg="#D1FAE5" />
      </div>

      {/* Main layout */}
      <div className="flex flex-col lg:flex-row gap-4 items-start">

        {/* ── LEFT ── */}
        <div className="flex-1 min-w-0 flex flex-col gap-4">

          {/* Appointment Statistics */}
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-gray-800">Appointment Statistics</h2>
              <select className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 text-gray-600 bg-white">
                <option>Monthly</option><option>Weekly</option>
              </select>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
              {[
                { label:"All Appointments", value:String(allTickets || 6314),      dot:"bg-indigo-500" },
                { label:"Cancelled",        value:String(allRescheduled || 456),   dot:"bg-red-400"    },
                { label:"Reschedule",       value:String(allOngoing || 745),       dot:"bg-yellow-400" },
                { label:"Completed",        value:String(allCompleted || 4578),    dot:"bg-green-400"  },
              ].map(s => (
                <div key={s.label} className="border border-gray-100 rounded-xl p-3">
                  <div className="flex items-center gap-1.5 mb-1">
                    <span className={`w-2 h-2 rounded-full flex-shrink-0 ${s.dot}`} />
                    <span className="text-xs text-gray-500 truncate">{s.label}</span>
                  </div>
                  <p className="text-xl font-bold text-gray-800">{s.value}</p>
                </div>
              ))}
            </div>
            <ResponsiveContainer width="100%" height={230}>
              <BarChart data={barData} barSize={12} barCategoryGap="35%">
                <CartesianGrid vertical={false} strokeDasharray="4 4" stroke="#f0f0f0" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize:11, fill:"#9CA3AF" }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize:11, fill:"#9CA3AF" }} tickFormatter={v => `${v/1000}K`} />
                <Tooltip formatter={(v:number) => v.toLocaleString()} />
                <Bar dataKey="completed"   stackId="a" fill="#2DD4BF" />
                <Bar dataKey="ongoing"     stackId="a" fill="#60A5FA" />
                <Bar dataKey="rescheduled" stackId="a" fill="#6366F1" radius={[4,4,0,0]} />
              </BarChart>
            </ResponsiveContainer>
            <div className="flex justify-center gap-6 mt-3">
              {[["Completed","bg-teal-400"],["Ongoing","bg-blue-400"],["Rescheduled","bg-indigo-500"]].map(([l,c]) => (
                <div key={l} className="flex items-center gap-1.5">
                  <span className={`w-3 h-3 rounded-sm ${c}`} />
                  <span className="text-xs text-gray-500">{l}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Popular Doctors + Top Departments */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-bold text-gray-800">Popular Doctors</h2>
                <select className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 text-gray-600 bg-white">
                  <option>Weekly</option><option>Monthly</option>
                </select>
              </div>
              <div className="space-y-3">
                {displayPopular.map(d => (
                  <div key={d.name} className="border border-gray-100 rounded-xl p-3">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="relative">
                        <Av i={d.initials} c={d.color} />
                        {d.online && <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-400 border-2 border-white rounded-full" />}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-800">{d.name}</p>
                        <p className="text-xs text-gray-400">{d.specialty}</p>
                      </div>
                    </div>
                    <p className="text-sm text-gray-500 pl-1">
                      <span className="font-bold text-gray-700">{d.bookings}</span> Bookings
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-2">
                <h2 className="font-bold text-gray-800">Top 3 Departments</h2>
                <select className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 text-gray-600 bg-white">
                  <option>Weekly</option><option>Monthly</option>
                </select>
              </div>
              <div className="relative flex items-center justify-center">
                <PieChart width={200} height={200}>
                  <Pie data={deptPieData} cx={96} cy={96} innerRadius={58} outerRadius={92}
                    dataKey="value" strokeWidth={3} stroke="#fff">
                    {deptPieData.map((e, i) => <Cell key={i} fill={e.color} />)}
                  </Pie>
                </PieChart>
                <div className="absolute text-center pointer-events-none">
                  <p className="text-xs text-gray-400">Total Patient</p>
                  <p className="text-2xl font-bold text-gray-700">638</p>
                </div>
              </div>
              <div className="space-y-1.5 mt-1">
                {deptPieData.map(d => (
                  <div key={d.name} className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: d.color }} />
                    <span className="text-xs text-gray-600 flex-1">{d.name}</span>
                    <span className="text-xs font-semibold text-gray-700">{d.value}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Doctors Schedule + Income By Treatment */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-bold text-gray-800">Doctors Schedule</h2>
                <button
                  onClick={() => navigate("/dashboard/DoctorsDetails")}
                  className="text-sm text-indigo-600 hover:underline font-semibold">
                  View All
                </button>
              </div>
              <div className="grid grid-cols-3 text-center border border-gray-100 rounded-xl p-3 mb-4">
                {[["Available","48"],["Unavailable","28"],["Leave","12"]].map(([l,v]) => (
                  <div key={l}>
                    <p className="text-xs text-gray-400">{l}</p>
                    <p className="text-2xl font-bold text-gray-800">{v}</p>
                  </div>
                ))}
              </div>
              <div className="space-y-3">
                {displaySchedule.map(d => (
                  <div key={d.name} className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-3 min-w-0">
                      <Av i={d.initials} c={d.color} />
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-gray-800 truncate">{d.name}</p>
                        <p className="text-xs text-gray-400 truncate">{d.specialty}</p>
                      </div>
                    </div>
                    {/* ✅ Book Now works */}
                    <button
                      onClick={() => navigate("/dashboard/NewAppointments")}
                      className="bg-indigo-700 hover:bg-indigo-800 text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition flex-shrink-0">
                      Book Now
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-5">
                <h2 className="font-bold text-gray-800">Income By Treatment</h2>
                <select className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 text-gray-600 bg-white">
                  <option>Weekly</option><option>Monthly</option>
                </select>
              </div>
              <div className="space-y-5">
                {treatments.map(t => (
                  <div key={t.name} className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-bold text-gray-800">{t.name}</p>
                      <p className="text-xs text-gray-400">{t.appointments.toLocaleString()} Appointments</p>
                    </div>
                    <p className="text-base font-bold text-gray-800">{t.income}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>{/* end LEFT */}

        {/* ── RIGHT ── */}
        <div className="w-full lg:w-[340px] flex-shrink-0">
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">

            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-gray-800">Appointments</h2>
              <select className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 text-gray-600 bg-white">
                <option>All Type</option>
              </select>
            </div>

            {/* Calendar — same as original */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-3">
                <button className="w-7 h-7 flex items-center justify-center text-gray-400 hover:text-gray-700 rounded-full hover:bg-gray-100 text-lg">‹</button>
                <span className="text-sm font-bold text-gray-700">
                  {new Date().toLocaleString("default", { month:"long", year:"numeric" }).toUpperCase()}
                </span>
                <button className="w-7 h-7 flex items-center justify-center text-gray-400 hover:text-gray-700 rounded-full hover:bg-gray-100 text-lg">›</button>
              </div>
              <div className="grid grid-cols-7 mb-1">
                {DAYS.map(d => (
                  <div key={d} className="text-center text-xs font-semibold text-gray-400 py-1">{d}</div>
                ))}
              </div>
              {calendarRows.map((row, ri) => (
                <div key={ri} className="grid grid-cols-7">
                  {row.map((day, ci) => (
                    <button key={ci}
                      onClick={() => day && setSel(day)}
                      disabled={!day}
                      className={`text-center text-xs py-1.5 mx-auto w-7 rounded-full transition select-none
                        ${!day ? "opacity-0 cursor-default" :
                          day === sel ? "bg-indigo-600 text-white font-bold" :
                          "text-gray-700 hover:bg-indigo-50 hover:text-indigo-600"}`}>
                      {day ?? ""}
                    </button>
                  ))}
                </div>
              ))}
            </div>

            {/* Appointment list — real today data */}
            <div className="space-y-2">
              {displayAppts.map((a, i) => (
                <div key={i} className="rounded-xl p-3 flex items-center justify-between gap-3"
                  style={{ backgroundColor: a.bg }}>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-gray-800">{a.type}</p>
                    <div className="flex items-center gap-1 mt-0.5">
                      <span className="text-xs">📅</span>
                      <span className="text-xs text-gray-500 truncate">{a.date}</span>
                    </div>
                  </div>
                  <Av i={a.initials} c={a.ac} sm />
                </div>
              ))}
            </div>

            {/* ✅ working button */}
            <button
              onClick={() => navigate("/dashboard/Appointments")}
              className="w-full mt-3 text-sm text-gray-500 hover:text-indigo-600 font-semibold py-2.5 rounded-xl border border-gray-200 hover:border-indigo-300 bg-gray-50 hover:bg-indigo-50 transition">
              View All Appointments
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}