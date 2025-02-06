import React from "react";
import { motion } from "framer-motion";
import ProfileImg from "../../assets/profilepic.svg";
import Trending01 from "../../assets/trending01.svg";
import Trending02 from "../../assets/trending02.svg";
import Trending03 from "../../assets/trending03.svg";
import Trending04 from "../../assets/trending04.svg";
import Trending05 from "../../assets/trending05.svg";
import Trending06 from "../../assets/trending06.svg";
import Trending07 from "../../assets/trending07.svg";
import Trending08 from "../../assets/trending08.svg";

// Import other images...

import { Link } from "react-router-dom";

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

const TrendingBusiness = () => {
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

export default TrendingBusiness;
