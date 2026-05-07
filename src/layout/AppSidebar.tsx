// // import { useCallback, useEffect, useRef, useState } from "react";
// // import { Link, useLocation } from "react-router";
// // // import { AiOutlineStock } from "react-icons/ai";

// // import { ChevronDownIcon, GridIcon, HorizontaLDots } from "../icons";
// // import { useSidebar } from "../context/SidebarContext";
// // import { FaUserDoctor } from "react-icons/fa6";
// // import { MdOutlineSpatialAudioOff } from "react-icons/md";
// // import { FaRegCalendarAlt } from "react-icons/fa";
// // import { FaLocationDot } from "react-icons/fa6";
// // import { FaUserCog } from "react-icons/fa";
// // import { FaUserShield } from "react-icons/fa6";
// // import { TbAsset } from "react-icons/tb";
// // import { FiActivity } from "react-icons/fi";
// // import { TbMessages } from "react-icons/tb";
// // import { SiCssdesignawards } from "react-icons/si";
// // import { MdAccountBalance } from "react-icons/md";
// // import { FaClinicMedical } from "react-icons/fa";
// // import { FaUserNurse } from "react-icons/fa";

// // import { FaUsers } from "react-icons/fa";



// // type NavItem = {
// //   name: string;
// //   icon: React.ReactNode;
// //   path?: string;
// //   subItems?: { name: string; path: string; pro?: boolean; new?: boolean }[];
// // };

// // const navItems: NavItem[] = [
// //   {
// //     icon: <GridIcon />,
// //     name: "Dashboard",
// //     path: "/Dashboard",
// //   },
// //     {
// //     icon: <FaClinicMedical />,
// //     name: "Clinic",
// //     path: "/Dashboard",
// //     subItems: [
// //       { name: "New Clinic", path: "/dashboard/Newclinic", pro: false },
// //       { name: "View Clinic", path: "/dashboard/ViewClinic", pro: false },
// //     ],
// //   },
// //   {
// //     icon: <FaUserNurse />,
// //     name: " Staff-Management",
// //     path: "/Dashboard",
// //     subItems: [
// //       { name: "New Employee", path: "/dashboard/NewEmployee", pro: false },
// //       { name: "View Employee", path: "/dashboard/ViewEmployee", pro: false },
// //     ],
// //   },
// //   {
// //     icon: <FaUsers />,
// //     name: " Patient-Management",
// //     path: "/Dashboard",
// //     subItems: [
// //       { name: "New Patient", path: "/dashboard/NewPatient", pro: false },
// //       { name: "View Patient", path: "/dashboard/ViewPatient", pro: false },
// //     ],
// //   },
  
// //   {
// //     icon: <FaUserDoctor />,
// //     name: "Doctors",
// //     path: "/Dashboard",
// //     subItems: [
// //       { name: "Doctors", path: "/dashboard/Allergy", pro: false },
// //       { name: "Add Doctor", path: "/dashboard/Newdoctor", pro: false },
// //       { name: "Doctors Details", path: "/dashboard/DoctorsDetails", pro: false },
// //       { name: "Doctor-Schedule", path: "/dashboard/", pro: false },
    
// //     ],
// //   },
// //     {
// //     icon: <MdOutlineSpatialAudioOff  />,
// //     name: "Patients",
// //     path: "/Dashboard",
// //     subItems: [
// //       { name: "Patients", path: "/dashboard", pro: false },
// //       { name: "Patients Details", path: "/dashboard/", pro: false },
// //       { name: "Create Patients", path: "/dashboard/", pro: false },
     
    
// //     ],
// //   },
// //    {
// //     icon: <FaRegCalendarAlt  />,
// //     name: "Appointments",
// //     path: "/Dashboard",
// //     subItems: [
// //       { name: "New Appointment", path: "/dashboard/NewAppointments", pro: false },
// //       { name: "Appointments", path: "/dashboard/Appointments", pro: false },
// //       { name: "Calendar", path: "/dashboard/Calendar", pro: false },
// //     ],
// //   },
// //    {
// //     icon: <FaRegCalendarAlt  />,
// //     name: "Meeting Room",
// //     path: "/Dashboard",
// //     subItems: [
// //       { name: "New book", path: "/dashboard/Newbook", pro: false },
// //       { name: "View book", path: "/dashboard/Viewbook", pro: false },
// //     ],
// //   },
// //      {
// //     icon: <FaLocationDot  />,
// //     name: "Locations",
// //     path: "/",
// //   },
// //     {
// //     icon: <FaUserCog  />,
// //     name: "Services",
// //     path: "/",
// //   },
// //     {
// //     icon: <FaUserShield />,
// //     name: "Specializations",
// //     path: "/",
// //   },
// //      {
// //     icon: <TbAsset   />,
// //     name: "Assets",
// //     path: "/",
// //   },
// //      {
// //     icon: <FiActivity  />,
// //     name: "Activities",
// //     path: "/",
// //   },
// //    {
// //     icon: <TbMessages  />,
// //     name: "Messages",
// //     path: "/",
// //   },
// //   {
// //     icon: <SiCssdesignawards  />,
// //     name: "HRM",
// //     path: "/Dashboard",
// //     subItems: [
// //       { name: "Staffs", path: "/dashboard/", pro: false },
// //       { name: "Departments", path: "/dashboard/", pro: false },
// //       { name: "Designation", path: "/dashboard/", pro: false },
// //       { name: "Attendance", path: "/dashboard/", pro: false },
// //       { name: "Leaves", path: "/dashboard/", pro: false },
// //       { name: "Holidays", path: "/dashboard/", pro: false },
// //       { name: "Payroll", path: "/dashboard/", pro: false },
// //     ],
// //   },
// //   {
// //     name: "Finance & Accounts",
// //     icon: <MdAccountBalance   />,
// //     subItems: [{ name: "Expenses", path:"/dashboard/", pro: false },
// // { name: "Income", path:"/dashboard/Allergy", pro: false },
// // { name: "Invoices", path:"/dashboard/Allergy", pro: false },
// // { name: "Payments", path:"/dashboard/Allergy", pro: false },
// //  { name: "Transactions", path:"/dashboard/Allergy", pro: false },
// //     ],

