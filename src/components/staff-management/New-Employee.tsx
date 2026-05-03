import React, { useState, useEffect } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { employeeAPI, clinicAPI } from "../../services/api";

const STAFF_TYPES = ["Admin", "Doctor", "Call Centre", "Reception", "Patient", "Staff"];
const GENDERS     = ["Male", "Female", "Other"];

const EmployeeForm: React.FC = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    EMPID:       "",
    EMPNAME:     "",
    PWD:         "",
    MOBILE:      "",
    EMAILID:     "",
    ROLE:        "",
    DEPARTMENT:  "",
    GENDER:      "",
    CENTERID:    "",   // selected from clinic dropdown
  });

  const [clinics,   setClinics]   = useState<{ ID: number; COMPANYNAME: string; COMPANYID: string }[]>([]);
  const [showPassword, setShowPassword] = useState(false);
  const [errors,   setErrors]   = useState<Record<string, string>>({});
  const [saving,   setSaving]   = useState(false);
  const [success,  setSuccess]  = useState(false);
  const [apiError, setApiError] = useState("");

  // Fetch clinics on mount
  useEffect(() => {
    const fetchClinics = async () => {
      try {
        const res = await clinicAPI.getClinics();
        setClinics(res.data.data || []);
      } catch {
        // If fetch fails, fallback — user can still type
      }
    };
    fetchClinics();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
    setApiError("");
  };

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!formData.EMPNAME.trim())  errs.EMPNAME  = "Employee name required";
    if (!formData.EMPID.trim())    errs.EMPID    = "Employee ID required";
    if (!formData.PWD.trim())      errs.PWD      = "Password required";
    if (!formData.ROLE)            errs.ROLE     = "Staff type required";
    if (!formData.GENDER)          errs.GENDER   = "Gender required";
    if (!formData.CENTERID)        errs.CENTERID = "Clinic required";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    try {
      setSaving(true);
      setApiError("");
      await employeeAPI.create(formData);
      setSuccess(true);
      setTimeout(() => navigate("/dashboard/ViewEmployee"), 1500);
    } catch (err: any) {
      setApiError(err?.response?.data?.message || "Failed to save. Check backend connection.");
    } finally {
      setSaving(false);
    }
  };

  const inputCls = (field: string) =>
    `w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 ${
      errors[field] ? "border-red-400 bg-red-50" : "border-gray-300"
    }`;

  if (success) {
    return (
      <div className="bg-gray-100 min-h-screen p-6 flex items-center justify-center">
        <div className="bg-white rounded-xl shadow p-8 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">✅</span>
          </div>
          <h2 className="text-xl font-semibold text-green-700 mb-2">Employee Saved!</h2>
          <p className="text-gray-500">Redirecting to employee list...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-100 min-h-screen p-6">
      <div className="bg-white rounded-xl shadow-md p-6 max-w-3xl mx-auto">

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold">New Employee</h2>
          <button onClick={() => navigate("/dashboard/ViewEmployee")}
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

            {/* Employee Name */}
            <div>
              <label className="block mb-1 font-medium text-sm">Employee Name *</label>
              <input name="EMPNAME" value={formData.EMPNAME} onChange={handleChange}
                placeholder="Enter employee name" className={inputCls("EMPNAME")} />
              {errors.EMPNAME && <p className="text-red-500 text-xs mt-1">{errors.EMPNAME}</p>}
            </div>

            {/* Employee ID */}
            <div>
              <label className="block mb-1 font-medium text-sm">Employee ID *</label>
              <input name="EMPID" value={formData.EMPID} onChange={handleChange}
                placeholder="e.g. EMP001" className={inputCls("EMPID")} />
              {errors.EMPID && <p className="text-red-500 text-xs mt-1">{errors.EMPID}</p>}
            </div>

            {/* Password */}
            <div className="relative">
              <label className="block mb-1 font-medium text-sm">Password *</label>
              <input name="PWD" type={showPassword ? "text" : "password"}
                value={formData.PWD} onChange={handleChange}
                placeholder="Enter password" className={`${inputCls("PWD")} pr-10`} />
              <button type="button" onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-8 text-gray-400">
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
              {errors.PWD && <p className="text-red-500 text-xs mt-1">{errors.PWD}</p>}
            </div>

            {/* Mobile */}
            <div>
              <label className="block mb-1 font-medium text-sm">Mobile Number</label>
              <input name="MOBILE" type="tel" value={formData.MOBILE} onChange={handleChange}
                placeholder="Enter mobile number" className={inputCls("MOBILE")} />
            </div>

            {/* Email */}
            <div>
              <label className="block mb-1 font-medium text-sm">Email ID</label>
              <input name="EMAILID" type="email" value={formData.EMAILID} onChange={handleChange}
                placeholder="Enter email" className={inputCls("EMAILID")} />
            </div>

            {/* Staff Type */}
            <div>
              <label className="block mb-1 font-medium text-sm">Staff Type *</label>
              <select name="ROLE" value={formData.ROLE} onChange={handleChange}
                className={inputCls("ROLE")}>
                <option value="">Select Staff Type</option>
                {STAFF_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
              {errors.ROLE && <p className="text-red-500 text-xs mt-1">{errors.ROLE}</p>}
            </div>

            {/* Department */}
            <div>
              <label className="block mb-1 font-medium text-sm">Department</label>
              <input name="DEPARTMENT" value={formData.DEPARTMENT} onChange={handleChange}
                placeholder="Enter department" className={inputCls("DEPARTMENT")} />
            </div>

            {/* Gender */}
            <div>
              <label className="block mb-1 font-medium text-sm">Gender *</label>
              <select name="GENDER" value={formData.GENDER} onChange={handleChange}
                className={inputCls("GENDER")}>
                <option value="">Select Gender</option>
                {GENDERS.map((g) => <option key={g} value={g}>{g}</option>)}
              </select>
              {errors.GENDER && <p className="text-red-500 text-xs mt-1">{errors.GENDER}</p>}
            </div>

            {/* Clinic — full width */}
            <div className="md:col-span-2">
              <label className="block mb-1 font-medium text-sm">Assign Clinic *</label>
              <select name="CENTERID" value={formData.CENTERID} onChange={handleChange}
                className={inputCls("CENTERID")}>
                <option value="">Select Clinic</option>
                {clinics.length > 0 ? (
                  clinics.map((c) => (
                    <option key={c.ID} value={c.COMPANYID}>
                      {c.COMPANYNAME} ({c.COMPANYID})
                    </option>
                  ))
                ) : (
                  // Fallback if API not ready yet
                  <option value="101">Paradise Medical Center (101)</option>
                )}
              </select>
              {errors.CENTERID && <p className="text-red-500 text-xs mt-1">{errors.CENTERID}</p>}
            </div>

          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-3 mt-6">
            <button type="button" onClick={() => navigate("/dashboard/ViewEmployee")}
              className="px-5 py-2 border rounded-lg text-gray-600 hover:bg-gray-50 text-sm">
              Cancel
            </button>
            <button type="submit" disabled={saving}
              className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 disabled:opacity-60 flex items-center gap-2 text-sm">
              {saving ? (
                <><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"/>Saving...</>
              ) : "Save Employee"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EmployeeForm;