import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom"; // Import useNavigate
import { FaRegEnvelope } from "react-icons/fa";
import { CiLock } from "react-icons/ci";
import { BsPerson } from "react-icons/bs";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import Hand from "../components/svgs/Hand";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Reusable Modal Component
const SuccessModal = ({ onClose }) => {
  const navigate = useNavigate();

  const handleAcknowledge = () => {
    onClose(); // Close the modal
    navigate("/login"); // Redirect to the login page
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/60 bg-opacity-50 z-50">
      <div className="bg-[#FFFDF2] rounded-[27px] p-8 max-w-md w-full text-center shadow-lg">
        <h2 className="text-[24px] font-bold text-[#043D12] mb-4">
          🎉Sign up successful.
        </h2>
        <p className="text-[#6A7368] mb-6">
          Please check your email to verify your account.
        </p>
        {/* <button
          onClick={handleAcknowledge}
          className="bg-[#043D12] text-[#FFFDF2] rounded-[27px] px-6 py-2 hover:bg-[#043D12]/75 transition-colors"
        >
          Go to Login
        </button> */}
        <Link
          // onClick={handleAcknowledge}
          to="/"
          className="bg-[#043D12] text-[#FFFDF2] rounded-[27px] px-6 py-2 hover:bg-[#043D12]/75 transition-colors"
        >
          Close
        </Link>
      </div>
    </div>
  );
};

const Signup = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false); // State for modal visibility

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }

    setLoading(true);

    try {
      const apiUrl = `${import.meta.env.VITE_BASE_URL}/member/sign-up`;
      const response = await axios.post(apiUrl, formData);
      // toast.success(response.data.message || "Signup successful!");
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        confirmPassword: "",
      });
      setShowSuccessModal(true); // Show the success modal
    } catch (error) {
      console.error("Error:", error);

      if (error.response) {
        const errorData = error.response.data;

        // If the API response contains an "error" key, display it exactly as received
        if (errorData.error) {
          toast.error(errorData.error);
        } else if (errorData.message) {
          toast.error(errorData.message);
        } else if (errorData.errors) {
          // If the API sends validation errors as an object
          Object.values(errorData.errors).forEach((errMsgArray) => {
            errMsgArray.forEach((errMsg) => {
              toast.error(errMsg);
            });
          });
        } else {
          toast.error("Signup failed! Unexpected error.");
        }
      } else {
        toast.error("Signup failed! Please check your network.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full h-screen flex justify-center lg:grid grid-cols-2">
      {/* Left Section with Background Image */}
      <div className="max-lg:hidden w-full h-full flex justify-center items-center bg-[url('/Group2.svg')] bg-cover bg-center bg-green-800">
        <div className="w-full h-[90%] flex flex-col items-center">
          <div className="container mx-auto px-[5vw] text-[#FFFDF2]">
            <Link to="/" className="lg:text-[35px] text-[32px] font-medium">
              Welcome to <br /> MindPower Business Online
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
        <ToastContainer />
        <div className="container mx-auto px-[5vw] h-fit max-lg:mt-16">
          <Link
            to="/"
            className="lg:text-[50px] text-[32px] font-bold text-[#363636] hover:border-b-1 "
          >
            MBO
          </Link>
          <h4 className="lg:text-[32px] text-[20px] font-medium text-[#043D12] flex items-center gap-2">
            Register <Hand />
          </h4>

          <form
            className="max-lg:w-full flex flex-col gap-6 mt-8 max-lg:items-center"
            onSubmit={handleSubmit}
          >
            {/* First Name */}
            <div className="max-lg:w-full email border-[1px] rounded-[27px] px-8 border-[#363636] flex items-center gap-2 lg:h-[50px] h-[48px]">
              <BsPerson className="text-[#6A7368]" />
              <input
                type="text"
                name="firstName"
                placeholder="First Name"
                value={formData.firstName}
                onChange={handleChange}
                required
                className="bg-transparent w-full h-full border-none focus:outline-none focus:border-transparent text-[#043D12]"
              />
            </div>

            {/* Last Name */}
            <div className="max-lg:w-full email border-[1px] rounded-[27px] px-8 border-[#363636] flex items-center gap-2 lg:h-[50px] h-[48px]">
              <BsPerson className="text-[#6A7368]" />
              <input
                type="text"
                name="lastName"
                placeholder="Last Name"
                value={formData.lastName}
                onChange={handleChange}
                required
                className="bg-transparent w-full h-full border-none focus:outline-none focus:border-transparent text-[#043D12]"
              />
            </div>

            {/* Email */}
            <div className="max-lg:w-full email border-[1px] rounded-[27px] px-8 border-[#363636] flex items-center gap-2 lg:h-[50px] h-[48px]">
              <FaRegEnvelope className="text-[#6A7368]" />
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                required
                className="bg-transparent w-full h-full border-none focus:outline-none focus:border-transparent text-[#043D12]"
              />
            </div>

            {/* Password */}
            <div className="max-lg:w-full password border-[1px] rounded-[27px] px-8 border-[#363636] flex items-center gap-2 lg:h-[50px] h-[48px]">
              <CiLock className="text-[#6A7368]" />
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                required
                className="bg-transparent w-full h-full border-none focus:outline-none focus:border-transparent text-[#043D12]"
              />
              <button
                type="button"
                className="text-[#6A7368]"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
              </button>
            </div>

            {/* Confirm Password */}
            <div className="max-lg:w-full password border-[1px] rounded-[27px] px-8 border-[#363636] flex items-center gap-2 lg:h-[50px] h-[48px]">
              <CiLock className="text-[#6A7368]" />
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                placeholder="Confirm Password"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                className="bg-transparent w-full h-full border-none focus:outline-none focus:border-transparent text-[#043D12]"
              />
              <button
                type="button"
                className="text-[#6A7368]"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? (
                  <AiOutlineEyeInvisible />
                ) : (
                  <AiOutlineEye />
                )}
              </button>
            </div>

            {/* Submit Button */}
            <div className="text-center flex flex-col gap-4">
              <button
                type="submit"
                className="mt-6 w-full text-[#FFFDF2] password bg-[#043D12] hover:bg-[#043D12]/75 shadow-lg rounded-[27px] px-8 flex justify-center items-center lg:h-[60px] h-[48px] cursor-pointer"
                disabled={loading}
              >
                {loading ? "Registering..." : "Register"}
              </button>
              <Link to="/login" className="text-center text-[#6A7368]">
                Are you already a member? <strong>Log In</strong>
              </Link>
            </div>
          </form>
        </div>

        {/* Success Modal */}
        {showSuccessModal && (
          <SuccessModal onClose={() => setShowSuccessModal(false)} />
        )}
      </div>
    </div>
  );
};

export default Signup;
