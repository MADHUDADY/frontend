import { useState, useRef, useEffect } from "react";
import axios from "axios";

const API = "http://localhost:5000/api";

const MONTHS = ["January","February","March","April","May","June",
  "July","August","September","October","November","December"];
const HOURS   = Array.from({ length: 12 }, (_, i) => String(i + 1).padStart(2, "0"));
const MINUTES = ["00","15","30","45"];
const AMPM    = ["AM","PM"];
const DAYS    = ["Su","Mo","Tu","We","Th","Fr","Sa"];

function getDaysInMonth(y: number, m: number) { return new Date(y, m+1, 0).getDate(); }
function getFirstDay(y: number, m: number)    { return new Date(y, m, 1).getDay(); }

// ── Mini Calendar ─────────────────────────────────────────────────────────────
function Cal({ value, onChange }: { value: Date | null; onChange: (d: Date) => void }) {
  const today = new Date();
  const [vy, setVy] = useState(value?.getFullYear()  ?? today.getFullYear());
  const [vm, setVm] = useState(value?.getMonth()     ?? today.getMonth());
  const days = getDaysInMonth(vy, vm);
  const first = getFirstDay(vy, vm);
  const cells = [...Array(first).fill(null), ...Array.from({length:days},(_,i)=>i+1)];
  const prev  = () => vm===0 ? (setVm(11),setVy(y=>y-1)) : setVm(m=>m-1);
  const next  = () => vm===11? (setVm(0),setVy(y=>y+1)) : setVm(m=>m+1);
  const isSel = (d:number) => value?.getDate()===d && value?.getMonth()===vm && value?.getFullYear()===vy;
  const isTod = (d:number) => today.getDate()===d && today.getMonth()===vm && today.getFullYear()===vy;
  return (
    <div className="absolute z-50 top-full mt-1 left-0 bg-white rounded-2xl shadow-xl border border-slate-200 p-4 w-72">
      <div className="flex items-center justify-between mb-3">
        <button onClick={prev} className="w-7 h-7 hover:bg-slate-100 rounded-lg flex items-center justify-center text-lg">‹</button>
        <span className="text-sm font-bold">{MONTHS[vm]} {vy}</span>
        <button onClick={next} className="w-7 h-7 hover:bg-slate-100 rounded-lg flex items-center justify-center text-lg">›</button>
      </div>
      <div className="grid grid-cols-7 mb-1">
        {DAYS.map(d=><div key={d} className="text-center text-[10px] font-bold text-slate-400 py-1">{d}</div>)}
      </div>
      <div className="grid grid-cols-7 gap-y-0.5">
        {cells.map((day,i)=>(
          <div key={i} className="flex items-center justify-center">
            {day ? (
              <button onClick={()=>onChange(new Date(vy,vm,day))}
                className={`w-8 h-8 rounded-full text-xs font-semibold transition-all
                  ${isSel(day)?"bg-indigo-600 text-white":isTod(day)?"border-2 border-indigo-400 text-indigo-600":"hover:bg-indigo-50 text-slate-700"}`}>
                {day}
              </button>
            ):null}
          </div>
        ))}
      </div>
    </div>
  );
}

const genId = () => "MR" + Math.floor(100000 + Math.random() * 900000);

