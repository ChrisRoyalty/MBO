import React from "react";
import { Link } from "react-router";

const Start = () => {
  return (
    <div className="w-full h-[40vh] flex justify-center items-center bg-[#043D12] ">
      <div className="w-[90%] h-fit flex flex-col gap-10 text-[#FFFDF2] text-center">
        <h1 className="lg:text-[40px] text-[30px]">
          Don’t Hesitate, Get Started Now!
        </h1>
        <Link
          to="/create-account"
          className="bg-[#FFFDF2] text-[#043D12] rounded-[48px] shadow-lg lg:text-[18px] text-[14px] md:px-8 px-4 py-3 md:py-4 w-fit mx-auto font-medium"
        >
          Create my Profile
        </Link>
      </div>
    </div>
  );
};

export default Start;
