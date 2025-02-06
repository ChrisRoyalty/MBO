import React from "react";
import { Link } from "react-router-dom"; // Fixed import
import { motion } from "framer-motion";

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

const AddBusiness = () => {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: false }}
      variants={animations.scaleUp}
      className="w-full h-[50vh] flex justify-center items-center bg-[#043D12]"
    >
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: false }}
        variants={animations.fadeIn}
        className="w-[90%] h-fit flex flex-col gap-10 text-[#FFFDF2] text-center lg:leading-6"
      >
        <motion.h1
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false }}
          variants={animations.fadeIn}
          className="lg:text-[40px] text-[30px]"
        >
          Don't see your business here?
        </motion.h1>
        <motion.p
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false }}
          variants={animations.fadeIn}
          className="lg:text-[20px] text-[18px] w-[60%] mx-auto leading-9"
        >
          Stand out and connect with potential customers today. Create your
          profile and let the world discover you!
        </motion.p>
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false }}
          variants={animations.rotate}
          className="w-fit h-fit mx-auto"
        >
          <motion.a
            variants={animations.buttonHover}
            whileHover="hover"
            whileTap="tap"
            href="/create-account"
            className="bg-[#FFFDF2] text-[#043D12] rounded-[48px] shadow-lg lg:text-[18px] text-[14px] md:px-8 px-4 py-3 md:py-4 w-fit mx-auto font-medium"
          >
            Add Your Business
          </motion.a>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default AddBusiness;
