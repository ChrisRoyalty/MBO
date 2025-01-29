import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import DemoImg from "../../assets/demo.svg";
import VectorIcon1 from "../../assets/vector1.svg";
import VectorIcon2 from "../../assets/vector2.svg";
import VectorIcon3 from "../../assets/vector3.svg";

const fadeInVariants = {
  hidden: { opacity: 0, y: 50, scale: 0.8 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.8, ease: "easeOut" },
  },
};

const Benefits = () => {
  return (
    <div className="w-full flex justify-center items-center py-18 lg:bg-[#FFFFFF] bg-[#FAFEF4]">
      <motion.div
        className="w-[75%] flex flex-col gap-14 text-[#043D12]"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: false }}
      >
        <motion.h1
          className="lg:text-[40px] text-[32px] font-medium text-center"
          variants={fadeInVariants}
        >
          What’s in it for You?
        </motion.h1>

        {/** Sections **/}
        {[
          {
            id: "showcase",
            title: "Showcase Your Business",
            text: "Create a profile with all your essential details.",
            image: DemoImg,
            vector: VectorIcon1,
          },
          {
            id: "expand",
            title: "Expand Your Reach",
            text: "Promote your products and services to a wider audience.",
            image: DemoImg,
            vector: VectorIcon2,
          },
          {
            id: "engage",
            title: "Engage Customers Easily",
            text: "Communicate seamlessly via WhatsApp and social media links.",
            image: DemoImg,
            vector: VectorIcon3,
          },
          {
            id: "track",
            title: "Track Your Progress",
            text: "Access visitor analytics for better business insights.",
            image: DemoImg,
          },
        ].map(({ id, title, text, image, vector }, index) => (
          <motion.div
            key={id}
            className="w-full h-fit flex flex-col lg:gap-4 gap-16"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false }}
            variants={{
              hidden: { opacity: 0, x: index % 2 === 0 ? -100 : 100 },
              visible: {
                opacity: 1,
                x: 0,
                transition: {
                  duration: 0.8,
                  delay: index * 0.3,
                  ease: "easeOut",
                },
              },
            }}
          >
            <div className="flex max-lg:flex-col max-lg:text-center lg:justify-between items-center max-sm:gap-4">
              <motion.div
                className={index % 2 !== 0 ? "lg:order-2" : ""}
                variants={fadeInVariants}
              >
                <motion.h1
                  className="lg:text-[40px] text-[32px]"
                  variants={fadeInVariants}
                >
                  {title}
                </motion.h1>
                <motion.p
                  className="md:text-[20px] text-[18px] w-[80%] max-lg:m-auto"
                  variants={fadeInVariants}
                >
                  {text}
                </motion.p>
              </motion.div>
              <motion.img
                src={image}
                alt={`${id}_img`}
                className={index % 2 !== 0 ? "lg:order-1" : ""}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{
                  duration: 0.8,
                  delay: index * 0.3,
                  ease: "backOut",
                }}
              />
            </div>
            {vector && (
              <motion.div
                className="vectorImg w-full flex justify-center items-center"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.8,
                  delay: index * 0.4,
                  ease: "easeOut",
                }}
              >
                <motion.img
                  src={vector}
                  alt={`${id}_vector`}
                  className="max-md:w-[80%] max-sm:w-[60%] h-fit mx-auto"
                />
              </motion.div>
            )}
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default Benefits;
