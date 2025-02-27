import React, { useEffect } from "react";
import Good from "../components/svgs/Good";
import { TbCurrencyNaira } from "react-icons/tb";
import { FlutterWaveButton, closePaymentModal } from "flutterwave-react-v3";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode"; // Import jwt-decode to decode token

const Subscribe = () => {
  const navigate = useNavigate();

  // Check authentication and get user data on mount
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("No token found, redirecting to login...");
      navigate("/login");
    }
  }, [navigate]);

  // Retrieve member data from localStorage
  const storedMember = JSON.parse(localStorage.getItem("member") || "{}");
  const customer = {
    email: storedMember.email || "user@example.com", // Dynamic email
    phone_number: storedMember.phone_number || "08012345678", // Fallback if not available
    name: `${storedMember.firstname || "John"} ${
      storedMember.lastname || "Doe"
    }`, // Dynamic name
  };

  const config = {
    public_key: "FLWPUBK_TEST-5e9e360f5c8914da44ae6d55a0ae2867-X", // Replace with your Flutterwave public key
    tx_ref: `MBO-${Date.now()}`, // Unique transaction reference
    amount: 15000,
    currency: "NGN",
    payment_options: "card, banktransfer, ussd",
    customer, // Use dynamic customer data
    customizations: {
      title: "MBO Subscription",
      description: "Payment for yearly subscription",
      logo: "/mindpower-logo.svg", // Add your logo URL
    },
  };

  const fwConfig = {
    ...config,
    callback: (response) => {
      console.log("🔍 Payment Response:", response);
      if (response.status === "successful") {
        alert("Payment successful! Your subscription is now active.");
        // Optionally, send a request to your backend to activate the subscription here
        navigate("/business-profile"); // Redirect to business profile creation
      }
      closePaymentModal(); // Close the payment modal
    },
    onClose: () => {
      console.log("Payment modal closed");
    },
  };

  return (
    <div className="bg-[#043D12] w-full h-[100vh] max-lg:py-16 lg:h-screen flex flex-col justify-center items-center">
      <div className="w-[85%] md:w-[70%] h-fit text-center flex flex-col gap-8">
        <h1 className="text-[#B4B3B3] lg:text-[30px] text-[20px] w-[90%] md:w-[60%] mx-auto">
          Stay Connected, Stay Promoted: <br className="max-lg:hidden" /> Your
          All-in-One Plan
        </h1>
        <div className="details w-full px-10 py-10 md:p-10 grid lg:grid-cols-2 grid-cols-1 bg-[#FFFDF2]">
          <div className="amount w-full h-fit max-lg:flex flex-col items-center lg:pt-24">
            <div className="">
              <div className="w-fit leading-[20px] max-lg:flex">
                <h1 className="lg:text-[50px] text-[45px] text-[#043D12] flex items-center gap-0 w-fit">
                  <TbCurrencyNaira />
                  15,000
                </h1>
                <span className="lg:text-[24px] text-[14px] text-[#043D12] float-start max-lg:flex items-end">
                  YEARLY
                </span>
              </div>
            </div>
          </div>
          <div className="w-full benefit flex flex-col gap-4 max-lg:items-center max-lg:justify-center max-md:mt-8">
            <div className="w-fit flex flex-col gap-4">
              <ul className="flex items-center gap-4">
                <li>
                  <Good />
                </li>
                <li className="md:text-[20px] text-[16px] text-[#676767]">
                  Active Business Profile
                </li>
              </ul>
              <ul className="flex items-center gap-4">
                <li>
                  <Good />
                </li>
                <li className="md:text-[20px] text-[16px] text-[#676767]">
                  Boosted Visibility
                </li>
              </ul>
              <ul className="flex items-center gap-4">
                <li>
                  <Good />
                </li>
                <li className="md:text-[20px] text-[16px] text-[#676767]">
                  Affordable and Flexible
                </li>
              </ul>
              <ul className="flex items-center gap-4">
                <li>
                  <Good />
                </li>
                <li className="md:text-[20px] text-[16px] text-[#676767]">
                  Networking Opportunities
                </li>
              </ul>
              <ul className="flex items-center gap-4">
                <li>
                  <Good />
                </li>
                <li className="md:text-[20px] text-[16px] text-[#676767]">
                  Enhanced Credibility
                </li>
              </ul>

              {/* Flutterwave Payment Button */}
              <div className="shadow-lg mt-8 register px-6 md:px-14 md:py-4 py-3 bg-[#043D12] rounded-[9px] text-[#FFFDF2] flex flex-col gap-2">
                <FlutterWaveButton
                  className="cursor-pointer bg-transparent text-white font-medium text-[18px] border-2 border-white px-4 py-2 rounded-lg"
                  {...fwConfig}
                  text="Subscribe Now"
                />
              </div>
            </div>
          </div>
        </div>
        <h1 className="text-[#B4B3B3] lg:text-[20px] text-[15px] w-[90%] md:w-[60%] mx-auto">
          Ready to take your business to the Next level? Subscribe today and
          start growing!
        </h1>
      </div>
    </div>
  );
};

export default Subscribe;
