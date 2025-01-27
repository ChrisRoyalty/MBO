import React, { useState } from "react";
import { Link } from "react-router";
import MindPowerLogo from "../assets/mbo-logo.png";
import MenuIcon from "../assets/menu.svg";

const Header = () => {
  const [toggleNav, setToggleNav] = useState("hidden");

  const handleNav = () => {
    setToggleNav((prevState) => (prevState === "hidden" ? "block" : "hidden"));
  };

  return (
    <div className="w-full h-fit pt-[7vh] pb-[5vh] flex justify-center items-center fixed z-50 bg-[#FFFDF2]">
      <div className="w-[90%] h-[10vh] bg-[#043D12] px-[50px] flex justify-between items-center rounded-[48px] shadow-lg">
        <div className="logo">
          <Link to="/" className="">
            <img
              src={MindPowerLogo}
              alt="Mind_Power_Logo"
              className="md:w-[47px] md:h-[55px] w-[33px] h-[39px]"
            />
          </Link>
        </div>
        <div
          className={`text-white md:static absolute top-[22vh] md:bg-transparent bg-[#FFFDF2] max-md:py-4 max-md:w-full left-0 flex max-md:flex-col gap-4 md:gap-16 items-center max-md:${toggleNav}`}
        >
          <nav className="flex max-md:flex-col max-md:w-[90%] max-md:m-auto md:gap-8 gap-4">
            <Link
              to="/"
              onClick={handleNav}
              className="text-[20px] hover:text-[21px] bg-[#043D12] w-full  max-md:border-[1px] max-md:border-white max-md:rounded-[39px] lg:w-fit h-fit max-md:px-8 max-md:py-2 max-md:hover:text-[21px]"
            >
              Home
            </Link>
            <Link
              to="/community"
              onClick={handleNav}
              className="text-[20px] hover:text-[21px] bg-[#043D12] w-full  max-md:border-[1px] max-md:border-white max-md:rounded-[39px] lg:w-fit h-fit max-md:px-8 max-md:py-2 max-md:hover:text-[21px]"
            >
              Community
            </Link>
          </nav>
          <div className="login flex max-md:flex-col max-md:w-[90%] max-md:m-auto">
            <Link
              to="/login"
              onClick={handleNav}
              className="text-[20px] border-[1px] border-white rounded-[39px] lg:w-fit h-fit px-8 py-2 hover:text-[21px] bg-[#043D12] w-full"
            >
              Log In
            </Link>
          </div>
        </div>
        <button className="menu md:hidden" onClick={handleNav}>
          <img
            src={MenuIcon}
            alt="Hamburger_Icon"
            className="max-md:px-4 max-md:rounded-[52px] max-md:bg-[#043D12]"
          />
        </button>
      </div>
    </div>
  );
};

export default Header;
