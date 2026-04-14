import React, { useState } from "react";
import { Pencil, Trash2, Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";

const ViewClinic = () => {
  const navigate = useNavigate();

  const [clinics, setClinics] = useState([
    {
      id: 1,
      name: "City Care Clinic",
      location: "Dubai",
      email: "citycare@gmail.com",
      mobile: "+971 565656565",
      incharge: "Dr. Ahmed",
      license: "LIC-2025-001",
    },
    {
      id: 2,
      name: "Sunrise Medical Center",
      location: "Abu Dhabi",
      email: "sunrise@gmail.com",
      mobile: "+971 545454545",
      incharge: "Dr. Sarah",
      license: "LIC-2025-002",
    },
    {
      id: 3,
      name: "Health Plus Clinic",
      location: "Sharjah",
      email: "healthplus@gmail.com",
      mobile: "+971 523456789",
      incharge: "Dr. John",
      license: "LIC-2025-003",
    },
  ]);

  // Delete Function
  const handleDelete = (id: number) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this clinic?"
    );
    if (confirmDelete) {
      setClinics(clinics.filter((clinic) => clinic.id !== id));
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">

      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-semibold">Clinic List</h1>

        <button
          onClick={() => navigate("/add-clinic")}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
        >
          + Add Clinic
        </button>
      </div>

      {/* Search */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search Clinic..."
          className="px-4 py-2 border rounded-lg w-72"
        />
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-100 text-gray-700 text-sm">
            <tr>
              <th className="p-4 text-center">Actions</th>
              <th className="p-4">Clinic Name</th>
              <th className="p-4">Location</th>
              <th className="p-4">Email</th>
              <th className="p-4">Mobile</th>
              <th className="p-4">Clinic Incharge</th>
              <th className="p-4">License No</th>
            </tr>
          </thead>

          <tbody>
            {clinics.map((clinic) => (
              <tr
                key={clinic.id}
                className="border-t hover:bg-gray-50 text-sm"
              >
                  <td className="p-4">
                  <div className="flex justify-center gap-2">

                    {/* View Button */}
                    <button
                      onClick={() =>
                        navigate(`/view-clinic/${clinic.id}`)
                      }
                      className="p-2 rounded-lg bg-green-500 text-white hover:bg-green-400"
                    >
                      <Eye size={15} />
                    </button>

                    {/* Edit Button */}
                    <button
                      onClick={() =>
                        navigate(`/edit-clinic/${clinic.id}`)
                      }
                      className="p-2 rounded-lg bg-blue-500 text-white hover:bg-blue-400"
                    >
                      <Pencil size={15} />
                    </button>

                    {/* Delete Button */}
                    <button
                      onClick={() => handleDelete(clinic.id)}
                      className="p-2 rounded-lg bg-red-500 text-white hover:bg-red-400"
                    >
                      <Trash2 size={13} />
                    </button>

                  </div>
                </td>
                <td className="p-4 font-medium">
                  {clinic.name}
                </td>

                <td className="p-4">{clinic.location}</td>

                <td className="p-4">{clinic.email}</td>

                <td className="p-4">{clinic.mobile}</td>

                <td className="p-4">{clinic.incharge}</td>

                <td className="p-4">{clinic.license}</td>

              
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ViewClinic;