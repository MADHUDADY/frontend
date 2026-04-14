import { useState, useRef } from "react";

const clinics = [
  "Al Noor Clinic",
  "Medcare Clinic",
  "Aster Clinic",
  "NMC Clinic",
  "Valiant Clinic",
  "Emirates Hospital Clinic",
  "Medeor Clinic",
  "Zulekha Clinic",
];

const departments = [
  "Cardiology",
  "Dermatology",
  "Emergency Medicine",
  "Endocrinology",
  "Gastroenterology",
  "General Surgery",
  "Internal Medicine",
  "Neurology",
  "Obstetrics & Gynecology",
  "Oncology",
  "Ophthalmology",
  "Orthopedics",
  "Pediatrics",
  "Psychiatry",
  "Radiology",
  "Urology",
];

interface DoctorFormData {
  doctorName: string;
  department: string;
  qualification: string;
  mobile: string;
  email: string;
  idNumber: string;
  licenseNumber: string;
  address: string;
  whatsappNumber: string;
  picture: File | null;
  clinic: string;
  roomNumber: string;
}

const initialForm: DoctorFormData = {
  doctorName: "",
  department: "",
  qualification: "",
  mobile: "",
  email: "",
  idNumber: "",
  licenseNumber: "",
  address: "",
  whatsappNumber: "",
  picture: null,
  clinic: "",
  roomNumber: "",
};

