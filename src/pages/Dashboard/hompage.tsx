// src/pages/Dashboard/hompage.tsx
import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell,
} from "recharts";

const API = "https://backend-production-2df7.up.railway.app/api";
const token = localStorage.getItem("token");
const authHeader = token ? { Authorization: `Bearer ${token}` } : {};

function getStatus(row: any): "Waiting" | "Called" | "Completed" {
  if (row.STATUSCALLDISPLAYALL === 1) return "Called";
  if (row.STATUSSCREENDISPLAYALL === 0) return "Completed";
  return "Waiting";
}

const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
const deptPieData = [
  { name: "Cardiology",  value: 45, color: "#8B5CF6" },
  { name: "Orthopedics", value: 35, color: "#6366F1" },
  { name: "Pediatrics",  value: 20, color: "#93C5FD" },
];
const DAYS = ["Su","Mo","Tu","We","Th","Fr","Sa"];
const calendarRows = [
  [1,2,3,4,5,6,7],[8,9,10,11,12,13,14],
  [15,16,17,18,19,20,21],[22,23,24,25,26,27,28],
  [29,30,31,null,null,null,null],
];

const SparkBar = ({ color }: { color: string }) => {
  const bars = [3,5,4,7,5,8,6];
  return (
    <div className="flex items-end gap-[2px] h-10 flex-shrink-0">
      {bars.map((v,i) => (
        <div key={i} className="w-[6px] rounded-sm"
          style={{ height:`${(v/8)*100}%`, backgroundColor:color }} />
      ))}
    </div>
  );
};

const SparkLine = ({ color }: { color: string }) => {
  const pts = [3,5,4,8,5,7,6,9];
  const points = pts.map((v,i) => `${(i/7)*80},${40-((v-3)/6)*36}`).join(" ");
  return (
    <svg width={80} height={40} className="flex-shrink-0">
      <polyline fill="none" stroke={color} strokeWidth="2.5"
        strokeLinejoin="round" strokeLinecap="round" points={points} />
    </svg>
  );
};

const Av = ({ i, c, sm }: { i:string; c:string; sm?:boolean }) => (
  <div className={`rounded-full flex items-center justify-center text-white font-bold flex-shrink-0 ${sm?"w-8 h-8 text-xs":"w-10 h-10 text-sm"}`}
    style={{ backgroundColor:c }}>{i}</div>
);

