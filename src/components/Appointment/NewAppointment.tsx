import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { ArrowLeft, CalendarDays, Clock, X, User, Phone, Mail } from "lucide-react";

interface Patient {
  id: number;
  name: string;
  mobile: string;
  email: string;
}

interface Appointment {
  dateTime: string;
  doctor: string;
  specialty: string;
  mode: string;
  status: "Checked Out" | "Checked In" | "Confirmed" | "Cancelled";
}

type View = "search" | "form";

const CreateAppointment: React.FC = () => {
  const navigate = useNavigate();
  const [mobileSearch, setMobileSearch] = useState("");
  const [showFoundPopup, setShowFoundPopup] = useState(false);
  const [showNotFoundPopup, setShowNotFoundPopup] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [foundPatient, setFoundPatient] = useState<Patient | null>(null);
  const [view, setView] = useState<View>("search");
  const [appointmentId] = useState("AP234354");
  const [date, setDate] = useState<Date | null>(new Date());
  const [time, setTime] = useState<Date | null>(null);
  const [clinics, setClinics] = useState<string[]>([""]);

  const patients: Patient[] = [
    { id: 1, name: "Mohamed Ali", mobile: "971501234567", email: "mohamed@gmail.com" },
    { id: 1, name: "thoufik", mobile: "971502368982", email: "thoufik@gmail.com" },
    { id: 1, name: "asiya", mobile: "971501234789", email: "asiya@gmail.com" },
    { id: 1, name: "mansoor", mobile: "971501234345", email: "mansoor@gmail.com" },
  ];

  const appointments: Appointment[] = [
    { dateTime: "4/30/2025, 9:30:00 AM", doctor: "Dr. Mick Thompson", specialty: "Cardiologist", mode: "In-person", status: "Checked Out" },
    { dateTime: "4/15/2025, 11:20:00 AM", doctor: "Dr. Sarah Johnson", specialty: "Orthopedic Surgeon", mode: "Online", status: "Checked In" },
    { dateTime: "4/2/2025, 8:15:00 AM", doctor: "Dr. Emily Carter", specialty: "Pediatrician", mode: "In-Person", status: "Cancelled" },
  ];

  const handleSearch = () => {
    const found = patients.find((p) => p.mobile === mobileSearch.trim());
    if (found) {
      setFoundPatient(found);
      setShowFoundPopup(true);
      setShowNotFoundPopup(false);
    } else {
      setFoundPatient(null);
      setShowNotFoundPopup(true);
      setShowFoundPopup(false);
    }
  };

  const goToForm = () => {
    setShowFoundPopup(false);
    setShowNotFoundPopup(false);
    setView("form");
  };

  const goToRegister = () => {
    setShowNotFoundPopup(false);
    navigate("/dashboard/NewPatient", { state: { mobile: mobileSearch } });
  };

  const goBack = () => {
    setView("search");
    setMobileSearch("");
    setFoundPatient(null);
  };

  const handleClinicChange = (value: string, index: number) => {
    const updated = [...clinics];
    updated[index] = value;
    setClinics(updated);
  };

  const addClinic = () => setClinics([...clinics, ""]);
  const removeClinic = (index: number) => setClinics(clinics.filter((_, i) => i !== index));

  // ══════════════════════════════════════════════════════════════
  // SEARCH PAGE
  // ══════════════════════════════════════════════════════════════
  if (view === "search") {
    return (
      <div className="min-h-screen bg-gray-100 p-6">
        <div className="flex items-center gap-2 mb-6">
          <ArrowLeft size={20} className="cursor-pointer" />
          <h1 className="text-xl font-semibold">Appointments</h1>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm mb-6 max-w-xl mx-auto">
          <label className="block mb-2 font-medium">
            Search Patient by Mobile Number
          </label>
          <div className="flex gap-3">
            <input
              type="text"
              value={mobileSearch}
              onChange={(e) => setMobileSearch(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              placeholder="Enter mobile number"
              className="px-4 py-2 border rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
            <button
              onClick={handleSearch}
              className="px-5 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
            >
              Search
            </button>
          </div>
        </div>

        {/* ── FOUND POPUP ── */}
        {showFoundPopup && foundPatient && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50 overflow-auto py-8">
            <div className="bg-white w-full max-w-3xl p-6 rounded-xl shadow-xl relative mx-4">
              <button
                onClick={() => { setShowFoundPopup(false); setShowDetails(false); }}
                className="absolute top-3 right-3 text-gray-400 hover:text-gray-700"
              >
                <X size={20} />
              </button>

              <h2 className="text-lg font-semibold mb-5 text-gray-800">Patient Found</h2>

              {/* Patient Info */}
              <div className="space-y-3 mb-5">
                <div className="flex items-center gap-3 text-sm text-gray-700">
                  <User size={16} className="text-indigo-500 shrink-0" />
                  <span><strong>Name:</strong> {foundPatient.name}</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-700">
                  <Phone size={16} className="text-indigo-500 shrink-0" />
                  <span><strong>Mobile:</strong> {foundPatient.mobile}</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-700">
                  <Mail size={16} className="text-indigo-500 shrink-0" />
                  <span><strong>Email:</strong> {foundPatient.email}</span>
                </div>
              </div>

              {/* Appointment History Grid */}
              {showDetails && (
                <div className="mb-5">
                  <h3 className="text-sm font-semibold text-gray-700 mb-3">Appointment History</h3>
                  <div className="overflow-x-auto rounded-lg border border-gray-200">
                    <table className="w-full text-sm">
                      <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
                        <tr>
                          <th className="px-4 py-3 text-left">Date & Time</th>
                          <th className="px-4 py-3 text-left">Doctor</th>
                          <th className="px-4 py-3 text-left">Mode</th>
                          <th className="px-4 py-3 text-left">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {appointments.map((appt, i) => (
                          <tr key={i} className="hover:bg-gray-50">
                            <td className="px-4 py-3 text-gray-700 whitespace-nowrap">{appt.dateTime}</td>
                            <td className="px-4 py-3">
                              <div className="font-medium text-gray-800">{appt.doctor}</div>
                              <div className="text-xs text-gray-400">{appt.specialty}</div>
                            </td>
                            <td className="px-4 py-3 text-gray-600">{appt.mode}</td>
                            <td className="px-4 py-3">
                              <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                                appt.status === "Checked Out" ? "bg-blue-100 text-blue-600" :
                                appt.status === "Checked In" ? "bg-yellow-100 text-yellow-600" :
                                appt.status === "Confirmed" ? "bg-green-100 text-green-600" :
                                "bg-red-100 text-red-500"
                              }`}>
                                {appt.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              <div className="flex justify-end gap-3 pt-2 border-t border-gray-100">
                <button
                  onClick={() => setShowDetails(!showDetails)}
                  className="px-5 py-2 border border-indigo-600 text-indigo-600 rounded-lg text-sm hover:bg-indigo-50 transition"
                >
                  {showDetails ? "Hide Details" : "View Details"}
                </button>
                <button
                  onClick={goToForm}
                  className="px-5 py-2 bg-indigo-600 text-white rounded-lg text-sm hover:bg-indigo-700 transition"
                >
                  New Appointment
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ── NOT FOUND POPUP ── */}
        {showNotFoundPopup && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
            <div className="bg-white w-full max-w-md p-6 rounded-xl shadow-xl relative">
              <button
                onClick={() => setShowNotFoundPopup(false)}
                className="absolute top-3 right-3 text-gray-400 hover:text-gray-700"
              >
                <X size={20} />
              </button>
              <div className="text-center py-4">
                <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <User size={26} className="text-red-400" />
                </div>
                <h2 className="text-lg font-semibold text-gray-800 mb-1">Patient Not Found</h2>
                <p className="text-sm text-gray-500 mb-6">
                  No patient found for{" "}
                  <span className="font-medium text-gray-700">{mobileSearch}</span>.
                  <br />
                  Would you like to register a new patient?
                </p>
                <div className="flex justify-center">
                  <button
                    onClick={goToRegister}
                    className="px-5 py-2 bg-indigo-600 text-white rounded-lg text-sm hover:bg-indigo-700 transition"
                  >
                    Register New Patient
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // ══════════════════════════════════════════════════════════════
  // FULL APPOINTMENT FORM PAGE
  // ══════════════════════════════════════════════════════════════
  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="flex items-center gap-2 mb-6">
        <ArrowLeft size={20} className="cursor-pointer" onClick={goBack} />
        <h1 className="text-xl font-semibold">Create Appointment</h1>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6 max-w-4xl mx-auto">

        <div className="mb-6">
          <label className="block text-sm font-medium mb-2">
            Appointment ID <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={appointmentId}
            disabled
            className="w-full px-4 py-2 border rounded-lg bg-gray-100 text-gray-500"
          />
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-sm font-medium mb-2">
              Patient <span className="text-red-500">*</span>
            </label>
            <select
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
              defaultValue={foundPatient?.name ?? ""}
            >
              <option value="" disabled>Select</option>
              {foundPatient && (
                <option value={foundPatient.name}>{foundPatient.name}</option>
              )}
              <option>John Doe</option>
              <option>Jane Smith</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">
              Department <span className="text-red-500">*</span>
            </label>
            <select className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400">
              <option>Select</option>
              <option>Cardiology</option>
              <option>Orthopedic</option>
            </select>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-sm font-medium mb-2">
              Doctor <span className="text-red-500">*</span>
            </label>
            <select className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400">
              <option>Select</option>
              <option>Dr. Mick Thompson</option>
              <option>Dr. Sarah Johnson</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">
              Appointment Type <span className="text-red-500">*</span>
            </label>
            <select className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400">
              <option>Select</option>
              <option>Online</option>
              <option>In-Person</option>
            </select>
          </div>
        </div>

        {/* <div className="mb-6">
          <label className="block text-sm font-medium mb-2">Clinic</label>
          {clinics.map((clinic, index) => (
            <div key={index} className="flex gap-3 mb-3">
              <select
                value={clinic}
                onChange={(e) => handleClinicChange(e.target.value, index)}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
              >
                <option value="">Select Clinic</option>
                <option>Clinic 1</option>
                <option>Clinic 2</option>
                <option>Clinic 3</option>
              </select>
              {index !== 0 && (
                <button
                  type="button"
                  onClick={() => removeClinic(index)}
                  className="px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                >
                  −
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={addClinic}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition text-sm"
          >
            + Add Clinic
          </button>
        </div> */}

        <div className="grid md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-sm font-medium mb-2">
              Date of Appointment <span className="text-red-500">*</span>
            </label>
            <div className="flex items-center border rounded-lg px-3 py-2 focus-within:ring-2 focus-within:ring-indigo-400">
              <DatePicker
                selected={date}
                onChange={(d) => setDate(d)}
                dateFormat="dd-MM-yyyy"
                className="w-full outline-none text-sm"
              />
              <CalendarDays size={18} className="text-gray-400 shrink-0" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">
              Time <span className="text-red-500">*</span>
            </label>
            <div className="flex items-center border rounded-lg px-3 py-2 focus-within:ring-2 focus-within:ring-indigo-400">
              <DatePicker
                selected={time}
                onChange={(t) => setTime(t)}
                showTimeSelect
                showTimeSelectOnly
                timeIntervals={15}
                timeCaption="Time"
                dateFormat="hh:mm aa"
                className="w-full outline-none text-sm"
              />
              <Clock size={18} className="text-gray-400 shrink-0" />
            </div>
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium mb-2">
            Appointment Reason <span className="text-red-500">*</span>
          </label>
          <textarea
            rows={4}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
            placeholder="Enter reason..."
          />
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium mb-2">
            Status <span className="text-red-500">*</span>
          </label>
          <select className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400">
            <option>Select</option>
            <option>Checked In</option>
            <option>Checked Out</option>
            <option>Confirmed</option>
            <option>Cancelled</option>
          </select>
        </div>

        <div className="flex justify-end gap-4">
          <button
            onClick={goBack}
            className="px-6 py-2 border rounded-lg hover:bg-gray-100 transition text-sm"
          >
            Cancel
          </button>
          <button className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition text-sm">
            Create Appointment
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateAppointment;