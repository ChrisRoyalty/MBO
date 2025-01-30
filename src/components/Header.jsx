import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import MindPowerLogo from "../assets/mbo-logo.png";
import MenuIcon from "../assets/menu.svg";

const navItemVariants = {
  hidden: { opacity: 0, scale: 0.5, y: -20 },
  visible: (i) => ({
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { delay: i * 0.15, duration: 0.4, ease: "easeOut" },
  }),
};

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const navItems = [
    { name: "Home", path: "/" },
    { name: "Community", path: "/community" },
    {
      name: "Log In",
      path: "/login",
      className:
        "border-[1px] border-[#FFFFFF] rounded-[39px] lg:ml-8 px-8 py-2 hover:bg-white hover:text-[#02530c] active:bg-white active:text-[#02530c]",
    },
  ];

  return (
    <div className="w-full h-fit flex justify-center items-center bg-[#FFFDF2] py-[5vh] lg:py-[6vh]">
      <div className="w-[85%] h-[8vh] md:h-[10vh] bg-[#043D12] px-[20px] md:px-[50px] flex justify-between items-center rounded-[48px] md:shadow-lg">
        {/* Logo */}
        <Link to="/">
          <img
            src={MindPowerLogo}
            alt="Mind_Power_Logo"
            className="md:w-[47px] md:h-[55px] w-[33px] h-[39px]"
          />
        </Link>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{
                opacity: 1,
                scale: 1,
                transition: { duration: 0.4, ease: "easeOut" },
              }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="absolute top-[15vh] left-0 w-full bg-[#FFFDF2] flex flex-col items-center py-6 shadow-lg md:hidden rounded-b-[40px]"
            >
              <nav className="flex flex-col items-center gap-6 w-full">
                {navItems.map((item, index) => (
                  <motion.div
                    key={item.path}
                    variants={navItemVariants}
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                    custom={index}
                  >
                    <Link
                      to={item.path}
                      onClick={() => setIsOpen(false)}
                      className={`text-[20px] font-medium px-8 py-2 transition ${
                        location.pathname === item.path
                          ? "text-[#02530c] font-bold border-b-2 border-[#02530c]"
                          : "text-[#043D12] hover:text-[#02530c]"
                      } ${item.className || ""}`}
                    >
                      {item.name}
                    </Link>
                  </motion.div>
                ))}
              </nav>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Desktop Navigation */}
        <div className="hidden md:flex gap-8 items-center text-white">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`text-[20px] transition ${
                location.pathname === item.path
                  ? "text-white font-bold border-b-2 border-white"
                  : "hover:text-[21px]"
              } ${item.className || ""}`}
            >
              {item.name}
            </Link>
          ))}
        </div>

        {/* Hamburger Menu Button */}
        <button className="md:hidden" onClick={() => setIsOpen(!isOpen)}>
          <img src={MenuIcon} alt="Hamburger_Icon" className="w-8 h-8" />
        </button>
      </div>
    </div>
  );
};

export default Header;
