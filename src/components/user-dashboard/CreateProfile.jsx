import React from "react";
import { IoIosNotificationsOutline } from "react-icons/io";
import { Link, Outlet, useLocation } from "react-router-dom";
import BusinessImg from "../../assets/businessImg.jpeg";
import { CiUser } from "react-icons/ci";
import { TbLayoutGrid } from "react-icons/tb";
import { BiSolidContact } from "react-icons/bi";
import { RiExchangeDollarFill, RiLockPasswordLine } from "react-icons/ri";
import { motion } from "framer-motion";

const CreateProfile = () => {
  const location = useLocation();

  const navItems = [
    { to: "/user-dashboard/profile", icon: <CiUser />, label: "About" },
    {
      to: "/user-dashboard/profile/products-and-services",
      icon: <TbLayoutGrid />,
      label: "Product & Services",
    },
    {
      to: "/user-dashboard/profile/contact-and-socials",
      icon: <BiSolidContact />,
      label: "Contact & Socials",
    },
    {
      to: "/user-dashboard/profile/subscription",
      icon: <RiExchangeDollarFill />,
      label: "Subscription",
    },
    {
      to: "/user-dashboard/profile/password",
      icon: <RiLockPasswordLine />,
      label: "Password",
    },
  ];

  return (
    <div>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="h-[10vh] p-8 text-[#6A7368] flex justify-between items-center w-full z-0 border">
          <strong className="lg:text-[16px] text-[12px] pl-4  xl:pl-6">
            Edit Profile
          </strong>
          <div className="flex items-center md:gap-4">
            <Link to="/">
              <IoIosNotificationsOutline className="text-[30px] text-[#6A7368]" />
            </Link>
            <Link to="/user-dashboard/profile">
              <figure className="flex items-center md:border-[1px] border-gray-300 rounded-[8px] p-2 gap-2">
                <img
                  src={BusinessImg}
                  alt="Business-img"
                  className="rounded-full w-[26px] h-[26px]"
                />
                <figcaption className="text-[#6A7368] max-md:hidden">
                  <h3 className="text-[10px]">Ukaegbu and Sons</h3>
                  <p className="text-[8px]">Clothing and Accessories</p>
                </figcaption>
              </figure>
            </Link>
          </div>
        </div>
      </motion.div>

      {/* Navigation & Content */}
      <div className="lg:w-full w-[90%] md:w-[80%] mx-auto mt-8 flex max-lg:flex-col justify-center lg:gap-20 lg:px-10">
        <nav className="md:w-[60%] lg:w-[40%] px-8 flex flex-col gap-4">
          {navItems.map(({ to, icon, label }) => (
            <motion.div
              key={to}
              whileHover={{ scale: 1.05 }}
              className="w-full"
            >
              <Link
                to={to}
                className={`text-[15px] flex items-center gap-4 px-6 py-2 rounded-[11px] transition-all duration-300 
                ${
                  location.pathname === to
                    ? "bg-[#043D12] text-white shadow-lg scale-105"
                    : "text-[#043D12] hover:bg-gray-200"
                }`}
              >
                <span className="text-[25px]">{icon}</span>
                {label}
              </Link>
            </motion.div>
          ))}
        </nav>
        <motion.main
          className="w-full h-[87vh] overflow-y-scroll pt-16"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Outlet />
        </motion.main>
      </div>
    </div>
  );
};

export default CreateProfile;