// //   },
// // ];

// // const othersItems: NavItem[] = [];

// // const AppSidebar: React.FC = () => {
// //   const { isExpanded, isMobileOpen, isHovered, setIsHovered } = useSidebar();
// //   const location = useLocation();

// //   const [openSubmenu, setOpenSubmenu] = useState<{
// //     type: "main" | "others";
// //     index: number;
// //   } | null>(null);
// //   const [subMenuHeight, setSubMenuHeight] = useState<Record<string, number>>(
// //     {},
// //   );
// //   const subMenuRefs = useRef<Record<string, HTMLDivElement | null>>({});

// //   // const isActive = (path: string) => location.pathname === path;
// //   const isActive = useCallback(
// //     (path: string) => location.pathname === path,
// //     [location.pathname],
// //   );

// //   useEffect(() => {
// //     let submenuMatched = false;
// //     ["main", "others"].forEach((menuType) => {
// //       const items = menuType === "main" ? navItems : othersItems;
// //       items.forEach((nav, index) => {
// //         if (nav.subItems) {
// //           nav.subItems.forEach((subItem) => {
// //             if (isActive(subItem.path)) {
// //               setOpenSubmenu({
// //                 type: menuType as "main" | "others",
// //                 index,
// //               });
// //               submenuMatched = true;
// //             }
// //           });
// //         }
// //       });
// //     });

// //     if (!submenuMatched) {
// //       setOpenSubmenu(null);
// //     }
// //   }, [location, isActive]);

// //   useEffect(() => {
// //     if (openSubmenu !== null) {
// //       const key = `${openSubmenu.type}-${openSubmenu.index}`;
// //       if (subMenuRefs.current[key]) {
// //         setSubMenuHeight((prevHeights) => ({
// //           ...prevHeights,
// //           [key]: subMenuRefs.current[key]?.scrollHeight || 0,
// //         }));
// //       }
// //     }
// //   }, [openSubmenu]);

// //   const handleSubmenuToggle = (index: number, menuType: "main" | "others") => {
// //     setOpenSubmenu((prevOpenSubmenu) => {
// //       if (
// //         prevOpenSubmenu &&
// //         prevOpenSubmenu.type === menuType &&
// //         prevOpenSubmenu.index === index
// //       ) {
// //         return null;
// //       }
// //       return { type: menuType, index };
// //     });
// //   };

