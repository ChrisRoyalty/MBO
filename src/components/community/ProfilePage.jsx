import React, { useState } from "react";
import { CiSearch } from "react-icons/ci";
import { RiEqualizerLine } from "react-icons/ri";
import { MdOutlineCategory } from "react-icons/md";
import { RiArrowDropDownLine, RiArrowDropUpLine } from "react-icons/ri";
import {
  IoCallOutline,
  IoLocationOutline,
  IoLogoTiktok,
} from "react-icons/io5";
import NewBusinesses from "./NewBusinesses";
import { motion, AnimatePresence } from "framer-motion";
import ProfileImg from "../../assets/profilepic.svg";
import { Link } from "react-router-dom";
// Import business images
import Newbusiness01 from "../../assets/new01.svg";
import Newbusiness02 from "../../assets/new02.svg";
import Newbusiness03 from "../../assets/new03.svg";
import Newbusiness04 from "../../assets/new04.svg";
import Newbusiness05 from "../../assets/new05.svg";
import Newbusiness06 from "../../assets/new06.svg";
import Newbusiness07 from "../../assets/new07.svg";
import Newbusiness08 from "../../assets/new08.svg";
import { FaFacebook, FaWhatsapp } from "react-icons/fa6";
import {
  IoLogoFacebook,
  IoLogoInstagram,
  IoLogoLinkedin,
  IoLogoTwitter,
  IoLogoWhatsapp,
  IoLogoYoutube,
} from "react-icons/io";
import { CiShare1 } from "react-icons/ci";
import { BiMessage } from "react-icons/bi";

const businesses = [
  {
    id: 1,
    img: Newbusiness01,
    name: "Oversized Blazers",
    category: "Clothing and Accessories",
  },
  { id: 2, img: Newbusiness02, name: "Casual Sneakers", category: "Footwear" },
  {
    id: 3,
    img: Newbusiness03,
    name: "Handmade Jewelry",
    category: "Accessories",
  },
  {
    id: 4,
    img: Newbusiness04,
    name: "Vintage Sunglasses",
    category: "Eyewear",
  },
  { id: 5, img: Newbusiness05, name: "Eco-friendly Bags", category: "Bags" },
  { id: 6, img: Newbusiness06, name: "Smart Watches", category: "Wearables" },
  {
    id: 7,
    img: Newbusiness07,
    name: "Athleisure Hoodies",
    category: "Sportswear",
  },
  {
    id: 8,
    img: Newbusiness08,
    name: "Minimalist Wallets",
    category: "Accessories",
  },
];

