import { Routes, Route } from "react-router-dom";



import AppLayout from "./layout/AppLayout";
import Home from "./pages/Dashboard/Home";


import Allergy from "./components//New/Allergy&Immunology";
import Appointments from "./components/Appointment/Appointments";
import NewAppointments from "./components/Appointment/NewAppointment";
import Calendar from "./components/Appointment/Calendar";
import NewClinic from "./components/clinic/NewClinic";

import ViewClinic from "./components/clinic/ViewClinic";
import NewEmployee from "./components/staff-management/New-Employee";
import ViewEmployee from "./components/staff-management/View-Employee";

import NewPatient from "./components/Patient-management/New-Patient";
import ViewPatient from "./components/Patient-management/View-Patient";

import Newbook from "./components/MeetingRoom/newbook";
import Viewbook from "./components/MeetingRoom/viewbook";
import Newdoctor from "./components/doctor/Newdoctor";
import DoctorsDetails from "./components/doctor/DoctorsDetails";








export default function Dashboard() {
  return (
    <>
      {/* <ScrollToTop /> */}

      <Routes>

        {/* Dashboard Layout */}
        <Route element={<AppLayout />}>

          <Route index element={<Home />} />


          <Route path="Allergy" element={<Allergy />} />
          <Route path="Appointments" element={<Appointments />} />
          <Route path="NewAppointments" element={<NewAppointments />} />
          <Route path="Calendar" element={<Calendar />} />
          <Route path="NewClinic" element={<NewClinic />} />
          <Route path="ViewClinic" element={<ViewClinic />} />

          <Route path="NewEmployee" element={<NewEmployee />} />
          <Route path="ViewEmployee" element={<ViewEmployee />} />
          <Route path="NewPatient" element={<NewPatient />} />
          <Route path="ViewPatient" element={<ViewPatient />} />
          <Route path="Newbook" element={<Newbook />} />
          <Route path="Viewbook" element={<Viewbook />} />
          <Route path="Newdoctor" element={<Newdoctor />} />
          <Route path="DoctorsDetails" element={<DoctorsDetails />} />


          
        </Route>
      </Routes>
    </>
  );
}