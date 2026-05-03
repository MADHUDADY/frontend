// import { Routes, Route } from "react-router-dom";

// import AppLayout        from "./layout/AppLayout";
// import Home             from "./pages/Dashboard/Home";

// // existing pages
// import Allergy          from "./components/New/Allergy&Immunology";
// import Appointments     from "./components/Appointment/Appointments";
// import NewAppointments  from "./components/Appointment/NewAppointment";
// import Calendar         from "./components/Appointment/Calendar";
// import NewClinic        from "./components/clinic/NewClinic";
// import ViewClinic       from "./components/clinic/ViewClinic";
// import NewEmployee      from "./components/staff-management/New-Employee";
// import ViewEmployee     from "./components/staff-management/View-Employee";
// import NewPatient       from "./components/Patient-management/New-Patient";
// import ViewPatient      from "./components/Patient-management/View-Patient";
// import Newbook          from "./components/MeetingRoom/newbook";
// import Viewbook         from "./components/MeetingRoom/viewbook";
// import Newdoctor        from "./components/doctor/Newdoctor";
// import DoctorsDetails   from "./components/doctor/DoctorsDetails";

// // new sidebar pages  ← put these files in src/pages/
// import Locations        from "./pages/Locations";
// import Services         from "./pages/Services";
// import Specializations  from "./pages/Specializations";
// import Assets           from "./pages/Assets";
// import Activities       from "./pages/Activities";
// import Messages         from "./pages/Messages";

// // HRM pages
// import {
//   HRMStaffs,
//   HRMDepartments,
//   HRMDesignation,
//   HRMAttendance,
//   HRMLeaves,
//   HRMHolidays,
//   HRMPayroll,
// } from "./pages/HRM";

// // Finance pages
// import {
//   FinanceExpenses,
//   FinanceIncome,
//   FinanceInvoices,
//   FinancePayments,
//   FinanceTransactions,
// } from "./pages/Finance";

// export default function Dashboard() {
//   return (
//     <Routes>
//       <Route element={<AppLayout />}>

//         {/* Home */}
//         <Route index                        element={<Home />} />

//         {/* Clinic */}
//         <Route path="NewClinic"             element={<NewClinic />} />
//         <Route path="ViewClinic"            element={<ViewClinic />} />

//         {/* Staff */}
//         <Route path="NewEmployee"           element={<NewEmployee />} />
//         <Route path="ViewEmployee"          element={<ViewEmployee />} />

//         {/* Patient */}
//         <Route path="NewPatient"            element={<NewPatient />} />
//         <Route path="ViewPatient"           element={<ViewPatient />} />

//         {/* Doctors */}
//         <Route path="Allergy"              element={<Allergy />} />
//         <Route path="Newdoctor"            element={<Newdoctor />} />
//         <Route path="DoctorsDetails"       element={<DoctorsDetails />} />

//         {/* Appointments */}
//         <Route path="NewAppointments"      element={<NewAppointments />} />
//         <Route path="Appointments"         element={<Appointments />} />
//         <Route path="Calendar"             element={<Calendar />} />

//         {/* Meeting Room */}
//         <Route path="Newbook"              element={<Newbook />} />
//         <Route path="Viewbook"             element={<Viewbook />} />

//         {/* Sidebar bottom — now fully working */}
//         <Route path="Locations"            element={<Locations />} />
//         <Route path="Services"             element={<Services />} />
//         <Route path="Specializations"      element={<Specializations />} />
//         <Route path="Assets"               element={<Assets />} />
//         <Route path="Activities"           element={<Activities />} />
//         <Route path="Messages"             element={<Messages />} />

//         {/* HRM */}
//         <Route path="hrm/staffs"           element={<HRMStaffs />} />
//         <Route path="hrm/departments"      element={<HRMDepartments />} />
//         <Route path="hrm/designation"      element={<HRMDesignation />} />
//         <Route path="hrm/attendance"       element={<HRMAttendance />} />
//         <Route path="hrm/leaves"           element={<HRMLeaves />} />
//         <Route path="hrm/holidays"         element={<HRMHolidays />} />
//         <Route path="hrm/payroll"          element={<HRMPayroll />} />

