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
import BusinessImg from "../../assets/businessImg.jpeg"; // Fallback image
import { RiArrowDropDownLine } from "react-icons/ri";
import ProfileProgressBar from "./ProfileProgressBar";

const BASE_URL = "https://mbo.bookbank.com.ng";

const Profile = () => {
  const [timeRange, setTimeRange] = useState("daily"); // Default to "daily" for endpoint compatibility
  const [metric, setMetric] = useState("ProfileViews");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [profileData, setProfileData] = useState({
    businessName: "User Name",
    category: "Category",
    businesImg: null,
  });
  const [analyticsData, setAnalyticsData] = useState([]); // State for analytics
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
    if (!isAuthenticated || !token) {
      setError("Not authenticated or missing token!");
      setLoading(false);
      navigate("/login", { replace: true });
      return;
    }

    const fetchData = async () => {
      try {
        // Fetch profile data
        const profileURL = `${BASE_URL}/member/my-profile`;
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
          });
        } else {
          throw new Error("No profile data found in the response.");
        }

        // Fetch analytics data based on timeRange
        const rangeMap = {
          daily: "daily",
          weekly: "weekly",
          monthly: "monthly",
          yearly: "yearly",
        };
        const currentTimeRange = timeRange.toLowerCase(); // Use current timeRange, normalized
        const selectedRange = rangeMap[currentTimeRange] || "daily"; // Ensure lowercase mapping
        console.log(
          "Current timeRange:",
          currentTimeRange,
          "Selected range for API:",
          selectedRange
        ); // Debugging
        const analyticsURL = `${BASE_URL}/member/get-analytics?range=${selectedRange}`;
        console.log("API URL:", analyticsURL); // Debugging
        const analyticsResponse = await axios.get(analyticsURL, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (
          analyticsResponse.data &&
          analyticsResponse.data.success &&
          analyticsResponse.data.data
        ) {
          setAnalyticsData(analyticsResponse.data.data);
          console.log("Analytics Data received:", analyticsResponse.data.data);
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
  }, [isAuthenticated, token, navigate, timeRange]); // Ensure timeRange triggers re-fetch

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (isDropdownOpen && !e.target.closest(".dropdown-container")) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isDropdownOpen]);

  const toggleVisibility = () => setIsVisible((prevState) => !prevState);

  const handleContainerClick = (selectedMetric) => {
    setMetric(selectedMetric);
    setIsFirstVisit(false);
  };

  const handleTimeRangeChange = (range) => {
    // Normalize range to lowercase to ensure consistency
    const normalizedRange = range.toLowerCase();
    setTimeRange(normalizedRange);
    setIsDropdownOpen(false);
    console.log("Time range changed to:", normalizedRange); // Debugging
  };

  const generateGraphData = () => {
    console.log("Analytics Data:", analyticsData, "Time Range:", timeRange);
    if (!analyticsData || analyticsData.length === 0) {
      console.warn("No analytics data available, showing placeholder.");
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
        value: Math.floor(Math.random() * 10) + 1, // Random values (1-10) for visibility
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
          console.warn("Invalid item in analytics data:", item);
          return null;
        }
        // Ensure date is a valid ISO string before processing
        const dateStr = item.date;
        const date = new Date(dateStr);
        if (isNaN(date.getTime())) {
          console.warn(
            "Invalid date in analytics data:",
            dateStr,
            "using fallback."
          );
          return null; // Skip invalid dates
        }
        return {
          date: formatDateForRange(dateStr, timeRange),
          value: item[metricKey] || 0,
        };
      })
      .filter((item) => item !== null)
      .sort((a, b) => new Date(a.date) - new Date(b.date));

    // If less than 2 points, pad with mock data to ensure a visible line
    if (graphData.length < 2) {
      console.warn("Insufficient data points, adding mock data.");
      let lastDate = graphData.length
        ? new Date(graphData[0]?.date || new Date())
        : new Date();
      if (isNaN(lastDate.getTime())) {
        console.warn("Invalid lastDate, using current date as fallback.");
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
              value: Math.floor(Math.random() * 10) + 1, // Random values (1-10) for visibility
            };
          } catch (error) {
            console.error("Error generating mock date:", error);
            return {
              date: new Date(lastDate.getTime() - (index + 1) * 86400000)
                .toISOString()
                .split("T")[0], // Fallback to daily decrement
              value: Math.floor(Math.random() * 10) + 1,
            };
          }
        }
      );
      return [...graphData, ...mockPoints]
        .sort((a, b) => new Date(a.date) - new Date(b.date))
        .slice(-rangeLimit);
    }

    console.log("Generated Graph Data:", graphData);
    return graphData.slice(-rangeLimit);
  };

  const formatDateForRange = (dateStr, range) => {
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) {
      console.warn(
        "Invalid date string:",
        dateStr,
        "using current date as fallback."
      );
      return new Date().toISOString().split("T")[0];
    }
    if (range === "daily") {
      return date.toLocaleDateString("en-US", { weekday: "short" }); // e.g., "Mon", "Tue", etc.
    }
    if (range === "weekly") {
      const week = getWeekNumber(date);
      return `Week ${week} ${date.getFullYear()}`;
    }
    if (range === "monthly") {
      return date.toLocaleString("default", {
        month: "short",
        year: "numeric",
      }); // e.g., "Mar 2025"
    }
    if (range === "yearly") return date.getFullYear().toString(); // e.g., "2025"
    return date.toISOString().split("T")[0]; // Fallback (YYYY-MM-DD)
  };

  const getWeekNumber = (date) => {
    if (isNaN(date.getTime())) {
      console.warn("Invalid date for week number, using current date.");
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
      console.error("Current date is invalid, using fallback.");
      return "Day 1"; // Fallback default
    }
    if (range === "daily") {
      const newDate = new Date(now);
      newDate.setDate(now.getDate() - index);
      if (isNaN(newDate.getTime())) {
        console.warn(
          `Invalid date for index ${index} in daily, using fallback.`
        );
        return now.toLocaleDateString("en-US", { weekday: "short" });
      }
      return newDate.toLocaleDateString("en-US", { weekday: "short" }); // e.g., "Mon", "Sun"
    }
    if (range === "weekly") {
      const newDate = new Date(now);
      newDate.setDate(now.getDate() - index * 7);
      if (isNaN(newDate.getTime())) {
        console.warn(
          `Invalid date for index ${index} in weekly, using fallback.`
        );
        return `Week ${getWeekNumber(now)} ${now.getFullYear()}`;
      }
      const week = getWeekNumber(newDate);
      return `Week ${week} ${newDate.getFullYear()}`;
    }
    if (range === "monthly") {
      const newDate = new Date(now);
      newDate.setMonth(now.getMonth() - index);
      if (isNaN(newDate.getTime())) {
        console.warn(
          `Invalid date for index ${index} in monthly, using fallback.`
        );
        return now.toLocaleString("default", { month: "short" });
      }
      return newDate.toLocaleString("default", { month: "short" });
    }
    const newDate = new Date(now);
    newDate.setFullYear(now.getFullYear() - index);
    if (isNaN(newDate.getTime())) {
      console.warn(
        `Invalid date for index ${index} in yearly, using fallback.`
      );
      return now.getFullYear().toString();
    }
    return newDate.getFullYear().toString(); // Yearly
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-[#FFFDF2]">
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
    <div className="flex flex-col gap-4 relative pb-16 px-8 overflow-y-auto z-0">
      {/* Header */}
      <div className="h-[12vh] p-8 text-[#6A7368] flex justify-between items-center gap-2">
        <strong className="text-[16px]">Dashboard</strong>
        <div className="flex items-center md:gap-4 px-4">
          <Link to="/">
            <IoIosNotificationsOutline className="text-[30px] text-[#6A7368] hover:text-[#043D12] transition-colors" />
          </Link>
          <Link to="/user-dashboard/profile">
            <motion.figure
              className="flex items-center bg-white rounded-full p-2 shadow-md hover:shadow-lg transition-shadow duration-300 border border-gray-200"
              whileHover={{ scale: 1.05 }}
              animate={{ opacity: [1, 0.8, 1] }}
              transition={{ duration: 1, repeat: Infinity, ease: "easeInOut" }}
            >
              {profileData.businesImg ? (
                <img
                  src={profileData.businesImg}
                  alt="Business-img"
                  className="rounded-full w-[32px] h-[32px] object-cover border-2 border-[#043D12]"
                  onError={(e) => (e.target.src = BusinessImg)}
                />
              ) : (
                <CiUser className="text-[32px] text-[#043D12] bg-gray-100 rounded-full p-1" />
              )}
              <figcaption className="ml-2 text-[#6A7368] max-md:hidden">
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
      <div className="welcome flex max-lg:flex-col max-lg:justify-center justify-between items-center gap-4">
        <div className="text-[#6A7368]">
          <h2 className="text-[20px]">
            {isFirstVisit ? "Welcome" : "Welcome back"},{" "}
            {profileData.businessName || user?.firstname || "User"}
          </h2>
          <p className="text-[10px] max-lg:text-center">
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
        <ProfileProgressBar />
        <div>
          <button
            onClick={toggleVisibility}
            className="bg-[#043D12] text-white px-4 py-2 rounded-lg hover:bg-[#03500F] transition-all"
          >
            {isVisible ? "Hide Profile" : "Show Profile"}
          </button>
        </div>
      </div>

      {/* Conditionally Render Content */}
      <div
        className={`content-section transition-all duration-300 ${
          isVisible ? "opacity-100 visible" : "opacity-0 invisible h-0"
        }`}
      >
        {/* Profile Stats */}
        <div className="mt-12">
          <div className="grid lg:grid-cols-3 md:grid-cols-3 grid-cols-1 w-full gap-4">
            {METRICS.map(({ title, key, label, value }) => (
              <div
                key={key}
                onClick={() => handleContainerClick(key)}
                className={`lg:px-6 px-2 py-4 text-[14px] text-[#6A7368] hover:text-white hover:bg-[#043D12] rounded-[11px] flex flex-col gap-4 text-center cursor-pointer ${
                  metric === key
                    ? "lg:col-span-1 md:col-span-1 col-span-2 bg-[#043D12] text-[#FFFDF2]"
                    : "bg-gray-200"
                }`}
              >
                <h5 className="text-start max-lg:text-[12px]">{title}</h5>
                <figcaption className="text-[14px]">{label}</figcaption>
                <h3 className="count text-[32px]">{value(profileData)}</h3>
              </div>
            ))}
          </div>
        </div>

        {/* Graph */}
        <div className="mt-8 border-[1px] border-[#6A7368] rounded-[30px] shadow-lg p-4 z-20">
          <div className="flex items-center justify-between">
            <h3 className="text-[16px] text-[#6A7368]">
              {metric === "ProfileViews"
                ? "Profile Performance is Active"
                : metric === "sharedLinks"
                ? "Shared Links Performance is Active"
                : "Social Clicks Performance is Active"}
            </h3>
            <div className="mt-4 relative border-[1px] rounded-lg dropdown-container">
              <div
                className="flex items-center gap-4 cursor-pointer rounded-lg px-2 py-1"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              >
                <span className="text-[14px] text-[#6A7368]">
                  {timeRange.charAt(0).toUpperCase() + timeRange.slice(1)}
                </span>
                <RiArrowDropDownLine className="text-[20px]" />
              </div>
              {isDropdownOpen && (
                <div className="absolute left-0 top-full mt-2 bg-white shadow-lg rounded-md w-full z-30">
                  {["daily", "weekly", "monthly", "yearly"].map((range) => (
                    <div
                      key={range}
                      className="p-2 cursor-pointer hover:bg-gray-100"
                      onClick={() => handleTimeRangeChange(range)}
                    >
                      {range.charAt(0).toUpperCase() + range.slice(1)}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          <div className="mt-8 w-full h-[300px] relative z-30">
            <ResponsiveContainer width="100%" height="100%">
              {generateGraphData().length > 0 ? (
                <LineChart
                  data={generateGraphData()}
                  margin={{ top: 20, right: 30, left: 20, bottom: 10 }}
                >
                  <XAxis dataKey="date" />
                  <YAxis />
                  <CartesianGrid strokeDasharray="3 3" />{" "}
                  {/* Grid for visibility */}
                  <Tooltip
                    content={({ payload }) => {
                      console.log("Tooltip Payload:", payload);
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
                    stroke="#82ca9d" // Green, visible against #FFFDF2
                    activeDot={{ r: 8 }}
                  />
                  <Legend verticalAlign="top" align="right" />
                </LineChart>
              ) : (
                <div className="flex items-center justify-center h-full text-gray-500">
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
