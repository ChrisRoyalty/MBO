// src/pages/SearchPage.jsx
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { CiSearch } from "react-icons/ci";
import { MdOutlineCategory } from "react-icons/md";
import { IoLocationOutline } from "react-icons/io5";
import {
  RiEqualizerLine,
  RiArrowDropDownLine,
  RiArrowDropUpLine,
} from "react-icons/ri";
import { Link, useNavigate } from "react-router-dom";
import BusinessImg from "../assets/businessImg.jpeg";
import {
  FaTimes,
  FaWhatsapp,
  FaTwitter,
  FaFacebook,
  FaInstagram,
} from "react-icons/fa";

const BASE_URL = "https://mbo.bookbank.com.ng";

// Contact Dropdown Component
const ContactDropdown = ({ socialLinks, onClose }) => {
  const [isOpen, setIsOpen] = useState(false);

  if (!socialLinks || Object.keys(socialLinks).length === 0) {
    return <p className="text-gray-600 text-sm">No available contact yet</p>;
  }

  const socialIcons = {
    whatsapp: { icon: FaWhatsapp, label: "WhatsApp" },
    twitter: { icon: FaTwitter, label: "Twitter" },
    facebook: { icon: FaFacebook, label: "Facebook" },
    instagram: { icon: FaInstagram, label: "Instagram" },
    tiktok: { icon: FaInstagram, label: "TikTok" },
    linkedin: { icon: FaInstagram, label: "LinkedIn" },
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-fit border-[1px] border-[#6A7368] text-[#6A7368] rounded-[11px] text-[15px] px-4 py-2 shadow-sm hover:bg-[#043D12] hover:text-white transition-all duration-300 flex items-center gap-2"
      >
        Contact Us
        <span>{isOpen ? "▲" : "▼"}</span>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0, y: -10 }}
            animate={{ opacity: 1, height: "auto", y: 0 }}
            exit={{ opacity: 0, height: 0, y: -10 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="absolute min-w-max w-full bg-white border-[1px] border-[#6A7368] rounded-[11px] shadow-md mt-2 z-50"
          >
            {Object.entries(socialLinks).map(([platform, url]) => {
              const Icon = socialIcons[platform.toLowerCase()]?.icon;
              if (!url || url.trim() === "") return null;
              return Icon ? (
                <a
                  key={platform}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsOpen(false);
                    onClose();
                  }}
                  className="flex items-center gap-2 w-full text-left px-4 py-2 text-[15px] text-[#043D12] hover:bg-[#F5F7F5] transition-colors duration-200"
                >
                  <Icon className="text-[#043D12]" />
                  {socialIcons[platform.toLowerCase()].label}
                </a>
              ) : null;
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Modal Component
const Modal = ({ profile, onClose }) => {
  if (!profile) return null;

  const navigate = useNavigate();

  const handleViewProfile = () => {
    navigate(`/community/profile/${profile.id}`);
    onClose();
  };

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black/75 bg-opacity-50 flex justify-center items-center z-50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="bg-white px-6 py-8 rounded-lg shadow-lg w-[90%] max-w-3xl flex flex-col md:flex-row gap-6 items-start overflow-y-auto max-h-[90vh] relative"
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          exit={{ scale: 0.8 }}
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-[#6A7368] hover:text-[#043D12] text-xl"
          >
            <FaTimes />
          </button>

          <motion.img
            src={
              profile.productImages?.[0]?.imageUrl ||
              profile.businesImg ||
              BusinessImg
            }
            alt={profile.businessName}
            className="w-full md:w-1/2 h-[350px] object-cover rounded-lg"
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
            onError={(e) => (e.target.src = BusinessImg)}
          />
          <motion.div
            className="flex flex-col gap-4 w-full md:w-1/2 p-2"
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-2xl font-bold text-[#043D12]">
              {profile.businessName}
            </h2>
            <p className="text-sm text-gray-600">
              {profile.categories[0]?.name || "Unknown Category"}
            </p>
            <p className="text-gray-700">
              <strong>Location:</strong> {profile.location || "Not specified"}
            </p>
            <p className="text-gray-700">
              <strong>Description:</strong>{" "}
              {profile.description || "No description available"}
            </p>
            <div className="flex gap-4 items-center mt-4">
              <button
                onClick={handleViewProfile}
                className="w-fit border-[1px] border-[#6A7368] text-[#6A7368] rounded-[11px] text-[15px] px-4 py-2 shadow-sm hover:bg-[#043D12] hover:text-white transition-all duration-300"
              >
                View Profile
              </button>
              <ContactDropdown
                socialLinks={profile.socialLinks}
                onClose={onClose}
              />
            </div>
          </motion.div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

const SearchPage = () => {
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterCategory, setFilterCategory] = useState("");
  const [filterLocation, setFilterLocation] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [isLocationOpen, setIsLocationOpen] = useState(false);

  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        const API_URL = `${BASE_URL}/member/random-profiles`;
        const response = await axios.get(API_URL);
        if (response.data && response.data.success && response.data.profiles) {
          setProfiles(response.data.profiles);
        } else {
          throw new Error("No profiles found in the response.");
        }
      } catch (error) {
        console.error("❌ Error Fetching Profiles:", error);
        setError(
          error.response?.data?.message || "Failed to fetch profiles data."
        );
      } finally {
        setLoading(false);
      }
    };
    fetchProfiles();
  }, []);

  const getUniqueCategories = () => {
    const categories = profiles
      .flatMap((profile) => profile.categories?.map((cat) => cat.name) || [])
      .filter((value, index, self) => self.indexOf(value) === index)
      .sort();
    return ["All Categories", ...categories];
  };

  const getUniqueLocations = () => {
    const locations = profiles
      .map((profile) => profile.location)
      .filter(
        (value, index, self) =>
          value &&
          self.indexOf(value) === index &&
          value !== "Not specified" &&
          value !== ""
      )
      .sort();
    return ["All Locations", ...locations];
  };

  const filterProfiles = (profiles) => {
    return profiles.filter((profile) => {
      const matchesCategory =
        !filterCategory ||
        filterCategory === "All Categories" ||
        profile.categories?.some((cat) => cat.name === filterCategory);
      const matchesLocation =
        !filterLocation ||
        filterLocation === "All Locations" ||
        profile.location === filterLocation;
      const matchesSearch =
        !searchQuery ||
        profile.businessName
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        profile.description
          ?.toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        profile.categories?.some((cat) =>
          cat.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
      return matchesCategory && matchesLocation && matchesSearch;
    });
  };

  const filteredProfiles = filterProfiles(profiles);

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

  const toggleCategory = () => {
    setIsCategoryOpen(!isCategoryOpen);
    setIsLocationOpen(false);
  };

  const toggleLocation = () => {
    setIsLocationOpen(!isLocationOpen);
    setIsCategoryOpen(false);
  };

  return (
    <div className="w-full bg-[#FFFDF2] flex flex-col items-center">
      <div className="w-[80%]">
        <header className="h-[20vh] flex max-md:flex-col max-md:my-8 justify-between items-center max-md:gap-8">
          <div className="md:w-[50%] w-full bg-[#D6E2D98C] text-[16px] px-8 rounded-[39px] shadow-lg h-[70px] text-[#043D12] flex gap-2 items-center justify-between">
            <input
              type="text"
              className="h-full outline-0 w-full bg-transparent"
              placeholder="Search Businesses or services"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <CiSearch className="text-[20px]" />
          </div>
          <Link
            to="/community/all-businesses"
            className="w-fit h-[70px] px-8 rounded-[39px] shadow-lg bg-[#043D12] text-[#FFFDF2] flex items-center justify-center hover:bg-[#02530c] transition-all duration-300"
          >
            Explore all Businesses
          </Link>
        </header>

        <div className="w-full h-[80vh] text-[#043D12] flex max-sm:flex-col overflow-y-scroll">
          {/* Sidebar for Filters */}
          <aside className="max-lg:hidden sm:w-[25%] h-full overflow-y-auto flex flex-col gap-8 p-4">
            <div className="intro text-[#043D12] flex items-center gap-4">
              <RiEqualizerLine className="text-[22px]" />
              <h4 className="text-[#043D12] text-[20px] font-medium">Filter</h4>
            </div>

            {/* Category Dropdown */}
            <div className="w-full flex flex-col gap-2">
              <div
                className="flex items-center justify-between cursor-pointer p-2 hover:bg-[#F5F7F5] rounded-lg transition-all duration-200"
                onClick={toggleCategory}
              >
                <p className="flex items-center gap-2 text-[16px]">
                  <MdOutlineCategory />
                  Category
                </p>
                {isCategoryOpen ? (
                  <RiArrowDropUpLine className="text-[20px]" />
                ) : (
                  <RiArrowDropDownLine className="text-[20px]" />
                )}
              </div>
              <AnimatePresence>
                {isCategoryOpen && (
                  <motion.div
                    initial={{ opacity: 0, height: 0, y: -10 }}
                    animate={{ opacity: 1, height: "auto", y: 0 }}
                    exit={{ opacity: 0, height: 0, y: -10 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="w-full bg-transparent py-2"
                  >
                    <div className="flex flex-col lg:flex-wrap gap-2.5 p-3">
                      {getUniqueCategories().map((category) => (
                        <button
                          key={category}
                          onClick={() => {
                            setFilterCategory(
                              category === "All Categories" ? "" : category
                            );
                            setIsCategoryOpen(false);
                          }}
                          className="w-full lg:w-fit h-fit px-4 rounded-[11px] shadow-sm hover:bg-[#043D12] hover:text-[#FFFDF2] border-[1px] border-[#043D12] text-[#043D12] text-[14px] transition-all duration-200 py-1"
                        >
                          {category}
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Location Dropdown */}
            <div className="w-full flex flex-col gap-2">
              <div
                className="flex items-center justify-between cursor-pointer p-2 hover:bg-[#F5F7F5] rounded-lg transition-all duration-200"
                onClick={toggleLocation}
              >
                <p className="flex items-center gap-2 text-[16px]">
                  <IoLocationOutline />
                  Location
                </p>
                {isLocationOpen ? (
                  <RiArrowDropUpLine className="text-[20px]" />
                ) : (
                  <RiArrowDropDownLine className="text-[20px]" />
                )}
              </div>
              <AnimatePresence>
                {isLocationOpen && (
                  <motion.div
                    initial={{ opacity: 0, height: 0, y: -10 }}
                    animate={{ opacity: 1, height: "auto", y: 0 }}
                    exit={{ opacity: 0, height: 0, y: -10 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="w-full bg-transparent py-2"
                  >
                    <div className="flex flex-col lg:flex-wrap gap-2 p-3">
                      {getUniqueLocations().map((location) => (
                        <button
                          key={location}
                          onClick={() => {
                            setFilterLocation(
                              location === "All Locations" ? "" : location
                            );
                            setIsLocationOpen(false);
                          }}
                          className="w-full lg:w-fit h-fit py-1 px-4 rounded-[11px] shadow-sm hover:bg-[#043D12] hover:text-[#FFFDF2] border-[1px] border-[#043D12] text-[#043D12] text-[14px] transition-all duration-200"
                        >
                          {location}
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </aside>

          {/* Businesses Section */}
          <div className="h-full overflow-y-auto flex-1">
            <div className="w-full h-fit py-16 flex justify-center bg-[#FFFDF2]">
              <div className="w-[85%] max-sm:w-full h-fit flex flex-col gap-8">
                <div className="w-full grid lg:grid-cols-3 grid-cols-2 max-[280px]:grid-cols-1 gap-4">
                  {filteredProfiles.map((profile, index) => (
                    <motion.div
                      key={profile.id}
                      className="flex flex-col gap-1 cursor-pointer"
                      initial={{ opacity: 0, y: 50 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: false }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      onClick={() => setSelectedProfile(profile)}
                    >
                      <div className="profile flex items-center gap-2">
                        <img
                          src={profile.businesImg || BusinessImg}
                          alt={profile.businessName}
                          className="w-8 h-8 rounded-full object-cover"
                          onError={(e) => (e.target.src = BusinessImg)}
                        />
                        <p className="text-[12px] text-[#043D12]">
                          {profile.businessName}
                        </p>
                      </div>
                      <figure>
                        <img
                          src={
                            profile.productImages?.[0]?.imageUrl ||
                            profile.businesImg ||
                            BusinessImg
                          }
                          alt={profile.businessName}
                          className="rounded-lg w-full h-[250px] object-cover"
                          onError={(e) => (e.target.src = BusinessImg)}
                        />
                        <figcaption className="flex flex-col gap-4 text-[#043D12] py-2">
                          <div className="flex flex-col gap-1">
                            <b className="lg:text-[15px] text-[10px]">
                              {profile.businessName}
                            </b>
                            <p className="text-[8px]">
                              {profile.categories[0]?.name ||
                                "Unknown Category"}
                            </p>
                          </div>
                        </figcaption>
                      </figure>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Modal
        profile={selectedProfile}
        onClose={() => setSelectedProfile(null)}
      />
    </div>
  );
};

export default SearchPage;
