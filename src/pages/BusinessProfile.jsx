// src/components/BusinessProfile.jsx
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux"; // Keep useDispatch for potential future use
// Remove: import { loginSuccess } from "../redux/authSlice";
import { Link, useNavigate } from "react-router-dom";
import { BsPerson } from "react-icons/bs";
import { MdOutlineCategory } from "react-icons/md";
import { VscSymbolKeyword } from "react-icons/vsc";
import { IoMdArrowDropdown, IoMdArrowDropup } from "react-icons/io";
import { CiLock } from "react-icons/ci";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Hand from "../components/svgs/Hand";

// Rest of the code remains unchanged
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

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const token = useSelector((state) => state.auth.token);
  const BASE_URL = import.meta.env.VITE_BASE_URL;

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

  return (
    <div className="w-full h-screen flex justify-center lg:grid grid-cols-2">
      <div className="max-lg:hidden w-full h-full flex justify-center items-center bg-[url('/Group2.svg')] bg-cover bg-center bg-green-800">
        <div className="w-full h-[90%] flex flex-col items-center">
          <div className="w-[90%] text-[#FFFDF2] mt-8">
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
        <div className="w-[80%] h-fit max-lg:mt-20">
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
            Business Profile <Hand />
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
                className="max-lg:w-full h-full border-none focus:outline-none text-[#6A7368]"
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
                  <span className="text-sm md:text-base truncate max-w-[80%]">
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
                className="max-lg:w-full h-full border-none focus:outline-none text-[#6A7368]"
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
                className="max-lg:w-full h-full border-none focus:outline-none text-[#6A7368]"
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
    </div>
  );
};

export default BusinessProfile;
