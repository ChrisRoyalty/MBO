// src/components/community/ProfilePage.jsx
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { CiSearch } from "react-icons/ci";
import { RiEqualizerLine } from "react-icons/ri";
import { IoCallOutline, IoLocationOutline } from "react-icons/io5";
import { FaFacebook, FaWhatsapp } from "react-icons/fa6";
import {
  IoLogoInstagram,
  IoLogoTwitter,
  IoLogoLinkedin,
  IoLogoYoutube,
} from "react-icons/io";
import { IoLogoWhatsapp } from "react-icons/io5";

import { MdOutlineCategory } from "react-icons/md";
import { BsTiktok } from "react-icons/bs"; // TikTok icon from react-icons/bs
import { CiShare1 } from "react-icons/ci";
import { BiMessage } from "react-icons/bi";
import { useParams, useNavigate } from "react-router-dom";
import BusinessImg from "../../assets/businessImg.jpeg"; // Fallback business image
import ProfileImg from "../../assets/profilepic.svg"; // Profile picture for fallback

const BASE_URL = "https://mbo.bookbank.com.ng";

// Modal Component (updated to remove category, but kept for consistency in case needed elsewhere)
const Modal = ({ business, onClose }) => {
  if (!business) return null;

  const navigate = useNavigate();

  const handleViewProfile = () => {
    navigate(`/community/profile/${business.id}`); // Navigate to profile page with business.id
    onClose(); // Close the modal after navigation
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
          className="bg-white px-8 py-10 rounded-lg shadow-lg w-[90%] md:w-[60%] flex flex-col md:flex-row gap-6 items-center"
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          exit={{ scale: 0.8 }}
          onClick={(e) => e.stopPropagation()} // Prevent closing on click inside
        >
          {/* Business Image */}
          <motion.img
            src={
              business.productImages?.[0]?.imageUrl ||
              business.businesImg ||
              BusinessImg
            }
            alt={business.businessName}
            className="w-full rounded-lg h-[350px] object-cover"
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
            onError={(e) => (e.target.src = BusinessImg)}
          />

          {/* Business Details */}
          <motion.div
            className="flex flex-col gap-4"
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-xl font-bold text-[#043D12]">
              {business.businessName}
            </h2>
            <p className="text-gray-700">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus
              lacinia odio vitae vestibulum.
            </p>

            <div className="btns flex">
              <div className="w-fit flex items-center gap-6">
                <button
                  onClick={handleViewProfile}
                  className="border-[1px] border-[#6A7368] text-[#6A7368] rounded-[11px] text-[15px] hover:text-white px-2 lg:px-8 py-2 shadow-lg hover:bg-[#043D12]"
                >
                  View Profile
                </button>
                <Link
                  to={`/community/contact/${business.id}`} // Placeholder for contact route
                  className="border-[1px] border-[#6A7368] text-[#6A7368] rounded-[11px] text-[15px] hover:text-white px-2 lg:px-8 py-2 shadow-lg hover:bg-[#043D12]"
                >
                  Contact Us
                </Link>
              </div>
            </div>

            <button
              onClick={onClose}
              className="mt-4 border-[1px] border-red-600 text-red-600 font-bold rounded-lg shadow-md py-2"
            >
              Close
            </button>
          </motion.div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

const ProfilePage = () => {
  const { id } = useParams(); // Get the profile ID from the URL
  const [profile, setProfile] = useState(null);
  const [selectedBusiness, setSelectedBusiness] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState(""); // State for search input

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const API_URL = `${BASE_URL}/member/get-profile/${id}`;
        const response = await axios.get(API_URL);

        if (response.data && response.data.profile) {
          setProfile(response.data.profile);
        } else {
          throw new Error("Profile not found in the response.");
        }
      } catch (error) {
        console.error("❌ Error Fetching Profile:", error);
        setError(
          error.response?.data?.message || "Failed to fetch profile data."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [id]);

  // Filter products/services based on search query (if any products exist)
  const filterProducts = (products) => {
    if (!products || products.length === 0) return [];
    return products.filter((product) => {
      const matchesSearch =
        !searchQuery ||
        product.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description?.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesSearch;
    });
  };

  const filteredProducts = filterProducts(profile?.productImages || []);

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

  if (!profile) {
    return <div>Profile not found.</div>;
  }

  return (
    <div className="w-full h-fit bg-[#FFFDF2] flex flex-col items-center pt-[12vh]">
      <div className="w-[80%] max-w-[1440px] mx-auto">
        <div className="w-full text-[#043D12] flex max-sm:flex-col overflow-y-scroll">
          {/* Sidebar for Profile Details */}
          <aside className="sm:w-[25%] h-[80vh] overflow-y-auto flex flex-col gap-8 text-[#6A7368]">
            <h3 className="lg:text-[32px] text-[#043D12] max-sm:text-center text-[24px] md:text-[28px] font-bold">
              {profile.businessName}
            </h3>
            <div className="contact flex flex-col gap-8">
              <ul className="flex flex-col gap-4">
                <li className="text-[13px] flex items-center gap-2 max-md:justify-center md:text-[14px]">
                  <MdOutlineCategory />{" "}
                  {profile.categories[0]?.name || "Unknown Category"}
                </li>
                <li className="text-[13px] flex items-center gap-2 max-md:justify-center md:text-[14px]">
                  <IoCallOutline /> {profile.contactNo?.[0] || "Not specified"}
                </li>
                <li className="text-[13px] flex items-center gap-2 max-md:justify-center md:text-[14px]">
                  <IoLocationOutline /> {profile.location || "Not specified"}
                </li>
              </ul>
              {profile.socialLinks?.whatsapp ? (
                <a
                  href={profile.socialLinks.whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 border-[1px] border-[#043D12] hover:bg-[#043D12] hover:text-white rounded-[28px] px-4 md:px-12 py-2 shadow text-[14px]"
                >
                  <FaWhatsapp />
                  Message
                </a>
              ) : (
                <p className="text-gray-600 text-[12px] text-center">
                  WhatsApp not available
                </p>
              )}
              <ul className="views text-[14px] flex justify-between items-center">
                <li>Profile Views</li>
                <li>{profile.views || 0}</li>
              </ul>
              <div className="web-share">
                <p className="text-[12px] text-[#043D12] font-medium px-2 py-1 w-fit">
                  ON THE WEB
                </p>
                <div className="content border-[1px] border-[#6A7368] rounded-[11px]">
                  {profile.socialLinks?.instagram && (
                    <div className="flex justify-between items-center text-[14px] py-2 px-8 border-b-[1px] border-[#6A7368]">
                      <div className="flex items-center gap-4">
                        <IoLogoInstagram className="text-[25px]" />
                        Instagram
                      </div>
                      <a
                        href={profile.socialLinks.instagram}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="cursor-pointer text-[18px]"
                      >
                        <CiShare1 />
                      </a>
                    </div>
                  )}
                  {profile.socialLinks?.twitter && (
                    <div className="flex justify-between items-center text-[14px] py-2 px-8 border-b-[1px] border-[#6A7368]">
                      <div className="flex items-center gap-4">
                        <IoLogoTwitter className="text-[25px]" />
                        Twitter
                      </div>
                      <a
                        href={profile.socialLinks.twitter}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="cursor-pointer text-[18px]"
                      >
                        <CiShare1 />
                      </a>
                    </div>
                  )}
                  {profile.socialLinks?.facebook && (
                    <div className="flex justify-between items-center text-[14px] py-2 px-8 border-b-[1px] border-[#6A7368]">
                      <div className="flex items-center gap-4">
                        <FaFacebook className="text-[18px]" />
                        Facebook
                      </div>
                      <a
                        href={profile.socialLinks.facebook}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="cursor-pointer text-[18px]"
                      >
                        <CiShare1 />
                      </a>
                    </div>
                  )}
                  {profile.socialLinks?.linkedin && (
                    <div className="flex justify-between items-center text-[14px] py-2 px-8 border-b-[1px] border-[#6A7368]">
                      <div className="flex items-center gap-4">
                        <IoLogoLinkedin className="text-[25px]" />
                        LinkedIn
                      </div>
                      <a
                        href={profile.socialLinks.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="cursor-pointer text-[18px]"
                      >
                        <CiShare1 />
                      </a>
                    </div>
                  )}
                  {profile.socialLinks?.tiktok && (
                    <div className="flex justify-between items-center text-[14px] py-2 px-8">
                      <div className="flex items-center gap-4">
                        <BsTiktok className="text-[25px]" />
                        TikTok
                      </div>
                      <a
                        href={profile.socialLinks.tiktok}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="cursor-pointer text-[18px]"
                      >
                        <CiShare1 />
                      </a>
                    </div>
                  )}
                </div>
              </div>
              <div className="description flex flex-col gap-2">
                <h5 className="text-[10px] text-[#6A7368]">
                  BUSINESS DESCRIPTION
                </h5>
                <p className="text-[13px] md:text-[14px]">
                  {profile.description || "No description available"}
                </p>
              </div>
              <div className="keywords flex flex-col gap-2">
                <h5 className="text-[10px] text-[#6A7368]">KEYWORDS</h5>
                <p className="text-[13px] md:text-[14px]">
                  {profile.keyword?.join(", ") || "No keywords available"}
                </p>
              </div>
              <div className="flex flex-col gap-4 pb-4">
                <p className="text-[12px] text-[#043D12] font-medium px-2 py-1 w-fit">
                  CONTACT
                </p>
                <div className="content border-[1px] border-[#6A7368] rounded-[11px]">
                  {profile.contactNo?.[0] && (
                    <div className="flex justify-between items-center text-[14px] py-2 px-8 border-b-[1px] border-[#6A7368]">
                      <div className="flex items-center gap-4">Phone</div>
                      <a
                        href={`tel:${profile.contactNo[0]}`}
                        className="cursor-pointer text-[18px]"
                      >
                        <IoCallOutline />
                      </a>
                    </div>
                  )}
                  {/* Updated Email with dynamic data from endpoint */}
                  {profile.member?.email && (
                    <div className="flex justify-between items-center text-[14px] py-2 px-8 border-b-[1px] border-[#6A7368]">
                      <div className="flex items-center gap-4">Email</div>
                      <a
                        href={`mailto:${profile.member.email}`}
                        className="cursor-pointer text-[18px]"
                      >
                        <BiMessage />
                      </a>
                    </div>
                  )}
                  {profile.socialLinks?.whatsapp && (
                    <div className="flex justify-between items-center text-[14px] py-2 px-8">
                      <div className="flex items-center gap-4">WhatsApp</div>
                      <a
                        href={profile.socialLinks.whatsapp}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="cursor-pointer text-[18px]"
                      >
                        <IoLogoWhatsapp />
                      </a>
                    </div>
                  )}
                </div>
                <div className="membership flex flex-col gap-2">
                  <h5 className="text-[10px] text-[#6A7368]">
                    Member Since:{" "}
                    {new Date(profile.createdAt).toLocaleDateString("en-US", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </h5>
                  <p className="text-[13px] md:text-[14px] text-[#6A7368] cursor-pointer hover:text-[#043D12]">
                    Report
                  </p>
                </div>
              </div>
            </div>
          </aside>

          {/* Products/Services Section */}
          <div className="sm:w-[75%] h-[80vh] overflow-y-auto">
            <div className="w-full h-fit py-16 flex justify-center bg-[#FFFDF2]">
              <div className="w-[85%] h-fit flex flex-col gap-8">
                <h1 className="border-b-[1px] border-[#6A7368] text-[20px] text-[#6A7368] pb-1">
                  Products/Services
                </h1>
                <div className="w-full grid xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2 grid-cols-2 max-[280px]:grid-cols-1 gap-4">
                  {filteredProducts.map((product, index) => (
                    <motion.div
                      key={index}
                      className="flex flex-col gap-1" // Removed onClick to prevent modal opening
                      initial={{ opacity: 0, y: 50 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: false }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                    >
                      <figure>
                        <img
                          src={product.imageUrl || BusinessImg}
                          alt={product.name || "Product"}
                          className="rounded-lg w-full h-[250px] object-cover"
                          onError={(e) => (e.target.src = BusinessImg)}
                        />
                        <figcaption className="flex flex-col gap-4 text-[#043D12] py-2">
                          <div className="flex flex-col gap-1">
                            <b className="lg:text-[15px] text-[10px] md:text-[12px]">
                              {product.name || "Unnamed Product"}
                            </b>
                          </div>
                        </figcaption>
                      </figure>
                    </motion.div>
                  ))}
                  {filteredProducts.length === 0 && (
                    <p className="text-gray-600 text-[14px] text-center w-full">
                      No products or services available.
                    </p>
                  )}
                </div>
              </div>

              {/* Modal for Selected Product/Service (kept for consistency, but not triggered) */}
              <Modal
                business={selectedBusiness}
                onClose={() => setSelectedBusiness(null)}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
