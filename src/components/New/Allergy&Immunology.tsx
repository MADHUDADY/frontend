import React, { useState } from "react";
import { Menu } from "lucide-react";

interface Doctor {
  id: number;
  name: string;
  specialization: string;
  image: string;
}

const doctorsData: Doctor[] = [
  {
    id: 1,
    name: "Dr. Mohamed Saifeldin",
    specialization: "Pulmonology Specialist",
    image: "/images/doctor/doctor1.png",
  },
  {
    id: 2,
    name: "Dr. Haitham Morsi",
    specialization: "HOD, Specialist Otolaryngology",
    image: "/images/doctor/doctor1.png",
  },
  {
    id: 3,
    name: "Dr. Anwar Alroubaie",
    specialization: "Oncology Consultant",
    image: "/images/doctor/doctor1.png",
  },
  {
    id: 4,
    name: "Dr. Ahmed El Awad",
    specialization: "Specialist Endocrinologist",
    image: "/images/doctor/doctor1.png",
  },
  {
    id: 5,
    name: "Dr. Mohammed Al Azani",
    specialization: "Consultant Vascular & Endovascular",
    image: "/images/doctor/doctor1.png",
  },
  {
    id: 6,
    name: "Dr. Wael Roshdy Salama",
    specialization: "Specialist General Surgery",
    image: "/images/doctor/doctor1.png",
  },
  {
    id: 7,
    name: "Dr. Mohanad Qahwash",
    specialization: "Consultant Orthopedic & Trauma",
    image: "/images/doctor/doctor1.png",
  },
  {
    id: 8,
    name: "Dr. Basim Alkhafaji",
    specialization: "HOD, Consultant Laparoscopic",
    image: "/images/doctor/doctor1.png",
  },
  {
    id: 9,
    name: "Dr. Imad Hashim Ahmed",
    specialization: "Neuro & Spine Surgery Consultant",
    image: "/images/doctor/doctor1.png",
  },
];

const DoctorsPage: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const doctorsPerPage = 6;

  const indexOfLastDoctor = currentPage * doctorsPerPage;
  const indexOfFirstDoctor = indexOfLastDoctor - doctorsPerPage;
  const currentDoctors = doctorsData.slice(
    indexOfFirstDoctor,
    indexOfLastDoctor
  );

  const totalPages = Math.ceil(doctorsData.length / doctorsPerPage);

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-10">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-semibold text-gray-800">Doctors</h1>

        <button className="flex items-center gap-2 bg-gray-100 px-4 py-2 rounded-full text-gray-700 hover:bg-gray-200 transition">
          <Menu size={18} />
          Sort By
        </button>
      </div>

      {/* Doctors Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {currentDoctors.map((doctor) => (
          <div
            key={doctor.id}
            className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col items-center text-center hover:shadow-md transition"
          >
            <img
              src={doctor.image}
              alt={doctor.name}
              className="w-full h-56 object-cover rounded-xl mb-4"
            />

            <h2 className="text-lg font-semibold text-indigo-900 mb-1">
              {doctor.name}
            </h2>

            <p className="text-gray-500 text-sm mb-6">
              {doctor.specialization}
            </p>

            <button className="px-6 py-2 border border-indigo-700 text-indigo-700 rounded-full hover:bg-indigo-700 hover:text-white transition">
              Book Appointment
            </button>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex justify-center items-center gap-3 mt-10">
        <button
          disabled={currentPage === 1}
          onClick={() => setCurrentPage((prev) => prev - 1)}
          className="px-3 py-1 rounded-full bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
        >
          {"<"}
        </button>

        {[...Array(totalPages)].map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentPage(index + 1)}
            className={`w-9 h-9 rounded-full ${
              currentPage === index + 1
                ? "bg-indigo-700 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            } transition`}
          >
            {index + 1}
          </button>
        ))}

        <button
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage((prev) => prev + 1)}
          className="px-3 py-1 rounded-full bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
        >
          {">"}
        </button>
      </div>
    </div>
  );
};

export default DoctorsPage;