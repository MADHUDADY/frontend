import { useState, useRef, useEffect } from "react";

const DOCTORS = [
  "Dr. Sarah Mitchell",
  "Dr. James Okafor",
  "Dr. Priya Nair",
  "Dr. Carlos Reyes",
  "Dr. Amina Yusuf",
];

const MONTHS = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December",
];
const HOURS = Array.from({ length: 12 }, (_, i) => String(i + 1).padStart(2, "0"));
const MINUTES = ["00", "15", "30", "45"];
const AMPM = ["AM", "PM"];
const currentYear = new Date().getFullYear();
const YEARS = Array.from({ length: 5 }, (_, i) => String(currentYear + i));

const genId = () => "MR" + Math.floor(100000 + Math.random() * 900000);

const selectClass =
  "w-full px-3 py-3 rounded-xl border border-slate-200 bg-white text-slate-800 text-sm font-medium " +
  "appearance-none focus:outline-none focus:ring-2 focus:ring-indigo-400 transition-all cursor-pointer";

const DAYS_OF_WEEK = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}
function getFirstDayOfMonth(year: number, month: number) {
  return new Date(year, month, 1).getDay();
}

// ── Calendar Picker ────────────────────────────────────────────────────────────
function CalendarPicker({
  value,
  onChange,
}: {
  value: Date | null;
  onChange: (d: Date) => void;
}) {
  const today = new Date();
  const [viewYear, setViewYear] = useState(value ? value.getFullYear() : today.getFullYear());
  const [viewMonth, setViewMonth] = useState(value ? value.getMonth() : today.getMonth());

  const daysInMonth = getDaysInMonth(viewYear, viewMonth);
  const firstDay = getFirstDayOfMonth(viewYear, viewMonth);
  const cells: (number | null)[] = [
    ...Array(firstDay).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  const prevMonth = () => {
    if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1); }
    else setViewMonth(m => m - 1);
  };
  const nextMonth = () => {
    if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1); }
    else setViewMonth(m => m + 1);
  };

  const isSelected = (day: number) =>
    value && value.getDate() === day && value.getMonth() === viewMonth && value.getFullYear() === viewYear;

  const isToday = (day: number) =>
    today.getDate() === day && today.getMonth() === viewMonth && today.getFullYear() === viewYear;

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-4 w-72 z-50">
      {/* Month / Year nav */}
      <div className="flex items-center justify-between mb-3">
        <button onClick={prevMonth} className="w-7 h-7 rounded-lg hover:bg-slate-100 flex items-center justify-center text-slate-500 transition-all">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="15 18 9 12 15 6"/></svg>
        </button>
        <span className="text-sm font-bold text-slate-800">{MONTHS[viewMonth]} {viewYear}</span>
        <button onClick={nextMonth} className="w-7 h-7 rounded-lg hover:bg-slate-100 flex items-center justify-center text-slate-500 transition-all">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="9 18 15 12 9 6"/></svg>
        </button>
      </div>

      {/* Day headers */}
      <div className="grid grid-cols-7 mb-1">
        {DAYS_OF_WEEK.map(d => (
          <div key={d} className="text-center text-[10px] font-bold text-slate-400 py-1">{d}</div>
        ))}
      </div>

      {/* Day cells */}
      <div className="grid grid-cols-7 gap-y-0.5">
        {cells.map((day, i) => (
          <div key={i} className="flex items-center justify-center">
            {day ? (
              <button
                onClick={() => onChange(new Date(viewYear, viewMonth, day))}
                className={`w-8 h-8 rounded-full text-xs font-semibold transition-all
                  ${isSelected(day)
                    ? "bg-indigo-600 text-white shadow-md shadow-indigo-200"
                    : isToday(day)
                    ? "border-2 border-indigo-400 text-indigo-600"
                    : "hover:bg-indigo-50 text-slate-700"
                  }`}
              >
                {day}
              </button>
            ) : null}
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Date Input with popup ──────────────────────────────────────────────────────
function DatePickerField({
  value,
  onChange,
  error,
}: {
  value: Date | null;
  onChange: (d: Date) => void;
  error?: string;
}) {
  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState({ top: 0, left: 0, width: 0 });
  const ref = useRef<HTMLDivElement>(null);
  const btnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleOpen = () => {
    if (btnRef.current) {
      const rect = btnRef.current.getBoundingClientRect();
      setPos({ top: rect.bottom + window.scrollY + 6, left: rect.left + window.scrollX, width: rect.width });
    }
    setOpen(o => !o);
  };

  const display = value
    ? `${String(value.getDate()).padStart(2, "0")} ${MONTHS[value.getMonth()]} ${value.getFullYear()}`
    : "Select date";

  return (
    <div ref={ref} className="relative">
      <button
        ref={btnRef}
        type="button"
        onClick={handleOpen}
        className={`w-full px-4 py-3 rounded-xl border text-sm font-medium text-left flex items-center justify-between transition-all
          ${open ? "border-indigo-400 ring-2 ring-indigo-400" : "border-slate-200"}
          ${value ? "text-slate-800" : "text-slate-400"} bg-white`}
      >
        <span>{display}</span>
        <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      </button>
      {error && <p className="text-rose-500 text-xs mt-1">{error}</p>}
      {open && (
        <div
          style={{ position: "fixed", top: pos.top, left: pos.left, zIndex: 9999 }}
        >
          <CalendarPicker
            value={value}
            onChange={(d) => { onChange(d); setOpen(false); }}
          />
        </div>
      )}
    </div>
  );
}

// ── Drop field (time) ──────────────────────────────────────────────────────────
function DropField({ value, onChange, options, placeholder }: {
  value: string; onChange: (v: string) => void; options: string[]; placeholder: string;
}) {
  return (
    <div className="relative flex-1">
      <select value={value} onChange={(e) => onChange(e.target.value)} className={selectClass}>
        <option value="">{placeholder}</option>
        {options.map((o) => <option key={o} value={o}>{o}</option>)}
      </select>
      <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-slate-400">
        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </span>
    </div>
  );
}

// ── Main ───────────────────────────────────────────────────────────────────────
interface Form {
  bookingId: string;
  doctorName: string;
  selectedDate: Date | null;
  hour: string;
  minute: string;
  ampm: string;
}

export default function Newbook() {
  const now = new Date();
  const initForm: Form = {
    bookingId: genId(),
    doctorName: "",
    selectedDate: now,
    hour: "09",
    minute: "00",
    ampm: "AM",
  };

  const [form, setForm] = useState<Form>(initForm);
  const [errors, setErrors] = useState<Partial<Record<string, string>>>({});
  const [submitted, setSubmitted] = useState(false);

  const set = (key: keyof Form) => (val: string) => {
    setForm((f) => ({ ...f, [key]: val }));
    setErrors((e) => ({ ...e, [key]: "" }));
  };

  const validate = () => {
    const next: Record<string, string> = {};
    if (!form.doctorName) next.doctorName = "Required";
    if (!form.selectedDate) next.selectedDate = "Select a date";
    if (!form.hour || !form.minute) next.hour = "Select a time";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = () => { if (validate()) setSubmitted(true); };
  const handleReset = () => {
    setForm({ ...initForm, bookingId: genId() });
    setErrors({});
    setSubmitted(false);
  };

  const displayDate = form.selectedDate
    ? `${String(form.selectedDate.getDate()).padStart(2, "0")} ${MONTHS[form.selectedDate.getMonth()]} ${form.selectedDate.getFullYear()}`
    : "";
  const displayTime = `${form.hour}:${form.minute} ${form.ampm}`;

  if (submitted) {
    return (
      <div className="min-h-screen bg-slate-50 p-6">
        <div className="w-full bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="h-1.5 bg-gradient-to-r from-indigo-500 to-violet-500" />
          <div className="p-8 flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-emerald-500" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-slate-800 mb-1">Room Booked!</h2>
            <p className="text-sm text-slate-400 mb-6">Your meeting has been scheduled.</p>
            <div className="w-full bg-slate-50 rounded-xl p-5 text-left space-y-3 border border-slate-200 mb-6">
              {[
                ["Booking ID", form.bookingId],
                ["Doctor", form.doctorName],
                ["Date", displayDate],
                ["Time", displayTime],
              ].map(([label, val]) => (
                <div key={label} className="flex justify-between text-sm">
                  <span className="text-slate-400 font-medium">{label}</span>
                  <span className="text-slate-800 font-semibold">{val}</span>
                </div>
              ))}
            </div>
            <button onClick={handleReset}
              className="w-full py-3 rounded-xl bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700 active:scale-95 transition-all">
              Book Another
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 p-6">
      <div className="w-full bg-white rounded-2xl shadow-lg">

        {/* Header */}
        <div className="px-7 pt-7 pb-5 border-b border-slate-100 flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-indigo-600 flex items-center justify-center shadow shadow-indigo-200">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <div>
            <h1 className="text-base font-bold text-slate-800">Meeting Room Booking</h1>
            <p className="text-xs text-slate-400">Schedule a doctor consultation</p>
          </div>
        </div>

        {/* Form */}
        <div className="px-7 py-6 space-y-5">

          {/* Doctor */}
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
              Doctor <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <select value={form.doctorName} onChange={(e) => set("doctorName")(e.target.value)} className={selectClass}>
                <option value="">Select doctor</option>
                {DOCTORS.map((d) => <option key={d}>{d}</option>)}
              </select>
              <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-400">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </span>
            </div>
            {errors.doctorName && <p className="text-rose-500 text-xs mt-1">{errors.doctorName}</p>}
          </div>

          {/* Date — Calendar Picker */}
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
              Date <span className="text-rose-500">*</span>
            </label>
            <DatePickerField
              value={form.selectedDate}
              onChange={(d) => { setForm(f => ({ ...f, selectedDate: d })); setErrors(e => ({ ...e, selectedDate: "" })); }}
              error={errors.selectedDate}
            />
          </div>

          {/* Time: Hour / Minute / AM-PM */}
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
              Time <span className="text-rose-500">*</span>
            </label>
            <div className="flex gap-2">
              <DropField value={form.hour}   onChange={set("hour")}   options={HOURS}   placeholder="Hour" />
              <DropField value={form.minute} onChange={set("minute")} options={MINUTES} placeholder="Min" />
              <DropField value={form.ampm}   onChange={set("ampm")}   options={AMPM}    placeholder="AM/PM" />
            </div>
            {errors.hour && <p className="text-rose-500 text-xs mt-1">{errors.hour}</p>}
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-1">
            <button type="button" onClick={handleReset}
              className="flex-1 py-3 rounded-xl border border-slate-200 text-slate-600 text-sm font-semibold hover:bg-slate-50 active:scale-95 transition-all">
              Cancel
            </button>
            <button type="button" onClick={handleSubmit}
              className="flex-1 py-3 rounded-xl bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700 active:scale-95 transition-all shadow-md shadow-indigo-200">
              Book Room
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}