import React, { useState, useEffect } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { LuLayoutGrid } from "react-icons/lu";
import {
  IoSettingsOutline,
  IoNotificationsOutline,
  IoCodeSlash,
} from "react-icons/io5";
import { TbChartBar } from "react-icons/tb";
import { MdHeadset } from "react-icons/md";
import { CgMenuLeftAlt } from "react-icons/cg";
import { MdOutlineCancelPresentation } from "react-icons/md";
import BusinessImg from "../../assets/businessImg.jpeg";
import { motion } from "framer-motion";

const navItems = [
  // First container items
  {
    to: "/admin",
    icon: <LuLayoutGrid className="text-[25px]" />,
    label: "Home",
  },
  {
    icon: <IoSettingsOutline className="text-[25px]" />,
    label: "Manage",
    subItems: [
      { to: "/admin/manage-admins", label: "Admin" },
      { to: "/admin/manage-users", label: "Users" },
      { to: "/admin/manage-subscriptions", label: "Subscription" },
    ],
  },
  {
    to: "/admin/analytics",
    icon: <TbChartBar className="text-[25px]" />,
    label: "Analytics",
  },
  {
    to: "/admin/manage-notifications",
    icon: <IoNotificationsOutline className="text-[25px]" />,
    label: "Notification",
  },
];

// Second container items
const secondaryNavItems = [
  {
    to: "/admin/support",
    icon: <MdHeadset className="text-[25px]" />,
    label: "Support",
  },
  {
    to: "/login",
    icon: <IoCodeSlash className="text-[25px]" />,
    label: "Logout",
  },
];

const AdminDashboard = () => {
  const location = useLocation();

  // Set initial state of isSidebarOpen to true for large screens
  const [isSidebarOpen, setIsSidebarOpen] = useState(() => {
    try {
      const isLargeScreen = window.innerWidth >= 1024;
      return (
        JSON.parse(sessionStorage.getItem("sidebarState")) || isLargeScreen
      );
    } catch (e) {
      console.warn("Cannot access sessionStorage for sidebarState:", e.message);
      return window.innerWidth >= 1024;
    }
  });

  // State to manage the dropdown visibility
  const [isManageDropdownOpen, setIsManageDropdownOpen] = useState(false);

  useEffect(() => {
    sessionStorage.setItem("sidebarState", JSON.stringify(isSidebarOpen));
  }, [isSidebarOpen]);

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  const handleLogout = () => {
    sessionStorage.clear();
    window.location.href = "/login";
  };

  // Toggle the Manage dropdown
  const toggleManageDropdown = () => {
    setIsManageDropdownOpen((prev) => !prev);
  };

  return (
    <div className="w-full flex flex-col md:flex-row h-screen overflow-hidden relative">
      {/* Sidebar */}
      <motion.aside
        initial={{ x: "-100%" }}
        animate={{
          x: isSidebarOpen || window.innerWidth >= 1024 ? "0%" : "-100%",
        }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
        className={`fixed lg:static z-50 top-0 left-0 lg:w-[25%] max-md:h-screen py-14 px-10 md:h-full h-auto overflow-y-auto bg-[#F0F5F2] border-r border-black shadow-2xl 
          ${isSidebarOpen ? "absolute md:relative" : "absolute"}`}
      >
        {/* Close Sidebar Button (hidden on large screens) */}
        <MdOutlineCancelPresentation
          onClick={toggleSidebar}
          className="text-[#043D12] text-[35px] absolute top-4 right-4 cursor-pointer transition-transform hover:scale-110 lg:hidden"
        />

        <div className="flex flex-col gap-10 h-full">
          <motion.strong
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="logo text-[32px] text-[#043D12]"
          >
            MBO
          </motion.strong>

          <div className="flex flex-col justify-between items-stretch h-full">
            {/* First Container: Home, Manage, Analytics, Notification */}
            <nav className="flex flex-col gap-4">
              {navItems.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                  className="relative"
                >
                  {item.subItems ? (
                    <div>
                      <button
                        onClick={toggleManageDropdown}
                        className={`text-[15px] flex items-center gap-4 px-6 py-2 rounded-[11px] transition-all duration-300 w-full text-left ${
                          location.pathname.startsWith("/admin/manage-")
                            ? "bg-[#C8E6C9] text-[#043D12] shadow-lg"
                            : "text-[#6A7368] hover:bg-gray-200"
                        }`}
                      >
                        {item.icon}
                        <span className="flex-1">{item.label}</span>
                        <span className="ml-auto">
                          {isManageDropdownOpen ? "▲" : "▼"}
                        </span>
                      </button>
                      {isManageDropdownOpen && (
                        <div className="ml-8 mt-2 flex flex-col gap-4">
                          {item.subItems.map((subItem, subIndex) => (
                            <Link
                              key={subIndex}
                              to={subItem.to}
                              className={`text-[14px] flex items-center gap-2 px-4 py-1 rounded-[8px] transition-all duration-300 ${
                                location.pathname === subItem.to
                                  ? "bg-[#A5D6A7] text-[#043D12]"
                                  : "text-[#6A7368] hover:bg-gray-100"
                              }`}
                            >
                              {subItem.label}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  ) : (
                    <Link
                      to={item.to}
                      className={`text-[15px] flex items-center gap-4 px-6 py-2 rounded-[11px] transition-all duration-300 relative overflow-hidden ${
                        location.pathname === item.to
                          ? "bg-[#C8E6C9] text-[#043D12] shadow-lg"
                          : "text-[#6A7368] hover:bg-gray-200"
                      }`}
                    >
                      {item.icon}
                      <motion.span
                        whileHover={{
                          scale: 1.1,
                          x: 5,
                          transition: { type: "spring", stiffness: 300 },
                        }}
                        whileTap={{ scale: 0.9 }}
                      >
                        {item.label}
                      </motion.span>
                    </Link>
                  )}
                </motion.div>
              ))}
            </nav>

            {/* Separator Space */}
            <div className="h-8"></div>

            {/* Second Container: Support, Logout */}
            <nav className="flex flex-col gap-4">
              {secondaryNavItems.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                >
                  <Link
                    to={item.to}
                    onClick={item.label === "Logout" ? handleLogout : null}
                    className={`text-[14px] flex items-center gap-4 px-6 py-2 rounded-[11px] transition-all duration-300 relative overflow-hidden ${
                      location.pathname === item.to
                        ? "bg-[#C8E6C9] text-[#043D12] shadow-lg"
                        : "text-[#6A7368] hover:bg-gray-200"
                    }`}
                  >
                    {item.icon}
                    <motion.span
                      whileHover={{
                        scale: 1.1,
                        x: 5,
                        transition: { type: "spring", stiffness: 300 },
                      }}
                      whileTap={{ scale: 0.9 }}
                    >
                      {item.label}
                    </motion.span>
                  </Link>
                </motion.div>
              ))}
            </nav>
          </div>
        </div>
      </motion.aside>

      {/* Main Content */}
      <main
        className={`transition-all duration-500 ${
          isSidebarOpen ? "md:w-[calc(100%-16rem)] ml-auto" : "w-full"
        } h-screen overflow-y-scroll`}
      >
        {/* Menu Toggle Button (hidden on large screens) */}
        {!isSidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="absolute z-50 top-6 lg:left-4 right-4 cursor-pointer border w-fit rounded shadow p-1 bg-white lg:hidden"
          >
            <CgMenuLeftAlt
              onClick={toggleSidebar}
              className="text-[#043D12] text-[25px] hover:scale-110 transition-transform"
            />
          </motion.div>
        )}
        <Outlet />
      </main>
    </div>
  );
};

export default AdminDashboard;
