import React, { useState } from "react";
import { CiSearch } from "react-icons/ci";
import { RiEqualizerLine } from "react-icons/ri";
import { MdOutlineCategory } from "react-icons/md";
import { RiArrowDropDownLine, RiArrowDropUpLine } from "react-icons/ri";
import { IoLocationOutline } from "react-icons/io5";
import NewBusinesses from "../components/community/NewBusinesses";
import { motion, AnimatePresence } from "framer-motion";
import ProfileImg from "../assets/profilepic.svg";
import { Link } from "react-router-dom";
// Import business images
import Newbusiness01 from "../assets/new01.svg";
import Newbusiness02 from "../assets/new02.svg";
import Newbusiness03 from "../assets/new03.svg";
import Newbusiness04 from "../assets/new04.svg";
import Newbusiness05 from "../assets/new05.svg";
import Newbusiness06 from "../assets/new06.svg";
import Newbusiness07 from "../assets/new07.svg";
import Newbusiness08 from "../assets/new08.svg";

const businesses = [
  {
    id: 1,
    img: Newbusiness01,
    name: "Oversized Blazers",
    category: "Clothing and Accessories",
  },
  { id: 2, img: Newbusiness02, name: "Casual Sneakers", category: "Footwear" },
  {
    id: 3,
    img: Newbusiness03,
    name: "Handmade Jewelry",
    category: "Accessories",
  },
  {
    id: 4,
    img: Newbusiness04,
    name: "Vintage Sunglasses",
    category: "Eyewear",
  },
  { id: 5, img: Newbusiness05, name: "Eco-friendly Bags", category: "Bags" },
  { id: 6, img: Newbusiness06, name: "Smart Watches", category: "Wearables" },
  {
    id: 7,
    img: Newbusiness07,
    name: "Athleisure Hoodies",
    category: "Sportswear",
  },
  {
    id: 8,
    img: Newbusiness08,
    name: "Minimalist Wallets",
    category: "Accessories",
  },
];