// Modal Component
const Modal = ({ business, onClose }) => {
  if (!business) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black/75 bg-opacity-50 flex justify-center items-center z-50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="bg-white px-8 py-10 rounded-lg shadow-lg w-[90%] md:w-[60%] flex flex-col md:flex-row gap-6 items-center"
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          exit={{ scale: 0.8 }}
          onClick={(e) => e.stopPropagation()} // Prevent closing on click inside
        >
          {/* Business Image */}
          <motion.img
            src={business.img}
            alt={business.name}
            className="w-full rounded-lg"
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
          />

          {/* Business Details */}
          <motion.div
            className="flex flex-col gap-4"
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-xl font-bold text-[#043D12]">
              {business.name}
            </h2>
            <p className="text-sm text-gray-600">{business.category}</p>
            <p className="text-gray-700">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus
              lacinia odio vitae vestibulum.
            </p>

            <div className="btns flex">
              <div className="w-fit flex items-center gap-6">
                <Link
                  to="/"
                  className="border-[1px] border-[#6A7368] text-[#6A7368] rounded-[11px] text-[15px] hover:text-white px-2 lg:px-8 py-2  shadow-lg hover:bg-[#043D12]"
                >
                  View Profile{" "}
                </Link>
                <Link
                  to="/"
                  className="border-[1px] border-[#6A7368] text-[#6A7368] rounded-[11px] text-[15px] hover:text-white px-2 lg:px-8 py-2  shadow-lg hover:bg-[#043D12]"
                >
                  Contact Us{" "}
                </Link>
              </div>
            </div>

            <button
              onClick={onClose}
              className="mt-4 border-[1px] border-red-600 text-red-600 font-bold rounded-lg shadow-md py-2"
            >
              Close
            </button>
          </motion.div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
const ProfilePage = () => {
  const [selectedBusiness, setSelectedBusiness] = useState(null);

  // State to manage visibility of each dropdown
  const [categoryOpen, setCategoryOpen] = useState(false);
  const [locationOpen, setLocationOpen] = useState(false);
  const [visibilityOpen, setVisibilityOpen] = useState(false);

  // Toggle dropdowns and close others when one is opened
  const toggleCategory = () => {
    setCategoryOpen(!categoryOpen);
    setLocationOpen(false); // Close location dropdown
    setVisibilityOpen(false); // Close visibility dropdown
  };

  const toggleLocation = () => {
    setLocationOpen(!locationOpen);
    setCategoryOpen(false); // Close category dropdown
    setVisibilityOpen(false); // Close visibility dropdown
  };

  const toggleVisibility = () => {
    setVisibilityOpen(!visibilityOpen);
    setCategoryOpen(false); // Close category dropdown
    setLocationOpen(false); // Close location dropdown
  };

  return (
    <div className="w-full h-fit bg-[#FFFDF2] flex flex-col items-center pt-[12vh]">
      <div className="w-[80%]">
        <div className="w-full  text-[#043D12] flex max-sm:flex-col overflow-y-scroll">
          {/* Sidebar for Filters */}
          <aside className=" sm:w-[25%] h-full overflow-y-auto flex flex-col gap-8 text-[#6A7368]">
            <h3 className="lg:text-[32px] text-[#043D12] max-sm:text-center">
              Claire Fidelis
            </h3>
            <div className="contact flex flex-col gap-8 ">
              <ul className="flex flex-col gap-4 ">
                <li className="text-[13px] flex items-center gap-2 max-md:justify-center">
                  <MdOutlineCategory /> Clothing and Accessories
                </li>
                <li className="text-[13px] flex items-center gap-2 max-md:justify-center">
                  <IoCallOutline /> 09078909876
                </li>
                <li className="text-[13px] flex items-center gap-2 max-md:justify-center">
                  <IoLocationOutline /> Aba, Nigeria
                </li>
              </ul>
              <button className="flex items-center justify-center gap-2 border-[1px] border-[#043D12] hover:bg-[#043D12] hover:text-white rounded-[28px] px-12 py-2 shadow">
                <FaWhatsapp />
                Message
              </button>
              <ul className="views text-[14px] flex justify-between items-center">
                <li className="">Profile Views</li>
                <li>30</li>
              </ul>
              <div className="web-share">
                <p className="text-[12px] text-[#043D12] font-medium px-2 py-1 w-fit">
                  ON THE WEB
                </p>
                <div className="content border-[1px] border-[#6A7368] rounded-[11px]    ">
                  {/* Instagram */}

                  <div className="flex justify-between items-center text-[14px] py-2 px-8 border-b-[1px] border-[#6A7368]">
                    <div className="flex items-center gap-4">
                      <IoLogoInstagram className="text-[25px]" />
                      Instagram
                    </div>
                    <CiShare1 className="cursor-pointer text-[18px]" />
                  </div>
                  {/* Twitter */}
                  <div className="flex justify-between items-center text-[14px] py-2 px-8 border-b-[1px] border-[#6A7368]">
                    <div className="flex items-center gap-4">
                      <IoLogoTwitter className="text-[25px]" />
                      Twitter
                    </div>
                    <CiShare1 className="cursor-pointer text-[18px]" />
                  </div>
                  {/* facebook */}
                  <div className="flex justify-between items-center text-[14px] py-2 px-8 border-b-[1px] border-[#6A7368]">
                    <div className="flex items-center gap-4">
                      <FaFacebook className="curso-pointer text-[18px]" />
                      Facebook
                    </div>
                    <CiShare1 className="cursor-pointer text-[18px]" />
                  </div>

                  {/* LinkedIn */}
                  <div className="flex justify-between items-center text-[14px] py-2 px-8 border-b-[1px] border-[#6A7368]">
                    <div className="flex items-center gap-4">
                      <IoLogoLinkedin className="text-[25px]" />
                      LinkedIn
                    </div>
                    <CiShare1 className="cursor-pointer text-[18px]" />
                  </div>

                  {/* Youtube */}
                  <div className="flex justify-between items-center text-[14px] py-2 px-8 ">
                    <div className="flex items-center gap-4">
                      <IoLogoYoutube className="text-[25px]" />
                      Youtube
                    </div>
                    <CiShare1 className="cursor-pointer text-[18px]" />
                  </div>
                </div>
              </div>
              <div className="description flex flex-col gap-2">
                <h5 className="text-[10px] text-[#6A7368]">
                  BUSINESS DESCRIPTION
                </h5>
                <p className="text-[13px]">
                  I’m passionate about people. I love to listen actively to
                  people. I love to unravel all the tiny details that make them
                  tick. I love diversity and culture and all the colors of
                  equity. So, User Experience Design was love at first sight for
                  me.
                </p>
              </div>
              <div className="keywords flex flex-col gap-2">
                <h5 className="text-[10px] text-[#6A7368]">KEYWORDS </h5>
                <p className="text-[13px]">
                  Rice, Pancake, Palmkernel, Egusi, Ishuazu
                </p>
              </div>

              <div className="flex flex-col gap-4 pb-4">
                <p className="text-[12px] text-[#043D12] font-medium px-2 py-1 w-fit">
                  CONTACT
                </p>
                <div className="content border-[1px] border-[#6A7368] rounded-[11px]    ">
                  {/* Phone */}

                  <div className="flex justify-between items-center text-[14px] py-2 px-8 border-b-[1px] border-[#6A7368]">
                    <div className="flex items-center gap-4">Phone</div>
                    <IoCallOutline className="cursor-pointer text-[18px]" />
                  </div>
                  {/* Email */}
                  <div className="flex justify-between items-center text-[14px] py-2 px-8 border-b-[1px] border-[#6A7368]">
                    <div className="flex items-center gap-4">Email</div>
                    <BiMessage className="cursor-pointer text-[18px]" />
                  </div>

                  {/* Whatsapp */}
                  <div className="flex justify-between items-center text-[14px] py-2 px-8 ">
                    <div className="flex items-center gap-4">Whatsapp</div>
                    <IoLogoWhatsapp className="cursor-pointer text-[18px]" />
                  </div>
                </div>
                <div className="membership flex flex-col gap-2">
                  <h5 className="text-[10px] text-[#6A7368]">
                    Member Since: December 13, 2024{" "}
                  </h5>
                  <p className="text-[13px]">Report </p>
                </div>
              </div>
            </div>
          </aside>

          {/*Products Section */}
          <div className="sm:w-[75%] h-full overflow-y-auto">
            <div className="w-full h-fit py-16 flex justify-center bg-[#FFFDF2]">
              <div className="w-[85%] h-fit flex flex-col gap-8">
                <h1 className=" border-b-[1px]  border-[#6A7368] text-[20px] text-[#6A7368] pb-1">
                  Products/Services
                </h1>
                <div className="w-full grid lg:grid-cols-3 grid-cols-2 max-[280px]:grid-cols-1 gap-4">
                  {businesses.map((business, index) => (
                    <motion.div
                      key={business.id}
                      className="flex flex-col gap-1 cursor-pointer"
                      initial={{ opacity: 0, y: 50 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: false }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      onClick={() => setSelectedBusiness(business)}
                    >
                      <figure>
                        <img
                          src={business.img}
                          alt="Product_img"
                          className="rounded-lg"
                        />
                        <figcaption className="flex flex-col gap-4 text-[#043D12] py-2">
                          <div className="flex flex-col gap-1">
                            <b className="lg:text-[15px] text-[10px]">
                              {business.name}
                            </b>
                            <p className="text-[8px]">{business.category}</p>
                          </div>
                        </figcaption>
                      </figure>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Modal for Selected Business */}
              <Modal
                business={selectedBusiness}
                onClose={() => setSelectedBusiness(null)}
              />
            </div>{" "}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
