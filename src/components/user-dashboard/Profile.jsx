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
  const [timeRange, setTimeRange] = useState("monthly");
  const [metric, setMetric] = useState("ProfileViews");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [profileData, setProfileData] = useState({
    businessName: "User Name",
    category: "Category",
    businesImg: null, // Null until loaded, uses default icon
  });
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
      label: "Clicks on social media links",
      value: (data) => {
        try {
          const socialClicks = data?.socialClicks || {};
          return Object.values(socialClicks).reduce(
            (total, clicks) => total + (clicks || 0),
            0
          );
        } catch (error) {
          console.error("Error parsing socialClicks:", error);
          return 0;
        }
      },
    },
  ];

  useEffect(() => {
    if (!isAuthenticated || !token) {
      setError("Not authenticated or missing token!");
      setLoading(false);
      navigate("/login", { replace: true });
      return;
    }

    const fetchProfile = async () => {
      try {
        const API_URL = `${BASE_URL}/member/my-profile`;
        const response = await axios.get(API_URL, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.data && response.data.success && response.data.data) {
          const profile = response.data.data;
          setProfileData({
            ...profile,
            businessName: profile.businessName || "User Name",
            category: profile.categories?.[0]?.name || "Category",
            businesImg: profile.businesImg || BusinessImg,
          });
        } else {
          throw new Error("No profile data found in the response.");
        }
      } catch (error) {
        console.error("❌ Error Fetching Profile:", error);
        if (
          error.response?.status === 404 ||
          error.response?.data?.message?.includes("foreign key constraint") ||
          error.response?.data?.message?.includes("not found")
        ) {
          setError("Profile not found. Please create one.");
          navigate("/business-profile", { replace: true });
        } else {
          setError(
            error.response?.data?.message || "Failed to fetch profile data."
          );
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [isAuthenticated, token, navigate]);

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
    setTimeRange(range);
    setIsDropdownOpen(false);
  };

  const generateGraphData = () => {
    const dataPoints =
      timeRange === "daily" ? 7 : timeRange === "weekly" ? 4 : 6;
    const baseValue = profileData
      ? metric === "ProfileViews"
        ? profileData.views || 0
        : metric === "sharedLinks"
        ? profileData.sharedClicks || 0
        : (() => {
            try {
              const socialClicks = profileData.socialClicks || {};
              return (
                Object.values(socialClicks).reduce(
                  (total, clicks) => total + (clicks || 0),
                  0
                ) || 0
              );
            } catch (error) {
              console.error("Error parsing socialClicks:", error);
              return 0;
            }
          })()
      : 0;

    return Array.from({ length: dataPoints }, (_, index) => ({
      date:
        timeRange === "daily"
          ? `Day ${index + 1}`
          : timeRange === "weekly"
          ? `Week ${index + 1}`
          : new Date(2023, index).toLocaleString("default", { month: "short" }),
      value: baseValue + Math.floor(Math.random() * 10),
    }));
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
            {profileData.businessName || user?.firstName || "User"}
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
        <div className="mt-8 border-[1px] border-[#6A7368] rounded-[30px] shadow-lg p-4">
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
                <div className="absolute left-0 top-full mt-2 bg-white shadow-lg rounded-md w-full z-10">
                  {["daily", "weekly", "monthly"].map((range) => (
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
          <div className="mt-8 w-full">
            <ResponsiveContainer height={300}>
              <LineChart
                data={generateGraphData()}
                margin={{ top: 20, right: 30, left: 20, bottom: 10 }}
              >
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip
                  content={({ payload }) =>
                    payload && payload.length ? (
                      <div className="bg-white p-2 border border-gray-300 rounded shadow">
                        <p>{payload[0].payload.date}</p>
                        <p>{payload[0].value}</p>
                      </div>
                    ) : null
                  }
                />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#82ca9d"
                  activeDot={{ r: 8 }}
                />
                <Legend />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
