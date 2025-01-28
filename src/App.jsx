import React from "react";
import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Community from "./pages/Community";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Subscribe from "./pages/Subscribe";
import BusinessProfile from "./pages/BusinessProfile";
function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/community" element={<Community />} />
        </Route>
        <Route path="/login" element={<Login />} />
        <Route path="/create-account" element={<Signup />} />
        <Route path="/subscribe" element={<Subscribe />} />
        <Route path="/business-profile" element={<BusinessProfile />} />
      </Routes>
    </>
  );
}

export default App;
