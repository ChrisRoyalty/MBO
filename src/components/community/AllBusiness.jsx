import React from "react";
import { CiSearch } from "react-icons/ci";
import Pic01 from "../../assets/new05.svg";
import Pic02 from "../../assets/new08.svg";
import Pic03 from "../../assets/new04.svg";
import Pic04 from "../../assets/new03.svg";
import ProfilePic from "../../assets/profilepic.svg";
import { CiLocationOn } from "react-icons/ci";
import { FaWhatsapp } from "react-icons/fa";

import { Link } from "react-router-dom";
const AllBusiness = () => {
  return (
    <div className="w-full bg-[#FFFDF2] flex flex-col items-center">
      <div className="w-[80%]">
        <header className="h-[20vh] flex max-md:flex-col max-md:my-8 md:justify-between lg:items-center max-md:gap-6">
          {/* Search Section */}
          <h1 className="w-fit text-[#043D12] text-[32px] max-lg:text-[20px]">
            Explore all Businesses
          </h1>
          <div className="md:w-[50%] w-full bg-[#D6E2D98C] text-[16px] px-8 rounded-[39px] shadow-lg lg:h-[70px] h-[50px] text-[#043D12] flex gap-2 items-center justify-between">
            <input
              type="text"
              className="h-full outline-0 w-full"
              placeholder="Search Businesses or services"
            />
            <CiSearch className="text-[20px]" />
          </div>
        </header>
        <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1  gap-10 mb-12">
          {/* grid item */}
          <div className="relative border-[1px] border-[#6A7368] rounded-[14px] shadow-lg pt-4 pb-8 px-4">
            <div className="imgs grid grid-cols-4 gap-4 w-full">
              <img
                src={Pic01}
                alt="Business_Photo"
                className="  rounded-l-[8px]  bg-black/60"
              />
              <img src={Pic02} alt="Business_Photo" className="" />
              <img src={Pic03} alt="Business_Photo" className="" />
              <img
                src={Pic04}
                alt="Business_Photo"
                className="  rounded-r-[8px] bg-black/60"
              />
              <img
                src={ProfilePic}
                alt="profile_photo"
                className="absolute top-[35px] left-1/2 transform -translate-x-1/2 w-[70px]"
              />
            </div>
            <figure className=" flex flex-col gap-2 items-center mt-[45px] justify-center">
              <figcaption className="name text-center flex flex-col gap-4">
                <Link
                  to="/community/profile"
                  className="cursor-pointer text-[#043D12]"
                >
                  Claire Fidelis
                </Link>
                <p className="flex items-center gap-2 justify-center text-[#6A7368]">
                  <CiLocationOn />
                  Aba, Nigeria
                </p>

                <p className="text-[#043D12] border-[1px] border-[#6A7368] rounded-[4px] w-fit mx-auto px-4 py-2 text-[10px]">
                  Retail and E-commerce
                </p>
                <div className="details flex items-center justify-center">
                  <div className="followers px-4 border-r-[1px] border-[#6A736866]">
                    <h4 className="text-[12px] text-[#043D12] font-bold">30</h4>
                    <p className="text-[8px] text-[#6A7368]">Followers</p>
                  </div>
                  <div className="profile px-4">
                    <h4 className="text-[12px] text-[#043D12] font-bold">30</h4>
                    <p className="text-[8px] text-[#6A7368]">Followers</p>
                  </div>
                </div>
                <button className="w-fit text-[#043D12] border-[1px] border-[#6A7368] rounded-[20px] hover:bg-[#043D12] px-12 py-2 hover:text-white flex items-center gap-2">
                  <FaWhatsapp className="text-[20px]" />
                  Message
                </button>
              </figcaption>
            </figure>
          </div>
          {/* grid item */}
          <div className="w-full relative border-[1px] border-[#6A7368] rounded-[14px] shadow-lg pt-4 pb-8 px-4">
            <div className="imgs grid grid-cols-4 gap-4 w-full">
              <img
                src={Pic01}
                alt="Business_Photo"
                className="  rounded-l-[8px]  bg-black/60"
              />
              <img src={Pic02} alt="Business_Photo" className="" />
              <img src={Pic03} alt="Business_Photo" className="" />
              <img
                src={Pic04}
                alt="Business_Photo"
                className="  rounded-r-[8px] bg-black/60"
              />
              <img
                src={ProfilePic}
                alt="profile_photo"
                className="absolute top-[35px] left-1/2 transform -translate-x-1/2 w-[70px]"
              />
            </div>
            <figure className=" flex flex-col gap-2 items-center mt-[45px] justify-center">
              <figcaption className="name text-center flex flex-col gap-4">
                <Link
                  to="/community/profile"
                  className="cursor-pointer text-[#043D12]"
                >
                  Claire Fidelis
                </Link>
                <p className="flex items-center gap-2 justify-center text-[#6A7368]">
                  <CiLocationOn />
                  Aba, Nigeria
                </p>

                <p className="text-[#043D12] border-[1px] border-[#6A7368] rounded-[4px] w-fit mx-auto px-4 py-2 text-[10px]">
                  Retail and E-commerce
                </p>
                <div className="details flex items-center justify-center">
                  <div className="followers px-4 border-r-[1px] border-[#6A736866]">
                    <h4 className="text-[12px] text-[#043D12] font-bold">30</h4>
                    <p className="text-[8px] text-[#6A7368]">Followers</p>
                  </div>
                  <div className="profile px-4">
                    <h4 className="text-[12px] text-[#043D12] font-bold">30</h4>
                    <p className="text-[8px] text-[#6A7368]">Followers</p>
                  </div>
                </div>
                <button className="w-fit text-[#043D12] border-[1px] border-[#6A7368] rounded-[20px] hover:bg-[#043D12] px-12 py-2 hover:text-white flex items-center gap-2">
                  <FaWhatsapp className="text-[20px]" />
                  Message
                </button>
              </figcaption>
            </figure>
          </div>

          {/* grid item */}
          <div className="relative border-[1px] border-[#6A7368] rounded-[14px] shadow-lg pt-4 pb-8 px-4">
            <div className="imgs grid grid-cols-4 gap-4 w-full">
              <img
                src={Pic01}
                alt="Business_Photo"
                className="  rounded-l-[8px]  bg-black/60"
              />
              <img src={Pic02} alt="Business_Photo" className="" />
              <img src={Pic03} alt="Business_Photo" className="" />
              <img
                src={Pic04}
                alt="Business_Photo"
                className="  rounded-r-[8px] bg-black/60"
              />
              <img
                src={ProfilePic}
                alt="profile_photo"
                className="absolute top-[35px] left-1/2 transform -translate-x-1/2 w-[70px]"
              />
            </div>
            <figure className=" flex flex-col gap-2 items-center mt-[45px] justify-center">
              <figcaption className="name text-center flex flex-col gap-4">
                <Link
                  to="/community/profile"
                  className="cursor-pointer text-[#043D12]"
                >
                  Claire Fidelis
                </Link>
                <p className="flex items-center gap-2 justify-center text-[#6A7368]">
                  <CiLocationOn />
                  Aba, Nigeria
                </p>

                <p className="text-[#043D12] border-[1px] border-[#6A7368] rounded-[4px] w-fit mx-auto px-4 py-2 text-[10px]">
                  Retail and E-commerce
                </p>
                <div className="details flex items-center justify-center">
                  <div className="followers px-4 border-r-[1px] border-[#6A736866]">
                    <h4 className="text-[12px] text-[#043D12] font-bold">30</h4>
                    <p className="text-[8px] text-[#6A7368]">Followers</p>
                  </div>
                  <div className="profile px-4">
                    <h4 className="text-[12px] text-[#043D12] font-bold">30</h4>
                    <p className="text-[8px] text-[#6A7368]">Followers</p>
                  </div>
                </div>
                <button className="w-fit text-[#043D12] border-[1px] border-[#6A7368] rounded-[20px] hover:bg-[#043D12] px-12 py-2 hover:text-white flex items-center gap-2">
                  <FaWhatsapp className="text-[20px]" />
                  Message
                </button>
              </figcaption>
            </figure>
          </div>

          {/* grid item */}
          <div className="relative border-[1px] border-[#6A7368] rounded-[14px] shadow-lg pt-4 pb-8 px-4">
            <div className="imgs grid grid-cols-4 gap-4 w-full">
              <img
                src={Pic01}
                alt="Business_Photo"
                className="  rounded-l-[8px]  bg-black/60"
              />
              <img src={Pic02} alt="Business_Photo" className="" />
              <img src={Pic03} alt="Business_Photo" className="" />
              <img
                src={Pic04}
                alt="Business_Photo"
                className="  rounded-r-[8px] bg-black/60"
              />
              <img
                src={ProfilePic}
                alt="profile_photo"
                className="absolute top-[35px] left-1/2 transform -translate-x-1/2 w-[70px]"
              />
            </div>
            <figure className=" flex flex-col gap-2 items-center mt-[45px] justify-center">
              <figcaption className="name text-center flex flex-col gap-4">
                <Link
                  to="/community/profile"
                  className="cursor-pointer text-[#043D12]"
                >
                  Claire Fidelis
                </Link>
                <p className="flex items-center gap-2 justify-center text-[#6A7368]">
                  <CiLocationOn />
                  Aba, Nigeria
                </p>

                <p className="text-[#043D12] border-[1px] border-[#6A7368] rounded-[4px] w-fit mx-auto px-4 py-2 text-[10px]">
                  Retail and E-commerce
                </p>
                <div className="details flex items-center justify-center">
                  <div className="followers px-4 border-r-[1px] border-[#6A736866]">
                    <h4 className="text-[12px] text-[#043D12] font-bold">30</h4>
                    <p className="text-[8px] text-[#6A7368]">Followers</p>
                  </div>
                  <div className="profile px-4">
                    <h4 className="text-[12px] text-[#043D12] font-bold">30</h4>
                    <p className="text-[8px] text-[#6A7368]">Followers</p>
                  </div>
                </div>
                <button className="w-fit text-[#043D12] border-[1px] border-[#6A7368] rounded-[20px] hover:bg-[#043D12] px-12 py-2 hover:text-white flex items-center gap-2">
                  <FaWhatsapp className="text-[20px]" />
                  Message
                </button>
              </figcaption>
            </figure>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AllBusiness;