// //   const renderMenuItems = (items: NavItem[], menuType: "main" | "others") => (
// //     <ul className="flex flex-col gap-4">
// //       {items.map((nav, index) => (
// //         <li key={nav.name}>
// //           {nav.subItems ? (
// //             <button
// //               onClick={() => handleSubmenuToggle(index, menuType)}
// //               className={`menu-item group ${
// //                 openSubmenu?.type === menuType && openSubmenu?.index === index
// //                   ? "menu-item-active"
// //                   : "menu-item-inactive"
// //               } cursor-pointer ${
// //                 !isExpanded && !isHovered
// //                   ? "lg:justify-center"
// //                   : "lg:justify-start"
// //               }`}
// //             >
// //               <span
// //                 className={`menu-item-icon-size  ${
// //                   openSubmenu?.type === menuType && openSubmenu?.index === index
// //                     ? "menu-item-icon-active"
// //                     : "menu-item-icon-inactive"
// //                 }`}
// //               >
// //                 {nav.icon}
// //               </span>
// //               {(isExpanded || isHovered || isMobileOpen) && (
// //                 <span className="menu-item-text">{nav.name}</span>
// //               )}
// //               {(isExpanded || isHovered || isMobileOpen) && (
// //                 <ChevronDownIcon
// //                   className={`ml-auto w-5 h-5 transition-transform duration-200 ${
// //                     openSubmenu?.type === menuType &&
// //                     openSubmenu?.index === index
// //                       ? "rotate-180 text-brand-500"
// //                       : ""
// //                   }`}
// //                 />
// //               )}
// //             </button>
// //           ) : (
// //             nav.path && (
// //               <Link
// //                 to={nav.path}
// //                 className={`menu-item group ${
// //                   isActive(nav.path) ? "menu-item-active" : "menu-item-inactive"
// //                 }`}
// //               >
// //                 <span
// //                   className={`menu-item-icon-size ${
// //                     isActive(nav.path)
// //                       ? "menu-item-icon-active"
// //                       : "menu-item-icon-inactive"
// //                   }`}
// //                 >
// //                   {nav.icon}
// //                 </span>
// //                 {(isExpanded || isHovered || isMobileOpen) && (
// //                   <span className="menu-item-text">{nav.name}</span>
// //                 )}
// //               </Link>
// //             )
// //           )}
// //           {nav.subItems && (isExpanded || isHovered || isMobileOpen) && (
// //             <div
// //               ref={(el) => {
// //                 subMenuRefs.current[`${menuType}-${index}`] = el;
// //               }}
// //               className="overflow-hidden transition-all duration-300"
// //               style={{
// //                 height:
// //                   openSubmenu?.type === menuType && openSubmenu?.index === index
// //                     ? `${subMenuHeight[`${menuType}-${index}`]}px`
// //                     : "0px",
// //               }}
// //             >
// //               <ul className="mt-2 space-y-1 ml-9">
// //                 {nav.subItems.map((subItem) => (
// //                   <li key={subItem.name}>
// //                     <Link
// //                       to={subItem.path}
// //                       className={`menu-dropdown-item ${
// //                         isActive(subItem.path)
// //                           ? "menu-dropdown-item-active"
// //                           : "menu-dropdown-item-inactive"
// //                       }`}
// //                     >
// //                       {subItem.name}
// //                       <span className="flex items-center gap-1 ml-auto">
// //                         {subItem.new && (
// //                           <span
// //                             className={`ml-auto ${
// //                               isActive(subItem.path)
// //                                 ? "menu-dropdown-badge-active"
// //                                 : "menu-dropdown-badge-inactive"
// //                             } menu-dropdown-badge`}
// //                           >
// //                             new
// //                           </span>
// //                         )}
// //                         {subItem.pro && (
// //                           <span
// //                             className={`ml-auto ${
// //                               isActive(subItem.path)
// //                                 ? "menu-dropdown-badge-active"
// //                                 : "menu-dropdown-badge-inactive"
// //                             } menu-dropdown-badge`}
// //                           >
// //                             pro
// //                           </span>
// //                         )}
// //                       </span>
// //                     </Link>
// //                   </li>
// //                 ))}
// //               </ul>
// //             </div>
// //           )}
// //         </li>
// //       ))}
// //     </ul>
// //   );

// //   return (
// //     <aside
// //       className={`fixed mt-16 flex flex-col lg:mt-0 top-0 px-5 left-0 bg-white dark:bg-gray-900 dark:border-gray-800 text-gray-900 h-screen transition-all duration-300 ease-in-out z-50 border-r border-gray-200 
// //         ${
// //           isExpanded || isMobileOpen
// //             ? "w-[290px]"
// //             : isHovered
// //               ? "w-[290px]"
// //               : "w-[90px]"
// //         }
// //         ${isMobileOpen ? "translate-x-0" : "-translate-x-full"}
// //         lg:translate-x-0`}
// //       onMouseEnter={() => !isExpanded && setIsHovered(true)}
// //       onMouseLeave={() => setIsHovered(false)}
// //     >
// //       <div
// //         className={`py-0 flex ${
// //           !isExpanded && !isHovered ? "lg:justify-center" : "justify-start"
// //         }`}
// //       >
// //         <Link to="/">
// //           {isExpanded || isHovered || isMobileOpen ? (
// //             <>
// //               <img
// //                 className="dark:hidden"
// //                 src="/images/logo/logod.png"
// //                 alt="Logo"
// //                 width={250}
// //                 height={40}
// //               />
// //               <img
// //                 className="hidden dark:block"
// //                 src="/images/logo/planc-logo.png"
// //                 alt="Logo"
// //                 width={150}
// //                 height={40}
// //               />
// //             </>
// //           ) : (
// //             <img
// //               src="/images/logo/planc-logo.png"
// //               alt="Logo"
// //               width={32}
// //               height={32}
// //             />
// //           )}
// //         </Link>
// //       </div>
// //       <div className="flex flex-col overflow-y-auto duration-300 ease-linear no-scrollbar">
// //         <nav className="mb-6">
// //           <div className="flex flex-col gap-4">
// //             <div>
// //               <h2
// //                 className={`mb-4 text-xs uppercase flex leading-[20px] text-gray-400 ${
// //                   !isExpanded && !isHovered
// //                     ? "lg:justify-center"
// //                     : "justify-start"
// //                 }`}
// //               >
// //                 {isExpanded || isHovered || isMobileOpen ? (
// //                   "Menu"
// //                 ) : (
// //                   <HorizontaLDots className="size-6" />
// //                 )}
// //               </h2>
// //               {renderMenuItems(navItems, "main")}
// //             </div>
// //             <div className="">
// //               <h2
// //                 className={`mb-4 text-xs uppercase flex leading-[20px] text-gray-400 ${
// //                   !isExpanded && !isHovered
// //                     ? "lg:justify-center"
// //                     : "justify-start"
// //                 }`}
// //               >
// //                 {isExpanded || isHovered || isMobileOpen ? (
// //                   ""
// //                 ) : (
// //                   <HorizontaLDots />
// //                 )}
// //               </h2>
// //               {renderMenuItems(othersItems, "others")}
// //             </div>
// //           </div>
// //         </nav>
// //         {/* {isExpanded || isHovered || isMobileOpen ? <SidebarWidget /> : null} */}
// //       </div>
// //     </aside>
// //   );
// // };

