import React, { useState, useEffect, useMemo } from "react";
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
import { useSelector, useDispatch } from "react-redux";
import { login } from "../../redux/authSlice";
import { motion } from "framer-motion";
import { CiUser } from "react-icons/ci";
import BusinessImg from "../../assets/user-photo.svg";
import { RiArrowDropDownLine } from "react-icons/ri";
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
    businesImg: "",
    id: "",
    subscriptionStatus: "Unknown",
    views: 0,
    whatsappClicks: 0,
    sharedClicks: 0,
    contactNo: [],
    description: "",
    location: "",
    keyword: [],
    socialLinks: {},
  });
  const [analyticsData, setAnalyticsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [profileProgress, setProfileProgress] = useState(0);
  const [isProfileComplete, setIsProfileComplete] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isAuthenticated, user, token } = useSelector((state) => state.auth);

  const METRICS = [
    {
      title: "Profile Views",
      key: "ProfileViews",
      label: "Number of people that visited your profile",
      value: (data) => data.views,
    },
    {
      title: "Shared Links",
      key: "sharedLinks",
      label: "Number of links shared",
      value: (data) => data.sharedClicks,
    },
    {
      title: "Social Clicks",
      key: "socialClicks",
      label: "Clicks on social media links (e.g., WhatsApp)",
      value: (data) => data.whatsappClicks,
    },
  ];

  const TIME_RANGES = {
    daily: { label: "Daily", limit: 7 },
    weekly: { label: "Weekly", limit: 4 },
    monthly: { label: "Monthly", limit: 6 },
    yearly: { label: "Yearly", limit: 5 },
  };

  const getWeekNumber = (date) => {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    d.setDate(d.getDate() + 3 - ((d.getDay() + 6) % 7));
    const week1 = new Date(d.getFullYear(), 0, 4);
    return (
      1 +
      Math.round(((d - week1) / 86400000 - 3 + ((week1.getDay() + 6) % 7)) / 7)
    );
  };

  const formatDateForRange = (dateStr, range) => {
    try {
      let date;
      if (typeof dateStr === "string") {
        if (range === "monthly" && dateStr.includes("-")) {
          const [year, month] = dateStr.split("-");
          date = new Date(year, month - 1);
        } else if (range === "weekly" && dateStr.includes("-")) {
          const [year, week] = dateStr.split("-");
          date = new Date(year, 0, 1 + (week - 1) * 7);
        } else if (dateStr.includes("-") || dateStr.includes("/")) {
          date = new Date(dateStr);
        } else {
          date = new Date();
        }
      } else {
        date = new Date(dateStr);
      }

      if (isNaN(date.getTime())) {
        date = new Date();
      }

      switch (range) {
        case "daily":
          return date.toLocaleDateString("en-US", { weekday: "short" });
        case "weekly":
          return `Week ${getWeekNumber(date)}`;
        case "monthly":
          return date.toLocaleString("default", {
            month: "short",
            year: "2-digit",
          });
        case "yearly":
          return date.getFullYear().toString();
        default:
          return date.toISOString().split("T")[0];
      }
    } catch (e) {
      console.error("Error formatting date:", e);
      return "N/A";
    }
  };

  const createSortKey = (dateStr, range) => {
    try {
      if (range === "weekly" && dateStr.includes("-")) {
        return dateStr;
      }

      if (range === "monthly") {
        if (dateStr.includes("-")) {
          return dateStr;
        }
        const date = new Date(dateStr);
        return `${date.getFullYear()}-${(date.getMonth() + 1)
          .toString()
          .padStart(2, "0")}`;
      }

      const date = new Date(dateStr);
      if (isNaN(date.getTime())) return dateStr;

      if (range === "weekly") {
        return `${date.getFullYear()}-${getWeekNumber(date)
          .toString()
          .padStart(2, "0")}`;
      }
      return date.toISOString();
    } catch (e) {
      console.error("Error creating sort key:", e);
      return dateStr;
    }
  };

  const calculateProfileProgress = (data) => {
    const requiredFields = [
      { key: "businessName", check: (val) => val && val.trim().length > 0 },
      {
        key: "contactNo",
        check: (val) => Array.isArray(val) && val.length > 0,
      },
      { key: "businesImg", check: (val) => val && val.trim().length > 0 },
      { key: "description", check: (val) => val && val.trim().length > 0 },
      { key: "location", check: (val) => val && val.trim().length > 0 },
      { key: "keyword", check: (val) => Array.isArray(val) && val.length > 0 },
      {
        key: "socialLinks",
        check: (val) => val && Object.keys(val).length > 0,
      },
    ];
    const totalFields = requiredFields.length;
    let completedFields = 0;
    requiredFields.forEach(({ key, check }) => {
      if (check(data[key])) completedFields++;
    });
    const progress = (completedFields / totalFields) * 100;
    return { progress, isComplete: completedFields === totalFields };
  };

  const generateGraphData = useMemo(() => {
    const metricKey = {
      ProfileViews: "views",
      sharedLinks: "sharedClicks",
      socialClicks: "whatsappClicks",
    }[metric];
    const { limit } = TIME_RANGES[timeRange];

    // Handle monthly range specifically
    if (timeRange === "monthly") {
      if (!analyticsData.length) {
        return Array.from({ length: limit }, (_, i) => {
          const date = new Date();
          date.setMonth(date.getMonth() - (limit - 1 - i));
          return {
            date: date.toLocaleString("default", {
              month: "short",
              year: "2-digit",
            }),
            value: 0,
            sortKey: `${date.getFullYear()}-${(date.getMonth() + 1)
              .toString()
              .padStart(2, "0")}`,
          };
        }).sort((a, b) => a.sortKey.localeCompare(b.sortKey));
      }

      const monthlyData = analyticsData.reduce((acc, item) => {
        if (!item.formattedMonth) return acc;

        const monthKey = item.formattedMonth;
        const [year, month] = monthKey.split("-");
        const date = new Date(year, month - 1);

        if (!acc[monthKey]) {
          acc[monthKey] = {
            date: date.toLocaleString("default", {
              month: "short",
              year: "2-digit",
            }),
            value: 0,
            sortKey: monthKey,
          };
        }
        acc[monthKey].value += Number(item[metricKey]) || 0;
        return acc;
      }, {});

      const processedData = Object.values(monthlyData)
        .sort((a, b) => a.sortKey.localeCompare(b.sortKey))
        .slice(-limit);

      if (processedData.length < limit) {
        const oldestDate = processedData.length
          ? new Date(
              processedData[0].sortKey.split("-")[0],
              processedData[0].sortKey.split("-")[1] - 1
            )
          : new Date();
        const existingMonths = new Set(processedData.map((d) => d.sortKey));

        const fillerData = Array.from(
          { length: limit - processedData.length },
          (_, i) => {
            const date = new Date(oldestDate);
            date.setMonth(oldestDate.getMonth() - (i + 1));
            const monthKey = `${date.getFullYear()}-${(date.getMonth() + 1)
              .toString()
              .padStart(2, "0")}`;

            if (existingMonths.has(monthKey)) {
              return null;
            }

            return {
              date: date.toLocaleString("default", {
                month: "short",
                year: "2-digit",
              }),
              value: 0,
              sortKey: monthKey,
            };
          }
        ).filter(Boolean);

        return [...fillerData, ...processedData]
          .sort((a, b) => a.sortKey.localeCompare(b.sortKey))
          .slice(-limit);
      }

      return processedData;
    }

    // Handle other time ranges (daily, weekly, yearly)
    const dateField = {
      daily: "formattedDate",
      weekly: "formattedWeek",
      yearly: "formattedYear",
    }[timeRange];

    if (!analyticsData.length) {
      return Array.from({ length: limit }, (_, i) => {
        const date = new Date();
        let offset;
        switch (timeRange) {
          case "daily":
            offset = limit - 1 - i;
            date.setDate(date.getDate() - offset);
            break;
          case "weekly":
            offset = (limit - 1 - i) * 7;
            date.setDate(date.getDate() - offset);
            break;
          case "yearly":
            offset = limit - 1 - i;
            date.setFullYear(date.getFullYear() - offset);
            break;
          default:
            offset = limit - 1 - i;
            date.setDate(date.getDate() - offset);
        }

        return {
          date: formatDateForRange(date, timeRange),
          value: 0,
          sortKey:
            timeRange === "yearly"
              ? date.getFullYear().toString()
              : createSortKey(date.toISOString(), timeRange),
        };
      }).sort((a, b) => a.sortKey.localeCompare(b.sortKey));
    }

    const processedData = analyticsData
      .map((item) => {
        if (!item || !item[dateField]) return null;

        return {
          date: formatDateForRange(item[dateField], timeRange),
          value: Number(item[metricKey]) || 0,
          sortKey:
            timeRange === "yearly"
              ? item[dateField]
              : createSortKey(item[dateField], timeRange),
        };
      })
      .filter(Boolean);

    if (processedData.length < limit) {
      const oldestDate = processedData.length
        ? new Date(
            timeRange === "yearly"
              ? `${processedData[0].sortKey}-01-01`
              : processedData[0].sortKey
          )
        : new Date();
      const existingKeys = new Set(processedData.map((d) => d.sortKey));

      const fillerData = Array.from(
        { length: limit - processedData.length },
        (_, i) => {
          let date = new Date(oldestDate);
          let sortKey;

          switch (timeRange) {
            case "daily":
              date.setDate(oldestDate.getDate() - (i + 1));
              sortKey = createSortKey(date.toISOString(), timeRange);
              break;
            case "weekly":
              date.setDate(oldestDate.getDate() - (i + 1) * 7);
              sortKey = createSortKey(date.toISOString(), timeRange);
              break;
            case "yearly":
              date.setFullYear(oldestDate.getFullYear() - (i + 1));
              sortKey = date.getFullYear().toString();
              break;
            default:
              date.setDate(oldestDate.getDate() - (i + 1));
              sortKey = createSortKey(date.toISOString(), timeRange);
          }

          if (existingKeys.has(sortKey)) return null;

          return {
            date: formatDateForRange(date, timeRange),
            value: 0,
            sortKey: sortKey,
          };
        }
      ).filter(Boolean);

      return [...fillerData, ...processedData]
        .sort((a, b) => a.sortKey.localeCompare(b.sortKey))
        .slice(-limit);
    }

    return processedData
      .sort((a, b) => a.sortKey.localeCompare(b.sortKey))
      .slice(-limit);
  }, [analyticsData, metric, timeRange, profileData]);

  // Fetch profile data
  useEffect(() => {
    if (!isAuthenticated || !token) {
      setError("Please log in to view your profile.");
      setLoading(false);
      navigate("/login", { replace: true });
      return;
    }

    const fetchProfileData = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/member/my-profile`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const { data } = response.data;
        if (!data) throw new Error("No profile data found.");

        const memberData = data.member || {};
        const newUserData = {
          ...user,
          ...memberData,
          subscriptionStatus: memberData.subscriptionStatus || "Unknown",
        };

        if (JSON.stringify(user) !== JSON.stringify(newUserData)) {
          dispatch(login({ token, user: newUserData }));
        }

        const updatedProfileData = {
          businessName: data.businessName || "User Name",
          category: data.categories?.[0]?.name || "Category",
          businesImg: data.businesImg || "",
          id: data.id || "",
          subscriptionStatus: memberData.subscriptionStatus || "Unknown",
          views: data.views || 0,
          whatsappClicks: data.socialClicks?.whatsapp || 0,
          sharedClicks: data.sharedClicks || 0,
          contactNo: data.contactNo || [],
          description: data.description || "",
          location: data.location || "",
          keyword: data.keyword || [],
          socialLinks: data.socialLinks || {},
        };

        setProfileData(updatedProfileData);
        setIsVisible(!data.deletedAt);

        const { progress, isComplete } =
          calculateProfileProgress(updatedProfileData);
        setProfileProgress(progress);
        setIsProfileComplete(isComplete);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load profile data.");
        if (err.response?.status === 404) {
          navigate("/business-profile", { replace: true });
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, [isAuthenticated, token, dispatch, navigate, user]);

  // Fetch analytics data
  useEffect(() => {
    if (!isAuthenticated || !token) return;

    const fetchAnalyticsData = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `${
            import.meta.env.VITE_BASE_URL
          }/member/get-analytics?range=${timeRange}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (!response.data.success || !Array.isArray(response.data.data)) {
          throw new Error("Invalid analytics data received.");
        }

        setAnalyticsData(response.data.data);
      } catch (err) {
        setError(
          err.response?.data?.message || "Failed to load analytics data."
        );
        setAnalyticsData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalyticsData();
  }, [isAuthenticated, token, timeRange]);

  // Handle click outside dropdowns
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
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isDropdownOpen, isProfileVisibleDropdownOpen]);

  // Toggle profile visibility
  const toggleVisibility = async (action) => {
    if (!profileData.id || !token) {
      return toast.error("Missing profile ID or token.");
    }

    try {
      const url = `${import.meta.env.VITE_BASE_URL}/member/${
        action === "hide" ? "hide" : "unhide"
      }-profile`;

      const response = await axios.patch(
        url,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        setIsVisible(action !== "hide");
        toast.success(
          `Profile ${action === "hide" ? "hidden" : "restored"} successfully!`
        );
        setProfileData((prev) => ({
          ...prev,
          deletedAt: action === "hide" ? new Date().toISOString() : null,
        }));
      }
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Failed to update visibility."
      );
      if (err.response?.status === 401) {
        navigate("/login", { replace: true });
      }
    } finally {
      setIsProfileVisibleDropdownOpen(false);
    }
  };

  const handleMetricChange = (selectedMetric) => {
    setMetric(selectedMetric);
  };

  const handleTimeRangeChange = (range) => {
    setTimeRange(range);
    setIsDropdownOpen(false);
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
        {error.includes("profile") && (
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
        closeOnClick
        pauseOnHover
      />

      <header className="h-[12vh] p-4 sm:p-8 text-[#6A7368] flex justify-between items-center gap-2">
        <strong className="text-[16px]">Dashboard</strong>
        <div className="flex items-center gap-2 sm:gap-4 px-2 sm:px-4">
          <Link to="/user-dashboard/notification">
            <IoIosNotificationsOutline className="hidden text-[24px] sm:text-[30px] text-[#6A7368] hover:text-[#043D12] transition-colors" />
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
                  alt="Business"
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
      </header>

      <section className="welcome flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 px-2 sm:px-0">
        <div className="text-[#6A7368] text-center sm:text-left">
          <h2 className="text-[16px] sm:text-[20px]">
            Welcome back, {profileData.businessName}
          </h2>
          <p className="text-[10px]">
            Subscription Status:{" "}
            <span
              className={
                profileData.subscriptionStatus === "active"
                  ? "text-green-600"
                  : "text-red-600"
              }
            >
              {profileData.subscriptionStatus}
            </span>
          </p>
        </div>
        <div className="flex items-center gap-2 sm:gap-18">
          <div className="flex flex-col items-center gap-2">
            <div
              className="w-[150px] sm:w-[200px] h-4 bg-gray-200 rounded-full overflow-hidden cursor-pointer"
              onClick={() =>
                !isProfileComplete && navigate("/user-dashboard/profile")
              }
              title={
                !isProfileComplete
                  ? "Complete your profile"
                  : "Profile Completed"
              }
            >
              <motion.div
                className="h-full bg-[#043D12]"
                initial={{ width: 0 }}
                animate={{ width: `${profileProgress}%` }}
                transition={{ duration: 0.5, ease: "easeOut" }}
              />
            </div>
            <p className="text-[10px] sm:text-[12px] text-[#6A7368]">
              {isProfileComplete ? (
                <span className="text-[#043D12] font-semibold">
                  Profile Completed ⚡
                </span>
              ) : (
                `Profile Progress: ${Math.round(profileProgress)}%`
              )}
            </p>
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
      </section>

      {!isVisible && (
        <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 rounded-lg mt-4">
          <p className="text-sm">
            Your profile is hidden. Restore visibility above to make it public
            again.
          </p>
        </div>
      )}

      <section className="content-section mt-8 sm:mt-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {METRICS.map(({ title, key, label, value }) => (
            <div
              key={key}
              onClick={() => handleMetricChange(key)}
              className={`p-4 sm:p-6 text-[#6A7368] rounded-[11px] flex flex-col gap-2 sm:gap-4 text-center cursor-pointer shadow-md transition-all ${
                metric === key
                  ? "bg-[#043D12] text-[#FFFDF2]"
                  : "bg-[#F5F7F5] hover:bg-[#043D12] hover:text-[#FFFDF2]"
              } ${!isVisible ? "opacity-50" : ""}`}
            >
              <h5 className="text-center text-[12px] sm:text-[14px] font-semibold">
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

        <div className="mt-8 border-[1px] border-[#6A7368] rounded-[20px] sm:rounded-[30px] shadow-lg p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <h3 className="text-[14px] sm:text-[16px] text-[#6A7368]">
              {METRICS.find((m) => m.key === metric)?.title} Performance
            </h3>
            <div className="relative border-[1px] rounded-lg dropdown-container">
              <div
                className="flex items-center gap-2 sm:gap-4 cursor-pointer rounded-lg px-2 py-1"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              >
                <span className="text-[12px] sm:text-[14px] text-[#6A7368]">
                  {TIME_RANGES[timeRange].label}
                </span>
                <RiArrowDropDownLine className="text-[16px] sm:text-[20px]" />
              </div>
              {isDropdownOpen && (
                <div className="absolute right-0 top-full mt-2 bg-white shadow-lg rounded-md w-[120px] sm:w-[140px] z-30">
                  {Object.entries(TIME_RANGES).map(([range, { label }]) => (
                    <div
                      key={range}
                      className="p-2 cursor-pointer hover:bg-gray-100 text-[12px] sm:text-[14px]"
                      onClick={() => handleTimeRangeChange(range)}
                    >
                      {label}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          <div className="mt-6 sm:mt-8 w-full h-[250px] sm:h-[300px]">
            <ResponsiveContainer
              width="100%"
              height="100%"
              key={`${metric}-${timeRange}`}
            >
              <LineChart
                data={generateGraphData}
                margin={{ top: 20, right: 20, left: 0, bottom: 10 }}
              >
                <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <CartesianGrid strokeDasharray="3 3" />
                <Tooltip
                  content={({ payload }) =>
                    payload?.length ? (
                      <div className="bg-white p-2 border border-gray-300 rounded shadow">
                        <p className="font-semibold">
                          {payload[0].payload.date}
                        </p>
                        <p>
                          {METRICS.find((m) => m.key === metric)?.title}:{" "}
                          {payload[0].value}
                        </p>
                      </div>
                    ) : null
                  }
                />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#82ca9d"
                  strokeWidth={2}
                  activeDot={{ r: 8 }}
                  dot={{ r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Profile;
