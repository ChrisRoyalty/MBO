import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const VerifyEmail = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token"); // Get token from URL
  const [isVerifying, setIsVerifying] = useState(true);
  const [verificationFailed, setVerificationFailed] = useState(false);
  const [email, setEmail] = useState("");

  useEffect(() => {
    if (!token) {
      toast.error("Invalid verification link.");
      setVerificationFailed(true);
      setIsVerifying(false);
      return;
    }

    axios
      .get(
        `${import.meta.env.VITE_BASE_URL}/member/verify-email?token=${token}`
      )
      .then((response) => {
        toast.success(response.data.message || "Email verified successfully!");
        setTimeout(() => navigate(`/subscribe`), 100);
      })
      .catch((error) => {
        toast.error(error.response?.data?.error || "Verification failed.");
        setVerificationFailed(true);
      })
      .finally(() => {
        setIsVerifying(false);
      });
  }, [token, navigate]);

  const handleResendVerification = () => {
    if (!email) {
      toast.error("Please enter your email.");
      return;
    }

    axios
      .post(`${import.meta.env.VITE_BASE_URL}/member/resend-verification`, {
        email,
      })
      .then(() => {
        toast.success("Verification email resent. Check your inbox.");
      })
      .catch(() => {
        toast.error("Failed to resend verification email.");
      });
  };

  return (
    <div className="w-full h-screen flex flex-col justify-center items-center">
      {isVerifying ? (
        <p>Verifying your email...</p>
      ) : verificationFailed ? (
        <div className="text-center">
          <p>Email verification failed or link is invalid.</p>
          <p>Please enter your email to receive a new verification link:</p>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border p-2 rounded-md mt-2"
          />
          <button
            onClick={handleResendVerification}
            className="bg-blue-500 text-white px-4 py-2 rounded-md mt-2"
          >
            Resend Verification Email
          </button>
        </div>
      ) : (
        <p>Redirecting to login...</p>
      )}
    </div>
  );
};

export default VerifyEmail;
