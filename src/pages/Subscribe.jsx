import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { TbCurrencyNaira } from "react-icons/tb";
import { FlutterWaveButton, closePaymentModal } from "flutterwave-react-v3";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import Good from "../components/svgs/Good";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import MboLogo from "../../src/assets/mindpower-logo.svg";
import {
  BanknotesIcon,
  CheckCircleIcon,
  RocketLaunchIcon,
  UserCircleIcon,
  MagnifyingGlassIcon,
  UsersIcon,
} from "@heroicons/react/24/outline";

const PUBLIC_KEY = import.meta.env.VITE_FLUTTERWAVE_PUBLIC_KEY;
const MAIN_URL = import.meta.env.VITE_BASE_URL_MAIN;

const IntroModal = ({ onClose, onProceed, subscriptions }) => {
  const hasMultiple = subscriptions.length > 1;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/60 z-50 px-4">
      <motion.div
        className="bg-[#FFFDF2] rounded-[20px] p-6 sm:p-8 w-full max-w-[90vw] sm:max-w-[600px] md:max-w-[700px] lg:max-w-[800px] max-h-[90vh] overflow-y-auto text-center shadow-xl border border-[#E8F5E9]"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
      >
        <motion.div
          className="flex justify-center mb-4 sm:mb-6"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.6, ease: "easeOut" }}
        >
          <img
            src={MboLogo}
            alt="MindPower Logo"
            className="w-16 sm:w-20 md:w-24 h-16 sm:h-20 md:h-24 animate-pulse-subtle"
          />
        </motion.div>

        <h2 className="text-[20px] sm:text-[24px] md:text-[28px] font-serif font-bold text-[#043D12] mb-2 tracking-tight">
          MindPower Business Online
        </h2>

        <p className="text-[#043D12] text-[13px] sm:text-[15px] font-medium mb-3 sm:mb-4 italic">
          {hasMultiple
            ? "Choose the right plan for your business"
            : "Elevate your business with MBO"}
        </p>

        <p className="text-[#6A7368] text-[12px] sm:text-[14px] mb-4 sm:mb-6 leading-relaxed">
          {hasMultiple
            ? "Select from our subscription plans to unlock visibility, networking, and growth opportunities."
            : "Join the MindPower Business Network with an annual subscription to unlock all benefits."}
        </p>

        <div className="mb-6">
          <h3 className="text-[#043D12] text-[14px] sm:text-[16px] font-semibold tracking-wide mb-3">
            {hasMultiple ? "Available Plans:" : "Subscription Plan:"}
          </h3>

          <div
            className={`space-y-4 ${
              hasMultiple ? "" : "max-w-[500px] mx-auto"
            }`}
          >
            {subscriptions.length > 0 ? (
              subscriptions.map((subscription) => (
                <motion.div
                  key={subscription.id}
                  className={`bg-white p-4 rounded-lg border border-[#E8F5E9] shadow-sm hover:shadow-md transition-all ${
                    hasMultiple ? "" : "w-full"
                  }`}
                  whileHover={{ scale: hasMultiple ? 1.02 : 1 }}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="text-[#043D12] font-bold text-[16px] sm:text-[18px]">
                        {subscription.name || "Business Plan"}
                      </h4>
                      <div className="flex items-center mt-1">
                        <TbCurrencyNaira className="text-[#043D12]" />
                        <span className="text-[#043D12] font-bold text-[20px] sm:text-[24px] ml-1">
                          {subscription.price || "15,000"}
                        </span>
                        <span className="text-[#6A7368] text-[12px] ml-2">
                          /year
                        </span>
                      </div>
                    </div>
                    {hasMultiple && (
                      <div className="bg-[#043D12]/10 text-[#043D12] text-[10px] sm:text-[12px] px-2 py-1 rounded-full">
                        {subscription.duration || "12 months"}
                      </div>
                    )}
                  </div>

                  {subscription.description && (
                    <p className="text-[#6A7368] text-[12px] sm:text-[13px] mt-2 text-left">
                      {subscription.description}
                    </p>
                  )}
                </motion.div>
              ))
            ) : (
              <p className="text-[#6A7368] text-[12px] sm:text-[14px] py-4">
                Loading available plans...
              </p>
            )}
          </div>
        </div>

        <div className="text-left space-y-3 sm:space-y-4 mb-6">
          <h3 className="text-[#043D12] text-[14px] sm:text-[16px] font-semibold tracking-wide">
            All Plans Include:
          </h3>
          <div className="flex items-start gap-2">
            <CheckCircleIcon className="w-4 sm:w-5 h-4 sm:h-5 text-[#043D12] mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-[#6A7368] text-[12px] sm:text-[14px]">
                <strong>Business Profile</strong>
              </p>
              <ul className="text-[#6A7368] text-[11px] sm:text-[13px] list-disc ml-4">
                <li>Maintain an active business presence</li>
                <li>Be discoverable within our network</li>
                <li>Collaborate with fellow entrepreneurs</li>
              </ul>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <RocketLaunchIcon className="w-4 sm:w-5 h-4 sm:h-5 text-[#043D12] mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-[#6A7368] text-[12px] sm:text-[14px]">
                <strong>Promotion & Visibility</strong>
              </p>
              <ul className="text-[#6A7368] text-[11px] sm:text-[13px] list-disc ml-4">
                <li>Amplify your business reach</li>
                <li>Feature in premium listings</li>
                <li>Attract more customers</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4 mt-4 sm:mt-6">
          <motion.button
            onClick={onClose}
            className="bg-transparent border-2 border-[#043D12] text-[#043D12] rounded-full px-5 sm:px-6 py-2 sm:py-2.5 font-medium text-[13px] sm:text-[14px] hover:bg-[#043D12]/10 transition-all duration-300 w-full sm:w-auto"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Back to Home
          </motion.button>
          <motion.button
            onClick={onProceed}
            className="bg-[#043D12] text-[#FFFDF2] rounded-full px-5 sm:px-6 py-2 sm:py-2.5 font-medium text-[13px] sm:text-[14px] shadow-md hover:bg-[#032d0e] transition-all duration-300 w-full sm:w-auto"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {hasMultiple ? "View Plans" : "Subscribe Now"}
          </motion.button>
        </div>

        <p className="text-[#6A7368] text-[10px] sm:text-[12px] mt-4 sm:mt-6 italic">
          Grow your network and elevate your business with MBO.
        </p>
      </motion.div>
    </div>
  );
};

