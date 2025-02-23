import React, { useState } from "react";
import { Link } from "react-router";
import { FaRegEnvelope } from "react-icons/fa";
import { CiLock } from "react-icons/ci";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import Hand from "../components/svgs/Hand";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import { div } from "framer-motion/client";
import { useNavigate } from "react-router-dom"; // Import useNavigate
// import { IoIosArrowRoundBack } from "react-icons/io";
const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };
  const navigate = useNavigate(); // Initialize navigate function

  const BASE_URL = import.meta.env.VITE_BASE_URL; // Use Vite's import.meta.env

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await axios.post(`${BASE_URL}/login`, {
        email,
        password,
      });

      console.log("🔍 Login API Full Response:", response.data); // Debugging

      // Ensure `member` and `id` exist before using them
      if (!response.data.member || !response.data.member.id) {
        console.error("❌ Member ID is missing in response.");
        return;
      }

      // Extract and store ID and token
      const { id } = response.data.member;
      const { token } = response.data;

      if (!id || !token) {
        console.error("❌ Missing Member ID or Token, not storing.");
        return;
      }

      localStorage.setItem("member_id", id);
      localStorage.setItem("token", token);

      console.log("✅ Stored Member ID:", localStorage.getItem("member_id"));
      console.log("✅ Stored Token:", localStorage.getItem("token"));

      toast.success(response.data.message || "Login successful!");

      setTimeout(() => {
        navigate("/business-profile");
      }, 1500);
    } catch (error) {
      console.error("❌ Login error:", error.response?.data || error);
      toast.error("Login failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <ToastContainer />
      <div className="w-full h-screen flex justify-center lg:grid grid-cols-2">
        {/* Left Section with Background Image */}
        <div className="max-lg:hidden w-full h-full flex justify-center items-center bg-[url('/Group2.svg')] bg-cover bg-center bg-green-800">
          <div className="w-full h-[90%] flex flex-col items-center">
            <div className="w-[90%] text-[#FFFDF2] mt-12">
              <Link to="/" className="lg:text-[50px] text-[32px] font-medium">
                Welcome to <br /> MBO
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
          <div className="w-[80%] h-fit max-lg:mt-16">
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
              Log In <Hand />
            </h4>

            <form
              onSubmit={handleSubmit}
              className="max-lg:w-full flex flex-col gap-8 mt-8 max-lg:items-center"
            >
              <div className="max-lg:w-full email border-[1px] rounded-[27px] px-8 border-[#363636] flex items-center gap-2 lg:h-[64px] h-[51px]">
                <FaRegEnvelope className="text-[#6A7368]" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email"
                  className="bg-transparent w-full h-full border-none focus:outline-none focus:border-transparent text-[#043D12]"
                  required
                />
              </div>
              <div className="max-lg:w-full password border-[1px] rounded-[27px] px-8 border-[#363636] flex items-center gap-2 lg:h-[64px] h-[51px]">
                <CiLock className="text-[#6A7368]" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  className="bg-transparent w-full h-full border-none focus:outline-none focus:border-transparent text-[#043D12]"
                  required
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="text-[#6A7368] ml-4 focus:outline-none"
                >
                  {showPassword ? <AiFillEyeInvisible /> : <AiFillEye />}
                </button>
              </div>
              <div className="max-lg:w-full remember flex items-center justify-between">
                <div className="checkbox flex gap-2 items-center">
                  <input
                    type="checkbox"
                    name="remember"
                    className="cursor-pointer w-5 h-5 text-transparent border-2 border-[#043D12] rounded-sm appearance-none focus:ring-2 focus:ring-[#043D12] peer checked:bg-[#043D12]"
                  />
                  <label className="text-[#6A7368]">Remember me</label>
                </div>
                <Link
                  to="/forgotten-password"
                  href="#"
                  className="text-[#6A7368]"
                >
                  Forgot password?
                </Link>
              </div>
              <button
                type="submit"
                disabled={isLoading}
                className="mt-8 w-full text-[#FFFDF2] password bg-[#043D12] hover:bg-[#043D12]/75 shadow-lg rounded-[27px] px-8 flex justify-center items-center lg:h-[64px] h-[51px]"
              >
                {isLoading ? "Logging in..." : "Log In"}
              </button>
              <Link
                to="/create-account"
                className="text-[#6A7368] text-[16px] text-center"
              >
                Don’t have an account?{" "}
                <strong className="hover:text-[17px]">Register</strong>
              </Link>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
