import React from "react";
import { BiMessage, BiUser } from "react-icons/bi";
import { CgPhotoscan } from "react-icons/cg";
import {
  MdArrowDropDown,
  MdEmail,
  MdOutlineArrowDropDown,
  MdOutlineEmail,
} from "react-icons/md";

const Help = () => {
  return (
    <div className="w-full bg-[#FFFDF2] py-[5vh]">
      <div className="container px-[5vw] mx-auto grid lg:grid-cols-2 grid-cols-1 gap-12">
        <div>
          <h1 className="lg:text-[50px] text-[32px] text-[#043D12]">
            We’re Here to Help
          </h1>
          <p className="text-[#6A7368] lg:text-[32px] text-[20px]">
            Have questions or feedback? Get in <br /> touch with us, and we’ll
            get back to you as soon as possible
          </p>
        </div>
        <div>
          <form className="text-[#6A7368] bg-[#043D120D] rounded-[46px] p-10 flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <label>Full Name</label>
              <div className="flex items-center justify-between h-[50px] border-[1px] border-[#6A7368] rounded-[20px] px-8">
                <input
                  type="text"
                  placeholder="Enter your full name "
                  className="w-full outline-0 border-0"
                />
                <BiUser />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label>Email</label>
              <div className="flex items-center justify-between h-[50px] border-[1px] border-[#6A7368] rounded-[20px] px-8">
                <input
                  type="email"
                  placeholder="deyplay@claire.com "
                  className="w-full outline-0 border-0"
                />
                <MdOutlineEmail />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label>Issue Type</label>
              <div className="flex items-center justify-between h-[50px] border-[1px] border-[#6A7368] rounded-[20px] px-8">
                <input
                  type="text"
                  placeholder="Complaint "
                  className="w-full outline-0 border-0"
                />
                <MdOutlineArrowDropDown />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label>Tell us about the issue</label>
              <div className="border-[1px] border-[#6A7368] rounded-[20px] px-8 py-1 h-[78px]">
                <textarea
                  name="description"
                  id="description"
                  placeholder="ssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssss"
                  className="w-full outline-0 border-0"
                ></textarea>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label>File Upload (Optional)</label>
              <div className="border-[1px] border-[#6A7368] rounded-[20px] px-8 py-2 h-[100px] flex flex-col items-center justify-center">
                <CgPhotoscan />
                <input type="file" placeholder="Upload a file" />
                <p>PNG or JPG (Max 5mb)</p>
              </div>
            </div>
            <button className="text-[16px] text-[#FFFDF2] bg-[#043D12] hover:bg-[#043D12]/75 rounded-[16px] h-[50px] mt-8">
              Send Message
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Help;
