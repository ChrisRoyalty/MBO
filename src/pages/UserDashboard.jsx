import React, { useState, useEffect, useContext } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { LuLayoutGrid } from "react-icons/lu";
import { PiUserCircle } from "react-icons/pi";
import { MdOutlineAnalytics } from "react-icons/md";
import { IoIosLogOut } from "react-icons/io";
import { CgMenuLeftAlt } from "react-icons/cg";
import { MdOutlineCancelPresentation } from "react-icons/md";
import BusinessImg from "../assets/businessImg.jpeg";
import { motion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { logout, selectAuth } from "../redux/authSlice";
import { toast } from "react-toastify";

const navItems = [
  {
    to: "/user-dashboard",
    icon: <LuLayoutGrid className="text-[25px]" />,
    label: "Home",
  },
  {
    to: "/community",
    icon: <PiUserCircle className="text-[25px]" />,
    label: "Community",
  },
  {
    to: "/user-dashboard/analytics",
    icon: <MdOutlineAnalytics className="text-[25px]" />,
    label: "Analytics",
  },
  {
    to: "/user-dashboard/contact",
    icon: <PiUserCircle className="text-[25px]" />,
    label: "Contact Us",
  },
];

const UserDashboard = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector(selectAuth); // Get auth state from Redux

  const [isSidebarOpen, setIsSidebarOpen] = useState(
    JSON.parse(sessionStorage.getItem("sidebarState")) || false
  );

  useEffect(() => {
    sessionStorage.setItem("sidebarState", JSON.stringify(isSidebarOpen));
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isSidebarOpen, isAuthenticated, navigate]);

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  const handleLogout = () => {
    dispatch(logout()); // Use Redux logout action
    toast.success("Logged out successfully!");
    navigate("/login");
  };

  return (
    <div className="w-full flex flex-col md:flex-row h-screen overflow-hidden relative">
      <motion.aside
        initial={{ x: "-100%" }}
        animate={{ x: isSidebarOpen ? "0%" : "-100%" }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
        className={`max-md:fixed z-50 top-0 left-0 lg:w-[25%] max-md:h-screen py-14 px-10 md:h-full h-auto overflow-y-auto bg-white border-r border-black shadow-2xl 
        ${isSidebarOpen ? "absolute md:relative" : "absolute"}`}
      >
        <MdOutlineCancelPresentation
          onClick={toggleSidebar}
          className="text-[#043D12] text-[35px] absolute top-4 right-4 cursor-pointer transition-transform hover:scale-110"
        />

        <div className="flex flex-col gap-10">
          <motion.strong
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="logo text-[32px] text-[#043D12]"
          >
            MBO
          </motion.strong>

          <nav className="flex flex-col gap-4">
            {navItems.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
              >
                <Link
                  to={item.to}
                  className={`text-[15px] flex items-center gap-4 px-6 py-2 rounded-[11px] transition-all duration-300 relative overflow-hidden ${
                    location.pathname === item.to
                      ? "bg-[#043D12] text-white shadow-lg"
                      : "text-[#043D12] hover:bg-gray-200"
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

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
            >
              <button
                onClick={handleLogout}
                className="text-[15px] flex items-center gap-4 px-6 py-2 rounded-[11px] transition-all duration-300 bg-red-600 text-white hover:bg-red-700 w-full"
              >
                <IoIosLogOut className="text-[25px]" />
                Logout
              </button>
            </motion.div>
          </nav>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="flex flex-col gap-10 mt-8"
        >
          <div className="rounded-[16px] border border-[#6A7368] px-4 py-4 flex flex-col gap-6">
            <figure className="flex flex-col items-center">
              <motion.img
                src={BusinessImg}
                alt="Business-img"
                className="rounded-full w-[77px] h-[77px]"
                whileHover={{ scale: 1.1, rotate: 5 }}
                transition={{ duration: 0.3 }}
              />
              <figcaption className="text-center text-[#6A7368]">
                <h3 className="text-[12px]">Ngene and Sons Ltd</h3>
                <p className="text-[8px]">Clothing and Accessories</p>
              </figcaption>
            </figure>
            <motion.button
              className="text-white text-[14px] rounded-[14px] bg-[#043D12] py-3 px-2 shadow-lg hover:bg-[#03500F] transition-all"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Share profile link
            </motion.button>
          </div>
        </motion.div>
      </motion.aside>

      <main
        className={`transition-all duration-500 ${
          isSidebarOpen ? "md:w-[calc(100%-16rem)] ml-auto" : "w-full"
        } h-screen overflow-y-scroll`}
      >
        {!isSidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="absolute z-50 top-6 lg:left-4 right-4 cursor-pointer border w-fit rounded shadow p-1 bg-white"
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

export default UserDashboard;
