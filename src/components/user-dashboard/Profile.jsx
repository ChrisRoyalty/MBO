import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
  CartesianGrid,
} from "recharts";
import { IoIosNotificationsOutline } from "react-icons/io";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";
import { CiUser } from "react-icons/ci";
import BusinessImg from "../../assets/businessImg.jpeg";
import { RiArrowDropDownLine } from "react-icons/ri";
import ProfileProgressBar from "./ProfileProgressBar";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FiEye, FiEyeOff } from "react-icons/fi";

const Profile = () => {
  const [timeRange, setTimeRange] = useState("daily");
  const [metric, setMetric] = useState("ProfileViews");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isProfileVisibleDropdownOpen, setIsProfileVisibleDropdownOpen] =
    useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [profileData, setProfileData] = useState({
    businessName: "User Name",
    category: "Category",
    businesImg: null,
    id: "",
  });
  const [analyticsData, setAnalyticsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFirstVisit, setIsFirstVisit] = useState(true);

  const navigate = useNavigate();
  const { isAuthenticated, user, token } = useSelector((state) => state.auth);

  const METRICS = [
    {
      title: "Profile Views",
      key: "ProfileViews",
      label: "Number of people that visited your profile",
      value: (data) => data?.views || 0,
    },
    {
      title: "Shared Links",
      key: "sharedLinks",
      label: "Number of links shared",
      value: (data) => data?.sharedClicks || 0,
    },
    {
      title: "Social Clicks",
      key: "socialClicks",
      label: "Clicks on social media links (e.g., WhatsApp)",
      value: (data) => data?.whatsappClicks || 0,
    },
  ];

  useEffect(() => {
    console.log("Redux auth state:", { isAuthenticated, user, token });
    if (!isAuthenticated || !token) {
      setError("Not authenticated or missing token!");
      setLoading(false);
      navigate("/login", { replace: true });
      return;
    }

    const fetchData = async () => {
      try {
        const profileURL = `${import.meta.env.VITE_BASE_URL}/member/my-profile`;
        const profileResponse = await axios.get(profileURL, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (
          profileResponse.data &&
          profileResponse.data.success &&
          profileResponse.data.data
        ) {
          const profile = profileResponse.data.data;
          setProfileData({
            ...profile,
            businessName: profile.businessName || "User Name",
            category: profile.categories?.[0]?.name || "Category",
            businesImg: profile.businesImg || BusinessImg,
            id: profile.id || "",
          });
          setIsVisible(!profile.deletedAt);
        } else {
          throw new Error("No profile data found in the response.");
        }

        const rangeMap = {
          daily: "daily",
          weekly: "weekly",
          monthly: "monthly",
          yearly: "yearly",
        };
        const currentTimeRange = timeRange.toLowerCase();
        const selectedRange = rangeMap[currentTimeRange] || "daily";
        const analyticsURL = `${
          import.meta.env.VITE_BASE_URL
        }/member/get-analytics?range=${selectedRange}`;
        const analyticsResponse = await axios.get(analyticsURL, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (
          analyticsResponse.data &&
          analyticsResponse.data.success &&
          analyticsResponse.data.data
        ) {
          setAnalyticsData(analyticsResponse.data.data);
        } else {
          throw new Error("No analytics data found in the response.");
        }
      } catch (error) {
        console.error("❌ Error Fetching Data:", error);
        if (
          error.response?.status === 404 ||
          error.response?.data?.message?.includes("foreign key constraint") ||
          error.response?.data?.message?.includes("not found")
        ) {
          setError(
            "Analytics or profile not found. Please ensure your profile is set up."
          );
          navigate("/business-profile", { replace: true });
        } else {
          setError(
            error.response?.data?.message ||
              "Failed to fetch profile or analytics data."
          );
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [isAuthenticated, token, navigate, timeRange]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (isDropdownOpen && !e.target.closest(".dropdown-container")) {
        setIsDropdownOpen(false);
      }
      if (
        isProfileVisibleDropdownOpen &&
        !e.target.closest(".profile-visible-dropdown")
      ) {
        setIsProfileVisibleDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isDropdownOpen, isProfileVisibleDropdownOpen]);

  const toggleVisibility = async (action) => {
    if (!profileData.id) {
      toast.error("Profile ID is missing!");
      return;
    }

    if (!token) {
      toast.error("Authentication token is missing. Please log in again.");
      navigate("/login", { replace: true });
      return;
    }

    try {
      if (action === "hide") {
        const hideURL = `${import.meta.env.VITE_BASE_URL}/member/hide-profile`;
        const response = await axios.patch(
          hideURL,
          {},
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (response.data.message) {
          setIsVisible(false);
          toast.success("Profile hidden successfully!");
          setProfileData((prev) => ({
            ...prev,
            deletedAt: new Date().toISOString(),
          }));
        } else {
          throw new Error("Failed to hide profile.");
        }
      } else if (action === "restore") {
        const restoreURL = `${
          import.meta.env.VITE_BASE_URL
        }/admin/restore-profile/${profileData.id}`;
        const response = await axios.patch(
          restoreURL,
          {},
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (
          response.data.success &&
          response.data.message === "Profile restored successfully"
        ) {
          setIsVisible(true);
          toast.success("Profile restored successfully!");
          setProfileData((prev) => ({ ...prev, deletedAt: null }));
        } else {
          throw new Error("Failed to restore profile.");
        }
      }
    } catch (error) {
      console.error("❌ Error Toggling Profile Visibility:", error);
      if (error.response?.status === 401) {
        toast.error("Session expired. Please log in again.");
        navigate("/login", { replace: true });
        return;
      }
      toast.error(
        error.response?.data?.message || "Failed to update profile visibility."
      );
    }
    setIsProfileVisibleDropdownOpen(false);
  };

  const handleContainerClick = (selectedMetric) => {
    setMetric(selectedMetric);
    setIsFirstVisit(false);
  };

  const handleTimeRangeChange = (range) => {
    const normalizedRange = range.toLowerCase();
    setTimeRange(normalizedRange);
    setIsDropdownOpen(false);
  };

  const generateGraphData = () => {
    if (!analyticsData || analyticsData.length === 0) {
      const rangeLimit =
        timeRange === "daily"
          ? 7
          : timeRange === "weekly"
          ? 4
          : timeRange === "monthly"
          ? 6
          : 5;
      return Array.from({ length: rangeLimit }, (_, index) => ({
        date: getDefaultDate(index, timeRange),
        value: Math.floor(Math.random() * 10) + 1,
      }));
    }

    const metricMap = {
      ProfileViews: "views",
      sharedLinks: "sharedClicks",
      socialClicks: "whatsappClicks",
    };

    const metricKey = metricMap[metric] || "views";
    const rangeLimit =
      timeRange === "daily"
        ? 7
        : timeRange === "weekly"
        ? 4
        : timeRange === "monthly"
        ? 6
        : 5;

    const graphData = analyticsData
      .map((item) => {
        if (!item || !item.date || item[metricKey] === undefined) {
          return null;
        }
        const date = new Date(item.date);
        if (isNaN(date.getTime())) {
          return null;
        }
        return {
          date: formatDateForRange(item.date, timeRange),
          value: item[metricKey] || 0,
        };
      })
      .filter((item) => item !== null)
      .sort((a, b) => new Date(a.date) - new Date(b.date));

    if (graphData.length < 2) {
      let lastDate = graphData.length
        ? new Date(graphData[0]?.date || new Date())
        : new Date();
      if (isNaN(lastDate.getTime())) {
        lastDate = new Date();
      }
      const mockPoints = Array.from(
        { length: rangeLimit - graphData.length },
        (_, index) => {
          const newDate = new Date(lastDate);
          try {
            if (timeRange === "daily")
              newDate.setDate(newDate.getDate() - (index + 1));
            else if (timeRange === "weekly")
              newDate.setDate(newDate.getDate() - (index + 1) * 7);
            else if (timeRange === "monthly")
              newDate.setMonth(newDate.getMonth() - (index + 1));
            else newDate.setFullYear(newDate.getFullYear() - (index + 1));
            if (isNaN(newDate.getTime())) {
              throw new Error("Invalid date generated");
            }
            return {
              date: newDate.toISOString().split("T")[0],
              value: Math.floor(Math.random() * 10) + 1,
            };
          } catch (error) {
            return {
              date: new Date(lastDate.getTime() - (index + 1) * 86400000)
                .toISOString()
                .split("T")[0],
              value: Math.floor(Math.random() * 10) + 1,
            };
          }
        }
      );
      return [...graphData, ...mockPoints]
        .sort((a, b) => new Date(a.date) - new Date(b.date))
        .slice(-rangeLimit);
    }

    return graphData.slice(-rangeLimit);
  };

  const formatDateForRange = (dateStr, range) => {
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) {
      return new Date().toISOString().split("T")[0];
    }
    if (range === "daily") {
      return date.toLocaleDateString("en-US", { weekday: "short" });
    }
    if (range === "weekly") {
      const week = getWeekNumber(date);
      return `Week ${week} ${date.getFullYear()}`;
    }
    if (range === "monthly") {
      return date.toLocaleString("default", {
        month: "short",
        year: "numeric",
      });
    }
    if (range === "yearly") return date.getFullYear().toString();
    return date.toISOString().split("T")[0];
  };

  const getWeekNumber = (date) => {
    if (isNaN(date.getTime())) {
      date = new Date();
    }
    const startOfYear = new Date(date.getFullYear(), 0, 1);
    const diff = date - startOfYear;
    const oneWeek = 1000 * 60 * 60 * 24 * 7;
    return Math.floor(diff / oneWeek) + 1;
  };

  const getDefaultDate = (index, range) => {
    const now = new Date();
    if (isNaN(now.getTime())) {
      return "Day 1";
    }
    if (range === "daily") {
      const newDate = new Date(now);
      newDate.setDate(now.getDate() - index);
      if (isNaN(newDate.getTime())) {
        return now.toLocaleDateString("en-US", { weekday: "short" });
      }
      return newDate.toLocaleDateString("en-US", { weekday: "short" });
    }
    if (range === "weekly") {
      const newDate = new Date(now);
      newDate.setDate(now.getDate() - index * 7);
      if (isNaN(newDate.getTime())) {
        return `Week ${getWeekNumber(now)} ${now.getFullYear()}`;
      }
      const week = getWeekNumber(newDate);
      return `Week ${week} ${newDate.getFullYear()}`;
    }
    if (range === "monthly") {
      const newDate = new Date(now);
      newDate.setMonth(now.getMonth() - index);
      if (isNaN(newDate.getTime())) {
        return now.toLocaleString("default", { month: "short" });
      }
      return newDate.toLocaleString("default", { month: "short" });
    }
    const newDate = new Date(now);
    newDate.setFullYear(now.getFullYear() - index);
    if (isNaN(newDate.getTime())) {
      return now.getFullYear().toString();
    }
    return newDate.getFullYear().toString();
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-white">
        <div className="flex space-x-2">
          <div className="w-3 h-3 bg-[#043D12] rounded-full animate-bounce"></div>
          <div className="w-3 h-3 bg-[#043D12] rounded-full animate-bounce delay-200"></div>
          <div className="w-3 h-3 bg-[#043D12] rounded-full animate-bounce delay-400"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-600 p-4 text-center">
        <p>{error}</p>
        {error.includes("create one") && (
          <Link
            to="/business-profile"
            className="text-blue-600 underline hover:text-blue-800"
          >
            Create Profile Now
          </Link>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 relative pb-16 px-4 sm:px-8 overflow-y-auto z-0">
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
      {/* Header */}
      <div className="h-[12vh] p-4 sm:p-8 text-[#6A7368] flex justify-between items-center gap-2">
        <strong className="text-[16px]">Dashboard</strong>
        <div className="flex items-center gap-2 sm:gap-4 px-2 sm:px-4">
          <Link to="/">
            <IoIosNotificationsOutline className="text-[24px] sm:text-[30px] text-[#6A7368] hover:text-[#043D12] transition-colors" />
          </Link>
          <Link to="/user-dashboard/profile">
            <motion.figure
              className="flex items-center bg-white rounded-full p-1 sm:p-2 shadow-md hover:shadow-lg transition-shadow duration-300 border border-gray-200"
              whileHover={{ scale: 1.05 }}
              animate={{ opacity: [1, 0.8, 1] }}
              transition={{ duration: 1, repeat: Infinity, ease: "easeInOut" }}
            >
              {profileData.businesImg ? (
                <img
                  src={profileData.businesImg}
                  alt="Business-img"
                  className="rounded-full w-[24px] h-[24px] sm:w-[32px] sm:h-[32px] object-cover border-2 border-[#043D12]"
                  onError={(e) => (e.target.src = BusinessImg)}
                />
              ) : (
                <CiUser className="text-[24px] sm:text-[32px] text-[#043D12] bg-gray-100 rounded-full p-1" />
              )}
              <figcaption className="ml-2 text-[#6A7368] hidden sm:block">
                <h3 className="text-[12px] font-semibold">
                  {profileData.businessName}
                </h3>
                <p className="text-[10px] italic">{profileData.category}</p>
              </figcaption>
            </motion.figure>
          </Link>
        </div>
      </div>

      {/* Welcome Section */}
      <div className="welcome flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 px-2 sm:px-0">
        <div className="text-[#6A7368] text-center sm:text-left">
          <h2 className="text-[16px] sm:text-[20px]">
            {isFirstVisit ? "Welcome" : "Welcome back"},{" "}
            {profileData.businessName || user?.firstname || "User"}
          </h2>
          <p className="text-[10px]">
            Subscription Status:{" "}
            <span
              className={
                user?.subscriptionStatus === "active"
                  ? "text-green-600"
                  : "text-red-600"
              }
            >
              {user?.subscriptionStatus || "Unknown"}
            </span>
          </p>
        </div>
        <div className="flex items-center gap-2 sm:gap-4">
          <div className="max-lg:hidden">
            <ProfileProgressBar />
          </div>
          <div className="relative profile-visible-dropdown max-lg:mx-auto">
            <button
              onClick={() =>
                setIsProfileVisibleDropdownOpen(!isProfileVisibleDropdownOpen)
              }
              className="flex items-center gap-2 px-3 py-2 bg-[#F5F7F5] text-[#043D12] rounded-lg shadow-md hover:bg-[#E8ECE8] transition-all text-[12px] sm:text-[14px]"
            >
              {isVisible ? (
                <FiEye className="text-[16px]" />
              ) : (
                <FiEyeOff className="text-[16px]" />
              )}
              <span>{isVisible ? "Profile Visible" : "Profile Hidden"}</span>
              <RiArrowDropDownLine className="text-[20px]" />
            </button>
            {isProfileVisibleDropdownOpen && (
              <div className="absolute right-0 top-full mt-2 bg-white border border-[#6A7368] rounded-lg shadow-lg w-[150px] sm:w-[180px] z-10">
                {isVisible ? (
                  <>
                    <button
                      onClick={() => toggleVisibility("hide")}
                      className="w-full text-left px-4 py-2 text-[#043D12] hover:bg-[#E8ECE8] transition-all text-[12px] sm:text-[14px]"
                    >
                      Hide Profile
                    </button>
                    <Link
                      to={`/community/profile/${profileData.id}`}
                      className="block w-full text-left px-4 py-2 text-[#043D12] hover:bg-[#E8ECE8] transition-all text-[12px] sm:text-[14px]"
                      onClick={() => setIsProfileVisibleDropdownOpen(false)}
                    >
                      Preview Profile
                    </Link>
                  </>
                ) : (
                  <button
                    onClick={() => toggleVisibility("restore")}
                    className="w-full text-left px-4 py-2 text-[#043D12] hover:bg-[#E8ECE8] transition-all text-[12px] sm:text-[14px]"
                  >
                    Make Profile Visible
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Profile Visibility Status Message */}
      {!isVisible && (
        <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 rounded-lg mt-4">
          <p className="text-sm">
            Your profile is currently hidden from public view. You can still
            view your dashboard and analytics below. To make your profile
            visible again, click the "Make Profile Visible" button above.
          </p>
        </div>
      )}

      {/* Dashboard Content (Always Visible) */}
      <div className="content-section">
        {/* Profile Stats */}
        <div className="mt-8 sm:mt-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {METRICS.map(({ title, key, label, value }) => (
              <div
                key={key}
                onClick={() => handleContainerClick(key)}
                className={`p-4 sm:p-6 text-[#6A7368] rounded-[11px] flex flex-col gap-2 sm:gap-4 text-center cursor-pointer shadow-md transition-all ${
                  metric === key
                    ? "bg-[#043D12] text-[#FFFDF2]"
                    : "bg-[#F5F7F5] hover:bg-[#043D12] hover:text-[#FFFDF2]"
                } ${!isVisible ? "opacity-50" : ""}`}
              >
                <h5 className="text-start text-[12px] sm:text-[14px] font-semibold">
                  {title}
                </h5>
                <figcaption className="text-[10px] sm:text-[12px]">
                  {label}
                </figcaption>
                <h3 className="count text-[24px] sm:text-[32px] font-bold">
                  {value(profileData)}
                </h3>
              </div>
            ))}
          </div>
        </div>

        {/* Graph */}
        <div className="mt-8 border-[1px] border-[#6A7368] rounded-[20px] sm:rounded-[30px] shadow-lg p-4 sm:p-6 z-20">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <h3 className="text-[14px] sm:text-[16px] text-[#6A7368]">
              {metric === "ProfileViews"
                ? "Profile Performance is Active"
                : metric === "sharedLinks"
                ? "Shared Links Performance is Active"
                : "Social Clicks Performance is Active"}
            </h3>
            <div className="relative border-[1px] rounded-lg dropdown-container">
              <div
                className="flex items-center gap-2 sm:gap-4 cursor-pointer rounded-lg px-2 py-1"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              >
                <span className="text-[12px] sm:text-[14px] text-[#6A7368]">
                  {timeRange.charAt(0).toUpperCase() + timeRange.slice(1)}
                </span>
                <RiArrowDropDownLine className="text-[16px] sm:text-[20px]" />
              </div>
              {isDropdownOpen && (
                <div className="absolute right-0 top-full mt-2 bg-white shadow-lg rounded-md w-[120px] sm:w-[140px] z-30">
                  {["daily", "weekly", "monthly", "yearly"].map((range) => (
                    <div
                      key={range}
                      className="p-2 cursor-pointer hover:bg-gray-100 text-[12px] sm:text-[14px]"
                      onClick={() => handleTimeRangeChange(range)}
                    >
                      {range.charAt(0).toUpperCase() + range.slice(1)}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          <div className="mt-6 sm:mt-8 w-full h-[250px] sm:h-[300px] relative z-30">
            <ResponsiveContainer width="100%" height="100%">
              {generateGraphData().length > 0 ? (
                <LineChart
                  data={generateGraphData()}
                  margin={{ top: 20, right: 20, left: 0, bottom: 10 }}
                >
                  <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <CartesianGrid strokeDasharray="3 3" />
                  <Tooltip
                    content={({ payload }) => {
                      return payload && payload.length ? (
                        <div className="bg-white p-2 border border-gray-300 rounded shadow">
                          <p>{payload[0].payload.date}</p>
                          <p>{payload[0].value}</p>
                        </div>
                      ) : (
                        <div>No data available</div>
                      );
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke="#82ca9d"
                    activeDot={{ r: 8 }}
                  />
                  <Legend verticalAlign="top" align="right" />
                </LineChart>
              ) : (
                <div className="flex items-center justify-center h-full text-gray-500 text-[12px] sm:text-[14px]">
                  No data available for this range
                </div>
              )}
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
