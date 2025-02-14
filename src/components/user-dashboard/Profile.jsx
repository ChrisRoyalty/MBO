import React, { useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { IoIosNotificationsOutline } from "react-icons/io";
import { Link } from "react-router-dom";
import BusinessImg from "../../assets/businessImg.jpeg";
import { MdOutlineVisibility } from "react-icons/md";
import { RiArrowDropDownLine, RiArrowDropUpLine } from "react-icons/ri";
import ProfileProgressBar from "./ProfileProgressBar";
const Profile = () => {
  const [timeRange, setTimeRange] = useState("monthly");
  const [metric, setMetric] = useState("ProfileViews");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);

  const toggleVisibility = () => {
    setIsVisible((prevState) => !prevState);
  };

  // Dummy Data for Profile Views, WhatsApp Enquiries, Followers, Shared Links
  const data = {
    ProfileViews: {
      daily: [
        { date: "Mon", views: 10 },
        { date: "Tue", views: 15 },
        { date: "Wed", views: 8 },
        { date: "Thu", views: 20 },
        { date: "Fri", views: 14 },
        { date: "Sat", views: 18 },
        { date: "Sun", views: 12 },
      ],
      weekly: [
        { date: "Week 1", views: 120 },
        { date: "Week 2", views: 140 },
        { date: "Week 3", views: 90 },
        { date: "Week 4", views: 180 },
      ],
      monthly: [
        { date: "Jan", views: 500 },
        { date: "Feb", views: 600 },
        { date: "Mar", views: 450 },
        { date: "Apr", views: 700 },
        { date: "May", views: 680 },
        { date: "Jun", views: 800 },
      ],
    },
    whatsAppEnquiries: {
      daily: [
        { date: "Mon", enquiries: 5 },
        { date: "Tue", enquiries: 8 },
        { date: "Wed", enquiries: 3 },
        { date: "Thu", enquiries: 10 },
        { date: "Fri", enquiries: 7 },
        { date: "Sat", enquiries: 6 },
        { date: "Sun", enquiries: 4 },
      ],
      weekly: [
        { date: "Week 1", enquiries: 20 },
        { date: "Week 2", enquiries: 25 },
        { date: "Week 3", enquiries: 15 },
        { date: "Week 4", enquiries: 30 },
      ],
      monthly: [
        { date: "Jan", enquiries: 80 },
        { date: "Feb", enquiries: 90 },
        { date: "Mar", enquiries: 70 },
        { date: "Apr", enquiries: 100 },
        { date: "May", enquiries: 95 },
        { date: "Jun", enquiries: 120 },
      ],
    },
    Followers: {
      daily: [
        { date: "Mon", followers: 2 },
        { date: "Tue", followers: 3 },
        { date: "Wed", followers: 1 },
        { date: "Thu", followers: 4 },
        { date: "Fri", followers: 2 },
        { date: "Sat", followers: 3 },
        { date: "Sun", followers: 1 },
      ],
      weekly: [
        { date: "Week 1", followers: 10 },
        { date: "Week 2", followers: 12 },
        { date: "Week 3", followers: 8 },
        { date: "Week 4", followers: 15 },
      ],
      monthly: [
        { date: "Jan", followers: 50 },
        { date: "Feb", followers: 60 },
        { date: "Mar", followers: 45 },
        { date: "Apr", followers: 70 },
        { date: "May", followers: 65 },
        { date: "Jun", followers: 80 },
      ],
    },
    sharedLinks: {
      daily: [
        { date: "Mon", links: 3 },
        { date: "Tue", links: 5 },
        { date: "Wed", links: 2 },
        { date: "Thu", links: 6 },
        { date: "Fri", links: 4 },
        { date: "Sat", links: 5 },
        { date: "Sun", links: 3 },
      ],
      weekly: [
        { date: "Week 1", links: 15 },
        { date: "Week 2", links: 18 },
        { date: "Week 3", links: 12 },
        { date: "Week 4", links: 20 },
      ],
      monthly: [
        { date: "Jan", links: 60 },
        { date: "Feb", links: 70 },
        { date: "Mar", links: 55 },
        { date: "Apr", links: 80 },
        { date: "May", links: 75 },
        { date: "Jun", links: 90 },
      ],
    },
  };

  const handleContainerClick = (selectedMetric) => {
    setMetric(selectedMetric); // Update the metric when a container is clicked
  };

  const handleTimeRangeChange = (range) => {
    setTimeRange(range);
    setIsDropdownOpen(false); // Close the dropdown when an option is selected
  };

  return (
    <div className="flex flex-col gap-4 relative pb-16 px-8 overflow-y-auto">
      {/* Header */}
      <div className="h-[12vh] p-8 text-[#6A7368] flex justify-between">
        <strong className="text-[16px]">Dashboard</strong>
        <div className="flex items-center gap-4">
          <Link to="/">
            <IoIosNotificationsOutline className="text-[30px] text-[#6A7368]" />
          </Link>
          <Link to="create-profile">
            <figure className="flex items-center border-[1px] border-gray-300 rounded-[8px] p-2 gap-2">
              <img
                src={BusinessImg}
                alt="Business-img"
                className="rounded-full w-[26px] h-[26px]"
              />
              <figcaption className="text-[#6A7368]">
                <h3 className="text-[10px]">Ukaegbu and Sons</h3>
                <p className="text-[8px]">Clothing and Accessories</p>
              </figcaption>
            </figure>
          </Link>
        </div>
      </div>

      {/* Welcome Section */}
      <div className="welcome flex justify-between items-center">
        <div className="text-[#6A7368]">
          <h2 className="text-[20px]">Welcome Back, John Wick</h2>
          <p className="text-[10px]">
            Subscription Status: <span className="text-green-600">Active</span>
          </p>
        </div>
        <ProfileProgressBar />
        <div>
          {/* Visibility Section */}
          <div className="profile-section">
            <button onClick={toggleVisibility}>
              {isVisible ? "Hide Profile" : "Show Profile"}
            </button>
          </div>
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
          <div className="grid grid-cols-4 w-full gap-10">
            {[
              {
                title: "Profile Views",
                key: "ProfileViews",
                label: "Number of people that visited your profile",
              },
              {
                title: "WhatsApp Enquiries",
                key: "whatsAppEnquiries",
                label: "Direct messages from interested clients",
              },
              {
                title: "Followers",
                key: "Followers",
                label: "People following your profile",
              },
              {
                title: "Shared Links",
                key: "sharedLinks",
                label: "Number of links shared",
              },
            ].map(({ title, key, label }) => (
              <div
                key={key}
                onClick={() => handleContainerClick(key)}
                className={`px-6 py-4 text-[14px] text-[#6A7368] hover:text-[white] hover:bg-[#043D12] rounded-[11px] flex flex-col gap-4 text-center cursor-pointer ${
                  metric === key ? "bg-[#043D12] text-[#FFFDF2]" : "bg-gray-200"
                }`}
              >
                <h5 className="text-start">{title}</h5>
                <figcaption className="text-[14px]">{label}</figcaption>
                <h3 className="count text-[32px]">
                  {metric === "Followers"
                    ? data[metric][timeRange]
                        .map((item) => item.followers)
                        .reduce((total, value) => total + value, 0)
                    : metric === "ProfileViews"
                    ? data[metric][timeRange]
                        .map((item) => item.views)
                        .reduce((total, value) => total + value, 0)
                    : metric === "whatsAppEnquiries"
                    ? data[metric][timeRange]
                        .map((item) => item.enquiries)
                        .reduce((total, value) => total + value, 0)
                    : data[metric][timeRange]
                        .map((item) => item.links)
                        .reduce((total, value) => total + value, 0)}
                </h3>
              </div>
            ))}
          </div>
        </div>

        {/* Graph */}
        <div className="mt-8 border-[1px] border-[#6A7368] rounded-[30px] shadow-lg p-4">
          <div className="flex items-center justify-between ">
            <h3 className="text-[16px] text-[#6A7368]">Profile Performance</h3>
            {/* Time Range Dropdown */}
            <div className="mt-4 relative border-[1px] rounded-lg">
              <div
                className="flex items-center gap-4 cursor-pointer rounded-lg px-2 py-1"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              >
                <span className="text-[14px] text-[#6A7368] ">{`${
                  timeRange.charAt(0).toUpperCase() + timeRange.slice(1)
                }`}</span>
                <RiArrowDropDownLine />
              </div>
              {isDropdownOpen && (
                <div className="absolute left-0 top-full mt-2 bg-white shadow-lg rounded-md w-full z-10 ">
                  <div
                    className="p-2 cursor-pointer hover:bg-gray-100"
                    onClick={() => handleTimeRangeChange("daily")}
                  >
                    Daily
                  </div>
                  <div
                    className="p-2 cursor-pointer hover:bg-gray-100"
                    onClick={() => handleTimeRangeChange("weekly")}
                  >
                    Weekly
                  </div>
                  <div
                    className="p-2 cursor-pointer hover:bg-gray-100"
                    onClick={() => handleTimeRangeChange("monthly")}
                  >
                    Monthly
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className="flex mt-8 w-full">
            {/* Left Side: Description/Label */}
            <div className="flex flex-col justify-center items-start">
              <h4 className="text-[#6A7368] rotate-270">{metric}</h4>
            </div>

            {/* Right Side: Graph */}
            <div className="flex-1">
              <ResponsiveContainer height={300}>
                <LineChart
                  data={data[metric][timeRange]}
                  margin={{ top: 20, right: 30, left: 20, bottom: 10 }}
                >
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey={
                      metric === "ProfileViews"
                        ? "views"
                        : metric === "whatsAppEnquiries"
                        ? "enquiries"
                        : metric === "Followers"
                        ? "followers"
                        : "links"
                    }
                    stroke="#82ca9d"
                    activeDot={{ r: 8 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
        {/* Other content goes here */}
      </div>
    </div>
  );
};

export default Profile;
