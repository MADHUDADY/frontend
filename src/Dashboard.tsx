import { Routes, Route, Navigate } from "react-router-dom";

import AppLayout        from "./layout/AppLayout";
import Home             from "./pages/Dashboard/Home";

import Appointments     from "./components/Appointment/Appointments";
import NewAppointments  from "./components/Appointment/NewAppointment";
import Calendar         from "./components/Appointment/Calendar";
import NewClinic        from "./components/clinic/NewClinic";
import ViewClinic       from "./components/clinic/ViewClinic";
import NewEmployee      from "./components/staff-management/New-Employee";
import ViewEmployee     from "./components/staff-management/View-Employee";
import NewPatient       from "./components/Patient-management/New-Patient";
import ViewPatient      from "./components/Patient-management/View-Patient";
import Newbook          from "./components/MeetingRoom/newbook";
import Viewbook         from "./components/MeetingRoom/viewbook";
import Newdoctor        from "./components/doctor/Newdoctor";
import DoctorsDetails   from "./components/doctor/DoctorsDetails";
import Locations        from "./pages/Locations";
import Services         from "./pages/Services";
import Specializations  from "./pages/Specializations";
import Assets           from "./pages/Assets";
import Activities       from "./pages/Activities";
import Messages         from "./pages/Messages";
import HelpdeskPage     from "./components/helpdesk/HelpdeskPage";
import {
  HRMStaffs, HRMDepartments, HRMDesignation,
  HRMAttendance, HRMLeaves, HRMHolidays, HRMPayroll,
} from "./pages/HRM";
import {
  FinanceExpenses, FinanceIncome, FinanceInvoices,
  FinancePayments, FinanceTransactions,
} from "./pages/Finance";

// ── Admin only guard ──────────────────────────────────────────────────────────
function AdminOnly({ children }: { children: React.ReactNode }) {
  const role = localStorage.getItem("role") || "";
  const ok   = role === "Admin" || role === "ADMIN";
  return ok ? <>{children}</> : <Navigate to="/dashboard" replace />;
}

export default function Dashboard() {
  return (
    <Routes>
      <Route element={<AppLayout />}>

        {/* ✅ Everyone */}
        <Route index                   element={<Home />} />
        <Route path="NewPatient"       element={<NewPatient />} />
        <Route path="ViewPatient"      element={<ViewPatient />} />
        <Route path="NewAppointments"  element={<NewAppointments />} />
        <Route path="Appointments"     element={<Appointments />} />
        <Route path="Calendar"         element={<Calendar />} />
        <Route path="Helpdesk"         element={<HelpdeskPage />} />
        <Route path="Messages"         element={<Messages />} />
        <Route path="Activities"       element={<Activities />} />

        {/* 🔒 Admin only — Clinic */}
        <Route path="NewClinic"        element={<AdminOnly><NewClinic /></AdminOnly>} />
        <Route path="ViewClinic"       element={<AdminOnly><ViewClinic /></AdminOnly>} />

        {/* 🔒 Admin only — Staff */}
        <Route path="NewEmployee"      element={<AdminOnly><NewEmployee /></AdminOnly>} />
        <Route path="ViewEmployee"     element={<AdminOnly><ViewEmployee /></AdminOnly>} />

        {/* 🔒 Admin only — Doctors */}
        <Route path="Allergy"          element={<AdminOnly><Newdoctor /></AdminOnly>} />
        <Route path="Newdoctor"        element={<AdminOnly><Newdoctor /></AdminOnly>} />
        <Route path="DoctorsDetails"   element={<AdminOnly><DoctorsDetails /></AdminOnly>} />

        {/* 🔒 Admin only — Meeting Room */}
        <Route path="Newbook"          element={<AdminOnly><Newbook /></AdminOnly>} />
        <Route path="Viewbook"         element={<AdminOnly><Viewbook /></AdminOnly>} />

        {/* 🔒 Admin only — Masters */}
        <Route path="Locations"        element={<AdminOnly><Locations /></AdminOnly>} />
        <Route path="Services"         element={<AdminOnly><Services /></AdminOnly>} />
        <Route path="Specializations"  element={<AdminOnly><Specializations /></AdminOnly>} />
        <Route path="Assets"           element={<AdminOnly><Assets /></AdminOnly>} />

        {/* 🔒 Admin only — HRM */}
        <Route path="hrm/staffs"       element={<AdminOnly><HRMStaffs /></AdminOnly>} />
        <Route path="hrm/departments"  element={<AdminOnly><HRMDepartments /></AdminOnly>} />
        <Route path="hrm/designation"  element={<AdminOnly><HRMDesignation /></AdminOnly>} />
        <Route path="hrm/attendance"   element={<AdminOnly><HRMAttendance /></AdminOnly>} />
        <Route path="hrm/leaves"       element={<AdminOnly><HRMLeaves /></AdminOnly>} />
        <Route path="hrm/holidays"     element={<AdminOnly><HRMHolidays /></AdminOnly>} />
        <Route path="hrm/payroll"      element={<AdminOnly><HRMPayroll /></AdminOnly>} />

        {/* 🔒 Admin only — Finance */}
        <Route path="finance/expenses"     element={<AdminOnly><FinanceExpenses /></AdminOnly>} />
        <Route path="finance/income"       element={<AdminOnly><FinanceIncome /></AdminOnly>} />
        <Route path="finance/invoices"     element={<AdminOnly><FinanceInvoices /></AdminOnly>} />
        <Route path="finance/payments"     element={<AdminOnly><FinancePayments /></AdminOnly>} />
        <Route path="finance/transactions" element={<AdminOnly><FinanceTransactions /></AdminOnly>} />

      </Route>
    </Routes>
  );
}