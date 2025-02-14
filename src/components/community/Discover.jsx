import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import HeroImg from "../../assets/Woman.svg";

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
    hover: { scale: 1.1, transition: { type: "spring", stiffness: 300 } },
  },
};

const Discover = () => {
  return (
    <motion.div
      whileInView="visible"
      viewport={{ once: false }}
      className="w-full lg:h-[80vh] h-fit flex flex-col items-center bg-[#043D12] overflow-hidden justify-center"
    >
      <div className="h-full w-[80%] text-[#043D12] grid grid-cols-1 lg:grid-cols-2 mx-auto items-center max-lg:gap-8 max-lg:items-baseline max-lg:pt-10">
        {/* Animated Text Section */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false }}
          variants={animations.slideLeft}
          className="details flex flex-col md:gap-10 gap-8 text-center md:text-left max-lg:items-center"
        >
          <h1 className=" text-[#FFFDF2] lg:leading-[65px] max-w-full mt-8 font-medium max-lg:mx-auto max-lg:text-center md:text-[45px] text-[32px]">
            Discover Businesses Near You Within the MindPower Network
          </h1>

          <div className="btns flex  justify-center md:justify-start mt-4">
            <motion.div variants={animations.buttonHover} whileHover="hover">
              <Link
                to="/business-profile"
                className="w-fit text-[#043D12] bg-[#FFFDF2] rounded-[48px] shadow-lg lg:text-[18px] text-[12px] md:px-8 font-bold px-4 py-4 md:py-5"
              >
                Explore all Businesses
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
          className="visual h-full overflow-hidden max-lg:mt-8 "
        >
          <div className="w-full md:h-[100vh] flex items-center">
            <img
              src={HeroImg}
              alt="Hero-Page-img"
              className="max-w-full h-auto object-contain mx-auto"
            />
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Discover;
