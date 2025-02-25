import React from "react";
import { useDispatch } from "react-redux";
import { logout } from "../redux/authSlice";
import { useNavigate } from "react-router-dom";

const LogoutButton = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    // Dispatch the logout action to Redux
    dispatch(logout());
    // Optionally navigate the user to the login page after logout
    navigate("/login");
  };

  return <button onClick={handleLogout}>Log Out</button>;
};

export default LogoutButton;
