import React from "react";
import Discover from "../community/Discover";
import Search from "../community/Search";
import NewBusinesses from "../community/NewBusinesses";
import TrendingBusiness from "../community/TrendingBusiness";
import PopularServices from "../community/PopularServices";
import AddBusiness from "../community/AddBusiness";

const CommunityMain = () => {
  return (
    <div>
      {/* Static Sections That Should Always Be Visible */}
      <Discover />
      <Search />
      <NewBusinesses />
      <TrendingBusiness />
      <PopularServices />
      <AddBusiness />
    </div>
  );
};

export default CommunityMain;
