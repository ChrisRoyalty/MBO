import React from "react";
import Discover from "../community/Discover";
import Search from "../community/Search";
import NewBusinesses from "./NewBusinesses";

import AddBusiness from "../community/AddBusiness";
import Footer from "../Footer";

const CommunityMain = () => {
  return (
    <div>
      {/* Static Sections That Should Always Be Visible */}
      <Discover />
      <Search />

      <NewBusinesses />
      <AddBusiness />
      <Footer />
    </div>
  );
};

export default CommunityMain;
