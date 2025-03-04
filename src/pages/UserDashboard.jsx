import React, { useState, useEffect } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout as reduxLogout } from "../redux/authSlice";
import { LuLayoutGrid } from "react-icons/lu";
import { PiUserCircle } from "react-icons/pi";
import { MdOutlineAnalytics } from "react-icons/md";
import { IoIosLogOut } from "react-icons/io";
import { CgMenuLeftAlt } from "react-icons/cg";
import { MdOutlineCancelPresentation } from "react-icons/md";
import BusinessImg from "../assets/businessImg.jpeg";
import { motion, AnimatePresence } from "framer-motion";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import {
  FaWhatsapp,
  FaFacebook,
  FaInstagram,
  FaLinkedin,
  FaTwitter,
  FaShareAlt,
  FaCopy,
} from "react-icons/fa";

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

const BASE_URL = "https://mbo.bookbank.com.ng";

const UserDashboard = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isAuthenticated, token } = useSelector((state) => state.auth);

  // Set initial state of isSidebarOpen to true for large screens
  const [isSidebarOpen, setIsSidebarOpen] = useState(() => {
    try {
      const isLargeScreen = window.innerWidth >= 1024; // 1024px is typically the lg breakpoint
      return (
        JSON.parse(sessionStorage.getItem("sidebarState")) || isLargeScreen
      );
    } catch (e) {
      console.warn("Cannot access sessionStorage for sidebarState:", e.message);
      return window.innerWidth >= 1024; // Default to true for large screens
    }
  });

  const [profileData, setProfileData] = useState({
    businessName: "User Name",
    businesImg: BusinessImg,
    category: "Category",
  });
  const [loading, setLoading] = useState(true);
  const [shareableLink, setShareableLink] = useState("");
  const [showShareOptions, setShowShareOptions] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!isAuthenticated || !token) {
      navigate("/login", { replace: true });
      return;
    }

    const fetchProfile = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/member/my-profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.data && response.data.success && response.data.data) {
          const profile = response.data.data;
          setProfileData({
            businessName: profile.businessName || "User Name",
            businesImg: profile.businesImg || BusinessImg,
            category:
              profile.categories?.[0]?.name || profile.category || "Category",
          });
        }
      } catch (error) {
        console.error("❌ Error Fetching Profile:", error);
        toast.error(
          error.response?.data?.message || "Failed to fetch profile data."
        );
      } finally {
        setLoading(false);
      }
    };

    const fetchShareableLink = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/member/share`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (
          response.data &&
          response.data.message === "Shareable link generated successfully"
        ) {
          setShareableLink(response.data.shareableLink);
        }
      } catch (error) {
        console.error("❌ Error Fetching Shareable Link:", error);
        toast.error(
          error.response?.data?.message || "Failed to fetch shareable link."
        );
      }
    };

    fetchProfile();
    fetchShareableLink();

    try {
      sessionStorage.setItem("sidebarState", JSON.stringify(isSidebarOpen));
    } catch (e) {
      console.warn("Cannot write to sessionStorage:", e.message);
    }
  }, [isSidebarOpen, isAuthenticated, token, navigate]);

  const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);

  const handleLogout = () => {
    dispatch(reduxLogout());
    try {
      sessionStorage.clear();
    } catch (e) {
      console.warn("Cannot clear sessionStorage:", e.message);
    }
    toast.success("Logged out successfully!");
    navigate("/login", { replace: true });
  };

  const handleShareClick = () => {
    setShowShareOptions((prev) => !prev);
    setCopied(false); // Reset copied state when toggling
  };

  const shareToSocialMedia = (platform) => {
    if (!shareableLink) {
      toast.error("No shareable link available!");
      return;
    }

    const encodedLink = encodeURIComponent(shareableLink);
    const message = `Check out my business profile: ${shareableLink}`;
    let url;

    switch (platform) {
      case "whatsapp":
        url = `https://api.whatsapp.com/send?text=${encodeURIComponent(
          message
        )}`;
        break;
      case "facebook":
        url = `https://www.facebook.com/sharer/sharer.php?u=${encodedLink}`;
        break;
      case "instagram":
        navigator.clipboard.writeText(message);
        toast.info("Link copied to clipboard! Paste it in Instagram.");
        return;
      case "linkedin":
        url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodedLink}`;
        break;
      case "twitter":
        url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
          message
        )}`;
        break;
      default:
        return;
    }

    window.open(url, "_blank");
    setShowShareOptions(false);
  };

  const handleCopyLink = () => {
    if (!shareableLink) {
      toast.error("No shareable link available!");
      return;
    }
    navigator.clipboard.writeText(shareableLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000); // Reset after 2 seconds
  };

  const shareVariants = {
    hidden: { opacity: 0, scale: 0, y: 20 },
    visible: { opacity: 1, scale: 1, y: 0 },
    exit: { opacity: 0, scale: 0, y: 20 },
  };

  const rippleVariants = {
    initial: { scale: 0, opacity: 0.5 },
    animate: { scale: 2, opacity: 0 },
  };

  return (
    <div className="w-full flex flex-col md:flex-row h-screen overflow-hidden relative">
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      {/* Sidebar */}
      <motion.aside
        initial={{ x: "-100%" }}
        animate={{
          x: isSidebarOpen || window.innerWidth >= 1024 ? "0%" : "-100%",
        }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
        className={`fixed lg:static z-50 top-0 left-0 lg:w-[25%] max-md:h-screen py-14 px-10 md:h-full h-auto overflow-y-auto bg-white border-r border-black shadow-2xl 
          ${isSidebarOpen ? "absolute md:relative" : "absolute"}`}
      >
        {/* Close button (hidden on large screens) */}
        <MdOutlineCancelPresentation
          onClick={toggleSidebar}
          className="text-[#043D12] text-[35px] absolute top-4 right-4 cursor-pointer transition-transform hover:scale-110 lg:hidden"
        />
        {/* Sidebar content */}
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
                    whileTap={{ scale: 0.95 }}
                  >
                    {item.label}
                  </motion.span>
                </Link>
              </motion.div>
            ))}
          </nav>
        </div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="flex flex-col gap-10 mt-8 relative"
        >
          <div className="rounded-[16px] border border-[#6A7368] px-4 py-4 flex flex-col gap-6">
            <figure className="flex flex-col items-center">
              <motion.img
                src={profileData.businesImg}
                alt="Business-img"
                className="rounded-full w-[77px] h-[77px] object-cover"
                whileHover={{ scale: 1.1, rotate: 5 }}
                transition={{ duration: 0.3 }}
                onError={(e) => (e.target.src = BusinessImg)}
              />
              <figcaption className="text-center text-[#6A7368]">
                <h3 className="text-[12px]">{profileData.businessName}</h3>
                <p className="text-[8px]">{profileData.category}</p>
              </figcaption>
            </figure>
            <motion.button
              className="relative text-white text-[14px] rounded-[14px] bg-[#043D12] py-3 px-4 shadow-lg overflow-hidden group"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleShareClick}
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                <FaShareAlt className="text-[16px]" />
                Share Profile
              </span>
              <span className="absolute inset-0 bg-[#03500F] transform scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-300 ease-out"></span>
            </motion.button>
            <AnimatePresence>
              {showShareOptions && (
                <motion.div
                  variants={shareVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className="top-full left-1/2 transform -translate-x-1/2 mt-2 bg-white border border-[#6A7368] rounded-lg shadow-xl p-3 flex gap-3 z-20 relative"
                >
                  {/* Share buttons */}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="mt-8"
        >
          <button
            onClick={handleLogout}
            className="text-[15px] flex items-center gap-4 px-6 py-2 rounded-[11px] transition-all duration-300 bg-red-600 text-white hover:bg-red-700 w-fit"
          >
            <IoIosLogOut className="text-[25px]" />
            Logout
          </button>
        </motion.div>
      </motion.aside>
      {/* Main content */}
      <main
        className={`transition-all duration-500 ${
          isSidebarOpen ? "md:w-[calc(100%-16rem)] ml-auto" : "w-full"
        } h-screen overflow-y-scroll`}
      >
        {/* Menu toggle button (hidden on large screens) */}
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

export default UserDashboard;
