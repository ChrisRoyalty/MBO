import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux"; // Import useSelector
import { toast } from "react-toastify";
import { TbCurrencyNaira } from "react-icons/tb";
import { FlutterWaveButton } from "flutterwave-react-v3";
import axios from "axios";
import {jwtDecode} from "jwt-decode"; // Ensure jwt-decode is installed
import  Good from "../components/svgs/Good"; 

const BASE_URL = import.meta.env.VITE_BASE_URL;
const PUBLIC_KEY = import.meta.env.VITE_FLUTTERWAVE_PUBLIC_KEY;

const Subscribe = () => {
  const [subscriptions, setSubscriptions] = useState([]);
  const [userId, setUserId] = useState(null);

  // Access the user from Redux
  const user = useSelector((state) => state.auth.user); // Use Redux to get the user state
  const token = useSelector((state) => state.auth.token); // Get token from Redux


  useEffect(() => {
    // Check if user is authenticated using the token
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        setUserId(decodedToken.id); // Get user ID from the decoded token
      } catch (error) {
        console.error("Invalid token:", error);
        toast.error("Session expired, please log in again.");
      }
    } else {
      toast.error("User not authenticated. Please log in.");
    }
  }, [token]);


  // Fetch subscription details dynamically
  useEffect(() => {
    const fetchSubscriptions = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/admin/get-sub`);
        if (response.data && Array.isArray(response.data.data)) {
          setSubscriptions(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching subscriptions:", error);
      }
    };
  
    fetchSubscriptions();
  }, []);
  const handlePayment = (subscription) => {
    if (!user || !userId) {
      toast.error("User details not found. Please log in.");
      return null;
    }
    const config = {
      public_key: PUBLIC_KEY,
      tx_ref: `MBO-${Date.now()}`,
      amount: subscription.price,
      currency: "NGN",
      payment_options: "card, banktransfer, ussd",
      customer: {
        customer: {
          email: user?.email,
          name: `${user?.firstname} ${user?.lastname}`
        },
      },
      customizations: {
        title: "MBO Subscription",
        description: `Payment for ${subscription.name}`,
        logo: "https://yourwebsite.com/logo.png",
      },
      callback: async (response) => {
        console.log(response);
        if (response.status === "successful") {
          try {
            const res = await axios.post(`${BASE_URL}admin/payment-hook`, {
              userId,
              subscriptionId: subscription.id,
              transactionId: response.transaction_id,
              tx_ref: response.tx_ref,
              amount: subscription.price,
              currency: "NGN",
              customer: {
                email: user.email,
                name: `${user.firstName} ${user.lastName}`,
              },
            });


            console.log("Backend Response:", res.data);

            if (res.status === 200) {
              alert("Payment verified! Subscription activated.");
            } else {
              alert("Payment verification failed.");
            }
          } catch (error) {
            console.error("Error verifying payment:", error);
          }
        } else {
          alert("Payment was not successful.");
        }

        closePaymentModal();
      },
      onClose: () => {
        console.log("Payment closed");
      },
    };

    return (
      <FlutterWaveButton
        className="cursor-pointer bg-transparent text-white font-medium text-[18px] border-2 border-white px-4 py-2 rounded-lg"
        {...config}
        text="Subscribe Now"
      />
    );
  };

  return (
    <div className="bg-[#043D12] w-full h-auto py-16 flex flex-col justify-center items-center">
      <h1 className="text-[#B4B3B3] lg:text-[30px] text-[20px] w-[90%] md:w-[60%] mx-auto text-center">
        Stay Connected, Stay Promoted: <br className="max-lg:hidden" /> Your
        All-in-One Plan
      </h1>

      <div className="w-[85%] md:w-[70%] h-fit text-center flex flex-wrap gap-8 justify-center">
        {subscriptions.length > 0 ? (
          subscriptions.map((subscription) => (
            <div
              key={subscription.id}
              className="details w-full md:w-[45%] px-10 py-10 bg-[#FFFDF2] shadow-lg rounded-lg"
            >
              <div className="amount w-full flex flex-col items-center lg:pt-8">
                <h1 className="lg:text-[50px] text-[45px] text-[#043D12] flex items-center gap-0">
                  <TbCurrencyNaira />
                  {subscription.price}
                </h1>
                <span className="lg:text-[24px] text-[14px] text-[#043D12]">
                  YEARLY
                </span>
              </div>
              <div className="w-full flex flex-col gap-4 items-center mt-6">
                <ul className="w-fit flex flex-col gap-4">
                  <li className="flex items-center gap-4">
                    <Good />
                    <span className="md:text-[20px] text-[16px] text-[#676767]">
                      Active Business Profile
                    </span>
                  </li>
                  <li className="flex items-center gap-4">
                    <Good />
                    <span className="md:text-[20px] text-[16px] text-[#676767]">
                      Boosted Visibility
                    </span>
                  </li>
                  <li className="flex items-center gap-4">
                    <Good />
                    <span className="md:text-[20px] text-[16px] text-[#676767]">
                      Affordable and Flexible
                    </span>
                  </li>
                  <li className="flex items-center gap-4">
                    <Good />
                    <span className="md:text-[20px] text-[16px] text-[#676767]">
                      Networking Opportunities
                    </span>
                  </li>
                  <li className="flex items-center gap-4">
                    <Good />
                    <span className="md:text-[20px] text-[16px] text-[#676767]">
                      Enhanced Credibility
                    </span>
                  </li>
                </ul>
                <div className="shadow-lg mt-8 register px-6 md:px-14 md:py-4 py-3 bg-[#043D12] rounded-[9px] text-[#FFFDF2] flex flex-col gap-2">
                  {handlePayment(subscription)}
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-white">Loading subscriptions...</p>
        )}
      </div>
    </div>
  );
};

export default Subscribe;
