import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import SignupIcon from "../../assets/signup-icon.svg";
import SubscribeIcon from "../../assets/subscriber.svg";
import GrowIcon from "../../assets/grow.svg";

const animations = {
  scaleUp: {
    hidden: { scale: 0.8, opacity: 0 },
    visible: { scale: 1, opacity: 1, transition: { duration: 0.5 } },
  },
  fadeIn: {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 1 } },
  },
  slideUp: {
    hidden: { y: 50, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.5 } },
  },
  slideLeft: {
    hidden: { x: -50, opacity: 0 },
    visible: { x: 0, opacity: 1, transition: { duration: 0.5 } },
  },
  slideRight: {
    hidden: { x: 50, opacity: 0 },
    visible: { x: 0, opacity: 1, transition: { duration: 0.5 } },
  },
  buttonHover: {
    hover: { scale: 1.1, transition: { type: "spring", stiffness: 300 } },
  },
};

const Join = () => {
  return (
    <motion.section
      whileInView="visible"
      viewport={{ once: false }}
      variants={animations.fadeIn}
      className="w-full flex justify-center items-center bg-[#FAFEF4] py-18 overflow-hidden"
    >
      <div className="w-[85%] flex flex-col gap-10 text-center mx-auto overflow-hidden">
        {/* Title Section */}
        <motion.h1
          initial="hidden"
          whileInView="visible"
          variants={animations.scaleUp}
          viewport={{ once: false }}
          className="mt-12 lg:text-[40px] text-[32px] text-[#043D1266] font-semibold"
        >
          Join our growing network
        </motion.h1>

        {/* Cards Section */}
        <div className="w-full grid md:grid-cols-3 lg:gap-10 gap-24 overflow-hidden">
          {[
            {
              img: SignupIcon,
              title: "SIGN UP",
              description:
                "Create your business profile in just a few minutes.",
              animation: animations.slideLeft,
            },
            {
              img: SubscribeIcon,
              title: "Subscribe",
              description:
                "Choose a single annual plan for access and promotion.",
              animation: animations.slideUp,
            },
            {
              img: GrowIcon,
              title: "GROW",
              description:
                "Share your profile, connect with customers, and track your growth.",
              animation: animations.slideRight,
            },
          ].map((card, index) => (
            <motion.div
              key={index}
              initial="hidden"
              whileInView="visible"
              variants={card.animation}
              viewport={{ once: false }}
              className="flex flex-col items-center justify-center text-center gap-6 overflow-hidden"
            >
              <img
                src={card.img}
                alt={`${card.title}_Img`}
                className="h-[250px] w-auto object-contain"
              />
              <figcaption className="text-[24px] text-[#043D12]">
                <h5 className="font-bold">{card.title}</h5>
                <p className="text-[20px] lg:px-16 px-8">{card.description}</p>
              </figcaption>
            </motion.div>
          ))}
        </div>

        {/* Call-to-Action Button */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          variants={animations.slideUp}
          viewport={{ once: false }}
          className="mt-12 overflow-hidden"
        >
          <motion.div variants={animations.buttonHover} whileHover="hover">
            <Link
              to="/create-account"
              className="border bg-transparent text-[#043D12] border-[#043D12] rounded-[48px] shadow-lg lg:text-[18px] text-[16px] px-8 py-4 hover:bg-[#043D12] hover:text-white transition duration-300"
            >
              Explore Businesses
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </motion.section>
  );
};

export default Join;
