// src/components/community/NewBusinesses.jsx
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import BusinessImg from "../../assets/businessImg.jpeg";
import {
  FaTimes,
  FaWhatsapp,
  FaTwitter,
  FaFacebook,
  FaInstagram,
} from "react-icons/fa";
import NetworkError from "../NetworkError"; // Import the new component

// Contact Dropdown Component (unchanged)
const ContactDropdown = ({ socialLinks, onClose }) => {
  const [isOpen, setIsOpen] = useState(false);

  if (!socialLinks || Object.keys(socialLinks).length === 0) {
    return <p className="text-gray-600 text-sm">No contact yet</p>;
  }

  const socialIcons = {
    whatsapp: { icon: FaWhatsapp, label: "WhatsApp" },
    twitter: { icon: FaTwitter, label: "Twitter" },
    facebook: { icon: FaFacebook, label: "Facebook" },
    instagram: { icon: FaInstagram, label: "Instagram" },
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-fit border-[1px] border-[#6A7368] text-[#6A7368] rounded-[11px] text-[15px] px-4 py-2 shadow-lg hover:bg-[#043D12] hover:text-white text-center flex items-center gap-2"
      >
        Contact Us
        <span>{isOpen ? "▲" : "▼"}</span>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="absolute w-full bg-white border-[1px] border-[#6A7368] rounded-[11px] shadow-lg mt-2 pb-8 overflow-y-auto"
            style={{ zIndex: 50 }}
          >
            {Object.entries(socialLinks).map(([platform, url]) => {
              const Icon = socialIcons[platform.toLowerCase()]?.icon;
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
                  className="flex items-center gap-2 w-full text-left px-4 py-2 text-[15px] text-[#043D12] hover:bg-[#F5F7F5] transition-colors duration-300"
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

// Modal Component (unchanged)
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
                className="w-fit border-[1px] border-[#6A7368] text-[#6A7368] rounded-[11px] text-[15px] px-4 py-2 shadow-lg hover:bg-[#043D12] hover:text-white text-center"
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

// Main Component with Enhanced Error Handling
const NewBusinesses = () => {
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [newProfiles, setNewProfiles] = useState([]);
  const [trendingProfiles, setTrendingProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterCategory, setFilterCategory] = useState("");
  const [filterLocation, setFilterLocation] = useState("");
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [isLocationOpen, setIsLocationOpen] = useState(false);

  const fetchProfiles = async () => {
    setLoading(true);
    setError(null); // Reset error before fetching
    try {
      const newURL = `${import.meta.env.VITE_BASE_URL}/member/all-profiles`; // Replace BASE_URL
      const newResponse = await axios.get(newURL);
      if (
        newResponse.data &&
        newResponse.data.success &&
        newResponse.data.profiles
      ) {
        setNewProfiles(newResponse.data.profiles);
      } else {
        throw new Error("No newly added profiles found in the response.");
      }
      const trendingURL = `${
        import.meta.env.VITE_BASE_URL
      }/member/all-trending`; // Replace BASE_URL
      const trendingResponse = await axios.get(trendingURL);
      if (
        trendingResponse.data &&
        trendingResponse.data.success &&
        trendingResponse.data.profiles
      ) {
        setTrendingProfiles(trendingResponse.data.profiles);
      } else {
        throw new Error("No trending profiles found in the response.");
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

  useEffect(() => {
    fetchProfiles();
  }, []);

  const getUniqueCategories = () => {
    const categories = [...newProfiles, ...trendingProfiles]
      .flatMap((profile) => profile.categories?.map((cat) => cat.name) || [])
      .filter((value, index, self) => self.indexOf(value) === index)
      .sort();
    return ["All Categories", ...categories];
  };

  const getUniqueLocations = () => {
    const locations = [...newProfiles, ...trendingProfiles]
      .map((profile) => profile.location)
      .filter(
        (value, index, self) =>
          value && self.indexOf(value) === index && value !== "Not specified"
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
      return matchesCategory && matchesLocation;
    });
  };

  const filteredNewProfiles = filterProfiles(newProfiles);
  const filteredTrendingProfiles = filterProfiles(trendingProfiles);

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
    return <NetworkError message={error} onRetry={fetchProfiles} />;
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
    <div className="w-full h-fit pb-8 flex justify-center bg-[#FFFDF2]">
      <div className="container mx-auto px-[5vh] h-fit flex flex-col gap-8">
        <div className="flex gap-4">
          <div className="relative w-1/2">
            <button
              onClick={toggleCategory}
              className="w-full border-[1px] border-[#6A7368] text-[#6A7368] rounded-[11px] text-[15px] px-4 py-2 shadow-lg bg-transparent flex justify-between items-center hover:bg-[#F5F7F5] transition-all duration-300"
            >
              {filterCategory || "Category"}
              <span className="ml-2">▼</span>
            </button>
            <AnimatePresence>
              {isCategoryOpen && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="absolute w-full bg-[#FFFDF2] border-[1px] border-[#6A7368] rounded-[11px] shadow-lg mt-2 overflow-hidden"
                  style={{ zIndex: 40 }}
                >
                  {getUniqueCategories().map((category) => (
                    <button
                      key={category}
                      onClick={() => {
                        setFilterCategory(
                          category === "All Categories" ? "" : category
                        );
                        setIsCategoryOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-[15px] text-[#043D12] hover:bg-[#F5F7F5] transition-colors duration-300"
                    >
                      {category}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <div className="relative w-1/2">
            <button
              onClick={toggleLocation}
              className="w-full border-[1px] border-[#6A7368] text-[#6A7368] rounded-[11px] text-[15px] px-4 py-2 shadow-lg bg-transparent flex justify-between items-center hover:bg-[#F5F7F5] transition-all duration-300"
            >
              {filterLocation || "Location"}
              <span className="ml-2">▼</span>
            </button>
            <AnimatePresence>
              {isLocationOpen && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="absolute w-full bg-[#FFFDF2] border-[1px] border-[#6A7368] rounded-[11px] shadow-lg mt-2 overflow-hidden"
                  style={{ zIndex: 40 }}
                >
                  {getUniqueLocations().map((location) => (
                    <button
                      key={location}
                      onClick={() => {
                        setFilterLocation(
                          location === "All Locations" ? "" : location
                        );
                        setIsLocationOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-[15px] text-[#043D12] hover:bg-[#F5F7F5] transition-colors duration-300"
                    >
                      {location}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        <div className="all-business flex flex-col gap-24">
          <div>
            <h1 className="text-[#043D12] lg:text-[32px] text-[24px] font-medium">
              Newly Added
            </h1>
            <div className="w-full grid xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2 grid-cols-2 max-[280px]:grid-cols-1 gap-4">
              {filteredNewProfiles.map((profile, index) => (
                <motion.div
                  key={profile.id}
                  className="flex flex-col gap-2 cursor-pointer h-[350px] my-8"
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
                  <figure className="flex-1">
                    <img
                      src={
                        profile.productImages?.[0]?.imageUrl ||
                        profile.businesImg ||
                        BusinessImg
                      }
                      alt={profile.businessName}
                      className="w-full h-[300px] object-cover rounded-lg"
                      onError={(e) => (e.target.src = BusinessImg)}
                    />
                    <figcaption className="flex flex-col gap-2 text-[#043D12] py-2">
                      <div className="flex flex-col gap-1">
                        <b className="lg:text-[15px] text-[10px]">
                          {profile.businessName}
                        </b>
                        <p className="text-[10px]">
                          {profile.categories[0]?.name || "Unknown Category"}
                        </p>
                      </div>
                    </figcaption>
                  </figure>
                </motion.div>
              ))}
            </div>
          </div>

          <div>
            <h1 className="text-[#043D12] lg:text-[32px] text-[24px] font-medium">
              Trending Businesses
            </h1>
            <div className="w-full grid xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2 grid-cols-2 max-[280px]:grid-cols-1 gap-4">
              {filteredTrendingProfiles.map((profile, index) => (
                <motion.div
                  key={profile.id}
                  className="flex flex-col gap-2 cursor-pointer h-[350px] my-8"
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
                  <figure className="flex-1">
                    <img
                      src={
                        profile.productImages?.[0]?.imageUrl ||
                        profile.businesImg ||
                        BusinessImg
                      }
                      alt={profile.businessName}
                      className="w-full h-[300px] object-cover rounded-lg"
                      onError={(e) => (e.target.src = BusinessImg)}
                    />
                    <figcaption className="flex flex-col gap-2 text-[#043D12] py-2">
                      <div className="flex flex-col gap-1">
                        <b className="lg:text-[15px] text-[10px]">
                          {profile.businessName}
                        </b>
                        <p className="text-[10px]">
                          {profile.categories[0]?.name || "Unknown Category"}
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
      <Modal
        profile={selectedProfile}
        onClose={() => setSelectedProfile(null)}
      />
    </div>
  );
};

export default NewBusinesses;
