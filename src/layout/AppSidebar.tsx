import { useCallback, useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";

import { ChevronDownIcon, GridIcon, HorizontaLDots } from "../icons";
import { useSidebar } from "../context/SidebarContext";
import { FaUserDoctor }   from "react-icons/fa6";
import { FaRegCalendarAlt } from "react-icons/fa";
import { FaLocationDot }  from "react-icons/fa6";
import { FaUserCog }      from "react-icons/fa";
import { FaUserShield }   from "react-icons/fa6";
import { TbAsset }        from "react-icons/tb";
import { FiActivity }     from "react-icons/fi";
import { TbMessages }     from "react-icons/tb";
import { SiCssdesignawards } from "react-icons/si";
import { MdAccountBalance }  from "react-icons/md";
import { FaClinicMedical }   from "react-icons/fa";
import { FaUserNurse }       from "react-icons/fa";
import { FaUsers }           from "react-icons/fa";
import { MdSupportAgent }    from "react-icons/md";
import { MdQueuePlayNext }   from "react-icons/md";

const getRole = (): string => localStorage.getItem("role") || "";
const isAdmin = (): boolean => {
  const r = getRole();
  return r === "Admin" || r === "ADMIN";
};

type NavItem = {
  name: string;
  icon: React.ReactNode;
  path?: string;
  adminOnly?: boolean;
  subItems?: { name: string; path: string; pro?: boolean; new?: boolean }[];
};

const navItems: NavItem[] = [
  { icon: <GridIcon />, name: "Dashboard", path: "/dashboard" },
  {
    icon: <FaClinicMedical />, name: "Clinic", adminOnly: true,
    subItems: [
      { name: "New Clinic",  path: "/dashboard/NewClinic" },
      { name: "View Clinic", path: "/dashboard/ViewClinic" },
    ],
  },
  {
    icon: <FaUserNurse />, name: "Staff-Management", adminOnly: true,
    subItems: [
      { name: "New Employee",  path: "/dashboard/NewEmployee" },
      { name: "View Employee", path: "/dashboard/ViewEmployee" },
    ],
  },
  {
    icon: <FaUsers />, name: "Patient-Management",
    subItems: [
      { name: "New Patient",  path: "/dashboard/NewPatient" },
      { name: "View Patient", path: "/dashboard/ViewPatient" },
    ],
  },
  {
    icon: <FaUserDoctor />, name: "Doctors", adminOnly: true,
    subItems: [
      { name: "Doctors",         path: "/dashboard/Allergy" },
      { name: "Add Doctor",      path: "/dashboard/Newdoctor" },
      { name: "Doctors Details", path: "/dashboard/DoctorsDetails" },
    ],
  },
  {
    icon: <FaRegCalendarAlt />, name: "Appointments",
    subItems: [
      { name: "New Appointment", path: "/dashboard/NewAppointments" },
      { name: "Appointments",    path: "/dashboard/Appointments" },
      { name: "Calendar",        path: "/dashboard/Calendar" },
    ],
  },
  // ✅ Walk-in Kiosk — /kiosk (no sidebar, public page)
  { icon: <MdQueuePlayNext />, name: "Walk-in Kiosk", path: "/kiosk" },
  {
    icon: <FaRegCalendarAlt />, name: "Meeting Room", adminOnly: true,
    subItems: [
      { name: "New Book",  path: "/dashboard/Newbook" },
      { name: "View Book", path: "/dashboard/Viewbook" },
    ],
  },
  { icon: <MdSupportAgent />, name: "IT Helpdesk", path: "/dashboard/Helpdesk" },
  { icon: <FaLocationDot />,  name: "Locations",    path: "/dashboard/Locations",    adminOnly: true },
  { icon: <FaUserCog />,      name: "Services",     path: "/dashboard/Services",     adminOnly: true },
  { icon: <FaUserShield />,   name: "Specializations", path: "/dashboard/Specializations", adminOnly: true },
  { icon: <TbAsset />,        name: "Assets",       path: "/dashboard/Assets",       adminOnly: true },
  { icon: <FiActivity />,     name: "Activities",   path: "/dashboard/Activities" },
  { icon: <TbMessages />,     name: "Messages",     path: "/dashboard/Messages" },
  {
    icon: <SiCssdesignawards />, name: "HRM", adminOnly: true,
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
    icon: <MdAccountBalance />, name: "Finance & Accounts", adminOnly: true,
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

  const userIsAdmin = isAdmin();
  const visibleNavItems = navItems.filter(item => !item.adminOnly || userIsAdmin);

  const [openSubmenu, setOpenSubmenu] = useState<{ type: "main" | "others"; index: number } | null>(null);
  const [subMenuHeight, setSubMenuHeight] = useState<Record<string, number>>({});
  const subMenuRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const isActive = useCallback((path: string) => location.pathname === path, [location.pathname]);

  useEffect(() => {
    let submenuMatched = false;
    ["main", "others"].forEach((menuType) => {
      const items = menuType === "main" ? visibleNavItems : othersItems;
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
        setSubMenuHeight(prev => ({ ...prev, [key]: subMenuRefs.current[key]?.scrollHeight || 0 }));
      }
    }
  }, [openSubmenu]);

  const handleSubmenuToggle = (index: number, menuType: "main" | "others") => {
    setOpenSubmenu(prev => {
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
                openSubmenu?.type === menuType && openSubmenu?.index === index ? "menu-item-active" : "menu-item-inactive"
              } cursor-pointer ${!isExpanded && !isHovered ? "lg:justify-center" : "lg:justify-start"}`}
            >
              <span className={`menu-item-icon-size ${
                openSubmenu?.type === menuType && openSubmenu?.index === index ? "menu-item-icon-active" : "menu-item-icon-inactive"
              }`}>{nav.icon}</span>
              {(isExpanded || isHovered || isMobileOpen) && <span className="menu-item-text">{nav.name}</span>}
              {(isExpanded || isHovered || isMobileOpen) && (
                <ChevronDownIcon className={`ml-auto w-5 h-5 transition-transform duration-200 ${
                  openSubmenu?.type === menuType && openSubmenu?.index === index ? "rotate-180 text-brand-500" : ""
                }`} />
              )}
            </button>
          ) : (
            nav.path && (
              <Link to={nav.path} className={`menu-item group ${isActive(nav.path) ? "menu-item-active" : "menu-item-inactive"}`}>
                <span className={`menu-item-icon-size ${isActive(nav.path) ? "menu-item-icon-active" : "menu-item-icon-inactive"}`}>
                  {nav.icon}
                </span>
                {(isExpanded || isHovered || isMobileOpen) && <span className="menu-item-text">{nav.name}</span>}
              </Link>
            )
          )}
          {nav.subItems && (isExpanded || isHovered || isMobileOpen) && (
            <div
              ref={(el) => { subMenuRefs.current[`${menuType}-${index}`] = el; }}
              className="overflow-hidden transition-all duration-300"
              style={{ height: openSubmenu?.type === menuType && openSubmenu?.index === index ? `${subMenuHeight[`${menuType}-${index}`]}px` : "0px" }}
            >
              <ul className="mt-2 space-y-1 ml-9">
                {nav.subItems.map(subItem => (
                  <li key={subItem.name}>
                    <Link to={subItem.path} className={`menu-dropdown-item ${isActive(subItem.path) ? "menu-dropdown-item-active" : "menu-dropdown-item-inactive"}`}>
                      {subItem.name}
                      <span className="flex items-center gap-1 ml-auto">
                        {subItem.new && <span className={`ml-auto ${isActive(subItem.path) ? "menu-dropdown-badge-active" : "menu-dropdown-badge-inactive"} menu-dropdown-badge`}>new</span>}
                        {subItem.pro && <span className={`ml-auto ${isActive(subItem.path) ? "menu-dropdown-badge-active" : "menu-dropdown-badge-inactive"} menu-dropdown-badge`}>pro</span>}
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
              <h2 className={`mb-4 text-xs uppercase flex leading-[20px] text-gray-400 ${!isExpanded && !isHovered ? "lg:justify-center" : "justify-start"}`}>
                {isExpanded || isHovered || isMobileOpen ? "Menu" : <HorizontaLDots className="size-6" />}
              </h2>
              {renderMenuItems(visibleNavItems, "main")}
            </div>
            <div>
              <h2 className={`mb-4 text-xs uppercase flex leading-[20px] text-gray-400 ${!isExpanded && !isHovered ? "lg:justify-center" : "justify-start"}`}>
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