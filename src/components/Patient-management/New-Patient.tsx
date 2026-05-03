import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { patientAPI } from "../../services/api";

const GENDERS = ["Male", "Female", "Other"];

const defaultForm = () => ({
  PatientName:  "",
  Age:          "",
  DOB:          "",
  Gender:       "",
  Mobile:       "",
  Address:      "",
  Email:        "",
  RegNo:        "",
  ClinicId:     "101",
  ClinicName:   "",
  TicketNumber: "",
});

const NewPatient = () => {
  const navigate  = useNavigate();
  const mobileRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const nameRef   = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [formData,     setFormData]     = useState(defaultForm());
  const [errors,       setErrors]       = useState<Record<string, string>>({});
  const [saving,       setSaving]       = useState(false);
  const [success,      setSuccess]      = useState(false);
  const [apiError,     setApiError]     = useState("");
  const [existingSlno, setExistingSlno] = useState<number | null>(null);
  const [showModal,    setShowModal]    = useState(false);
  const [foundPatient, setFoundPatient] = useState<any>(null);

  const checkByMobile = async (mobile: string) => {
    if (mobile.length < 10) return;
    try {
      const res = await patientAPI.checkMobile(mobile);
      if (res.data?.exists) { setFoundPatient(res.data.data); setShowModal(true); }
    } catch { }
  };

  const checkByName = async (name: string) => {
    if (name.length < 3) return;
    try {
      const res = await patientAPI.checkName(name);
      if (res.data?.exists && !showModal) { setFoundPatient(res.data.data); setShowModal(true); }
    } catch { }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: "" }));
    setApiError("");
    if (name === "Mobile") {
      if (mobileRef.current) clearTimeout(mobileRef.current);
      mobileRef.current = setTimeout(() => checkByMobile(value), 600);
    }
    if (name === "PatientName") {
      if (nameRef.current) clearTimeout(nameRef.current);
      nameRef.current = setTimeout(() => checkByName(value), 800);
    }
  };

  const handleAutofill = () => {
    if (!foundPatient) return;
    setFormData(prev => ({
      ...prev,
      PatientName: foundPatient.PatientName || prev.PatientName,
      Age:         foundPatient.Age         ?? prev.Age,
      DOB:         foundPatient.DOB         ? foundPatient.DOB.slice(0, 10) : prev.DOB,
      Gender:      foundPatient.Gender      || prev.Gender,
      Mobile:      foundPatient.Mobile      || prev.Mobile,
      Address:     foundPatient.Address     || prev.Address,
      Email:       foundPatient.Email       || prev.Email,
      RegNo:       foundPatient.RegNo       || prev.RegNo,
    }));
    setExistingSlno(foundPatient.SLNO || null);
    setShowModal(false);
  };

  const handleModalNo = () => {
    setShowModal(false); setFoundPatient(null); setExistingSlno(null);
  };

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!formData.PatientName.trim())           errs.PatientName = "Patient name required";
    if (!formData.Mobile.trim())                errs.Mobile      = "Mobile number required";
    else if (!/^\d{10}$/.test(formData.Mobile)) errs.Mobile      = "Enter valid 10-digit mobile";
    if (!formData.Gender)                       errs.Gender      = "Gender required";
    if (!formData.Age && !formData.DOB)         errs.Age         = "Age or Date of Birth required";
    if (formData.Email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.Email))
                                                errs.Email       = "Invalid email format";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    try {
      setSaving(true);
      setApiError("");
      const payload = {
        ...formData,
        VisitDate: new Date().toISOString().slice(0, 10),
      };
      existingSlno
        ? await patientAPI.update(existingSlno, payload)
        : await patientAPI.create(payload);
      setSuccess(true);
      setTimeout(() => navigate("/dashboard/ViewPatient"), 1500);
    } catch (err: any) {
      setApiError(err?.response?.data?.message || "Failed to save. Check backend.");
    } finally {
      setSaving(false);
    }
  };

  const inputCls = (f: string) =>
    `w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 ${
      errors[f] ? "border-red-400 bg-red-50" : "border-gray-300"
    }`;

  if (success) {
    return (
      <div className="bg-gray-100 min-h-screen p-6 flex items-center justify-center">
        <div className="bg-white rounded-xl shadow p-8 text-center">
          <div className="text-5xl mb-4">✅</div>
          <h2 className="text-xl font-semibold text-green-700 mb-2">Patient Saved!</h2>
          <p className="text-gray-500">Redirecting to patient list...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-100 min-h-screen p-6">

      {/* Duplicate Modal */}
      {showModal && foundPatient && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-sm mx-4">
            <div className="text-center mb-4">
              <div className="text-4xl mb-2">⚠️</div>
              <h3 className="text-lg font-semibold text-gray-800">Patient Already Exists</h3>
              <p className="text-sm text-gray-500 mt-1">
                <span className="font-medium text-indigo-600">{foundPatient.PatientName}</span> found in database.
                Do you want to autofill details?
              </p>
            </div>
            <div className="flex gap-3 mt-4">
              <button onClick={handleModalNo}
                className="flex-1 py-2 border border-gray-300 rounded-lg text-sm text-gray-600 hover:bg-gray-50">
                No, Enter New
              </button>
              <button onClick={handleAutofill}
                className="flex-1 py-2 bg-indigo-600 text-white rounded-lg text-sm hover:bg-indigo-700">
                Yes, Autofill
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-md p-6 max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold">
            New Patient
            {existingSlno && (
              <span className="ml-2 text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full">
                Updating existing record
              </span>
            )}
          </h2>
          <button onClick={() => navigate("/dashboard/ViewPatient")}
            className="text-sm text-gray-500 hover:text-gray-700 border px-3 py-1 rounded-lg">
            ← Back
          </button>
        </div>

        {apiError && (
          <div className="mb-4 p-3 bg-red-100 border border-red-300 text-red-700 rounded-lg text-sm">
            ❌ {apiError}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="grid md:grid-cols-2 gap-5">

            <div>
              <label className="block mb-1 font-medium text-sm">Patient Name *</label>
              <input name="PatientName" value={formData.PatientName} onChange={handleChange}
                placeholder="Enter patient name" className={inputCls("PatientName")} />
              {errors.PatientName && <p className="text-red-500 text-xs mt-1">{errors.PatientName}</p>}
            </div>

            <div>
              <label className="block mb-1 font-medium text-sm">Mobile Number *</label>
              <input name="Mobile" type="tel" value={formData.Mobile} onChange={handleChange}
                placeholder="Enter 10-digit mobile" maxLength={10} className={inputCls("Mobile")} />
              {errors.Mobile && <p className="text-red-500 text-xs mt-1">{errors.Mobile}</p>}
            </div>

            <div>
              <label className="block mb-1 font-medium text-sm">Age *</label>
              <input name="Age" type="number" value={formData.Age} onChange={handleChange}
                placeholder="Enter age" min={0} max={150} className={inputCls("Age")} />
              {errors.Age && <p className="text-red-500 text-xs mt-1">{errors.Age}</p>}
            </div>

            <div>
              <label className="block mb-1 font-medium text-sm">Date of Birth</label>
              <input name="DOB" type="date" value={formData.DOB} onChange={handleChange}
                className={inputCls("DOB")} />
            </div>

            <div>
              <label className="block mb-1 font-medium text-sm">Gender *</label>
              <select name="Gender" value={formData.Gender} onChange={handleChange}
                className={inputCls("Gender")}>
                <option value="">Select Gender</option>
                {GENDERS.map(g => <option key={g} value={g}>{g}</option>)}
              </select>
              {errors.Gender && <p className="text-red-500 text-xs mt-1">{errors.Gender}</p>}
            </div>

            <div>
              <label className="block mb-1 font-medium text-sm">Email (Optional)</label>
              <input name="Email" type="email" value={formData.Email} onChange={handleChange}
                placeholder="Enter email" className={inputCls("Email")} />
              {errors.Email && <p className="text-red-500 text-xs mt-1">{errors.Email}</p>}
            </div>

            <div>
              <label className="block mb-1 font-medium text-sm">Registration No</label>
              <input name="RegNo" value={formData.RegNo} onChange={handleChange}
                placeholder="e.g. A12345" className={inputCls("RegNo")} />
            </div>

            <div className="md:col-span-2">
              <label className="block mb-1 font-medium text-sm">Address</label>
              <textarea name="Address" value={formData.Address} onChange={handleChange}
                placeholder="Enter address" rows={3}
                className={`${inputCls("Address")} resize-none`} />
            </div>

          </div>

          <div className="flex justify-end gap-3 mt-6">
            <button type="button" onClick={() => navigate("/dashboard/ViewPatient")}
              className="px-5 py-2 border rounded-lg text-gray-600 hover:bg-gray-50 text-sm">
              Cancel
            </button>
            <button type="submit" disabled={saving}
              className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 disabled:opacity-60 flex items-center gap-2 text-sm">
              {saving ? (
                <><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"/>Saving...</>
              ) : existingSlno ? "Update Patient" : "Save Patient"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewPatient;