import React from "react";
import HeroSection from "../components/home/HeroSection";
import Join from "../components/home/Join";
import Benefits from "../components/home/Benefits";
import Faq from "../components/home/Faq";

const Home = () => {
  return (
    <div className="w-full bg-[#FFFDF2]">
      <HeroSection />
      <Join />
      <Benefits />
      <Faq />
    </div>
  );
};

export default Home;
