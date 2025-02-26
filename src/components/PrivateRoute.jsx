import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectAuth } from "../redux/authSlice";

const PrivateRoute = ({ children }) => {
  const { isAuthenticated } = useSelector(selectAuth);
  const location = useLocation();
  console.log(
    "🔍 PrivateRoute Check - isAuthenticated:",
    isAuthenticated,
    "Path:",
    location.pathname
  );

  // Allow Login page to render without redirecting
  if (location.pathname === "/login") {
    return children;
  }

  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

export default PrivateRoute;
