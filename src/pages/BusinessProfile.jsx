import React, { useState } from "react";
import { Link } from "react-router-dom";
import { CiLock } from "react-icons/ci";
import { BsPerson } from "react-icons/bs";
import { MdOutlineCategory } from "react-icons/md";
import { VscSymbolKeyword } from "react-icons/vsc";
import { IoMdArrowDropdown, IoMdArrowDropup } from "react-icons/io";
import { IoIosArrowRoundBack } from "react-icons/io";

import Hand from "../components/svgs/Hand";

const categories = [
  {
    name: "Retail and E-commerce",
    examples: [
      "Grocery Stores",
      "Clothing and Accessories",
      "Electronics",
      "Home Goods",
      "Online Stores",
    ],
  },
  {
    name: "Food and Beverage",
    examples: [
      "Restaurants",
      "Cafés",
      "Catering Services",
      "Bakeries",
      "Food Trucks",
    ],
  },
  {
    name: "Professional Services",
    examples: [
      "Legal Services",
      "Accounting and Tax Services",
      "Consulting",
      "Real Estate Agencies",
      "Business Coaching",
    ],
  },
  {
    name: "Health and Wellness",
    examples: [
      "Gyms and Fitness Studios",
      "Spas and Salons",
      "Medical Practices",
      "Alternative Medicine",
      "Mental Health Services",
    ],
  },
  {
    name: "Creative and Media",
    examples: [
      "Photography",
      "Graphic Design",
      "Marketing Agencies",
      "Content Creation",
      "Publishing",
    ],
  },
  {
    name: "Technology",
    examples: [
      "IT Services",
      "Software Development",
      "Web Design",
      "Cybersecurity",
      "Tech Support",
    ],
  },
  {
    name: "Education and Training",
    examples: [
      "Schools",
      "Online Courses",
      "Vocational Training",
      "Vocational Training",
      "Childcare Services",
    ],
  },
  {
    name: "Events and Entertainment",
    examples: [
      "Event Planning",
      "DJs and Musicians",
      "Party Rentals",
      "Cinemas",
      "Entertainment Venues",
    ],
  },
  {
    name: "Trades and Maintenance",
    examples: [
      "Plumbing",
      "Electricians",
      "Landscaping",
      "Cleaning Services",
      "Construction",
    ],
  },
  {
    name: "Nonprofits and Community",
    examples: [
      "NGOs",
      "Religious Organizations",
      "Community Groups",
      "Advocacy Groups",
    ],
  },
  { name: "Other", examples: [] },
];

const BusinessProfile = () => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(
    "Select Business Category"
  );

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    setShowDropdown(false);
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

          <form className="max-lg:w-full flex flex-col gap-6 md:mt-8 mt-16 max-lg:items-center">
            {/* Business Name */}
            <div className="max-lg:w-full border-[1px] rounded-[27px] px-8 border-[#363636] flex items-center gap-2 lg:h-[60px] h-[48px]">
              <BsPerson className="text-[#6A7368]" />
              <input
                type="text"
                placeholder="Business Name"
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
                  <span className="text-[#6A7368]">{selectedCategory}</span>
                </div>
                {showDropdown ? (
                  <IoMdArrowDropup className="text-[#6A7368] cursor-pointer" />
                ) : (
                  <IoMdArrowDropdown className="text-[#6A7368] cursor-pointer" />
                )}
              </button>
              {showDropdown && (
                <ul className="absolute top-[50px] border-4 border-[#043D12] left-0 w-full bg-[#FFFDF2] text-[#043D12] rounded-[25px] mt-2 p-2 shadow-lg max-h-[200px] overflow-y-auto">
                  {categories.map((category, index) => (
                    <li
                      key={index}
                      className="py-2 px-4 cursor-pointer hover:bg-[#043D12]/30 rounded-[20px]"
                      onClick={() => handleCategorySelect(category.name)}
                    >
                      {category.name}
                      {category.examples.length > 0 && (
                        <p className="text-xs text-[#043D12]/90">
                          {category.examples.join(", ")}
                        </p>
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Keywords */}
            <div className="max-lg:w-full border-[1px] rounded-[27px] px-8 border-[#363636] flex items-center gap-2 lg:h-[60px] h-[48px]">
              <VscSymbolKeyword className="text-[#6A7368]" />
              <input
                type="text"
                placeholder="Enter keywords"
                className="max-lg:w-full h-full border-none focus:outline-none text-[#6A7368]"
              />
            </div>

            {/* Description */}
            <div className="max-lg:w-full border-[1px] rounded-[27px] px-8 border-[#363636] flex items-center gap-2 lg:h-[60px] h-[48px]">
              <CiLock className="text-[#6A7368]" />
              <input
                type="text"
                placeholder="Description"
                className="max-lg:w-full h-full border-none focus:outline-none text-[#6A7368]"
              />
            </div>

            {/* Submit Button */}
            <button className="md:mt-6 mt-16 w-full text-[#FFFDF2] bg-[#043D12] hover:bg-[#043D12]/75 shadow-lg rounded-[27px] px-8 flex justify-center items-center lg:h-[60px] h-[48px]">
              Create Profile{" "}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default BusinessProfile;
