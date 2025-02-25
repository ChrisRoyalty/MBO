import React, { useState, useEffect, useContext } from "react";
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
import { AuthContext } from "../context/AuthContext";
import Hand from "../components/svgs/Hand";

// JWT decoding function
const decodeJWT = (token) => {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error("❌ Error decoding JWT:", error);
    return {};
  }
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

  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const BASE_URL = import.meta.env.VITE_BASE_URL;

  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/member/all-category`);
      console.log("🔍 Categories Response:", response.data);
      setCategories(response.data.category || response.data.categories || []); // Adjust based on actual key
      setIsLoadingCategories(false);
    } catch (error) {
      console.error(
        "❌ Error fetching categories:",
        error.response?.data || error
      );
      toast.error("Failed to load categories. Please try again.");
      setCategories([]);
      setIsLoadingCategories(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  const handleCategorySelect = (id, name) => {
    setSelectedCategory({ id, name });
    setShowDropdown(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedCategory.id) {
      toast.error("Please select a business category.");
      return;
    }

    const token = localStorage.getItem("token");

    if (!token) {
      toast.error("Token missing. Please log in again.");
      navigate("/login");
      return;
    }

    const payload = {
      businessName,
      categoryIds: [selectedCategory.id],
      description,
      keyword: keyword.split(",").map((kw) => kw.trim()),
    };

    const profileEndpoint = `${BASE_URL}/member/create-profile`;

    console.log("🔍 Submitting to:", profileEndpoint);
    console.log("🔍 Payload:", payload);
    console.log("🔍 Token:", token);

    try {
      setLoading(true);

      const response = await axios.post(profileEndpoint, payload, {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("✅ Profile Creation Response:", response.data);

      if (response.data?.profile?.id) {
        const profileId = response.data.profile.id;
        localStorage.setItem("profile_id", profileId);
        console.log("✅ Stored Profile ID:", profileId);
      }

      let newToken = response.data.token;
      if (newToken) {
        localStorage.setItem("token", newToken);
        login(newToken);
        const decoded = decodeJWT(newToken);
        console.log("✅ New Token Payload:", decoded);
        if (decoded.profileStatus === true) {
          console.log("✅ Profile status updated to true");
        } else {
          console.warn("⚠️ ProfileStatus not updated in token");
        }
      } else {
        console.warn("⚠️ No new token in response, refreshing token...");
        try {
          const refreshResponse = await axios.get(
            `${BASE_URL}/member/token/refresh`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          newToken = refreshResponse.data.token;
          localStorage.setItem("token", newToken);
          login(newToken);
          const decoded = decodeJWT(newToken);
          console.log("✅ Refreshed Token Payload:", decoded);
          if (decoded.profileStatus === true) {
            console.log("✅ Profile status updated to true via refresh");
          } else {
            console.warn("⚠️ ProfileStatus still not true after refresh");
            await updateProfileStatus(token);
          }
        } catch (refreshError) {
          console.error(
            "❌ Token refresh failed:",
            refreshError.response?.data || refreshError
          );
          await updateProfileStatus(token);
        }
      }

      toast.success(
        response.data.message || "Business profile created successfully!"
      );

      setTimeout(() => {
        navigate("/user-dashboard");
      }, 2000);
    } catch (error) {
      console.error(
        "❌ Error submitting form:",
        error.response ? error.response.data : error.message
      );
      const errorMessage =
        error.response?.data?.message || "Failed to create business profile.";
      toast.error(errorMessage);

      if (
        error.response?.status === 403 &&
        error.response.data.message === "You already have a profile."
      ) {
        console.log("✅ User already has a profile, checking status");
        const currentToken = localStorage.getItem("token");
        const decoded = decodeJWT(currentToken);
        console.log("🔍 Current Token Payload:", decoded);
        if (decoded.profileStatus === true) {
          toast.info("Profile already exists. Redirecting to dashboard...");
          setTimeout(() => {
            navigate("/user-dashboard");
          }, 2000);
        } else {
          console.warn("⚠️ Profile exists but profileStatus is not true");
          await updateProfileStatus(currentToken);
        }
      }
    } finally {
      setLoading(false);
    }
  };

  const updateProfileStatus = async (currentToken) => {
    try {
      const updateResponse = await axios.patch(
        `${BASE_URL}/member/profile/status`,
        { profileStatus: true },
        {
          headers: {
            Authorization: `Bearer ${currentToken}`,
            "Content-Type": "application/json",
          },
        }
      );
      const updatedToken = updateResponse.data.token;
      if (updatedToken) {
        localStorage.setItem("token", updatedToken);
        login(updatedToken);
        console.log("✅ Updated Token Payload:", decodeJWT(updatedToken));
        toast.success("Profile status updated successfully!");
      } else {
        console.warn("⚠️ No token returned from status update");
        toast.error("Status updated, but token not refreshed. Log in again.");
      }
    } catch (updateError) {
      console.error(
        "❌ Failed to update profileStatus:",
        updateError.response?.data || updateError
      );
      toast.error("Failed to confirm profile setup. Contact support.");
    }
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
