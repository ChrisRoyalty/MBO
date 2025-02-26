import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectAuth } from "../redux/authSlice";

const PrivateRoute = ({ children }) => {
  const { isAuthenticated } = useSelector(selectAuth);

  console.log("🔍 PrivateRoute Check - isAuthenticated:", isAuthenticated);

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return children ? children : <Outlet />; // Ensure nested routes work
};

export default PrivateRoute;
