import React from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectAuth } from "../redux/authSlice"; // Import the selector

const PrivateRoute = ({ children }) => {
  const { isAuthenticated } = useSelector(selectAuth); // Get authentication state from Redux

  console.log("🔍 PrivateRoute Check - isAuthenticated:", isAuthenticated);

  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

export default PrivateRoute;
