import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

interface EmployeeFormData {
  employeeName: string;
  employeeId: string;
  password: string;
  mobileNumber: string;
  email: string;
  staffType: string;
  designation: string;
  clinicId: string;
  gender: string;
}

const STAFF_TYPES = [
  "Admin",
  "Doctor",
  "Call Centre",
  "Reception",
  "Patient",
];

const GENDERS = ["Male", "Female", "Other"];

const EmployeeForm: React.FC = () => {
  const [formData, setFormData] = useState<EmployeeFormData>({
    employeeName: "",
    employeeId: "",
    password: "",
    mobileNumber: "",
    email: "",
    staffType: "",
    designation: "",
    clinicId: "",
    gender: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Partial<EmployeeFormData>>({});

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validate = () => {
    const newErrors: Partial<EmployeeFormData> = {};

    if (!formData.employeeName) newErrors.employeeName = "Required";
    if (!formData.employeeId) newErrors.employeeId = "Required";
    if (!formData.password) newErrors.password = "Required";
    if (!formData.mobileNumber) newErrors.mobileNumber = "Required";
    if (!formData.email) newErrors.email = "Required";
    if (!formData.staffType) newErrors.staffType = "Required";
    if (!formData.designation) newErrors.designation = "Required";
    if (!formData.clinicId) newErrors.clinicId = "Required";
    if (!formData.gender) newErrors.gender = "Required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (validate()) {
      console.log("Employee Data:", formData);
      alert("Employee Saved Successfully!");
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen p-6">
      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-xl font-semibold mb-6">Employee Details</h2>

        <form onSubmit={handleSubmit}>
          <div className="grid md:grid-cols-2 gap-6">
            {/* Employee Name */}
            <div>
              <label className="block mb-1 font-medium">
                Employee Name *
              </label>
              <input
                type="text"
                name="employeeName"
                placeholder="Enter employee name"
                value={formData.employeeName}
                onChange={handleChange}
                className="w-full border rounded-lg px-3 py-2"
              />
              {errors.employeeName && (
                <p className="text-red-500 text-sm">
                  {errors.employeeName}
                </p>
              )}
            </div>

            {/* Employee ID */}
            <div>
              <label className="block mb-1 font-medium">
                Employee ID *
              </label>
              <input
                type="text"
                name="employeeId"
                placeholder="Enter employee ID"
                value={formData.employeeId}
                onChange={handleChange}
                className="w-full border rounded-lg px-3 py-2"
              />
            </div>

            {/* Password */}
            <div className="relative">
              <label className="block mb-1 font-medium">
                Password *
              </label>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Enter password"
                value={formData.password}
                onChange={handleChange}
                className="w-full border rounded-lg px-3 py-2 pr-10"
              />
              <span
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-9 cursor-pointer"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </span>
            </div>

            {/* Mobile Number */}
            <div>
              <label className="block mb-1 font-medium">
                Mobile Number *
              </label>
              <input
                type="tel"
                name="mobileNumber"
                placeholder="Enter mobile number"
                value={formData.mobileNumber}
                onChange={handleChange}
                className="w-full border rounded-lg px-3 py-2"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block mb-1 font-medium">
                Email ID *
              </label>
              <input
                type="email"
                name="email"
                placeholder="Enter email"
                value={formData.email}
                onChange={handleChange}
                className="w-full border rounded-lg px-3 py-2"
              />
            </div>

            {/* Staff Type */}
            <div>
              <label className="block mb-1 font-medium">
                Staff Type *
              </label>
              <select
                name="staffType"
                value={formData.staffType}
                onChange={handleChange}
                className="w-full border rounded-lg px-3 py-2"
              >
                <option value="">Select Staff Type</option>
                {STAFF_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            {/* Designation */}
            <div>
              <label className="block mb-1 font-medium">
                Designation *
              </label>
              <input
                type="text"
                name="designation"
                placeholder="Enter designation"
                value={formData.designation}
                onChange={handleChange}
                className="w-full border rounded-lg px-3 py-2"
              />
            </div>

            {/* Clinic ID */}
            <div>
              <label className="block mb-1 font-medium">
                Clinic ID *
              </label>
              <input
                type="text"
                name="clinicId"
                placeholder="Enter clinic ID"
                value={formData.clinicId}
                onChange={handleChange}
                className="w-full border rounded-lg px-3 py-2"
              />
            </div>

            {/* Gender */}
            <div>
              <label className="block mb-1 font-medium">
                Gender *
              </label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="w-full border rounded-lg px-3 py-2"
              >
                <option value="">Select Gender</option>
                {GENDERS.map((gender) => (
                  <option key={gender} value={gender}>
                    {gender}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end mt-6">
            <button
              type="submit"
              className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700"
            >
              Save Employee
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EmployeeForm;