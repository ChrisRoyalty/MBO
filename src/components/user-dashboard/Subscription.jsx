import React, { useState, useEffect } from "react";
import { ImNotification } from "react-icons/im";
import axios from "axios";
import { useSelector } from "react-redux";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";

const Subscription = () => {
  const [subscriptionData, setSubscriptionData] = useState({
    nextBillingDate: null,
    subscriptionId: null,
  });
  const [loading, setLoading] = useState(true);

  const { token } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  // Fetch profile data to get subscription details
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

        if (response.data && response.data.success && response.data.data) {
          const profile = response.data.data;
          const member = profile.member || {};

          // Use actual subscription date if available, otherwise set to "Not Subscribed"
          const nextBillingDate =
            member.subscription?.nextBillingDate || "Not Subscribed";

          setSubscriptionData({
            nextBillingDate,
            subscriptionId: member.id || null,
          });
        } else {
          toast.error("No profile data found in the response.");
        }
      } catch (error) {
        console.error("❌ Error Fetching Profile:", error);
        toast.error(
          error.response?.data?.message || "Failed to fetch subscription data."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [token]);

  // Handle navigation to /subscribe
  const handleChangePlan = () => {
    navigate("/subscribe");
  };

  // Loader Component
  const Loader = () => (
    <div className="flex space-x-2 items-center">
      <div className="w-3 h-3 bg-[#043D12] rounded-full animate-bounce"></div>
      <div className="w-3 h-3 bg-[#043D12] rounded-full animate-bounce delay-200"></div>
      <div className="w-3 h-3 bg-[#043D12] rounded-full animate-bounce delay-400"></div>
    </div>
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-[#FFFDF2]">
        <Loader />
      </div>
    );
  }

  return (
    <div className="w-full text-[#6A7368] flex flex-col gap-10">
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <h2 className="text-[16px] text-[#043D12] font-medium border-b-[1px] border-[#6A7368] px-2 py-1 w-fit">
        Manage Subscription
      </h2>
      <div className="subscription-board">
        <div className="bg-[#043D121A] flex items-center px-8 h-[30vh]">
          <p className="text-[#043D12] text-[20px]">Your Current Plan</p>
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
              Next billing date:{" "}
              {subscriptionData.nextBillingDate === "Not Subscribed"
                ? "Not Subscribed"
                : subscriptionData.nextBillingDate
                ? new Date(subscriptionData.nextBillingDate).toLocaleDateString(
                    "en-US",
                    { day: "numeric", month: "short", year: "numeric" }
                  )
                : "N/A"}
            </button>
          </div>
        </div>
      </div>
      <div className="btns flex justify-start lg:pt-6 pb-12">
        <div className="w-fit flex items-center gap-6">
          <button
            onClick={handleChangePlan}
            className="border-[1px] border-[#6A7368] text-[#6A7368] rounded-[11px] text-[15px] px-2 lg:px-8 py-3 shadow-lg hover:text-white hover:bg-[#043D12]"
          >
            Change Plan
          </button>
        </div>
      </div>
    </div>
  );
};

export default Subscription;
