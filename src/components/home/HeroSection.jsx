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
      className="w-full md:h-[80vh] flex flex-col items-center bg-[#FFFDF2] overflow-hidden"
    >
      <div className="h-full w-full max-w-[85%] text-[#043D12] grid grid-cols-1 md:grid-cols-2 mx-auto">
        {/* Animated Text Section */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false }}
          variants={animations.slideLeft}
          className="details flex flex-col md:gap-2 gap-4 text-center md:text-left md:py-12"
        >
          <h1 className="text-[#043D12] lg:text-[55px] lg:leading-[65px] text-[32px] max-w-full lg:mt-8 font-medium">
            Elevate Your Business. <br className="max-sm:hidden" />
            Connect. Showcase.
            <br className="max-sm:hidden" />
            Grow.
          </h1>
          <p className="lg:text-[28px] text-[14px] max-w-full mx-auto md:mx-0">
            Create a powerful online presence. Share your story, showcase your
            products, and let your customers find you.
          </p>
          <div className="btns flex md:gap-2 lg:gap-4 gap-4  justify-center md:justify-start mt-4">
            <motion.div variants={animations.buttonHover} whileHover="hover">
              <Link
                to="/business-profile"
                className="w-fit bg-[#043D12] rounded-[48px] text-white shadow-lg lg:text-[18px] text-[10px] md:px-8 font-bold px-4 py-3 md:py-4"
              >
                Create my Profile
              </Link>
            </motion.div>
            <motion.div variants={animations.buttonHover} whileHover="hover">
              <Link
                to="/subscribe"
                className="w-fit bg-[#043D12] rounded-[48px] text-white shadow-lg lg:text-[18px] text-[10px] md:px-8 font-bold px-4 py-3 md:py-4"
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
          <div className="w-full md:h-[80vh] h-auto">
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

export default HeroSection;
