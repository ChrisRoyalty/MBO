import React, { useState } from "react";
import { Link } from "react-router";
import { FaRegEnvelope } from "react-icons/fa";
import { CiLock } from "react-icons/ci";
import { BsPerson } from "react-icons/bs";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import Hand from "../components/svgs/Hand";

const Signup = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  return (
    <div className="w-full h-screen flex justify-center lg:grid grid-cols-2">
      {/* Left Section with Background Image */}
      <div className="max-lg:hidden w-full h-full flex justify-center items-center bg-[url('/Group2.svg')] bg-cover bg-center bg-green-800">
        <div className="w-full h-[90%] flex flex-col items-center">
          <div className="w-[90%] text-[#FFFDF2] mt-12">
            <h1 className="lg:text-[50px] text-[32px] font-medium">
              Welcome to <br /> MBO
            </h1>
            <p className="text-[18px]">
              Step into a community that puts your business in the spotlight.
              Showcase your brand, find new customers, and grow together.
            </p>
          </div>
        </div>
      </div>

      {/* Right Section */}
      <div className="max-lg:w-full flex flex-col items-center lg:justify-center bg-[#FFFDF2] max-md:bg-[url('/bg-login.svg')] bg-cover bg-center">
        <div className="w-[80%] h-fit max-lg:mt-16">
          <h1 className="lg:text-[50px] text-[32px] font-bold text-[#363636]">
            MBO
          </h1>
          <h4 className="lg:text-[32px] text-[20px] font-medium text-[#043D12] flex items-center gap-2">
            Register <Hand />
          </h4>

          <form className="max-lg:w-full flex flex-col gap-4 mt-8 max-lg:items-center">
            <div className="max-lg:w-full email border-[1px] rounded-[27px] px-8 border-[#363636] flex items-center gap-2 lg:h-[60px] h-[48px]">
              <BsPerson className="text-[#6A7368]" />
              <input
                type="text"
                placeholder="First Name"
                className="max-lg:w-full h-full border-none focus:outline-none focus:border-transparent text-[#043D12]"
              />
            </div>
            <div className="max-lg:w-full email border-[1px] rounded-[27px] px-8 border-[#363636] flex items-center gap-2 lg:h-[60px] h-[48px]">
              <BsPerson className="text-[#6A7368]" />
              <input
                type="text"
                placeholder="Last Name"
                className="max-lg:w-full h-full border-none focus:outline-none focus:border-transparent text-[#043D12]"
              />
            </div>

            <div className="max-lg:w-full email border-[1px] rounded-[27px] px-8 border-[#363636] flex items-center gap-2 lg:h-[60px] h-[48px]">
              <FaRegEnvelope className="text-[#6A7368]" />
              <input
                type="email"
                placeholder="Email"
                className="max-lg:w-full h-full border-none focus:outline-none focus:border-transparent text-[#043D12]"
              />
            </div>
            <div className="max-lg:w-full password border-[1px] rounded-[27px] px-8 border-[#363636] flex items-center gap-2 lg:h-[60px] h-[48px]">
              <CiLock className="text-[#6A7368]" />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                className="max-lg:w-full h-full border-none focus:outline-none focus:border-transparent text-[#043D12]"
              />
              <button
                type="button"
                className="text-[#6A7368]"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
              </button>
            </div>
            <div className="max-lg:w-full password border-[1px] rounded-[27px] px-8 border-[#363636] flex items-center gap-2 lg:h-[60px] h-[48px]">
              <CiLock className="text-[#6A7368]" />
              <input
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm Password"
                className="max-lg:w-full h-full border-none focus:outline-none focus:border-transparent text-[#043D12]"
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
            <div className="max-lg:w-full remember flex items-center justify-between">
              <div className="checkbox flex gap-2 items-center">
                <input
                  type="checkbox"
                  name="remember"
                  className="cursor-pointer w-5 h-5 text-transparent border-2 border-[#043D12] rounded-sm appearance-none focus:ring-2 focus:ring-[#043D12] peer checked:bg-[#043D12]"
                />
                <label className="text-[#6A7368]">Remember me</label>
              </div>
              <a href="#" className="text-[#6A7368]">
                Forgot password?
              </a>
            </div>
            <button className="w-full text-[#FFFDF2] password bg-[#043D12] hover:bg-[#043D12]/75 shadow-lg rounded-[27px] px-8 flex justify-center items-center lg:h-[60px] h-[48px]">
              Register
            </button>
            <Link
              to="/login"
              className="text-[#6A7368] text-[16px] text-center"
            >
              Are you already a member?{" "}
              <strong className="hover:text-[17px]">Log In</strong>
            </Link>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Signup;
