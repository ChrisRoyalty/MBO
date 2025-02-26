import React, { useEffect, useState } from "react";
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
import { Link, useNavigate } from "react-router-dom"; // Added useNavigate for redirection
import BusinessImg from "../../assets/businessImg.jpeg";
import { RiArrowDropDownLine } from "react-icons/ri";
import ProfileProgressBar from "./ProfileProgressBar";
const BASE_URL = import.meta.env.VITE_BASE_URL;

const Profile = () => {
  const [timeRange, setTimeRange] = useState("monthly");
  const [metric, setMetric] = useState("ProfileViews");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFirstVisit, setIsFirstVisit] = useState(true); // Track first visit
  const navigate = useNavigate(); // For redirection

  // Define metrics configuration
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
          const socialClicks = JSON.parse(data?.socialClicks || "{}");
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

  // Fetch profile data
  useEffect(() => {
    const profileId = localStorage.getItem("profile_id");
    const token = localStorage.getItem("token");

    // Redirect if profile_id or token is missing
    if (!profileId || !token) {
      setError("Profile ID or Token is missing from localStorage!");
      setLoading(false);
      navigate("/login"); // Redirect to login page
      return;
    }

    const fetchProfile = async () => {
      try {
        const API_URL = `${BASE_URL}/member/get-profile/${profileId}`;
        const response = await axios.get(API_URL, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.data && response.data.profile) {
          setProfileData(response.data.profile);
        } else {
          setError("No profile data found in the response.");
        }
      } catch (error) {
        console.error("❌ Error Fetching Profile:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [navigate]);

  // Handle dropdown click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (isDropdownOpen && !e.target.closest(".dropdown-container")) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isDropdownOpen]);

  // Toggle visibility
  const toggleVisibility = () => {
    setIsVisible((prevState) => !prevState);
  };

  // Handle metric container click
  const handleContainerClick = (selectedMetric) => {
    setMetric(selectedMetric);
    setIsFirstVisit(false); // Update first visit state
  };

  // Handle time range change
  const handleTimeRangeChange = (range) => {
    setTimeRange(range);
    setIsDropdownOpen(false);
  };

  // Generate graph data based on the selected metric and time range
  const generateGraphData = () => {
    const dataPoints =
      timeRange === "daily" ? 7 : timeRange === "weekly" ? 4 : 6;
    const baseValue = profileData
      ? metric === "ProfileViews"
        ? profileData.views
        : metric === "sharedLinks"
        ? profileData.sharedClicks
        : JSON.parse(profileData.socialClicks || "{}").total || 0
      : 0;

    return Array.from({ length: dataPoints }, (_, index) => ({
      date:
        timeRange === "daily"
          ? `Day ${index + 1}`
          : timeRange === "weekly"
          ? `Week ${index + 1}`
          : new Date(2023, index).toLocaleString("default", { month: "short" }), // Use month names
      value: baseValue + Math.floor(Math.random() * 10), // Randomize for demo
    }));
  };

  // Classy Loader Animation with Tailwind CSS
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

  if (error) return <div>Error: {error}</div>;

  return (
    <div className="flex flex-col gap-4 relative pb-16 px-8 overflow-y-auto z-0">
      {/* Header */}
      <div className="h-[12vh] p-8 text-[#6A7368] flex justify-between items-center gap-2">
        <strong className="text-[16px]">Dashboard</strong>
        <div className="flex items-center md:gap-4 px-4">
          <Link to="/">
            <IoIosNotificationsOutline className="text-[30px] text-[#6A7368]" />
          </Link>
          <Link to="/user-dashboard/profile">
            <figure className="flex items-center md:border-[1px] border-gray-300 rounded-[8px] p-2 gap-2">
              <img
                src={BusinessImg}
                alt="Business-img"
                className="rounded-full w-[26px] h-[26px]"
              />
              <figcaption className="text-[#6A7368] max-md:hidden">
                <h3 className="text-[10px]">Ukaegbu and Sons</h3>
                <p className="text-[8px]">Clothing and Accessories</p>
              </figcaption>
            </figure>
          </Link>
        </div>
      </div>

      {/* Welcome Section */}
      <div className="welcome flex max-lg:flex-col max-lg:justify-center justify-between items-center gap-4">
        <div className="text-[#6A7368]">
          <h2 className="text-[20px]">
            {isFirstVisit ? "Welcome" : "Welcome back"},{" "}
            {profileData?.businessName}
          </h2>
          <p className="text-[10px] max-lg:text-center">
            Subscription Status: <span className="text-green-600">Active</span>
          </p>
        </div>
        <ProfileProgressBar />
        <div>
          <button
            onClick={toggleVisibility}
            className="bg-[#043D12] text-white px-4 py-2 rounded-lg"
          >
            {isVisible ? "Hide Profile" : "Show Profile"}
          </button>
        </div>
      </div>

      {/* Conditionally Render Content */}
      <div
        className={`content-section transition-all duration-300 ${
          isVisible ? "opacity-100 visible" : "opacity-0 invisible"
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
            {/* Time Range Dropdown */}
            <div className="mt-4 relative border-[1px] rounded-lg dropdown-container">
              <div
                className="flex items-center gap-4 cursor-pointer rounded-lg px-2 py-1"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              >
                <span className="text-[14px] text-[#6A7368]">
                  {timeRange.charAt(0).toUpperCase() + timeRange.slice(1)}
                </span>
                <RiArrowDropDownLine />
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
          <div className="flex gap-0 mt-8 w-full">
            {/* Right Side: Graph */}
            <div className="flex-1">
              <ResponsiveContainer height={300}>
                <LineChart
                  data={generateGraphData()}
                  margin={{ top: 20, right: 30, left: 20, bottom: 10 }}
                >
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip
                    content={({ payload }) => (
                      <div className="bg-white p-2 border border-gray-300">
                        <p>{payload[0]?.payload.date}</p>
                        <p>{payload[0]?.value}</p>
                      </div>
                    )}
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
    </div>
  );
};

export default Profile;
