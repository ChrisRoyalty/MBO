import React from "react";
import { Link } from "react-router";
import { motion } from "framer-motion"; // Import motion from framer-motion
import HeroImg from "../../assets/mbo-heroImg.svg";

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
    <div className="w-full md:h-[80vh] flex flex-col items-center lg:items-end bg-[#FFFDF2]">
      <div className="w-[93%] h-full text-[#043D12] grid grid-cols-1 md:grid-cols-2">
        {/* Animated Text Section */}
        <motion.div
          className="details flex flex-col gap-4 max-sm:text-center md:py-12"
          initial="hidden"
          animate="visible"
          variants={textVariant}
        >
          <h1 className="text-[#043D12] lg:text-[55px] lg:leading-[65px] text-[32px] w-fit h-fit  lg:mt-8 max-sm:py-4 font-medium max-sm:bg-[url('/carbon-growth.svg')] bg-cover bg-center object-center">
            Elevate Your Business. <br className="max-sm:hidden" />
            Connect. Showcase.
            <br className="max-sm:hidden" />
            Grow.
          </h1>
          <p className="lg:text-[28px] text-[14px] w-[80%] max-lg:mx-auto">
            Create a powerful online presence. Share your story, showcase your
            products, and let your customers find you.
          </p>
          <div className="btns flex md:gap-8 gap-6 max-sm:justify-center mt-4">
            <Link
              to="/business-profile"
              className="bg-[#043D12] rounded-[48px] text-white shadow-lg lg:text-[18px] text-[14px] md:px-8 px-4 py-3 md:py-4"
            >
              Create my Profile
            </Link>
            <Link
              to="/subscribe"
              className="bg-[#043D12] rounded-[48px] text-white shadow-lg lg:text-[18px] text-[14px] md:px-8 px-4 py-3 md:py-4"
            >
              Explore Businesses
            </Link>
          </div>
        </motion.div>

        {/* Animated Image Section */}
        <motion.div
          className="visual h-full"
          initial="hidden b"
          animate="visible"
          variants={imageVariant}
        >
          <div className="w-full md:h-[80vh] h-fit py-0">
            <img
              src={HeroImg}
              alt="Hero-Page-img"
              className="w-full h-full max-sm:pt-8"
            />
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default HeroSection;
