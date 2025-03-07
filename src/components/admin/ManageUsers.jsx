import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { IoIosNotificationsOutline } from "react-icons/io";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";
import { CiUser } from "react-icons/ci";
import { BiPlus, BiSearch } from "react-icons/bi";
import { IoFilter } from "react-icons/io5";
import { RiEqualizerLine } from "react-icons/ri";
import { BsThreeDots } from "react-icons/bs";
import {
  FiLock,
  FiTrash2,
  FiUser,
  FiMail,
  FiKey,
  FiEye,
  FiEyeOff,
  FiAlertCircle,
  FiCheckCircle,
  FiRefreshCw,
} from "react-icons/fi";
import { AiOutlineClose } from "react-icons/ai";
import { toast } from "react-toastify";

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [suspendedUsers, setSuspendedUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [filteredSuspendedUsers, setFilteredSuspendedUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeMenuIndex, setActiveMenuIndex] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isSuspendModalOpen, setIsSuspendModalOpen] = useState(false);
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);
  const [showResetButton, setShowResetButton] = useState(false);
  const [deleteUser, setDeleteUser] = useState(null);
  const [suspendUser, setSuspendUser] = useState(null);
  const [resetUser, setResetUser] = useState(null);
  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [resetFormData, setResetFormData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false);
  const [passwordValidation, setPasswordValidation] = useState("");
  const [view, setView] = useState("active");
  const [profileData, setProfileData] = useState({
    firstname: "",
    lastname: "",
  });

  const navigate = useNavigate();
  const { isAuthenticated, user, token } = useSelector((state) => state.auth);

  const dropdownRef = useRef(null);
  const modalRef = useRef(null);
  const deleteModalRef = useRef(null);
  const suspendModalRef = useRef(null);
  const resetModalRef = useRef(null);
  const resetButtonRef = useRef(null);
  const dropdownRefs = useRef([]);

  useEffect(() => {
    console.log("Initial token from Redux:", token);
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

    setLoading(true);

    const fetchUsers = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/admin/all-members`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        console.log("Users Response:", response.data);
        if (response.data && Array.isArray(response.data.members)) {
          setUsers(response.data.members);
          setFilteredUsers(response.data.members);
        } else {
          throw new Error("No user data found in the response.");
        }
      } catch (error) {
        console.error("❌ Error Fetching Users:", error);
        if (
          error.response?.status === 404 ||
          error.response?.data?.message?.includes("not found")
        ) {
          setError("No users found.");
        } else {
          setError(
            error.response?.data?.message || "Failed to fetch user data."
          );
        }
      }
    };

    const fetchSuspendedUsers = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/admin/suspended-members`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        console.log("Suspended Users Response:", response.data);
        if (response.data && Array.isArray(response.data.members)) {
          setSuspendedUsers(response.data.members);
          setFilteredSuspendedUsers(response.data.members);
        } else {
          throw new Error("No suspended user data found in the response.");
        }
      } catch (error) {
        console.error("❌ Error Fetching Suspended Users:", error);
        if (
          error.response?.status === 404 ||
          error.response?.data?.message?.includes("not found")
        ) {
          setError("No suspended users found.");
        } else {
          setError(
            error.response?.data?.message ||
              "Failed to fetch suspended user data."
          );
        }
      }
    };

    Promise.all([fetchUsers(), fetchSuspendedUsers()])
      .then(() => {})
      .catch((error) => {
        console.error("❌ One or more fetch requests failed:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [isAuthenticated, token, navigate, user]);

  useEffect(() => {
    const filterUsers = () => {
      if (!searchQuery.trim()) {
        setFilteredUsers(users);
        setFilteredSuspendedUsers(suspendedUsers);
        return;
      }

      const query = searchQuery.toLowerCase().trim();
      const filteredActive = users.filter((user) => {
        const fullName = `${user.firstname} ${user.lastname}`.toLowerCase();
        const email = user.email.toLowerCase();
        return fullName.includes(query) || email.includes(query);
      });
      const filteredSuspended = suspendedUsers.filter((user) => {
        const fullName = `${user.firstname} ${user.lastname}`.toLowerCase();
        const email = user.email.toLowerCase();
        return fullName.includes(query) || email.includes(query);
      });

      setFilteredUsers(filteredActive);
      setFilteredSuspendedUsers(filteredSuspended);
    };

    const debounceTimeout = setTimeout(() => {
      filterUsers();
    }, 300);

    return () => clearTimeout(debounceTimeout);
  }, [searchQuery, users, suspendedUsers]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setActiveMenuIndex(null);
      }
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        closeModal();
      }
      if (
        deleteModalRef.current &&
        !deleteModalRef.current.contains(event.target)
      ) {
        setIsDeleteModalOpen(false);
        setDeleteUser(null);
      }
      if (
        suspendModalRef.current &&
        !suspendModalRef.current.contains(event.target)
      ) {
        setIsSuspendModalOpen(false);
        setSuspendUser(null);
      }
      if (
        resetModalRef.current &&
        !resetModalRef.current.contains(event.target)
      ) {
        setIsResetModalOpen(false);
        setResetUser(null);
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
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const formatDate = (dateString) => {
    if (!dateString) return "Never";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "Invalid Date";
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const toggleMenu = (index) => {
    setActiveMenuIndex(activeMenuIndex === index ? null : index);
  };

  const toggleResetButton = () => {
    setShowResetButton((prev) => !prev);
  };

  const handleResetPassword = () => {
    setResetUser(user || { firstname: "Unknown", lastname: "User" });
    setIsResetModalOpen(true);
    setShowResetButton(false);
  };

  const openDeleteModal = (user) => {
    setDeleteUser(user);
    setIsDeleteModalOpen(true);
  };

  const openSuspendModal = (user) => {
    setSuspendUser(user);
    setIsSuspendModalOpen(true);
  };

  const handleViewProfile = (user) => {
    const profileId = user.profile?.id;
    if (profileId) {
      navigate(`/community/profile/${profileId}`);
    } else {
      toast.error("This user has no associated profile.");
      console.warn("No profile ID found for user:", user);
    }
  };

  const handleRemoveUser = async () => {
    if (!deleteUser?.id) {
      toast.error("No user selected for deletion.");
      return;
    }

    try {
      const response = await axios.delete(
        `${import.meta.env.VITE_BASE_URL}/admin/delete-member/${deleteUser.id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      console.log("Delete User Response:", response.data);
      toast.success(response.data.message);

      if (view === "active") {
        setUsers((prev) => prev.filter((u) => u.id !== deleteUser.id));
        setFilteredUsers((prev) => prev.filter((u) => u.id !== deleteUser.id));
      }

      setIsDeleteModalOpen(false);
      setDeleteUser(null);
    } catch (error) {
      console.error(
        "❌ Error Deleting User:",
        error.response?.data || error.message
      );
      toast.error(
        error.response?.data?.message ||
          "Failed to delete user. Check the console for details."
      );
    }
  };

  const handleSuspendUser = async () => {
    if (!suspendUser?.id) {
      toast.error("No user selected for suspension.");
      return;
    }

    const profileId = suspendUser.profile?.id;
    if (!profileId) {
      toast.error("This user has no associated profile to suspend.");
      return;
    }

    try {
      const response = await axios.delete(
        `${import.meta.env.VITE_BASE_URL}/member/delete-profile/${profileId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      console.log("Suspend User Response:", response.data);
      toast.success(response.data.message);
      setUsers((prev) => prev.filter((u) => u.id !== suspendUser.id));
      setFilteredUsers((prev) => prev.filter((u) => u.id !== suspendUser.id));
      setSuspendedUsers((prev) => [...prev, suspendUser]);
      setFilteredSuspendedUsers((prev) => [...prev, suspendUser]);
      setIsSuspendModalOpen(false);
      setSuspendUser(null);
    } catch (error) {
      console.error(
        "❌ Error Suspending User:",
        error.response?.data || error.message
      );
      toast.error(
        error.response?.data?.message ||
          "Failed to suspend user. Check the console for details."
      );
    }
  };

  const handleRestoreUser = async (user) => {
    const profileId = user.profile?.id;
    if (!profileId) {
      toast.error("This user has no associated profile to restore.");
      return;
    }

    try {
      const response = await axios.patch(
        `${import.meta.env.VITE_BASE_URL}/admin/restore-profile/${profileId}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      console.log("Restore User Response:", response.data);
      toast.success(response.data.message);
      setSuspendedUsers((prev) => prev.filter((u) => u.id !== user.id));
      setFilteredSuspendedUsers((prev) => prev.filter((u) => u.id !== user.id));
      setUsers((prev) => [...prev, user]);
      setFilteredUsers((prev) => [...prev, user]);
    } catch (error) {
      console.error(
        "❌ Error Restoring User:",
        error.response?.data || error.message
      );
      toast.error(
        error.response?.data?.message ||
          "Failed to restore user. Check the console for details."
      );
    }
  };

  const handleSendEmail = (user) => {
    const mailtoLink = `mailto:${encodeURIComponent(user.email)}`;
    window.location.href = mailtoLink;
  };

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => {
    setIsModalOpen(false);
    setFormData({
      firstname: "",
      lastname: "",
      email: "",
      password: "",
      confirmPassword: "",
    });
    setShowPassword(false);
    setShowConfirmPassword(false);
    setError(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
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

  const handleAddUser = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/admin/create-admin`,
        {
          firstName: formData.firstname,
          lastName: formData.lastname,
          email: formData.email,
          password: formData.password,
          confirmPassword: formData.confirmPassword,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      console.log("Add User Response:", response.data);
      toast.success(response.data.message);

      const newUser = {
        ...response.data.newMember,
        firstname: response.data.newMember.firstName,
        lastname: response.data.newMember.lastName,
      };

      setUsers((prev) => [...prev, newUser]);
      setFilteredUsers((prev) => [...prev, newUser]);
      setTimeout(closeModal, 2000);
    } catch (error) {
      console.error(
        "❌ Error Adding User:",
        error.response?.data || error.message
      );
      toast.error(error.response?.data?.message || "Failed to add user.");
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
      console.log("Token being used:", token);
      const response = await axios.patch(
        `${import.meta.env.VITE_BASE_URL}/member/change-password`,
        {
          oldPassword: resetFormData.oldPassword,
          newPassword: resetFormData.newPassword,
          confirmPassword: resetFormData.confirmNewPassword,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      console.log("Change Password Response:", response.data);
      toast.success("Password changed successfully.");
      setIsResetModalOpen(false);
      setResetUser(null);
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

  const getDropdownPosition = (index) => {
    const button = dropdownRefs.current[index];
    if (!button) return { top: "100%", bottom: "auto" };

    const rect = button.getBoundingClientRect();
    const viewportHeight = window.innerHeight;
    const spaceBelow = viewportHeight - rect.bottom;
    const dropdownHeight = 100;

    if (spaceBelow < dropdownHeight) {
      return { top: "auto", bottom: "100%" };
    }
    return { top: "100%", bottom: "auto" };
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
              placeholder="Search by name or email"
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
        <div className="intro flex flex-col gap-4 mb-6">
          <p className="text-[20px] font-semibold">Users</p>
          <div className="flex items-center gap-2">
            <button
              className={`border-[1px] border-[#6A7368] px-4 py-2 rounded-[40px] transition-colors shadow-md ${
                view === "active"
                  ? "bg-[#043D12] text-[#FFFDF2]"
                  : "bg-white hover:bg-[#043D12] hover:text-[#FFFDF2]"
              }`}
              onClick={() => setView("active")}
            >
              Active
            </button>
            <button
              className={`border-[1px] border-[#6A7368] px-4 py-2 rounded-[40px] transition-colors shadow-md ${
                view === "suspended"
                  ? "bg-[#043D12] text-[#FFFDF2]"
                  : "bg-white hover:bg-[#043D12] hover:text-[#FFFDF2]"
              }`}
              onClick={() => setView("suspended")}
            >
              Suspended
            </button>
          </div>
        </div>

        <div className="overflow-x-auto rounded-[11px] shadow-lg">
          <table className="w-full border-collapse text-[14px] bg-white">
            <thead>
              <tr className="bg-[#F0F5F2] border-b-2 border-[#6A7368]">
                <th className="py-3 px-6 text-left font-semibold w-1/5">
                  User
                </th>
                <th className="py-3 px-6 text-left font-semibold w-1/5">
                  Email
                </th>
                <th className="py-3 px-6 text-left font-semibold w-1/5">
                  Current Plan
                </th>
                <th className="py-3 px-6 text-left font-semibold w-1/5">
                  Last Login
                </th>
                <th className="py-3 px-6 text-left font-semibold w-1/5">
                  Joined
                </th>
              </tr>
            </thead>
            <tbody>
              {(view === "active" ? filteredUsers : filteredSuspendedUsers)
                .length > 0 ? (
                (view === "active"
                  ? filteredUsers
                  : filteredSuspendedUsers
                ).map((user, index) => (
                  <tr
                    key={index}
                    className={`border-b border-gray-200 ${
                      index % 2 === 0 ? "bg-white" : "bg-gray-50"
                    } hover:bg-gray-100 transition-colors`}
                  >
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-[#043D12] font-semibold">
                          {user.firstname.charAt(0)}
                        </div>
                        <span>{`${user.firstname} ${user.lastname}`}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6">{user.email}</td>
                    <td className="py-4 px-6">
                      {user.subscription ? user.subscription.name : "None"}
                    </td>
                    <td className="py-4 px-6">{formatDate(user.lastLogin)}</td>
                    <td className="py-4 px-6 relative">
                      <div className="flex items-center gap-2">
                        {formatDate(user.createdAt)}
                        <div
                          ref={(el) => (dropdownRefs.current[index] = el)}
                          className="relative"
                        >
                          <BsThreeDots
                            className="text-[18px] cursor-pointer hover:text-[#043D12] transition-colors"
                            onClick={() => toggleMenu(index)}
                          />
                          {activeMenuIndex === index && (
                            <div
                              ref={dropdownRef}
                              className="absolute right-0 bg-white border border-gray-200 rounded-md shadow-lg z-50 max-h-40 overflow-y-auto"
                              style={{
                                minWidth: "160px",
                                top: getDropdownPosition(index).top,
                                bottom: getDropdownPosition(index).bottom,
                              }}
                            >
                              <button
                                className="w-full text-left px-4 py-2 text-[#6A7368] flex items-center gap-2 hover:bg-gray-100"
                                onClick={() => handleViewProfile(user)}
                              >
                                <FiUser /> View Profile
                              </button>
                              <button
                                className="w-full text-left px-4 py-2 text-[#6A7368] flex items-center gap-2 hover:bg-gray-100"
                                onClick={() => handleSendEmail(user)}
                              >
                                <FiMail /> Send Email
                              </button>
                              {view === "active" && (
                                <button
                                  className="w-full text-left px-4 py-2 text-red-600 flex items-center gap-2 hover:bg-gray-100"
                                  onClick={() => openSuspendModal(user)}
                                >
                                  <FiAlertCircle /> Suspend User
                                </button>
                              )}
                              {view === "suspended" && (
                                <button
                                  className="w-full text-left px-4 py-2 text-green-600 flex items-center gap-2 hover:bg-gray-100"
                                  onClick={() => handleRestoreUser(user)}
                                >
                                  <FiRefreshCw /> Restore User
                                </button>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="5"
                    className="py-4 px-6 text-center text-gray-500"
                  >
                    No {view === "active" ? "active" : "suspended"} users found
                    matching your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </main>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 bg-opacity-50 flex items-center justify-center z-50">
          <div
            ref={modalRef}
            className="bg-white rounded-[11px] shadow-lg w-[400px] p-6"
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-[20px] font-semibold text-[#6A7368]">
                New User
              </h2>
              <AiOutlineClose
                className="text-[20px] text-[#6A7368] cursor-pointer hover:text-[#043D12] transition-colors"
                onClick={closeModal}
              />
            </div>
            <form onSubmit={handleAddUser}>
              <div className="space-y-4">
                <div>
                  <label className="block text-[14px] text-[#6A7368] mb-1">
                    First Name
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      name="firstname"
                      value={formData.firstname}
                      onChange={handleInputChange}
                      placeholder="Enter first name"
                      className="w-full h-[42px] px-4 border-[1px] border-[#6A7368] rounded-[11px] outline-0 bg-transparent"
                      required
                    />
                    <FiUser className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#6A7368]" />
                  </div>
                </div>

                <div>
                  <label className="block text-[14px] text-[#6A7368] mb-1">
                    Last Name
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      name="lastname"
                      value={formData.lastname}
                      onChange={handleInputChange}
                      placeholder="Enter last name"
                      className="w-full h-[42px] px-4 border-[1px] border-[#6A7368] rounded-[11px] outline-0 bg-transparent"
                      required
                    />
                    <FiUser className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#6A7368]" />
                  </div>
                </div>

                <div>
                  <label className="block text-[14px] text-[#6A7368] mb-1">
                    Email
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="Enter email"
                      className="w-full h-[42px] px-4 border-[1px] border-[#6A7368] rounded-[11px] outline-0 bg-transparent"
                      required
                    />
                    <FiMail className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#6A7368]" />
                  </div>
                </div>

                <div>
                  <label className="block text-[14px] text-[#6A7368] mb-1">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      placeholder="Enter password"
                      className="w-full h-[42px] px-4 border-[1px] border-[#6A7368] rounded-[11px] outline-0 bg-transparent"
                      required
                    />
                    <FiKey className="absolute right-10 top-1/2 transform -translate-y-1/2 text-[#6A7368]" />
                    <span
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-[#6A7368]"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <FiEyeOff /> : <FiEye />}
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block text-[14px] text-[#6A7368] mb-1">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      placeholder="Confirm password"
                      className="w-full h-[42px] px-4 border-[1px] border-[#6A7368] rounded-[11px] outline-0 bg-transparent"
                      required
                    />
                    <FiKey className="absolute right-10 top-1/2 transform -translate-y-1/2 text-[#6A7368]" />
                    <span
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-[#6A7368]"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                    >
                      {showConfirmPassword ? <FiEyeOff /> : <FiEye />}
                    </span>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full mt-4 px-4 py-2 bg-[#043D12] text-[#FFFDF2] rounded-[11px] hover:bg-[#032d0e] transition-colors"
                >
                  Add User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isDeleteModalOpen && deleteUser && (
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
                  setDeleteUser(null);
                }}
              />
            </div>
            <div className="flex justify-center mb-4">
              <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center text-[20px] font-semibold text-gray-700">
                {deleteUser.firstname.charAt(0)}
              </div>
            </div>
            <div className="text-center mb-4">
              <p className="text-[16px] text-[#6A7368]">
                Are you sure you want to remove{" "}
                <span className="font-semibold">
                  {`${deleteUser.firstname} ${deleteUser.lastname}`}
                </span>
                ?
              </p>
            </div>
            <div className="flex justify-between">
              <button
                className="px-4 py-2 bg-gray-200 text-[#6A7368] rounded-[11px] hover:bg-gray-300 transition-colors"
                onClick={() => {
                  setIsDeleteModalOpen(false);
                  setDeleteUser(null);
                }}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-red-600 text-[#FFFDF2] rounded-[11px] hover:bg-red-700 transition-colors"
                onClick={handleRemoveUser}
              >
                Remove
              </button>
            </div>
          </div>
        </div>
      )}

      {isSuspendModalOpen && suspendUser && (
        <div className="fixed inset-0 bg-black/60 bg-opacity-50 flex items-center justify-center z-50">
          <div
            ref={suspendModalRef}
            className="bg-white rounded-[11px] shadow-lg w-[400px] p-6"
          >
            <div className="flex justify-end mb-4">
              <AiOutlineClose
                className="text-[20px] text-[#6A7368] cursor-pointer hover:text-[#043D12] transition-colors"
                onClick={() => {
                  setIsSuspendModalOpen(false);
                  setSuspendUser(null);
                }}
              />
            </div>
            <div className="flex justify-center mb-4">
              <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center text-[20px] font-semibold text-gray-700">
                {suspendUser.firstname.charAt(0)}
              </div>
            </div>
            <div className="text-center mb-4">
              <p className="text-[16px] text-[#6A7368]">
                Are you sure you want to suspend{" "}
                <span className="font-semibold">
                  {`${suspendUser.firstname} ${suspendUser.lastname}`}
                </span>
                ?
              </p>
            </div>
            <div className="flex justify-between">
              <button
                className="px-4 py-2 bg-gray-200 text-[#6A7368] rounded-[11px] hover:bg-gray-300 transition-colors"
                onClick={() => {
                  setIsSuspendModalOpen(false);
                  setSuspendUser(null);
                }}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-red-600 text-[#FFFDF2] rounded-[11px] hover:bg-red-700 transition-colors"
                onClick={handleSuspendUser}
              >
                Suspend
              </button>
            </div>
          </div>
        </div>
      )}

      {isResetModalOpen && resetUser && (
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
                  setResetUser(null);
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

export default ManageUsers;
