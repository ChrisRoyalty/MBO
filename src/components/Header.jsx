import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import MindPowerLogo from "../assets/mbo-logo.png";
import MenuIcon from "../assets/menu.svg";
import ProfilePic from "../assets/profilepic.svg";
import { toast } from "react-toastify";
import { useSelector, useDispatch } from "react-redux";
import { logout, selectAuth, setLastDashboard } from "../redux/authSlice";

const navItemVariants = {
  hidden: { opacity: 0, scale: 0.5, y: -20 },
  visible: (i) => ({
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { delay: i * 0.15, duration: 0.4, ease: "easeOut" },
  }),
};

const Header = () => {
  const location = useLocation();

  // Check if the current route is "/" or "/help-and-support"
  const isHomeActive =
    location.pathname === "/" || location.pathname === "/help-and-support";
  const [isOpen, setIsOpen] = useState(false);
  // const location = useLocation();
  const navigate = useNavigate();
  const { id } = useParams();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const auth = useSelector(selectAuth);
  const dispatch = useDispatch();
  const isAuthenticated = auth.isAuthenticated;
  const userRole = auth.user?.role; // Access role from user object
  const lastDashboard = auth.lastDashboard;

  // Debug logs to trace state and routing
  console.log("Header - Full auth state:", auth);
  console.log("Header - userRole:", userRole);
  console.log("Header - lastDashboard:", lastDashboard);

  useEffect(() => {
    // Update lastDashboard when navigating to a dashboard
    if (location.pathname === "/admin") {
      dispatch(setLastDashboard("/admin"));
    } else if (location.pathname === "/user-dashboard") {
      dispatch(setLastDashboard("/user-dashboard"));
    }

    if (location.pathname.startsWith("/community/profile/")) {
      setLoading(true);
      const fetchProfile = async () => {
        try {
          const API_URL = `${
            import.meta.env.VITE_BASE_URL
          }/member/get-profile/${id}`;
          const response = await axios.get(API_URL);

          if (response.data && response.data.profile) {
            setProfile(response.data.profile);
          } else {
            throw new Error("Profile not found in the response.");
          }
        } catch (error) {
          console.error("❌ Error Fetching Profile for Header:", error);
          setError(
            error.response?.data?.message || "Failed to fetch profile data."
          );
        } finally {
          setLoading(false);
        }
      };

      fetchProfile();
    } else {
      setProfile(null);
    }
  }, [location.pathname, id, dispatch]);

  useEffect(() => {
    console.log("Header rendered, current path:", location.pathname);
    console.log("Profile data:", profile);
  }, [location.pathname, profile]);

  const handleLogout = () => {
    dispatch(logout());
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    toast.success("Logged out successfully!");
    navigate("/login");
    setIsOpen(false);
  };

  // Determine dashboard route, prioritizing lastDashboard
  const dashboardRoute =
    lastDashboard || (userRole === "admin" ? "/admin" : "/user-dashboard");
  console.log("Header - Final dashboardRoute:", dashboardRoute); // Debug final route

  const navItems = [
    { name: "Home", path: "/" },
    { name: "Community", path: "/community" },
    isAuthenticated
      ? {
          name: "Dashboard",
          path: dashboardRoute,
          className:
            "border-[1px] border-[#FFFFFF] rounded-[39px] lg:ml-8 px-8 py-2 hover:bg-white hover:text-[#02530c] active:bg-white active:text-[#02530c]",
        }
      : {
          name: "Log In",
          path: "/login",
          className:
            "border-[1px] border-[#FFFFFF] rounded-[39px] lg:ml-8 px-8 py-2 hover:bg-white hover:text-[#02530c] active:bg-white active:text-[#02530c]",
        },
  ];

  return (
    <div
      className={`h-fit flex flex-col justify-center items-center transition-all duration-500 relative bg-[#FFFDF2] py-[5vh] lg:py-[6vh] ${
        location.pathname.startsWith("/community/profile/") ? "pb-[40px]" : ""
      }`}
    >
      {location.pathname.startsWith("/community/profile/") &&
        profile?.backgroundImg && (
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat z-0"
            style={{
              backgroundImage: `url(${profile.backgroundImg || ProfilePic})`,
            }}
          />
        )}
      {location.pathname.startsWith("/community/profile/") && (
        <img
          src={profile?.businesImg || ProfilePic}
          alt="Profile_Picture"
          className="absolute bottom-[-60px] w-[120px] h-[120px] rounded-full border-4 border-[#FFCF00] shadow-lg lg:left-[12%] z-20"
          onError={(e) => (e.target.src = ProfilePic)}
        />
      )}

      <div className="container mx-auto px-[5vw]">
        <div
          className={`main-header h-fit bg-[#043D12] px-[20px] md:px-[50px] py-4 flex justify-between items-center rounded-[48px] shadow-lg relative z-30 ${
            location.pathname.startsWith("/community/profile/")
              ? "mb-[50px]"
              : ""
          }`}
        >
          <Link to="/">
            <img
              src={MindPowerLogo}
              alt="Mind_Power_Logo"
              className="md:w-[47px] md:h-[55px] w-[33px] h-[39px] object-contain brightness-100"
            />
          </Link>
          <AnimatePresence>
            {isOpen && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{
                  opacity: 1,
                  scale: 1,
                  transition: { duration: 0.4, ease: "easeOut" },
                }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="absolute top-[15vh] left-0 w-full bg-[#FFFDF2] flex flex-col items-center py-6 shadow-lg md:hidden rounded-b-[40px] z-20"
              >
                <nav className="flex flex-col items-center gap-6 w-full">
                  {navItems.map((item, index) => (
                    <motion.div
                      key={item.path}
                      variants={navItemVariants}
                      initial="hidden"
                      animate="visible"
                      exit="hidden"
                      custom={index}
                    >
                      {item.onClick ? (
                        <button
                          onClick={item.onClick}
                          className={`text-[20px] font-medium px-8 py-2 transition ${
                            item.className || ""
                          }`}
                        >
                          {item.name}
                        </button>
                      ) : (
                        <Link
                          to={item.path}
                          onClick={() => setIsOpen(false)}
                          className={`text-[20px] font-medium px-8 py-2 transition ${
                            (item.path === "/community" &&
                              location.pathname.startsWith("/community")) ||
                            location.pathname === item.path
                              ? "text-[#02530c] font-bold border-b-2 border-[#02530c]"
                              : "text-[#043D12] hover:text-[#02530c]"
                          } ${item.className || ""}`}
                        >
                          {item.name}
                        </Link>
                      )}
                    </motion.div>
                  ))}
                </nav>
              </motion.div>
            )}
          </AnimatePresence>
          <div className="hidden md:flex gap-8 items-center text-white">
            {navItems.map((item) => (
              <motion.div key={item.path} className="relative group">
                {item.onClick ? (
                  <button
                    onClick={item.onClick}
                    className={`relative text-[20px] transition-all duration-300 ${
                      item.className || ""
                    }`}
                  >
                    {item.name}
                  </button>
                ) : (
                  <Link
                    to={item.path}
                    className={`relative text-[20px] transition-all duration-300 ${
                      (item.path === "/community" &&
                        location.pathname.startsWith("/community")) ||
                      location.pathname === item.path
                        ? "text-[#FFCF00] font-bold"
                        : "hover:text-[#FFCF00]"
                    } ${item.className || ""}`}
                  >
                    {item.name}
                    {item.path !== "/login" && (
                      <motion.div
                        className="absolute bottom-[-3px] left-0 h-[3px] bg-[#FFCF00] origin-left"
                        initial={{ width: 0 }}
                        animate={{
                          width:
                            location.pathname === item.path ? "100%" : "0%",
                        }}
                        whileHover={{ width: "100%" }}
                        transition={{ duration: 0.4, ease: "easeInOut" }}
                      />
                    )}
                  </Link>
                )}
              </motion.div>
            ))}
          </div>
          <button className="md:hidden" onClick={() => setIsOpen(!isOpen)}>
            <img src={MenuIcon} alt="Hamburger_Icon" className="w-8 h-8" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Header;
