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

// SuccessModal in Subscribe component
const SuccessModal = ({ onClose }) => {
  const navigate = useNavigate();

  const handleAcknowledge = () => {
    onClose(); // Close the modal
    navigate("/business-profile", { state: { subscriptionSuccess: true } }); // Pass success flag
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/60 bg-opacity-50 z-50">
      <div className="bg-[#FFFDF2] rounded-[27px] p-8 max-w-md w-full text-center shadow-lg">
        <h2 className="text-[24px] font-bold text-[#043D12] mb-4">
          🎉 Payment Successful!
        </h2>
        <p className="text-[#6A7368] mb-6">
          Thank you for subscribing! Your payment was successful. Click below to
          access your business profile.
        </p>
        <button
          onClick={handleAcknowledge}
          className="bg-[#043D12] text-[#FFFDF2] rounded-[27px] px-6 py-2 hover:bg-[#043D12]/75 transition-colors"
        >
          Go to Business Profile
        </button>
      </div>
    </div>
  );
};

const Subscribe = () => {
  const navigate = useNavigate();
  const [subscriptions, setSubscriptions] = useState([]);
  const [userId, setUserId] = useState(null);
  const [txRef, setTxRef] = useState(null);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [isLoadingPayment, setIsLoadingPayment] = useState(false);
  const [isLoadingSubscriptions, setIsLoadingSubscriptions] = useState(true);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const user = useSelector((state) => state.auth.user);
  const token = useSelector((state) => state.auth.token);

  useEffect(() => {
    console.log("Token from Redux:", token);
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        console.log("Decoded token:", decodedToken);
        setUserId(decodedToken.id);
      } catch (error) {
        console.error("Invalid token:", error);
        toast.error("Session expired, please log in again.");
        navigate("/login");
      }
    } else {
      toast.error("User not authenticated. Please log in.");
      navigate("/login");
    }
  }, [token, navigate]);

  useEffect(() => {
    const fetchSubscriptions = async () => {
      setIsLoadingSubscriptions(true);
      try {
        console.log(
          "Fetching from:",
          `${import.meta.env.VITE_BASE_URL}/admin/get-sub`
        );
        const response = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/admin/get-sub`
        );
        console.log("API Response:", response.data);
        if (response.data && Array.isArray(response.data.data)) {
          setSubscriptions(response.data.data);
        } else {
          console.warn("Unexpected response format:", response.data);
          toast.error("Invalid subscription data.");
        }
      } catch (error) {
        console.error("Error fetching subscriptions:", error);
        toast.error("Failed to load subscriptions. Please refresh.");
      } finally {
        setIsLoadingSubscriptions(false);
      }
    };

    fetchSubscriptions();
  }, []);

  const handlePayment = async (subscription) => {
    if (!user || !userId) {
      toast.error("User details not found. Please log in.");
      navigate("/login");
      return;
    }
    setSelectedPlan(subscription.id);
    setIsLoadingPayment(true);

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
      setSelectedPlan(null);
    } finally {
      setIsLoadingPayment(false);
    }
  };

  const handlePaymentCallback = (paymentResponse) => {
    console.log("Flutterwave response:", paymentResponse);
    if (paymentResponse.status === "successful") {
      setShowSuccessModal(true);
    } else {
      toast.error("Payment failed. Please try again.");
      setSelectedPlan(null);
      setTxRef(null);
    }
    closePaymentModal();
  };

  return (
    <div className="bg-[#043D12] w-full h-screen py-16 flex flex-col justify-center items-center">
      <div className="container mx-auto px-[5vw] flex flex-col items-center gap-4">
        <h1 className="text-[#B4B3B3] lg:text-[30px] text-[20px] w-[90%] md:w-[60%] mx-auto text-center">
          Stay Connected, Stay Promoted: <br className="max-lg:hidden" /> Your
          All-in-One Plan
        </h1>

        <div className="w-[90%] md:w-[70%] overflow-x-auto whitespace-nowrap flex gap-6 py-4 scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200 items-center justify-center">
          {isLoadingSubscriptions ? (
            <p className="text-white">Loading subscriptions...</p>
          ) : subscriptions.length > 0 ? (
            subscriptions.map((subscription) => (
              <div
                key={subscription.id}
                className={`details min-w-[250px] md:min-w-[300px] px-10 py-10 bg-[#FFFDF2] shadow-lg rounded-lg flex max-lg:flex-col gap-8 transition-all duration-300 
                  ${
                    selectedPlan === subscription.id ? "scale-110" : "scale-100"
                  }`}
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
                    {selectedPlan !== subscription.id && (
                      <button
                        className="cursor-pointer bg-transparent text-white font-medium text-[18px] border-2 border-white px-4 py-2 rounded-lg"
                        onClick={() => handlePayment(subscription)}
                        disabled={isLoadingPayment}
                      >
                        Subscribe Now
                      </button>
                    )}

                    {selectedPlan === subscription.id && isLoadingPayment && (
                      <p className="text-white text-[18px]">
                        Initializing payment...
                      </p>
                    )}

                    {selectedPlan === subscription.id &&
                      txRef &&
                      !isLoadingPayment && (
                        <FlutterWaveButton
                          className="cursor-pointer bg-transparent text-white font-medium text-[18px] border-2 border-white px-4 py-2 rounded-lg"
                          public_key={PUBLIC_KEY}
                          tx_ref={txRef}
                          amount={subscription.price}
                          currency="NGN"
                          payment_options="banktransfer, card, ussd" // Updated here
                          customer={{
                            email: user?.email || "default@example.com",
                            name: user
                              ? `${user.firstName || ""} ${
                                  user.lastName || ""
                                }`.trim() || "Anonymous"
                              : "Anonymous",
                          }}
                          customizations={{
                            title: "MBO Subscription",
                            description: `Payment for ${subscription.name}`,
                            logo: "/mbo-logo.png",
                          }}
                          callback={handlePaymentCallback}
                          onClose={() => {
                            console.log("Payment modal closed");
                            setSelectedPlan(null);
                            setTxRef(null);
                          }}
                          text="Proceed with Payment"
                        />
                      )}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-white">No subscriptions available.</p>
          )}
        </div>
      </div>

      {showSuccessModal && (
        <SuccessModal onClose={() => setShowSuccessModal(false)} />
      )}
    </div>
  );
};

export default Subscribe;
