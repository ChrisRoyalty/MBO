import React from "react";
import SignupIcon from "../../assets/signup-icon.svg";
import SubscribeIcon from "../../assets/subscriber.svg";
import GrowIcon from "../../assets/grow.svg";
import { Link } from "react-router";

const Join = () => {
  return (
    <div className="w-full flex justify-center items-center bg-[#FAFEF4] py-18">
      <div className="w-[90%] flex flex-col gap-10 text-center">
        <h1 className="lg:text-[40px] text-[32px] text-[#043D1266]">
          Join our growing network
        </h1>
        <div className="w-full grid md:grid-cols-3 lg:gap-10 gap-24">
          <figure className="flex flex-col items-center justify-center text-center gap-10">
            <img
              src={SignupIcon}
              alt="Signup_Img"
              className="h-[250px] w-fit"
            />
            <figcaption className="text-[24px] text-[#043D12]">
              <h5 className="font-bold">SIGN UP</h5>
              <p className="text-[20px] lg:px-16 px-8">
                Create your business profile in just a few minutes.
              </p>
            </figcaption>
          </figure>
          <figure className="flex flex-col items-center justify-center text-center gap-10">
            <img
              src={SubscribeIcon}
              alt="Subscribe_Img"
              className="h-[250px] w-fit"
            />
            <figcaption className="text-[24px] text-[#043D12]">
              <h5 className="font-bold">Subscribe</h5>
              <p className="text-[20px] lg:px-16 px-8">
                Choose a single annual plan for access and promotion.
              </p>
            </figcaption>
          </figure>
          <figure className="flex flex-col items-center justify-center text-center gap-10">
            <img src={GrowIcon} alt="Grow_Img" className="h-[250px] w-fit" />
            <figcaption className="text-[24px] text-[#043D12]">
              <h5 className="font-bold">GROW</h5>
              <p className="text-[20px] lg:px-16 px-8">
                Share your profile, connect with customers, and track your
                growth.
              </p>
            </figcaption>
          </figure>
        </div>
        <div className="btn mt-12">
          <Link
            to="/create-account"
            className="border bg-transparent text-[#043D12] border-[#043D12] rounded-[48px] shadow-lg lg:text-[18px] text-[16px] px-8 py-4"
          >
            Explore Businesses{" "}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Join;
