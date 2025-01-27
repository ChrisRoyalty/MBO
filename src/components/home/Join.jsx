import React, { useEffect, useState } from "react";
import SignupIcon from "../../assets/signup-icon.svg";
import SubscribeIcon from "../../assets/subscriber.svg";
import GrowIcon from "../../assets/grow.svg";
import { Link } from "react-router";

const Join = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [buttonVisible, setButtonVisible] = useState(false); // State for button visibility

  // IntersectionObserver callback for cards
  const handleIntersection = (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        setIsVisible(true); // Trigger card animations
      }
    });
  };

  // IntersectionObserver callback for button
  const handleButtonIntersection = (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        setButtonVisible(true); // Trigger button animation
      }
    });
  };

  useEffect(() => {
    const observer = new IntersectionObserver(handleIntersection, {
      threshold: 0.5, // Trigger when 50% of the element is in view
    });

    // Observe the cards
    const cards = document.querySelectorAll(".in-view-card");
    cards.forEach((card) => observer.observe(card));

    // Observe the button
    const button = document.querySelector(".cta-button");
    const buttonObserver = new IntersectionObserver(handleButtonIntersection, {
      threshold: 0.5,
    });
    buttonObserver.observe(button);

    // Cleanup on component unmount
    return () => {
      cards.forEach((card) => observer.unobserve(card));
      buttonObserver.unobserve(button);
    };
  }, []);

  return (
    <section className="w-full flex justify-center items-center bg-[#FAFEF4] py-18">
      <div className="w-[85%] flex flex-col gap-10 text-center">
        {/* Title Section */}
        <h1 className="lg:text-[40px] text-[32px] text-[#043D1266] font-semibold">
          Join our growing network
        </h1>

        {/* Cards Section */}
        <div className="w-full grid md:grid-cols-3 lg:gap-10 gap-24">
          {[
            {
              img: SignupIcon,
              title: "SIGN UP",
              description:
                "Create your business profile in just a few minutes.",
              animationClass: isVisible
                ? "animate-slide-left"
                : "opacity-0 translate-x-12", // Left animation
            },
            {
              img: SubscribeIcon,
              title: "Subscribe",
              description:
                "Choose a single annual plan for access and promotion.",
              animationClass: isVisible
                ? "animate-slide-top"
                : "opacity-0 translate-y-12", // Top animation
            },
            {
              img: GrowIcon,
              title: "GROW",
              description:
                "Share your profile, connect with customers, and track your growth.",
              animationClass: isVisible
                ? "animate-slide-right"
                : "opacity-0 translate-x-12", // Right animation
            },
          ].map((card, index) => (
            <div
              key={index}
              className={`in-view-card flex flex-col items-center justify-center text-center gap-6 transition-all duration-700 transform ${card.animationClass}`}
            >
              <img
                src={card.img}
                alt={`${card.title}_Img`}
                className="h-[250px] w-fit"
              />
              <figcaption className="text-[24px] text-[#043D12]">
                <h5 className="font-bold">{card.title}</h5>
                <p className="text-[20px] lg:px-16 px-8">{card.description}</p>
              </figcaption>
            </div>
          ))}
        </div>

        {/* Call-to-Action Button */}
        <div
          className={`cta-button mt-12 transition-all duration-700 transform ${
            buttonVisible ? "animate-slide-up" : "opacity-0 translate-y-12"
          }`}
        >
          <Link
            to="/create-account"
            className="border bg-transparent text-[#043D12] border-[#043D12] rounded-[48px] shadow-lg lg:text-[18px] text-[16px] px-8 py-4 hover:bg-[#043D12] hover:text-white transition duration-300"
          >
            Explore Businesses
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Join;