export default function Newbook() {
  const [doctors,  setDoctors]  = useState<any[]>([]);
  const [counters, setCounters] = useState<any[]>([]);
  const [loadingDropdowns, setLoadingDropdowns] = useState(true);

  const [form, setForm] = useState({
    bookingId:   genId(),
    doctorId:    "",
    doctorName:  "",
    counterId:   "",
    selectedDate: new Date() as Date | null,
    hour: "09", minute: "00", ampm: "AM",
    notes: "",
    zone: "1", centerid: "101",
  });
  const [errors,    setErrors]    = useState<Record<string,string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [saving,    setSaving]    = useState(false);
  const [apiError,  setApiError]  = useState("");
  const [showCal,   setShowCal]   = useState(false);
  const calRef = useRef<HTMLDivElement>(null);

  // Load doctors + counters
  useEffect(() => {
    const load = async () => {
      try {
        const [dRes, cRes] = await Promise.all([
          axios.get(`${API}/doctors`),
          axios.get(`${API}/clinic/counters`),
        ]);
        setDoctors(dRes.data.data   || []);
        setCounters(cRes.data.data  || []);
      } catch (err) { console.error("Dropdown load failed:", err); }
      finally { setLoadingDropdowns(false); }
    };
    load();
  }, []);

  // Close calendar on outside click
  useEffect(() => {
    const h = (e: MouseEvent) => {
      if (calRef.current && !calRef.current.contains(e.target as Node)) setShowCal(false);
    };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  const validate = () => {
    const e: Record<string,string> = {};
    if (!form.doctorId)     e.doctorId     = "Select a doctor";
    if (!form.selectedDate) e.selectedDate = "Select a date";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    try {
      setSaving(true); setApiError("");
      // Convert date + time to a ticket number format
      const d = form.selectedDate!;
      const dateStr = `${d.getDate().toString().padStart(2,"0")}${(d.getMonth()+1).toString().padStart(2,"0")}`;
      const ticketNo = `${form.bookingId.replace("MR","")}`;

      await axios.post(`${API}/appointments`, {
        TICKETNUMBER: form.bookingId,
        COUNTERID:    form.counterId || "1",
        SERVICEID:    form.doctorId,
        ZONE:         form.zone,
        TYPE:         "A",           // A = Appointment type
        CENTERID:     form.centerid,
      });
      setSubmitted(true);
    } catch (err: any) {
      setApiError(err?.response?.data?.message || "Booking failed. Check backend.");
    } finally { setSaving(false); }
  };

  const handleReset = () => {
    setForm({ bookingId: genId(), doctorId:"", doctorName:"", counterId:"", selectedDate:new Date(), hour:"09", minute:"00", ampm:"AM", notes:"", zone:"1", centerid:"101" });
    setErrors({}); setSubmitted(false); setApiError("");
  };

  const displayDate = form.selectedDate
    ? `${form.selectedDate.getDate().toString().padStart(2,"0")} ${MONTHS[form.selectedDate.getMonth()]} ${form.selectedDate.getFullYear()}`
    : "Select date";

  // ── Success ───────────────────────────────────────────────────────────────
  if (submitted) {
    return (
      <div className="min-h-screen bg-slate-50 p-6 flex items-center justify-center">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="h-1.5 bg-gradient-to-r from-indigo-500 to-violet-500"/>
          <div className="p-8 flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mb-4 text-3xl">✅</div>
            <h2 className="text-xl font-bold text-slate-800 mb-1">Booking Confirmed!</h2>
            <p className="text-sm text-slate-400 mb-6">Saved to database successfully.</p>
            <div className="w-full bg-slate-50 rounded-xl p-5 text-left space-y-3 border border-slate-200 mb-6">
              {[
                ["Booking ID",  form.bookingId],
                ["Doctor",      form.doctorName],
                ["Date",        displayDate],
                ["Time",        `${form.hour}:${form.minute} ${form.ampm}`],
                ...(form.notes ? [["Notes", form.notes]] : []),
              ].map(([l,v]) => (
                <div key={l} className="flex justify-between text-sm">
                  <span className="text-slate-400 font-medium">{l}</span>
                  <span className="text-slate-800 font-semibold">{v}</span>
                </div>
              ))}
            </div>
            <button onClick={handleReset}
              className="w-full py-3 rounded-xl bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700">
              Book Another
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── Form ──────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-slate-100 p-6">
      <div className="w-full max-w-md mx-auto bg-white rounded-2xl shadow-lg">

        {/* Header */}
        <div className="px-7 pt-7 pb-5 border-b border-slate-100 flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-indigo-600 flex items-center justify-center text-white text-lg">📅</div>
          <div>
            <h1 className="text-base font-bold text-slate-800">Meeting Room Booking</h1>
            <p className="text-xs text-slate-400">Schedule a doctor consultation — saves to database</p>
          </div>
        </div>

        <div className="px-7 py-6 space-y-4">

          {apiError && (
            <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-3 text-sm">
              ❌ {apiError}
            </div>
          )}

          {/* Doctor */}
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
              Doctor <span className="text-rose-500">*</span>
            </label>
            <select
              value={form.doctorId}
              disabled={loadingDropdowns}
              onChange={e => {
                const sel = doctors.find(d => String(d.SERVICEID) === e.target.value);
                setForm(f => ({...f, doctorId: e.target.value, doctorName: sel?.SERVICE_E || ""}));
                setErrors(er => ({...er, doctorId:""}));
              }}
              className="w-full px-3 py-3 rounded-xl border border-slate-200 bg-white text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-400">
              <option value="">{loadingDropdowns ? "Loading..." : "-- Select Doctor --"}</option>
              {doctors.map(d => <option key={d.SERVICEID} value={d.SERVICEID}>{d.SERVICE_E}</option>)}
            </select>
            {errors.doctorId && <p className="text-rose-500 text-xs mt-1">{errors.doctorId}</p>}
          </div>

          {/* Counter */}
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Counter</label>
            <select
              value={form.counterId}
              onChange={e => setForm(f => ({...f, counterId: e.target.value}))}
              className="w-full px-3 py-3 rounded-xl border border-slate-200 bg-white text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-400">
              <option value="">-- Select Counter (optional) --</option>
              {counters.map(c => <option key={c.COUNTERID} value={c.COUNTERID}>Counter {c.COUNTERE}</option>)}
            </select>
          </div>

          {/* Date */}
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
              Date <span className="text-rose-500">*</span>
            </label>
            <div ref={calRef} className="relative">
              <button type="button" onClick={() => setShowCal(o => !o)}
                className={`w-full px-4 py-3 rounded-xl border text-sm font-medium text-left flex items-center justify-between transition-all
                  ${showCal ? "border-indigo-400 ring-2 ring-indigo-400" : "border-slate-200"}
                  ${form.selectedDate ? "text-slate-800" : "text-slate-400"} bg-white`}>
                <span>{displayDate}</span>
                <span>📅</span>
              </button>
              {errors.selectedDate && <p className="text-rose-500 text-xs mt-1">{errors.selectedDate}</p>}
              {showCal && (
                <Cal value={form.selectedDate} onChange={d => { setForm(f=>({...f, selectedDate:d})); setShowCal(false); setErrors(e=>({...e,selectedDate:""})); }} />
              )}
            </div>
          </div>

          {/* Time */}
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Time</label>
            <div className="flex gap-2">
              {[{k:"hour",opts:HOURS,ph:"Hour"},{k:"minute",opts:MINUTES,ph:"Min"},{k:"ampm",opts:AMPM,ph:"AM/PM"}].map(({k,opts,ph}) => (
                <div key={k} className="relative flex-1">
                  <select value={(form as any)[k]} onChange={e => setForm(f => ({...f, [k]: e.target.value}))}
                    className="w-full px-3 py-3 rounded-xl border border-slate-200 bg-white text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-400">
                    {opts.map(o => <option key={o} value={o}>{o}</option>)}
                  </select>
                </div>
              ))}
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Notes</label>
            <textarea value={form.notes} onChange={e => setForm(f => ({...f, notes: e.target.value}))}
              placeholder="Any additional notes..."
              rows={2}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 resize-none"/>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-1">
            <button type="button" onClick={handleReset}
              className="flex-1 py-3 rounded-xl border border-slate-200 text-slate-600 text-sm font-semibold hover:bg-slate-50">
              Cancel
            </button>
            <button type="button" onClick={handleSubmit} disabled={saving}
              className="flex-1 py-3 rounded-xl bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700 disabled:opacity-60 flex items-center justify-center gap-2">
              {saving ? <><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"/>Saving...</> : "📅 Book Room"}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}