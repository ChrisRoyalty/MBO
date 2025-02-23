import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { CiLock } from "react-icons/ci";
import { BsPerson } from "react-icons/bs";
import { MdOutlineCategory } from "react-icons/md";
import { VscSymbolKeyword } from "react-icons/vsc";
import { IoMdArrowDropdown, IoMdArrowDropup } from "react-icons/io";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Hand from "../components/svgs/Hand";

const BusinessProfile = () => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState({
    id: "",
    name: "",
  });
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [keyword, setKeyword] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchCategories = async () => {
    try {
      const response = await axios.get(
        "https://mbo.bookbank.com.ng/member/all-category"
      );
      setCategories(response.data.category);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  const handleCategorySelect = (id, name) => {
    setSelectedCategory({ id, name }); // Store both ID and name
    setShowDropdown(false); // Close dropdown after selection
  };

  const navigate = useNavigate(); // Initialize navigate function

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedCategory.id) {
      toast.error("Please select a business category.");
      return;
    }

    const memberId = localStorage.getItem("member_id");
    const token = localStorage.getItem("token");

    if (!memberId) {
      toast.error("Member ID is missing. Please log in again.");
      return;
    }

    const payload = {
      businessName,
      categoryIds: [selectedCategory.id],
      description,
      keyword: keyword.split(",").map((kw) => kw.trim()),
    };

    try {
      setLoading(true);

      const response = await axios.post(
        `https://mbo.bookbank.com.ng/member/create-profile/${memberId}`,
        payload,
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data?.newProfile?.id) {
        const profileId = response.data.newProfile.id;

        // Store in localStorage
        localStorage.setItem("profile_id", profileId);

        console.log("Stored Profile ID:", profileId); // ✅ Debugging
      }

      toast.success(
        response.data.message || "Business profile created successfully!"
      );

      // ✅ Redirect user after 2 seconds
      setTimeout(() => {
        navigate("/user-dashboard");
      }, 2000);
    } catch (error) {
      console.error(
        "Error submitting form:",
        error.response ? error.response.data : error.message
      );

      toast.error(
        error.response?.data?.error ||
          "Failed to create business profile. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full h-screen flex justify-center lg:grid grid-cols-2">
      {/* Left Section with Background Image */}
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

      {/* Right Section */}
      <div className="relative max-lg:w-full flex flex-col items-center lg:justify-center bg-[#FFFDF2] max-md:bg-[url('/bg-login.svg')] bg-cover bg-center">
        <div className="w-[80%] h-fit max-lg:mt-20">
          <Link to="/" className="w-fit h-fit absolute top-0 left-0 ">
            <p className="text-white rounded-lg shadow-l border border-[#043D12] bg-[#043D12] m-2 px-2 py-1 text-[15px]">
              back
            </p>
          </Link>
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
            {/* Business Name */}
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

            {/* Business Category Dropdown */}
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

              {showDropdown && (
                <ul className="absolute top-[50px] border-4 border-[#043D12] left-0 w-full bg-[#FFFDF2] text-[#043D12] rounded-[25px] mt-2 p-2 shadow-lg max-h-[200px] overflow-y-auto">
                  {categories.map((category) => (
                    <li
                      key={category.id}
                      className="py-2 px-4 cursor-pointer hover:bg-[#043D12]/30 rounded-[20px]"
                      onClick={() =>
                        handleCategorySelect(category.id, category.name)
                      } // Pass both ID and name
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
              )}
            </div>
            {error && <p className="text-red-500 text-sm mt-1">{error}</p>}

            {/* Keywords */}
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

            {/* Description */}
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

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="cursor-pointer md:mt-6 mt-16 w-full text-[#FFFDF2] bg-[#043D12] hover:bg-[#043D12]/75 shadow-lg rounded-[27px] px-8 flex justify-center items-center lg:h-[60px] h-[48px]"
            >
              {loading ? "Submitting..." : "Create Profile"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default BusinessProfile;
