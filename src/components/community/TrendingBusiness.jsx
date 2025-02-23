import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ProfileImg from "../../assets/profilepic.svg";
import Trending01 from "../../assets/trending01.svg";
import Trending02 from "../../assets/trending02.svg";
import Trending03 from "../../assets/trending03.svg";
import Trending04 from "../../assets/trending04.svg";
import Trending05 from "../../assets/trending05.svg";
import Trending06 from "../../assets/trending06.svg";
import Trending07 from "../../assets/trending07.svg";
import Trending08 from "../../assets/trending08.svg";
import { Link } from "react-router-dom";

// Import other images...

// Business data array
const businesses = [
  {
    id: 1,
    img: Trending01,
    name: "Oversized Blazers",
    category: "Clothing and Accessories",
  },
  { id: 2, img: Trending02, name: "Casual Sneakers", category: "Footwear" },
  {
    id: 3,
    img: Trending03,
    name: "Handmade Jewelry",
    category: "Accessories",
  },
  {
    id: 4,
    img: Trending04,
    name: "Vintage Sunglasses",
    category: "Eyewear",
  },
  { id: 5, img: Trending05, name: "Eco-friendly Bags", category: "Bags" },
  { id: 6, img: Trending06, name: "Smart Watches", category: "Wearables" },
  {
    id: 7,
    img: Trending07,
    name: "Athleisure Hoodies",
    category: "Sportswear",
  },
  {
    id: 8,
    img: Trending08,
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
          onClick={(e) => e.stopPropagation()}
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
                  className="border-[1px] border-[#6A7368] text-[#6A7368] rounded-[11px] text-[15px] hover:text-white px-2 lg:px-8 py-2 shadow-lg hover:bg-[#043D12]"
                >
                  View Profile
                </Link>
                <Link
                  to="/"
                  className="border-[1px] border-[#6A7368] text-[#6A7368] rounded-[11px] text-[15px] hover:text-white px-2 lg:px-8 py-2 shadow-lg hover:bg-[#043D12]"
                >
                  Contact Us
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

const TrendingBusiness = () => {
  const [selectedBusiness, setSelectedBusiness] = useState(null);

  return (
    <div className="w-full h-fit py-16 flex justify-center bg-[#FFFDF2]">
      <div className="w-[85%] h-fit flex flex-col gap-8">
        <h1 className="text-[#043D12] lg:text-[32px] text-[24px] font-medium">
          Trending Business
        </h1>
        <div className="w-full grid lg:grid-cols-4 grid-cols-2 max-[280px]:grid-cols-1 gap-4">
          {businesses.map((business, index) => (
            <motion.div
              key={business.id}
              className="flex flex-col gap-1 cursor-pointer"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }} // This triggers the animation on scroll
              viewport={{ once: false }} // Ensure it animates only once
              transition={{ duration: 0.5, delay: index * 0.1 }}
              onClick={() => setSelectedBusiness(business)}
            >
              <div className="profile flex items-center gap-2">
                <img src={ProfileImg} alt="Profile_Photo" />
                <p className="text-[12px] text-[#043D12]">Claire Fidelis</p>
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

                  <Link
                    to="/"
                    className="w-fit hover:bg-[#043D12] bg-transparent border-[1px] border-[#043D12] rounded-[48px] text-[#043D12] hover:text-white shadow-lg lg:text-[12px] text-[8px] md:px-6 px-4 font-bold md:h-[35px] h-[25px] flex items-center mb-4"
                  >
                    View Profile
                  </Link>
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
    </div>
  );
};

export default TrendingBusiness;
