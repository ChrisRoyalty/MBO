import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../redux/authSlice";
import { Link, useNavigate } from "react-router-dom";
import { BsPerson } from "react-icons/bs";
import { IoLocationOutline } from "react-icons/io5";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Hand from "../components/svgs/Hand";
import { motion } from "framer-motion";

const BusinessProfile2 = () => {
  const [whatsappNumber, setWhatsappNumber] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [location, setLocation] = useState("");
  const [loading, setLoading] = useState(false);
  const [whatsappStatus, setWhatsappStatus] = useState("");
  const [phoneStatus, setPhoneStatus] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { token, user } = useSelector((state) => state.auth);

  // Authentication and profile check
  useEffect(() => {
    if (!token) {
      toast.error("Please log in to create a profile.", { autoClose: 3000 });
      navigate("/login");
      return;
    }

    const checkProfile = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/member/my-profile`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (response.data.success) {
          toast.info("You already have a profile. Redirecting...", {
            autoClose: 2000,
          });
          navigate("/user-dashboard/profile");
        }
      } catch (error) {
        if (error.response?.status === 404) {
          console.log("No profile found, proceeding to create one.");
        } else {
          console.error(
            "Error checking profile:",
            error.response?.data || error
          );
          toast.error("An error occurred while checking your profile.", {
            autoClose: 3000,
          });
        }
      }
    };
    checkProfile();
  }, [token, navigate]);

  // WhatsApp number validation (requires country code, 10-15 digits total)
  useEffect(() => {
    const cleanNumber = whatsappNumber.replace(/\D/g, ""); // Remove non-digits
    if (whatsappNumber.startsWith("+") && cleanNumber.length > 1) {
      const digitsAfterPlus = cleanNumber.length - 1; // Exclude the "+"
      if (/^\+\d{9,14}$/.test(whatsappNumber)) {
        setWhatsappStatus("valid");
      } else if (digitsAfterPlus > 14) {
        setWhatsappStatus("too_long");
      } else {
        setWhatsappStatus("invalid");
      }
    } else if (whatsappNumber) {
      setWhatsappStatus("invalid_format");
    } else {
      setWhatsappStatus("");
    }
  }, [whatsappNumber]);

  // Alternative phone number validation (requires country code, 8-15 digits total)
  useEffect(() => {
    const cleanPhone = phoneNumber.replace(/\D/g, ""); // Remove non-digits
    if (phoneNumber.startsWith("+") && cleanPhone.length > 1) {
      const digitsAfterPlus = cleanPhone.length - 1; // Exclude the "+"
      if (/^\+\d{7,14}$/.test(phoneNumber)) {
        setPhoneStatus("valid");
      } else if (digitsAfterPlus > 14) {
        setPhoneStatus("too_long");
      } else {
        setPhoneStatus("invalid");
      }
    } else if (phoneNumber) {
      setPhoneStatus("invalid_format");
    } else {
      setPhoneStatus("");
    }
  }, [phoneNumber]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!whatsappNumber.trim() || whatsappStatus !== "valid") {
      toast.error(
        "Please enter a valid WhatsApp number (e.g., +2348012345678).",
        {
          autoClose: 3000,
        }
      );
      return;
    }
    if (!phoneNumber.trim() || phoneStatus !== "valid") {
      toast.error(
        "Please enter a valid alternative phone number (e.g., +2348012345678).",
        {
          autoClose: 3000,
        }
      );
      return;
    }
    if (!location.trim()) {
      toast.error("Please enter your location (e.g., Lagos, Nigeria).", {
        autoClose: 3000,
      });
      return;
    }

    const whatsappLink = `https://wa.me/${whatsappNumber.replace(/\D/g, "")}`; // Clean number for link
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
      contactNo: [phoneNumber.replace(/\D/g, "")], // Clean number for payload
      location,
      socialLinks: { whatsapp: whatsappLink },
    };

    try {
      setLoading(true);
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/member/create-profile`,
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const newToken = response.data.token;
      if (newToken) {
        const updatedUser = { ...user, profileStatus: true };
        dispatch(login({ token: newToken, user: updatedUser }));
        localStorage.setItem("token", newToken);
      }

      toast.success("Business profile created successfully!", {
        autoClose: 2000,
      });
      sessionStorage.removeItem("businessProfileStep1");
      setTimeout(() => navigate("/user-dashboard"), 2000);
    } catch (error) {
      const errorData = error.response?.data;
      const status = errorData?.status;
      const message = errorData?.message || "An error occurred.";
      if (status === 403 && message === "You already have a profile.") {
        toast.error("You already have a profile. Redirecting...", {
          autoClose: 2000,
        });
        setTimeout(() => navigate("/user-dashboard"), 1500);
      } else if (status === 401) {
        toast.error("Session expired. Please log in again.", {
          autoClose: 2000,
        });
        setTimeout(() => navigate("/login"), 1500);
      } else {
        toast.error(message || "Failed to submit profile.", {
          autoClose: 3000,
        });
        console.error("Submission error:", error);
      }
    } finally {
      setLoading(false);
    }
  };

  const statusColor = (status) => {
    switch (status) {
      case "valid":
        return "text-green-600";
      case "invalid":
      case "invalid_format":
        return "text-red-600";
      case "too_long":
        return "text-yellow-600";
      default:
        return "text-gray-600";
    }
  };

  const statusMessage = (status) => {
    switch (status) {
      case "valid":
        return "Valid phone number";
      case "invalid":
        return "Number must be 10-15 digits (WhatsApp) or 8-15 digits (alternative)";
      case "invalid_format":
        return "Number must start with a country code (e.g., +234)";
      case "too_long":
        return "Number exceeds maximum length of 15 digits";
      default:
        return "";
    }
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
            </p>
          </div>
        </div>
      </div>
      <div className="relative max-lg:w-full flex flex-col items-center lg:justify-center bg-[#FFFDF2] max-md:bg-[url('/bg-login.svg')] bg-cover bg-center">
        <div className="container px-[5vw] mx-auto h-fit max-lg:mt-20">
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
            Set Up Business Profile <Hand />
          </h4>
          <form
            className="max-lg:w-full flex flex-col gap-6 md:mt-8 mt-16 max-lg:items-center"
            onSubmit={handleSubmit}
          >
            {/* WhatsApp Number */}
            <div className="max-lg:w-full flex flex-col gap-2">
              <label className="text-[#043D12] text-sm font-medium">
                WhatsApp Number
              </label>
              <div className="border-[1px] rounded-[27px] px-8 border-[#363636] flex items-center gap-2 lg:h-[60px] h-[48px]">
                <BsPerson className="text-[#6A7368]" />
                <input
                  type="text"
                  required
                  placeholder="e.g., +2348012345678"
                  value={whatsappNumber}
                  onChange={(e) => setWhatsappNumber(e.target.value)}
                  className="w-full h-full border-none focus:outline-none text-[#6A7368] placeholder-[#6A7368]/70"
                />
              </div>
              {whatsappStatus && (
                <p className={`text-xs ${statusColor(whatsappStatus)}`}>
                  {statusMessage(whatsappStatus)}
                </p>
              )}
            </div>

            {/* Alternative Number */}
            <div className="max-lg:w-full flex flex-col gap-2">
              <label className="text-[#043D12] text-sm font-medium">
                Alternative Number
              </label>
              <div className="border-[1px] rounded-[27px] px-8 border-[#363636] flex items-center gap-2 lg:h-[60px] h-[48px]">
                <BsPerson className="text-[#6A7368]" />
                <input
                  type="text"
                  required
                  placeholder="e.g., +2348012345678"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="w-full h-full border-none focus:outline-none text-[#6A7368] placeholder-[#6A7368]/70"
                />
              </div>
              {phoneStatus && (
                <p className={`text-xs ${statusColor(phoneStatus)}`}>
                  {statusMessage(phoneStatus)}
                </p>
              )}
            </div>

            {/* Location */}
            <div className="max-lg:w-full flex flex-col gap-2">
              <label className="text-[#043D12] text-sm font-medium">
                Location
              </label>
              <div className="border-[1px] rounded-[27px] px-8 border-[#363636] flex items-center gap-2 lg:h-[60px] h-[48px]">
                <IoLocationOutline className="text-[#6A7368]" />
                <input
                  type="text"
                  required
                  placeholder="e.g., Lagos, Nigeria"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full h-full border-none focus:outline-none text-[#6A7368] placeholder-[#6A7368]/70"
                />
              </div>
            </div>

            {/* Submit Button */}
            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="cursor-pointer md:mt-6 mt-16 w-full text-[#FFFDF2] bg-[#043D12] hover:bg-[#043D12]/75 shadow-lg rounded-[27px] px-8 flex justify-center items-center lg:h-[60px] h-[48px] disabled:opacity-50"
            >
              {loading ? "Submitting..." : "Create Profile"}
            </motion.button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default BusinessProfile2;