// // export default AppSidebar;

// import { useCallback, useEffect, useRef, useState } from "react";
// import { Link, useLocation } from "react-router";

// import { ChevronDownIcon, GridIcon, HorizontaLDots } from "../icons";
// import { useSidebar } from "../context/SidebarContext";
// import { FaUserDoctor } from "react-icons/fa6";
// import { MdOutlineSpatialAudioOff } from "react-icons/md";
// import { FaRegCalendarAlt } from "react-icons/fa";
// import { FaLocationDot } from "react-icons/fa6";
// import { FaUserCog } from "react-icons/fa";
// import { FaUserShield } from "react-icons/fa6";
// import { TbAsset } from "react-icons/tb";
// import { FiActivity } from "react-icons/fi";
// import { TbMessages } from "react-icons/tb";
// import { SiCssdesignawards } from "react-icons/si";
// import { MdAccountBalance } from "react-icons/md";
// import { FaClinicMedical } from "react-icons/fa";
// import { FaUserNurse } from "react-icons/fa";
// import { FaUsers } from "react-icons/fa";

// type NavItem = {
//   name: string;
//   icon: React.ReactNode;
//   path?: string;
//   subItems?: { name: string; path: string; pro?: boolean; new?: boolean }[];
// };

// const navItems: NavItem[] = [
//   {
//     icon: <GridIcon />,
//     name: "Dashboard",
//     path: "/dashboard",
//   },
//   {
//     icon: <FaClinicMedical />,
//     name: "Clinic",
//     subItems: [
//       { name: "New Clinic",  path: "/dashboard/NewClinic" },
//       { name: "View Clinic", path: "/dashboard/ViewClinic" },
//     ],
//   },
//   {
//     icon: <FaUserNurse />,
//     name: "Staff-Management",
//     subItems: [
//       { name: "New Employee",  path: "/dashboard/NewEmployee" },
//       { name: "View Employee", path: "/dashboard/ViewEmployee" },
//     ],
//   },
//   {
//     icon: <FaUsers />,
//     name: "Patient-Management",
//     subItems: [
//       { name: "New Patient",  path: "/dashboard/NewPatient" },
//       { name: "View Patient", path: "/dashboard/ViewPatient" },
//     ],
//   },
//   {
//     icon: <FaUserDoctor />,
//     name: "Doctors",
//     subItems: [
//       { name: "Doctors",         path: "/dashboard/Allergy" },
//       { name: "Add Doctor",      path: "/dashboard/Newdoctor" },
//       { name: "Doctors Details", path: "/dashboard/DoctorsDetails" },
//     ],
//   },
//   {
//     icon: <MdOutlineSpatialAudioOff />,
//     name: "Patients",
//     subItems: [
//       { name: "New Patient",  path: "/dashboard/NewPatient" },
//       { name: "View Patient", path: "/dashboard/ViewPatient" },
//     ],
//   },
//   {
//     icon: <FaRegCalendarAlt />,
//     name: "Appointments",
//     subItems: [
//       { name: "New Appointment", path: "/dashboard/NewAppointments" },
//       { name: "Appointments",    path: "/dashboard/Appointments" },
//       { name: "Calendar",        path: "/dashboard/Calendar" },
//     ],
//   },
//   {
//     icon: <FaRegCalendarAlt />,
//     name: "Meeting Room",
//     subItems: [
//       { name: "New Book",  path: "/dashboard/Newbook" },
//       { name: "View Book", path: "/dashboard/Viewbook" },
//     ],
//   },
//   // ── these now have real routes ──
//   {
//     icon: <FaLocationDot />,
//     name: "Locations",
//     path: "/dashboard/Locations",
//   },
//   {
//     icon: <FaUserCog />,
//     name: "Services",
//     path: "/dashboard/Services",
//   },
//   {
//     icon: <FaUserShield />,
//     name: "Specializations",
//     path: "/dashboard/Specializations",
//   },
//   {
//     icon: <TbAsset />,
//     name: "Assets",
//     path: "/dashboard/Assets",
//   },
//   {
//     icon: <FiActivity />,
//     name: "Activities",
//     path: "/dashboard/Activities",
//   },
//   {
//     icon: <TbMessages />,
//     name: "Messages",
//     path: "/dashboard/Messages",
//   },
//   {
//     icon: <SiCssdesignawards />,
//     name: "HRM",
//     subItems: [
//       { name: "Staffs",      path: "/dashboard/hrm/staffs" },
//       { name: "Departments", path: "/dashboard/hrm/departments" },
//       { name: "Designation", path: "/dashboard/hrm/designation" },
//       { name: "Attendance",  path: "/dashboard/hrm/attendance" },
//       { name: "Leaves",      path: "/dashboard/hrm/leaves" },
//       { name: "Holidays",    path: "/dashboard/hrm/holidays" },
//       { name: "Payroll",     path: "/dashboard/hrm/payroll" },
//     ],
//   },
//   {
//     icon: <MdAccountBalance />,
//     name: "Finance & Accounts",
//     subItems: [
//       { name: "Expenses",     path: "/dashboard/finance/expenses" },
//       { name: "Income",       path: "/dashboard/finance/income" },
//       { name: "Invoices",     path: "/dashboard/finance/invoices" },
//       { name: "Payments",     path: "/dashboard/finance/payments" },
//       { name: "Transactions", path: "/dashboard/finance/transactions" },
//     ],
//   },
// ];

