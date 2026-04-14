import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

interface PatientForm {
  patientName: string;
  mobile: string;
  email: string;
  address: string;
  insurance: string;
  nationality: string;
  gender: string;
  emiratesId: string;
}

const NewPatient = () => {
  const [formData, setFormData] = useState<PatientForm>({
    patientName: "",
    mobile: "",
    email: "",
    address: "",
    insurance: "",
    nationality: "",
    gender: "",
    emiratesId: "",
  });

  const [dob, setDob] = useState<Date | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!dob) {
      alert("Please select Date of Birth");
      return;
    }

    const finalData = {
      ...formData,
      dob: dob.toISOString().split("T")[0],
    };

    console.log("Patient Data:", finalData);
    alert("Patient Saved Successfully!");
  };

  return (
    <div className="bg-gray-100 min-h-screen p-6">
      <div className="bg-white rounded-xl shadow-md p-6 max-w-5xl mx-auto">
        <h2 className="text-xl font-semibold mb-6">New Patient</h2>

        <form onSubmit={handleSubmit}>
          <div className="grid md:grid-cols-2 gap-6">

            {/* Patient Name */}
            <div>
              <label className="block mb-1 font-medium">
                Patient Name *
              </label>
              <input
                type="text"
                name="patientName"
                value={formData.patientName}
                onChange={handleChange}
                className="w-full border rounded-lg px-3 py-2"
                placeholder="Enter patient name"
                required
              />
            </div>

            {/* Mobile */}
            <div>
              <label className="block mb-1 font-medium">
                Mobile *
              </label>
              <input
                type="tel"
                name="mobile"
                value={formData.mobile}
                onChange={handleChange}
                className="w-full border rounded-lg px-3 py-2"
                placeholder="Enter mobile number"
                required
              />
            </div>

            {/* Email */}
            <div>
              <label className="block mb-1 font-medium">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full border rounded-lg px-3 py-2"
                placeholder="Enter email"
              />
            </div>

            {/* Emirates ID */}
            <div>
              <label className="block mb-1 font-medium">
                Emirates ID
              </label>
              <input
                type="text"
                name="emiratesId"
                value={formData.emiratesId}
                onChange={handleChange}
                className="w-full border rounded-lg px-3 py-2"
                placeholder="Enter Emirates ID"
              />
            </div>

            {/* Nationality */}
            <div>
              <label className="block mb-1 font-medium">
                Nationality
              </label>
              <input
                type="text"
                name="nationality"
                value={formData.nationality}
                onChange={handleChange}
                className="w-full border rounded-lg px-3 py-2"
                placeholder="Enter nationality"
              />
            </div>

            {/* Insurance */}
            <div>
              <label className="block mb-1 font-medium">
                Insurance
              </label>
              <input
                type="text"
                name="insurance"
                value={formData.insurance}
                onChange={handleChange}
                className="w-full border rounded-lg px-3 py-2"
                placeholder="Enter insurance"
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
                required
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>

            {/* Date of Birth */}
            <div>
              <label className="block mb-1 font-medium">
                Date of Birth *
              </label>
              <DatePicker
                selected={dob}
                onChange={(date) => setDob(date)}
                dateFormat="yyyy-MM-dd"
                placeholderText="Select date"
                className="w-full border rounded-lg px-3 py-2"
                maxDate={new Date()}
                showYearDropdown
                scrollableYearDropdown
              />
            </div>

            {/* Address */}
            <div className="md:col-span-2">
              <label className="block mb-1 font-medium">
                Address
              </label>
              <textarea
                name="address"
                value={formData.address}
                onChange={handleChange}
                rows={3}
                className="w-full border rounded-lg px-3 py-2"
                placeholder="Enter address"
              />
            </div>

          </div>

          {/* Save Button */}
          <div className="flex justify-end mt-6">
            <button
              type="submit"
              className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700"
            >
              Save Patient
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default NewPatient;