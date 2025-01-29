import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const VerifyEmail = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token"); // Get token from URL
  const [isVerifying, setIsVerifying] = useState(true);

  useEffect(() => {
    if (!token) {
      toast.error("Invalid verification link.");
      navigate("/login");
      return;
    }

    axios
      .post("https://mbo.bookbank.com.ng/member/verify-emai", { token })
      .then((response) => {
        toast.success(response.data.message || "Email verified successfully!");
        setTimeout(() => navigate("/login"), 2000); // Redirect after 2s
      })
      .catch((error) => {
        toast.error(error.response?.data?.error || "Verification failed.");
        navigate("/login");
      })
      .finally(() => {
        setIsVerifying(false);
      });
  }, [token, navigate]);

  return (
    <div className="w-full h-screen flex justify-center items-center">
      {isVerifying ? (
        <p>Verifying your email...</p>
      ) : (
        <p>Redirecting to login...</p>
      )}
    </div>
  );
};

export default VerifyEmail;