const SuccessModal = ({ onClose, userName }) => {
  const navigate = useNavigate();
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/60 z-50 px-4">
      <motion.div
        className="bg-[#FFFDF2] rounded-[20px] p-6 sm:p-8 w-full max-w-[90vw] sm:max-w-[600px] md:max-w-[700px] lg:max-w-[800px] max-h-[90vh] overflow-y-auto text-center shadow-xl border border-[#E8F5E9]"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
      >
        <motion.div
          className="flex justify-center mb-4 sm:mb-6"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.6, ease: "easeOut" }}
        >
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
            <CheckCircleIcon className="w-12 h-12 text-green-600" />
          </div>
        </motion.div>

        <h2 className="text-[20px] sm:text-[24px] md:text-[28px] font-serif font-bold text-[#043D12] mb-2 tracking-tight">
          Welcome Aboard, {userName}!
        </h2>

        <p className="text-[#043D12] text-[13px] sm:text-[15px] font-medium mb-3 sm:mb-4 italic">
          Your MBO subscription is now active!
        </p>

        <p className="text-[#6A7368] text-[12px] sm:text-[14px] mb-4 sm:mb-6 leading-relaxed">
          You're officially part of the MindPower Business Network. Let's
          complete your profile to unlock all benefits:
        </p>

        <div className="text-left space-y-3 sm:space-y-4 mb-6">
          <div className="flex items-start gap-2">
            <UserCircleIcon className="w-4 sm:w-5 h-4 sm:h-5 text-[#043D12] mt-0.5 flex-shrink-0" />
            <p className="text-[#6A7368] text-[12px] sm:text-[14px]">
              <strong>Complete your business profile</strong> to establish your
              professional presence
            </p>
          </div>
          <div className="flex items-start gap-2">
            <MagnifyingGlassIcon className="w-4 sm:w-5 h-4 sm:h-5 text-[#043D12] mt-0.5 flex-shrink-0" />
            <p className="text-[#6A7368] text-[12px] sm:text-[14px]">
              <strong>Get discovered</strong> by potential customers and
              partners
            </p>
          </div>
          <div className="flex items-start gap-2">
            <UsersIcon className="w-4 sm:w-5 h-4 sm:h-5 text-[#043D12] mt-0.5 flex-shrink-0" />
            <p className="text-[#6A7368] text-[12px] sm:text-[14px]">
              <strong>Connect with other members</strong> in the MBO community
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4 mt-4 sm:mt-6">
          <motion.button
            onClick={() => {
              onClose();
              navigate("/business-profile", {
                state: { subscriptionSuccess: true },
              });
            }}
            className="bg-[#043D12] text-[#FFFDF2] rounded-full px-5 sm:px-6 py-2 sm:py-2.5 font-medium text-[13px] sm:text-[14px] shadow-md hover:bg-[#032d0e] transition-all duration-300 w-full sm:w-auto"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Complete My Profile
          </motion.button>
          <motion.button
            onClick={() => {
              onClose();
              navigate("/dashboard");
            }}
            className="bg-transparent border-2 border-[#043D12] text-[#043D12] rounded-full px-5 sm:px-6 py-2 sm:py-2.5 font-medium text-[13px] sm:text-[14px] hover:bg-[#043D12]/10 transition-all duration-300 w-full sm:w-auto"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Go to Dashboard
          </motion.button>
        </div>

        <p className="text-[#6A7368] text-[10px] sm:text-[12px] mt-4 sm:mt-6 italic">
          Your profile setup takes just 5 minutes - let's maximize your
          membership!
        </p>
      </motion.div>
    </div>
  );
};

