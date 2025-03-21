// src/components/BusinessProfile.jsx
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useLocation } from "react-router-dom"; // Added useLocation
import { BsPerson } from "react-icons/bs";
import { MdOutlineCategory } from "react-icons/md";
import { VscSymbolKeyword } from "react-icons/vsc";
import { IoMdArrowDropdown, IoMdArrowDropup } from "react-icons/io";
import { CiLock } from "react-icons/ci";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Hand from "../components/svgs/Hand";

// CongratsModal Component (embedded here for simplicity)
const CongratsModal = ({ onClose }) => {
  const navigate = useNavigate();

  const handleProceed = () => {
    onClose(); // Close the modal
    // No navigation needed here since we're already on /business-profile
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/70 z-50">
      <div
        className="bg-gradient-to-br from-[#043D12] via-[#1A5A2C] to-[#FFFDF2] rounded-3xl p-8 max-w-lg w-full text-center shadow-2xl transform transition-all duration-500 scale-100 hover:scale-105"
        style={{ animation: "fadeIn 0.5s ease-in-out" }}
      >
        {/* Animated Icon */}
        <div className="mb-6">
          <svg
            className="w-16 h-16 mx-auto animate-bounce text-[#FFFDF2]"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>

        {/* Title */}
        <h2 className="text-3xl font-extrabold text-[#FFFDF2] mb-4 tracking-wide">
          Congratulations!
        </h2>

        {/* Message */}
        <p className="text-lg text-[#D1D5DB] mb-8 leading-relaxed">
          You’ve successfully subscribed! Your business is ready to shine. Let’s
          get started with your profile.
        </p>

        {/* Button */}
        <button
          onClick={handleProceed}
          className="bg-[#FFFDF2] text-[#043D12] font-semibold rounded-full px-8 py-3 hover:bg-[#043D12] hover:text-[#FFFDF2] transition-all duration-300 shadow-lg"
        >
          Start Creating Your Profile
        </button>
      </div>

      {/* CSS Animation */}
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
      `}</style>
    </div>
  );
};

const BusinessProfile = () => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState({
    id: "",
    name: "",
  });
  const [categories, setCategories] = useState([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState(true);
  const [error, setError] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [keyword, setKeyword] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [showCongratsModal, setShowCongratsModal] = useState(false); // Added for modal

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation(); // Added to access navigation state
  const token = useSelector((state) => state.auth.token);
  const BASE_URL = import.meta.env.VITE_BASE_URL;

  useEffect(() => {
    // Check for subscription success from navigation state
    if (location.state?.subscriptionSuccess) {
      setShowCongratsModal(true);
      // Clear the state to prevent re-triggering on refresh
      window.history.replaceState({}, document.title, "/business-profile");
    }
  }, [location.state]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/member/all-category`
        );
        setCategories(response.data.category || response.data.categories || []);
        setIsLoadingCategories(false);
      } catch (error) {
        console.error(
          "Error fetching categories:",
          error.response?.data || error
        );
        toast.error("Failed to load categories. Please try again.");
        setCategories([]);
        setIsLoadingCategories(false);
      }
    };
    fetchCategories();
  }, [BASE_URL]);

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  const handleCategorySelect = (id, name) => {
    setSelectedCategory({ id, name });
    setShowDropdown(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("BusinessProfile submitted", {
      businessName,
      selectedCategory,
      keyword,
      description,
    });

    if (!businessName.trim()) {
      toast.error("Business name is required.");
      return;
    }
    if (!selectedCategory.id) {
      toast.error("Please select a business category.");
      return;
    }
    if (!token) {
      toast.error("Token missing. Please log in again.");
      navigate("/login");
      return;
    }

    setLoading(true);
    const step1Data = {
      businessName,
      categoryId: selectedCategory.id,
      keyword,
      description,
    };
    sessionStorage.setItem("businessProfileStep1", JSON.stringify(step1Data));
    console.log("Step 1 data stored:", step1Data);
    setTimeout(() => {
      setLoading(false);
      navigate("/business-profile2");
    }, 500);
  };

  const handleCloseCongratsModal = () => {
    setShowCongratsModal(false);
  };

  return (
    <div className="w-full h-screen flex justify-center lg:grid grid-cols-2">
      <div className="max-lg:hidden w-full h-full flex justify-center items-center bg-[url('/Group2.svg')] bg-cover bg-center bg-green-800">
        <div className="w-full h-[90%] flex flex-col items-center">
          <div className="container px-[5vw] mx-auto text-[#FFFDF2] mt-8">
            <Link
              to="/"
              className="lg:text-[50px] text-[32px] font-medium leading-[70px]"
            >
              Tell us about <br /> your business
            </Link>
            <p className="text-[18px]">
              Step into a community that puts your business in the spotlight.
              Showcase your brand, find new customers, and grow together.
            </p>
          </div>
        </div>
      </div>
      <div className="relative max-lg:w-full flex flex-col items-center lg:justify-center bg-[#FFFDF2] max-md:bg-[url('/bg-login.svg')] bg-cover bg-center">
        <div className="container px-[5vw] mx-auto h-fit max-lg:mt-20">
          <div className="absolute top-0 right-0 m-2 text-[#043D12] font-medium">
            1 of 2
          </div>
          <Link
            to="/"
            className="lg:text-[50px] text-[32px] font-bold text-[#363636]"
          >
            MBO
          </Link>
          <h4 className="lg:text-[32px] text-[20px] font-medium text-[#043D12] flex items-center gap-2">
            Set Up Business Profile <Hand />
          </h4>
          <form
            className="max-lg:w-full flex flex-col gap-6 md:mt-8 mt-16 max-lg:items-center"
            onSubmit={handleSubmit}
          >
            <div className="max-lg:w-full border-[1px] rounded-[27px] px-8 border-[#363636] flex items-center gap-2 lg:h-[60px] h-[48px]">
              <BsPerson className="text-[#6A7368]" />
              <input
                type="text"
                required
                placeholder="Business Name"
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                className="w-full h-full border-none focus:outline-none text-[#6A7368]"
              />
            </div>
            <div className="max-lg:w-full border-[1px] rounded-[27px] px-8 border-[#363636] flex flex-col relative">
              <button
                type="button"
                className="flex items-center justify-between text-[#6A7368] w-full h-[48px] focus:outline-none"
                onClick={toggleDropdown}
              >
                <div className="flex items-center gap-2">
                  <MdOutlineCategory className="text-[#6A7368] text-[18px]" />
                  <span className="text-sm md:text-base">
                    {selectedCategory.name || "Select Business Category"}
                  </span>
                </div>
                {showDropdown ? (
                  <IoMdArrowDropup className="text-[#6A7368] cursor-pointer" />
                ) : (
                  <IoMdArrowDropdown className="text-[#6A7368] cursor-pointer" />
                )}
              </button>
              {showDropdown && isLoadingCategories ? (
                <p className="absolute top-[50px] left-0 w-full bg-[#FFFDF2] text-[#043D12] p-2">
                  Loading categories...
                </p>
              ) : showDropdown && categories.length > 0 ? (
                <ul className="absolute top-[50px] border-4 border-[#043D12] left-0 w-full bg-[#FFFDF2] text-[#043D12] rounded-[25px] mt-2 p-2 shadow-lg max-h-[200px] overflow-y-auto">
                  {categories.map((category) => (
                    <li
                      key={category.id}
                      className="py-2 px-4 cursor-pointer hover:bg-[#043D12]/30 rounded-[20px]"
                      onClick={() =>
                        handleCategorySelect(category.id, category.name)
                      }
                    >
                      {category.name}
                      {category.description && (
                        <p className="text-xs text-[#043D12]/90">
                          {category.description}
                        </p>
                      )}
                    </li>
                  ))}
                </ul>
              ) : showDropdown ? (
                <p className="absolute top-[50px] left-0 w-full bg-[#FFFDF2] text-[#043D12] p-2">
                  No categories available.
                </p>
              ) : null}
            </div>
            {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
            <div className="max-lg:w-full border-[1px] rounded-[27px] px-8 border-[#363636] flex items-center gap-2 lg:h-[60px] h-[48px]">
              <VscSymbolKeyword className="text-[#6A7368]" />
              <input
                type="text"
                required
                placeholder="Enter keywords"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                className="w-full h-full border-none focus:outline-none text-[#6A7368]"
              />
            </div>
            <div className="max-lg:w-full border-[1px] rounded-[27px] px-8 border-[#363636] flex items-center gap-2 lg:h-[60px] h-[48px]">
              <CiLock className="text-[#6A7368]" />
              <input
                type="text"
                required
                placeholder="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full h-full border-none focus:outline-none text-[#6A7368]"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="cursor-pointer md:mt-6 mt-16 w-full text-[#FFFDF2] bg-[#043D12] hover:bg-[#043D12]/75 shadow-lg rounded-[27px] px-8 flex justify-center items-center lg:h-[60px] h-[48px] disabled:opacity-50"
            >
              {loading ? "Submitting..." : "Next"}
            </button>
          </form>
        </div>
      </div>

      {/* Render CongratsModal if subscription was successful */}
      {showCongratsModal && (
        <CongratsModal onClose={handleCloseCongratsModal} />
      )}
    </div>
  );
};

export default BusinessProfile;
