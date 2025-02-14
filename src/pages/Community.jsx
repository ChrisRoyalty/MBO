import React from "react";
import Discover from "../components/community/Discover";
import Search from "../components/community/Search";
import NewBusinesses from "../components/community/NewBusinesses";
import TrendingBusiness from "../components/community/TrendingBusiness";
import PopularServices from "../components/community/PopularServices";
import AddBusiness from "../components/community/AddBusiness";
import Footer from "../components/Footer";

const Community = () => {
  return (
    <div className="">
      <Discover />
      <Search />
      <NewBusinesses />
      <TrendingBusiness />
      <PopularServices />
      <AddBusiness />
      <Footer />
    </div>
  );
};

export default Community;
