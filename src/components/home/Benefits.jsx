import React from "react";
import DemoImg from "../../assets/demo.svg";
import VectorIcon1 from "../../assets/vector1.svg";
import VectorIcon2 from "../../assets/vector2.svg";
import VectorIcon3 from "../../assets/vector3.svg";

const Benefits = () => {
  return (
    <div className="w-full flex justify-center items-center py-18 lg:bg-[#FFFFFF] bg-[#FAFEF4]">
      <div className="w-[90%] flex flex-col gap-14  text-[#043D12]">
        <h1 className="lg:text-[40px] text-[32px] font-medium text-center">
          What’s in it for You?
        </h1>
        {/* showcase section */}
        <div className="w-full h-fit flex flex-col lg:gap-4 gap-16">
          <div className="flex  max-lg:flex-col max-lg:text-center lg:justify-between items-center max-sm:gap-4">
            <div className="">
              <h1 className="lg:text-[40px] text-[32px]">
                Showcase Your <br /> Business
              </h1>
              <p className="md:text-[20px] text-[18px] w-[80%] max-lg:m-auto">
                Create a profile with all your essential details.
              </p>
            </div>
            <img src={DemoImg} alt="Showcase_Img" className="" />
          </div>
          <div className="vectorImg w-full flex justify-center items-center">
            <img
              src={VectorIcon1}
              alt="Vector_Icon"
              className="max-md:w-[80%] max-sm:w-[60%] h-fit mx-auto"
            />
          </div>
        </div>
        {/* expand section */}
        <div className="w-full h-fit flex flex-col lg:gap-4 gap-16">
          <div className="flex  max-lg:flex-col max-lg:text-center lg:justify-between items-center max-sm:gap-4">
            <div className="lg:order-2">
              <h1 className="lg:text-[40px] text-[32px]">
                Expand Your <br /> Reach
              </h1>
              <p className="md:text-[20px] text-[18px] w-[80%] max-lg:m-auto">
                Promote your products and services to a wider audience.{" "}
              </p>
            </div>
            <div>
              <img src={DemoImg} alt="Expand_Img" className="lg:order-1" />
            </div>
          </div>
          <div className="vectorImg w-full flex justify-center items-center">
            <img
              src={VectorIcon2}
              alt="Vector_Icon"
              className="max-md:w-[80%] max-sm:w-[60%] h-fit mx-auto"
            />
          </div>
        </div>
        {/* engage section */}
        <div className="w-full h-fit flex flex-col lg:gap-4 gap-16">
          <div className="flex  max-lg:flex-col max-lg:text-center lg:justify-between items-center max-sm:gap-4">
            <div className="">
              <h1 className="lg:text-[40px] text-[32px]">
                Engage Customers <br /> Easily
              </h1>
              <p className="md:text-[20px] text-[18px] w-[80%] max-lg:m-auto">
                Communicate seamlessly via WhatsApp and social media links.{" "}
              </p>
            </div>
            <img src={DemoImg} alt="Engage_Img" className="" />
          </div>
          <div className="vectorImg w-full flex justify-center items-center">
            <img
              src={VectorIcon3}
              alt="Vector_Icon"
              className="max-md:w-[80%] max-sm:w-[60%] h-fit mx-auto"
            />
          </div>
        </div>
        {/* track section */}
        <div className="w-full h-fit flex flex-col lg:gap-4 gap-16">
          <div className="flex  max-lg:flex-col max-lg:text-center lg:justify-between items-center max-sm:gap-4">
            <div className="lg:order-2">
              <h1 className="lg:text-[40px] text-[32px]">
                Track Your <br /> Progress
              </h1>
              <p className="md:text-[20px] text-[18px] w-[80%] max-lg:m-auto">
                Access visitor analytics for better business insights.{" "}
              </p>
            </div>
            <div>
              <img src={DemoImg} alt="track_Img" className="lg:order-1" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Benefits;
