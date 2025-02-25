import React, { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check token on mount and set initial auth state
    const token = localStorage.getItem("token");
    console.log("🔍 Initial Token Check:", token);
    setIsAuthenticated(!!token);
  }, []);

  const login = (token) => {
    localStorage.setItem("token", token);
    setIsAuthenticated(true);
    console.log("✅ Logged in with token:", token);
  };

  const logout = () => {
    // Clear all relevant localStorage items
    localStorage.removeItem("token");
    localStorage.removeItem("member_id");
    localStorage.removeItem("member");
    localStorage.removeItem("profile_id");
    localStorage.removeItem("paymentCompleted");
    sessionStorage.clear(); // Clear sessionStorage (used in UserDashboard)
    setIsAuthenticated(false);
    console.log("✅ Logged out, all storage cleared");
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
