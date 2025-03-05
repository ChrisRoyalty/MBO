// src/components/community/AllBusiness.jsx
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { CiSearch } from "react-icons/ci";
import { CiLocationOn } from "react-icons/ci";
import { Link, useNavigate } from "react-router-dom";
import BusinessImg from "../../assets/businessImg.jpeg";
import {
  FaTimes,
  FaWhatsapp,
  FaTwitter,
  FaFacebook,
  FaInstagram,
} from "react-icons/fa";
import ProfilePic from "../../assets/profilepic.svg";

const BASE_URL = "https://mbo.bookbank.com.ng";

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
            className="absolute w-full bg-white border-[1px] border-[#6A7368] rounded-[11px] shadow-lg mt-2 overflow-hidden"
            style={{ zIndex: 50 }}
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
          className="bg-white px-6 py-8 rounded-lg shadow-lg w-[90%] max-w-3xl flex flex-col md:flex-row gap-6 items-start overflow-y-auto max-h-[90vh] relative" // Updated
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

const AllBusiness = () => {
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

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

  const filterProfiles = (profiles) => {
    return profiles.filter((profile) => {
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
      return matchesSearch;
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

  return (
    <div className="w-full bg-[#FFFDF2] flex flex-col items-center">
      <div className="container mx-auto px-[5vh]">
        <header className="h-[20vh] flex flex-col md:flex-row max-md:my-8 md:justify-between lg:items-center max-md:gap-6">
          <h1 className="w-fit text-[#043D12] text-[32px] max-lg:text-[20px] font-bold mb-4 md:mb-0">
            Explore all Businesses
          </h1>
          <div className="md:w-[50%] w-full bg-[#D6E2D98C] text-[16px] px-4 md:px-8 rounded-[39px] shadow-lg lg:h-[70px] h-[50px] text-[#043D12] flex gap-2 items-center justify-between">
            <input
              type="text"
              className="h-full outline-0 w-full"
              placeholder="Search Businesses or services"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <CiSearch className="text-[20px]" />
          </div>
        </header>
        <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-10 mb-12">
          {filteredProfiles.map((profile, index) => (
            <motion.div
              key={profile.id}
              className="relative border-[1px] border-[#6A7368] rounded-[14px] shadow-lg pt-4 pb-8 px-4"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              onClick={() => setSelectedProfile(profile)}
            >
              <div className="imgs grid grid-cols-4 gap-4 w-full">
                <img
                  src={
                    profile.productImages?.[0]?.imageUrl ||
                    profile.businesImg ||
                    BusinessImg
                  }
                  alt={profile.businessName}
                  className="rounded-l-[8px] bg-black/60 object-cover w-full h-[80px]"
                  onError={(e) => (e.target.src = BusinessImg)}
                />
                <img
                  src={
                    profile.productImages?.[1]?.imageUrl ||
                    profile.businesImg ||
                    BusinessImg
                  }
                  alt={profile.businessName}
                  className="object-cover w-full h-[80px]"
                  onError={(e) => (e.target.src = BusinessImg)}
                />
                <img
                  src={
                    profile.productImages?.[2]?.imageUrl ||
                    profile.businesImg ||
                    BusinessImg
                  }
                  alt={profile.businessName}
                  className="object-cover w-full h-[80px]"
                  onError={(e) => (e.target.src = BusinessImg)}
                />
                <img
                  src={
                    profile.productImages?.[3]?.imageUrl ||
                    profile.businesImg ||
                    BusinessImg
                  }
                  alt={profile.businessName}
                  className="rounded-r-[8px] bg-black/60 object-cover w-full h-[80px]"
                  onError={(e) => (e.target.src = BusinessImg)}
                />
                <img
                  src={profile.businesImg || ProfilePic}
                  alt={profile.businessName}
                  className="absolute top-[35px] left-1/2 transform -translate-x-1/2 w-[70px] rounded-full object-cover"
                  onError={(e) => (e.target.src = ProfilePic)}
                />
              </div>
              <figure className="flex flex-col gap-2 items-center mt-[45px] justify-center">
                <figcaption className="name text-center flex flex-col gap-4">
                  <Link
                    to={`/community/profile/${profile.id}`}
                    className="cursor-pointer text-[#043D12] text-[16px] font-semibold"
                  >
                    {profile.businessName}
                  </Link>
                  <p className="flex items-center gap-2 justify-center text-[#6A7368] text-[12px]">
                    <CiLocationOn />
                    {profile.location || "Not specified"}
                  </p>
                  <p className="text-[#043D12] border-[1px] border-[#6A7368] rounded-[4px] w-fit mx-auto px-4 py-2 text-[10px]">
                    {profile.categories[0]?.name || "Unknown Category"}
                  </p>
                  <div className="details flex items-center justify-center">
                    <div className="followers px-4 border-r-[1px] border-[#6A736866]">
                      <h4 className="text-[12px] text-[#043D12] font-bold">
                        30
                      </h4>
                      <p className="text-[8px] text-[#6A7368]">Followers</p>
                    </div>
                    <div className="profile px-4">
                      <h4 className="text-[12px] text-[#043D12] font-bold">
                        30
                      </h4>
                      <p className="text-[8px] text-[#6A7368]">Followers</p>
                    </div>
                  </div>
                  {profile.socialLinks?.whatsapp ? (
                    <a
                      href={profile.socialLinks.whatsapp}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-fit text-[#043D12] border-[1px] border-[#6A7368] rounded-[20px] hover:bg-[#043D12] px-12 py-2 hover:text-white flex items-center gap-2"
                    >
                      <FaWhatsapp className="text-[20px]" />
                      Message
                    </a>
                  ) : (
                    <p className="text-gray-600 text-[12px] text-center">
                      WhatsApp not available
                    </p>
                  )}
                </figcaption>
              </figure>
            </motion.div>
          ))}
        </div>
      </div>
      <Modal
        profile={selectedProfile}
        onClose={() => setSelectedProfile(null)}
      />
    </div>
  );
};

export default AllBusiness;