// const othersItems: NavItem[] = [];

// const AppSidebar: React.FC = () => {
//   const { isExpanded, isMobileOpen, isHovered, setIsHovered } = useSidebar();
//   const location = useLocation();

//   const [openSubmenu, setOpenSubmenu] = useState<{
//     type: "main" | "others";
//     index: number;
//   } | null>(null);
//   const [subMenuHeight, setSubMenuHeight] = useState<Record<string, number>>({});
//   const subMenuRefs = useRef<Record<string, HTMLDivElement | null>>({});

//   const isActive = useCallback(
//     (path: string) => location.pathname === path,
//     [location.pathname],
//   );

//   useEffect(() => {
//     let submenuMatched = false;
//     ["main", "others"].forEach((menuType) => {
//       const items = menuType === "main" ? navItems : othersItems;
//       items.forEach((nav, index) => {
//         if (nav.subItems) {
//           nav.subItems.forEach((subItem) => {
//             if (isActive(subItem.path)) {
//               setOpenSubmenu({ type: menuType as "main" | "others", index });
//               submenuMatched = true;
//             }
//           });
//         }
//       });
//     });
//     if (!submenuMatched) setOpenSubmenu(null);
//   }, [location, isActive]);

//   useEffect(() => {
//     if (openSubmenu !== null) {
//       const key = `${openSubmenu.type}-${openSubmenu.index}`;
//       if (subMenuRefs.current[key]) {
//         setSubMenuHeight((prev) => ({
//           ...prev,
//           [key]: subMenuRefs.current[key]?.scrollHeight || 0,
//         }));
//       }
//     }
//   }, [openSubmenu]);

//   const handleSubmenuToggle = (index: number, menuType: "main" | "others") => {
//     setOpenSubmenu((prev) => {
//       if (prev && prev.type === menuType && prev.index === index) return null;
//       return { type: menuType, index };
//     });
//   };

//   const renderMenuItems = (items: NavItem[], menuType: "main" | "others") => (
//     <ul className="flex flex-col gap-4">
//       {items.map((nav, index) => (
//         <li key={nav.name}>
//           {nav.subItems ? (
//             <button
//               onClick={() => handleSubmenuToggle(index, menuType)}
//               className={`menu-item group ${
//                 openSubmenu?.type === menuType && openSubmenu?.index === index
//                   ? "menu-item-active"
//                   : "menu-item-inactive"
//               } cursor-pointer ${
//                 !isExpanded && !isHovered ? "lg:justify-center" : "lg:justify-start"
//               }`}
//             >
//               <span className={`menu-item-icon-size ${
//                 openSubmenu?.type === menuType && openSubmenu?.index === index
//                   ? "menu-item-icon-active"
//                   : "menu-item-icon-inactive"
//               }`}>
//                 {nav.icon}
//               </span>
//               {(isExpanded || isHovered || isMobileOpen) && (
//                 <span className="menu-item-text">{nav.name}</span>
//               )}
//               {(isExpanded || isHovered || isMobileOpen) && (
//                 <ChevronDownIcon
//                   className={`ml-auto w-5 h-5 transition-transform duration-200 ${
//                     openSubmenu?.type === menuType && openSubmenu?.index === index
//                       ? "rotate-180 text-brand-500"
//                       : ""
//                   }`}
//                 />
//               )}
//             </button>
//           ) : (
//             nav.path && (
//               <Link
//                 to={nav.path}
//                 className={`menu-item group ${
//                   isActive(nav.path) ? "menu-item-active" : "menu-item-inactive"
//                 }`}
//               >
//                 <span className={`menu-item-icon-size ${
//                   isActive(nav.path) ? "menu-item-icon-active" : "menu-item-icon-inactive"
//                 }`}>
//                   {nav.icon}
//                 </span>
//                 {(isExpanded || isHovered || isMobileOpen) && (
//                   <span className="menu-item-text">{nav.name}</span>
//                 )}
//               </Link>
//             )
//           )}
//           {nav.subItems && (isExpanded || isHovered || isMobileOpen) && (
//             <div
//               ref={(el) => { subMenuRefs.current[`${menuType}-${index}`] = el; }}
//               className="overflow-hidden transition-all duration-300"
//               style={{
//                 height:
//                   openSubmenu?.type === menuType && openSubmenu?.index === index
//                     ? `${subMenuHeight[`${menuType}-${index}`]}px`
//                     : "0px",
//               }}
//             >
//               <ul className="mt-2 space-y-1 ml-9">
//                 {nav.subItems.map((subItem) => (
//                   <li key={subItem.name}>
//                     <Link
//                       to={subItem.path}
//                       className={`menu-dropdown-item ${
//                         isActive(subItem.path)
//                           ? "menu-dropdown-item-active"
//                           : "menu-dropdown-item-inactive"
//                       }`}
//                     >
//                       {subItem.name}
//                       <span className="flex items-center gap-1 ml-auto">
//                         {subItem.new && (
//                           <span className={`ml-auto ${
//                             isActive(subItem.path)
//                               ? "menu-dropdown-badge-active"
//                               : "menu-dropdown-badge-inactive"
//                           } menu-dropdown-badge`}>
//                             new
//                           </span>
//                         )}
//                         {subItem.pro && (
//                           <span className={`ml-auto ${
//                             isActive(subItem.path)
//                               ? "menu-dropdown-badge-active"
//                               : "menu-dropdown-badge-inactive"
//                           } menu-dropdown-badge`}>
//                             pro
//                           </span>
//                         )}
//                       </span>
//                     </Link>
//                   </li>
//                 ))}
//               </ul>
//             </div>
//           )}
//         </li>
//       ))}
//     </ul>
//   );

