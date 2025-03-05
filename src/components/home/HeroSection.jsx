import React from "react";
import { Link } from "react-router-dom";
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
    hover: { scale: 1.1, transition: { type: "spring", stiffness: 300 } },
  },
};

const HeroSection = () => {
  return (
    <motion.div
      whileInView="visible"
      viewport={{ once: false }}
      className="w-full flex flex-col justify-center items-center bg-[#FFFDF2] overflow-hidden"
    >
      <div className="h-full container mx-auto px-[5vh] text-[#043D12] grid md:grid-cols-2 grid-cols-1 min-2xl:items-center justify-center">
        {/* Animated Text Section */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false }}
          variants={animations.slideLeft}
          className=" details flex flex-col md:gap-4 gap-4 md:text-left md:py-12"
        >
          <h1 className="text-[#043D12] lg:text-[50px] lg:leading-[45px] text-[32px] max-w-full lg:mt-8 font-medium max-lg:text-center">
            Elevate Your Business. <br className="" />
            <strong className="lg:text-[32px] text-[20px] italic">
              Connect. Showcase. Grow.
            </strong>
          </h1>
          <p className="lg:text-[25px] text-[14px] max-w-full mx-auto md:mx-0 text-[#6A7368] max-lg:text-center ">
            Create a powerful online presence. Share <br /> your story, showcase
            your products, and let your customers find you.
          </p>
          <div className="btns flex lg:gap-4 gap-8 max-sm:gap-4 items-center justify-center lg:justify-start mt-4">
            <motion.div
              variants={animations.buttonHover}
              whileHover="hover"
              className=""
            >
              <Link
                to="/create-account"
                className="w-fit bg-[#043D12] rounded-[48px] text-white shadow-lg lg:text-[18px] text-[10px] md:px-8 font-bold  px-4 py-4 md:py-5  "
              >
                Create my profile
              </Link>
            </motion.div>
            <motion.div variants={animations.buttonHover} whileHover="hover">
              <Link
                to="/community/all-businesses"
                className="w-fit bg-[#043D12] rounded-[48px] text-white shadow-lg lg:text-[18px] text-[10px] md:px-8 font-bold  px-4 py-4 md:py-5  "
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
              className="max-w-full object-contain object-center mx-auto"
            />
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default HeroSection;
