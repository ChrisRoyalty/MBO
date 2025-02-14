import React from "react";
import { IoIosNotificationsOutline } from "react-icons/io";
import { Link } from "react-router-dom";
import BusinessImg from "../../assets/businessImg.jpeg";
import { CiUser } from "react-icons/ci";
import { TbLayoutGrid } from "react-icons/tb";
import { BiSolidContact } from "react-icons/bi";
import { RiExchangeDollarFill } from "react-icons/ri";
import { RiLockPasswordLine } from "react-icons/ri";
import { div } from "framer-motion/client";
import ProfileImg from "../../assets/DefaultProfileImg.svg";
import ProfileBg from "../../assets/DefaultProfileBg.svg";
import { FiEdit3 } from "react-icons/fi";
import { TiArrowForwardOutline } from "react-icons/ti";
import { HiOutlineMenuAlt1 } from "react-icons/hi";

const CreateProfile = () => {
  return (
    <div>
      <div className="w-full">
        {/* Header */}
        <div className="h-[12vh] p-8 text-[#6A7368] flex justify-between border w-full">
          <strong className="lg:text-[16px] text-[12px]">Edit Profile</strong>
          <div className="flex items-center gap-4">
            <Link to="/">
              <IoIosNotificationsOutline className="text-[30px] text-[#6A7368]" />
            </Link>
            <Link to="">
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
      </div>
      <div className="w-full mt-8 flex justify-center gap-8 px-10">
        <nav className="w-[40%] flex flex-col gap-4 border">
          <Link
            to="/user-dashboard"
            className="text-[15px] text-[#043D12] flex items-center gap-4 hover:rounded-[11px] hover:bg-gray-200 px-6 py-2"
          >
            <CiUser className="text-[25px]" />
            About
          </Link>
          <Link
            to="/community"
            className="text-[15px] text-[#043D12] flex items-center gap-4 hover:rounded-[11px] hover:bg-gray-200 px-6 py-2"
          >
            <TbLayoutGrid className="text-[25px]" />
            Product & Services
          </Link>
          <Link
            to="/user-dashboard/analytics"
            className="text-[15px] text-[#043D12] flex items-center gap-4 hover:rounded-[11px] hover:bg-gray-200 px-6 py-2"
          >
            <BiSolidContact className="text-[25px]" />
            Contact & Socials
          </Link>
          <Link
            to="/user-dashboard/analytics"
            className="text-[15px] text-[#043D12] flex items-center gap-4 hover:rounded-[11px] hover:bg-gray-200 px-6 py-2"
          >
            <RiExchangeDollarFill className="text-[25px]" />
            Subscription
          </Link>
          <Link
            to="/user-dashboard/analytics"
            className="text-[15px] text-[#043D12] flex items-center gap-4 hover:rounded-[11px] hover:bg-gray-200 px-6 py-2"
          >
            <RiLockPasswordLine className="text-[25px]" />
            Password
          </Link>
        </nav>
        <div className="relative w-full">
          <div className="bgImg relative">
            <img
              src={ProfileBg}
              alt="w-full Profile-background-photo h-[701px]"
            />
            <FiEdit3 className="absolute right-6 top-4 text-white text-[20px] cursor-pointer" />
          </div>
          <div className="flex flex-col gap-4 absolute lg-top-0 lg:top-40 px-4">
            <div className="w-full text-[#6A7368] flex justify-between items-center">
              <figure className="flex flex-col gap-4 items-center">
                <img
                  src={ProfileImg}
                  alt="Profile-photo"
                  className="w-[136px] h-[136px]"
                />
                <figcaption className="">
                  <h4 className="text-[16px]">Ukaegbu and Sons</h4>
                  <p className="text-[10px]">Clothing and Accessories</p>
                </figcaption>
              </figure>
              <button className="border rounded-[11px] text-[10px] px-7 hover:px- cursor-pointer hover:bg-[#043D12] hover:text-white py-3  shadow-lg">
                Change Image
              </button>
            </div>
            <form>
              <h2 className="text-[12px] border-b-[1px] border-[#6A7368] pb-1 w-fit px-2">
                Personal Information
              </h2>

              <div className="flex items-center gap-12 mt-4">
                <div className="flex flex-col gap-8">
                  <div className="text-[#6A7368] flex flex-col gap-2">
                    <label>First Name</label>
                    <div className="flex justify-between gap-4">
                      <input
                        type="text"
                        disabled
                        placeholder="Claire"
                        className="w-[250px] h-[46px] px-4 rounded-[11px] border-[1px] border-[#6A7368]"
                      />
                      <button className="rounded-[11px] text-[14px] px-4 cursor-pointer hover:bg-[#043D12] hover:text-white py-2  shadow-lg flex items-center justify-between gap-2 border-[1px] border-[#6A7368]">
                        <FiEdit3 className="text-[18px]" />
                        Edit
                      </button>
                    </div>
                  </div>

                  <div className="text-[#6A7368] flex flex-col gap-2">
                    <label>Last Name</label>
                    <div className="flex justify-between gap-4">
                      <input
                        type="text"
                        disabled
                        placeholder="Fidelis"
                        className="w-[250px] h-[46px] px-4 rounded-[11px] border-[1px] border-[#6A7368]"
                      />
                      <button className="rounded-[11px] text-[14px] px-4 cursor-pointer hover:bg-[#043D12] hover:text-white py-2  shadow-lg flex items-center justify-between gap-2 border-[1px] border-[#6A7368]">
                        <FiEdit3 className="text-[18px]" />
                        Edit
                      </button>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col gap-8">
                  <div className="account-details text-[#6A7368] border rounded-[11px] shadow w-full flex flex-col justify-center px-4 py-2 gap-8">
                    <div>
                      <TbLayoutGrid className="text-[30px]" />
                      <p className="text-[14px]">Account Created</p>
                    </div>
                    <p className="date text-[14px]">25th Mar, 2025</p>
                  </div>
                  <div className="flex justify-between gap-4">
                    <input
                      type="email"
                      disabled
                      placeholder="www.ukandsons.com"
                      className=" h-[46px] px-4 rounded-[11px] border-[1px] border-[#6A7368]"
                    />
                    <button className="rounded-[11px] text-[14px] px-6 cursor-pointer py-1  shadow-lg gap-2 border-[1px] border-[#6A7368]">
                      <TiArrowForwardOutline className="text-[22px]" />
                    </button>
                  </div>
                </div>
              </div>
              <div className="btns flex justify-end pt-20 pb-12">
                <div className="w-fit flex items-center gap-6">
                  <button className="border-[1px] border-[#6A7368] text-[#6A7368] rounded-[11px] text-[15px] hover:text-white px-8 py-3  shadow-lg hover:bg-[#043D12]">
                    Discard Changes
                  </button>
                  <button className="border-[1px] border-[#6A7368] text-[#6A7368] rounded-[11px] text-[15px] hover:text-white px-8 py-3  shadow-lg hover:bg-[#043D12]">
                    Save Changes
                  </button>
                </div>
              </div>
            </form>

            {/* Business information */}
            <form>
              <h2 className="text-[12px] border-b-[1px] border-[#6A7368] pb-1 w-fit px-2">
                Businesss Information
              </h2>

              <div className=" mt-4">
                <div className="flex flex-col gap-8">
                  <div className="text-[#6A7368] flex flex-col gap-2">
                    <label>Business Name</label>
                    <div className="flex justify-between gap-10">
                      <input
                        type="text"
                        disabled
                        placeholder="Claire"
                        className="w-full h-[46px] px-4 rounded-[11px] border-[1px] border-[#6A7368]"
                      />
                      <button className="rounded-[11px] text-[14px] px-4 cursor-pointer hover:bg-[#043D12] hover:text-white py-2  shadow-lg flex items-center justify-between gap-2 border-[1px] border-[#6A7368]">
                        <FiEdit3 className="text-[18px]" />
                        Edit
                      </button>
                    </div>
                  </div>

                  <div className="text-[#6A7368] flex flex-col gap-2">
                    <label>Category</label>
                    <div className="flex justify-between gap-10">
                      <input
                        type="text"
                        disabled
                        placeholder="Clothing and Accessories"
                        className="w-full h-[46px] px-4 rounded-[11px] border-[1px] border-[#6A7368]"
                      />
                      <button className="rounded-[11px] text-[14px] px-4 cursor-pointer hover:bg-[#043D12] hover:text-white py-2  shadow-lg flex items-center justify-between gap-2 border-[1px] border-[#6A7368]">
                        <FiEdit3 className="text-[18px]" />
                        Edit
                      </button>
                    </div>
                  </div>
                  <div className="text-[#6A7368] flex flex-col gap-2">
                    <label>Keywords</label>
                    <div className="flex justify-between gap-10">
                      <input
                        type="text"
                        disabled
                        placeholder="Rice, Beans, Garri, Yam, Palm Oil"
                        className="w-full h-[46px] px-4 rounded-[11px] border-[1px] border-[#6A7368]"
                      />
                      <button className="rounded-[11px] text-[14px] px-4 cursor-pointer hover:bg-[#043D12] hover:text-white py-2  shadow-lg flex items-center justify-between gap-2 border-[1px] border-[#6A7368]">
                        <FiEdit3 className="text-[18px]" />
                        Edit
                      </button>
                    </div>
                  </div>

                  <div className="text-[#6A7368] flex flex-col gap-2">
                    <label>Description</label>
                    <div className="flex justify-between gap-10">
                      <textarea
                        type="text"
                        disabled
                        placeholder="I’m passionate about people. I love to listen actively to people. I love to unravel all the tiny details that make them tick. I love diversity and culture and all the colors of equity. So, User Experience Design was love at first sight for me."
                        className="w-full px-4 py-4 h-[120px] rounded-[11px] border-[1px] border-[#6A7368]"
                      />
                      <button className="rounded-[11px] h-fit text-[14px] px-4 cursor-pointer hover:bg-[#043D12] hover:text-white py-3  shadow-lg flex items-center justify-between gap-2 border-[1px] border-[#6A7368]">
                        <FiEdit3 className="text-[18px]" />
                        Edit
                      </button>
                    </div>
                  </div>
                  <div className="text-[#6A7368] flex flex-col gap-2">
                    <label>Location</label>
                    <div className="flex justify-between gap-10">
                      <input
                        type="text"
                        disabled
                        placeholder="City,State eg. Aba, Abia State"
                        className="w-full h-[46px] px-4 rounded-[11px] border-[1px] border-[#6A7368]"
                      />
                      <button className="rounded-[11px] text-[14px] px-4 cursor-pointer hover:bg-[#043D12] hover:text-white py-2  shadow-lg flex items-center justify-between gap-2 border-[1px] border-[#6A7368]">
                        <FiEdit3 className="text-[18px]" />
                        Edit
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              <div className="btns flex justify-end pt-20 pb-12">
                <div className="w-fit flex items-center gap-6">
                  <button className="border-[1px] border-[#6A7368] text-[#6A7368] rounded-[11px] text-[15px] hover:text-white px-8 py-3  shadow-lg hover:bg-[#043D12]">
                    Discard Changes
                  </button>
                  <button className="border-[1px] border-[#6A7368] text-[#6A7368] rounded-[11px] text-[15px] hover:text-white px-8 py-3  shadow-lg hover:bg-[#043D12]">
                    Save Changes
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateProfile;
