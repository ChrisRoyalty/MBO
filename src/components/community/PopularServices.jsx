import React from "react";
import { motion } from "framer-motion";
import ProfileImg from "../../assets/profilepic.svg";
import PopularBusiness01 from "../../assets/popular01.svg";
import PopularBusiness02 from "../../assets/popular02.svg";
import PopularBusiness03 from "../../assets/popular03.svg";
import PopularBusiness04 from "../../assets/popular04.svg";
import PopularBusiness05 from "../../assets/popular05.svg";
import PopularBusiness06 from "../../assets/popular06.svg";
import PopularBusiness07 from "../../assets/popular07.svg";
import PopularBusiness08 from "../../assets/popular08.svg";

// Import other images...

import { Link } from "react-router-dom";

const businesses = [
  {
    id: 1,
    img: PopularBusiness01,
    name: "Oversized Blazers",
    category: "Clothing and Accessories",
  },
  {
    id: 2,
    img: PopularBusiness02,
    name: "Casual Sneakers",
    category: "Footwear",
  },
  {
    id: 3,
    img: PopularBusiness03,
    name: "Handmade Jewelry",
    category: "Accessories",
  },
  {
    id: 4,
    img: PopularBusiness04,
    name: "Vintage Sunglasses",
    category: "Eyewear",
  },
  {
    id: 5,
    img: PopularBusiness05,
    name: "Eco-friendly Bags",
    category: "Bags",
  },
  {
    id: 6,
    img: PopularBusiness06,
    name: "Smart Watches",
    category: "Wearables",
  },
  {
    id: 7,
    img: PopularBusiness07,
    name: "Athleisure Hoodies",
    category: "Sportswear",
  },
  {
    id: 8,
    img: PopularBusiness08,
    name: "Minimalist Wallets",
    category: "Accessories",
  },
];

const PopularServices = () => {
  return (
    <div className="w-full h-fit py-16 flex justify-center bg-[#FFFDF2]">
      <div className="w-[85%] h-fit flex flex-col gap-8">
        <h1 className="text-[#043D12] lg:text-[32px] text-[24px] font-medium">
          Popular Services/Products
        </h1>
        <div className="w-full grid lg:grid-cols-4 grid-cols-2 max-[280px]:grid-cols-1 gap-4">
          {businesses.map((business, index) => (
            <motion.div
              key={business.id}
              className="flex flex-col gap-1"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }} // This triggers the animation on scroll
              viewport={{ once: false }} // Ensure it animates only once
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <div className="profile flex items-center gap-2">
                <img src={ProfileImg} alt="Profile_Photo" />
                <p className="text-[12px] text-[#043D12]">Claire Fidelis</p>
              </div>
              <figure>
                <img src={business.img} alt="Product_img" />
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
    </div>
  );
};

export default PopularServices;
