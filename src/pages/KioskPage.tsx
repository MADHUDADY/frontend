import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const API = "https://backend-production-2df7.up.railway.app/api";
const token = () => localStorage.getItem("token") || "";
const headers = () => ({ Authorization: `Bearer ${token()}` });

// ── Ticket generator ──────────────────────────────────────────────────────────
function genTicket(series: string, num: number) {
  return `${(series || "WK").substring(0, 2).toUpperCase()}${num}`;
}

type Screen =
  | "home"           // Choose: Walk-in or Appointment
  | "walkin_phone"   // Walk-in → enter phone
  | "walkin_dept"    // Walk-in → select dept + doctor
  | "walkin_confirm" // Walk-in → confirm + generate token
  | "appt_phone"     // Appointment → enter phone
  | "appt_list"      // Appointment → show existing appointments
  | "appt_confirm"   // Appointment → confirm token
  | "token_issued";  // Final screen — token number

export default function KioskPage() {
  const navigate = useNavigate();
  const [screen,    setScreen]    = useState<Screen>("home");
  const [phone,     setPhone]     = useState("");
  const [phoneErr,  setPhoneErr]  = useState("");
  const [loading,   setLoading]   = useState(false);

  // Patient data
  const [patient,   setPatient]   = useState<any>(null);

  // Walk-in
  const [categories,  setCategories]  = useState<any[]>([]);
  const [doctors,     setDoctors]     = useState<any[]>([]);
  const [selCat,      setSelCat]      = useState<any>(null);
  const [selDoc,      setSelDoc]      = useState<any>(null);
  const [loadingDoc,  setLoadingDoc]  = useState(false);

  // Appointment
  const [appointments, setAppointments] = useState<any[]>([]);
  const [selAppt,      setSelAppt]      = useState<any>(null);

  // Token
  const [tokenNumber, setTokenNumber] = useState("");
  const [tokenInfo,   setTokenInfo]   = useState<any>(null);

  const phoneRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (screen === "walkin_phone" || screen === "appt_phone") {
      setTimeout(() => phoneRef.current?.focus(), 100);
    }
  }, [screen]);

  // Load categories on walk-in start
  useEffect(() => {
    if (screen === "walkin_dept" && categories.length === 0) {
      axios.get(`${API}/categories/byclinic/101`, { headers: headers() })
        .then(r => setCategories(r.data.data || []))
        .catch(() => {});
    }
  }, [screen]);

  // Load doctors when category selected
  const handleCatSelect = async (cat: any) => {
    setSelCat(cat);
    setSelDoc(null);
    setDoctors([]);
    try {
      setLoadingDoc(true);
      const r = await axios.get(`${API}/doctors/byclinic/101/category/${cat.CATEGORYID}`, { headers: headers() });
      setDoctors(r.data.data || []);
    } catch { } finally { setLoadingDoc(false); }
  };

  const validatePhone = (p: string) => {
    if (p.length !== 10) { setPhoneErr("Please enter a valid 10-digit mobile number"); return false; }
    setPhoneErr(""); return true;
  };

  // ── Walk-in phone search ──────────────────────────────────────────────────
  const handleWalkinPhone = async () => {
    if (!validatePhone(phone)) return;
    try {
      setLoading(true);
      const r = await axios.get(`${API}/appointments/search-patient/${phone}`, { headers: headers() });
      const patients = r.data.data || [];
      setPatient(patients.length > 0 ? patients[0] : { PatientName: "Walk-in Patient", Mobile: phone });
      setScreen("walkin_dept");
    } catch {
      setPatient({ PatientName: "Walk-in Patient", Mobile: phone });
      setScreen("walkin_dept");
    } finally { setLoading(false); }
  };

  // ── Walk-in → generate token ──────────────────────────────────────────────
  const handleWalkinConfirm = async () => {
    if (!selDoc) return;
    try {
      setLoading(true);
      const seq    = Math.floor(Math.random() * 90) + 1;
      const ticket = genTicket(selDoc.SERIES_W || selDoc.SHORTNAME || "WK", seq);

      await axios.post(`${API}/appointments`, {
        TICKETNUMBER: ticket,
        COUNTERID:    "1",
        SERVICEID:    selDoc.SERVICEID,
        ZONE:         selDoc.ZONE || "1",
        TYPE:         "W",
        CENTERID:     "101",
        PATIENTNAME:  patient?.PatientName || "",
        PHONE:        phone,
      }, { headers: headers() });

      setTokenNumber(ticket);
      setTokenInfo({
        type:    "Walk-in",
        doctor:  selDoc.SERVICE_E,
        dept:    selCat.CATEGORYE,
        patient: patient?.PatientName || "Walk-in Patient",
        phone,
      });
      setScreen("token_issued");
    } catch (e: any) {
      alert(e?.response?.data?.message || "Failed to generate token");
    } finally { setLoading(false); }
  };

  // ── Appointment phone search ──────────────────────────────────────────────
  const handleApptPhone = async () => {
    if (!validatePhone(phone)) return;
    try {
      setLoading(true);
      // Search patient first
      const patRes = await axios.get(`${API}/appointments/search-patient/${phone}`, { headers: headers() });
      const patients = patRes.data.data || [];
      if (patients.length > 0) setPatient(patients[0]);

      // Get all appointments and filter by phone
      const apptRes = await axios.get(`${API}/appointments/new-list`, { headers: headers() });
      const all     = apptRes.data.data || [];
      const mine    = all.filter((a: any) => a.Mobile === phone);
      setAppointments(mine);
      setScreen("appt_list");
    } catch {
      setAppointments([]);
      setScreen("appt_list");
    } finally { setLoading(false); }
  };

  // ── Appointment → generate token ─────────────────────────────────────────
  const handleApptConfirm = async () => {
    if (!selAppt) return;
    try {
      setLoading(true);
      const ticket = `AP${selAppt.SLNO || Math.floor(Math.random() * 999)}`;

      await axios.post(`${API}/appointments`, {
        TICKETNUMBER: ticket,
        COUNTERID:    "1",
        SERVICEID:    selAppt.DoctorId,
        ZONE:         "1",
        TYPE:         "D",
        CENTERID:     "101",
        PATIENTNAME:  selAppt.PatientName || patient?.PatientName || "",
        PHONE:        phone,
      }, { headers: headers() });

      setTokenNumber(ticket);
      setTokenInfo({
        type:    "Appointment",
        doctor:  selAppt.DoctorName,
        dept:    selAppt.DepartmentName,
        patient: selAppt.PatientName || patient?.PatientName,
        phone,
        date:    selAppt.AppointmentDateTime
          ? new Date(selAppt.AppointmentDateTime).toLocaleDateString()
          : "",
        apptNo:  selAppt.AppointNumber,
      });
      setScreen("token_issued");
    } catch (e: any) {
      alert(e?.response?.data?.message || "Failed to generate token");
    } finally { setLoading(false); }
  };

  const resetAll = () => {
    setScreen("home"); setPhone(""); setPhoneErr("");
    setPatient(null); setSelCat(null); setSelDoc(null);
    setDoctors([]); setAppointments([]); setSelAppt(null);
    setTokenNumber(""); setTokenInfo(null);
  };

  // ─────────────────────────────────────────────────────────────────────────
  //  RENDER
  // ─────────────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-blue-50 p-4 md:p-8">
      <div className="max-w-2xl mx-auto">

        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4"
            style={{ background: "linear-gradient(135deg,#1a7a6e,#002B6B)" }}>
            <span className="text-3xl">🏥</span>
          </div>
          <h1 className="text-3xl font-extrabold text-gray-900">Patient Check-In</h1>
          <p className="text-gray-500 mt-1">Walk-in or confirm your appointment</p>
        </div>

        {/* ── HOME — choose type ── */}
        {screen === "home" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 animate-fadein">
            {/* Walk-in */}
            <button onClick={() => setScreen("walkin_phone")}
              className="bg-white border-2 border-teal-200 hover:border-teal-500 rounded-2xl p-8
                         text-center shadow-sm hover:shadow-md transition group">
              <div className="text-5xl mb-4">🚶</div>
              <h2 className="text-xl font-bold text-gray-800 group-hover:text-teal-700">Walk-in</h2>
              <p className="text-sm text-gray-400 mt-2">
                No prior appointment?<br/>Book a token right now
              </p>
              <div className="mt-5 px-5 py-2 rounded-full text-sm font-semibold text-white"
                style={{ background: "#1a7a6e" }}>
                Start Walk-in →
              </div>
            </button>

            {/* Appointment */}
            <button onClick={() => setScreen("appt_phone")}
              className="bg-white border-2 border-indigo-200 hover:border-indigo-500 rounded-2xl p-8
                         text-center shadow-sm hover:shadow-md transition group">
              <div className="text-5xl mb-4">📅</div>
              <h2 className="text-xl font-bold text-gray-800 group-hover:text-indigo-700">Appointment</h2>
              <p className="text-sm text-gray-400 mt-2">
                Have a prior booking?<br/>Check in with your mobile
              </p>
              <div className="mt-5 px-5 py-2 rounded-full text-sm font-semibold text-white"
                style={{ background: "#002B6B" }}>
                Check Appointment →
              </div>
            </button>

            <button onClick={() => navigate("/dashboard")}
              className="col-span-full text-sm text-gray-400 hover:text-gray-600 mt-2 underline">
              ← Back to Dashboard
            </button>
          </div>
        )}

        {/* ── PHONE INPUT — shared for both flows ── */}
        {(screen === "walkin_phone" || screen === "appt_phone") && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 animate-fadein">
            <div className="text-center mb-6">
              <span className="text-4xl">{screen === "walkin_phone" ? "🚶" : "📅"}</span>
              <h2 className="text-xl font-bold text-gray-800 mt-3">
                {screen === "walkin_phone" ? "Walk-in Check-in" : "Appointment Check-in"}
              </h2>
              <p className="text-sm text-gray-400 mt-1">Enter your registered mobile number</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Mobile Number <span className="text-red-500">*</span>
                </label>
                <input
                  ref={phoneRef}
                  type="tel"
                  inputMode="numeric"
                  maxLength={10}
                  value={phone}
                  onChange={e => {
                    const d = e.target.value.replace(/\D/g, "").slice(0, 10);
                    setPhone(d); setPhoneErr("");
                  }}
                  onKeyDown={e => {
                    if (e.key === "Enter") screen === "walkin_phone" ? handleWalkinPhone() : handleApptPhone();
                  }}
                  placeholder="Enter 10-digit mobile number"
                  className={`w-full border-2 rounded-xl px-4 py-3 text-lg font-mono text-center
                             focus:outline-none focus:ring-2 focus:ring-indigo-400 tracking-widest
                             ${phoneErr ? "border-red-400 bg-red-50" : "border-gray-300"}`}
                />
                {phoneErr && <p className="text-red-500 text-sm mt-1 text-center">{phoneErr}</p>}
              </div>

              <button
                onClick={screen === "walkin_phone" ? handleWalkinPhone : handleApptPhone}
                disabled={loading || phone.length !== 10}
                className="w-full py-3 rounded-xl text-white font-bold text-lg
                           disabled:opacity-50 transition"
                style={{ background: screen === "walkin_phone" ? "#1a7a6e" : "#002B6B" }}>
                {loading ? "⏳ Searching..." : "🔍 Search →"}
              </button>

              <button onClick={resetAll}
                className="w-full py-2 text-sm text-gray-400 hover:text-gray-600">
                ← Back
              </button>
            </div>
          </div>
        )}

        {/* ── WALK-IN — select dept + doctor ── */}
        {screen === "walkin_dept" && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 animate-fadein">
            <div className="flex items-center gap-3 mb-6">
              <span className="text-3xl">🚶</span>
              <div>
                <h2 className="text-xl font-bold text-gray-800">Select Department & Doctor</h2>
                {patient?.PatientName && (
                  <p className="text-sm text-teal-600 font-semibold">
                    Patient: {patient.PatientName} · 📞 {phone}
                  </p>
                )}
              </div>
            </div>

            {/* Department grid */}
            <p className="text-xs font-bold text-gray-400 uppercase mb-3">Select Department</p>
            <div className="grid grid-cols-2 gap-3 mb-5">
              {categories.map(cat => (
                <button key={cat.CATEGORYID}
                  onClick={() => handleCatSelect(cat)}
                  className={`p-3 rounded-xl border-2 text-left transition ${
                    selCat?.CATEGORYID === cat.CATEGORYID
                      ? "border-teal-500 bg-teal-50"
                      : "border-gray-200 hover:border-teal-300"
                  }`}>
                  <p className="font-semibold text-sm text-gray-800">{cat.CATEGORYE}</p>
                </button>
              ))}
              {categories.length === 0 && (
                <p className="col-span-2 text-sm text-gray-400 text-center py-4">
                  Loading departments...
                </p>
              )}
            </div>

            {/* Doctor list */}
            {selCat && (
              <>
                <p className="text-xs font-bold text-gray-400 uppercase mb-3">Select Doctor</p>
                {loadingDoc
                  ? <p className="text-sm text-gray-400">⏳ Loading doctors...</p>
                  : (
                    <div className="space-y-2 mb-5">
                      {doctors.map(doc => (
                        <button key={doc.SERVICEID}
                          onClick={() => setSelDoc(doc)}
                          className={`w-full p-3 rounded-xl border-2 text-left flex items-center gap-3 transition ${
                            selDoc?.SERVICEID === doc.SERVICEID
                              ? "border-indigo-500 bg-indigo-50"
                              : "border-gray-200 hover:border-indigo-300"
                          }`}>
                          <div className="w-9 h-9 rounded-full bg-indigo-100 text-indigo-600 flex items-center
                                          justify-center font-bold text-sm flex-shrink-0">
                            {(doc.SERVICE_E || "DR").replace(/Dr\.?\s*/i,"")
                              .split(" ").map((n: string) => n[0]).slice(0,2).join("").toUpperCase() || "DR"}
                          </div>
                          <div>
                            <p className="font-semibold text-sm text-gray-800">{doc.SERVICE_E}</p>
                            <p className="text-xs text-gray-400">Zone {doc.ZONE}</p>
                          </div>
                          {selDoc?.SERVICEID === doc.SERVICEID && (
                            <span className="ml-auto text-indigo-600 font-bold">✓</span>
                          )}
                        </button>
                      ))}
                      {doctors.length === 0 && (
                        <p className="text-sm text-orange-500">No doctors in this department</p>
                      )}
                    </div>
                  )
                }
              </>
            )}

            <div className="flex gap-3">
              <button onClick={resetAll}
                className="flex-1 py-3 border border-gray-300 rounded-xl text-gray-600 text-sm hover:bg-gray-50">
                ← Back
              </button>
              <button
                onClick={() => setScreen("walkin_confirm")}
                disabled={!selDoc}
                className="flex-1 py-3 rounded-xl text-white font-bold text-sm disabled:opacity-50"
                style={{ background: "#1a7a6e" }}>
                Confirm →
              </button>
            </div>
          </div>
        )}

        {/* ── WALK-IN CONFIRM ── */}
        {screen === "walkin_confirm" && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center animate-fadein">
            <span className="text-5xl">✅</span>
            <h2 className="text-2xl font-bold text-gray-800 mt-4 mb-6">Confirm Walk-in Token</h2>

            <div className="bg-gray-50 rounded-xl p-5 text-left space-y-3 mb-6">
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Patient</span>
                <span className="font-semibold text-gray-800">{patient?.PatientName || "Walk-in"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Mobile</span>
                <span className="font-semibold text-gray-800">{phone}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Department</span>
                <span className="font-semibold text-gray-800">{selCat?.CATEGORYE}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Doctor</span>
                <span className="font-semibold text-gray-800">{selDoc?.SERVICE_E}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Type</span>
                <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-teal-100 text-teal-700">Walk-in</span>
              </div>
            </div>

            <div className="flex gap-3">
              <button onClick={() => setScreen("walkin_dept")}
                className="flex-1 py-3 border border-gray-300 rounded-xl text-gray-600 text-sm hover:bg-gray-50">
                ← Back
              </button>
              <button onClick={handleWalkinConfirm} disabled={loading}
                className="flex-1 py-3 rounded-xl text-white font-bold disabled:opacity-50"
                style={{ background: "#1a7a6e" }}>
                {loading ? "⏳ Generating..." : "🎫 Get Token"}
              </button>
            </div>
          </div>
        )}

        {/* ── APPOINTMENT LIST ── */}
        {screen === "appt_list" && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 animate-fadein">
            <div className="flex items-center gap-3 mb-5">
              <span className="text-3xl">📅</span>
              <div>
                <h2 className="text-xl font-bold text-gray-800">Your Appointments</h2>
                <p className="text-sm text-gray-400">Mobile: {phone}</p>
              </div>
            </div>

            {appointments.length === 0 ? (
              <div className="text-center py-10">
                <span className="text-4xl">😔</span>
                <p className="text-gray-600 font-semibold mt-3">No appointments found</p>
                <p className="text-sm text-gray-400 mt-1">for mobile number {phone}</p>
                <button onClick={() => { resetAll(); setScreen("walkin_phone"); setPhone(phone); }}
                  className="mt-5 px-6 py-2.5 rounded-xl text-white font-semibold text-sm"
                  style={{ background: "#1a7a6e" }}>
                  → Walk-in Instead
                </button>
              </div>
            ) : (
              <div className="space-y-3 mb-5">
                {appointments.map((a, i) => (
                  <button key={i}
                    onClick={() => { setSelAppt(a); setScreen("appt_confirm"); }}
                    className={`w-full p-4 rounded-xl border-2 text-left transition ${
                      selAppt?.SLNO === a.SLNO
                        ? "border-indigo-500 bg-indigo-50"
                        : "border-gray-200 hover:border-indigo-300 hover:bg-indigo-50"
                    }`}>
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-bold text-gray-800">{a.DoctorName || "Doctor"}</p>
                        <p className="text-xs text-gray-500 mt-0.5">{a.DepartmentName}</p>
                        {a.AppointmentDateTime && (
                          <p className="text-xs text-indigo-600 mt-1 font-semibold">
                            📅 {new Date(a.AppointmentDateTime).toLocaleDateString()} ·{" "}
                            {new Date(a.AppointmentDateTime).toLocaleTimeString([], {hour:"2-digit",minute:"2-digit"})}
                          </p>
                        )}
                      </div>
                      <div className="text-right">
                        <span className="text-xs bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full font-medium">
                          {a.AppointNumber || `#${a.SLNO}`}
                        </span>
                        <p className="text-xs text-green-600 mt-1 font-bold">Confirm →</p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}

            <button onClick={resetAll}
              className="w-full py-2 text-sm text-gray-400 hover:text-gray-600">
              ← Back
            </button>
          </div>
        )}

        {/* ── APPOINTMENT CONFIRM ── */}
        {screen === "appt_confirm" && selAppt && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center animate-fadein">
            <span className="text-5xl">📋</span>
            <h2 className="text-2xl font-bold text-gray-800 mt-4 mb-6">Confirm Appointment</h2>

            <div className="bg-indigo-50 rounded-xl p-5 text-left space-y-3 mb-6 border border-indigo-100">
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Patient</span>
                <span className="font-semibold text-gray-800">{selAppt.PatientName || patient?.PatientName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Doctor</span>
                <span className="font-semibold text-gray-800">{selAppt.DoctorName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Department</span>
                <span className="font-semibold text-gray-800">{selAppt.DepartmentName}</span>
              </div>
              {selAppt.AppointmentDateTime && (
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Date & Time</span>
                  <span className="font-semibold text-indigo-700">
                    {new Date(selAppt.AppointmentDateTime).toLocaleDateString()} ·{" "}
                    {new Date(selAppt.AppointmentDateTime).toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"})}
                  </span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Appt No.</span>
                <span className="font-bold text-indigo-600">{selAppt.AppointNumber || `#${selAppt.SLNO}`}</span>
              </div>
            </div>

            <div className="flex gap-3">
              <button onClick={() => setScreen("appt_list")}
                className="flex-1 py-3 border border-gray-300 rounded-xl text-gray-600 text-sm hover:bg-gray-50">
                ← Back
              </button>
              <button onClick={handleApptConfirm} disabled={loading}
                className="flex-1 py-3 rounded-xl text-white font-bold disabled:opacity-50"
                style={{ background: "#002B6B" }}>
                {loading ? "⏳ Generating..." : "🎫 Get Token"}
              </button>
            </div>
          </div>
        )}

        {/* ── TOKEN ISSUED ── */}
        {screen === "token_issued" && (
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-10 text-center animate-fadein">
            <div className="text-6xl mb-2">🎫</div>
            <p className="text-sm text-gray-400 uppercase tracking-widest mb-1">Your Token Number</p>
            <div className="text-7xl font-black my-4"
              style={{ color: tokenInfo?.type === "Walk-in" ? "#1a7a6e" : "#002B6B" }}>
              {tokenNumber}
            </div>

            <div className="bg-gray-50 rounded-xl p-4 text-left space-y-2 mb-6 mt-4">
              {tokenInfo?.patient && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Patient</span>
                  <span className="font-semibold">{tokenInfo.patient}</span>
                </div>
              )}
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Doctor</span>
                <span className="font-semibold">{tokenInfo?.doctor}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Department</span>
                <span className="font-semibold">{tokenInfo?.dept}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Type</span>
                <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                  tokenInfo?.type === "Walk-in"
                    ? "bg-teal-100 text-teal-700"
                    : "bg-indigo-100 text-indigo-700"
                }`}>{tokenInfo?.type}</span>
              </div>
              {tokenInfo?.date && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Date</span>
                  <span className="font-semibold text-indigo-600">{tokenInfo.date}</span>
                </div>
              )}
            </div>

            <p className="text-gray-400 text-sm mb-6">
              Please wait for your token to be called
            </p>

            <div className="flex gap-3">
              <button onClick={resetAll}
                className="flex-1 py-3 rounded-xl text-white font-bold"
                style={{ background: "#1a7a6e" }}>
                ✅ Done — New Check-in
              </button>
              <button onClick={() => navigate("/dashboard/Appointments")}
                className="flex-1 py-3 rounded-xl border border-gray-300 text-gray-600 text-sm hover:bg-gray-50">
                View Queue
              </button>
            </div>
          </div>
        )}

      </div>

      <style>{`
        .animate-fadein { animation: fadeIn 0.35s ease; }
        @keyframes fadeIn { from { opacity:0; transform:translateY(12px); } to { opacity:1; transform:translateY(0); } }
      `}</style>
    </div>
  );
}