import React from "react";
import { Outlet } from "react-router";
import Header from "./Header";

const Layout = () => {
  return (
    <div style={{ display: "block", opacity: 1, visibility: "visible" }}>
      <Header />
      <Outlet />
    </div>
  );
};

export default Layout;
