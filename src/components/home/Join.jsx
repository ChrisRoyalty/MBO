import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import Lottie from "react-lottie";
import animation1Data from "../../assets/animation1.json"; // First JSON (SIGN UP)
import animation2Data from "../../assets/animation2.json"; // Second JSON (SUBSCRIBE)
import animation3Data from "../../assets/animation3.json"; // Third JSON (GROW)

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
  // Lottie options for each animation
  const animation1Options = {
    loop: true,
    autoplay: true,
    animationData: animation1Data,
    rendererSettings: { preserveAspectRatio: "xMidYMid slice" },
  };

  const animation2Options = {
    loop: true,
    autoplay: true,
    animationData: animation2Data,
    rendererSettings: { preserveAspectRatio: "xMidYMid slice" },
  };

  const animation3Options = {
    loop: true,
    autoplay: true,
    animationData: animation3Data,
    rendererSettings: { preserveAspectRatio: "xMidYMid slice" },
  };

  return (
    <motion.section
      initial="hidden"
      whileInView="visible"
      viewport={{ once: false }}
      variants={animations.fadeIn}
      className="w-full flex justify-center items-center bg-[#FAFEF4] py-18 overflow-hidden"
    >
      <div className="container mx-auto px-[5vw] flex flex-col gap-10 text-center  overflow-hidden">
        {/* Title Section */}
        <motion.h1
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false }}
          variants={animations.scaleUp}
          className="mt-12 lg:text-[40px] text-[32px] text-[#043D1266] font-semibold"
        >
          Join our growing network
        </motion.h1>

        {/* Cards Section */}
        <div className="w-full grid md:grid-cols-3 lg:gap-10 gap-24 overflow-hidden">
          {[
            {
              animation: (
                <Lottie
                  options={animation1Options}
                  height={182} // From JSON: h: 182
                  width={136} // From JSON: w: 136
                />
              ),
              title: <Link to="/create-account">SIGN UP</Link>,
              description:
                "Create your business profile in just a few minutes.",
              animationVariant: animations.slideLeft,
            },
            {
              animation: (
                <Lottie
                  options={animation2Options}
                  height={172} // From JSON: h: 172
                  width={193} // From JSON: w: 193
                />
              ),
              title: <Link to="/subscribe">SUBSCRIBE</Link>,
              description:
                "Choose a single annual plan for access and promotion.",
              animationVariant: animations.slideUp,
            },
            {
              animation: (
                <Lottie
                  options={animation3Options}
                  height={224} // From JSON: h: 224
                  width={224} // From JSON: w: 224
                />
              ),
              title: <Link to="/business-profile">GROW</Link>,
              description:
                "Share your profile, connect with customers, and track your growth.",
              animationVariant: animations.slideRight,
            },
          ].map((card, index) => (
            <motion.div
              key={index}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: false }}
              variants={card.animationVariant}
              className="flex flex-col items-center justify-center text-center gap-6 overflow-hidden"
            >
              {card.animation}
              <figcaption className="text-[24px] text-[#043D12]">
                <h5 className="font-bold">{card.title}</h5>
                <p className="text-[20px] lg:px-16 px-8 text-[#6A7368]">
                  {card.description}
                </p>
              </figcaption>
            </motion.div>
          ))}
        </div>

        {/* Call-to-Action Button */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false }}
          variants={animations.slideUp}
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
