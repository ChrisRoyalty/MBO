import React from "react";
import { ImNotification } from "react-icons/im";

const Subscription = () => {
  return (
    <div className=" w-full text-[#6A7368] flex flex-col gap-10">
      <h2 className="text-[16px] text-[#043D12] font-medium border-b-[1px] border-[#6A7368] px-2 py-1 w-fit">
        Manage Subscription{" "}
      </h2>
      <div className="subscription-board">
        <div className="bg-[#043D121A] flex items-center px-8 h-[30vh]">
          <p className="text-[#043D12] text-[20px]">Your Current Plan</p>
        </div>
        <div className="w-full bg-[#043D12] grid md:grid-cols-2 px-8 py-8 text-[#FFFDF2] max-lg:gap-6">
          <ul className="list-disc pl-5">
            <li>Access to all services</li>
            <li>Unlimited usage</li>
            <li>Cancel Anytime</li>
          </ul>
          <div className="w-full flex items-center justify-center">
            <button className="max-lg:w-full flex items-center max-lg:justify-center text-[14px] text-[#FFFDF2] rounded-[11px] shadow px-2 sm:px-4 py-4  gap-2 bg-[#6A736899]">
              <ImNotification className="text-[20px]" />
              Next billing date: 14 Jan 2025.{" "}
            </button>
          </div>
        </div>
      </div>
      <div className="btns flex justify-start lg:pt-6 pb-12">
        <div className="w-fit flex items-center gap-6">
          <button className="border-[1px] border-[#6A7368] text-[#6A7368] rounded-[11px] text-[15px] hover:text-white px-2 lg:px-8 py-3  shadow-lg hover:bg-[#043D12]">
            Change Plan
          </button>
          <button className="border-[1px] border-[#6A7368] text-[#6A7368] rounded-[11px] text-[15px] hover:text-white px-2 lg:px-8 py-3  shadow-lg hover:bg-[#043D12]">
            Cancel Subscription{" "}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Subscription;
