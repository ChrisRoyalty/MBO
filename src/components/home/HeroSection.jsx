import React from "react";
import { Link } from "react-router";
import { motion } from "framer-motion"; // Import motion from framer-motion
import HeroImg from "../../assets/mbo-heroImg.png";

const HeroSection = () => {
  // Variants for animation
  const textVariant = {
    hidden: { opacity: 0, x: "-100%" },
    visible: {
      opacity: 1,
      x: 0,
      transition: { type: "spring", stiffness: 50, delay: 0.3 },
    },
  };

  const imageVariant = {
    hidden: { opacity: 0, x: "100%" },
    visible: {
      opacity: 1,
      x: 0,
      transition: { type: "spring", stiffness: 50, delay: 0.6 },
    },
  };

  return (
    <div className="w-full flex justify-center lg:justify-end items-center bg-[#FFFDF2]">
      <div className="w-[95%] text-[#043D12] grid grid-cols-1 md:grid-cols-2">
        {/* Animated Text Section */}
        <motion.div
          className="details flex flex-col gap-4 max-sm:text-center py-12"
          initial="hidden"
          animate="visible"
          variants={textVariant}
        >
          <h1 className="text-[#043D12] lg:text-[45px] text-[32px] w-fit h-fit max-sm:py-8 font-medium max-sm:bg-[url('/carbon-growth.svg')] bg-cover bg-center object-center">
            Elevate Your Business. <br className="max-sm:hidden" />
            Connect. Showcase.
            <br className="max-sm:hidden" />
            Grow.
          </h1>
          <p className="lg:text-[24px] text-[16px]">
            Create a powerful online presence. Share your story, showcase your
            products, and let your customers find you.
          </p>
          <div className="btns flex gap-8 max-sm:justify-center">
            <Link
              to="/create-account"
              className="bg-[#043D12] rounded-[48px] text-white shadow-lg lg:text-[18px] text-[10px] md:px-8 px-6 py-4"
            >
              Create my Profile
            </Link>
            <Link
              to="/subscribe"
              className="bg-[#043D12] rounded-[48px] text-white shadow-lg lg:text-[18px] text-[10px] md:px-8 px-6 py-4"
            >
              Explore Businesses
            </Link>
          </div>
        </motion.div>

        {/* Animated Image Section */}
        <motion.div
          className="visual"
          initial="hidden"
          animate="visible"
          variants={imageVariant}
        >
          <img src={HeroImg} alt="Hero-Page-img" />
        </motion.div>
      </div>
    </div>
  );
};

export default HeroSection;
