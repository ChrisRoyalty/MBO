import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { FaEllipsisV, FaEdit, FaTrash } from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useSelector } from "react-redux";
import {
  NavLink,
  useNavigate,
  useLocation,
  Routes,
  Route,
} from "react-router-dom";
import { RiArrowDropDownLine } from "react-icons/ri";
import { IoIosNotificationsOutline } from "react-icons/io";
import { CiUser } from "react-icons/ci";
import BusinessImg from "../../assets/user-photo.svg";
import { Link } from "react-router-dom";

import LockIcon from "../../assets/lock.svg";
import PendingIcon from "../../assets/all.svg";
import ContactIcon from "../../assets/contact.svg";
import UserIcon from "../../assets/user.svg";
import StreamlineIcon from "../../assets/streamline.svg";

const Support = () => {
  const { isAuthenticated, user, token } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const location = useLocation();

  const [tickets, setTickets] = useState({
    Pending: [],
    "In Progress": [],
    Resolved: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [profileData, setProfileData] = useState({
    firstname: "",
    lastname: "",
  });

  useEffect(() => {
    if (!isAuthenticated || !token) {
      setError("Not authenticated or missing token!");
      setLoading(false);
      toast.info("Redirecting to login...");
      navigate("/login", { replace: true });
      return;
    }

    // Update profileData based on user data from Redux
    if (user && user.firstName && user.lastName) {
      setProfileData({
        firstname: user.firstName,
        lastname: user.lastName,
      });
    } else {
      console.warn("User data missing in Redux store, using defaults.", user);
      setProfileData({
        firstname: "Admin",
        lastname: "Hello",
      });
    }

    const fetchData = async () => {
      try {
        const BASE_URL = import.meta.env.VITE_BASE_URL;
        console.log("BASE_URL:", BASE_URL);
        console.log("Token:", token);
        const response = await axios.get(`${BASE_URL}/admin/get-all-issues`, {
          headers: { Authorization: `Bearer ${token}` },
          timeout: 30000,
        });
        if (response.data.success) {
          const {
            Pending,
            "In Progress": inProgress,
            Resolved,
          } = response.data.issues;
          setTickets({ Pending, "In Progress": inProgress, Resolved });
        } else {
          throw new Error("Failed to fetch tickets.");
        }
      } catch (error) {
        console.error("❌ Error Fetching Tickets:", error);
        let errorMessage = "Failed to fetch tickets.";
        if (error.code === "ECONNABORTED") {
          errorMessage =
            "Request timed out. Please check your network or try again later.";
        } else if (error.response?.status === 401) {
          errorMessage = "Session expired. Please log in again.";
          toast.info(errorMessage);
          navigate("/login", { replace: true });
          return;
        } else if (error.response?.data?.message) {
          errorMessage = error.response.data.message;
        }
        setError(errorMessage);
        toast.error(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [isAuthenticated, token, navigate, user]);

  useEffect(() => {
    if (
      location.pathname === "/admin/support" ||
      location.pathname === "/admin/support/"
    ) {
      navigate("/admin/support/all-tickets");
    }
  }, [location, navigate]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-white">
        <div className="flex space-x-2">
          <div className="w-3 h-3 bg-gray-600 rounded-full animate-bounce"></div>
          <div className="w-3 h-3 bg-gray-600 rounded-full animate-bounce delay-200"></div>
          <div className="w-3 h-3 bg-gray-600 rounded-full animate-bounce delay-400"></div>
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
    <div className="flex flex-col lg:flex-row min-h-screen">
      <ToastContainer position="top-right" autoClose={5000} />

      {/* Sidebar */}
      <div className="lg:w-64 w-full p-4 shadow-md pt-16 flex flex-col lg:items-center bg-white lg:min-h-screen">
        <nav>
          <ul className="space-y-2">
            <li>
              <NavLink
                to="/admin/support/all-tickets"
                className={({ isActive }) =>
                  `flex items-center gap-2 p-2 rounded text-sm ${
                    isActive ? "font-bold text-gray-800 " : "text-gray-600"
                  }`
                }
              >
                <img src={UserIcon} alt="UserIcon" />
                All Tickets
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/admin/support/pending-tickets"
                className={({ isActive }) =>
                  `flex items-center gap-2 p-2 rounded text-sm ${
                    isActive ? "font-bold text-gray-800 " : "text-gray-600"
                  }`
                }
              >
                <img src={PendingIcon} alt="PendingIcon" />
                Pending Tickets
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/admin/support/resolved-tickets"
                className={({ isActive }) =>
                  `flex items-center gap-2 p-2 rounded text-sm ${
                    isActive ? "font-bold text-gray-800 " : "text-gray-600"
                  }`
                }
              >
                <img src={ContactIcon} alt="ResolvedIcon" />
                Resolved Tickets
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/admin/support/assigned-tickets"
                className={({ isActive }) =>
                  `flex items-center gap-2 p-2 rounded text-sm ${
                    isActive ? "font-bold text-gray-800 " : "text-gray-600"
                  }`
                }
              >
                <img src={StreamlineIcon} alt="AssignedIcon" />
                Assigned Tickets
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/admin/support/faqs"
                className={({ isActive }) =>
                  `flex items-center gap-2 p-2 rounded text-sm ${
                    isActive ? "font-bold text-gray-800 " : "text-gray-600"
                  }`
                }
              >
                <img src={LockIcon} alt="FaqIcon" />
                FAQs & Knowledge Base
              </NavLink>
            </li>
          </ul>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col bg-white min-h-screen">
        <div className="h-16 p-4 text-gray-600 flex justify-end items-center gap-2 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <Link to="/admin/manage-notifications">
              <IoIosNotificationsOutline className="text-xl sm:text-2xl text-gray-600 hover:text-gray-800 transition-colors" />
            </Link>
            <Link to="/admin/profile">
              <div className="flex items-center bg-white rounded-full p-1 shadow-md hover:shadow-lg transition-shadow border border-gray-200">
                {user?.businesImg ? (
                  <img
                    src={user.businesImg}
                    alt="Business-img"
                    className="rounded-full w-8 h-8 object-cover border-2 border-gray-600"
                    onError={(e) => (e.target.src = BusinessImg)}
                  />
                ) : (
                  <CiUser className="text-xl sm:text-2xl text-gray-600 bg-gray-100 rounded-full p-1" />
                )}
                <span className="ml-2 text-xs sm:text-sm hidden sm:block">
                  {profileData.firstname} {profileData.lastname}
                </span>
              </div>
            </Link>
          </div>
        </div>

        <div className="p-4 sm:p-6 lg:p-8 overflow-y-auto flex-1">
          <Routes>
            <Route
              path="all-tickets"
              element={<AllTickets tickets={tickets} setTickets={setTickets} />}
            />
            <Route
              path="pending-tickets"
              element={
                <PendingTickets tickets={tickets} setTickets={setTickets} />
              }
            />
            <Route
              path="resolved-tickets"
              element={
                <ResolvedTickets tickets={tickets} setTickets={setTickets} />
              }
            />
            <Route
              path="assigned-tickets"
              element={
                <AssignedTickets tickets={tickets} setTickets={setTickets} />
              }
            />
            <Route path="faqs" element={<FAQs />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

const AllTickets = ({ tickets, setTickets }) => {
  const { token } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const [filteredTickets, setFilteredTickets] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [dateFilter, setDateFilter] = useState("Last Month");
  const [isDateDropdownOpen, setIsDateDropdownOpen] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [ticketsPerPage] = useState(5);
  const modalRef = useRef(null);
  const dateDropdownRef = useRef(null);
  const dropdownRef = useRef(null);

  useEffect(() => {
    let data = [
      ...tickets.Pending,
      ...tickets["In Progress"],
      ...tickets.Resolved,
    ];

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      data = data.filter(
        (ticket) =>
          ticket.name.toLowerCase().includes(query) ||
          ticket.business.toLowerCase().includes(query) ||
          ticket.issueType.toLowerCase().includes(query) ||
          ticket.id.toLowerCase().includes(query)
      );
    }

    const now = new Date();
    const lastMonth = new Date(now.setMonth(now.getMonth() - 1));
    if (dateFilter === "Last Month") {
      data = data.filter((ticket) => {
        const submittedDate = new Date(ticket.createdAt);
        return submittedDate >= lastMonth && submittedDate <= now;
      });
    }

    setFilteredTickets(data);
    setCurrentPage(1);
  }, [tickets, searchQuery, dateFilter]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (modalRef.current && !modalRef.current.contains(e.target)) {
        setIsModalOpen(false);
        setSelectedTicket(null);
      }
      if (
        dateDropdownRef.current &&
        !dateDropdownRef.current.contains(e.target)
      ) {
        setIsDateDropdownOpen(false);
      }
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target) &&
        !e.target.closest(".dropdown-menu")
      ) {
        setSelectedTicket((prev) => (prev ? null : prev));
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isModalOpen, isDateDropdownOpen]);

  const handleViewDetails = (ticket) => {
    setSelectedTicket(ticket);
    setIsModalOpen(true);
  };

  const handleMarkAsResolved = async (ticketId) => {
    try {
      const BASE_URL = import.meta.env.VITE_BASE_URL;
      const response = await axios.patch(
        `${BASE_URL}/admin/edit-issue/${ticketId}`,
        { status: "Resolved" },
        {
          headers: { Authorization: `Bearer ${token}` },
          timeout: 30000,
        }
      );
      toast.success(response.data.message || "Ticket marked as resolved.");
      setTickets((prev) => {
        const updatedTickets = { ...prev };
        updatedTickets.Pending = prev.Pending.filter((t) => t.id !== ticketId);
        updatedTickets["In Progress"] = prev["In Progress"].filter(
          (t) => t.id !== ticketId
        );
        updatedTickets.Resolved = [
          ...prev.Resolved,
          {
            ...[...prev.Pending, ...prev["In Progress"]].find(
              (t) => t.id === ticketId
            ),
            status: "Resolved",
          },
        ];
        return updatedTickets;
      });
      setFilteredTickets((prev) =>
        prev.map((t) => (t.id === ticketId ? { ...t, status: "Resolved" } : t))
      );
      setSelectedTicket(null);
    } catch (error) {
      console.error("❌ Error Marking as Resolved:", error);
      if (error.response?.status === 401) {
        toast.info("Session expired. Please log in again.");
        navigate("/login", { replace: true });
        return;
      }
      toast.error(error.response?.data?.message || "Failed to update ticket.");
    }
  };

  const handleDateFilterChange = (filter) => {
    setDateFilter(filter);
    setIsDateDropdownOpen(false);
  };

  const indexOfLastTicket = currentPage * ticketsPerPage;
  const indexOfFirstTicket = indexOfLastTicket - ticketsPerPage;
  const currentTickets = filteredTickets.slice(
    indexOfFirstTicket,
    indexOfLastTicket
  );
  const totalPages = Math.ceil(filteredTickets.length / ticketsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-600">
          All Tickets
        </h2>
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full sm:w-auto">
          <div className="relative w-full sm:w-64">
            <input
              type="text"
              placeholder="Search..."
              className="p-2 border border-gray-300 rounded-md w-full text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="relative w-full sm:w-auto" ref={dateDropdownRef}>
            <div
              className="flex items-center gap-2 cursor-pointer p-2 border border-gray-300 rounded-md text-sm text-gray-700"
              onClick={() => setIsDateDropdownOpen(!isDateDropdownOpen)}
            >
              <span>{dateFilter}</span>
              <RiArrowDropDownLine className="text-lg" />
            </div>
            {isDateDropdownOpen && (
              <div className="absolute right-0 top-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg w-32 z-10">
                {["Last Month", "All Time"].map((filter) => (
                  <div
                    key={filter}
                    className="p-2 cursor-pointer hover:bg-gray-100 text-sm"
                    onClick={() => handleDateFilterChange(filter)}
                  >
                    {filter}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse bg-white shadow-md rounded-lg text-xs sm:text-sm">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="p-2 sm:p-3 font-medium text-gray-600 border-b">
                Ticket ID
              </th>
              <th className="p-2 sm:p-3 font-medium text-gray-600 border-b">
                User Name
              </th>
              <th className="p-2 sm:p-3 font-medium text-gray-600 border-b hidden md:table-cell">
                Business Name
              </th>
              <th className="p-2 sm:p-3 font-medium text-gray-600 border-b hidden lg:table-cell">
                Issue Type
              </th>
              <th className="p-2 sm:p-3 font-medium text-gray-600 border-b hidden sm:table-cell">
                Status
              </th>
              <th className="p-2 sm:p-3 font-medium text-gray-600 border-b hidden md:table-cell">
                Date Submitted
              </th>
              <th className="p-2 sm:p-3 font-medium text-gray-600 border-b"></th>
            </tr>
          </thead>
          <tbody>
            {currentTickets.map((ticket) => (
              <tr key={ticket.id} className="border-b hover:bg-gray-50">
                <td className="p-2 sm:p-3 text-gray-700">{ticket.id}</td>
                <td className="p-2 sm:p-3 text-gray-700">{ticket.name}</td>
                <td className="p-2 sm:p-3 text-gray-700 hidden md:table-cell">
                  {ticket.business}
                </td>
                <td className="p-2 sm:p-3 text-gray-700 hidden lg:table-cell">
                  {ticket.issueType}
                </td>
                <td className="p-2 sm:p-3 hidden sm:table-cell">
                  <span
                    className={`text-[10px] sm:text-xs font-medium ${
                      ticket.status === "Resolved"
                        ? "text-green-500"
                        : ticket.status === "In Progress"
                        ? "text-yellow-500"
                        : "text-red-500"
                    }`}
                  >
                    {ticket.status}
                  </span>
                </td>
                <td className="p-2 sm:p-3 text-gray-700 hidden md:table-cell">
                  {new Date(ticket.createdAt).toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                  })}
                </td>
                <td className="p-2 sm:p-3 relative">
                  <div
                    className="relative"
                    onClick={() => setSelectedTicket(ticket)}
                    ref={dropdownRef}
                  >
                    <FaEllipsisV className="cursor-pointer text-gray-600 hover:text-gray-800" />
                    {selectedTicket?.id === ticket.id && (
                      <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-300 rounded-md shadow-lg z-10 dropdown-menu">
                        <button
                          className="block w-full text-left px-3 py-2 text-xs sm:text-sm text-gray-700 hover:bg-gray-100"
                          onClick={() => handleViewDetails(ticket)}
                        >
                          View Details
                        </button>
                        {(ticket.status === "Pending" ||
                          ticket.status === "In Progress") && (
                          <button
                            className="block w-full text-left px-3 py-2 text-xs sm:text-sm text-gray-700 hover:bg-gray-100"
                            onClick={() => handleMarkAsResolved(ticket.id)}
                          >
                            Mark as Resolved
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-center mt-4 gap-2">
        <button
          onClick={() => paginate(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-3 py-1 bg-gray-200 text-gray-700 rounded disabled:opacity-50 hover:bg-gray-300 text-xs sm:text-sm"
        >
          Previous
        </button>
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i + 1}
            onClick={() => paginate(i + 1)}
            className={`px-3 py-1 text-xs sm:text-sm ${
              currentPage === i + 1
                ? "bg-green-500 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            {i + 1}
          </button>
        ))}
        <button
          onClick={() => paginate(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-3 py-1 bg-gray-200 text-gray-700 rounded disabled:opacity-50 hover:bg-gray-300 text-xs sm:text-sm"
        >
          Next
        </button>
      </div>

      {isModalOpen && selectedTicket && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div
            ref={modalRef}
            className="bg-white p-4 sm:p-6 rounded-lg shadow-lg w-full max-w-md mx-auto relative"
          >
            <h2 className="text-lg font-semibold mb-4 text-gray-800 text-center">
              Ticket Details
            </h2>
            <div className="space-y-3 text-gray-700 text-sm text-center">
              <p>
                <strong>User Name:</strong> {selectedTicket.name}
              </p>
              <p>
                <strong className="text-green-600">
                  TICKET ID: {selectedTicket.id}
                </strong>
              </p>
              <p>
                <strong>Issue Type:</strong> {selectedTicket.issueType}
              </p>
              <p>{selectedTicket.issue}</p>
            </div>
            <button
              className="absolute top-2 right-2 text-gray-800 text-lg"
              onClick={() => {
                setIsModalOpen(false);
                setSelectedTicket(null);
              }}
            >
              ×
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

const PendingTickets = ({ tickets, setTickets }) => {
  const { token } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const [filteredTickets, setFilteredTickets] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [dateFilter, setDateFilter] = useState("Last Month");
  const [isDateDropdownOpen, setIsDateDropdownOpen] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [ticketsPerPage] = useState(5);
  const modalRef = useRef(null);
  const dateDropdownRef = useRef(null);
  const dropdownRef = useRef(null);

  useEffect(() => {
    let data = [...tickets.Pending, ...tickets["In Progress"]];

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      data = data.filter(
        (ticket) =>
          ticket.name.toLowerCase().includes(query) ||
          ticket.business.toLowerCase().includes(query) ||
          ticket.issueType.toLowerCase().includes(query) ||
          ticket.id.toLowerCase().includes(query)
      );
    }

    const now = new Date();
    const lastMonth = new Date(now.setMonth(now.getMonth() - 1));
    if (dateFilter === "Last Month") {
      data = data.filter((ticket) => {
        const submittedDate = new Date(ticket.createdAt);
        return submittedDate >= lastMonth && submittedDate <= now;
      });
    }

    setFilteredTickets(data);
    setCurrentPage(1);
  }, [tickets, searchQuery, dateFilter]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (modalRef.current && !modalRef.current.contains(e.target)) {
        setIsModalOpen(false);
        setSelectedTicket(null);
      }
      if (
        dateDropdownRef.current &&
        !dateDropdownRef.current.contains(e.target)
      ) {
        setIsDateDropdownOpen(false);
      }
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target) &&
        !e.target.closest(".dropdown-menu")
      ) {
        setSelectedTicket((prev) => (prev ? null : prev));
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isModalOpen, isDateDropdownOpen]);

  const handleViewDetails = (ticket) => {
    setSelectedTicket(ticket);
    setIsModalOpen(true);
  };

  const handleAssignToAgent = async (ticketId) => {
    try {
      const BASE_URL = import.meta.env.VITE_BASE_URL;
      const response = await axios.patch(
        `${BASE_URL}/admin/assign-to-me/${ticketId}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
          timeout: 30000,
        }
      );
      toast.success(response.data.message || "Issue assigned successfully.");
      setTickets((prev) => {
        const updatedTickets = { ...prev };
        updatedTickets.Pending = prev.Pending.filter((t) => t.id !== ticketId);
        updatedTickets["In Progress"] = [
          ...prev["In Progress"],
          {
            ...prev.Pending.find((t) => t.id === ticketId),
            status: "In Progress",
            assignedTo: response.data.issue.assignedTo,
          },
        ];
        return updatedTickets;
      });
      setFilteredTickets((prev) =>
        prev.map((t) =>
          t.id === ticketId
            ? {
                ...t,
                status: "In Progress",
                assignedTo: response.data.issue.assignedTo,
              }
            : t
        )
      );
      setSelectedTicket(null);
    } catch (error) {
      console.error("❌ Error Assigning to Agent:", error);
      if (error.response?.status === 401) {
        toast.info("Session expired. Please log in again.");
        navigate("/login", { replace: true });
        return;
      }
      toast.error(error.response?.data?.message || "Failed to assign ticket.");
    }
  };

  const handleDateFilterChange = (filter) => {
    setDateFilter(filter);
    setIsDateDropdownOpen(false);
  };

  const indexOfLastTicket = currentPage * ticketsPerPage;
  const indexOfFirstTicket = indexOfLastTicket - ticketsPerPage;
  const currentTickets = filteredTickets.slice(
    indexOfFirstTicket,
    indexOfLastTicket
  );
  const totalPages = Math.ceil(filteredTickets.length / ticketsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-600">
          Pending Tickets
        </h2>
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full sm:w-auto">
          <div className="relative w-full sm:w-64">
            <input
              type="text"
              placeholder="Search..."
              className="p-2 border border-gray-300 rounded-md w-full text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="relative w-full sm:w-auto" ref={dateDropdownRef}>
            <div
              className="flex items-center gap-2 cursor-pointer p-2 border border-gray-300 rounded-md text-sm text-gray-700"
              onClick={() => setIsDateDropdownOpen(!isDateDropdownOpen)}
            >
              <span>{dateFilter}</span>
              <RiArrowDropDownLine className="text-lg" />
            </div>
            {isDateDropdownOpen && (
              <div className="absolute right-0 top-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg w-32 z-10">
                {["Last Month", "All Time"].map((filter) => (
                  <div
                    key={filter}
                    className="p-2 cursor-pointer hover:bg-gray-100 text-sm"
                    onClick={() => handleDateFilterChange(filter)}
                  >
                    {filter}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse bg-white shadow-md rounded-lg text-xs sm:text-sm">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="p-2 sm:p-3 font-medium text-gray-600 border-b">
                Ticket ID
              </th>
              <th className="p-2 sm:p-3 font-medium text-gray-600 border-b">
                User Name
              </th>
              <th className="p-2 sm:p-3 font-medium text-gray-600 border-b hidden md:table-cell">
                Business Name
              </th>
              <th className="p-2 sm:p-3 font-medium text-gray-600 border-b hidden lg:table-cell">
                Issue Type
              </th>
              <th className="p-2 sm:p-3 font-medium text-gray-600 border-b hidden sm:table-cell">
                Status
              </th>
              <th className="p-2 sm:p-3 font-medium text-gray-600 border-b hidden md:table-cell">
                Date Submitted
              </th>
              <th className="p-2 sm:p-3 font-medium text-gray-600 border-b"></th>
            </tr>
          </thead>
          <tbody>
            {currentTickets.map((ticket) => (
              <tr key={ticket.id} className="border-b hover:bg-gray-50">
                <td className="p-2 sm:p-3 text-gray-700">{ticket.id}</td>
                <td className="p-2 sm:p-3 text-gray-700">{ticket.name}</td>
                <td className="p-2 sm:p-3 text-gray-700 hidden md:table-cell">
                  {ticket.business}
                </td>
                <td className="p-2 sm:p-3 text-gray-700 hidden lg:table-cell">
                  {ticket.issueType}
                </td>
                <td className="p-2 sm:p-3 hidden sm:table-cell">
                  <span
                    className={`text-[10px] sm:text-xs font-medium ${
                      ticket.status === "Resolved"
                        ? "text-green-500"
                        : ticket.status === "In Progress"
                        ? "text-yellow-500"
                        : "text-red-500"
                    }`}
                  >
                    {ticket.status}
                  </span>
                </td>
                <td className="p-2 sm:p-3 text-gray-700 hidden md:table-cell">
                  {new Date(ticket.createdAt).toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                  })}
                </td>
                <td className="p-2 sm:p-3 relative">
                  <div
                    className="relative"
                    onClick={() => setSelectedTicket(ticket)}
                    ref={dropdownRef}
                  >
                    <FaEllipsisV className="cursor-pointer text-gray-600 hover:text-gray-800" />
                    {selectedTicket?.id === ticket.id && (
                      <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-300 rounded-md shadow-lg z-10 dropdown-menu">
                        <button
                          className="block w-full text-left px-3 py-2 text-xs sm:text-sm text-gray-700 hover:bg-gray-100"
                          onClick={() => handleViewDetails(ticket)}
                        >
                          View Details
                        </button>
                        {ticket.status === "Pending" && (
                          <button
                            className="block w-full text-left px-3 py-2 text-xs sm:text-sm text-gray-700 hover:bg-gray-100"
                            onClick={() => handleAssignToAgent(ticket.id)}
                          >
                            Assign to Agent
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-center mt-4 gap-2">
        <button
          onClick={() => paginate(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-3 py-1 bg-gray-200 text-gray-700 rounded disabled:opacity-50 hover:bg-gray-300 text-xs sm:text-sm"
        >
          Previous
        </button>
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i + 1}
            onClick={() => paginate(i + 1)}
            className={`px-3 py-1 text-xs sm:text-sm ${
              currentPage === i + 1
                ? "bg-green-500 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            {i + 1}
          </button>
        ))}
        <button
          onClick={() => paginate(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-3 py-1 bg-gray-200 text-gray-700 rounded disabled:opacity-50 hover:bg-gray-300 text-xs sm:text-sm"
        >
          Next
        </button>
      </div>

      {isModalOpen && selectedTicket && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div
            ref={modalRef}
            className="bg-white p-4 sm:p-6 rounded-lg shadow-lg w-full max-w-md mx-auto relative"
          >
            <h2 className="text-lg font-semibold mb-4 text-gray-800 text-center">
              Ticket Details
            </h2>
            <div className="space-y-3 text-gray-700 text-sm text-center">
              <p>
                <strong>User Name:</strong> {selectedTicket.name}
              </p>
              <p>
                <strong className="text-green-600">
                  TICKET ID: {selectedTicket.id}
                </strong>
              </p>
              <p>
                <strong>Issue Type:</strong> {selectedTicket.issueType}
              </p>
              <p>{selectedTicket.issue}</p>
            </div>
            <button
              className="absolute top-2 right-2 text-gray-800 text-lg"
              onClick={() => {
                setIsModalOpen(false);
                setSelectedTicket(null);
              }}
            >
              ×
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

const ResolvedTickets = ({ tickets, setTickets }) => {
  const { token } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const [filteredTickets, setFilteredTickets] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [dateFilter, setDateFilter] = useState("Last Month");
  const [isDateDropdownOpen, setIsDateDropdownOpen] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [ticketsPerPage] = useState(5);
  const modalRef = useRef(null);
  const dateDropdownRef = useRef(null);
  const dropdownRef = useRef(null);

  useEffect(() => {
    let data = [...tickets.Resolved];

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      data = data.filter(
        (ticket) =>
          ticket.name.toLowerCase().includes(query) ||
          ticket.business.toLowerCase().includes(query) ||
          ticket.issueType.toLowerCase().includes(query) ||
          ticket.id.toLowerCase().includes(query)
      );
    }

    const now = new Date();
    const lastMonth = new Date(now.setMonth(now.getMonth() - 1));
    if (dateFilter === "Last Month") {
      data = data.filter((ticket) => {
        const submittedDate = new Date(ticket.createdAt);
        return submittedDate >= lastMonth && submittedDate <= now;
      });
    }

    setFilteredTickets(data);
    setCurrentPage(1);
  }, [tickets, searchQuery, dateFilter]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (modalRef.current && !modalRef.current.contains(e.target)) {
        setIsModalOpen(false);
        setSelectedTicket(null);
      }
      if (
        dateDropdownRef.current &&
        !dateDropdownRef.current.contains(e.target)
      ) {
        setIsDateDropdownOpen(false);
      }
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target) &&
        !e.target.closest(".dropdown-menu")
      ) {
        setSelectedTicket((prev) => (prev ? null : prev));
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isModalOpen, isDateDropdownOpen]);

  const handleViewDetails = (ticket) => {
    setSelectedTicket(ticket);
    setIsModalOpen(true);
  };

  const handleReopenTicket = async (ticketId) => {
    try {
      const BASE_URL = import.meta.env.VITE_BASE_URL;
      const response = await axios.patch(
        `${BASE_URL}/admin/edit-issue/${ticketId}`,
        { status: "Pending" },
        {
          headers: { Authorization: `Bearer ${token}` },
          timeout: 30000,
        }
      );
      toast.success(response.data.message || "Ticket reopened successfully.");
      setTickets((prev) => {
        const updatedTickets = { ...prev };
        updatedTickets.Resolved = prev.Resolved.filter(
          (t) => t.id !== ticketId
        );
        updatedTickets.Pending = [
          ...prev.Pending,
          {
            ...prev.Resolved.find((t) => t.id === ticketId),
            status: "Pending",
            assignedTo: null,
          },
        ];
        return updatedTickets;
      });
      setFilteredTickets((prev) => prev.filter((t) => t.id !== ticketId));
      setSelectedTicket(null);
    } catch (error) {
      console.error("❌ Error Reopening Ticket:", error);
      if (error.response?.status === 401) {
        toast.info("Session expired. Please log in again.");
        navigate("/login", { replace: true });
        return;
      }
      toast.error(error.response?.data?.message || "Failed to reopen ticket.");
    }
  };

  const handleDateFilterChange = (filter) => {
    setDateFilter(filter);
    setIsDateDropdownOpen(false);
  };

  const indexOfLastTicket = currentPage * ticketsPerPage;
  const indexOfFirstTicket = indexOfLastTicket - ticketsPerPage;
  const currentTickets = filteredTickets.slice(
    indexOfFirstTicket,
    indexOfLastTicket
  );
  const totalPages = Math.ceil(filteredTickets.length / ticketsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-600">
          Resolved Tickets
        </h2>
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full sm:w-auto">
          <div className="relative w-full sm:w-64">
            <input
              type="text"
              placeholder="Search..."
              className="p-2 border border-gray-300 rounded-md w-full text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="relative w-full sm:w-auto" ref={dateDropdownRef}>
            <div
              className="flex items-center gap-2 cursor-pointer p-2 border border-gray-300 rounded-md text-sm text-gray-700"
              onClick={() => setIsDateDropdownOpen(!isDateDropdownOpen)}
            >
              <span>{dateFilter}</span>
              <RiArrowDropDownLine className="text-lg" />
            </div>
            {isDateDropdownOpen && (
              <div className="absolute right-0 top-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg w-32 z-10">
                {["Last Month", "All Time"].map((filter) => (
                  <div
                    key={filter}
                    className="p-2 cursor-pointer hover:bg-gray-100 text-sm"
                    onClick={() => handleDateFilterChange(filter)}
                  >
                    {filter}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse bg-white shadow-md rounded-lg text-xs sm:text-sm">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="p-2 sm:p-3 font-medium text-gray-600 border-b">
                Ticket ID
              </th>
              <th className="p-2 sm:p-3 font-medium text-gray-600 border-b">
                User Name
              </th>
              <th className="p-2 sm:p-3 font-medium text-gray-600 border-b hidden md:table-cell">
                Business Name
              </th>
              <th className="p-2 sm:p-3 font-medium text-gray-600 border-b hidden lg:table-cell">
                Issue Type
              </th>
              <th className="p-2 sm:p-3 font-medium text-gray-600 border-b hidden md:table-cell">
                Date Submitted
              </th>
              <th className="p-2 sm:p-3 font-medium text-gray-600 border-b hidden lg:table-cell">
                Date Resolved
              </th>
              <th className="p-2 sm:p-3 font-medium text-gray-600 border-b hidden sm:table-cell">
                Assigned To
              </th>
              <th className="p-2 sm:p-3 font-medium text-gray-600 border-b"></th>
            </tr>
          </thead>
          <tbody>
            {currentTickets.map((ticket) => (
              <tr key={ticket.id} className="border-b hover:bg-gray-50">
                <td className="p-2 sm:p-3 text-gray-700">{ticket.id}</td>
                <td className="p-2 sm:p-3 text-gray-700">{ticket.name}</td>
                <td className="p-2 sm:p-3 text-gray-700 hidden md:table-cell">
                  {ticket.business}
                </td>
                <td className="p-2 sm:p-3 text-gray-700 hidden lg:table-cell">
                  {ticket.issueType}
                </td>
                <td className="p-2 sm:p-3 text-gray-700 hidden md:table-cell">
                  {new Date(ticket.createdAt).toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                  })}
                </td>
                <td className="p-2 sm:p-3 text-gray-700 hidden lg:table-cell">
                  {ticket.resolvedAt
                    ? new Date(ticket.resolvedAt).toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                      })
                    : "N/A"}
                </td>
                <td className="p-2 sm:p-3 text-gray-700 hidden sm:table-cell">
                  {ticket.assignedTo || "N/A"}
                </td>
                <td className="p-2 sm:p-3 relative">
                  <div
                    className="relative"
                    onClick={() => setSelectedTicket(ticket)}
                    ref={dropdownRef}
                  >
                    <FaEllipsisV className="cursor-pointer text-gray-600 hover:text-gray-800" />
                    {selectedTicket?.id === ticket.id && (
                      <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-300 rounded-md shadow-lg z-10 dropdown-menu">
                        <button
                          className="block w-full text-left px-3 py-2 text-xs sm:text-sm text-gray-700 hover:bg-gray-100"
                          onClick={() => handleViewDetails(ticket)}
                        >
                          View Details
                        </button>
                        <button
                          className="block w-full text-left px-3 py-2 text-xs sm:text-sm text-gray-700 hover:bg-gray-100"
                          onClick={() => handleReopenTicket(ticket.id)}
                        >
                          Re-open Ticket
                        </button>
                      </div>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-center mt-4 gap-2">
        <button
          onClick={() => paginate(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-3 py-1 bg-gray-200 text-gray-700 rounded disabled:opacity-50 hover:bg-gray-300 text-xs sm:text-sm"
        >
          Previous
        </button>
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i + 1}
            onClick={() => paginate(i + 1)}
            className={`px-3 py-1 text-xs sm:text-sm ${
              currentPage === i + 1
                ? "bg-green-500 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            {i + 1}
          </button>
        ))}
        <button
          onClick={() => paginate(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-3 py-1 bg-gray-200 text-gray-700 rounded disabled:opacity-50 hover:bg-gray-300 text-xs sm:text-sm"
        >
          Next
        </button>
      </div>

      {isModalOpen && selectedTicket && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div
            ref={modalRef}
            className="bg-white p-4 sm:p-6 rounded-lg shadow-lg w-full max-w-md mx-auto relative"
          >
            <h2 className="text-lg font-semibold mb-4 text-gray-800 text-center">
              Ticket Details
            </h2>
            <div className="space-y-3 text-gray-700 text-sm text-center">
              <p>
                <strong>User Name:</strong> {selectedTicket.name}
              </p>
              <p>
                <strong className="text-green-600">
                  TICKET ID: {selectedTicket.id}
                </strong>
              </p>
              <p>
                <strong>Issue Type:</strong> {selectedTicket.issueType}
              </p>
              <p>{selectedTicket.issue}</p>
            </div>
            <button
              className="absolute top-2 right-2 text-gray-800 text-lg"
              onClick={() => {
                setIsModalOpen(false);
                setSelectedTicket(null);
              }}
            >
              ×
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

const AssignedTickets = ({ tickets, setTickets }) => {
  const { token } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const [filteredTickets, setFilteredTickets] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [dateFilter, setDateFilter] = useState("Last Month");
  const [isDateDropdownOpen, setIsDateDropdownOpen] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [ticketsPerPage] = useState(5);
  const modalRef = useRef(null);
  const dateDropdownRef = useRef(null);
  const dropdownRef = useRef(null);

  useEffect(() => {
    let data = [...tickets["In Progress"]].filter(
      (ticket) => ticket.assignedTo
    );

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      data = data.filter(
        (ticket) =>
          ticket.name.toLowerCase().includes(query) ||
          ticket.business.toLowerCase().includes(query) ||
          ticket.issueType.toLowerCase().includes(query) ||
          ticket.id.toLowerCase().includes(query)
      );
    }

    const now = new Date();
    const lastMonth = new Date(now.setMonth(now.getMonth() - 1));
    if (dateFilter === "Last Month") {
      data = data.filter((ticket) => {
        const submittedDate = new Date(ticket.createdAt);
        return submittedDate >= lastMonth && submittedDate <= now;
      });
    }

    setFilteredTickets(data);
    setCurrentPage(1);
  }, [tickets, searchQuery, dateFilter]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (modalRef.current && !modalRef.current.contains(e.target)) {
        setIsModalOpen(false);
        setSelectedTicket(null);
      }
      if (
        dateDropdownRef.current &&
        !dateDropdownRef.current.contains(e.target)
      ) {
        setIsDateDropdownOpen(false);
      }
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target) &&
        !e.target.closest(".dropdown-menu")
      ) {
        setSelectedTicket((prev) => (prev ? null : prev));
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isModalOpen, isDateDropdownOpen]);

  const handleViewDetails = (ticket) => {
    setSelectedTicket(ticket);
    setIsModalOpen(true);
  };

  const handleMarkAsResolved = async (ticketId) => {
    try {
      const BASE_URL = import.meta.env.VITE_BASE_URL;
      const response = await axios.patch(
        `${BASE_URL}/admin/edit-issue/${ticketId}`,
        { status: "Resolved" },
        {
          headers: { Authorization: `Bearer ${token}` },
          timeout: 30000,
        }
      );
      toast.success(response.data.message || "Ticket marked as resolved.");
      setTickets((prev) => {
        const updatedTickets = { ...prev };
        updatedTickets["In Progress"] = prev["In Progress"].filter(
          (t) => t.id !== ticketId
        );
        updatedTickets.Resolved = [
          ...prev.Resolved,
          {
            ...prev["In Progress"].find((t) => t.id === ticketId),
            status: "Resolved",
          },
        ];
        return updatedTickets;
      });
      setFilteredTickets((prev) => prev.filter((t) => t.id !== ticketId));
      setSelectedTicket(null);
    } catch (error) {
      console.error("❌ Error Marking as Resolved:", error);
      if (error.response?.status === 401) {
        toast.info("Session expired. Please log in again.");
        navigate("/login", { replace: true });
        return;
      }
      toast.error(error.response?.data?.message || "Failed to update ticket.");
    }
  };

  const handleDateFilterChange = (filter) => {
    setDateFilter(filter);
    setIsDateDropdownOpen(false);
  };

  const indexOfLastTicket = currentPage * ticketsPerPage;
  const indexOfFirstTicket = indexOfLastTicket - ticketsPerPage;
  const currentTickets = filteredTickets.slice(
    indexOfFirstTicket,
    indexOfLastTicket
  );
  const totalPages = Math.ceil(filteredTickets.length / ticketsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-600">
          Assigned Tickets
        </h2>
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full sm:w-auto">
          <div className="relative w-full sm:w-64">
            <input
              type="text"
              placeholder="Search..."
              className="p-2 border border-gray-300 rounded-md w-full text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="relative w-full sm:w-auto" ref={dateDropdownRef}>
            <div
              className="flex items-center gap-2 cursor-pointer p-2 border border-gray-300 rounded-md text-sm text-gray-700"
              onClick={() => setIsDateDropdownOpen(!isDateDropdownOpen)}
            >
              <span>{dateFilter}</span>
              <RiArrowDropDownLine className="text-lg" />
            </div>
            {isDateDropdownOpen && (
              <div className="absolute right-0 top-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg w-32 z-10">
                {["Last Month", "All Time"].map((filter) => (
                  <div
                    key={filter}
                    className="p-2 cursor-pointer hover:bg-gray-100 text-sm"
                    onClick={() => handleDateFilterChange(filter)}
                  >
                    {filter}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse bg-white shadow-md rounded-lg text-xs sm:text-sm">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="p-2 sm:p-3 font-medium text-gray-600 border-b">
                Ticket ID
              </th>
              <th className="p-2 sm:p-3 font-medium text-gray-600 border-b">
                User Name
              </th>
              <th className="p-2 sm:p-3 font-medium text-gray-600 border-b hidden md:table-cell">
                Business Name
              </th>
              <th className="p-2 sm:p-3 font-medium text-gray-600 border-b hidden lg:table-cell">
                Issue Type
              </th>
              <th className="p-2 sm:p-3 font-medium text-gray-600 border-b hidden sm:table-cell">
                Status
              </th>
              <th className="p-2 sm:p-3 font-medium text-gray-600 border-b hidden md:table-cell">
                Date Submitted
              </th>
              <th className="p-2 sm:p-3 font-medium text-gray-600 border-b hidden sm:table-cell">
                Assigned To
              </th>
              <th className="p-2 sm:p-3 font-medium text-gray-600 border-b"></th>
            </tr>
          </thead>
          <tbody>
            {currentTickets.map((ticket) => (
              <tr key={ticket.id} className="border-b hover:bg-gray-50">
                <td className="p-2 sm:p-3 text-gray-700">{ticket.id}</td>
                <td className="p-2 sm:p-3 text-gray-700">{ticket.name}</td>
                <td className="p-2 sm:p-3 text-gray-700 hidden md:table-cell">
                  {ticket.business}
                </td>
                <td className="p-2 sm:p-3 text-gray-700 hidden lg:table-cell">
                  {ticket.issueType}
                </td>
                <td className="p-2 sm:p-3 hidden sm:table-cell">
                  <span
                    className={`text-[10px] sm:text-xs font-medium ${
                      ticket.status === "Resolved"
                        ? "text-green-500"
                        : ticket.status === "In Progress"
                        ? "text-yellow-500"
                        : "text-red-500"
                    }`}
                  >
                    {ticket.status}
                  </span>
                </td>
                <td className="p-2 sm:p-3 text-gray-700 hidden md:table-cell">
                  {new Date(ticket.createdAt).toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                  })}
                </td>
                <td className="p-2 sm:p-3 text-gray-700 hidden sm:table-cell">
                  {ticket.assignedTo || "N/A"}
                </td>
                <td className="p-2 sm:p-3 relative">
                  <div
                    className="relative"
                    onClick={() => setSelectedTicket(ticket)}
                    ref={dropdownRef}
                  >
                    <FaEllipsisV className="cursor-pointer text-gray-600 hover:text-gray-800" />
                    {selectedTicket?.id === ticket.id && (
                      <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-300 rounded-md shadow-lg z-10 dropdown-menu">
                        <button
                          className="block w-full text-left px-3 py-2 text-xs sm:text-sm text-gray-700 hover:bg-gray-100"
                          onClick={() => handleViewDetails(ticket)}
                        >
                          View Details
                        </button>
                        <button
                          className="block w-full text-left px-3 py-2 text-xs sm:text-sm text-gray-700 hover:bg-gray-100"
                          onClick={() => handleMarkAsResolved(ticket.id)}
                        >
                          Mark as Resolved
                        </button>
                      </div>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-center mt-4 gap-2">
        <button
          onClick={() => paginate(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-3 py-1 bg-gray-200 text-gray-700 rounded disabled:opacity-50 hover:bg-gray-300 text-xs sm:text-sm"
        >
          Previous
        </button>
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i + 1}
            onClick={() => paginate(i + 1)}
            className={`px-3 py-1 text-xs sm:text-sm ${
              currentPage === i + 1
                ? "bg-green-500 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            {i + 1}
          </button>
        ))}
        <button
          onClick={() => paginate(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-3 py-1 bg-gray-200 text-gray-700 rounded disabled:opacity-50 hover:bg-gray-300 text-xs sm:text-sm"
        >
          Next
        </button>
      </div>

      {isModalOpen && selectedTicket && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div
            ref={modalRef}
            className="bg-white p-4 sm:p-6 rounded-lg shadow-lg w-full max-w-md mx-auto relative"
          >
            <h2 className="text-lg font-semibold mb-4 text-gray-800 text-center">
              Ticket Details
            </h2>
            <div className="space-y-3 text-gray-700 text-sm text-center">
              <p>
                <strong>User Name:</strong> {selectedTicket.name}
              </p>
              <p>
                <strong className="text-green-600">
                  TICKET ID: {selectedTicket.id}
                </strong>
              </p>
              <p>
                <strong>Issue Type:</strong> {selectedTicket.issueType}
              </p>
              <p>{selectedTicket.issue}</p>
            </div>
            <button
              className="absolute top-2 right-2 text-gray-800 text-lg"
              onClick={() => {
                setIsModalOpen(false);
                setSelectedTicket(null);
              }}
            >
              ×
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

const FAQs = () => {
  const { token } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const [faqs, setFaqs] = useState([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedFaq, setSelectedFaq] = useState(null);
  const [newQuestion, setNewQuestion] = useState("");
  const [newAnswer, setNewAnswer] = useState("");
  const [editQuestion, setEditQuestion] = useState("");
  const [editAnswer, setEditAnswer] = useState("");
  const [isAdding, setIsAdding] = useState(false);
  const addModalRef = useRef(null);
  const editModalRef = useRef(null);

  useEffect(() => {
    const fetchFaqs = async () => {
      try {
        const BASE_URL = import.meta.env.VITE_BASE_URL;
        const response = await axios.get(`${BASE_URL}/admin/get-faqs`, {
          headers: { Authorization: `Bearer ${token}` },
          timeout: 30000,
        });
        setFaqs(response.data.faqs || []);
      } catch (error) {
        console.error("❌ Error Fetching FAQs:", error);
        if (error.response?.status === 401) {
          toast.info("Session expired. Please log in again.");
          navigate("/login", { replace: true });
          return;
        }
        toast.error(error.response?.data?.message || "Failed to fetch FAQs.");
      }
    };
    fetchFaqs();
  }, [token, navigate]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (addModalRef.current && !addModalRef.current.contains(e.target)) {
        setIsAddModalOpen(false);
        setNewQuestion("");
        setNewAnswer("");
      }
      if (editModalRef.current && !editModalRef.current.contains(e.target)) {
        setIsEditModalOpen(false);
        setSelectedFaq(null);
        setEditQuestion("");
        setEditAnswer("");
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isAddModalOpen, isEditModalOpen]);

  const handleAddFaq = async (e) => {
    e.preventDefault();
    setIsAdding(true);
    const startTime = Date.now();
    console.log("Starting FAQ creation request...");
    try {
      const BASE_URL = import.meta.env.VITE_BASE_URL;
      const response = await axios.post(
        `${BASE_URL}/admin/create-faq`,
        { question: newQuestion, answer: newAnswer },
        {
          headers: { Authorization: `Bearer ${token}` },
          timeout: 60000,
        }
      );
      console.log(`Request completed in ${Date.now() - startTime}ms`);
      toast.success(response.data.message || "FAQ added successfully.");
      setFaqs([...faqs, response.data.faq]);
      setIsAddModalOpen(false);
      setNewQuestion("");
      setNewAnswer("");
    } catch (error) {
      console.error("❌ Error Adding FAQ:", error);
      console.log(`Request failed after ${Date.now() - startTime}ms`);
      let errorMessage = "Failed to add FAQ.";
      if (error.code === "ECONNABORTED") {
        errorMessage =
          "Request timed out. Please check your network or try again later.";
      } else if (error.response?.status === 401) {
        errorMessage = "Session expired. Please log in again.";
        toast.info(errorMessage);
        navigate("/login", { replace: true });
        return;
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }
      toast.error(errorMessage);
    } finally {
      setIsAdding(false);
    }
  };

  const handleEditFaq = async (e) => {
    e.preventDefault();
    if (!selectedFaq) return;
    try {
      const BASE_URL = import.meta.env.VITE_BASE_URL;
      const response = await axios.patch(
        `${BASE_URL}/admin/edit-faq/${selectedFaq.id}`,
        { question: editQuestion, answer: editAnswer },
        {
          headers: { Authorization: `Bearer ${token}` },
          timeout: 30000,
        }
      );
      toast.success(response.data.message || "FAQ updated successfully.");
      setFaqs(
        faqs.map((faq) => (faq.id === selectedFaq.id ? response.data.faq : faq))
      );
      setIsEditModalOpen(false);
      setSelectedFaq(null);
      setEditQuestion("");
      setEditAnswer("");
    } catch (error) {
      console.error("❌ Error Editing FAQ:", error);
      if (error.response?.status === 401) {
        toast.info("Session expired. Please log in again.");
        navigate("/login", { replace: true });
        return;
      }
      toast.error(error.response?.data?.message || "Failed to update FAQ.");
    }
  };

  const handleDeleteFaq = async (id) => {
    try {
      const BASE_URL = import.meta.env.VITE_BASE_URL;
      const response = await axios.delete(
        `${BASE_URL}/admin/delete-faq/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
          timeout: 30000,
        }
      );
      toast.success(response.data.message || "FAQ deleted successfully.");
      setFaqs(faqs.filter((faq) => faq.id !== id));
    } catch (error) {
      console.error("❌ Error Deleting FAQ:", error);
      if (error.response?.status === 401) {
        toast.info("Session expired. Please log in again.");
        navigate("/login", { replace: true });
        return;
      }
      toast.error(error.response?.data?.message || "Failed to delete FAQ.");
    }
  };

  const handleViewOrEdit = async (faq) => {
    setSelectedFaq(faq);
    const BASE_URL = import.meta.env.VITE_BASE_URL;
    try {
      const response = await axios.get(
        `${BASE_URL}/admin/get-an-faq/${faq.id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
          timeout: 30000,
        }
      );
      setEditQuestion(response.data.faq.question);
      setEditAnswer(response.data.faq.answer);
      setIsEditModalOpen(true);
    } catch (error) {
      console.error("❌ Error Fetching FAQ:", error);
      if (error.response?.status === 401) {
        toast.info("Session expired. Please log in again.");
        navigate("/login", { replace: true });
        return;
      }
      toast.error(error.response?.data?.message || "Failed to fetch FAQ.");
    }
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-600">
          FAQs & Knowledge Base
        </h2>
        <div className="flex items-center gap-4">
          <button
            className="bg-green-600 text-white px-3 py-2 rounded hover:bg-green-700 text-sm sm:text-base"
            onClick={() => setIsAddModalOpen(true)}
          >
            + Add Question
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse bg-white shadow-md rounded-lg text-xs sm:text-sm">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="p-2 sm:p-3 font-medium text-gray-600 border-b">
                Question
              </th>
              <th className="p-2 sm:p-3 font-medium text-gray-600 border-b hidden sm:table-cell">
                Answer
              </th>
              <th className="p-2 sm:p-3 font-medium text-gray-600 border-b">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {faqs.map((faq) => (
              <tr key={faq.id} className="border-b hover:bg-gray-50">
                <td className="p-2 sm:p-3 text-gray-700">{faq.question}</td>
                <td className="p-2 sm:p-3 text-gray-700 hidden sm:table-cell">
                  {faq.answer}
                </td>
                <td className="p-2 sm:p-3">
                  <div className="flex space-x-2">
                    <FaEdit
                      className="cursor-pointer text-blue-600 hover:text-blue-800 text-sm sm:text-base"
                      onClick={() => handleViewOrEdit(faq)}
                    />
                    <FaTrash
                      className="cursor-pointer text-red-600 hover:text-red-800 text-sm sm:text-base"
                      onClick={() => handleDeleteFaq(faq.id)}
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div
            ref={addModalRef}
            className="bg-white p-4 sm:p-6 rounded-lg shadow-lg w-full max-w-md mx-auto relative"
          >
            <h2 className="text-lg font-semibold mb-4 text-gray-800 text-center">
              New Question
            </h2>
            <form onSubmit={handleAddFaq}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Question
                </label>
                <textarea
                  className="w-full p-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                  value={newQuestion}
                  onChange={(e) => setNewQuestion(e.target.value)}
                  placeholder="What is the whole of whatsoever..."
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Answer
                </label>
                <textarea
                  className="w-full p-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                  value={newAnswer}
                  onChange={(e) => setNewAnswer(e.target.value)}
                  placeholder="Enter the answer..."
                />
              </div>
              <button
                type="submit"
                className="w-full bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-50 text-sm sm:text-base"
                disabled={isAdding}
              >
                {isAdding ? "Adding..." : "Add Question"}
              </button>
              <button
                type="button"
                className="absolute top-2 right-2 text-gray-800 text-lg"
                onClick={() => {
                  setIsAddModalOpen(false);
                  setNewQuestion("");
                  setNewAnswer("");
                }}
              >
                ×
              </button>
            </form>
          </div>
        </div>
      )}

      {isEditModalOpen && selectedFaq && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div
            ref={editModalRef}
            className="bg-white p-4 sm:p-6 rounded-lg shadow-lg w-full max-w-md mx-auto relative"
          >
            <h2 className="text-lg font-semibold mb-4 text-gray-800 text-center">
              Edit Question
            </h2>
            <form onSubmit={handleEditFaq}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Question
                </label>
                <textarea
                  className="w-full p-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                  value={editQuestion}
                  onChange={(e) => setEditQuestion(e.target.value)}
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Answer
                </label>
                <textarea
                  className="w-full p-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                  value={editAnswer}
                  onChange={(e) => setEditAnswer(e.target.value)}
                />
              </div>
              <button
                type="submit"
                className="w-full bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 text-sm sm:text-base"
              >
                Update Question
              </button>
              <button
                type="button"
                className="absolute top-2 right-2 text-gray-800 text-lg"
                onClick={() => {
                  setIsEditModalOpen(false);
                  setSelectedFaq(null);
                  setEditQuestion("");
                  setEditAnswer("");
                }}
              >
                ×
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Support;
