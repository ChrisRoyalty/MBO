import React, { useState, useEffect } from "react";
import { ImNotification } from "react-icons/im";
import axios from "axios";
import { useSelector } from "react-redux";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import EditHeader from "./EditHeader";

const Subscription = () => {
  const [subscriptionData, setSubscriptionData] = useState({
    planName: "No Active Plan",
    price: "0.00",
    nextBillingDate: "Not Subscribed",
    subscriptionStatus: "inactive",
  });
  const [loading, setLoading] = useState(true);
  const [subscribeLoading, setSubscribeLoading] = useState(false);

  const { token } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      toast.error("No authentication token found!");
      setLoading(false);
      return;
    }

    const fetchProfile = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/member/my-profile`,
          {
            headers: { Authorization: `Bearer ${token}` },
            timeout: 10000,
          }
        );

        if (response.data?.success && response.data?.data?.member) {
          const { member } = response.data.data;
          const subscription = member.subscription || {};

          setSubscriptionData({
            planName: subscription.name || "No Active Plan",
            price: subscription.price
              ? `₦${parseFloat(subscription.price).toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}`
              : "0.00",
            nextBillingDate: member.subscriptionEndDate
              ? new Date(member.subscriptionEndDate).toLocaleDateString(
                  "en-US",
                  {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  }
                )
              : "Not Subscribed",
            subscriptionStatus: member.subscriptionStatus || "inactive",
          });
        }
      } catch (error) {
        console.error(
          "Error fetching profile:",
          error.response?.data || error.message
        );
        toast.error(
          error.response?.data?.message || "Failed to fetch subscription data."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [token]);

  const handleSubscribe = () => {
    if (subscribeLoading) return;
    setSubscribeLoading(true);
    console.log("Navigating to /subscribe from UserDashboard");
    toast.info("Redirecting to subscription plans...");
    setTimeout(() => {
      navigate("/subscribe?fromUserDashboard=true");
      setSubscribeLoading(false);
    }, 500);
  };

  const Loader = () => (
    <div className="flex space-x-2 items-center">
      {[...Array(3)].map((_, i) => (
        <div
          key={i}
          className="w-3 h-3 bg-[#043D12] rounded-full animate-bounce"
          style={{ animationDelay: `${i * 200}ms` }}
        />
      ))}
    </div>
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-white">
        <Loader />
      </div>
    );
  }

  return (
    <div className="w-full text-[#6A7368] flex flex-col gap-10 relative">
      <EditHeader />
      <ToastContainer position="top-right" autoClose={5000} />
      <div className="container px-[5vw] mx-auto">
        <h2 className="text-[16px] text-[#043D12] font-medium border-b-[1px] border-[#6A7368] px-2 py-1 w-fit">
          Manage Subscription
        </h2>

        <div className="subscription-board mt-6">
          <div className="bg-[#043D121A] flex items-center px-8 h-[30vh]">
            <div>
              <p className="text-[#043D12] text-[20px]">Your Current Plan</p>
              <p className="text-[18px] font-semibold text-[#043D12] mt-2">
                {subscriptionData.planName} - {subscriptionData.price}
              </p>
              <p className="text-[#043D12] text-[16px] mt-2">
                Status:{" "}
                <span
                  className={`font-semibold ${
                    subscriptionData.subscriptionStatus === "active"
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {subscriptionData.subscriptionStatus.toUpperCase()}
                </span>
              </p>
            </div>
          </div>

          <div className="w-full bg-[#043D12] grid md:grid-cols-2 px-8 py-8 text-[#FFFDF2] max-lg:gap-6">
            <ul className="list-disc pl-5">
              <li>Access to all services</li>
              <li>Unlimited usage</li>
              <li>Cancel Anytime</li>
            </ul>

            <div className="w-full flex items-center justify-center">
              <button className="max-lg:w-full flex items-center max-lg:justify-center text-[14px] text-[#FFFDF2] rounded-[11px] shadow px-2 sm:px-4 py-4 gap-2 bg-[#6A736899]">
                <ImNotification className="text-[20px]" />
                Next billing date: {subscriptionData.nextBillingDate}
              </button>
            </div>
          </div>
        </div>

        {subscriptionData.subscriptionStatus === "inactive" && (
          <div className="flex justify-start pt-6 pb-12">
            <motion.button
              onClick={handleSubscribe}
              disabled={subscribeLoading}
              className={`flex items-center justify-center text-[15px] px-8 py-3 rounded-[11px] shadow-lg transition-all duration-300 ${
                subscribeLoading
                  ? "bg-[#043D12]/50 text-[#FFFDF2]/50 cursor-not-allowed"
                  : "bg-[#043D12] text-[#FFFDF2] hover:bg-[#032d0e]"
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {subscribeLoading ? (
                <div className="flex space-x-2 items-center">
                  <div className="w-4 h-4 border-2 border-[#FFFDF2] border-t-transparent rounded-full animate-spin" />
                  <span>Redirecting...</span>
                </div>
              ) : (
                "Subscribe Now"
              )}
            </motion.button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Subscription;
