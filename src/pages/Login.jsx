import React, { useState, useContext } from "react";
import { Link } from "react-router-dom"; // Updated to react-router-dom
import { FaRegEnvelope } from "react-icons/fa";
import { CiLock } from "react-icons/ci";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import Hand from "../components/svgs/Hand";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

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

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const BASE_URL = import.meta.env.VITE_BASE_URL;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await axios.post(`${BASE_URL}/member/login`, {
        email,
        password,
      });

      console.log("🔍 Login API Full Response:", response.data);

      const { token, member } = response.data;
      if (!token) {
        console.error("❌ Token is missing in response.");
        toast.error("Authentication failed. Missing credentials.");
        return;
      }

      // Decode token to get member ID and status
      const tokenPayload = decodeJWT(token);
      const { id: memberId, subscriptionStatus, profileStatus } = tokenPayload;

      if (!memberId) {
        console.error("❌ Member ID is missing in token payload.");
        toast.error("Invalid response from server.");
        return;
      }

      // Store token, member ID, and member data in localStorage
      localStorage.setItem("token", token);
      localStorage.setItem("member_id", memberId);
      localStorage.setItem("member", JSON.stringify(member)); // Store member object
      login(token); // Update AuthContext with token

      console.log("✅ Stored Token:", localStorage.getItem("token"));
      console.log("✅ Stored Member ID:", localStorage.getItem("member_id"));
      console.log("✅ Stored Member Data:", localStorage.getItem("member"));
      console.log("🔍 Subscription Status from Token:", subscriptionStatus);
      console.log("🔍 Profile Status from Token:", profileStatus);

      toast.success(response.data.message || "Login successful!");

      // Redirect based on setup status
      setTimeout(() => {
        if (profileStatus === true && subscriptionStatus === "active") {
          console.log("✅ Setup complete, redirecting to /dashboard");
          navigate("/dashboard");
        } else if (subscriptionStatus === "inactive") {
          console.log("✅ Redirecting to /subscription");
          navigate("/subscribe");
        } else if (subscriptionStatus === "active" && profileStatus === false) {
          console.log("✅ Redirecting to /business-profile");
          navigate("/business-profile");
        } else {
          console.warn("⚠️ Unexpected status combination:", {
            subscriptionStatus,
            profileStatus,
          });
          navigate("/business-profile");
        }
      }, 1500);
    } catch (error) {
      console.error("❌ Login error:", error.response?.data || error);
      toast.error(
        error.response?.data?.message || "Login failed. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <ToastContainer />
      <div className="w-full h-screen flex justify-center lg:grid grid-cols-2">
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
        <div className="relative max-lg:w-full flex flex-col items-center lg:justify-center bg-[#FFFDF2] max-md:bg-[url('/bg-login.svg')] bg-cover bg-center">
          <div className="w-[80%] h-fit max-lg:mt-16">
            <Link to="/" className="w-fit h-fit absolute top-0 left-0">
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
                  onClick={() => setShowPassword((prev) => !prev)}
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
                <Link to="/forgotten-password" className="text-[#6A7368]">
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