// Modal Component
const Modal = ({ business, onClose }) => {
  if (!business) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black/75 bg-opacity-50 flex justify-center items-center z-50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="bg-white px-8 py-10 rounded-lg shadow-lg w-[90%] md:w-[60%] flex flex-col md:flex-row gap-6 items-center"
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          exit={{ scale: 0.8 }}
          onClick={(e) => e.stopPropagation()} // Prevent closing on click inside
        >
          {/* Business Image */}
          <motion.img
            src={business.img}
            alt={business.name}
            className="w-full rounded-lg"
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
          />

          {/* Business Details */}
          <motion.div
            className="flex flex-col gap-4"
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-xl font-bold text-[#043D12]">
              {business.name}
            </h2>
            <p className="text-sm text-gray-600">{business.category}</p>
            <p className="text-gray-700">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus
              lacinia odio vitae vestibulum.
            </p>

            <div className="btns flex">
              <div className="w-fit flex items-center gap-6">
                <Link
                  to="/"
                  className="border-[1px] border-[#6A7368] text-[#6A7368] rounded-[11px] text-[15px] hover:text-white px-2 lg:px-8 py-2  shadow-lg hover:bg-[#043D12]"
                >
                  View Profile{" "}
                </Link>
                <Link
                  to="/"
                  className="border-[1px] border-[#6A7368] text-[#6A7368] rounded-[11px] text-[15px] hover:text-white px-2 lg:px-8 py-2  shadow-lg hover:bg-[#043D12]"
                >
                  Contact Us{" "}
                </Link>
              </div>
            </div>

            <button
              onClick={onClose}
              className="mt-4 border-[1px] border-red-600 text-red-600 font-bold rounded-lg shadow-md py-2"
            >
              Close
            </button>
          </motion.div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
const SearchPage = () => {
  const [selectedBusiness, setSelectedBusiness] = useState(null);

  // State to manage visibility of each dropdown
  const [categoryOpen, setCategoryOpen] = useState(false);
  const [locationOpen, setLocationOpen] = useState(false);
  const [visibilityOpen, setVisibilityOpen] = useState(false);

  // Toggle dropdowns and close others when one is opened
  const toggleCategory = () => {
    setCategoryOpen(!categoryOpen);
    setLocationOpen(false); // Close location dropdown
    setVisibilityOpen(false); // Close visibility dropdown
  };

  const toggleLocation = () => {
    setLocationOpen(!locationOpen);
    setCategoryOpen(false); // Close category dropdown
    setVisibilityOpen(false); // Close visibility dropdown
  };

  const toggleVisibility = () => {
    setVisibilityOpen(!visibilityOpen);
    setCategoryOpen(false); // Close category dropdown
    setLocationOpen(false); // Close location dropdown
  };

  return (
    <div className="w-full bg-[#FFFDF2] flex flex-col items-center">
      <div className="w-[80%]">
        <header className="h-[20vh] flex max-md:flex-col max-md:my-8 justify-between items-center max-md:gap-8">
          {/* Search Section */}
          <div className="md:w-[50%] w-full bg-[#D6E2D98C] text-[16px] px-8 rounded-[39px] shadow-lg h-[70px] text-[#043D12] flex gap-2 items-center justify-between">
            <input
              type="text"
              className="h-full outline-0 w-full"
              placeholder="Search Businesses or services"
            />
            <CiSearch className="text-[20px]" />
          </div>
          <Link
            to="/community/all-businesses"
            className="w-fit h-[70px] px-8 rounded-[39px] shadow-lg bg-[#043D12] text-[#FFFDF2] flex items-center justify-center"
          >
            Explore all Businesses
          </Link>
        </header>

        <div className="w-full h-[80vh] text-[#043D12] flex max-sm:flex-col overflow-y-scroll">
          {/* Sidebar for Filters */}
          <aside className="max-sm:hidden sm:w-[25%] h-full overflow-y-auto flex flex-col gap-8">
            {/* Filter Heading */}
            <div className="intro text-[#043D12] flex items-center gap-4">
              <RiEqualizerLine className="text-[22px]" />
              <h4 className="text-[#043D12] text-[20px]">Filter</h4>
            </div>

            {/* Category Dropdown */}
            <div className="w-full flex flex-col gap-4">
              <div
                className="flex items-center justify-between"
                onClick={toggleCategory}
              >
                <p className="flex items-center gap-2">
                  <MdOutlineCategory />
                  Category
                </p>
                {categoryOpen ? (
                  <RiArrowDropUpLine className="cursor-pointer text-[20px]" />
                ) : (
                  <RiArrowDropDownLine className="cursor-pointer text-[20px]" />
                )}
              </div>
              {categoryOpen && (
                <div className="dropdown-content">
                  <div className="flex flex-wrap justify-between gap-4">
                    {[
                      "Category 1",
                      "Category 2",
                      "Category 3",
                      "Category 4",
                      "Category 5",
                    ].map((category, index) => (
                      <button
                        key={index}
                        className="w-fit h-[40px] px-6 rounded-[11px] shadow-lg hover:bg-[#043D12] hover:text-[#FFFDF2] border-[1px] border-[#043D12] text-[#043D12]"
                        aria-label={`Select ${category}`}
                      >
                        {category}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Location Dropdown */}
            <div className="w-full flex flex-col gap-4">
              <div
                className="flex items-center justify-between"
                onClick={toggleLocation} // Update to toggleLocation here
                aria-expanded={locationOpen} // Also change the state name to locationOpen
              >
                <p className="flex items-center gap-2">
                  <IoLocationOutline />
                  Location
                </p>
                {locationOpen ? (
                  <RiArrowDropUpLine className="cursor-pointer text-[20px]" />
                ) : (
                  <RiArrowDropDownLine className="cursor-pointer text-[20px]" />
                )}
              </div>
              {locationOpen && (
                <div className="dropdown-content">
                  <div className="flex flex-wrap justify-between gap-4">
                    {[
                      "Location 1",
                      "Location 2",
                      "Location 3",
                      "Location 4",
                    ].map((location, index) => (
                      <button
                        key={index}
                        className="w-fit h-[40px] px-6 rounded-[11px] shadow-lg hover:bg-[#043D12] hover:text-[#FFFDF2] border-[1px] border-[#043D12] text-[#043D12]"
                      >
                        {location}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Visibility Dropdown */}
            <div className="w-full flex flex-col gap-4 mb-8">
              <div
                className="flex items-center justify-between"
                onClick={toggleVisibility}
              >
                <p className="flex items-center gap-2">
                  <IoLocationOutline />
                  Visibility
                </p>
                {visibilityOpen ? (
                  <RiArrowDropUpLine className="cursor-pointer text-[20px]" />
                ) : (
                  <RiArrowDropDownLine className="cursor-pointer text-[20px]" />
                )}
              </div>
              {visibilityOpen && (
                <div className="dropdown-content">
                  <div className="flex flex-wrap justify-between gap-4">
                    {[
                      "Visibility 1",
                      "Visibility 2",
                      "Visibility 3",
                      "Visibility 4",
                    ].map((visibility, index) => (
                      <button
                        key={index}
                        className="w-fit h-[40px] px-6 rounded-[11px] shadow-lg hover:bg-[#043D12] hover:text-[#FFFDF2] border-[1px] border-[#043D12] text-[#043D12]"
                      >
                        {visibility}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </aside>

          {/* Businesses Section */}
          <div className="sm:w-[75%] h-full overflow-y-auto">
            <div className="w-full h-fit py-16 flex justify-center bg-[#FFFDF2]">
              <div className="w-[85%] h-fit flex flex-col gap-8">
                <div className="w-full flex items-center gap-4 overflow-x-auto ">
                  <button className="border-[1px] border-[#043D12] rounded-[11px] px-4 md:px-8 py-2 flex gap-2 md:gap-4 items-center hover:bg-[#043D12] hover:text-white">
                    <MdOutlineCategory />
                    Category
                  </button>
                  <button className="border-[1px] border-[#043D12] rounded-[11px] px-4 md:px-8 py-2 flex gap-2 md:gap-4 items-center hover:bg-[#043D12] hover:text-white">
                    <MdOutlineCategory />
                    Category
                  </button>
                  <button className="border-[1px] border-[#043D12] rounded-[11px] px-4 md:px-8 py-2 flex gap-2 md:gap-4 items-center hover:bg-[#043D12] hover:text-white">
                    <MdOutlineCategory />
                    Category
                  </button>
                  <button className="border-[1px] border-[#043D12] rounded-[11px] px-4 md:px-8 py-2 flex gap-2 md:gap-4 items-center hover:bg-[#043D12] hover:text-white">
                    <MdOutlineCategory />
                    Category
                  </button>
                  <button className="border-[1px] border-[#043D12] rounded-[11px] px-4 md:px-8 py-2 flex gap-2 md:gap-4 items-center hover:bg-[#043D12] hover:text-white">
                    <MdOutlineCategory />
                    Category
                  </button>
                  <button className="border-[1px] border-[#043D12] rounded-[11px] px-4 md:px-8 py-2 flex gap-2 md:gap-4 items-center hover:bg-[#043D12] hover:text-white">
                    <MdOutlineCategory />
                    Category
                  </button>
                  <button className="border-[1px] border-[#043D12] rounded-[11px] px-4 md:px-8 py-2 flex gap-2 md:gap-4 items-center hover:bg-[#043D12] hover:text-white">
                    <MdOutlineCategory />
                    Category
                  </button>
                  <button className="border-[1px] border-[#043D12] rounded-[11px] px-4 md:px-8 py-2 flex gap-2 md:gap-4 items-center hover:bg-[#043D12] hover:text-white">
                    <MdOutlineCategory />
                    Category
                  </button>
                </div>
                <div className="w-full grid lg:grid-cols-3 grid-cols-2 max-[280px]:grid-cols-1 gap-4">
                  {businesses.map((business, index) => (
                    <motion.div
                      key={business.id}
                      className="flex flex-col gap-1 cursor-pointer"
                      initial={{ opacity: 0, y: 50 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: false }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      onClick={() => setSelectedBusiness(business)}
                    >
                      <div className="profile flex items-center gap-2">
                        <img src={ProfileImg} alt="Profile_Photo" />
                        <p className="text-[12px] text-[#043D12]">
                          Claire Fidelis
                        </p>
                      </div>
                      <figure>
                        <img
                          src={business.img}
                          alt="Product_img"
                          className="rounded-lg"
                        />
                        <figcaption className="flex flex-col gap-4 text-[#043D12] py-2">
                          <div className="flex flex-col gap-1">
                            <b className="lg:text-[15px] text-[10px]">
                              {business.name}
                            </b>
                            <p className="text-[8px]">{business.category}</p>
                          </div>
                        </figcaption>
                      </figure>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Modal for Selected Business */}
              <Modal
                business={selectedBusiness}
                onClose={() => setSelectedBusiness(null)}
              />
            </div>{" "}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchPage;
