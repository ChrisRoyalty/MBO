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
      className="bg-[#FAFEF4] w-full h-fit flex justify-center items-center text-[#043D12]"
    >
      <motion.div
        variants={fadeInUp}
        className="w-[85%] h-fit flex max-lg:flex-col justify-between py-8 gap-8"
      >
        <motion.div variants={fadeInUp} className="w-full flex flex-col gap-4">
          <Link path="/" className="logo">
            <img src={MindPowerLogo} alt="Mind-Power-Logo" className="w-32" />
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
        <motion.nav
          variants={fadeInUp}
          className="w-fit flex items-start gap-4 text-[16px] font-medium"
        >
          <Link className="hover:text-[17px]" to="/">
            Home
          </Link>
          <Link className="hover:text-[17px]" to="/community">
            Community
          </Link>
        </motion.nav>
        <motion.div
          variants={fadeInUp}
          className="w-full contact flex flex-col gap-4"
        >
          <h4 className="text-[16px] font-medium">Contact Info</h4>
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
          className="policies text-[14px] flex lg:justify-center items-start gap-2 w-full"
        >
          <Link to="privacy-policy">Privacy Policy</Link>
          <Link to="terms-of-service">Terms of service</Link>
        </motion.nav>
      </motion.div>
    </motion.div>
  );
};

export default Footer;