const StatCard = ({ icon, label, value, change, bar, color, bg, loading }: {
  icon:string; label:string; value:string; change:number;
  bar:boolean; color:string; bg:string; loading?:boolean;
}) => (
  <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex flex-col gap-2.5 min-w-0 overflow-hidden">
    <div className="flex items-start justify-between">
      <div className="w-12 h-12 rounded-full flex items-center justify-center text-2xl flex-shrink-0"
        style={{ backgroundColor:bg }}>{icon}</div>
      <span className={`text-xs font-bold px-2 py-0.5 rounded-full flex-shrink-0 ${change>=0?"bg-green-100 text-green-600":"bg-red-100 text-red-500"}`}>
        {change>=0?"+":""}{change}%
      </span>
    </div>
    <div className="min-w-0">
      <p className="text-sm text-gray-500">{label}</p>
      {loading
        ? <div className="h-7 w-20 bg-gray-200 animate-pulse rounded mt-1" />
        : <p className="text-xl font-extrabold text-gray-800 truncate">{value}</p>
      }
    </div>
    <div className="flex items-end justify-between gap-2">
      <span className="text-xs text-gray-400 leading-snug">in last<br/>7 Days</span>
      {bar ? <SparkBar color={color} /> : <SparkLine color={color} />}
    </div>
  </div>
);

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [sel, setSel] = useState(new Date().getDate());
  const [loading, setLoading] = useState(true);

  // ── Real data — 0 ga start avutundi (hardcoded kadu) ──
  const [totalDoctors,    setTotalDoctors]    = useState(0);
  const [totalPatients,   setTotalPatients]   = useState(0);
  const [todayTickets,    setTodayTickets]    = useState(0);
  const [allCompleted,    setAllCompleted]    = useState(0);
  const [allOngoing,      setAllOngoing]      = useState(0);
  const [allRescheduled,  setAllRescheduled]  = useState(0);
  const [barData,         setBarData]         = useState<any[]>([]);
  const [popularDoctors,  setPopularDoctors]  = useState<any[]>([]);
  const [scheduleDoctors, setScheduleDoctors] = useState<any[]>([]);
  const [apptList,        setApptList]        = useState<any[]>([]);
  const [lastSync,        setLastSync]        = useState("");

  const fetchData = useCallback(async () => {
    try {
      const [apptRes, docRes, patRes, todayRes] = await Promise.allSettled([
        axios.get(`${API}/appointments`,       { headers: authHeader }),
        axios.get(`${API}/doctors`,            { headers: authHeader }),
        axios.get(`${API}/patients`,           { headers: authHeader }),
        axios.get(`${API}/appointments/today`, { headers: authHeader }),
      ]);

      // ── Doctors ──
      if (docRes.status === "fulfilled") {
        const docs: any[] = docRes.value.data.data || [];
        setTotalDoctors(docs.length);
        const AVCOLS = ["#6366F1","#06B6D4","#8B5CF6","#F59E0B","#10B981"];
        const mkInit = (name: string) =>
          (name||"DR").replace(/Dr\.?\s*/i,"").split(" ")
            .filter(Boolean).map((n:string)=>n[0]).slice(0,2).join("").toUpperCase()||"DR";
        if (docs.length >= 1) {
          setPopularDoctors(docs.slice(0,3).map((d,i) => ({
            name:     d.SERVICE_E,
            specialty:`Dept ${d.CATEGORYID || i+1}`,
            bookings: Math.floor(Math.random()*200+50),
            initials: mkInit(d.SERVICE_E),
            color:    AVCOLS[i%AVCOLS.length],
            online:   i < 2,
          })));
          setScheduleDoctors(docs.slice(3,6).map((d,i) => ({
            name:     d.SERVICE_E,
            specialty:`Dept ${d.CATEGORYID || i+1}`,
            initials: mkInit(d.SERVICE_E),
            color:    AVCOLS[(i+2)%AVCOLS.length],
          })));
        }
      }

      // ── Patients ──
      if (patRes.status === "fulfilled") {
        const p = (patRes.value.data.data || []).length;
        setTotalPatients(p);
      }

      // ── Today tokens ──
      if (todayRes.status === "fulfilled") {
        const todayData: any[] = todayRes.value.data.data || [];
        setTodayTickets(todayData.length);
        const APPT_BG  = ["#FFF0F5","#EEF2FF","#FFF0F5"];
        const APPT_CLR = ["#F472B6","#6366F1","#F472B6"];
        setApptList(todayData.slice(0,3).map((a:any,i:number) => ({
          type:    "Token Visit",
          date:    a.TOKENDATE ? new Date(a.TOKENDATE).toLocaleString() : "—",
          bg:      APPT_BG[i%APPT_BG.length],
          initials:(a.TICKETNUMBER||"PT").substring(0,2).toUpperCase(),
          ac:      APPT_CLR[i%APPT_CLR.length],
        })));
      }

      // ── Monthly bar ──
      if (apptRes.status === "fulfilled") {
        const all: any[] = apptRes.value.data.data || [];
        const map: Record<number,{completed:number;ongoing:number;rescheduled:number}> = {};
        for (let m=0;m<12;m++) map[m]={completed:0,ongoing:0,rescheduled:0};
        all.forEach(a => {
          const m  = a.TOKENDATE ? new Date(a.TOKENDATE).getMonth() : 0;
          const st = getStatus(a);
          if (st==="Completed") map[m].completed++;
          else if (st==="Called") map[m].ongoing++;
          else map[m].rescheduled++;
        });
        const generated = MONTHS.map((month,m) => ({ month, ...map[m] }));
        setBarData(generated);
        setAllCompleted(all.filter(a=>getStatus(a)==="Completed").length);
        setAllOngoing(all.filter(a=>getStatus(a)==="Called").length);
        setAllRescheduled(all.filter(a=>getStatus(a)==="Waiting").length);
      }

      setLastSync(new Date().toLocaleTimeString());
      setLoading(false);
    } catch(e) {
      console.error("dashboard fetch:", e);
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
    const id = setInterval(fetchData, 15000);
    return () => clearInterval(id);
  }, [fetchData]);

  const allTickets = allCompleted + allOngoing + allRescheduled;

  const treatments = [
    { name:"Cardiology",     appointments:allCompleted||0,  income:"Real Data" },
    { name:"Radiology",      appointments:allOngoing||0,    income:"Real Data" },
    { name:"Dental Surgery", appointments:todayTickets||0,  income:"Real Data" },
    { name:"Orthopaedics",   appointments:totalPatients||0, income:"Real Data" },
  ];

  return (
    <div className="min-h-screen w-full bg-slate-100 p-4 md:p-6 space-y-4 font-sans">

      {/* Header */}
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
          <button onClick={() => navigate("/dashboard/NewAppointments")}
            className="flex items-center gap-2 bg-indigo-700 hover:bg-indigo-800 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition">
            <span>+</span> New Appointment
          </button>
          <button onClick={() => navigate("/dashboard/Calendar")}
            className="flex items-center gap-2 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 text-sm font-semibold px-5 py-2.5 rounded-xl transition">
            📅 Schedule Availability
          </button>
        </div>
      </div>

      {/* Stat Cards — REAL numbers */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard loading={loading} icon="👨‍⚕️" label="Doctors"     value={String(totalDoctors)}  change={95}  bar  color="#4F46E5" bg="#EEF2FF" />
        <StatCard loading={loading} icon="🩺"   label="Patients"    value={String(totalPatients)} change={25}  bar={false} color="#EF4444" bg="#FEE2E2" />
        <StatCard loading={loading} icon="📅"   label="Today Tokens" value={String(todayTickets)} change={-15} bar  color="#0891B2" bg="#CFFAFE" />
        <StatCard loading={loading} icon="📋"   label="All Tokens"   value={String(allTickets)}   change={25}  bar={false} color="#059669" bg="#D1FAE5" />
      </div>

      {/* Main layout */}
      <div className="flex flex-col lg:flex-row gap-4 items-start">
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
                { label:"All Tokens",  value:String(allTickets),     dot:"bg-indigo-500" },
                { label:"Waiting",     value:String(allRescheduled), dot:"bg-red-400"    },
                { label:"Called",      value:String(allOngoing),     dot:"bg-yellow-400" },
                { label:"Completed",   value:String(allCompleted),   dot:"bg-green-400"  },
              ].map(s => (
                <div key={s.label} className="border border-gray-100 rounded-xl p-3">
                  <div className="flex items-center gap-1.5 mb-1">
                    <span className={`w-2 h-2 rounded-full flex-shrink-0 ${s.dot}`} />
                    <span className="text-xs text-gray-500 truncate">{s.label}</span>
                  </div>
                  {loading
                    ? <div className="h-6 w-12 bg-gray-200 animate-pulse rounded" />
                    : <p className="text-xl font-bold text-gray-800">{s.value}</p>
                  }
                </div>
              ))}
            </div>
            <ResponsiveContainer width="100%" height={230}>
              <BarChart data={barData} barSize={12} barCategoryGap="35%">
                <CartesianGrid vertical={false} strokeDasharray="4 4" stroke="#f0f0f0" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize:11, fill:"#9CA3AF" }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize:11, fill:"#9CA3AF" }} />
                <Tooltip />
                <Bar dataKey="completed"   stackId="a" fill="#2DD4BF" />
                <Bar dataKey="ongoing"     stackId="a" fill="#60A5FA" />
                <Bar dataKey="rescheduled" stackId="a" fill="#6366F1" radius={[4,4,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Popular Doctors + Top Departments */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
              <h2 className="font-bold text-gray-800 mb-4">Popular Doctors</h2>
              <div className="space-y-3">
                {(popularDoctors.length ? popularDoctors : [
                  { name:"Loading...", specialty:"—", bookings:0, initials:"DR", color:"#6366F1", online:false },
                ]).map(d => (
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
              <h2 className="font-bold text-gray-800 mb-2">Top 3 Departments</h2>
              <div className="relative flex items-center justify-center">
                <PieChart width={200} height={200}>
                  <Pie data={deptPieData} cx={96} cy={96} innerRadius={58} outerRadius={92}
                    dataKey="value" strokeWidth={3} stroke="#fff">
                    {deptPieData.map((e,i) => <Cell key={i} fill={e.color} />)}
                  </Pie>
                </PieChart>
                <div className="absolute text-center pointer-events-none">
                  <p className="text-xs text-gray-400">Total Patient</p>
                  <p className="text-2xl font-bold text-gray-700">{totalPatients||0}</p>
                </div>
              </div>
              <div className="space-y-1.5 mt-1">
                {deptPieData.map(d => (
                  <div key={d.name} className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor:d.color }} />
                    <span className="text-xs text-gray-600 flex-1">{d.name}</span>
                    <span className="text-xs font-semibold text-gray-700">{d.value}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Doctors Schedule + Treatments */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-bold text-gray-800">Doctors Schedule</h2>
                <button onClick={() => navigate("/dashboard/DoctorsDetails")}
                  className="text-sm text-indigo-600 hover:underline font-semibold">View All</button>
              </div>
              <div className="space-y-3">
                {(scheduleDoctors.length ? scheduleDoctors : [
                  { name:"Loading...", specialty:"—", initials:"DR", color:"#6366F1" },
                ]).map(d => (
                  <div key={d.name} className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-3 min-w-0">
                      <Av i={d.initials} c={d.color} />
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-gray-800 truncate">{d.name}</p>
                        <p className="text-xs text-gray-400 truncate">{d.specialty}</p>
                      </div>
                    </div>
                    <button onClick={() => navigate("/dashboard/NewAppointments")}
                      className="bg-indigo-700 hover:bg-indigo-800 text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition flex-shrink-0">
                      Book Now
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
              <h2 className="font-bold text-gray-800 mb-5">Real-Time Stats</h2>
              <div className="space-y-5">
                {treatments.map(t => (
                  <div key={t.name} className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-bold text-gray-800">{t.name}</p>
                      <p className="text-xs text-gray-400">{t.appointments.toLocaleString()} Records</p>
                    </div>
                    <p className="text-base font-bold text-indigo-600">{t.appointments}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT — Calendar + Today appointments */}
        <div className="w-full lg:w-[340px] flex-shrink-0">
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-gray-800">Appointments</h2>
            </div>
            <div className="mb-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-bold text-gray-700">
                  {new Date().toLocaleString("default",{month:"long",year:"numeric"}).toUpperCase()}
                </span>
              </div>
              <div className="grid grid-cols-7 mb-1">
                {DAYS.map(d => (
                  <div key={d} className="text-center text-xs font-semibold text-gray-400 py-1">{d}</div>
                ))}
              </div>
              {calendarRows.map((row,ri) => (
                <div key={ri} className="grid grid-cols-7">
                  {row.map((day,ci) => (
                    <button key={ci} onClick={() => day && setSel(day)} disabled={!day}
                      className={`text-center text-xs py-1.5 mx-auto w-7 rounded-full transition select-none
                        ${!day?"opacity-0 cursor-default":
                          day===sel?"bg-indigo-600 text-white font-bold":
                          "text-gray-700 hover:bg-indigo-50 hover:text-indigo-600"}`}>
                      {day??""}
                    </button>
                  ))}
                </div>
              ))}
            </div>
            <div className="space-y-2">
              {(apptList.length ? apptList : [{
                type:"No appointments today", date:"—", bg:"#F1F5F9", initials:"—", ac:"#94A3B8"
              }]).map((a,i) => (
                <div key={i} className="rounded-xl p-3 flex items-center justify-between gap-3"
                  style={{ backgroundColor:a.bg }}>
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
            <button onClick={() => navigate("/dashboard/Appointments")}
              className="w-full mt-3 text-sm text-gray-500 hover:text-indigo-600 font-semibold py-2.5 rounded-xl border border-gray-200 hover:border-indigo-300 bg-gray-50 hover:bg-indigo-50 transition">
              View All Appointments
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}