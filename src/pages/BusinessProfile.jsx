import React, { useState } from "react";
import { Link } from "react-router";
import { CiLock } from "react-icons/ci";
import { BsPerson } from "react-icons/bs";
import { MdOutlineCategory } from "react-icons/md";
import { VscSymbolKeyword } from "react-icons/vsc";
import { IoMdArrowDropdown, IoMdArrowDropup } from "react-icons/io";

import Hand from "../components/svgs/Hand";

const BusinessProfile = () => {
  const [showDropdown, setShowDropdown] = useState(false);

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  return (
    <div className="w-full h-screen flex justify-center lg:grid grid-cols-2">
      {/* Left Section with Background Image */}
      <div className="max-lg:hidden w-full h-full flex justify-center items-center bg-[url('/Group2.svg')] bg-cover bg-center bg-green-800">
        <div className="w-full h-[90%] flex flex-col items-center">
          <div className="w-[90%] text-[#FFFDF2] mt-8">
            <Link to="/" className="lg:text-[50px] text-[32px] font-medium">
              Tell us about <br /> your business{" "}
            </Link>
            <p className="text-[18px]">
              Step into a community that puts your business in the spotlight.
              Showcase your brand, find new customers, and grow together.
            </p>
          </div>
        </div>
      </div>

      {/* Right Section */}
      <div className="max-lg:w-full flex flex-col items-center lg:justify-center bg-[#FFFDF2] max-md:bg-[url('/bg-login.svg')] bg-cover bg-center">
        <div className="w-[80%] h-fit max-lg:mt-20">
          <Link
            to="/"
            className="lg:text-[50px] text-[32px] font-bold text-[#363636]"
          >
            MBO
          </Link>
          <h4 className="lg:text-[32px] text-[20px] font-medium text-[#043D12] flex items-center gap-2">
            Business Profile <Hand />
          </h4>

          <form className="max-lg:w-full flex flex-col gap-8 md:mt-8 mt-16 max-lg:items-center">
            <div className="max-lg:w-full email border-[1px] rounded-[27px] px-8 border-[#363636] flex items-center gap-2 lg:h-[60px] h-[48px]">
              <BsPerson className="text-[#6A7368]" />
              <input
                type="text"
                placeholder="Business Name"
                className="max-lg:w-full h-full border-none focus:outline-none focus:border-transparent text-[#6A7368]"
              />
            </div>
            <div className="max-lg:w-full email border-[1px] rounded-[27px] px-8 border-[#363636] flex flex-col gap-2 lg:h-auto relative">
              <button
                type="button"
                className="flex items-center justify-between text-[#6A7368] w-full h-[48px] focus:outline-none"
                onClick={toggleDropdown}
              >
                <div className="flex items-center gap-2">
                  <MdOutlineCategory className="text-[#6A7368] text-[18px]" />
                  <span className="text-[#6A7368]">Business Category</span>
                </div>
                {showDropdown ? (
                  <IoMdArrowDropup className="text-[#6A7368]" />
                ) : (
                  <IoMdArrowDropdown className="text-[#6A7368]" />
                )}
              </button>
              {showDropdown && (
                <ul className="absolute top-[50px] left-0 w-full bg-[#676767] text-white rounded-[25px] mt-4 p-2 shadow-lg">
                  <li className="py-2 px-4 hover:bg-[#575757] cursor-pointer">
                    Retail
                  </li>
                  <li className="py-2 px-4 hover:bg-[#575757] cursor-pointer">
                    Technology
                  </li>
                  <li className="py-2 px-4 hover:bg-[#575757] cursor-pointer">
                    Finance
                  </li>
                </ul>
              )}
            </div>
            <div className="max-lg:w-full email border-[1px] rounded-[27px] px-8 border-[#363636] flex items-center gap-2 lg:h-[60px] h-[48px]">
              <VscSymbolKeyword className="text-[#6A7368]" />
              <input
                type="text"
                placeholder="Enter keywords"
                className="max-lg:w-full h-full border-none focus:outline-none focus:border-transparent text-[#6A7368]"
              />
            </div>
            <div className="max-lg:w-full password border-[1px] rounded-[27px] px-8 border-[#363636] flex items-center gap-2 lg:h-[60px] h-[48px]">
              <CiLock className="text-[#6A7368]" />
              <input
                type="text"
                placeholder="Description"
                className="max-lg:w-full h-full border-none focus:outline-none focus:border-transparent text-[#6A7368]"
              />
            </div>

            <button className="md:mt-6 mt-16 w-full text-[#FFFDF2] password bg-[#043D12] hover:bg-[#043D12]/75 shadow-lg rounded-[27px] px-8 flex justify-center items-center lg:h-[60px] h-[48px]">
              Create Profile{" "}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default BusinessProfile;
