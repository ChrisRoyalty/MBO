// src/components/BusinessProfile2.jsx
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginSuccess } from "../redux/authSlice";
import { Link, useNavigate } from "react-router-dom";
import { BsPerson } from "react-icons/bs";
import { IoMdArrowDropdown, IoMdArrowDropup } from "react-icons/io";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Hand from "../components/svgs/Hand";

const countryCodes = [
  { code: "+1", name: "United States", sample: "+12025550123" },
  { code: "+234", name: "Nigeria", sample: "+2348012345678" },
  { code: "+44", name: "United Kingdom", sample: "+447712345678" },
  { code: "+91", name: "India", sample: "+919876543210" },
];

const BusinessProfile2 = () => {
  const [selectedCountry, setSelectedCountry] = useState(countryCodes[1]);
  const [whatsappNumber, setWhatsappNumber] = useState("");
  const [whatsappLink, setWhatsappLink] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [location, setLocation] = useState("");
  const [loading, setLoading] = useState(false);
  const [showCountryDropdown, setShowCountryDropdown] = useState(false);
  const [showLinkPreview, setShowLinkPreview] = useState(false); // New state for link visibility

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const token = useSelector((state) => state.auth.token);
  const BASE_URL = import.meta.env.VITE_BASE_URL;

  useEffect(() => {
    if (!token) {
      toast.error("Please log in to create a profile.", { autoClose: 3000 });
      navigate("/login");
      return;
    }

    const checkProfile = async () => {
      try {
        await axios.get(`${BASE_URL}/member/my-profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        toast.info("You already have a profile. Redirecting...", {
          autoClose: 2000,
        });
        navigate("/user-dashboard/profile");
      } catch (error) {
        if (error.response?.status !== 404) {
          console.error("Error checking profile:", error);
          toast.error(
            "An error occurred while checking your profile. Please try again.",
            { autoClose: 3000 }
          );
        }
      }
    };
    checkProfile();
  }, [token, navigate]);

  useEffect(() => {
    if (whatsappNumber.trim()) {
      const cleanNumber = whatsappNumber.replace(/\D/g, "");
      const fullNumber = `${selectedCountry.code}${cleanNumber}`;
      if (/^\+\d{10,15}$/.test(fullNumber)) {
        const generatedLink = `https://wa.me/${fullNumber}`;
        setWhatsappLink(generatedLink);
        console.log("Generated WhatsApp link:", generatedLink);
      } else {
        setWhatsappLink("");
      }
    } else {
      setWhatsappLink("");
    }
  }, [whatsappNumber, selectedCountry]);

  const handleCountrySelect = (country) => {
    setSelectedCountry(country);
    setShowCountryDropdown(false);
    setWhatsappNumber("");
    setWhatsappLink("");
    setShowLinkPreview(false); // Reset preview visibility
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("BusinessProfile2 submitted", {
      whatsappLink,
      phoneNumber,
      location,
    });

    if (!whatsappNumber.trim()) {
      toast.error("Please enter your WhatsApp phone number.", {
        autoClose: 3000,
      });
      return;
    }
    if (!whatsappLink) {
      toast.error(
        `Enter a valid WhatsApp number for ${
          selectedCountry.name
        } (e.g., ${selectedCountry.sample.slice(
          selectedCountry.code.length
        )}). Must be 10-15 digits.`,
        { autoClose: 3000 }
      );
      return;
    }
    if (!phoneNumber.trim()) {
      toast.error("Please enter your contact phone number.", {
        autoClose: 3000,
      });
      return;
    }
    if (!/^\+?\d{8,15}$/.test(phoneNumber)) {
      toast.error(
        "Contact phone number must be 8-15 digits (e.g., +2348012345678).",
        { autoClose: 3000 }
      );
      return;
    }
    if (!location.trim()) {
      toast.error("Please enter your location (e.g., Lagos, Nigeria).", {
        autoClose: 3000,
      });
      return;
    }

    const step1Data = JSON.parse(
      sessionStorage.getItem("businessProfileStep1") || "{}"
    );
    const payload = {
      businessName: step1Data.businessName || "",
      categoryIds: [step1Data.categoryId || ""],
      description: step1Data.description || "",
      keyword: step1Data.keyword
        ? step1Data.keyword.split(",").map((kw) => kw.trim())
        : [],
      contactNo: [phoneNumber],
      location,
      socialLinks: { whatsapp: whatsappLink },
    };
    console.log("Submitting payload:", payload);

    try {
      setLoading(true);
      const response = await axios.post(
        `${BASE_URL}/member/create-profile`,
        payload,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const newToken = response.data.token;
      if (newToken) {
        sessionStorage.setItem("token", newToken);
        dispatch(loginSuccess(newToken));
      }

      toast.success("Business profile created successfully!", {
        autoClose: 2000,
      });
      sessionStorage.removeItem("businessProfileStep1");
      setTimeout(() => navigate("/user-dashboard/profile"), 2000);
    } catch (error) {
      const errorData = error.response?.data;
      const status = errorData?.status;
      const message = errorData?.message || "An error occurred.";
      if (status === 403 && message === "You already have a profile.") {
        toast.error(
          "You already have a profile. Redirecting to your dashboard...",
          { autoClose: 2000 }
        );
        setTimeout(() => navigate("/user-dashboard/profile"), 1500);
      } else if (status === 401) {
        toast.error("Session expired. Please log in again.", {
          autoClose: 2000,
        });
        setTimeout(() => navigate("/login"), 1500);
      } else {
        toast.error(message || "Failed to submit profile. Please try again.", {
          autoClose: 3000,
        });
        console.error("Submission error:", error);
      }
    } finally {
      setLoading(false);
    }
  };

  const testWhatsappLink = () => {
    if (whatsappLink) {
      window.open(whatsappLink, "_blank");
    } else {
      toast.error("Please enter a valid WhatsApp phone number to test.", {
        autoClose: 3000,
      });
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
          <Link
            to="/business-profile"
            className="w-fit h-fit absolute top-0 left-0"
          >
            <p className="text-white rounded-lg shadow-lg border border-[#043D12] bg-[#043D12] m-2 px-2 py-1 text-[15px]">
              Back
            </p>
          </Link>
          <div className="absolute top-0 right-0 m-2 text-[#043D12] font-medium">
            2 of 2
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
            <div className="max-lg:w-full flex items-center gap-2">
              <div className="relative w-1/3 lg:w-1/4 border-[1px] rounded-[27px] px-4 border-[#363636] h-[48px] lg:h-[60px] flex items-center">
                <button
                  type="button"
                  className="w-full h-full flex items-center justify-between text-[#6A7368] focus:outline-none"
                  onClick={() => setShowCountryDropdown(!showCountryDropdown)}
                >
                  <span>{selectedCountry.code}</span>
                  {showCountryDropdown ? (
                    <IoMdArrowDropup className="text-[#6A7368]" />
                  ) : (
                    <IoMdArrowDropdown className="text-[#6A7368]" />
                  )}
                </button>
                {showCountryDropdown && (
                  <ul className="absolute top-full left-0 w-full bg-[#FFFDF2] border-[1px] border-[#363636] rounded-[10px] mt-2 z-10 max-h-[200px] overflow-y-auto shadow-lg">
                    {countryCodes.map((country) => (
                      <li
                        key={country.code}
                        className="p-2 hover:bg-[#043D12]/10 text-[#6A7368] cursor-pointer"
                        onClick={() => handleCountrySelect(country)}
                      >
                        {country.name} ({country.code})
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              <div className="w-2/3 lg:w-3/4 border-[1px] rounded-[27px] px-8 border-[#363636] flex items-center gap-2 h-[48px] lg:h-[60px]">
                <BsPerson className="text-[#6A7368]" />
                <input
                  type="text"
                  required
                  placeholder={selectedCountry.sample.slice(
                    selectedCountry.code.length
                  )}
                  value={whatsappNumber}
                  onChange={(e) => setWhatsappNumber(e.target.value)}
                  className="w-full h-full border-none focus:outline-none text-[#6A7368] placeholder-[#6A7368]/70"
                />
              </div>
            </div>
            <button
              type="button"
              onClick={() => setShowLinkPreview(!showLinkPreview)}
              className="text-[#043D12] text-sm underline hover:text-[#03500F] w-fit"
            >
              {showLinkPreview ? "Hide Link Preview" : "Show Link Preview"}
            </button>
            {showLinkPreview && whatsappLink && (
              <div className="text-[#6A7368] text-sm mt-1">
                <p>
                  Generated Link:{" "}
                  <a href={whatsappLink} target="_blank" className="underline">
                    {whatsappLink}
                  </a>
                </p>
                <button
                  type="button"
                  onClick={testWhatsappLink}
                  className="mt-1 text-[#043D12] underline hover:text-[#03500F] text-xs"
                >
                  Test Link
                </button>
              </div>
            )}
            <div className="max-lg:w-full border-[1px] rounded-[27px] px-8 border-[#363636] flex items-center gap-2 lg:h-[60px] h-[48px]">
              <BsPerson className="text-[#6A7368]" />
              <input
                type="text"
                required
                placeholder="Phone Number (e.g., +2348012345678)"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="max-lg:w-full h-full border-none focus:outline-none text-[#6A7368] placeholder-[#6A7368]/70"
              />
            </div>
            <div className="max-lg:w-full border-[1px] rounded-[27px] px-8 border-[#363636] flex items-center gap-2 lg:h-[60px] h-[48px]">
              <BsPerson className="text-[#6A7368]" />
              <input
                type="text"
                required
                placeholder="Location (e.g., Lagos, Nigeria)"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="max-lg:w-full h-full border-none focus:outline-none text-[#6A7368] placeholder-[#6A7368]/70"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="cursor-pointer md:mt-6 mt-16 w-full text-[#FFFDF2] bg-[#043D12] hover:bg-[#043D12]/75 shadow-lg rounded-[27px] px-8 flex justify-center items-center lg:h-[60px] h-[48px] disabled:opacity-50"
            >
              {loading ? "Submitting..." : "Create Profile"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default BusinessProfile2;
