import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { IoIosNotificationsOutline } from "react-icons/io";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";
import { CiUser } from "react-icons/ci";
import { BiPlus, BiSearch } from "react-icons/bi";
import { IoArrowDown, IoClose } from "react-icons/io5";
import { RiEqualizerLine } from "react-icons/ri";
import { BsThreeDots } from "react-icons/bs";
import {
  FiLock,
  FiTrash2,
  FiUser,
  FiKey,
  FiEye,
  FiEyeOff,
  FiAlertCircle,
  FiCheckCircle,
} from "react-icons/fi";
import { AiOutlineClose } from "react-icons/ai";
import { toast } from "react-toastify";

const ManageSubscription = () => {
  const [activeSubscriptions, setActiveSubscriptions] = useState([]);
  const [expiredSubscriptions, setExpiredSubscriptions] = useState([]);
  const [filteredSubscriptions, setFilteredSubscriptions] = useState([]);
  const [plans, setPlans] = useState([]); // To store subscription plans from admin/get-sub
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeFilter, setActiveFilter] = useState("Active");
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [showResetButton, setShowResetButton] = useState(false);
  const [activePlan, setActivePlan] = useState(null);
  const [deletePlan, setDeletePlan] = useState(null);
  const [editFormData, setEditFormData] = useState({
    name: "",
    description: "",
    price: "",
  });
  const [resetFormData, setResetFormData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false);
  const [passwordValidation, setPasswordValidation] = useState("");
  const [profileData, setProfileData] = useState({
    firstname: "",
    lastname: "",
  });
  const [dateFilter, setDateFilter] = useState("All Time"); // New state for date filter
  const [showDateDropdown, setShowDateDropdown] = useState(false); // Toggle dropdown visibility

  const navigate = useNavigate();
  const { isAuthenticated, user, token } = useSelector((state) => state.auth);

  const resetModalRef = useRef(null);
  const resetButtonRef = useRef(null);
  const editModalRef = useRef(null);
  const deleteModalRef = useRef(null);
  const dateDropdownRef = useRef(null);

  useEffect(() => {
    if (!isAuthenticated || !token) {
      setError("Not authenticated or missing token!");
      setLoading(false);
      navigate("/login", { replace: true });
      return;
    }

    if (user && user.firstName && user.lastName) {
      setProfileData({
        firstname: user.firstName,
        lastname: user.lastName,
      });
    } else {
      console.warn("User data missing in Redux store, using defaults.", user);
      setProfileData({
        firstname: "Admin",
        lastname: "User",
      });
    }

    const fetchSubscriptionsAndPlans = async () => {
      try {
        // Fetch active subscriptions
        const activeResponse = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/admin/active-suscribers`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        console.log("Active Subscriptions Response:", activeResponse.data);
        if (
          activeResponse.data &&
          Array.isArray(activeResponse.data.activeMembers)
        ) {
          setActiveSubscriptions(activeResponse.data.activeMembers);
          if (activeFilter === "Active") {
            setFilteredSubscriptions(activeResponse.data.activeMembers);
          }
        } else {
          throw new Error("No active subscription data found in the response.");
        }

        // Fetch expired subscriptions
        const expiredResponse = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/admin/expired-suscribers`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        console.log("Expired Subscriptions Response:", expiredResponse.data);
        if (
          expiredResponse.data &&
          Array.isArray(expiredResponse.data.expiredMembers)
        ) {
          setExpiredSubscriptions(expiredResponse.data.expiredMembers);
          if (activeFilter === "Expired") {
            setFilteredSubscriptions(expiredResponse.data.expiredMembers);
          }
        } else {
          throw new Error(
            "No expired subscription data found in the response."
          );
        }

        // Fetch all subscription plans using admin/get-sub
        const plansResponse = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/admin/get-sub`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        console.log("Plans Response:", plansResponse.data);
        if (plansResponse.data && Array.isArray(plansResponse.data.data)) {
          setPlans(plansResponse.data.data);
        } else {
          throw new Error("No plans found in the response.");
        }
      } catch (error) {
        console.error("❌ Error Fetching Data:", error);
        if (
          error.response?.status === 404 ||
          error.response?.data?.message?.includes("not found")
        ) {
          setError("No data found.");
        } else {
          setError(error.response?.data?.message || "Failed to fetch data.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchSubscriptionsAndPlans();
  }, [isAuthenticated, token, navigate, user, activeFilter]);

  useEffect(() => {
    const filterSubscriptions = () => {
      let filtered = [];

      if (activeFilter === "Active") {
        filtered = [...activeSubscriptions];
      } else if (activeFilter === "Expired") {
        filtered = [...expiredSubscriptions];
      } else if (activeFilter === "Cancelled") {
        filtered = [];
      }

      // Apply date filter
      filtered = applyDateFilter(filtered);

      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        filtered = filtered.filter((sub) => {
          const planName = sub.subscription.name.toLowerCase();
          const email = sub.email.toLowerCase();
          return planName.includes(query) || email.includes(query);
        });
      }

      setFilteredSubscriptions(filtered);
    };

    const debounceTimeout = setTimeout(() => {
      filterSubscriptions();
    }, 300);

    return () => clearTimeout(debounceTimeout);
  }, [
    searchQuery,
    activeSubscriptions,
    expiredSubscriptions,
    activeFilter,
    dateFilter,
  ]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        resetModalRef.current &&
        !resetModalRef.current.contains(event.target)
      ) {
        setIsResetModalOpen(false);
        setResetFormData({
          oldPassword: "",
          newPassword: "",
          confirmNewPassword: "",
        });
        setPasswordValidation("");
      }
      if (
        resetButtonRef.current &&
        !resetButtonRef.current.contains(event.target)
      ) {
        setShowResetButton(false);
      }
      if (
        editModalRef.current &&
        !editModalRef.current.contains(event.target)
      ) {
        setIsEditModalOpen(false);
        setActivePlan(null);
        setEditFormData({ name: "", description: "", price: "" });
      }
      if (
        deleteModalRef.current &&
        !deleteModalRef.current.contains(event.target)
      ) {
        setIsDeleteModalOpen(false);
        setDeletePlan(null);
      }
      if (
        dateDropdownRef.current &&
        !dateDropdownRef.current.contains(event.target)
      ) {
        setShowDateDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "Invalid Date";
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const applyDateFilter = (subscriptions) => {
    const now = new Date();
    return subscriptions.filter((sub) => {
      const endDate = new Date(sub.subscriptionEndDate);
      if (isNaN(endDate.getTime())) return false;

      switch (dateFilter) {
        case "Last Month":
          const lastMonth = new Date(now.setMonth(now.getMonth() - 1));
          return endDate >= lastMonth && endDate <= now;
        case "Last 3 Months":
          const last3Months = new Date(now.setMonth(now.getMonth() - 3));
          return endDate >= last3Months && endDate <= now;
        case "Last 6 Months":
          const last6Months = new Date(now.setMonth(now.getMonth() - 6));
          return endDate >= last6Months && endDate <= now;
        case "Custom Range":
          // This would require additional state for start and end dates (not implemented here)
          return true; // Placeholder, implement custom range logic if needed
        case "All Time":
        default:
          return true;
      }
    });
  };

  const toggleResetButton = () => {
    setShowResetButton((prev) => !prev);
  };

  const handleResetPassword = () => {
    setIsResetModalOpen(true);
    setShowResetButton(false);
  };

  const handleEditPlan = () => {
    setIsEditModalOpen(true);
    if (plans.length > 0) {
      setActivePlan(plans[0]); // Default to first plan
      setEditFormData({
        name: plans[0].name,
        description: plans[0].description || "",
        price: plans[0].price || "",
      });
    }
  };

  const handleSelectPlan = (plan) => {
    setActivePlan(plan);
    setEditFormData({
      name: plan.name,
      description: plan.description || "",
      price: plan.price || "",
    });
  };

  const handleAddPlan = () => {
    setActivePlan(null);
    setEditFormData({ name: "", description: "", price: "" });
    setIsEditModalOpen(true); // Ensure the modal is open when adding a new plan
  };

  const handleDeletePlan = async () => {
    if (!deletePlan?.id) return;

    try {
      const response = await axios.delete(
        `${import.meta.env.VITE_BASE_URL}/admin/delete-sub/${deletePlan.id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success(response.data.message || "Plan deleted successfully.");
      setPlans((prev) => prev.filter((p) => p.id !== deletePlan.id));
      setActiveSubscriptions((prev) =>
        prev.filter((sub) => sub.subscription.id !== deletePlan.id)
      );
      setExpiredSubscriptions((prev) =>
        prev.filter((sub) => sub.subscription.id !== deletePlan.id)
      );
      setFilteredSubscriptions((prev) =>
        prev.filter((sub) => sub.subscription.id !== deletePlan.id)
      );
      setIsDeleteModalOpen(false);
      setDeletePlan(null);
      setIsEditModalOpen(false);
    } catch (error) {
      console.error("❌ Error Deleting Plan:", error);
      toast.error(error.response?.data?.message || "Failed to delete plan.");
    }
  };

  const handleEditFormChange = (e) => {
    const { name, value } = e.target;
    setEditFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!editFormData.name || !editFormData.price) {
      toast.error("Plan name and price are required.");
      return;
    }

    try {
      if (activePlan) {
        // Update existing plan
        const response = await axios.patch(
          `${import.meta.env.VITE_BASE_URL}/admin/edit-sub/${activePlan.id}`,
          {
            name: editFormData.name,
            price: parseFloat(editFormData.price),
            description: editFormData.description,
          },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        toast.success(response.data.message || "Plan updated successfully.");
        setPlans((prev) =>
          prev.map((p) =>
            p.id === activePlan.id
              ? {
                  ...p,
                  name: editFormData.name,
                  price: editFormData.price,
                  description: editFormData.description,
                }
              : p
          )
        );
        setActiveSubscriptions((prev) =>
          prev.map((sub) =>
            sub.subscription.id === activePlan.id
              ? {
                  ...sub,
                  subscription: {
                    ...sub.subscription,
                    name: editFormData.name,
                    price: editFormData.price,
                    description: editFormData.description,
                  },
                }
              : sub
          )
        );
        setExpiredSubscriptions((prev) =>
          prev.map((sub) =>
            sub.subscription.id === activePlan.id
              ? {
                  ...sub,
                  subscription: {
                    ...sub.subscription,
                    name: editFormData.name,
                    price: editFormData.price,
                    description: editFormData.description,
                  },
                }
              : sub
          )
        );
        setFilteredSubscriptions((prev) =>
          prev.map((sub) =>
            sub.subscription.id === activePlan.id
              ? {
                  ...sub,
                  subscription: {
                    ...sub.subscription,
                    name: editFormData.name,
                    price: editFormData.price,
                    description: editFormData.description,
                  },
                }
              : sub
          )
        );
      } else {
        // Add new plan
        const response = await axios.post(
          `${import.meta.env.VITE_BASE_URL}/admin/sub`,
          {
            name: editFormData.name,
            price: parseFloat(editFormData.price),
            description: editFormData.description,
          },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        toast.success(response.data.message || "Plan added successfully.");
        const newPlan = {
          id: response.data.newSubscription.id,
          name: response.data.newSubscription.name,
          price: response.data.newSubscription.price,
          description: response.data.newSubscription.description,
          createdAt: response.data.newSubscription.createdAt,
          updatedAt: response.data.newSubscription.updatedAt,
          deletedAt: null,
        };
        setPlans((prev) => [...prev, newPlan]);
      }
      setIsEditModalOpen(false);
      setActivePlan(null);
      setEditFormData({ name: "", description: "", price: "" });
    } catch (error) {
      console.error("❌ Error Saving Plan:", error);
      toast.error(error.response?.data?.message || "Failed to save plan.");
    }
  };

  const handleResetInputChange = (e) => {
    const { name, value } = e.target;
    setResetFormData((prev) => ({ ...prev, [name]: value }));

    const updatedFormData = { ...resetFormData, [name]: value };
    const newPass = (
      name === "newPassword" ? value : updatedFormData.newPassword
    ).trim();
    const confirmPass = (
      name === "confirmNewPassword" ? value : updatedFormData.confirmNewPassword
    ).trim();

    if (!newPass) {
      setPasswordValidation("");
    } else if (newPass.length <= 4) {
      setPasswordValidation("Password must be longer than 4 characters");
    } else if (confirmPass && newPass !== confirmPass) {
      setPasswordValidation("Passwords do not match");
    } else {
      setPasswordValidation("Password is valid");
    }
  };

  const handleResetPasswordSubmit = async (e) => {
    e.preventDefault();
    if (!resetFormData.oldPassword) {
      toast.error("Please enter your current password.");
      return;
    }
    if (resetFormData.newPassword !== resetFormData.confirmNewPassword) {
      toast.error("New passwords do not match.");
      return;
    }
    try {
      const response = await axios.patch(
        `${import.meta.env.VITE_BASE_URL}/member/change-password`,
        {
          oldPassword: resetFormData.oldPassword,
          newPassword: resetFormData.newPassword,
          confirmPassword: resetFormData.confirmNewPassword,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Password changed successfully.");
      setIsResetModalOpen(false);
      setResetFormData({
        oldPassword: "",
        newPassword: "",
        confirmNewPassword: "",
      });
      setPasswordValidation("");
    } catch (error) {
      console.error(
        "❌ Error Changing Password:",
        error.response?.data || error.message
      );
      toast.error(
        error.response?.data?.message || "Failed to change password."
      );
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-[#FFFDF2]">
        <div className="flex space-x-2">
          <div className="w-3 h-3 bg-[#043D12] rounded-full animate-bounce"></div>
          <div className="w-3 h-3 bg-[#043D12] rounded-full animate-bounce delay-200"></div>
          <div className="w-3 h-3 bg-[#043D12] rounded-full animate-bounce delay-400"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-600 p-4 text-center">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 relative pb-16 px-12 pt-8 overflow-y-auto z-0">
      <div className="h-[12vh] text-[#6A7368] flex justify-between items-center gap-2">
        <div className="welcome flex max-lg:flex-col max-lg:justify-center justify-between items-center gap-4">
          <div className="border-[1px] border-[#6A7368] flex items-center gap-2 px-4 rounded-[11px] shadow-lg">
            <BiSearch />
            <input
              type="text"
              placeholder="Search by plan name or email"
              className="h-[42px] w-[350px] outline-0 border-0 bg-transparent"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <RiEqualizerLine />
          </div>
        </div>
        <div className="flex items-center md:gap-4 px-4 relative">
          <Link to="/">
            <IoIosNotificationsOutline className="text-[30px] text-[#6A7368] hover:text-[#043D12] transition-colors" />
          </Link>
          <div className="relative">
            <motion.figure
              className="flex items-center bg-white rounded-full p-2 shadow-md hover:shadow-lg transition-shadow duration-300 border border-gray-200 cursor-pointer"
              whileHover={{ scale: 1.05 }}
              animate={{ opacity: [1, 0.8, 1] }}
              transition={{ duration: 1, repeat: Infinity, ease: "easeInOut" }}
              onClick={toggleResetButton}
            >
              <CiUser className="text-[32px] text-[#043D12] bg-gray-100 rounded-full p-1" />
              <figcaption className="ml-2 text-[#6A7368] max-md:hidden">
                <h3 className="text-[12px] font-semibold">
                  {profileData.firstname} {profileData.lastname}
                </h3>
              </figcaption>
            </motion.figure>
            {showResetButton && (
              <div
                ref={resetButtonRef}
                className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-50"
              >
                <button
                  className="w-full text-left px-4 py-2 text-[#6A7368] flex items-center gap-2 hover:bg-gray-100"
                  onClick={handleResetPassword}
                >
                  <FiLock /> Change Password
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <main className="text-[#6A7368]">
        <p className="text-[20px] font-semibold">Subscription</p>
        <div className="intro flex justify-between items-center gap-4 mt-4 mb-6">
          <div className="flex items-center gap-2">
            <button
              className={`border-[1px] border-[#6A7368] px-4 py-2 rounded-[40px] transition-colors shadow-md ${
                activeFilter === "Active"
                  ? "bg-[#043D12] text-[#FFFDF2]"
                  : "bg-white"
              }`}
              onClick={() => setActiveFilter("Active")}
            >
              Active
            </button>
            <button
              className={`border-[1px] border-[#6A7368] px-4 py-2 rounded-[40px] transition-colors shadow-md ${
                activeFilter === "Expired"
                  ? "bg-[#043D12] text-[#FFFDF2]"
                  : "bg-white"
              }`}
              onClick={() => setActiveFilter("Expired")}
            >
              Expired
            </button>
            <button
              className={`border-[1px] border-[#6A7368] px-4 py-2 rounded-[40px] transition-colors shadow-md ${
                activeFilter === "Cancelled"
                  ? "bg-[#043D12] text-[#FFFDF2]"
                  : "bg-white"
              }`}
              onClick={() => setActiveFilter("Cancelled")}
            >
              Cancelled
            </button>
          </div>
          <div className="flex items-center gap-2 relative">
            <button
              className="border-[1px] border-[#6A7368] px-4 py-2 rounded-[40px] transition-colors shadow-md bg-white hover:bg-[#043D12] hover:text-[#FFFDF2]"
              onClick={handleEditPlan}
            >
              Edit Plan
            </button>
            <div className="relative" ref={dateDropdownRef}>
              <button
                className="border-[1px] border-[#6A7368] px-4 py-2 rounded-[40px] transition-colors shadow-md bg-white hover:bg-[#043D12] hover:text-[#FFFDF2] flex items-center gap-2"
                onClick={() => setShowDateDropdown(!showDateDropdown)}
              >
                {dateFilter} <IoArrowDown />
              </button>
              {showDateDropdown && (
                <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-50">
                  <button
                    className="w-full text-left px-4 py-2 text-[#6A7368] flex items-center gap-2 hover:bg-gray-100"
                    onClick={() => {
                      setDateFilter("All Time");
                      setShowDateDropdown(false);
                    }}
                  >
                    All Time
                  </button>
                  <button
                    className="w-full text-left px-4 py-2 text-[#6A7368] flex items-center gap-2 hover:bg-gray-100"
                    onClick={() => {
                      setDateFilter("Last Month");
                      setShowDateDropdown(false);
                    }}
                  >
                    Last Month
                  </button>
                  <button
                    className="w-full text-left px-4 py-2 text-[#6A7368] flex items-center gap-2 hover:bg-gray-100"
                    onClick={() => {
                      setDateFilter("Last 3 Months");
                      setShowDateDropdown(false);
                    }}
                  >
                    Last 3 Months
                  </button>
                  <button
                    className="w-full text-left px-4 py-2 text-[#6A7368] flex items-center gap-2 hover:bg-gray-100"
                    onClick={() => {
                      setDateFilter("Last 6 Months");
                      setShowDateDropdown(false);
                    }}
                  >
                    Last 6 Months
                  </button>
                  <button
                    className="w-full text-left px-4 py-2 text-[#6A7368] flex items-center gap-2 hover:bg-gray-100"
                    onClick={() => {
                      setDateFilter("Custom Range");
                      setShowDateDropdown(false);
                      toast.info("Custom Range not implemented yet.");
                    }}
                  >
                    Custom Range
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="overflow-x-auto rounded-[11px] shadow-lg">
          <table className="w-full border-collapse text-[14px] bg-white">
            <thead>
              <tr className="bg-[#F0F5F2] border-b-2 border-[#6A7368]">
                <th className="py-3 px-6 text-left font-semibold w-1/5">
                  Plan
                </th>
                <th className="py-3 px-6 text-left font-semibold w-1/5">
                  Email
                </th>
                <th className="py-3 px-6 text-left font-semibold w-1/5">
                  Status
                </th>
                <th className="py-3 px-6 text-left font-semibold w-1/5">
                  Amount
                </th>
                <th className="py-3 px-6 text-left font-semibold w-1/5">
                  Date
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredSubscriptions.length > 0 ? (
                filteredSubscriptions.map((sub, index) => (
                  <tr
                    key={sub.id}
                    className={`border-b border-gray-200 ${
                      index % 2 === 0 ? "bg-white" : "bg-gray-50"
                    } hover:bg-gray-100 transition-colors`}
                  >
                    <td className="py-4 px-6 flex items-center gap-2">
                      <FiUser className="text-[#6A7368]" />{" "}
                      {sub.subscription.name}
                    </td>
                    <td className="py-4 px-6">{sub.email}</td>
                    <td className="py-4 px-6 flex items-center gap-2">
                      <span
                        className={`inline-block w-2 h-2 rounded-full ${
                          sub.subscriptionStatus === "active"
                            ? "bg-green-600"
                            : "bg-red-600"
                        }`}
                      />
                      <span
                        className={
                          sub.subscriptionStatus === "active"
                            ? "text-green-600"
                            : "text-red-600"
                        }
                      >
                        {sub.subscriptionStatus === "active"
                          ? "Active"
                          : "Expired"}
                      </span>
                    </td>
                    <td className="py-4 px-6">₦{sub.subscription.price}</td>
                    <td className="py-4 px-6">
                      {formatDate(sub.subscriptionEndDate)}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="5"
                    className="py-4 px-6 text-center text-gray-500"
                  >
                    {activeFilter === "Cancelled"
                      ? "N/A (No endpoint available yet)"
                      : "No subscriptions found matching your criteria."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </main>

      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black/60 bg-opacity-50 flex items-center justify-center z-50">
          <div
            ref={editModalRef}
            className="bg-white rounded-[11px] shadow-lg w-[600px] p-6 flex"
          >
            <div className="w-1/3 border-r border-gray-200 pr-4">
              <h2 className="text-[20px] font-semibold text-[#6A7368] mb-4">
                Edit Plans
              </h2>
              <div className="space-y-2">
                {plans.map((plan) => (
                  <div
                    key={plan.id}
                    className={`flex justify-between items-center px-2 py-1 rounded cursor-pointer ${
                      activePlan?.id === plan.id ? "bg-gray-200" : ""
                    }`}
                    onClick={() => handleSelectPlan(plan)}
                  >
                    <span>{plan.name}</span>
                    <FiTrash2
                      className="text-red-600 cursor-pointer"
                      onClick={(e) => {
                        e.stopPropagation();
                        setDeletePlan(plan);
                        setIsDeleteModalOpen(true);
                      }}
                    />
                  </div>
                ))}
                <div
                  className="flex items-center gap-2 text-[#6A7368] cursor-pointer mt-4"
                  onClick={handleAddPlan}
                >
                  <BiPlus />
                  <span>Add Plan</span>
                </div>
              </div>
            </div>
            <div className="w-2/3 pl-4">
              <form onSubmit={handleEditSubmit}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-[14px] text-[#6A7368] mb-1">
                      Plan Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={editFormData.name}
                      onChange={handleEditFormChange}
                      placeholder="Enter plan name"
                      className="w-full h-[42px] px-4 border-[1px] border-[#6A7368] rounded-[11px] outline-0 bg-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-[14px] text-[#6A7368] mb-1">
                      Description
                    </label>
                    <input
                      type="text"
                      name="description"
                      value={editFormData.description}
                      onChange={handleEditFormChange}
                      placeholder="Enter description"
                      className="w-full h-[42px] px-4 border-[1px] border-[#6A7368] rounded-[11px] outline-0 bg-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-[14px] text-[#6A7368] mb-1">
                      Price
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        name="price"
                        value={editFormData.price}
                        onChange={handleEditFormChange}
                        placeholder="Enter price"
                        className="w-full h-[42px] px-4 border-[1px] border-[#6A7368] rounded-[11px] outline-0 bg-transparent"
                        required
                      />
                      <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#6A7368]">
                        ₦
                      </span>
                    </div>
                  </div>
                  <button
                    type="submit"
                    className="mt-4 px-6 py-2 bg-[#043D12] text-[#FFFDF2] rounded-full hover:bg-[#032d0e] transition-colors float-right"
                  >
                    Save
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {isDeleteModalOpen && deletePlan && (
        <div className="fixed inset-0 bg-black/60 bg-opacity-50 flex items-center justify-center z-50">
          <div
            ref={deleteModalRef}
            className="bg-white rounded-[11px] shadow-lg w-[400px] p-6"
          >
            <div className="flex justify-end mb-4">
              <AiOutlineClose
                className="text-[20px] text-[#6A7368] cursor-pointer hover:text-[#043D12] transition-colors"
                onClick={() => {
                  setIsDeleteModalOpen(false);
                  setDeletePlan(null);
                }}
              />
            </div>
            <div className="text-center mb-4">
              <p className="text-[16px] text-[#6A7368]">
                Are you sure you want to delete the plan{" "}
                <span className="font-semibold">{deletePlan.name}</span>?
              </p>
            </div>
            <div className="flex justify-between">
              <button
                className="px-4 py-2 bg-gray-200 text-[#6A7368] rounded-[11px] hover:bg-gray-300 transition-colors"
                onClick={() => {
                  setIsDeleteModalOpen(false);
                  setDeletePlan(null);
                }}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-red-600 text-[#FFFDF2] rounded-[11px] hover:bg-red-700 transition-colors"
                onClick={handleDeletePlan}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {isResetModalOpen && (
        <div className="fixed inset-0 bg-black/60 bg-opacity-50 flex items-center justify-center z-50">
          <div
            ref={resetModalRef}
            className="bg-white rounded-[11px] shadow-lg w-[400px] p-6"
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-[20px] font-semibold text-[#6A7368]">
                Change Password
              </h2>
              <AiOutlineClose
                className="text-[20px] text-[#6A7368] cursor-pointer hover:text-[#043D12] transition-colors"
                onClick={() => {
                  setIsResetModalOpen(false);
                  setResetFormData({
                    oldPassword: "",
                    newPassword: "",
                    confirmNewPassword: "",
                  });
                  setPasswordValidation("");
                }}
              />
            </div>
            <form onSubmit={handleResetPasswordSubmit}>
              <div className="space-y-4">
                <div>
                  <label className="block text-[14px] text-[#6A7368] mb-1">
                    Current Password
                  </label>
                  <div className="relative">
                    <input
                      type={showCurrentPassword ? "text" : "password"}
                      name="oldPassword"
                      value={resetFormData.oldPassword}
                      onChange={handleResetInputChange}
                      placeholder="Enter current password"
                      className="w-full h-[42px] px-4 border-[1px] border-[#6A7368] rounded-[11px] outline-0 bg-transparent"
                      required
                    />
                    <FiKey className="absolute right-10 top-1/2 transform -translate-y-1/2 text-[#6A7368]" />
                    <span
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-[#6A7368]"
                      onClick={() =>
                        setShowCurrentPassword(!showCurrentPassword)
                      }
                    >
                      {showCurrentPassword ? <FiEyeOff /> : <FiEye />}
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block text-[14px] text-[#6A7368] mb-1">
                    New Password
                  </label>
                  <div className="relative">
                    <input
                      type={showNewPassword ? "text" : "password"}
                      name="newPassword"
                      value={resetFormData.newPassword}
                      onChange={handleResetInputChange}
                      placeholder="Enter new password"
                      className="w-full h-[42px] px-4 border-[1px] border-[#6A7368] rounded-[11px] outline-0 bg-transparent"
                      required
                    />
                    <FiKey className="absolute right-10 top-1/2 transform -translate-y-1/2 text-[#6A7368]" />
                    <span
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-[#6A7368]"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                    >
                      {showNewPassword ? <FiEyeOff /> : <FiEye />}
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block text-[14px] text-[#6A7368] mb-1">
                    Confirm New Password
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmNewPassword ? "text" : "password"}
                      name="confirmNewPassword"
                      value={resetFormData.confirmNewPassword}
                      onChange={handleResetInputChange}
                      placeholder="Confirm new password"
                      className="w-full h-[42px] px-4 border-[1px] border-[#6A7368] rounded-[11px] outline-0 bg-transparent"
                      required
                    />
                    <FiKey className="absolute right-10 top-1/2 transform -translate-y-1/2 text-[#6A7368]" />
                    <span
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-[#6A7368]"
                      onClick={() =>
                        setShowConfirmNewPassword(!showConfirmNewPassword)
                      }
                    >
                      {showConfirmNewPassword ? <FiEyeOff /> : <FiEye />}
                    </span>
                  </div>
                </div>

                {passwordValidation && (
                  <div className="flex items-center gap-2">
                    {passwordValidation === "Password is valid" ? (
                      <FiCheckCircle className="text-green-600" />
                    ) : (
                      <FiAlertCircle className="text-red-600" />
                    )}
                    <span
                      className={
                        passwordValidation === "Password is valid"
                          ? "text-green-600"
                          : "text-red-600"
                      }
                    >
                      {passwordValidation}
                    </span>
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full mt-4 px-4 py-2 bg-[#043D12] text-[#FFFDF2] rounded-[11px] hover:bg-[#032d0e] transition-colors"
                  disabled={passwordValidation !== "Password is valid"}
                >
                  Save Password
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageSubscription;
