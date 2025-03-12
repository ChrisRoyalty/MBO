import React, { useState, useEffect, useRef } from "react";
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
import { RiArrowDropDownLine } from "react-icons/ri";
import {
  FiLock,
  FiKey,
  FiEye,
  FiEyeOff,
  FiAlertCircle,
  FiCheckCircle,
} from "react-icons/fi";
import { AiOutlineClose } from "react-icons/ai";
import { toast, ToastContainer } from "react-toastify"; // Import ToastContainer
import "react-toastify/dist/ReactToastify.css"; // Ensure CSS is imported

const Display = () => {
  const [timeRange, setTimeRange] = useState("daily");
  const [metric, setMetric] = useState("profilesCreated");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [profileData, setProfileData] = useState({
    firstname: "",
    lastname: "",
  });
  const [analyticsData, setAnalyticsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFirstVisit, setIsFirstVisit] = useState(true);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [isChangePasswordModalOpen, setIsChangePasswordModalOpen] =
    useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [changePasswordFormData, setChangePasswordFormData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false);
  const [passwordValidation, setPasswordValidation] = useState("");

  const navigate = useNavigate();
  const { isAuthenticated, user, token } = useSelector((state) => state.auth);

  const profileDropdownRef = useRef(null);
  const changePasswordModalRef = useRef(null);

  const METRICS = [
    {
      title: "Total Users",
      key: "profilesCreated",
      label: "Number of people who successfully created a business profile",
      value: (data) => data?.profilesCreated || 0,
    },
    {
      title: "Active Users",
      key: "activeSubscribers",
      label: "Number of users that have active subscriptions",
      value: (data) => data?.activeSubscribers || 0,
    },
    {
      title: "Total Visitors",
      key: "websiteVisits",
      label: "Number of people that have visited the website",
      value: (data) => data?.websiteVisits || 0,
    },
  ];

  useEffect(() => {
    if (!isAuthenticated || !token) {
      setError("Not authenticated or missing token!");
      setLoading(false);
      navigate("/login", { replace: true });
      toast.info("Redirecting to login..."); // This will now show
      return;
    }

    const fetchData = async () => {
      try {
        if (user && user.firstName && user.lastName) {
          setProfileData({
            firstname: user.firstName,
            lastname: user.lastName,
          });
        } else {
          console.warn(
            "User data missing in Redux store, using defaults.",
            user
          );
          setProfileData({
            firstname: "Admin",
            lastname: "Hello",
          });
        }

        const typeMap = {
          daily: "day",
          weekly: "week",
          monthly: "month",
          yearly: "year",
        };
        const currentType = typeMap[timeRange.toLowerCase()] || "day";
        console.log(
          "Current timeRange:",
          timeRange,
          "Selected type for API:",
          currentType
        );
        const analyticsURL = `${
          import.meta.env.VITE_BASE_URL
        }/admin/admin-analytics?type=${currentType}`;
        console.log("API URL:", analyticsURL);
        const analyticsResponse = await axios.get(analyticsURL, {
          headers: { Authorization: `Bearer ${token}` },
        });

        console.log("Full Analytics Response:", analyticsResponse.data);
        if (
          analyticsResponse.data &&
          Array.isArray(analyticsResponse.data.data)
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
          error.response?.data?.message?.includes("not found")
        ) {
          setError(
            "Analytics data not found. Please ensure the admin analytics endpoint is accessible."
          );
        } else {
          setError(
            error.response?.data?.message || "Failed to fetch admin data."
          );
        }
        toast.error(
          error.response?.data?.message || "Failed to fetch admin data."
        ); // This will now show
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [isAuthenticated, token, navigate, timeRange, user]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (isDropdownOpen && !e.target.closest(".dropdown-container")) {
        setIsDropdownOpen(false);
      }
      if (
        showProfileDropdown &&
        profileDropdownRef.current &&
        !profileDropdownRef.current.contains(e.target)
      ) {
        setShowProfileDropdown(false);
      }
      if (
        isChangePasswordModalOpen &&
        changePasswordModalRef.current &&
        !changePasswordModalRef.current.contains(e.target)
      ) {
        setIsChangePasswordModalOpen(false);
        setChangePasswordFormData({
          oldPassword: "",
          newPassword: "",
          confirmNewPassword: "",
        });
        setPasswordValidation("");
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isDropdownOpen, showProfileDropdown, isChangePasswordModalOpen]);

  const toggleVisibility = () => setIsVisible((prevState) => !prevState);

  const handleContainerClick = (selectedMetric) => {
    setMetric(selectedMetric);
    setIsFirstVisit(false);
  };

  const handleTimeRangeChange = (range) => {
    const normalizedRange = range.toLowerCase();
    setTimeRange(normalizedRange);
    setIsDropdownOpen(false);
    console.log("Time range changed to:", normalizedRange);
  };

  const toggleProfileDropdown = () => {
    setShowProfileDropdown((prev) => !prev);
  };

  const handleChangePassword = () => {
    setIsChangePasswordModalOpen(true);
    setShowProfileDropdown(false);
  };

  const handleChangePasswordInputChange = (e) => {
    const { name, value } = e.target;
    setChangePasswordFormData((prev) => ({ ...prev, [name]: value }));

    const updatedFormData = { ...changePasswordFormData, [name]: value };
    const newPass = (
      name === "newPassword" ? value : updatedFormData.newPassword
    ).trim();
    const confirmPass = (
      name === "confirmNewPassword" ? value : updatedFormData.confirmNewPassword
    ).trim();

    console.log("New Password:", newPass);
    console.log("Confirm New Password:", confirmPass);

    if (!newPass) {
      setPasswordValidation("");
    } else if (newPass.length <= 4) {
      setPasswordValidation("Password must be longer than 4 characters");
    } else if (confirmPass && newPass !== confirmPass) {
      setPasswordValidation("Passwords do not match");
    } else {
      setPasswordValidation("Password is valid");
    }
  };

  const handleChangePasswordSubmit = async (e) => {
    e.preventDefault();
    if (!changePasswordFormData.oldPassword) {
      toast.error("Please enter your current password.");
      return;
    }
    if (
      changePasswordFormData.newPassword !==
      changePasswordFormData.confirmNewPassword
    ) {
      toast.error("New passwords do not match.");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await axios.patch(
        `${import.meta.env.VITE_BASE_URL}/member/change-password`,
        {
          oldPassword: changePasswordFormData.oldPassword,
          newPassword: changePasswordFormData.newPassword,
          confirmPassword: changePasswordFormData.confirmNewPassword,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success(response.data.message || "Password changed successfully.");
      setIsChangePasswordModalOpen(false);
      setChangePasswordFormData({
        oldPassword: "",
        newPassword: "",
        confirmNewPassword: "",
      });
      setPasswordValidation("");
    } catch (error) {
      console.error(
        "❌ Error Changing Password:",
        error.response?.data || error.message
      );
      toast.error(
        error.response?.data?.message || "Failed to change password."
      );
    } finally {
      setIsSubmitting(false);
    }
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
        value: Math.floor(Math.random() * 10) + 1,
      }));
    }

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
        if (!item || !item.date || item[metric] === undefined) {
          console.warn("Invalid item in analytics data:", item);
          return null;
        }
        const date = new Date(item.date);
        if (isNaN(date.getTime())) {
          console.warn(
            "Invalid date in analytics data:",
            item.date,
            "using fallback."
          );
          return null;
        }
        return {
          date: formatDateForRange(item.date, timeRange),
          value: item[metric] || 0,
        };
      })
      .filter((item) => item !== null)
      .sort((a, b) => new Date(a.date) - new Date(b.date));

    if (graphData.length < 2) {
      console.warn("Insufficient data points, adding mock data.");
      let lastDate = graphData.length
        ? new Date(graphData[0].date)
        : new Date();
      if (isNaN(lastDate.getTime())) lastDate = new Date();
      const mockPoints = Array.from(
        { length: rangeLimit - graphData.length },
        (_, index) => {
          const newDate = new Date(lastDate);
          if (timeRange === "daily")
            newDate.setDate(newDate.getDate() - (index + 1));
          else if (timeRange === "weekly")
            newDate.setDate(newDate.getDate() - (index + 1) * 7);
          else if (timeRange === "monthly")
            newDate.setMonth(newDate.getMonth() - (index + 1));
          else newDate.setFullYear(newDate.getFullYear() - (index + 1));
          if (isNaN(newDate.getTime())) {
            console.error("Invalid mock date generated, using fallback.");
            return {
              date: new Date().toISOString().split("T")[0],
              value: Math.floor(Math.random() * 10) + 1,
            };
          }
          return {
            date: newDate.toISOString().split("T")[0],
            value: Math.floor(Math.random() * 10) + 1,
          };
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
    if (range === "daily")
      return date.toLocaleDateString("en-US", { weekday: "short" });
    if (range === "weekly") {
      const week = getWeekNumber(date);
      return `Week ${week}`;
    }
    if (range === "monthly")
      return date.toLocaleString("default", { month: "short" });
    if (range === "yearly") return date.getFullYear().toString();
    return date.toISOString().split("T")[0];
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
      return "Day 1";
    }
    if (range === "daily") {
      const newDate = new Date(now);
      newDate.setDate(now.getDate() - index);
      if (isNaN(newDate.getTime()))
        return now.toLocaleDateString("en-US", { weekday: "short" });
      return newDate.toLocaleDateString("en-US", { weekday: "short" });
    }
    if (range === "weekly") {
      const newDate = new Date(now);
      newDate.setDate(now.getDate() - index * 7);
      if (isNaN(newDate.getTime())) return `Week ${getWeekNumber(now)}`;
      const week = getWeekNumber(newDate);
      return `Week ${week}`;
    }
    if (range === "monthly") {
      const newDate = new Date(now);
      newDate.setMonth(now.getMonth() - index);
      if (isNaN(newDate.getTime()))
        return now.toLocaleString("default", { month: "short" });
      return newDate.toLocaleString("default", { month: "short" });
    }
    const newDate = new Date(now);
    newDate.setFullYear(now.getFullYear() - index);
    if (isNaN(newDate.getTime())) return now.getFullYear().toString();
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
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 relative px-4 sm:px-8 min-h-screen bg-white overflow-y-auto">
      {/* Add ToastContainer here */}
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
        style={{ zIndex: 9999 }}
      />

      {/* Header */}
      <div className="h-[12vh] p-4 sm:p-8 text-[#6A7368] flex flex-col sm:flex-row justify-between items-center gap-2">
        {/* Welcome Section */}
        <div className="welcome flex flex-col sm:flex-row items-center gap-2 sm:gap-4">
          <h2 className="text-base sm:text-xl md:text-2xl">
            {isFirstVisit ? "Welcome" : "Welcome back"},{" "}
            {profileData.firstname || "Admin"}
          </h2>
        </div>
        <div className="flex items-center gap-2 sm:gap-4">
          <Link to="/admin/manage-notifications">
            <IoIosNotificationsOutline className="text-2xl sm:text-3xl text-[#6A7368] hover:text-[#043D12] transition-colors" />
          </Link>
          <div className="relative">
            <motion.figure
              className="flex items-center bg-white rounded-full p-1 sm:p-2 shadow-md hover:shadow-lg transition-shadow duration-300 border border-gray-200 cursor-pointer"
              whileHover={{ scale: 1.05 }}
              animate={{ opacity: [1, 0.8, 1] }}
              transition={{ duration: 1, repeat: Infinity, ease: "easeInOut" }}
              onClick={toggleProfileDropdown}
            >
              <CiUser className="text-2xl text-[#043D12] bg-gray-100 rounded-full p-1" />
              <figcaption className="ml-2 text-[#6A7368] hidden sm:block">
                <h3 className="text-xs sm:text-sm font-semibold">
                  {profileData.firstname} {profileData.lastname}
                </h3>
              </figcaption>
            </motion.figure>
            {showProfileDropdown && (
              <div
                ref={profileDropdownRef}
                className="absolute right-0 mt-2 w-40 sm:w-48 bg-white border border-gray-200 rounded-md shadow-lg z-50"
              >
                <button
                  className="w-full text-left px-3 py-2 text-sm text-[#6A7368] flex items-center gap-2 hover:bg-gray-100"
                  onClick={handleChangePassword}
                >
                  <FiLock /> Change Password
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div
        className={`content-section transition-all duration-300 ${
          isVisible ? "opacity-100 visible" : "opacity-0 invisible h-0"
        }`}
      >
        {/* Profile Stats */}
        <div className="">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {METRICS.map(({ title, key, label, value }) => (
              <div
                key={key}
                onClick={() => handleContainerClick(key)}
                className={`p-4 text-sm text-[#6A7368] hover:text-white hover:bg-[#043D12] rounded-xl flex flex-col gap-2 text-center cursor-pointer ${
                  metric === key ? "bg-[#043D12] text-[#FFFDF2]" : "bg-gray-200"
                }`}
              >
                <h5 className="text-start text-xs sm:text-sm">{title}</h5>
                <figcaption className="text-xs">{label}</figcaption>
                <h3 className="count text-xl sm:text-2xl md:text-3xl">
                  {value(analyticsData[0] || {})}
                </h3>
              </div>
            ))}
          </div>
        </div>

        {/* Graph */}
        <div className="mt-6 sm:mt-8 border-[1px] border-[#6A7368] rounded-3xl shadow-lg p-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
            <h3 className="text-sm sm:text-base text-[#6A7368]">
              {metric === "profilesCreated"
                ? "Total Users"
                : metric === "activeSubscribers"
                ? "Active Users"
                : "Total Visitors"}
            </h3>
            <div className="relative border-[1px] rounded-lg dropdown-container w-full sm:w-auto">
              <div
                className="flex items-center gap-2 sm:gap-4 cursor-pointer rounded-lg px-2 py-1"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              >
                <span className="text-xs sm:text-sm text-[#6A7368]">
                  {timeRange.charAt(0).toUpperCase() + timeRange.slice(1)}
                </span>
                <RiArrowDropDownLine className="text-lg sm:text-xl" />
              </div>
              {isDropdownOpen && (
                <div className="absolute left-0 top-full mt-2 bg-white shadow-lg rounded-md w-full sm:w-32 z-30">
                  {["daily", "weekly", "monthly", "yearly"].map((range) => (
                    <div
                      key={range}
                      className="p-2 text-xs sm:text-sm cursor-pointer hover:bg-gray-100"
                      onClick={() => handleTimeRangeChange(range)}
                    >
                      {range.charAt(0).toUpperCase() + range.slice(1)}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          <div className="mt-4 sm:mt-8 w-full h-[250px] sm:h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              {generateGraphData().length > 0 ? (
                <LineChart
                  data={generateGraphData()}
                  margin={{ top: 20, right: 10, left: -20, bottom: 10 }}
                >
                  <XAxis
                    dataKey="date"
                    tick={{ fontSize: 10 }}
                    angle={-45}
                    textAnchor="end"
                    height={60}
                  />
                  <YAxis tick={{ fontSize: 12 }} />
                  <CartesianGrid strokeDasharray="3 3" />
                  <Tooltip
                    content={({ payload }) => {
                      return payload && payload.length ? (
                        <div className="bg-white p-2 border border-gray-300 rounded shadow text-xs">
                          <p>{payload[0].payload.date}</p>
                          <p>{payload[0].value}</p>
                        </div>
                      ) : (
                        <div>No data</div>
                      );
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke="#82ca9d"
                    strokeWidth={2}
                    activeDot={{ r: 6 }}
                  />
                  <Legend
                    verticalAlign="top"
                    align="right"
                    wrapperStyle={{ fontSize: 12 }}
                  />
                </LineChart>
              ) : (
                <div className="flex items-center justify-center h-full text-gray-500 text-sm">
                  No data available
                </div>
              )}
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Change Password Modal */}
      {isChangePasswordModalOpen && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div
            ref={changePasswordModalRef}
            className="bg-white rounded-xl shadow-lg w-full max-w-md sm:max-w-lg max-h-[90vh] overflow-y-auto p-4 sm:p-6"
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg sm:text-xl font-semibold text-[#6A7368]">
                Change Password
              </h2>
              <AiOutlineClose
                className="text-lg sm:text-xl text-[#6A7368] cursor-pointer hover:text-[#043D12] transition-colors"
                onClick={() => {
                  setIsChangePasswordModalOpen(false);
                  setChangePasswordFormData({
                    oldPassword: "",
                    newPassword: "",
                    confirmNewPassword: "",
                  });
                  setPasswordValidation("");
                }}
              />
            </div>
            <form onSubmit={handleChangePasswordSubmit} className="space-y-4">
              <div>
                <label className="block text-xs sm:text-sm text-[#6A7368] mb-1">
                  Current Password
                </label>
                <div className="relative">
                  <input
                    type={showOldPassword ? "text" : "password"}
                    name="oldPassword"
                    value={changePasswordFormData.oldPassword}
                    onChange={handleChangePasswordInputChange}
                    placeholder="Enter current password"
                    className="w-full h-10 sm:h-11 px-3 sm:px-4 border-[1px] border-[#6A7368] rounded-xl outline-none bg-transparent text-sm"
                    required
                  />
                  <span
                    className="absolute right-2 sm:right-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-[#6A7368]"
                    onClick={() => setShowOldPassword(!showOldPassword)}
                  >
                    {showOldPassword ? <FiEyeOff /> : <FiEye />}
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-xs sm:text-sm text-[#6A7368] mb-1">
                  New Password
                </label>
                <div className="relative">
                  <input
                    type={showNewPassword ? "text" : "password"}
                    name="newPassword"
                    value={changePasswordFormData.newPassword}
                    onChange={handleChangePasswordInputChange}
                    placeholder="Enter new password"
                    className="w-full h-10 sm:h-11 px-3 sm:px-4 border-[1px] border-[#6A7368] rounded-xl outline-none bg-transparent text-sm"
                    required
                  />
                  <span
                    className="absolute right-2 sm:right-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-[#6A7368]"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                  >
                    {showNewPassword ? <FiEyeOff /> : <FiEye />}
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-xs sm:text-sm text-[#6A7368] mb-1">
                  Confirm New Password
                </label>
                <div className="relative">
                  <input
                    type={showConfirmNewPassword ? "text" : "password"}
                    name="confirmNewPassword"
                    value={changePasswordFormData.confirmNewPassword}
                    onChange={handleChangePasswordInputChange}
                    placeholder="Confirm new password"
                    className="w-full h-10 sm:h-11 px-3 sm:px-4 border-[1px] border-[#6A7368] rounded-xl outline-none bg-transparent text-sm"
                    required
                  />
                  <span
                    className="absolute right-2 sm:right-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-[#6A7368]"
                    onClick={() =>
                      setShowConfirmNewPassword(!showConfirmNewPassword)
                    }
                  >
                    {showConfirmNewPassword ? <FiEyeOff /> : <FiEye />}
                  </span>
                </div>
              </div>

              {passwordValidation && (
                <div className="flex items-center gap-2 text-xs sm:text-sm">
                  {passwordValidation === "Password is valid" ? (
                    <FiCheckCircle className="text-green-600" />
                  ) : (
                    <FiAlertCircle className="text-red-600" />
                  )}
                  <span
                    className={
                      passwordValidation === "Password is valid"
                        ? "text-green-600"
                        : "text-red-600"
                    }
                  >
                    {passwordValidation}
                  </span>
                </div>
              )}

              <button
                type="submit"
                className="w-full mt-4 px-4 py-2 bg-[#043D12] text-[#FFFDF2] rounded-xl hover:bg-[#032d0e] transition-colors text-sm sm:text-base flex items-center justify-center"
                disabled={
                  passwordValidation !== "Password is valid" || isSubmitting
                }
              >
                {isSubmitting ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-2 border-t-transparent rounded-full animate-spin"></div>
                    <span>Saving...</span>
                  </div>
                ) : (
                  "Save Password"
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Display;
