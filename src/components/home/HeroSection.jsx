import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import HeroImg from "../../assets/mbo-heroImg.svg";
const animations = {
  fadeIn: {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 1 } },
  },
  scaleUp: {
    hidden: { scale: 0.8, opacity: 0 },
    visible: { scale: 1, opacity: 1, transition: { duration: 0.5 } },
  },
  slideTop: {
    hidden: { y: -100, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 50 },
    },
  },

  slideBottom: {
    hidden: { y: 100, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 50 },
    },
  },

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
  rotate: {
    hidden: { rotate: -180, opacity: 0 },
    visible: { rotate: 0, opacity: 1, transition: { duration: 1 } },
  },
  buttonHover: {
    hover: { scale: 1.1, transition: { type: "spring", stiffness: 300 } },
  },
  buttonTap: { tap: { scale: 0.9 } },
  staggerContainer: {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.3 } },
  },
};
const HeroSection = () => {
  // Variants for animations
  const textVariant = {
    hidden: { opacity: 0, x: "-100%" },
    visible: {
      opacity: 1,
      x: 0,
      transition: { type: "spring", stiffness: 60, delay: 0.3 },
    },
  };

  const imageVariant = {
    hidden: { opacity: 0, x: "100%" },
    visible: {
      opacity: 1,
      x: 0,
      transition: { type: "spring", stiffness: 60, delay: 0.6 },
    },
  };

  const buttonVariant = {
    hover: {
      scale: 1.1,
      transition: { type: "spring", stiffness: 300 },
    },
  };

  const containerVariant = {
    hidden: {},
    visible: {
      transition: { staggerChildren: 0.3 },
    },
  };

  return (
    <motion.div
      whileInView="visible"
      viewport={{ once: false }}
      className="w-full md:h-[80vh] flex flex-col items-center lg:items-end bg-[#FFFDF2]"
    >
      <div className="w-[93%] h-full text-[#043D12] grid grid-cols-1 md:grid-cols-2">
        {/* Animated Text Section */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false }}
          variants={animations.slideLeft}
          className="details flex flex-col md:gap-2 gap-4 max-sm:text-center md:py-12"
        >
          <h1 className="text-[#043D12] lg:text-[55px] lg:leading-[65px] text-[32px] w-fit h-fit lg:mt-8 max-sm:py-4 font-medium max-sm:bg-[url('/carbon-growth.svg')] bg-cover bg-center object-center">
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
            <motion.div variants={buttonVariant} whileHover="hover">
              <Link
                to="/business-profile"
                className="bg-[#043D12] rounded-[48px] text-white shadow-lg lg:text-[18px] text-[14px] md:px-8 px-4 py-3 md:py-4"
              >
                Create my Profile
              </Link>
            </motion.div>
            <motion.div variants={buttonVariant} whileHover="hover">
              <Link
                to="/subscribe"
                className="bg-[#043D12] rounded-[48px] text-white shadow-lg lg:text-[18px] text-[14px] md:px-8 px-4 py-3 md:py-4"
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
          className="visual h-full"
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
    </motion.div>
  );
};

export default HeroSection;
