// src/App.js
import React from "react";
import { ToastContainer } from "react-toastify";
import { Routes, Route } from "react-router-dom";
import PrivateRoute from "./components/PrivateRoute"; // Import PrivateRoute
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
import Analytics from "./components/user-dashboard/HelpAndSupport";
import ProductAndServices from "./components/user-dashboard/ProductAndServices";
import ContactAndSocials from "./components/user-dashboard/ContactAndSocials";
import Subscription from "./components/user-dashboard/Subscription";
import Password from "./components/user-dashboard/Password";
import EditProfile from "./components/user-dashboard/EditProfile";
import AllBusiness from "./components/community/AllBusiness";
import AdminDashboard from "./components/admin/AdminDashboard";
import CommunityMain from "./components/community/CommunityMain";
import ProfilePage from "./components/community/ProfilePage";
import BusinessProfile2 from "./pages/BusinessProfile2";
import Displays from "./components/admin/Displays";
import ManageAdmin from "./components/admin/ManageAdmin";
import ManageUsers from "./components/admin/ManageUsers";
import ManageSubscription from "./components/admin/ManageSubscription";
import Support from "./components/admin/Support";
import Notification from "./components/admin/Notification";
import HelpAndSupport from "./pages/HelpAndSupport";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfService from "./pages/TermsOfService";

function App() {
  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/create-account" element={<Signup />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/terms-of-service" element={<TermsOfService />} />

        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="/help-and-support" element={<HelpAndSupport />} />
          <Route path="community" element={<Community />}>
            <Route index element={<CommunityMain />} />
            <Route path="all-businesses" element={<AllBusiness />} />
            <Route path="search" element={<SearchPage />} />
            <Route path="profile/:id" element={<ProfilePage />} />{" "}
            {/* Updated to dynamic route with :id */}
          </Route>
        </Route>

        {/* Protected Routes */}
        <Route
          path="/subscribe"
          element={
            <PrivateRoute>
              <Subscribe />
            </PrivateRoute>
          }
        />
        <Route
          path="/business-profile"
          element={
            <PrivateRoute>
              <BusinessProfile />
            </PrivateRoute>
          }
        />
        <Route
          path="/business-profile2"
          element={
            <PrivateRoute>
              <BusinessProfile2 />
            </PrivateRoute>
          }
        />
        <Route
          path="/verify-email"
          element={
            <PrivateRoute>
              <VerifyEmail />
            </PrivateRoute>
          }
        />
        <Route path="/forgotten-password" element={<ForgottenPassword />} />
        <Route
          path="/reset-password"
          element={
            // <PrivateRoute>
            <ResetPassword />
            // </PrivateRoute>
          }
        />
        <Route
          path="/search"
          element={
            // <PrivateRoute>
            <SearchPage />
            // </PrivateRoute>
          }
        />

        {/* User Dashboard with Nested Routes */}
        <Route
          path="/user-dashboard"
          element={
            // <PrivateRoute>
            <UserDashboard />
            // </PrivateRoute>
          }
        >
          <Route index element={<Profile />} />
          <Route path="profile" element={<CreateProfile />}>
            <Route index element={<EditProfile />} />
            {/* <Route path="/profile" element={<Profile />} /> */}

            <Route
              path="products-and-services"
              element={<ProductAndServices />}
            />
            <Route path="contact-and-socials" element={<ContactAndSocials />} />
            <Route path="subscription" element={<Subscription />} />
            <Route path="password" element={<Password />} />
          </Route>
          <Route path="help" element={<HelpAndSupport />} />
          <Route path="create-profile" element={<CreateProfile />} />
        </Route>

        {/* Admin Dashboard */}
        <Route
          path="/admin"
          element={
            <PrivateRoute>
              <AdminDashboard />
            </PrivateRoute>
          }
        >
          <Route index element={<Displays />} />
          <Route path="manage-admins" element={<ManageAdmin />} />
          <Route path="manage-users" element={<ManageUsers />} />
          <Route path="manage-subscriptions" element={<ManageSubscription />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="manage-notifications" element={<Notification />} />
          <Route path="support" element={<Support />} />
          <Route path="manage-users" element={<ManageUsers />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
