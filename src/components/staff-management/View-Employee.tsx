// import React, { useState } from "react";
// import { Pencil, Trash2, Eye } from "lucide-react";
// import { useNavigate } from "react-router-dom";

// const ViewEmployee = () => {
//   const navigate = useNavigate();

//   const [employees, setEmployees] = useState([
//     {
//       id: 1,
//       name: "Dr. Mohamed",
//       employeeId: "EMP001",
//       mobile: "+971 565656565",
//       email: "doctor@gmail.com",
//       staffType: "Doctor",
//       designation: "Cardiologist",
//       clinicId: "CLN-001",
//       gender: "Male",
//     },
//     {
//       id: 2,
//       name: "Aisha Khan",
//       employeeId: "EMP002",
//       mobile: "+971 545454545",
//       email: "admin@gmail.com",
//       staffType: "Admin",
//       designation: "HR Manager",
//       clinicId: "CLN-002",
//       gender: "Female",
//     },
//     {
//       id: 3,
//       name: "John Smith",
//       employeeId: "EMP003",
//       mobile: "+971 523456789",
//       email: "reception@gmail.com",
//       staffType: "Reception",
//       designation: "Front Desk",
//       clinicId: "CLN-001",
//       gender: "Male",
//     },
//   ]);

//   const [search, setSearch] = useState("");

//   // Delete Function
//   const handleDelete = (id: number) => {
//     const confirmDelete = window.confirm(
//       "Are you sure you want to delete this employee?"
//     );
//     if (confirmDelete) {
//       setEmployees(employees.filter((emp) => emp.id !== id));
//     }
//   };

//   // Search Filter
//   const filteredEmployees = employees.filter((emp) =>
//     emp.name.toLowerCase().includes(search.toLowerCase())
//   );

//   return (
//     <div className="p-6 bg-gray-50 min-h-screen">

//       {/* Header */}
//       <div className="flex justify-between items-center mb-6">
//         <h1 className="text-xl font-semibold">Employee List</h1>

//         <button
//           onClick={() => navigate("/add-employee")}
//           className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
//         >
//           + Add Employee
//         </button>
//       </div>

//       {/* Search */}
//       <div className="mb-4">
//         <input
//           type="text"
//           placeholder="Search Employee..."
//           value={search}
//           onChange={(e) => setSearch(e.target.value)}
//           className="px-4 py-2 border rounded-lg w-72"
//         />
//       </div>

//       {/* Table */}
//       <div className="bg-white rounded-xl shadow-sm overflow-hidden">
//         <table className="w-full text-left">
//           <thead className="bg-gray-100 text-gray-700 text-sm">
//             <tr>
//               <th className="p-4 text-center">Actions</th>
//               <th className="p-4">Name</th>
//               <th className="p-4">Employee ID</th>
//               <th className="p-4">Mobile</th>
//               <th className="p-4">Email</th>
//               <th className="p-4">Staff Type</th>
//               <th className="p-4">Designation</th>
//               <th className="p-4">Clinic ID</th>
//               <th className="p-4">Gender</th>
//             </tr>
//           </thead>

//           <tbody>
//             {filteredEmployees.length > 0 ? (
//               filteredEmployees.map((emp) => (
//                 <tr
//                   key={emp.id}
//                   className="border-t hover:bg-gray-50 text-sm"
//                 >
//                     <td className="p-4">
//                     <div className="flex justify-center gap-2">

//                       {/* View Button */}
//                       <button
//                         onClick={() =>
//                           navigate(`/view-employee/${emp.id}`)
//                         }
//                         className="p-2 rounded-lg bg-green-500 text-white hover:bg-green-400"
//                       >
//                         <Eye size={15} />
//                       </button>

//                       {/* Edit Button */}
//                       <button
//                         onClick={() =>
//                           navigate(`/edit-employee/${emp.id}`)
//                         }
//                         className="p-2 rounded-lg bg-blue-500 text-white hover:bg-blue-400"
//                       >
//                         <Pencil size={15} />
//                       </button>

