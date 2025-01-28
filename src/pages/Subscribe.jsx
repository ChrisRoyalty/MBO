import React from "react";
import Good from "../components/svgs/Good";
import { TbCurrencyNaira } from "react-icons/tb";

const Subscribe = () => {
  return (
    <div className="bg-[#043D12] w-full h-[95vh] max-lg:py-16 lg:h-screen flex flex-col justify-center items-center">
      <div className="w-[90%] md:w-[70%] h-fit text-center flex flex-col gap-8">
        <h1 className="text-[#B4B3B3] lg:text-[30px] text-[20px] w-[90%] md:w-[60%] mx-auto">
          Stay Connected, Stay Promoted: <br className="max-lg:hidden" /> Your
          All-in-One Plan
        </h1>
        <div className="details w-full px-10 py-10 md:p-10 grid lg:grid-cols-2 grid-cols-1 bg-[#FFFDF2]">
          <div className="amount w-full h-fit max-lg:flex flex-col items-center lg:pt-24">
            <div className="">
              <div className="w-fit leading-[20px] max-lg:flex">
                <h1 className="lg:text-[50px] text-[45px] text-[#043D12] flex items-center gap-0 w-fit">
                  <TbCurrencyNaira />
                  15,000
                </h1>
                <span className="lg:text-[24px] text-[14px] text-[#043D12] float-start max-lg:flex items-end">
                  YEARLY
                </span>
              </div>
            </div>
          </div>
          <div className="w-full benefit flex flex-col gap-4 max-lg:items-center max-lg:justify-center max-md:mt-8">
            <div className="w-fit flex flex-col gap-4">
              <ul className="flex items-center gap-4">
                <li>
                  <Good />
                </li>
                <li className="md:text-[20px] text-[16px] text-[#676767]">
                  Active Business Profile
                </li>
              </ul>
              <ul className="flex items-center gap-4">
                <li>
                  <Good />
                </li>
                <li className="md:text-[20px] text-[16px] text-[#676767]">
                  Boosted Visibility{" "}
                </li>
              </ul>
              <ul className="flex items-center gap-4">
                <li>
                  <Good />
                </li>
                <li className="md:text-[20px] text-[16px] text-[#676767]">
                  Affordable and Flexible{" "}
                </li>
              </ul>
              <ul className="flex items-center gap-4">
                <li>
                  <Good />
                </li>
                <li className="md:text-[20px] text-[16px] text-[#676767]">
                  Networking Opportunities{" "}
                </li>
              </ul>
              <ul className="flex items-center gap-4">
                <li>
                  <Good />
                </li>
                <li className="md:text-[20px] text-[16px] text-[#676767]">
                  Enhanced Credibility{" "}
                </li>
              </ul>
              <div className="shadow-lg mt-8 register px-6 md:px-14 md:py-4 py-2 bg-[#043D12] rounded-[9px] text-[#FFFDF2] flex flex-col gap-2">
                <h4 className="md:text-[22px] text-[16px] font-medium">
                  REGISTER
                </h4>
                <p className="md:text-[16px] text-[12px] md:leading-8">
                  Secure Your Spot Today. Subscribe Now and{" "}
                  <br className="max-md:hidden" /> Watch Your Business Thrive!
                </p>
              </div>
            </div>
          </div>
        </div>
        <h1 className="text-[#B4B3B3] lg:text-[20px] text-[15px] w-[90%] md:w-[60%] mx-auto">
          Ready to take your business to the Next level? Subscribe today and
          start growing!
        </h1>
      </div>
    </div>
  );
};

export default Subscribe;
