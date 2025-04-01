import React from "react";
import { CiFacebook } from "react-icons/ci";
import { FaXTwitter } from "react-icons/fa6";
import { FaWhatsapp } from "react-icons/fa";
import { CiInstagram } from "react-icons/ci";
import { motion } from "framer-motion";
import MindPowerLogo from "../assets/mindpower-logo.svg";
import { Link } from "react-router";

const fadeInUp = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, staggerChildren: 0.2 },
  },
};

const Footer = () => {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: false }}
      className="bg-[#FAFEF4] w-full h-fit flex flex-col justify-center items-center text-[#043D12]"
    >
      <motion.div
        variants={fadeInUp}
        className="container mx-auto px-[5vw] h-fit flex max-lg:flex-col max-lg:text-center justify-between py-8 gap-8"
      >
        <motion.div
          variants={fadeInUp}
          className="w-full flex flex-col gap-4 max-lg:items-center"
        >
          <Link path="/" className="logo">
            <img src={MindPowerLogo} alt="Mind-Power-Logo" className=" h-16" />
          </Link>
          <p className="text-[16px] text-[#043D12]">
            Your business deserves a platform designed for growth. Join a
            community where every connection is an opportunity.
          </p>
          <div className="socials flex items-center gap-2">
            {[CiFacebook, FaXTwitter, FaWhatsapp, CiInstagram].map(
              (Icon, index) => (
                <motion.a
                  key={index}
                  variants={fadeInUp}
                  href="#"
                  className="text-[#043D12] text-[28px] hover:scale-110 transition-transform"
                >
                  <Icon />
                </motion.a>
              )
            )}
          </div>
        </motion.div>

        <motion.div
          variants={fadeInUp}
          className="w-full contact flex flex-col gap-4 max-lg:items-center"
        >
          <h4 className="text-[17px] font-bold">Contact Info</h4>
          <p className="text-[14px]">
            <strong>Address:</strong> 3 CONVENANT CLOSE BEHIND RUFUS OBI
            CHEMIST, ALONG ABA-OWERRI ROAD, Aba 450272
          </p>
          <ul className="flex items-center gap-1">
            <li className="font-bold">Customer Support:</li>
            <li> 09078987890</li>
          </ul>
          <ul className="flex items-center gap-1">
            <li className="font-bold">Email:</li>
            <li> mbo@gmail.com</li>
          </ul>
        </motion.div>
        <motion.nav
          variants={fadeInUp}
          className="policies text-[14px] flex flex-col gap-2 w-full items-center"
        >
          <div className="flex flex-col gap-6">
            <Link className="hover:text-[17px]" to="/">
              Home
            </Link>
            <Link className="hover:text-[17px]" to="/community">
              Community
            </Link>
            <Link to="/privacy-policy" className="hover:text-[17px]">
              Privacy Policy
            </Link>
            <Link to="/terms-of-service" className="hover:text-[17px]">
              Terms of service
            </Link>
            <Link to="/help-and-support" className="hover:text-[17px]">
              Help & Support
            </Link>
          </div>
        </motion.nav>
      </motion.div>
      <motion.div
        variants={fadeInUp}
        className="h-[10vh] policies text-[14px] flex flex-col gap-2 w-full items-center justify-center border-t-[1px] border-[#043D12]"
      >
        <p className="text-[#043D12]">
          © 2025 Mind Power Aba. All rights reserved.
        </p>
      </motion.div>
    </motion.div>
  );
};

export default Footer;
