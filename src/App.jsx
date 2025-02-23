import React from "react";
import { ToastContainer } from "react-toastify";

import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Community from "./pages/Community";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Subscribe from "./pages/Subscribe";
import BusinessProfile from "./pages/BusinessProfile";
import VerifyEmail from "./pages/VerifyEmail";
import ForgottenPassword from "./pages/ForgottenPassword";
import ResetPassword from "./pages/ResetPassword";
import SearchPage from "./pages/SearchPage";
import UserDashboard from "./pages/UserDashboard";
import CreateProfile from "./components/user-dashboard/CreateProfile";
import Profile from "./components/user-dashboard/Profile";
import Analytics from "./components/user-dashboard/Analytics";
import ProductAndServices from "./components/user-dashboard/ProductAndServices";
import ContactAndSocials from "./components/user-dashboard/ContactAndSocials";
import Subscription from "./components/user-dashboard/Subscription";
import Password from "./components/user-dashboard/Password";
import EditPofile from "./components/user-dashboard/EditProfile";
import AllBusiness from "./components/community/AllBusiness";
import AdminDashboard from "./components/admin/AdminDashboard";
import CommunityMain from "./components/community/CommunityMain";
import ProfilePage from "./components/community/ProfilePage";

function App() {
  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />

      <Routes>
        {/* Main Layout */}
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="community" element={<Community />}>
            <Route index element={<CommunityMain />} />
            <Route path="all-businesses" element={<AllBusiness />} />
            <Route path="search" element={<SearchPage />} />
            <Route path="profile" element={<ProfilePage />} />
          </Route>
        </Route>

        {/* Authentication & Misc Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/create-account" element={<Signup />} />
        <Route path="/subscribe" element={<Subscribe />} />
        <Route path="/business-profile" element={<BusinessProfile />} />
        <Route path="/verify-email" element={<VerifyEmail />} />
        <Route path="/forgotten-password" element={<ForgottenPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        <Route path="/search" element={<SearchPage />} />

        {/* User Dashboard with Nested Routes */}
        <Route path="/user-dashboard" element={<UserDashboard />}>
          {/* Index route for User Dashboard */}
          <Route index element={<Profile />} />

          {/* Profile section with nested routes */}
          <Route path="profile" element={<CreateProfile />}>
            <Route index element={<EditPofile />} />
            <Route
              path="products-and-services"
              element={<ProductAndServices />}
            />
            <Route path="contact-and-socials" element={<ContactAndSocials />} />
            <Route path="subscription" element={<Subscription />} />
            <Route path="password" element={<Password />} />
          </Route>

          {/* Other user dashboard routes */}
          <Route path="analytics" element={<Analytics />} />
          <Route path="create-profile" element={<CreateProfile />} />
        </Route>

        <Route path="/admin" element={<AdminDashboard />}>
          {/* Index route for User Dashboard */}
          <Route index element={<Profile />} />

          {/* Other user dashboard routes */}
          <Route path="analytics" element={<Analytics />} />
          <Route path="create-profile" element={<CreateProfile />} />
        </Route>

        {/* Standalone Route */}
        {/* <Route path="/create-profile" element={<CreateProfile />} /> */}
      </Routes>
    </>
  );
}

export default App;