//   return (
//     <aside
//       className={`fixed mt-16 flex flex-col lg:mt-0 top-0 px-5 left-0 bg-white dark:bg-gray-900 dark:border-gray-800 text-gray-900 h-screen transition-all duration-300 ease-in-out z-50 border-r border-gray-200
//         ${isExpanded || isMobileOpen ? "w-[290px]" : isHovered ? "w-[290px]" : "w-[90px]"}
//         ${isMobileOpen ? "translate-x-0" : "-translate-x-full"}
//         lg:translate-x-0`}
//       onMouseEnter={() => !isExpanded && setIsHovered(true)}
//       onMouseLeave={() => setIsHovered(false)}
//     >
//       <div className={`py-0 flex ${!isExpanded && !isHovered ? "lg:justify-center" : "justify-start"}`}>
//         <Link to="/">
//           {isExpanded || isHovered || isMobileOpen ? (
//             <>
//               <img className="dark:hidden"  src="/images/logo/logod.png"      alt="Logo" width={250} height={40} />
//               <img className="hidden dark:block" src="/images/logo/planc-logo.png" alt="Logo" width={150} height={40} />
//             </>
//           ) : (
//             <img src="/images/logo/planc-logo.png" alt="Logo" width={32} height={32} />
//           )}
//         </Link>
//       </div>

//       <div className="flex flex-col overflow-y-auto duration-300 ease-linear no-scrollbar">
//         <nav className="mb-6">
//           <div className="flex flex-col gap-4">
//             <div>
//               <h2 className={`mb-4 text-xs uppercase flex leading-[20px] text-gray-400 ${
//                 !isExpanded && !isHovered ? "lg:justify-center" : "justify-start"
//               }`}>
//                 {isExpanded || isHovered || isMobileOpen ? (
//                   "Menu"
//                 ) : (
//                   <HorizontaLDots className="size-6" />
//                 )}
//               </h2>
//               {renderMenuItems(navItems, "main")}
//             </div>
//             <div>
//               <h2 className={`mb-4 text-xs uppercase flex leading-[20px] text-gray-400 ${
//                 !isExpanded && !isHovered ? "lg:justify-center" : "justify-start"
//               }`}>
//                 {isExpanded || isHovered || isMobileOpen ? "" : <HorizontaLDots />}
//               </h2>
//               {renderMenuItems(othersItems, "others")}
//             </div>
//           </div>
//         </nav>
//       </div>
//     </aside>
//   );
// };