export default function NewDoctorForm() {
  const [form, setForm] = useState<DoctorFormData>(initialForm);
  const [preview, setPreview] = useState<string | null>(null);
  const [errors, setErrors] = useState<Partial<Record<keyof DoctorFormData, string>>>({});
  const [saved, setSaved] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setForm((prev) => ({ ...prev, picture: file }));
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result as string);
      reader.readAsDataURL(file);
    } else {
      setPreview(null);
    }
  };

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof DoctorFormData, string>> = {};
    if (!form.doctorName.trim()) newErrors.doctorName = "Doctor name is required.";
    if (!form.department) newErrors.department = "Department is required.";
    if (!form.mobile.trim()) newErrors.mobile = "Mobile number is required.";
    if (!form.email.trim()) newErrors.email = "Email is required.";
    else if (!/\S+@\S+\.\S+/.test(form.email)) newErrors.email = "Enter a valid email.";
    if (!form.licenseNumber.trim()) newErrors.licenseNumber = "License number is required.";
    if (!form.clinic) newErrors.clinic = "Please select a clinic.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validate()) {
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    }
  };

  const handleReset = () => {
    setForm(initialForm);
    setPreview(null);
    setErrors({});
    setSaved(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const inputClass = (field: keyof DoctorFormData) =>
    `w-full px-3.5 py-2.5 rounded-lg border text-sm text-gray-800 placeholder-gray-400 bg-white transition-all duration-150 outline-none focus:ring-2 focus:ring-gray-400 focus:border-gray-400 ${
      errors[field] ? "border-red-400 bg-red-50" : "border-gray-200 hover:border-gray-300"
    }`;

  const labelClass = "block text-sm font-semibold text-gray-700 mb-1";

  return (
    <div className="min-h-screen bg-gray-50 flex items-start justify-center py-10 px-4">
      <div className="w-full max-w-4xl bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Header */}
        <div className="bg-white border-b border-gray-100 px-8 py-5 flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gray-500 flex items-center justify-center">
            <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <div>
            <h1 className="text-lg font-bold text-gray-900">New Doctor</h1>
            <p className="text-xs text-gray-400">Fill in the details to register a new doctor</p>
          </div>
        </div>

        <div className="px-8 py-7 space-y-7">

          {/* Profile Picture */}
          <div className="flex items-center gap-5">
            <div
              className="w-20 h-20 rounded-xl border-2 border-dashed border-gray-200 bg-gray-50 flex items-center justify-center overflow-hidden cursor-pointer hover:border-gray-400 transition-colors"
              onClick={() => fileInputRef.current?.click()}
            >
              {preview ? (
                <img src={preview} alt="Preview" className="w-full h-full object-cover" />
              ) : (
                <svg className="w-7 h-7 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              )}
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-700 mb-1">Doctor Photo</p>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="text-xs px-3 py-1.5 rounded-lg border border-gray-200 text-gray-600 hover:border-gray-400 hover:text-gray-600 transition-colors font-medium"
              >
                Browse Picture
              </button>
              <p className="text-xs text-gray-400 mt-1">JPG, PNG up to 5MB</p>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
              />
            </div>
          </div>
   {/* Row 5: Clinic + Room Number */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className={labelClass}>Clinic <span className="text-red-500">*</span></label>
              <select
                name="clinic"
                value={form.clinic}
                onChange={handleChange}
                className={inputClass("clinic")}
              >
                <option value="">Select clinic</option>
                {clinics.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
              {errors.clinic && <p className="text-xs text-red-500 mt-1">{errors.clinic}</p>}
            </div>
            <div>
              <label className={labelClass}>Room Number</label>
              <input
                type="text"
                name="roomNumber"
                value={form.roomNumber}
                onChange={handleChange}
                placeholder="Enter room number"
                className={inputClass("roomNumber")}
              />
            </div>
          </div>
          {/* Row 1: Name + Department */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className={labelClass}>Doctor Name <span className="text-red-500">*</span></label>
              <input
                type="text"
                name="doctorName"
                value={form.doctorName}
                onChange={handleChange}
                placeholder="Enter doctor name"
                className={inputClass("doctorName")}
              />
              {errors.doctorName && <p className="text-xs text-red-500 mt-1">{errors.doctorName}</p>}
            </div>
            <div>
              <label className={labelClass}>Department <span className="text-red-500">*</span></label>
              <select
                name="department"
                value={form.department}
                onChange={handleChange}
                className={inputClass("department")}
              >
                <option value="">Select department</option>
                {departments.map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
              {errors.department && <p className="text-xs text-red-500 mt-1">{errors.department}</p>}
            </div>
          </div>

          {/* Row 2: Qualification + License Number */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className={labelClass}>Qualification</label>
              <input
                type="text"
                name="qualification"
                value={form.qualification}
                onChange={handleChange}
                placeholder="e.g. MBBS, MD, FRCS"
                className={inputClass("qualification")}
              />
            </div>
            <div>
              <label className={labelClass}>License Number <span className="text-red-500">*</span></label>
              <input
                type="text"
                name="licenseNumber"
                value={form.licenseNumber}
                onChange={handleChange}
                placeholder="Enter license number"
                className={inputClass("licenseNumber")}
              />
              {errors.licenseNumber && <p className="text-xs text-red-500 mt-1">{errors.licenseNumber}</p>}
            </div>
          </div>

          {/* Row 3: Mobile + WhatsApp */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className={labelClass}>Mobile <span className="text-red-500">*</span></label>
              <input
                type="tel"
                name="mobile"
                value={form.mobile}
                onChange={handleChange}
                placeholder="Enter mobile number"
                className={inputClass("mobile")}
              />
              {errors.mobile && <p className="text-xs text-red-500 mt-1">{errors.mobile}</p>}
            </div>
            <div>
              <label className={labelClass}>WhatsApp Number</label>
              <input
                type="tel"
                name="whatsappNumber"
                value={form.whatsappNumber}
                onChange={handleChange}
                placeholder="Enter WhatsApp number"
                className={inputClass("whatsappNumber")}
              />
            </div>
          </div>

          {/* Row 4: Email + ID Number */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className={labelClass}>Email <span className="text-red-500">*</span></label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="Enter email address"
                className={inputClass("email")}
              />
              {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
            </div>
            <div>
              <label className={labelClass}>ID Number</label>
              <input
                type="text"
                name="idNumber"
                value={form.idNumber}
                onChange={handleChange}
                placeholder="Enter ID number"
                className={inputClass("idNumber")}
              />
            </div>
          </div>

       

          {/* Address */}
          <div>
            <label className={labelClass}>Address</label>
            <textarea
              name="address"
              value={form.address}
              onChange={handleChange}
              placeholder="Enter address"
              rows={3}
              className={`${inputClass("address")} resize-none`}
            />
          </div>

          {/* Success message */}
          {saved && (
            <div className="flex items-center gap-2 px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-700 font-medium">
              <svg className="w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Doctor saved successfully!
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-2 border-t border-gray-100">
            <button
              type="button"
              onClick={handleReset}
              className="px-5 py-2.5 rounded-lg border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 hover:border-gray-300 transition-colors"
            >
              Reset
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              className="px-6 py-2.5 rounded-lg bg-green-500 hover:bg-green-600 active:bg-green-700 text-white text-sm font-semibold transition-colors shadow-sm"
            >
              Save Doctor
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}