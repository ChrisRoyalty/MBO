import React, { useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const Password = () => {
  const [formData, setFormData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [showPasswords, setShowPasswords] = useState({
    oldPassword: false,
    newPassword: false,
    confirmPassword: false,
  });

  const { token } = useSelector((state) => state.auth);

  // Handle input change
  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // Toggle password visibility
  const togglePasswordVisibility = (field) => {
    setShowPasswords((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    // Validation
    if (
      !formData.oldPassword ||
      !formData.newPassword ||
      !formData.confirmPassword
    ) {
      toast.error("All fields are required.");
      setSubmitting(false);
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      toast.error("New password and confirm password do not match.");
      setSubmitting(false);
      return;
    }

    if (!token) {
      toast.error("No authentication token found!");
      setSubmitting(false);
      return;
    }

    try {
      const payload = {
        oldPassword: formData.oldPassword,
        newPassword: formData.newPassword,
        confirmPassword: formData.confirmPassword,
      };
      const response = await axios.patch(
        `${import.meta.env.VITE_BASE_URL}/member/change-password`,
        payload,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Password Change Response:", response.data); // For debugging

      // Check for success based on message
      if (response.data.message === "Password changed successfully") {
        toast.success(
          response.data.message || "Password changed successfully!",
          {
            style: { backgroundColor: "#07bc0c", color: "white" }, // Force green
          }
        );
        setFormData({ oldPassword: "", newPassword: "", confirmPassword: "" });
      } else {
        toast.error(
          response.data.error ||
            response.data.message ||
            "Failed to change password."
        );
      }
    } catch (error) {
      console.error("❌ Error Changing Password:", error);
      toast.error(
        error.response?.data?.message ||
          "Failed to change password due to an error."
      );
    } finally {
      setSubmitting(false);
    }
  };

  // Animated Loader Component
  const Loader = () => (
    <div className="flex space-x-2 items-center">
      <div className="w-3 h-3 bg-[#043D12] rounded-full animate-bounce"></div>
      <div className="w-3 h-3 bg-[#043D12] rounded-full animate-bounce delay-200"></div>
      <div className="w-3 h-3 bg-[#043D12] rounded-full animate-bounce delay-400"></div>
    </div>
  );

  return (
    <div className="w-full text-[#6A7368] flex flex-col gap-10 justify-start">
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <h2 className="text-[16px] text-[#043D12] font-medium border-b-[1px] border-[#6A7368] px-2 py-1 w-fit">
        Change Password
      </h2>
      <form className="lg:w-[70%] flex flex-col gap-8" onSubmit={handleSubmit}>
        <div className="text-[#6A7368] flex flex-col gap-2">
          <label>Current Password</label>
          <div className="relative">
            <input
              type={showPasswords.oldPassword ? "text" : "password"}
              value={formData.oldPassword}
              onChange={(e) => handleInputChange("oldPassword", e.target.value)}
              placeholder="Enter current password"
              className="w-full h-[46px] px-4 pr-10 rounded-[11px] border-[1px] border-[#6A7368] focus:ring-2 focus:ring-[#043D12] focus:border-[#043D12]"
            />
            <button
              type="button"
              onClick={() => togglePasswordVisibility("oldPassword")}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#6A7368] hover:text-[#043D12]"
            >
              {showPasswords.oldPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
        </div>
        <div className="text-[#6A7368] flex flex-col gap-2">
          <label>New Password</label>
          <div className="relative">
            <input
              type={showPasswords.newPassword ? "text" : "password"}
              value={formData.newPassword}
              onChange={(e) => handleInputChange("newPassword", e.target.value)}
              placeholder="Enter new password"
              className="w-full h-[46px] px-4 pr-10 rounded-[11px] border-[1px] border-[#6A7368] focus:ring-2 focus:ring-[#043D12] focus:border-[#043D12]"
            />
            <button
              type="button"
              onClick={() => togglePasswordVisibility("newPassword")}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#6A7368] hover:text-[#043D12]"
            >
              {showPasswords.newPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
        </div>
        <div className="text-[#6A7368] flex flex-col gap-2">
          <label>Confirm Password</label>
          <div className="relative">
            <input
              type={showPasswords.confirmPassword ? "text" : "password"}
              value={formData.confirmPassword}
              onChange={(e) =>
                handleInputChange("confirmPassword", e.target.value)
              }
              placeholder="Confirm new password"
              className="w-full h-[46px] px-4 pr-10 rounded-[11px] border-[1px] border-[#6A7368] focus:ring-2 focus:ring-[#043D12] focus:border-[#043D12]"
            />
            <button
              type="button"
              onClick={() => togglePasswordVisibility("confirmPassword")}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#6A7368] hover:text-[#043D12]"
            >
              {showPasswords.confirmPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
        </div>
        <div>
          <button
            type="submit"
            disabled={submitting}
            className={`border-[1px] border-[#6A7368] text-[#6A7368] rounded-[11px] text-[15px] px-2 lg:px-8 py-3 shadow-lg flex items-center gap-2 ${
              submitting
                ? "cursor-not-allowed opacity-50"
                : "hover:text-white hover:bg-[#043D12]"
            }`}
          >
            {submitting ? "Saving..." : "Save Changes"}
            {submitting && <Loader />}
          </button>
        </div>
      </form>
    </div>
  );
};

// Animated Loader Component
const Loader = () => (
  <div className="flex space-x-2 items-center">
    <div className="w-3 h-3 bg-[#043D12] rounded-full animate-bounce"></div>
    <div className="w-3 h-3 bg-[#043D12] rounded-full animate-bounce delay-200"></div>
    <div className="w-3 h-3 bg-[#043D12] rounded-full animate-bounce delay-400"></div>
  </div>
);

export default Password;