//         {/* Finance & Accounts */}
//         <Route path="finance/expenses"     element={<FinanceExpenses />} />
//         <Route path="finance/income"       element={<FinanceIncome />} />
//         <Route path="finance/invoices"     element={<FinanceInvoices />} />
//         <Route path="finance/payments"     element={<FinancePayments />} />
//         <Route path="finance/transactions" element={<FinanceTransactions />} />

//       </Route>
//     </Routes>
//   );
// }
import { Routes, Route } from "react-router-dom";

import AppLayout        from "./layout/AppLayout";
import Home             from "./pages/Dashboard/Home";

// existing pages
import Allergy          from "./components/New/Allergy&Immunology";
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

// sidebar pages
import Locations        from "./pages/Locations";
import Services         from "./pages/Services";
import Specializations  from "./pages/Specializations";
import Assets           from "./pages/Assets";
import Activities       from "./pages/Activities";
import Messages         from "./pages/Messages";

// HRM pages
import {
  HRMStaffs,
  HRMDepartments,
  HRMDesignation,
  HRMAttendance,
  HRMLeaves,
  HRMHolidays,
  HRMPayroll,
} from "./pages/HRM";

// Finance pages
import {
  FinanceExpenses,
  FinanceIncome,
  FinanceInvoices,
  FinancePayments,
  FinanceTransactions,
} from "./pages/Finance";

export default function Dashboard() {
  return (
    <Routes>
      <Route element={<AppLayout />}>

        {/* Home */}
        <Route index                        element={<Home />} />

        {/* Clinic */}
        <Route path="NewClinic"             element={<NewClinic />} />
        <Route path="ViewClinic"            element={<ViewClinic />} />

        {/* Staff */}
        <Route path="NewEmployee"           element={<NewEmployee />} />
        <Route path="ViewEmployee"          element={<ViewEmployee />} />

        {/* Patient */}
        <Route path="NewPatient"            element={<NewPatient />} />
        <Route path="ViewPatient"           element={<ViewPatient />} />

        {/* Doctors */}
        <Route path="Allergy"              element={<Allergy />} />
        <Route path="Newdoctor"            element={<Newdoctor />} />
        <Route path="DoctorsDetails"       element={<DoctorsDetails />} />

        {/* Appointments */}
        <Route path="NewAppointments"      element={<NewAppointments />} />
        <Route path="Appointments"         element={<Appointments />} />
        <Route path="Calendar"             element={<Calendar />} />

        {/* Meeting Room */}
        <Route path="Newbook"              element={<Newbook />} />
        <Route path="Viewbook"             element={<Viewbook />} />

        {/* Sidebar bottom */}
        <Route path="Locations"            element={<Locations />} />
        <Route path="Services"             element={<Services />} />
        <Route path="Specializations"      element={<Specializations />} />
        <Route path="Assets"               element={<Assets />} />
        <Route path="Activities"           element={<Activities />} />
        <Route path="Messages"             element={<Messages />} />

        {/* HRM */}
        <Route path="hrm/staffs"           element={<HRMStaffs />} />
        <Route path="hrm/departments"      element={<HRMDepartments />} />
        <Route path="hrm/designation"      element={<HRMDesignation />} />
        <Route path="hrm/attendance"       element={<HRMAttendance />} />
        <Route path="hrm/leaves"           element={<HRMLeaves />} />
        <Route path="hrm/holidays"         element={<HRMHolidays />} />
        <Route path="hrm/payroll"          element={<HRMPayroll />} />

        {/* Finance & Accounts */}
        <Route path="finance/expenses"     element={<FinanceExpenses />} />
        <Route path="finance/income"       element={<FinanceIncome />} />
        <Route path="finance/invoices"     element={<FinanceInvoices />} />
        <Route path="finance/payments"     element={<FinancePayments />} />
        <Route path="finance/transactions" element={<FinanceTransactions />} />

      </Route>
    </Routes>
  );
}