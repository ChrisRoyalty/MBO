import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { TbCurrencyNaira } from "react-icons/tb";
import { FlutterWaveButton, closePaymentModal } from "flutterwave-react-v3";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import Good from "../components/svgs/Good";
import { useNavigate } from "react-router-dom";

const PUBLIC_KEY = import.meta.env.VITE_FLUTTERWAVE_PUBLIC_KEY;

const Subscribe = () => {
  const navigate = useNavigate();
  const [subscriptions, setSubscriptions] = useState([]);
  const [userId, setUserId] = useState(null);
  const [txRef, setTxRef] = useState(""); // Initialize as an empty string
  const [selectedPlan, setSelectedPlan] = useState(null); // T

  const user = useSelector((state) => state.auth.user);
  const token = useSelector((state) => state.auth.token);

  useEffect(() => {
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        setUserId(decodedToken.id);
      } catch (error) {
        console.error("Invalid token:", error);
        toast.error("Session expired, please log in again.");
      }
    } else {
      toast.error("User not authenticated. Please log in.");
    }
  }, [token]);

  useEffect(() => {
    const fetchSubscriptions = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/admin/get-sub`
        );
        if (response.data && Array.isArray(response.data.data)) {
          setSubscriptions(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching subscriptions:", error);
      }
    };

    fetchSubscriptions();
  }, []);

  const handlePayment = async (subscription) => {
    if (!user || !userId) {
      toast.error("User details not found. Please log in.");
      return;
    }
    setSelectedPlan(subscription.id); // Mark selected subscription

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/admin/initialize-payment`,
        {
          userId,
          planId: subscription.id,
        }
      );

      if (response.data.success && response.data.transaction) {
        const transactionId = response.data.transaction.transactionId;
        console.log("Transaction ID created:", transactionId);
        setTxRef(transactionId);
      } else {
        throw new Error("Failed to create transaction ID");
      }
    } catch (error) {
      console.error("Error initiating payment:", error);
      toast.error("Failed to initiate payment. Please try again.");
    }
  };

  return (
    <div className="bg-[#043D12] w-full h-screen py-16 flex flex-col justify-center items-center">
      <div className="container mx-auto px-[5vw] flex flex-col items-center gap-4">
        <h1 className="text-[#B4B3B3] lg:text-[30px] text-[20px] w-[90%] md:w-[60%] mx-auto text-center">
          Stay Connected, Stay Promoted: <br className="max-lg:hidden" /> Your
          All-in-One Plan
        </h1>

        {/* Horizontal Scroll Container */}
        <div className="w-[90%] md:w-[70%] overflow-x-auto whitespace-nowrap flex gap-6 py-4">
          {subscriptions.length > 0 ? (
            subscriptions.map((subscription) => (
              <div
                key={subscription.id}
                className={`details min-w-[250px] md:min-w-[300px] px-10 py-10 bg-[#FFFDF2] shadow-lg rounded-lg flex flex-col transition-all duration-300 
                  ${
                    selectedPlan === subscription.id ? "scale-110" : "scale-100"
                  }`} // Enlarges selected plan
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
                  {/* Subscription Buttons */}
                  <div className="shadow-lg mt-8 register px-6 md:px-14 md:py-4 py-3 bg-[#043D12] rounded-[9px] text-[#FFFDF2] flex flex-col gap-2">
                    {selectedPlan !== subscription.id && ( // Hide "Subscribe Now" if selected
                      <button
                        className="cursor-pointer bg-transparent text-white font-medium text-[18px] border-2 border-white px-4 py-2 rounded-lg"
                        onClick={() => handlePayment(subscription)}
                      >
                        Subscribe Now
                      </button>
                    )}

                    {selectedPlan === subscription.id &&
                      txRef && ( // Show "Proceed with Payment" only for selected plan
                        <FlutterWaveButton
                          className="cursor-pointer bg-transparent text-white font-medium text-[18px] border-2 border-white px-4 py-2 rounded-lg"
                          public_key={PUBLIC_KEY}
                          tx_ref={txRef}
                          amount={subscription.price}
                          currency="NGN"
                          payment_options="card, banktransfer, ussd"
                          customer={{
                            email: user?.email,
                            name: `${user.firstName || ""} ${
                              user.lastName || ""
                            }`.trim(),
                          }}
                          customizations={{
                            title: "MBO Subscription",
                            description: `Payment for ${subscription.name}`,
                            logo: "/mbo-logo.png",
                          }}
                          callback={(paymentResponse) => {
                            console.log(
                              "Flutterwave response:",
                              paymentResponse
                            );
                            if (paymentResponse.status === "successful") {
                              toast.success(
                                "Payment successful! Redirecting..."
                              );
                              setTimeout(() => {
                                navigate("/business-profile");
                              }, 1500); // Redirect after 2 seconds
                            } else {
                              toast.error("Payment failed. Please try again.");
                            }
                            closePaymentModal();
                          }}
                          onClose={() => console.log("Payment closed")}
                          text="Proceed with Payment"
                        />
                      )}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-white">Loading subscriptions...</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Subscribe;