const Subscribe = () => {
  const navigate = useNavigate();
  const [subscriptions, setSubscriptions] = useState([]);
  const [userId, setUserId] = useState(null);
  const [txRefs, setTxRefs] = useState({});
  const [isLoadingSubscriptions, setIsLoadingSubscriptions] = useState(true);
  const [isLoadingUser, setIsLoadingUser] = useState(true);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showIntroModal, setShowIntroModal] = useState(true);
  const [initializingPayments, setInitializingPayments] = useState(false);

  const user = useSelector((state) => state.auth.user);
  const token = useSelector((state) => state.auth.token);

  useEffect(() => {
    if (!token) {
      toast.error("User not authenticated. Please log in.");
      navigate("/login");
      return;
    }

    try {
      const decodedToken = jwtDecode(token);
      setUserId(decodedToken.id);
      setIsLoadingUser(false);
    } catch (error) {
      console.error("Invalid token:", error);
      toast.error("Session expired, please log in again.");
      navigate("/login");
    }
  }, [token, navigate]);

  useEffect(() => {
    const fetchSubscriptions = async () => {
      setIsLoadingSubscriptions(true);
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/admin/get-sub`
        );
        if (response.data && Array.isArray(response.data.data)) {
          setSubscriptions(response.data.data);
          initializePayments(response.data.data);
        } else {
          toast.error("Invalid subscription data received.");
        }
      } catch (error) {
        console.error("Error fetching subscriptions:", error);
        toast.error("Failed to load subscriptions. Please try again.");
      } finally {
        setIsLoadingSubscriptions(false);
      }
    };

    if (!isLoadingUser && userId) {
      fetchSubscriptions();
    }
  }, [isLoadingUser, userId]);

  const initializePayments = async (subs) => {
    if (!user || !userId) return;

    setInitializingPayments(true);
    try {
      const newTxRefs = {};
      for (const subscription of subs) {
        const response = await axios.post(
          `${import.meta.env.VITE_BASE_URL}/admin/initialize-payment`,
          { userId, planId: subscription.id }
        );
        if (response.data.success && response.data.transaction?.transactionId) {
          newTxRefs[subscription.id] = response.data.transaction.transactionId;
        }
      }
      setTxRefs(newTxRefs);
    } catch (error) {
      console.error("Error initializing payments:", error);
      toast.error("Payment initialization failed. Please refresh the page.");
    } finally {
      setInitializingPayments(false);
    }
  };

  const handlePaymentCallback = async (paymentResponse) => {
  if (
    paymentResponse.status === "completed" ||
    paymentResponse.status === "successful"
  ) {
    setShowSuccessModal(true);
  } else {
    toast.error("Payment failed. Please try again.");
  }
  closePaymentModal();
};


  if (isLoadingUser) {
    return (
      <div className="text-white text-center py-16">Loading user data...</div>
    );
  }

  if (!user || !userId) {
    return null;
  }

  const hasMultipleSubscriptions = subscriptions.length > 1;

  return (
    <div className="bg-[#043D12] w-full lg:h-screen h-fit overflow-y-auto py-16 flex flex-col justify-center items-center">
      {showIntroModal && (
        <IntroModal
          onClose={() => navigate("/")}
          onProceed={() => setShowIntroModal(false)}
          subscriptions={subscriptions}
        />
      )}

      {!showIntroModal && (
        <div className="container mx-auto px-[5vw] flex flex-col items-center gap-4">
          <h1 className="text-[#B4B3B3] lg:text-[30px] text-[20px] w-[90%] md:w-[60%] mx-auto text-center">
            {hasMultipleSubscriptions
              ? "Choose Your Subscription Plan"
              : "MindPower Business Online Subscription"}
          </h1>

          <div
            className={`w-full flex ${
              hasMultipleSubscriptions
                ? "justify-start md:justify-center"
                : "justify-center"
            }`}
          >
            <div
              className={`
                ${
                  hasMultipleSubscriptions ? "w-[90%]" : "w-full max-w-[700px]"
                } 
                overflow-x-auto whitespace-nowrap flex gap-6 py-4 items-center
                ${
                  hasMultipleSubscriptions
                    ? "justify-start md:justify-center"
                    : "justify-center"
                }
              `}
            >
              {isLoadingSubscriptions ? (
                <p className="text-white">Loading subscriptions...</p>
              ) : subscriptions.length > 0 ? (
                subscriptions.map((subscription) => (
                  <div
                    key={subscription.id}
                    className={`
                      ${
                        hasMultipleSubscriptions
                          ? "min-w-[250px] md:min-w-[300px]"
                          : "w-full"
                      }
                      px-10 py-10 bg-[#FFFDF2] shadow-lg rounded-lg flex 
                      ${
                        hasMultipleSubscriptions
                          ? "flex-col"
                          : "flex-row max-lg:flex-col"
                      } 
                      gap-8 transition-all duration-300
                    `}
                  >
                    <div
                      className={`amount w-full flex flex-col items-center ${
                        !hasMultipleSubscriptions ? "lg:pt-8" : ""
                      }`}
                    >
                      <h1 className="lg:text-[50px] text-[45px] text-[#043D12] flex items-center gap-0">
                        <TbCurrencyNaira />
                        {subscription.price || "N/A"}
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
                      <div className="shadow-lg mt-8 register px-6 md:px-14 md:py-4 py-3 bg-[#043D12] rounded-[9px] text-[#FFFDF2] flex flex-col gap-2 w-full max-w-[300px]">
                        {initializingPayments ? (
                          <p className="text-white text-[18px]">
                            Preparing payment...
                          </p>
                        ) : txRefs[subscription.id] ? (
                          <FlutterWaveButton
                            className="cursor-pointer bg-transparent text-white font-medium text-[18px] border-2 border-white px-4 py-2 rounded-lg w-full"
                            public_key={PUBLIC_KEY}
                            tx_ref={txRefs[subscription.id]}
                            amount={subscription.price || 0}
                            currency="NGN"
                            redirect_url={`${MAIN_URL}/business-profile`}
                            payment_options="banktransfer, card, ussd"
                            customer={{
                              email: user.email || "guest@example.com",
                              name: `${user.firstName || "Guest"} ${
                                user.lastName || ""
                              }`,
                            }}
                            customizations={{
                              title: "MBO Subscription",
                              description: `Payment for ${
                                subscription.name || "Subscription"
                              }`,
                              logo: "/mbo-logo.png",
                            }}
                            callback={handlePaymentCallback}
                            onClose={() => console.log("Payment modal closed")}
                            text="Pay Now"
                          />
                        ) : (
                          <p className="text-white text-[18px]">
                            Payment unavailable
                          </p>
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
        </div>
      )}

      {showSuccessModal && (
        <SuccessModal
          onClose={() => setShowSuccessModal(false)}
          userName={`${user.firstName || "User"} ${user.lastName || ""}`}
        />
      )}
    </div>
  );
};

export default Subscribe;
