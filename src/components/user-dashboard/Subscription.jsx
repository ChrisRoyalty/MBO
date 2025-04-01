import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { TbCurrencyNaira } from "react-icons/tb";
import { FlutterWaveButton, closePaymentModal } from "flutterwave-react-v3";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import Good from "../../components/svgs/Good";
import { useNavigate } from "react-router-dom";

const PUBLIC_KEY = import.meta.env.VITE_FLUTTERWAVE_PUBLIC_KEY;
const FRONT_URL = import.meta.env.VITE_BASE_URL_LOCAL;
const MAIN_URL = import.meta.env.VITE_BASE_URL_MAIN;

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

  // Updated SuccessModal with a modern, elegant design
  const SuccessModal = ({ onClose, userName }) => {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black/70 z-50 animate-fadeIn">
        <div className="bg-gradient-to-br from-[#FFFDF2] to-[#E8F5E9] rounded-[30px] p-8 max-w-lg w-full text-center shadow-2xl transform transition-all duration-500 scale-100 hover:scale-105">
          <div className="relative">
            <div className="absolute inset-0 bg-confetti bg-cover opacity-20 rounded-[30px]"></div>
            <h2 className="text-[28px] font-extrabold text-[#043D12] mb-4 relative z-10 animate-bounceIn">
              🎉 Congratulations, {userName}!
            </h2>
            <p className="text-[#6A7368] text-[18px] mb-6 relative z-10">
              You’ve successfully subscribed! Take the next step to unlock your
              full potential by setting up your business profile. We’re excited
              to see you shine!
            </p>
            <div className="flex justify-center gap-4 relative z-10">
              <button
                onClick={() => {
                  onClose();
                  navigate("/business-profile", {
                    state: { subscriptionSuccess: true },
                  });
                }}
                className="bg-[#043D12] text-[#FFFDF2] rounded-full px-6 py-3 font-medium text-[16px] hover:bg-[#043D12]/85 transition-all duration-300 shadow-md"
              >
                Set Up My Profile
              </button>
              <button
                onClick={() => {
                  onClose();
                  navigate("/");
                }}
                className="bg-transparent border-2 border-[#043D12] text-[#043D12] rounded-full px-6 py-3 font-medium text-[16px] hover:bg-[#043D12]/10 transition-all duration-300"
              >
                Back to Home
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const handlePaymentCallback = async (paymentResponse) => {
    console.log("Flutterwave response:", paymentResponse);
    if (
      paymentResponse.status === "completed" ||
      paymentResponse.status === "successful"
    ) {
      try {
        const verificationResponse = await axios.post(
          `${import.meta.env.VITE_BASE_URL}/admin/verify-payment`,
          {
            transactionId: paymentResponse.transaction_id,
            txRef: paymentResponse.tx_ref,
            userId,
            planId: selectedPlan,
          }
        );
        console.log("Verification response:", verificationResponse.data);
        if (verificationResponse.data.success) {
          setShowSuccessModal(true); // Show the updated modal
        } else {
          throw new Error("Payment verification failed");
        }
      } catch (error) {
        console.error(
          "Error verifying payment:",
          error.response?.data || error
        );
        toast.error("Payment verification failed. Contact support.");
      }
    } else {
      toast.error("Payment failed. Please try again.");
    }
    setSelectedPlan(null);
    setTxRef(null);
    closePaymentModal();
  };

  return (
    <div className="bg-[#043D12] w-full lg:h-screen h-fit py-4 overflow-y-auto py-16 flex flex-col justify-center items-center">
      <div className="container mx-auto px-[5vw] flex flex-col items-center gap-4">
        <h1 className="text-[#B4B3B3] lg:text-[30px] text-[20px] w-[90%] md:w-[60%] mx-auto text-center">
          Stay Connected, Stay Promoted: <br className="max-lg:hidden" /> Your
          All-in-One Plan
        </h1>

        <div className="w-[90%] overflow-x-auto whitespace-nowrap flex gap-6 py-4 items-center justify-center">
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
                          redirect_url={`${MAIN_URL}/business-profile`}
                          payment_options="banktransfer, card, ussd"
                          customer={{
                            email: user.email,
                            name: `${user.firstName} ${user.lastName}`,
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
        <SuccessModal
          onClose={() => setShowSuccessModal(false)}
          userName={`${user?.firstName} ${user?.lastName}`}
        />
      )}
    </div>
  );
};

export default Subscribe;
