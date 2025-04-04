import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import HeroImg from "../../assets/mbo-heroImg.png";

const animations = {
  slideLeft: {
    hidden: { x: -100, opacity: 0 },
    visible: {
      x: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 50 },
    },
  },
  slideRight: {
    hidden: { x: 100, opacity: 0 },
    visible: {
      x: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 50 },
    },
  },
  buttonHover: {
    hover: {
      scale: 1.03,
      transition: {
        duration: 0.2,
        ease: "easeOut",
      },
    },
  },
  buttonTap: {
    tap: { scale: 0.98 },
  },
};

const HeroSection = () => {
  const location = useLocation();
  const [activeButton, setActiveButton] = useState(
    location.pathname.includes("community") ? "explore" : "create"
  );

  return (
    <motion.div
      whileInView="visible"
      viewport={{ once: false }}
      className="w-full flex flex-col justify-center items-center bg-[#FFFDF2] overflow-hidden"
    >
      <div className="h-full container mx-auto px-[5vw] text-[#043D12] grid md:grid-cols-2 grid-cols-1 justify-center">
        {/* Animated Text Section */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false }}
          variants={animations.slideLeft}
          className="details flex flex-col md:gap-4 gap-4 md:text-left md:py-12"
        >
          <h1 className="text-[#043D12] lg:text-[45px] lg:leading-[45px] text-[32px] max-w-full lg:mt-8 font-medium max-md:text-center">
            Elevate Your Business. <br className="" />
            <strong className="lg:text-[32px] text-[20px] italic">
              Connect. Showcase. Grow.
            </strong>
          </h1>
          <p className="lg:text-[22px] text-[14px] max-w-full mx-auto md:mx-0 text-[#6A7368] max-md:text-center">
            Create a powerful online presence. Share <br /> your story, showcase
            your products, and let your customers find you.
          </p>
          <div className="btns flex lg:gap-4 gap-4 max-sm:gap-4 items-center justify-center md:justify-start mt-6">
            <motion.div
              variants={animations.buttonHover}
              whileHover="hover"
              whileTap="tap"
            >
              <Link
                to="/create-account"
                onClick={() => setActiveButton("create")}
                className={`w-fit rounded-[48px] shadow-lg lg:text-[18px] md:text-[12px] text-[14px] md:px-4 font-bold px-[15px] py-4 md:py-5 transition-all duration-300 ${
                  activeButton === "create"
                    ? "border-2 border-[#043D12] bg-[#043D12] text-white hover:bg-[#032a0d]"
                    : "border-2 border-[#043D12] text-[#043D12] hover:bg-[#043D12]/10"
                }`}
              >
                Create my profile
              </Link>
            </motion.div>
            <motion.div
              variants={animations.buttonHover}
              whileHover="hover"
              whileTap="tap"
            >
              <Link
                to="/community/all-businesses"
                onClick={() => setActiveButton("explore")}
                className={`w-fit rounded-[48px] shadow-lg lg:text-[18px] md:text-[12px] text-[14px] md:px-4 font-bold px-[15px] py-4 md:py-5 transition-all duration-300 ${
                  activeButton === "explore"
                    ? "border-2 border-[#043D12] bg-[#043D12] text-white hover:bg-[#032a0d]"
                    : "border-2 border-[#043D12] text-[#043D12] hover:bg-[#043D12]/10"
                }`}
              >
                Explore Businesses
              </Link>
            </motion.div>
          </div>
        </motion.div>

        {/* Animated Image Section */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false }}
          variants={animations.slideRight}
          className="visual h-full overflow-hidden max-lg:mt-8"
        >
          <div className="w-full h-auto">
            <img
              src={HeroImg}
              alt="Hero-Page-img"
              className="max-w-full h-[100%] object-cover object-center mx-auto"
            />
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default HeroSection;
