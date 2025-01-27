import React, { useEffect, useState } from "react";
import DemoImg from "../../assets/demo.svg";
import VectorIcon1 from "../../assets/vector1.svg";
import VectorIcon2 from "../../assets/vector2.svg";
import VectorIcon3 from "../../assets/vector3.svg";

const Benefits = () => {
  // State for tracking visibility of each section
  const [showShowcase, setShowShowcase] = useState(false);
  const [showExpand, setShowExpand] = useState(false);
  const [showEngage, setShowEngage] = useState(false);
  const [showTrack, setShowTrack] = useState(false);

  // Intersection observer callback
  const handleIntersection = (setVisibility) => (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        setVisibility(true); // Set section as visible
      }
    });
  };

  useEffect(() => {
    const showcaseObserver = new IntersectionObserver(
      handleIntersection(setShowShowcase),
      {
        threshold: 0.5, // Trigger when 50% of the section is in view
      }
    );
    const expandObserver = new IntersectionObserver(
      handleIntersection(setShowExpand),
      {
        threshold: 0.5,
      }
    );
    const engageObserver = new IntersectionObserver(
      handleIntersection(setShowEngage),
      {
        threshold: 0.5,
      }
    );
    const trackObserver = new IntersectionObserver(
      handleIntersection(setShowTrack),
      {
        threshold: 0.5,
      }
    );

    // Observe each section
    showcaseObserver.observe(document.getElementById("showcase"));
    expandObserver.observe(document.getElementById("expand"));
    engageObserver.observe(document.getElementById("engage"));
    trackObserver.observe(document.getElementById("track"));

    return () => {
      showcaseObserver.disconnect();
      expandObserver.disconnect();
      engageObserver.disconnect();
      trackObserver.disconnect();
    };
  }, []);

  return (
    <div className="w-full flex justify-center items-center py-18 lg:bg-[#FFFFFF] bg-[#FAFEF4]">
      <div className="w-[90%] flex flex-col gap-14 text-[#043D12]">
        <h1 className="lg:text-[40px] text-[32px] font-medium text-center">
          What’s in it for You?
        </h1>
        {/* Showcase Section */}
        <div
          id="showcase"
          className={`w-full h-fit flex flex-col lg:gap-4 gap-16 transition-all duration-700 transform ${
            showShowcase ? "animate-slide-left" : "opacity-0 translate-x-12"
          }`}
        >
          <div className="flex max-lg:flex-col max-lg:text-center lg:justify-between items-center max-sm:gap-4">
            <div>
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

        {/* Expand Section */}
        <div
          id="expand"
          className={`w-full h-fit flex flex-col lg:gap-4 gap-16 transition-all duration-700 transform ${
            showExpand ? "animate-slide-top" : "opacity-0 translate-y-12"
          }`}
        >
          <div className="flex max-lg:flex-col max-lg:text-center lg:justify-between items-center max-sm:gap-4">
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

        {/* Engage Section */}
        <div
          id="engage"
          className={`w-full h-fit flex flex-col lg:gap-4 gap-16 transition-all duration-700 transform ${
            showEngage ? "animate-slide-right" : "opacity-0 translate-x-12"
          }`}
        >
          <div className="flex max-lg:flex-col max-lg:text-center lg:justify-between items-center max-sm:gap-4">
            <div>
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

        {/* Track Section */}
        <div
          id="track"
          className={`w-full h-fit flex flex-col lg:gap-4 gap-16 transition-all duration-700 transform ${
            showTrack ? "animate-slide-left" : "opacity-0 translate-x-12"
          }`}
        >
          <div className="flex max-lg:flex-col max-lg:text-center lg:justify-between items-center max-sm:gap-4">
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
