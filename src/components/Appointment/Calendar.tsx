import React, { useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  CalendarDays,
  Filter,
  Plus,
} from "lucide-react";

const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const AppointmentCalendar: React.FC = () => {
  const today = new Date();
  const [currentDate, setCurrentDate] = useState<Date>(
    new Date(2026, 2, 1) // March 2026
  );
  const [selectedDate, setSelectedDate] = useState<number>(2);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const prevMonthDays = new Date(year, month, 0).getDate();

  const generateCalendar = () => {
    const days: { day: number; currentMonth: boolean }[] = [];

    // Previous month days
    for (let i = firstDayOfMonth - 1; i >= 0; i--) {
      days.push({
        day: prevMonthDays - i,
        currentMonth: false,
      });
    }

    // Current month days
    for (let i = 1; i <= daysInMonth; i++) {
      days.push({
        day: i,
        currentMonth: true,
      });
    }

    // Fill remaining cells (42 total)
    while (days.length < 42) {
      days.push({
        day: days.length - daysInMonth - firstDayOfMonth + 1,
        currentMonth: false,
      });
    }

    return days;
  };

  const calendarDays = generateCalendar();

  const goPrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const goNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const goToday = () => {
    setCurrentDate(today);
    setSelectedDate(today.getDate());
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {/* Top Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Appointment</h1>

        <div className="flex gap-3">
          <button className="px-4 py-2 border rounded-lg bg-white">
            Export
          </button>

          <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg flex items-center gap-2">
            <Plus size={16} />
            New Appointment
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-4 py-2 border rounded-lg bg-white">
            <CalendarDays size={16} />
            2 Mar 26 - 2 Mar 26
          </div>
        </div>

        <div className="flex gap-3">
          <button className="px-4 py-2 border rounded-lg bg-white flex items-center gap-2">
            <Filter size={16} />
            Filters
          </button>

          <select className="px-4 py-2 border rounded-lg bg-white">
            <option>Sort By : Recent</option>
          </select>
        </div>
      </div>

      {/* Calendar Card */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        {/* Calendar Header */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <button
              onClick={goToday}
              className="px-4 py-2 bg-indigo-500 text-white rounded-lg"
            >
              today
            </button>

            <button
              onClick={goPrevMonth}
              className="p-2 border rounded-lg"
            >
              <ChevronLeft size={18} />
            </button>

            <button
              onClick={goNextMonth}
              className="p-2 border rounded-lg"
            >
              <ChevronRight size={18} />
            </button>
          </div>

          <h2 className="text-lg font-semibold">
            {currentDate.toLocaleString("default", {
              month: "long",
              year: "numeric",
            }).toUpperCase()}
          </h2>

          <div className="flex gap-2">
            <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg">
              month
            </button>
            <button className="px-4 py-2 border rounded-lg">week</button>
            <button className="px-4 py-2 border rounded-lg">day</button>
          </div>
        </div>

        {/* Week Days Header */}
        <div className="grid grid-cols-7 border">
          {daysOfWeek.map((day) => (
            <div
              key={day}
              className="text-center py-3 border-r last:border-r-0 font-medium bg-gray-50"
            >
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 border-t">
          {calendarDays.map((d, index) => (
            <div
              key={index}
              onClick={() =>
                d.currentMonth && setSelectedDate(d.day)
              }
              className={`h-32 border-r border-b p-2 cursor-pointer
              ${
                !d.currentMonth
                  ? "bg-gray-50 text-gray-400"
                  : "bg-white"
              }
              ${
                d.day === selectedDate && d.currentMonth
                  ? "bg-indigo-100"
                  : ""
              }
              `}
            >
              <div
                className={`w-7 h-7 flex items-center justify-center rounded-full text-sm
                ${
                  d.day === selectedDate && d.currentMonth
                    ? "bg-indigo-600 text-white"
                    : ""
                }
                `}
              >
                {d.day}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AppointmentCalendar;