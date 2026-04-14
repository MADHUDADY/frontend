import React, { useState } from "react";
import { Pencil, Trash2, Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";

const ViewPatient = () => {
  const navigate = useNavigate();

  const [patients, setPatients] = useState([
    {
      id: 1,
      name: "Mohamed Ali",
      mobile: "+971 501234567",
      email: "mohamed@gmail.com",
      address: "Dubai Marina",
      insurance: "AXA Insurance",
      nationality: "Indian",
      gender: "Male",
      dob: "12-05-1998",
      emiratesId: "784-1998-1234567-1",
    },
    {
      id: 2,
      name: "Aisha Khan",
      mobile: "+971 509876543",
      email: "aisha@gmail.com",
      address: "Abu Dhabi",
      insurance: "Daman",
      nationality: "Pakistani",
      gender: "Female",
      dob: "22-03-1995",
      emiratesId: "784-1995-9876543-2",
    },
  ]);

  const [search, setSearch] = useState("");

  // Delete
  const handleDelete = (id: number) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this patient?"
    );
    if (confirmDelete) {
      setPatients(patients.filter((pat) => pat.id !== id));
    }
  };

  // Search Filter
  const filteredPatients = patients.filter((pat) =>
    pat.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 bg-gray-50 min-h-screen">

      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-semibold">Patient List</h1>

        <button
          onClick={() => navigate("/add-patient")}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
        >
          + Add Patient
        </button>
      </div>

      {/* Search */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search Patient..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="px-4 py-2 border rounded-lg w-72"
        />
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-100 text-gray-700 text-sm">
            <tr>
              <th className="p-4 text-center">Actions</th>
              <th className="p-4">Name</th>
              <th className="p-4">Mobile</th>
              <th className="p-4">Email</th>
              <th className="p-4">Nationality</th>
              <th className="p-4">Gender</th>
              <th className="p-4">DOB</th>
              <th className="p-4">Insurance</th>
            </tr>
          </thead>

          <tbody>
            {filteredPatients.length > 0 ? (
              filteredPatients.map((pat) => (
                <tr
                  key={pat.id}
                  className="border-t hover:bg-gray-50 text-sm"
                >
                     <td className="p-4">
                    <div className="flex justify-center gap-2">

                      {/* View */}
                      <button
                        onClick={() =>
                          navigate(`/view-patient/${pat.id}`)
                        }
                        className="p-2 rounded-lg bg-green-500 text-white hover:bg-green-400"
                      >
                        <Eye size={15} />
                      </button>

                      {/* Edit */}
                      <button
                        onClick={() =>
                          navigate(`/edit-patient/${pat.id}`)
                        }
                        className="p-2 rounded-lg bg-blue-500 text-white hover:bg-blue-400"
                      >
                        <Pencil size={15} />
                      </button>

                      {/* Delete */}
                      <button
                        onClick={() => handleDelete(pat.id)}
                        className="p-2 rounded-lg bg-red-500 text-white hover:bg-red-400"
                      >
                        <Trash2 size={13} />
                      </button>

                    </div>
                  </td>
                  <td className="p-4 font-medium">{pat.name}</td>
                  <td className="p-4">{pat.mobile}</td>
                  <td className="p-4">{pat.email}</td>
                  <td className="p-4">{pat.nationality}</td>
                  <td className="p-4">{pat.gender}</td>
                  <td className="p-4">{pat.dob}</td>
                  <td className="p-4">{pat.insurance}</td>

                 
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={8} className="text-center p-6 text-gray-500">
                  No patients found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ViewPatient;