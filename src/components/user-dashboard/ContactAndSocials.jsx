import React, { useState, useEffect } from "react";
import { IoLogoFacebook } from "react-icons/io5";
import { FiEdit3 } from "react-icons/fi";
import {
  FaInstagram,
  FaTwitter,
  FaTiktok,
  FaLinkedin,
  FaWhatsapp,
} from "react-icons/fa";
import axios from "axios";
import { useSelector } from "react-redux";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ContactAndSocials = () => {
  const [profileData, setProfileData] = useState({
    contactNo: [],
    email: "",
    socialLinks: {},
  });
  const [formData, setFormData] = useState({
    contactNo: [],
    email: "",
  });
  const [loading, setLoading] = useState(true);
  const [editField, setEditField] = useState(null);
  const [socialInput, setSocialInput] = useState("");
  const [showSocialModal, setShowSocialModal] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const { token } = useSelector((state) => state.auth);

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
          const fetchedData = {
            contactNo: Array.isArray(profile.contactNo)
              ? profile.contactNo
              : [],
            email: profile.member?.email || "",
            socialLinks: profile.socialLinks || {},
          };
          setProfileData(fetchedData);
          setFormData({
            contactNo: fetchedData.contactNo,
            email: fetchedData.email,
          });
        } else {
          toast.error("No profile data found in the response.");
        }
      } catch (error) {
        console.error("❌ Error Fetching Profile:", error);
        toast.error(
          error.response?.data?.message || "Failed to fetch profile data."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [token]);

  // Handle input change for contact fields
  const handleInputChange = (field, index, value) => {
    if (field === "contactNo") {
      const updatedContactNo = [...formData.contactNo];
      updatedContactNo[index] = value;
      setFormData((prev) => ({ ...prev, contactNo: updatedContactNo }));
    } else {
      setFormData((prev) => ({ ...prev, [field]: value }));
    }
  };

  // Handle form submission for contact details
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const payload = {
        contactNo: formData.contactNo.filter(Boolean), // Remove empty strings
      };
      const response = await axios.patch(
        `${import.meta.env.VITE_BASE_URL}/member/edit-profile`,
        payload,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data.message === "Profile updated successfully") {
        toast.success(
          response.data.message || "Contact details updated successfully!"
        );
        setProfileData((prev) => ({
          ...prev,
          contactNo: formData.contactNo,
        }));
        setEditField(null);
      } else {
        toast.error(
          response.data.error ||
            response.data.message ||
            "Failed to update contact details."
        );
      }
    } catch (error) {
      console.error("❌ Error Updating Contact Details:", error);
      toast.error(
        error.response?.data?.message ||
          "Failed to update contact details due to an error."
      );
    } finally {
      setSubmitting(false);
    }
  };

  // Handle social media link addition or edit
  const handleSocialLinkClick = (platform) => {
    if (profileData.socialLinks[platform]) {
      setSocialInput(profileData.socialLinks[platform]); // Pre-fill with existing link
    } else {
      setSocialInput(""); // Clear input for new link
    }
    setShowSocialModal(platform);
  };

  // Submit or update social link
  const handleSocialSubmit = async (platform) => {
    if (!socialInput.trim()) {
      toast.error("Please enter a valid link or username.");
      return;
    }

    try {
      const updatedSocialLinks = {
        ...profileData.socialLinks,
        [platform]: socialInput,
      };
      const response = await axios.patch(
        `${import.meta.env.VITE_BASE_URL}/member/edit-profile`,
        { socialLinks: updatedSocialLinks },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data.message === "Profile updated successfully") {
        toast.success(
          response.data.message ||
            `${platform} link ${
              profileData.socialLinks[platform] ? "updated" : "added"
            } successfully!`
        );
        setProfileData((prev) => ({
          ...prev,
          socialLinks: updatedSocialLinks,
        }));
        setShowSocialModal(null);
        setSocialInput("");
      } else {
        toast.error(
          response.data.error ||
            response.data.message ||
            "Failed to update social link."
        );
      }
    } catch (error) {
      console.error("❌ Error Updating Social Link:", error);
      toast.error(
        error.response?.data?.message ||
          "Failed to update social link due to an error."
      );
    }
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
        Contact & Socials
      </h2>
      <div className="socials flex flex-col gap-6">
        <p className="text-[12px] text-[#043D12] font-medium border-b-[1px] border-[#6A7368] px-2 py-1 w-fit">
          ON THE WEB
        </p>
        <div className="flex flex-col gap-16">
          <div className="content border-[1px] border-[#6A7368] rounded-[11px]">
            {/* WhatsApp */}
            <div className="flex justify-between py-6 px-8 border-b-[1px] border-[#6A7368]">
              <div className="flex items-center gap-4">
                <FaWhatsapp className="text-[25px]" />
                WhatsApp
              </div>
              <button
                onClick={() => handleSocialLinkClick("whatsapp")}
                className="text-[14px] border-[1px] rounded-[11px] shadow px-4 py-2 flex items-center gap-2 border-[#6A7368] hover:bg-[#043D12] hover:text-white"
              >
                {profileData.socialLinks.whatsapp
                  ? "Edit link"
                  : "Add username"}
              </button>
            </div>

            {/* Facebook */}
            <div className="flex justify-between py-6 px-8 border-b-[1px] border-[#6A7368]">
              <div className="flex items-center gap-4">
                <IoLogoFacebook className="text-[25px]" />
                Facebook
              </div>
              <button
                onClick={() => handleSocialLinkClick("facebook")}
                className="text-[14px] border-[1px] rounded-[11px] shadow px-4 py-2 flex items-center gap-2 border-[#6A7368] hover:bg-[#043D12] hover:text-white"
              >
                {profileData.socialLinks.facebook
                  ? "Edit link"
                  : "Add username"}
              </button>
            </div>

            {/* Instagram */}
            <div className="flex justify-between py-6 px-8 border-b-[1px] border-[#6A7368]">
              <div className="flex items-center gap-4">
                <FaInstagram className="text-[25px]" />
                Instagram
              </div>
              <button
                onClick={() => handleSocialLinkClick("instagram")}
                className="text-[14px] border-[1px] rounded-[11px] shadow px-4 py-2 flex items-center gap-2 border-[#6A7368] hover:bg-[#043D12] hover:text-white"
              >
                {profileData.socialLinks.instagram
                  ? "Edit link"
                  : "Add username"}
              </button>
            </div>

            {/* Twitter */}
            <div className="flex justify-between py-6 px-8 border-b-[1px] border-[#6A7368]">
              <div className="flex items-center gap-4">
                <FaTwitter className="text-[25px]" />
                Twitter
              </div>
              <button
                onClick={() => handleSocialLinkClick("twitter")}
                className="text-[14px] border-[1px] rounded-[11px] shadow px-4 py-2 flex items-center gap-2 border-[#6A7368] hover:bg-[#043D12] hover:text-white"
              >
                {profileData.socialLinks.twitter ? "Edit link" : "Add username"}
              </button>
            </div>

            {/* TikTok */}
            <div className="flex justify-between py-6 px-8 border-b-[1px] border-[#6A7368]">
              <div className="flex items-center gap-4">
                <FaTiktok className="text-[25px]" />
                TikTok
              </div>
              <button
                onClick={() => handleSocialLinkClick("tiktok")}
                className="text-[14px] border-[1px] rounded-[11px] shadow px-4 py-2 flex items-center gap-2 border-[#6A7368] hover:bg-[#043D12] hover:text-white"
              >
                {profileData.socialLinks.tiktok ? "Edit link" : "Add username"}
              </button>
            </div>

            {/* LinkedIn */}
            <div className="flex justify-between py-6 px-8">
              <div className="flex items-center gap-4">
                <FaLinkedin className="text-[25px]" />
                LinkedIn
              </div>
              <button
                onClick={() => handleSocialLinkClick("linkedin")}
                className="text-[14px] border-[1px] rounded-[11px] shadow px-4 py-2 flex items-center gap-2 border-[#6A7368] hover:bg-[#043D12] hover:text-white"
              >
                {profileData.socialLinks.linkedin
                  ? "Edit link"
                  : "Add username"}
              </button>
            </div>
          </div>

          {/* Contact Form */}
          <form onSubmit={handleSubmit}>
            <h2 className="text-[#043D12] font-medium text-[12px] border-b-[1px] border-[#6A7368] pb-1 w-fit px-2">
              CONTACT
            </h2>
            <div className="mt-4">
              <div className="flex flex-col gap-8">
                <div className="text-[#6A7368] flex flex-col gap-2">
                  <label>Phone Number</label>
                  <div className="flex justify-between gap-8 md:gap-16">
                    <input
                      type="tel"
                      disabled={editField !== "phoneNumber"}
                      value={formData.contactNo[0] || ""}
                      onChange={(e) =>
                        handleInputChange("contactNo", 0, e.target.value)
                      }
                      placeholder="08032433604"
                      className={`w-full h-[46px] px-4 rounded-[11px] border-[1px] ${
                        editField === "phoneNumber"
                          ? "border-[#043D12] bg-green-50 focus:ring-2 focus:ring-[#043D12]"
                          : "border-[#6A7368]"
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setEditField(
                          editField === "phoneNumber" ? null : "phoneNumber"
                        )
                      }
                      className="rounded-[11px] text-[14px] px-4 py-2 shadow-lg flex items-center justify-between gap-2 border-[1px] border-[#6A7368] hover:bg-[#043D12] hover:text-white"
                    >
                      <FiEdit3 className="text-[18px]" />
                      {editField === "phoneNumber" ? "Cancel" : "Edit"}
                    </button>
                  </div>
                </div>

                <div className="text-[#6A7368] flex flex-col gap-2">
                  <label>Alternative Phone Number</label>
                  <div className="flex justify-between gap-8 md:gap-16">
                    <input
                      type="tel"
                      disabled={editField !== "altPhoneNumber"}
                      value={formData.contactNo[1] || ""}
                      onChange={(e) =>
                        handleInputChange("contactNo", 1, e.target.value)
                      }
                      placeholder="08080999467"
                      className={`w-full h-[46px] px-4 rounded-[11px] border-[1px] ${
                        editField === "altPhoneNumber"
                          ? "border-[#043D12] bg-green-50 focus:ring-2 focus:ring-[#043D12]"
                          : "border-[#6A7368]"
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setEditField(
                          editField === "altPhoneNumber"
                            ? null
                            : "altPhoneNumber"
                        )
                      }
                      className="rounded-[11px] text-[14px] px-4 py-2 shadow-lg flex items-center justify-between gap-2 border-[1px] border-[#6A7368] hover:bg-[#043D12] hover:text-white"
                    >
                      <FiEdit3 className="text-[18px]" />
                      {editField === "altPhoneNumber" ? "Cancel" : "Edit"}
                    </button>
                  </div>
                </div>

                <div className="text-[#6A7368] flex flex-col gap-2">
                  <label>Email Address</label>
                  <div className="flex justify-between gap-8 md:gap-16">
                    <input
                      type="email"
                      disabled={editField !== "email"}
                      value={formData.email || ""}
                      onChange={(e) =>
                        handleInputChange("email", null, e.target.value)
                      }
                      placeholder="Fidelis@gmail.com"
                      className={`w-full h-[46px] px-4 rounded-[11px] border-[1px] ${
                        editField === "email"
                          ? "border-[#043D12] bg-green-50 focus:ring-2 focus:ring-[#043D12]"
                          : "border-[#6A7368]"
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setEditField(editField === "email" ? null : "email")
                      }
                      className="rounded-[11px] text-[14px] px-4 py-2 shadow-lg flex items-center justify-between gap-2 border-[1px] border-[#6A7368] hover:bg-[#043D12] hover:text-white"
                    >
                      <FiEdit3 className="text-[18px]" />
                      {editField === "email" ? "Cancel" : "Edit"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div className="btns flex justify-end pt-20 pb-12">
              <div className="w-fit flex items-center gap-6">
                <button
                  type="button"
                  onClick={() => {
                    setFormData({
                      contactNo: profileData.contactNo,
                      email: profileData.email,
                    });
                    setEditField(null);
                  }}
                  className="border-[1px] border-[#6A7368] text-[#6A7368] rounded-[11px] text-[15px] hover:text-white px-2 lg:px-8 py-3 shadow-lg hover:bg-[#043D12]"
                >
                  Discard Changes
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className={`border-[1px] border-[#6A7368] text-[#6A7368] rounded-[11px] text-[15px] px-2 lg:px-8 py-3 shadow-lg flex items-center gap-2 ${
                    submitting
                      ? "cursor-not-allowed opacity-50"
                      : "hover:text-white hover:bg-[#043D12]"
                  }`}
                >
                  {submitting ? "Saving..." : "Save Changes"}
                  {submitting && <Loader />}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>

      {/* Social Link Modal */}
      {showSocialModal && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg w-96">
            <h2 className="text-lg font-semibold mb-4">
              {profileData.socialLinks[showSocialModal] ? "Edit" : "Add"}{" "}
              {showSocialModal} Link
            </h2>
            <input
              type="text"
              value={socialInput}
              onChange={(e) => setSocialInput(e.target.value)}
              placeholder={`Enter ${showSocialModal} username or link`}
              className="w-full p-2 border rounded mb-4"
            />
            <div className="flex justify-end gap-2">
              <button
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                onClick={() => setShowSocialModal(null)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-[#043D12] text-white rounded hover:bg-[#03280E]"
                onClick={() => handleSocialSubmit(showSocialModal)}
              >
                {profileData.socialLinks[showSocialModal] ? "Update" : "Submit"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContactAndSocials;
