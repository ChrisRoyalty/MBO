import React from "react";
import { Outlet } from "react-router-dom";

import Footer from "../components/Footer";
import CommunityMain from "../components/community/CommunityMain.jsx";

const Community = () => {
  return (
    <div>
      {/* Static Sections That Should Always Be Visible */}
      {/* <CommunityMain /> */}

      {/* Outlet for Nested Routes */}
      <Outlet />

      {/* Footer Should Always Be Visible */}
      {/* <Footer /> */}
    </div>
  );
};

export default Community;