// export default AppSidebar;
import { useCallback, useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router";

import { ChevronDownIcon, GridIcon, HorizontaLDots } from "../icons";
import { useSidebar } from "../context/SidebarContext";
import { FaUserDoctor }           from "react-icons/fa6";
import { MdOutlineSpatialAudioOff } from "react-icons/md";
import { FaRegCalendarAlt }        from "react-icons/fa";
import { FaLocationDot }           from "react-icons/fa6";
import { FaUserCog }               from "react-icons/fa";
import { FaUserShield }            from "react-icons/fa6";
import { TbAsset }                 from "react-icons/tb";
import { FiActivity }              from "react-icons/fi";
import { TbMessages }              from "react-icons/tb";
import { SiCssdesignawards }       from "react-icons/si";
import { MdAccountBalance }        from "react-icons/md";
import { FaClinicMedical }         from "react-icons/fa";
import { FaUserNurse }             from "react-icons/fa";
import { FaUsers }                 from "react-icons/fa";
import { MdSupportAgent }          from "react-icons/md";   // ← NEW: Helpdesk icon

type NavItem = {
  name: string;
  icon: React.ReactNode;
  path?: string;
  subItems?: { name: string; path: string; pro?: boolean; new?: boolean }[];
};

const navItems: NavItem[] = [
  {
    icon: <GridIcon />,
    name: "Dashboard",
    path: "/dashboard",
  },
  {
    icon: <FaClinicMedical />,
    name: "Clinic",
    subItems: [
      { name: "New Clinic",  path: "/dashboard/NewClinic" },
      { name: "View Clinic", path: "/dashboard/ViewClinic" },
    ],
  },
  {
    icon: <FaUserNurse />,
    name: "Staff-Management",
    subItems: [
      { name: "New Employee",  path: "/dashboard/NewEmployee" },
      { name: "View Employee", path: "/dashboard/ViewEmployee" },
    ],
  },
  {
    icon: <FaUsers />,
    name: "Patient-Management",
    subItems: [
      { name: "New Patient",  path: "/dashboard/NewPatient" },
      { name: "View Patient", path: "/dashboard/ViewPatient" },
    ],
  },
  {
    icon: <FaUserDoctor />,
    name: "Doctors",
    subItems: [
      { name: "Doctors",         path: "/dashboard/Allergy" },
      { name: "Add Doctor",      path: "/dashboard/Newdoctor" },
      { name: "Doctors Details", path: "/dashboard/DoctorsDetails" },
    ],
  },
  {
    icon: <MdOutlineSpatialAudioOff />,
    name: "Patients",
    subItems: [
      { name: "New Patient",  path: "/dashboard/NewPatient" },
      { name: "View Patient", path: "/dashboard/ViewPatient" },
    ],
  },
  {
    icon: <FaRegCalendarAlt />,
    name: "Appointments",
    subItems: [
      { name: "New Appointment", path: "/dashboard/NewAppointments" },
      { name: "Appointments",    path: "/dashboard/Appointments" },
      { name: "Calendar",        path: "/dashboard/Calendar" },
    ],
  },
  {
    icon: <FaRegCalendarAlt />,
    name: "Meeting Room",
    subItems: [
      { name: "New Book",  path: "/dashboard/Newbook" },
      { name: "View Book", path: "/dashboard/Viewbook" },
    ],
  },

  // ── NEW: IT Helpdesk ──────────────────────────────────────────────────────
  {
    icon: <MdSupportAgent />,
    name: "IT Helpdesk",
    path: "/dashboard/Helpdesk",
  },
  // ─────────────────────────────────────────────────────────────────────────

  {
    icon: <FaLocationDot />,
    name: "Locations",
    path: "/dashboard/Locations",
  },
  {
    icon: <FaUserCog />,
    name: "Services",
    path: "/dashboard/Services",
  },
  {
    icon: <FaUserShield />,
    name: "Specializations",
    path: "/dashboard/Specializations",
  },
  {
    icon: <TbAsset />,
    name: "Assets",
    path: "/dashboard/Assets",
  },
  {
    icon: <FiActivity />,
    name: "Activities",
    path: "/dashboard/Activities",
  },
  {
    icon: <TbMessages />,
    name: "Messages",
    path: "/dashboard/Messages",
  },
  {
    icon: <SiCssdesignawards />,
    name: "HRM",
    subItems: [
      { name: "Staffs",      path: "/dashboard/hrm/staffs" },
      { name: "Departments", path: "/dashboard/hrm/departments" },
      { name: "Designation", path: "/dashboard/hrm/designation" },
      { name: "Attendance",  path: "/dashboard/hrm/attendance" },
      { name: "Leaves",      path: "/dashboard/hrm/leaves" },
      { name: "Holidays",    path: "/dashboard/hrm/holidays" },
      { name: "Payroll",     path: "/dashboard/hrm/payroll" },
    ],
  },
  {
    icon: <MdAccountBalance />,
    name: "Finance & Accounts",
    subItems: [
      { name: "Expenses",     path: "/dashboard/finance/expenses" },
      { name: "Income",       path: "/dashboard/finance/income" },
      { name: "Invoices",     path: "/dashboard/finance/invoices" },
      { name: "Payments",     path: "/dashboard/finance/payments" },
      { name: "Transactions", path: "/dashboard/finance/transactions" },
    ],
  },
];

const othersItems: NavItem[] = [];

const AppSidebar: React.FC = () => {
  const { isExpanded, isMobileOpen, isHovered, setIsHovered } = useSidebar();
  const location = useLocation();

  const [openSubmenu, setOpenSubmenu] = useState<{
    type: "main" | "others";
    index: number;
  } | null>(null);
  const [subMenuHeight, setSubMenuHeight] = useState<Record<string, number>>({});
  const subMenuRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const isActive = useCallback(
    (path: string) => location.pathname === path,
    [location.pathname],
  );

  useEffect(() => {
    let submenuMatched = false;
    ["main", "others"].forEach((menuType) => {
      const items = menuType === "main" ? navItems : othersItems;
      items.forEach((nav, index) => {
        if (nav.subItems) {
          nav.subItems.forEach((subItem) => {
            if (isActive(subItem.path)) {
              setOpenSubmenu({ type: menuType as "main" | "others", index });
              submenuMatched = true;
            }
          });
        }
      });
    });
    if (!submenuMatched) setOpenSubmenu(null);
  }, [location, isActive]);

  useEffect(() => {
    if (openSubmenu !== null) {
      const key = `${openSubmenu.type}-${openSubmenu.index}`;
      if (subMenuRefs.current[key]) {
        setSubMenuHeight((prev) => ({
          ...prev,
          [key]: subMenuRefs.current[key]?.scrollHeight || 0,
        }));
      }
    }
  }, [openSubmenu]);

  const handleSubmenuToggle = (index: number, menuType: "main" | "others") => {
    setOpenSubmenu((prev) => {
      if (prev && prev.type === menuType && prev.index === index) return null;
      return { type: menuType, index };
    });
  };

  const renderMenuItems = (items: NavItem[], menuType: "main" | "others") => (
    <ul className="flex flex-col gap-4">
      {items.map((nav, index) => (
        <li key={nav.name}>
          {nav.subItems ? (
            <button
              onClick={() => handleSubmenuToggle(index, menuType)}
              className={`menu-item group ${
                openSubmenu?.type === menuType && openSubmenu?.index === index
                  ? "menu-item-active"
                  : "menu-item-inactive"
              } cursor-pointer ${
                !isExpanded && !isHovered ? "lg:justify-center" : "lg:justify-start"
              }`}
            >
              <span className={`menu-item-icon-size ${
                openSubmenu?.type === menuType && openSubmenu?.index === index
                  ? "menu-item-icon-active"
                  : "menu-item-icon-inactive"
              }`}>
                {nav.icon}
              </span>
              {(isExpanded || isHovered || isMobileOpen) && (
                <span className="menu-item-text">{nav.name}</span>
              )}
              {(isExpanded || isHovered || isMobileOpen) && (
                <ChevronDownIcon
                  className={`ml-auto w-5 h-5 transition-transform duration-200 ${
                    openSubmenu?.type === menuType && openSubmenu?.index === index
                      ? "rotate-180 text-brand-500"
                      : ""
                  }`}
                />
              )}
            </button>
          ) : (
            nav.path && (
              <Link
                to={nav.path}
                className={`menu-item group ${
                  isActive(nav.path) ? "menu-item-active" : "menu-item-inactive"
                }`}
              >
                <span className={`menu-item-icon-size ${
                  isActive(nav.path) ? "menu-item-icon-active" : "menu-item-icon-inactive"
                }`}>
                  {nav.icon}
                </span>
                {(isExpanded || isHovered || isMobileOpen) && (
                  <span className="menu-item-text">{nav.name}</span>
                )}
              </Link>
            )
          )}
          {nav.subItems && (isExpanded || isHovered || isMobileOpen) && (
            <div
              ref={(el) => { subMenuRefs.current[`${menuType}-${index}`] = el; }}
              className="overflow-hidden transition-all duration-300"
              style={{
                height:
                  openSubmenu?.type === menuType && openSubmenu?.index === index
                    ? `${subMenuHeight[`${menuType}-${index}`]}px`
                    : "0px",
              }}
            >
              <ul className="mt-2 space-y-1 ml-9">
                {nav.subItems.map((subItem) => (
                  <li key={subItem.name}>
                    <Link
                      to={subItem.path}
                      className={`menu-dropdown-item ${
                        isActive(subItem.path)
                          ? "menu-dropdown-item-active"
                          : "menu-dropdown-item-inactive"
                      }`}
                    >
                      {subItem.name}
                      <span className="flex items-center gap-1 ml-auto">
                        {subItem.new && (
                          <span className={`ml-auto ${
                            isActive(subItem.path)
                              ? "menu-dropdown-badge-active"
                              : "menu-dropdown-badge-inactive"
                          } menu-dropdown-badge`}>
                            new
                          </span>
                        )}
                        {subItem.pro && (
                          <span className={`ml-auto ${
                            isActive(subItem.path)
                              ? "menu-dropdown-badge-active"
                              : "menu-dropdown-badge-inactive"
                          } menu-dropdown-badge`}>
                            pro
                          </span>
                        )}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </li>
      ))}
    </ul>
  );

  return (
    <aside
      className={`fixed mt-16 flex flex-col lg:mt-0 top-0 px-5 left-0 bg-white dark:bg-gray-900 dark:border-gray-800 text-gray-900 h-screen transition-all duration-300 ease-in-out z-50 border-r border-gray-200
        ${isExpanded || isMobileOpen ? "w-[290px]" : isHovered ? "w-[290px]" : "w-[90px]"}
        ${isMobileOpen ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0`}
      onMouseEnter={() => !isExpanded && setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className={`py-0 flex ${!isExpanded && !isHovered ? "lg:justify-center" : "justify-start"}`}>
        <Link to="/">
          {isExpanded || isHovered || isMobileOpen ? (
            <>
              <img className="dark:hidden"       src="/images/logo/logod.png"      alt="Logo" width={250} height={40} />
              <img className="hidden dark:block" src="/images/logo/planc-logo.png" alt="Logo" width={150} height={40} />
            </>
          ) : (
            <img src="/images/logo/planc-logo.png" alt="Logo" width={32} height={32} />
          )}
        </Link>
      </div>

      <div className="flex flex-col overflow-y-auto duration-300 ease-linear no-scrollbar">
        <nav className="mb-6">
          <div className="flex flex-col gap-4">
            <div>
              <h2 className={`mb-4 text-xs uppercase flex leading-[20px] text-gray-400 ${
                !isExpanded && !isHovered ? "lg:justify-center" : "justify-start"
              }`}>
                {isExpanded || isHovered || isMobileOpen
                  ? "Menu"
                  : <HorizontaLDots className="size-6" />}
              </h2>
              {renderMenuItems(navItems, "main")}
            </div>
            <div>
              <h2 className={`mb-4 text-xs uppercase flex leading-[20px] text-gray-400 ${
                !isExpanded && !isHovered ? "lg:justify-center" : "justify-start"
              }`}>
                {isExpanded || isHovered || isMobileOpen ? "" : <HorizontaLDots />}
              </h2>
              {renderMenuItems(othersItems, "others")}
            </div>
          </div>
        </nav>
      </div>
    </aside>
  );
};

export default AppSidebar;