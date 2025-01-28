import React from "react";
import HeroSection from "../components/home/HeroSection";
import Join from "../components/home/Join";
import Benefits from "../components/home/Benefits";
import Faq from "../components/home/Faq";
import Start from "../components/home/Start";
import Footer from "../components/Footer";

const Home = () => {
  return (
    <div className="w-full bg-[#FFFDF2]">
      <HeroSection />
      <Join />
      <Benefits />
      <Faq />
      <Start />
      <Footer />
    </div>
  );
};

export default Home;
