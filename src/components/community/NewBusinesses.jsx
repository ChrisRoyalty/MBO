// src/components/community/NewBusinesses.jsx
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { Link } from "react-router-dom";
import BusinessImg from "../../assets/businessImg.jpeg"; // Fallback business image
import { FaTimes } from "react-icons/fa"; // Modern X icon

const BASE_URL = "https://mbo.bookbank.com.ng";

// Modal Component
const Modal = ({ profile, onClose }) => {
  if (!profile) return null;

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
          className="bg-white px-6 py-8 rounded-lg shadow-lg w-[90%] max-w-3xl flex flex-col md:flex-row gap-6 items-start overflow-hidden relative"
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          exit={{ scale: 0.8 }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* X Icon in Top-Right */}
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
              <strong>Views:</strong> {profile.views || 0}
            </p>
            {/* Replace View Profile with Description */}
            <p className="text-gray-700">
              <strong>Description:</strong>{" "}
              {profile.description || "No description available"}
            </p>
            <div className="flex gap-4 items-center mt-4">
              {/* Replace Contact Us with WhatsApp Link */}
              {profile.socialLinks?.whatsapp ? (
                <a
                  href={profile.socialLinks.whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-fit border-[1px] border-[#6A7368] text-[#6A7368] rounded-[11px] text-[15px] hover:text-white px-4 py-2 shadow-lg hover:bg-[#043D12] text-center"
                >
                  Chat on WhatsApp
                </a>
              ) : (
                <p className="text-gray-600 text-sm">WhatsApp not available</p>
              )}
            </div>
          </motion.div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

// Main Component
const NewBusinesses = () => {
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        const API_URL = `${BASE_URL}/member/all-profiles`;
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
    <div className="w-full h-fit py-16 flex justify-center bg-[#FFFDF2]">
      <div className="w-[85%] h-fit flex flex-col gap-8">
        <h1 className="text-[#043D12] lg:text-[32px] text-[24px] font-medium">
          Newly Added
        </h1>
        <div className="w-full grid lg:grid-cols-4 md:grid-cols-3 grid-cols-2 max-[280px]:grid-cols-1 gap-8">
          {profiles.map((profile, index) => (
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
                  className="w-full h-[250px] object-cover rounded-lg"
                  onError={(e) => (e.target.src = BusinessImg)}
                />
                <figcaption className="flex flex-col gap-2 text-[#043D12] py-2">
                  <div className="flex flex-col gap-1">
                    <b className="lg:text-[15px] text-[10px]">
                      {profile.businessName}
                    </b>
                    <p className="text-[8px]">
                      {profile.categories[0]?.name || "Unknown Category"}
                    </p>
                  </div>
                </figcaption>
              </figure>
              <Link
                onClick={() => setSelectedProfile(profile)}
                className="w-fit border-[1px] border-[#6A7368] text-[#6A7368] rounded-[11px] text-[12px] hover:text-white px-4 py-2 shadow-lg hover:bg-[#043D12] text-center"
              >
                View Profile
              </Link>
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

export default NewBusinesses;