//                       {/* Delete Button */}
//                       <button
//                         onClick={() => handleDelete(emp.id)}
//                         className="p-2 rounded-lg bg-red-500 text-white hover:bg-red-400"
//                       >
//                         <Trash2 size={13} />
//                       </button>

//                     </div>
//                   </td>
//                   <td className="p-4 font-medium">{emp.name}</td>
//                   <td className="p-4">{emp.employeeId}</td>
//                   <td className="p-4">{emp.mobile}</td>
//                   <td className="p-4">{emp.email}</td>
//                   <td className="p-4">{emp.staffType}</td>
//                   <td className="p-4">{emp.designation}</td>
//                   <td className="p-4">{emp.clinicId}</td>
//                   <td className="p-4">{emp.gender}</td>

                  
//                 </tr>
//               ))
//             ) : (
//               <tr>
//                 <td colSpan={9} className="text-center p-6 text-gray-500">
//                   No employees found
//                 </td>
//               </tr>
//             )}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// };

// export default ViewEmployee;
import React, { useState, useEffect } from "react";
import { Pencil, Trash2, Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { clinicAPI } from "../../services/api";

const ViewEmployee = () => {
  const navigate = useNavigate();
  const [employees, setEmployees] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      const res = await clinicAPI.getEmployees();
      setEmployees(res.data.data || []);
    } catch (err) {
      console.error(err);
      setError("Failed to load employees. Is backend running?");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Are you sure?")) return;
    // Soft delete — backend lo ACTIVE='N' set avutundi
    setEmployees(employees.filter((e) => e.Id !== id));
  };

  const filtered = employees.filter((e) =>
    (e.EMPNAME || "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-semibold">Employee List</h1>
        <button
          onClick={() => navigate("/dashboard/NewEmployee")}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
        >
          + Add Employee
        </button>
      </div>

      <div className="mb-4">
        <input
          type="text" placeholder="Search Employee..."
          value={search} onChange={(e) => setSearch(e.target.value)}
          className="px-4 py-2 border rounded-lg w-72"
        />
      </div>

      {loading && <p className="text-center py-10 text-gray-500">Loading employees...</p>}
      {error   && <p className="text-center py-4 text-red-500">{error}</p>}

      {!loading && !error && (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-gray-100 text-gray-700 text-sm">
              <tr>
                <th className="p-4 text-center">Actions</th>
                <th className="p-4">Name</th>
                <th className="p-4">Employee ID</th>
                <th className="p-4">Mobile</th>
                <th className="p-4">Email</th>
                <th className="p-4">Role</th>
                <th className="p-4">Department</th>
                <th className="p-4">Clinic ID</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length > 0 ? (
                filtered.map((emp) => (
                  <tr key={emp.Id} className="border-t hover:bg-gray-50 text-sm">
                    <td className="p-4">
                      <div className="flex justify-center gap-2">
                        <button onClick={() => navigate(`/dashboard/ViewEmployee/${emp.Id}`)}
                          className="p-2 rounded-lg bg-green-500 text-white hover:bg-green-400">
                          <Eye size={15} />
                        </button>
                        <button onClick={() => navigate(`/dashboard/EditEmployee/${emp.Id}`)}
                          className="p-2 rounded-lg bg-blue-500 text-white hover:bg-blue-400">
                          <Pencil size={15} />
                        </button>
                        <button onClick={() => handleDelete(emp.Id)}
                          className="p-2 rounded-lg bg-red-500 text-white hover:bg-red-400">
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </td>
                    <td className="p-4 font-medium">{emp.EMPNAME}</td>
                    <td className="p-4">{emp.EMPID}</td>
                    <td className="p-4">{emp.MOBILE || "-"}</td>
                    <td className="p-4">{emp.EMAILID || "-"}</td>
                    <td className="p-4">{emp.ROLE}</td>
                    <td className="p-4">{emp.DEPARTMENT || "-"}</td>
                    <td className="p-4">{emp.CENTERID}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="text-center p-6 text-gray-500">
                    No employees found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ViewEmployee;