import React from "react";
import { ToastContainer } from "react-toastify";
import { Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext"; // Import AuthProvider
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
import Analytics from "./components/user-dashboard/Analytics";
import ProductAndServices from "./components/user-dashboard/ProductAndServices";
import ContactAndSocials from "./components/user-dashboard/ContactAndSocials";
import Subscription from "./components/user-dashboard/Subscription";
import Password from "./components/user-dashboard/Password";
import EditProfile from "./components/user-dashboard/EditProfile";
import AllBusiness from "./components/community/AllBusiness";
import AdminDashboard from "./components/admin/AdminDashboard";
import CommunityMain from "./components/community/CommunityMain";
import ProfilePage from "./components/community/ProfilePage";

function App() {
  return (
    <AuthProvider>
      <ToastContainer position="top-right" autoClose={3000} />
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/create-account" element={<Signup />} />

        {/* Protected Routes */}
        <Route
          path="/"
          element={
            // <PrivateRoute>
            <Layout />
            // </PrivateRoute>
          }
        >
          <Route index element={<Home />} />
          <Route path="community" element={<Community />}>
            <Route index element={<CommunityMain />} />
            <Route path="all-businesses" element={<AllBusiness />} />
            <Route path="search" element={<SearchPage />} />
            <Route path="profile" element={<ProfilePage />} />
          </Route>
        </Route>

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
          path="/verify-email"
          element={
            <PrivateRoute>
              <VerifyEmail />
            </PrivateRoute>
          }
        />
        <Route
          path="/forgotten-password"
          element={
            <PrivateRoute>
              <ForgottenPassword />
            </PrivateRoute>
          }
        />
        <Route
          path="/reset-password/:token"
          element={
            <PrivateRoute>
              <ResetPassword />
            </PrivateRoute>
          }
        />
        <Route
          path="/search"
          element={
            <PrivateRoute>
              <SearchPage />
            </PrivateRoute>
          }
        />

        {/* User Dashboard with Nested Routes */}
        <Route
          path="/user-dashboard"
          element={
            <PrivateRoute>
              <UserDashboard />
            </PrivateRoute>
          }
        >
          <Route index element={<Profile />} />
          <Route path="profile" element={<CreateProfile />}>
            <Route index element={<EditProfile />} />
            <Route
              path="products-and-services"
              element={<ProductAndServices />}
            />
            <Route path="contact-and-socials" element={<ContactAndSocials />} />
            <Route path="subscription" element={<Subscription />} />
            <Route path="password" element={<Password />} />
          </Route>
          <Route path="analytics" element={<Analytics />} />
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
          <Route index element={<Profile />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="create-profile" element={<CreateProfile />} />
        </Route>
      </Routes>
    </AuthProvider>
  );
}

export default App;
