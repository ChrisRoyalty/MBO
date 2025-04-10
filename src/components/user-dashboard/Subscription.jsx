import React, { useState, useEffect } from "react";
import { ImNotification } from "react-icons/im";
import axios from "axios";
import { useSelector } from "react-redux";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import EditHeader from "./EditHeader";

const Subscription = () => {
  const [subscriptionData, setSubscriptionData] = useState({
    planName: "No Active Plan",
    price: "0.00",
    nextBillingDate: "Not Subscribed",
    subscriptionStatus: "inactive",
  });
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  const { token } = useSelector((state) => state.auth);

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
          }
        );

        if (response.data?.success && response.data?.data?.member) {
          const { member } = response.data.data;
          const subscription = member.subscription || {};

          setSubscriptionData({
            planName: subscription.name || "No Active Plan",
            price: subscription.price
              ? `$${parseFloat(subscription.price).toFixed(2)}`
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
        console.error("Error fetching profile:", error);
        toast.error(
          error.response?.data?.message || "Failed to fetch subscription data."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [token]);

  const handleChangePlan = () => setShowModal(true);
  const closeModal = () => setShowModal(false);

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

        <div className=" btns hidden justify-start lg:pt-6 pb-12">
          <button
            onClick={handleChangePlan}
            className="border-[1px] border-[#6A7368] text-[#6A7368] rounded-[11px] text-[15px] px-2 lg:px-8 py-3 shadow-lg hover:text-white hover:bg-[#043D12]"
          >
            Change Plan
          </button>
        </div>

        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg max-w-md w-full">
              <h2 className="text-xl font-semibold text-[#043D12] mb-4">
                Change Plan
              </h2>
              <p className="text-[#6A7368] mb-6">
                The change plan feature is not yet available. Please check back
                later.
              </p>
              <div className="flex justify-end">
                <button
                  onClick={closeModal}
                  className="px-4 py-2 bg-[#043D12] text-white rounded hover:bg-[#043D12]/90"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Subscription;
