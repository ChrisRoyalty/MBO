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

    if (user && user.firstName && user.lastName) {
      setProfileData({
        firstname: user.firstName,
        lastname: user.lastName,
      });
    } else {
      setProfileData({
        firstname: "Admin",
        lastname: "Hello",
      });
    }

    const fetchData = async () => {
      try {
        const BASE_URL = import.meta.env.VITE_BASE_URL;
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
        }
      } catch (error) {
        console.error("❌ Error Fetching Tickets:", error);
        setError(error.response?.data?.message || "Failed to fetch tickets.");
        toast.error(
          error.response?.data?.message || "Failed to fetch tickets."
        );
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
      <div className="lg:w-64 w-full p-4 shadow-md pt-16 flex flex-col lg:items-center bg-white lg:min-h-screen">
        <nav>
          <ul className="space-y-2">
            <li>
              <NavLink
                to="/admin/support/all-tickets"
                className={({ isActive }) =>
                  `flex items-center gap-2 p-2 rounded text-sm ${
                    isActive ? "font-bold text-gray-800" : "text-gray-600"
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
                    isActive ? "font-bold text-gray-800" : "text-gray-600"
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
                    isActive ? "font-bold text-gray-800" : "text-gray-600"
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
                    isActive ? "font-bold text-gray-800" : "text-gray-600"
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
                    isActive ? "font-bold text-gray-800" : "text-gray-600"
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

const NoDataDisplay = () => (
  <div className="flex flex-col items-center justify-center py-12 text-center animate-fade-in">
    <div className="relative">
      <div className="w-32 h-32 bg-gray-100 rounded-full flex items-center justify-center">
        <svg
          className="w-16 h-16 text-gray-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
          />
        </svg>
      </div>
      <div className="absolute -bottom-2 -right-2 bg-green-500 text-white rounded-full w-8 h-8 flex items-center justify-center animate-pulse">
        <span className="text-sm">0</span>
      </div>
    </div>
    <h3 className="mt-4 text-lg font-semibold text-gray-700">
      No Data Available
    </h3>
    <p className="mt-2 text-sm text-gray-500 max-w-sm">
      It looks like there's nothing here yet. Check back later or try adjusting
      your filters!
    </p>
  </div>
);

const AllTickets = ({ tickets, setTickets }) => {
  const { token } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const [filteredTickets, setFilteredTickets] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [dateFilter, setDateFilter] = useState("All Time");
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
          ticket.id?.toLowerCase().includes(query) ||
          ticket.name?.toLowerCase().includes(query) ||
          ticket.business?.toLowerCase().includes(query) ||
          ticket.issueType?.toLowerCase().includes(query) ||
          ticket.status?.toLowerCase().includes(query) ||
          new Date(ticket.createdAt).toLocaleDateString("en-GB").includes(query)
      );
    }

    if (dateFilter === "Last Month") {
      const now = new Date();
      const lastMonth = new Date(now.setMonth(now.getMonth() - 1));
      data = data.filter((ticket) => {
        const submittedDate = new Date(ticket.createdAt);
        return submittedDate >= lastMonth;
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
        setSelectedTicket(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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
        { headers: { Authorization: `Bearer ${token}` }, timeout: 30000 }
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
      setSelectedTicket(null);
    } catch (error) {
      console.error("❌ Error Marking as Resolved:", error);
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
              placeholder="Search by ID, name, business, type, status, date..."
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
                {["All Time", "Last Month"].map((filter) => (
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

      {currentTickets.length === 0 ? (
        <NoDataDisplay />
      ) : (
        <>
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
                      {new Date(ticket.createdAt).toLocaleDateString("en-GB")}
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
        </>
      )}

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
  const [dateFilter, setDateFilter] = useState("All Time");
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
          ticket.id?.toLowerCase().includes(query) ||
          ticket.name?.toLowerCase().includes(query) ||
          ticket.business?.toLowerCase().includes(query) ||
          ticket.issueType?.toLowerCase().includes(query) ||
          ticket.status?.toLowerCase().includes(query) ||
          new Date(ticket.createdAt).toLocaleDateString("en-GB").includes(query)
      );
    }

    if (dateFilter === "Last Month") {
      const now = new Date();
      const lastMonth = new Date(now.setMonth(now.getMonth() - 1));
      data = data.filter((ticket) => {
        const submittedDate = new Date(ticket.createdAt);
        return submittedDate >= lastMonth;
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
        setSelectedTicket(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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
        { headers: { Authorization: `Bearer ${token}` }, timeout: 30000 }
      );
      toast.success(response.data.message || "Issue assigned successfully.");
      setTickets((prev) => {
        const updatedTickets = { ...prev };
        updatedTickets.Pending = prev.Pending.filter((t) => t.id !== ticketId);
        updatedTickets["InProgress"] = [
          ...prev["In Progress"],
          {
            ...prev.Pending.find((t) => t.id === ticketId),
            status: "In Progress",
            assignedTo: response.data.issue.assignedTo,
          },
        ];
        return updatedTickets;
      });
      setSelectedTicket(null);
    } catch (error) {
      console.error("❌ Error Assigning to Agent:", error);
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
              placeholder="Search by ID, name, business, type, status, date..."
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
                {["All Time", "Last Month"].map((filter) => (
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

      {currentTickets.length === 0 ? (
        <NoDataDisplay />
      ) : (
        <>
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
                      {new Date(ticket.createdAt).toLocaleDateString("en-GB")}
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
        </>
      )}

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
  const [dateFilter, setDateFilter] = useState("All Time");
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
          ticket.id?.toLowerCase().includes(query) ||
          ticket.name?.toLowerCase().includes(query) ||
          ticket.business?.toLowerCase().includes(query) ||
          ticket.issueType?.toLowerCase().includes(query) ||
          ticket.status?.toLowerCase().includes(query) ||
          new Date(ticket.createdAt)
            .toLocaleDateString("en-GB")
            .includes(query) ||
          ticket.assignedTo?.toLowerCase().includes(query)
      );
    }

    if (dateFilter === "Last Month") {
      const now = new Date();
      const lastMonth = new Date(now.setMonth(now.getMonth() - 1));
      data = data.filter((ticket) => {
        const submittedDate = new Date(ticket.createdAt);
        return submittedDate >= lastMonth;
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
        setSelectedTicket(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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
        { headers: { Authorization: `Bearer ${token}` }, timeout: 30000 }
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
      setSelectedTicket(null);
    } catch (error) {
      console.error("❌ Error Reopening Ticket:", error);
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
              placeholder="Search by ID, name, business, type, status, date, assigned..."
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
                {["All Time", "Last Month"].map((filter) => (
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

      {currentTickets.length === 0 ? (
        <NoDataDisplay />
      ) : (
        <>
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
                      {new Date(ticket.createdAt).toLocaleDateString("en-GB")}
                    </td>
                    <td className="p-2 sm:p-3 text-gray-700 hidden lg:table-cell">
                      {ticket.resolvedAt
                        ? new Date(ticket.resolvedAt).toLocaleDateString(
                            "en-GB"
                          )
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
        </>
      )}

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
  const [dateFilter, setDateFilter] = useState("All Time");
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
          ticket.id?.toLowerCase().includes(query) ||
          ticket.name?.toLowerCase().includes(query) ||
          ticket.business?.toLowerCase().includes(query) ||
          ticket.issueType?.toLowerCase().includes(query) ||
          ticket.status?.toLowerCase().includes(query) ||
          new Date(ticket.createdAt)
            .toLocaleDateString("en-GB")
            .includes(query) ||
          ticket.assignedTo?.toLowerCase().includes(query)
      );
    }

    if (dateFilter === "Last Month") {
      const now = new Date();
      const lastMonth = new Date(now.setMonth(now.getMonth() - 1));
      data = data.filter((ticket) => {
        const submittedDate = new Date(ticket.createdAt);
        return submittedDate >= lastMonth;
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
        setSelectedTicket(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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
        { headers: { Authorization: `Bearer ${token}` }, timeout: 30000 }
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
      setSelectedTicket(null);
    } catch (error) {
      console.error("❌ Error Marking as Resolved:", error);
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
              placeholder="Search by ID, name, business, type, status, date, assigned..."
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
                {["All Time", "Last Month"].map((filter) => (
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

      {currentTickets.length === 0 ? (
        <NoDataDisplay />
      ) : (
        <>
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
                      {new Date(ticket.createdAt).toLocaleDateString("en-GB")}
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
        </>
      )}

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
  const [faqs, setFaqs] = useState([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedFaq, setSelectedFaq] = useState(null);
  const [newQuestion, setNewQuestion] = useState("");
  const [newAnswer, setNewAnswer] = useState("");
  const [editQuestion, setEditQuestion] = useState("");
  const [editAnswer, setEditAnswer] = useState("");
  const [isAdding, setIsAdding] = useState(false);
  const addModalRef = useRef(null);
  const editModalRef = useRef(null);
  const deleteModalRef = useRef(null);

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
        toast.error(error.response?.data?.message || "Failed to fetch FAQs.");
      }
    };
    fetchFaqs();
  }, [token]);

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
      if (
        deleteModalRef.current &&
        !deleteModalRef.current.contains(e.target)
      ) {
        setIsDeleteModalOpen(false);
        setSelectedFaq(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleAddFaq = async (e) => {
    e.preventDefault();
    setIsAdding(true);
    try {
      const BASE_URL = import.meta.env.VITE_BASE_URL;
      const response = await axios.post(
        `${BASE_URL}/admin/create-faq`,
        { question: newQuestion, answer: newAnswer },
        { headers: { Authorization: `Bearer ${token}` }, timeout: 60000 }
      );
      toast.success(response.data.message || "FAQ added successfully.");
      setFaqs([...faqs, response.data.faq]);
      setIsAddModalOpen(false);
      setNewQuestion("");
      setNewAnswer("");
    } catch (error) {
      console.error("❌ Error Adding FAQ:", error);
      toast.error(error.response?.data?.message || "Failed to add FAQ.");
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
        { headers: { Authorization: `Bearer ${token}` }, timeout: 30000 }
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
      toast.error(error.response?.data?.message || "Failed to update FAQ.");
    }
  };

  const handleDeleteFaq = async () => {
    if (!selectedFaq) return;
    try {
      const BASE_URL = import.meta.env.VITE_BASE_URL;
      const response = await axios.delete(
        `${BASE_URL}/admin/delete-faq/${selectedFaq.id}`,
        { headers: { Authorization: `Bearer ${token}` }, timeout: 30000 }
      );
      toast.success(response.data.message || "FAQ deleted successfully.");
      setFaqs(faqs.filter((faq) => faq.id !== selectedFaq.id));
      setIsDeleteModalOpen(false);
      setSelectedFaq(null);
    } catch (error) {
      console.error("❌ Error Deleting FAQ:", error);
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
      toast.error(error.response?.data?.message || "Failed to fetch FAQ.");
    }
  };

  const handleDeleteConfirm = (faq) => {
    setSelectedFaq(faq);
    setIsDeleteModalOpen(true);
  };

  return (
    <div className="w-full overflow-x-auto">
      <div className="flex flex-col gap-4 mb-6">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-600">
          FAQs & Knowledge Base
        </h2>
        <button
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 text-sm w-full sm:w-auto"
          onClick={() => setIsAddModalOpen(true)}
        >
          + Add Question
        </button>
      </div>

      {faqs.length === 0 ? (
        <NoDataDisplay />
      ) : (
        <div className="w-full overflow-x-auto">
          <table className="w-full overflow-x-auto border-collapse bg-white shadow-md rounded-lg text-xs sm:text-sm">
            <thead>
              <tr className="bg-gray-100 text-left text-xs">
                <th className="p-2 sm:p-3 font-medium text-gray-600 border-b min-w-[150px]">
                  Question
                </th>
                <th className="p-2 sm:p-3 font-medium text-gray-600 border-b min-w-[200px] hidden sm:table-cell">
                  Answer
                </th>
                <th className="p-2 sm:p-3 font-medium text-gray-600 border-b w-[80px]">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {faqs.map((faq) => (
                <tr key={faq.id} className="border-b hover:bg-gray-50">
                  <td className="p-2 sm:p-3 text-gray-700 break-words">
                    {faq.question}
                  </td>
                  <td className="p-2 sm:p-3 text-gray-700 break-words hidden sm:table-cell">
                    {faq.answer}
                  </td>
                  <td className="p-2 sm:p-3">
                    <div className="flex space-x-2 justify-center">
                      <FaEdit
                        className="cursor-pointer text-blue-600 hover:text-blue-800 text-sm"
                        onClick={() => handleViewOrEdit(faq)}
                      />
                      <FaTrash
                        className="cursor-pointer text-red-600 hover:text-red-800 text-sm"
                        onClick={() => handleDeleteConfirm(faq)}
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div
            ref={addModalRef}
            className="bg-white p-4 rounded-lg shadow-lg w-full max-w-md max-h-[90vh] overflow-y-auto"
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
                  className="w-full p-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-green-500 resize-y"
                  value={newQuestion}
                  onChange={(e) => setNewQuestion(e.target.value)}
                  placeholder="What is the whole of whatsoever..."
                  required
                  rows={3}
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Answer
                </label>
                <textarea
                  className="w-full p-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-green-500 resize-y"
                  value={newAnswer}
                  onChange={(e) => setNewAnswer(e.target.value)}
                  placeholder="Enter the answer..."
                  rows={4}
                />
              </div>
              <button
                type="submit"
                className="w-full bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-50 text-sm"
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
            className="bg-white p-4 rounded-lg shadow-lg w-full max-w-md max-h-[90vh] overflow-y-auto"
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
                  className="w-full p-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-green-500 resize-y"
                  value={editQuestion}
                  onChange={(e) => setEditQuestion(e.target.value)}
                  required
                  rows={3}
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Answer
                </label>
                <textarea
                  className="w-full p-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-green-500 resize-y"
                  value={editAnswer}
                  onChange={(e) => setEditAnswer(e.target.value)}
                  rows={4}
                />
              </div>
              <button
                type="submit"
                className="w-full bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 text-sm"
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

      {isDeleteModalOpen && selectedFaq && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div
            ref={deleteModalRef}
            className="bg-white p-4 rounded-lg shadow-lg w-full max-w-sm max-h-[90vh] overflow-y-auto"
          >
            <h2 className="text-lg font-semibold mb-4 text-gray-800 text-center">
              Confirm Deletion
            </h2>
            <p className="text-sm text-gray-700 text-center mb-6">
              Are you sure you want to delete the FAQ: "
              <strong>{selectedFaq.question}</strong>"?
            </p>
            <div className="flex justify-center gap-4">
              <button
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 text-sm"
                onClick={handleDeleteFaq}
              >
                Yes, Delete
              </button>
              <button
                className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400 text-sm"
                onClick={() => {
                  setIsDeleteModalOpen(false);
                  setSelectedFaq(null);
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Support;
