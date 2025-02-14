import React, { useState } from "react";
import { Link, Outlet } from "react-router-dom";
import { LuLayoutGrid } from "react-icons/lu";
import { PiUserCircle } from "react-icons/pi";
import { MdOutlineAnalytics } from "react-icons/md";
import BusinessImg from "../assets/businessImg.jpeg";
import { IoIosLogOut } from "react-icons/io";
import { CgMenuLeftAlt } from "react-icons/cg";
import { MdOutlineCancelPresentation } from "react-icons/md";
import { useEffect } from "react";
import { memo } from "react";
import Profile from "../components/user-dashboard/Profile";

const UserDashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(
    sessionStorage.getItem("sidebarState") === "true"
  );

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => {
      const newState = !prev;
      sessionStorage.setItem("sidebarState", newState); // Save state
      return newState;
    });
  };
  useEffect(() => {
    setIsSidebarOpen(sessionStorage.getItem("sidebarState") === "true");
  }, []);

  return (
    <div className="w-full flex flex-col md:flex-row h-screen overflow-hidden relative">
      {/* Sidebar */}
      <aside
        className={`fixed z-50 top-0 right-0 w-64 max-md:h-screen py-14 px-10 md:h-full h-auto overflow-y-auto bg-white border-r-[1px] border-black shadow-lg transition-transform duration-300 ${
          isSidebarOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Close Sidebar Button */}
        <MdOutlineCancelPresentation
          onClick={toggleSidebar}
          className="text-[#043D12] text-[35px] absolute top-4 right-4 cursor-pointer"
        />

        <div className="flex flex-col gap-10">
          <strong className="logo text-[32px] text-[#043D12]">MBO</strong>
          <nav className="flex flex-col gap-4">
            <Link
              to="/user-dashboard"
              className="text-[15px] text-[#043D12] flex items-center gap-4 hover:rounded-[11px] hover:bg-gray-200 px-6 py-2"
            >
              <LuLayoutGrid className="text-[25px]" />
              Home
            </Link>
            <Link
              to="/community"
              className="text-[15px] text-[#043D12] flex items-center gap-4 hover:rounded-[11px] hover:bg-gray-200 px-6 py-2"
            >
              <PiUserCircle className="text-[25px]" />
              Community
            </Link>
            <Link
              to="/user-dashboard/analytics"
              className="text-[15px] text-[#043D12] flex items-center gap-4 hover:rounded-[11px] hover:bg-gray-200 px-6 py-2"
            >
              <MdOutlineAnalytics className="text-[25px]" />
              Analytics
            </Link>
          </nav>
        </div>
        <div className="flex flex-col gap-10 mt-8">
          <div className="rounded-[16px] border-[1px] border-[#6A7368] px-4 py-4 flex flex-col gap-6">
            <figure className="flex flex-col items-center">
              <img
                src={BusinessImg}
                alt="Business-img"
                className="rounded-full w-[77px] h-[77px]"
              />
              <figcaption className="text-center text-[#6A7368]">
                <h3 className="text-[12px]">Ngene and Sons Ltd</h3>
                <p className="text-[8px]">Clothing and Accessories</p>
              </figcaption>
            </figure>
            <button className="text-[#FFFDF2] text-[14px] rounded-[14px] bg-[#043D12] py-3 px-2 shadow-lg">
              Share profile link
            </button>
          </div>
          <nav>
            <Link
              to="/dashboard/contact"
              className="text-[15px] text-[#043D12] flex items-center gap-4 hover:rounded-[11px] hover:bg-gray-200 px-6 py-2"
            >
              <PiUserCircle className="text-[25px]" />
              Contact Us
            </Link>
            <Link
              to="/login"
              className="text-[15px] text-[#043D12] flex items-center gap-4 hover:rounded-[11px] hover:bg-gray-200 px-6 py-2"
            >
              <IoIosLogOut className="text-[25px]" />
              Logout
            </Link>
          </nav>
        </div>
      </aside>

      {/* Main Content */}
      <main className="w-full h-screen overflow-y-scroll">
        {!isSidebarOpen && (
          <CgMenuLeftAlt
            onClick={toggleSidebar}
            className="text-[#043D12] text-[25px] absolute top-4 left-4 cursor-pointer border rounded shadow p-1"
          />
        )}
        <Outlet /> {/* This should not reset the state */}
      </main>
    </div>
  );
};

export default memo(UserDashboard);
