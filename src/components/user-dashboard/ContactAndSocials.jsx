import React from "react";
import { IoLogoFacebook } from "react-icons/io5";
import { FiEdit3 } from "react-icons/fi";

const ContactAndSocials = () => {
  return (
    <div className=" w-full text-[#6A7368] flex flex-col gap-10">
      <h2 className="text-[16px] text-[#043D12] font-medium border-b-[1px] border-[#6A7368] px-2 py-1 w-fit">
        Contact & Socials{" "}
      </h2>
      <div className="socials flex flex-col gap-6">
        <p className="text-[12px] text-[#043D12] font-medium border-b-[1px] border-[#6A7368] px-2 py-1 w-fit">
          ON THE WEB
        </p>
        <div className="flex flex-col gap-16">
          <div className="content border-[1px] border-[#6A7368] rounded-[11px]    ">
            {/* facebook */}
            <div className="flex justify-between py-6 px-8 border-b-[1px] border-[#6A7368]">
              <div className="flex items-center gap-4">
                <IoLogoFacebook className="text-[25px]" />
                Facebook
              </div>
              <button className="text-[14px] border-[1px] rounded-[11px] shadow px-4 py-2 flex items-center gap-2 border-[#6A7368] hover:bg-[#043D12] hover:text-white">
                Add username
              </button>
            </div>

            {/* Instagram */}

            <div className="flex justify-between py-6 px-8 border-b-[1px] border-[#6A7368]">
              <div className="flex items-center gap-4">
                <IoLogoFacebook className="text-[25px]" />
                Instagram
              </div>
              <button className="text-[14px] border-[1px] rounded-[11px] shadow px-4 py-2 flex items-center gap-2 border-[#6A7368] hover:bg-[#043D12] hover:text-white">
                Add username
              </button>
            </div>

            {/* Twitter */}
            <div className="flex justify-between py-6 px-8 border-b-[1px] border-[#6A7368]">
              <div className="flex items-center gap-4">
                <IoLogoFacebook className="text-[25px]" />
                Twitter
              </div>
              <button className="text-[14px] border-[1px] rounded-[11px] shadow px-4 py-2 flex items-center gap-2 border-[#6A7368] hover:bg-[#043D12] hover:text-white">
                Add username
              </button>
            </div>

            {/* Tiktok */}
            <div className="flex justify-between py-6 px-8 border-b-[1px] border-[#6A7368]">
              <div className="flex items-center gap-4">
                <IoLogoFacebook className="text-[25px]" />
                TikTok
              </div>
              <button className="text-[14px] border-[1px] rounded-[11px] shadow px-4 py-2 flex items-center gap-2 border-[#6A7368] hover:bg-[#043D12] hover:text-white">
                Add username
              </button>
            </div>
            {/* LinkedIn */}
            <div className="flex justify-between py-6 px-8">
              <div className="flex items-center gap-4">
                <IoLogoFacebook className="text-[25px]" />
                LinkedIn
              </div>
              <button className="text-[14px] border-[1px] rounded-[11px] shadow px-4 py-2 flex items-center gap-2 border-[#6A7368] hover:bg-[#043D12] hover:text-white">
                Add username
              </button>
            </div>
          </div>
          {/* Contact*/}
          <form>
            <h2 className="text-[#043D12] font-medium text-[12px] border-b-[1px] border-[#6A7368] pb-1 w-fit px-2">
              CONTACT
            </h2>

            <div className=" mt-4">
              <div className="flex flex-col gap-8">
                <div className="text-[#6A7368] flex flex-col gap-2">
                  <label>Whatsapp Number</label>
                  <div className="flex justify-between gap-8 md:gap-16">
                    <input
                      type="number"
                      disabled
                      placeholder="08032433604"
                      className="w-full h-[46px] px-4 rounded-[11px] border-[1px] border-[#6A7368]"
                    />
                    <button className="rounded-[11px] text-[14px] px-4 cursor-pointer hover:bg-[#043D12] hover:text-white py-2  shadow-lg flex items-center justify-between gap-2 border-[1px] border-[#6A7368]">
                      <FiEdit3 className="text-[18px]" />
                      Edit
                    </button>
                  </div>
                </div>

                <div className="text-[#6A7368] flex flex-col gap-2">
                  <label>Alternative Phone Number</label>
                  <div className="flex justify-between gap-8 md:gap-16">
                    <input
                      type="number"
                      disabled
                      placeholder="08080999467"
                      className="w-full h-[46px] px-4 rounded-[11px] border-[1px] border-[#6A7368]"
                    />
                    <button className="rounded-[11px] text-[14px] px-4 cursor-pointer hover:bg-[#043D12] hover:text-white py-2  shadow-lg flex items-center justify-between gap-2 border-[1px] border-[#6A7368]">
                      <FiEdit3 className="text-[18px]" />
                      Edit
                    </button>
                  </div>
                </div>
                <div className="text-[#6A7368] flex flex-col gap-2">
                  <label>Email Address</label>
                  <div className="flex justify-between gap-8 md:gap-16">
                    <input
                      type="email"
                      disabled
                      placeholder="Fidelis@gmail.com"
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
                <button className="border-[1px] border-[#6A7368] text-[#6A7368] rounded-[11px] text-[15px] hover:text-white px-2 lg:px-8 py-3  shadow-lg hover:bg-[#043D12]">
                  Discard Changes
                </button>
                <button className="border-[1px] border-[#6A7368] text-[#6A7368] rounded-[11px] text-[15px] hover:text-white px-2 lg:px-8 py-3  shadow-lg hover:bg-[#043D12]">
                  Save Changes
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ContactAndSocials;
