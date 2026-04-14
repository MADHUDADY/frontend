import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { CalendarDays, MoreVertical, Plus } from "lucide-react";

type Status =
  | "Checked Out"
  | "Checked In"
  | "Cancelled"
  | "Schedule"
  | "Confirmed";

interface Appointment {
  id: number;
  date: Date;
  patient: string;
  phone: string;
  patientImage: string;
  doctor: string;
  specialization: string;
  doctorImage: string;
  mode: string;
  status: Status;
}

const initialAppointments: Appointment[] = [
  {
    id: 1,
    date: new Date("2025-04-30T09:30:00"),
    patient: "Alberto Ripley",
    phone: "+1 56556 54565",
    patientImage: "/images/doctor/bg-clinic.png",
    doctor: "Dr. Mick Thompson",
    specialization: "Cardiologist",
    doctorImage: "/images/doctor/bg-clinic.png",
    mode: "In-person",
    status: "Checked Out",
  },
  {
    id: 2,
    date: new Date("2025-04-15T11:20:00"),
    patient: "Susan Babin",
    phone: "+1 65658 95654",
    patientImage: "/images/doctor/bg-clinic.png",
    doctor: "Dr. Sarah Johnson",
    specialization: "Orthopedic Surgeon",
    doctorImage: "/images/doctor/bg-clinic.png",
    mode: "Online",
    status: "Checked In",
  },
  {
    id: 3,
    date: new Date("2025-04-02T08:15:00"),
    patient: "Carol Lam",
    phone: "+1 55654 56647",
    patientImage: "/images/doctor/bg-clinic.png",
    doctor: "Dr. Emily Carter",
    specialization: "Pediatrician",
    doctorImage: "/images/doctor/bg-clinic.png",
    mode: "In-Person",
    status: "Cancelled",
  },
];

const statusStyles: Record<Status, string> = {
  "Checked Out": "bg-blue-100 text-blue-600",
  "Checked In": "bg-yellow-100 text-yellow-600",
  Cancelled: "bg-red-100 text-red-600",
  Schedule: "bg-indigo-100 text-indigo-600",
  Confirmed: "bg-green-100 text-green-600",
};

const AppointmentPage: React.FC = () => {
  const [search, setSearch] = useState("");
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

  const filteredAppointments = initialAppointments.filter((item) => {
    const matchesSearch =
      item.patient.toLowerCase().includes(search.toLowerCase()) ||
      item.phone.includes(search);

    const matchesDate =
      (!startDate || item.date >= startDate) &&
      (!endDate || item.date <= endDate);

    return matchesSearch && matchesDate;
  });

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">Appointment</h1>

        <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg">
          <Plus size={16} />
          New Appointment
        </button>
      </div>

      {/* Search + Date Filter */}
      <div className="flex flex-wrap gap-4 mb-6">
        <input
          type="text"
          placeholder="Search patient or phone..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="px-4 py-2 border rounded-lg w-64 focus:ring-2 focus:ring-indigo-500"
        />

        <div className="flex items-center gap-2 border px-3 py-2 rounded-lg bg-white">
          <CalendarDays size={16} />
          <DatePicker
            selected={startDate}
            onChange={(date) => setStartDate(date)}
            placeholderText="Start Date"
            className="outline-none"
            popperClassName="z-50"
          />
        </div>

        <div className="flex items-center gap-2 border px-3 py-2 rounded-lg bg-white">
          <CalendarDays size={16} />
          <DatePicker
            selected={endDate}
            onChange={(date) => setEndDate(date)}
            placeholderText="End Date"
            className="outline-none"
            popperClassName="z-50"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-gray-100 text-gray-600 text-sm">
            <tr>
              <th className="px-6 py-4">Date & Time</th>
              <th className="px-6 py-4">Patient</th>
              <th className="px-6 py-4">Doctor</th>
              <th className="px-6 py-4">Mode</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4"></th>
            </tr>
          </thead>

          <tbody>
            {filteredAppointments.map((item) => (
              <tr key={item.id} className="border-t hover:bg-gray-50">
                {/* Date */}
                <td className="px-6 py-4 text-sm">
                  {item.date.toLocaleString()}
                </td>

                {/* Patient with Photo */}
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <img
                      src={item.patientImage}
                      alt={item.patient}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div>
                      <p className="font-medium">{item.patient}</p>
                      <p className="text-sm text-gray-500">{item.phone}</p>
                    </div>
                  </div>
                </td>

                {/* Doctor with Photo */}
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <img
                      src={item.doctorImage}
                      alt={item.doctor}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div>
                      <p className="font-medium">{item.doctor}</p>
                      <p className="text-sm text-gray-500">
                        {item.specialization}
                      </p>
                    </div>
                  </div>
                </td>

                <td className="px-6 py-4 text-sm">{item.mode}</td>

                <td className="px-6 py-4">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      statusStyles[item.status]
                    }`}
                  >
                    {item.status}
                  </span>
                </td>

                <td className="px-6 py-4 text-right">
                  <MoreVertical size={16} />
                </td>
              </tr>
            ))}

            {filteredAppointments.length === 0 && (
              <tr>
                <td colSpan={6} className="text-center py-6 text-gray-500">
                  No appointments found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AppointmentPage;