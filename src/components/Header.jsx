import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import MindPowerLogo from "../assets/mbo-logo.png";
import MenuIcon from "../assets/menu.svg";
import ProfilePic from "../assets/user-photo.svg";
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
  const navigate = useNavigate();
  const { id } = useParams();
  const [isOpen, setIsOpen] = useState(false);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [hasBusinessProfile, setHasBusinessProfile] = useState(false);
  const [isStatusLoading, setIsStatusLoading] = useState(false);

  const auth = useSelector(selectAuth);
  const dispatch = useDispatch();
  const isAuthenticated = auth.isAuthenticated;
  const userRole = auth.user?.role;
  const lastDashboard = auth.lastDashboard;
  const isAdmin = userRole === "admin";

  // Fetch user's subscription and business profile status
  useEffect(() => {
    if (isAuthenticated) {
      if (isAdmin) {
        // Admins bypass all checks
        setIsSubscribed(true);
        setHasBusinessProfile(true);
        setIsStatusLoading(false);
      } else {
        const fetchMyProfile = async () => {
          setIsStatusLoading(true);
          try {
            const API_URL = `${
              import.meta.env.VITE_BASE_URL
            }/member/my-profile`;
            const response = await axios.get(API_URL, {
              headers: { Authorization: `Bearer ${auth.token}` },
            });

            const { data } = response.data;
            const isSubActive =
              data.member.subscriptionStatus === "active" &&
              new Date() >= new Date(data.member.subscriptionStartDate) &&
              new Date() <= new Date(data.member.subscriptionEndDate);

            setIsSubscribed(isSubActive);
            setHasBusinessProfile(!!data.businessName?.trim());
          } catch (error) {
            console.error("Error fetching profile:", error);
            setIsSubscribed(false);
            setHasBusinessProfile(false);
          } finally {
            setIsStatusLoading(false);
          }
        };
        fetchMyProfile();
      }
    } else {
      setIsSubscribed(false);
      setHasBusinessProfile(false);
      setIsStatusLoading(false);
    }
  }, [isAuthenticated, auth.token, isAdmin]);

  // Fetch business profile data when on a profile page
  useEffect(() => {
    if (location.pathname.startsWith("/community/profile/")) {
      setLoading(true);
      const fetchProfile = async () => {
        try {
          const API_URL = `${
            import.meta.env.VITE_BASE_URL
          }/member/get-profile/${id}`;
          const response = await axios.get(API_URL);
          setProfile(response.data?.profile || null);
        } catch (error) {
          console.error("Error fetching business profile:", error);
          setError(error.response?.data?.message || "Failed to load profile");
        } finally {
          setLoading(false);
        }
      };
      fetchProfile();
    } else {
      setProfile(null);
    }
  }, [location.pathname, id]);

  // Track dashboard visits
  useEffect(() => {
    if (location.pathname === "/admin") {
      dispatch(setLastDashboard("/admin"));
    } else if (location.pathname === "/user-dashboard") {
      dispatch(setLastDashboard("/user-dashboard"));
    }
  }, [location.pathname, dispatch]);

  const handleLogout = () => {
    dispatch(logout());
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    toast.success("Logged out successfully!");
    navigate("/login");
    setIsOpen(false);
  };

  const dashboardRoute =
    lastDashboard || (isAdmin ? "/admin" : "/user-dashboard");

  const navItems = [
    { name: "Home", path: "/" },
    { name: "Community", path: "/community" },
    isAuthenticated &&
    (isAdmin || (isSubscribed && hasBusinessProfile)) &&
    !isStatusLoading
      ? {
          name: "Dashboard",
          path: dashboardRoute,
          className:
            "border border-white rounded-[39px] lg:ml-8 px-8 py-2 hover:bg-white hover:text-[#02530c]",
        }
      : {
          name: "Log In",
          path: "/login",
          className:
            "border border-white rounded-[39px] lg:ml-8 px-8 py-2 hover:bg-white hover:text-[#02530c]",
        },
  ].filter(Boolean);

  return (
    <div
      className={`relative bg-[#FFFDF2] py-[5vh] lg:py-[6vh] ${
        location.pathname.startsWith("/community/profile/") ? "pb-[40px]" : ""
      }`}
    >
      {/* Background image for profile pages */}
      {location.pathname.startsWith("/community/profile/") &&
        profile?.backgroundImg && (
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat z-0"
            style={{ backgroundImage: `url(${profile.backgroundImg})` }}
          />
        )}

      {/* Business profile picture - centered on mobile */}
      {location.pathname.startsWith("/community/profile/") && (
        <img
          src={profile?.businesImg || ProfilePic}
          alt="Business Profile"
          className="absolute bottom-[-60px] w-[120px] h-[120px] rounded-full border-4 border-[#FFCF00] shadow-lg lg:left-[12%] left-[calc(50%-60px)] z-20"
          onError={(e) => (e.target.src = ProfilePic)}
        />
      )}

      <div className="container mx-auto px-[5vw]">
        <div
          className={`bg-[#043D12] px-5 md:px-12 py-4 flex justify-between items-center rounded-[48px] shadow-lg relative z-30 ${
            location.pathname.startsWith("/community/profile/")
              ? "mb-[50px]"
              : ""
          }`}
        >
          <Link to="/">
            <img
              src={MindPowerLogo}
              alt="Logo"
              className="w-8 md:w-12 object-contain"
            />
          </Link>

          {/* Mobile menu */}
          <AnimatePresence>
            {isOpen && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.3 }}
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
                      <Link
                        to={item.path}
                        onClick={() => setIsOpen(false)}
                        className={`text-xl font-medium px-8 py-2 ${
                          (item.path === "/community" &&
                            location.pathname.startsWith("/community")) ||
                          location.pathname === item.path
                            ? "text-[#02530c] font-bold border-b-2 border-[#02530c]"
                            : "text-[#043D12] hover:text-[#02530c]"
                        } ${item.className || ""}`}
                      >
                        {item.name}
                      </Link>
                    </motion.div>
                  ))}
                </nav>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Desktop menu */}
          <div className="hidden md:flex gap-8 items-center text-white">
            {navItems.map((item) => (
              <motion.div key={item.path} className="relative group">
                <Link
                  to={item.path}
                  className={`text-xl ${item.className || ""} ${
                    (item.path === "/community" &&
                      location.pathname.startsWith("/community")) ||
                    location.pathname === item.path
                      ? "text-[#FFCF00] font-bold"
                      : "hover:text-[#FFCF00]"
                  }`}
                >
                  {item.name}
                  {item.path !== "/login" && item.path !== "/" && (
                    <motion.div
                      className="absolute bottom-[-3px] left-0 h-[3px] bg-[#FFCF00]"
                      initial={{ width: 0 }}
                      animate={{
                        width: location.pathname === item.path ? "100%" : "0%",
                      }}
                      whileHover={{ width: "100%" }}
                      transition={{ duration: 0.3 }}
                    />
                  )}
                </Link>
              </motion.div>
            ))}
          </div>

          <button
            className="md:hidden"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            <img src={MenuIcon} alt="Menu" className="w-8 h-8" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Header;
