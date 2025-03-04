import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useSelector } from "react-redux";
import ProfileImg from "../../assets/DefaultProfileImg.svg";
import ProfileBg from "../../assets/DefaultProfileBg.svg";
import { FiEdit3 } from "react-icons/fi";
import { TiArrowForwardOutline } from "react-icons/ti";
import { TbLayoutGrid } from "react-icons/tb";
import { MdOutlineCategory } from "react-icons/md";
import { IoMdArrowDropdown, IoMdArrowDropup } from "react-icons/io";
import { FaWhatsapp } from "react-icons/fa"; // Only keeping WhatsApp for sharing

const EditProfile = () => {
  const [profileData, setProfileData] = useState({
    businessName: "",
    contactNo: [],
    businesImg: "",
    backgroundImg: "",
    description: "",
    location: "",
    keyword: [],
    firstName: "",
    lastName: "",
    category: "",
    createdAt: "",
  });
  const [originalData, setOriginalData] = useState(null);
  const [editField, setEditField] = useState(null);
  const [loading, setLoading] = useState(true);
  const [imageLoading, setImageLoading] = useState({
    businesImg: false,
    backgroundImg: false,
  });
  const [buttonActive, setButtonActive] = useState({
    personalSubmit: false,
    businessSubmit: false,
    personalDiscard: false,
    businessDiscard: false,
    changeImage: false,
  });
  const [error, setError] = useState(null);
  const [categories, setCategories] = useState([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState(true);
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState({
    id: "",
    name: "",
  });
  const [shareableLink, setShareableLink] = useState("");
  const [showShareOptions, setShowShareOptions] = useState(false);

  const { isAuthenticated, token } = useSelector((state) => state.auth);
  const BASE_URL = "https://mbo.bookbank.com.ng";

  // Fetch profile data and populate selectedCategory
  useEffect(() => {
    if (!isAuthenticated || !token) {
      setError("Not authenticated or missing token!");
      setLoading(false);
      return;
    }

    const fetchProfile = async () => {
      try {
        const API_URL = `${BASE_URL}/member/my-profile`;
        const response = await axios.get(API_URL, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.data && response.data.success && response.data.data) {
          const profile = response.data.data;
          const member = profile.member || {};
          const initialData = {
            businessName: profile.businessName || "",
            contactNo: Array.isArray(profile.contactNo)
              ? profile.contactNo
              : [],
            businesImg: profile.businesImg || "",
            backgroundImg: profile.backgroundImg || "",
            description: profile.description || "",
            location: profile.location || "",
            keyword: Array.isArray(profile.keyword) ? profile.keyword : [],
            firstName: member.firstname || "",
            lastName: member.lastname || "",
            category: profile.category || "",
            createdAt: profile.createdAt || "",
          };
          setProfileData(initialData);
          setOriginalData(initialData);

          const categoryFromProfile = profile.categories?.[0] || {};
          setSelectedCategory({
            id: categoryFromProfile.id || "",
            name: categoryFromProfile.name || profile.category || "",
          });
        } else {
          setError("No profile data found in the response.");
          toast.error("No profile data found in the response.");
        }
      } catch (error) {
        console.error("❌ Error Fetching Profile:", error);
        setError(
          error.response?.data?.message || "Failed to fetch profile data."
        );
        toast.error(error.response?.data?.message || "Error fetching profile.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [isAuthenticated, token]);

  // Fetch categories
  useEffect(() => {
    if (!token) return;

    const fetchCategories = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/member/all-category`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCategories(response.data.category || response.data.categories || []);
        setIsLoadingCategories(false);
      } catch (error) {
        console.error("❌ Error fetching categories:", error);
        toast.error("Failed to load categories. Please try again.");
        setCategories([]);
        setIsLoadingCategories(false);
      }
    };

    fetchCategories();
  }, [token]);

  // Fetch shareable link
  useEffect(() => {
    if (!token) return;

    const fetchShareableLink = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/member/share`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (
          response.data &&
          response.data.message === "Shareable link generated successfully"
        ) {
          setShareableLink(response.data.shareableLink);
        } else {
          toast.error("Failed to fetch shareable link: Invalid response.");
        }
      } catch (error) {
        console.error("❌ Error Fetching Shareable Link:", error);
        toast.error(
          error.response?.data?.message || "Failed to fetch shareable link."
        );
      }
    };

    fetchShareableLink();
  }, [token]);

  // Handle input change
  const handleInputChange = (field, value) => {
    setProfileData((prevData) => ({
      ...prevData,
      [field]:
        field === "keyword" || field === "contactNo" ? value.split(",") : value,
    }));
  };

  // Handle edit button click
  const handleEditClick = (field) => {
    setEditField(field);
    setButtonActive((prev) => ({ ...prev, [field]: true }));
    setTimeout(
      () => setButtonActive((prev) => ({ ...prev, [field]: false })),
      200
    );
  };

  // Toggle category dropdown
  const toggleDropdown = () => setShowDropdown(!showDropdown);

  // Handle category selection
  const handleCategorySelect = (id, name) => {
    setSelectedCategory({ id, name });
    setProfileData((prevData) => ({ ...prevData, category: name }));
    setShowDropdown(false);
  };

  // Upload image to Cloudinary
  const uploadImageToCloudinary = async (file) => {
    if (!file || !file.type.startsWith("image/")) {
      toast.error("Please upload a valid image file.");
      return null;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "profile_upload_unsigned");
    formData.append("folder", "user_profiles");

    try {
      const response = await axios.post(
        "https://api.cloudinary.com/v1_1/drve24nad/image/upload",
        formData
      );
      return response.data?.secure_url || null;
    } catch (error) {
      console.error("❌ Error Uploading Image to Cloudinary:", error);
      toast.error(error.response?.data?.message || "Failed to upload image.");
      return null;
    }
  };

  // Handle image upload
  const handleImageUpload = async (field, file) => {
    if (!file) return;

    setImageLoading((prev) => ({ ...prev, [field]: true }));
    const imageUrl = await uploadImageToCloudinary(file);
    setImageLoading((prev) => ({ ...prev, [field]: false }));

    if (imageUrl) {
      setProfileData((prevData) => ({
        ...prevData,
        [field]: imageUrl,
      }));
      toast.success("Image uploaded successfully!");
    }
  };

  // Handle form submission with two endpoints
  const handleSubmit = async (e, formType) => {
    e.preventDefault();
    const submitKey =
      formType === "personal" ? "personalSubmit" : "businessSubmit";
    setButtonActive((prev) => ({ ...prev, [submitKey]: true }));

    if (!token) {
      toast.error("Token is missing!");
      setButtonActive((prev) => ({ ...prev, [submitKey]: false }));
      return;
    }

    try {
      let API_URL, payload;
      if (formType === "personal") {
        API_URL = `${BASE_URL}/member/edit-member`;
        payload = {
          firstName: profileData.firstName,
          lastName: profileData.lastName,
        };
      } else {
        API_URL = `${BASE_URL}/member/edit-profile`;
        payload = {
          businessName: profileData.businessName,
          contactNo: profileData.contactNo,
          businesImg: profileData.businesImg,
          backgroundImg: profileData.backgroundImg,
          description: profileData.description,
          location: profileData.location,
          keyword: profileData.keyword,
          category: profileData.category,
        };
      }

      const response = await axios.patch(API_URL, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      toast.success(
        response.data.message ||
          `${
            formType === "personal" ? "Personal" : "Business"
          } profile updated successfully!`
      );
      setEditField(null);

      if (formType === "personal") {
        const updatedName = response.data.data.name.split(" ");
        setProfileData((prev) => ({
          ...prev,
          firstName: updatedName[0] || prev.firstName,
          lastName: updatedName.slice(1).join(" ") || prev.lastName,
        }));
        setOriginalData((prev) => ({
          ...prev,
          firstName: updatedName[0] || prev.firstName,
          lastName: updatedName.slice(1).join(" ") || prev.lastName,
        }));
      } else {
        const updatedProfile = response.data.updatedProfile;
        const syncedData = {
          businessName: updatedProfile.businessName || "",
          contactNo: Array.isArray(updatedProfile.contactNo)
            ? updatedProfile.contactNo
            : [],
          businesImg: updatedProfile.businesImg || "",
          backgroundImg: updatedProfile.backgroundImg || "",
          description: updatedProfile.description || "",
          location: updatedProfile.location || "",
          keyword: Array.isArray(updatedProfile.keyword)
            ? updatedProfile.keyword
            : [],
          category: updatedProfile.category || "",
          createdAt: updatedProfile.createdAt || profileData.createdAt,
          firstName: profileData.firstName,
          lastName: profileData.lastName,
        };
        setProfileData(syncedData);
        setOriginalData(syncedData);
        setSelectedCategory({
          id: updatedProfile.categories?.[0]?.id || "",
          name: updatedProfile.category || "",
        });
      }
    } catch (error) {
      console.error(`❌ ${formType} PATCH Error:`, error);
      const errorMessage =
        error.response?.data?.message ||
        `Failed to update ${formType} profile.`;
      toast.error(errorMessage);
    } finally {
      setButtonActive((prev) => ({ ...prev, [submitKey]: false }));
    }
  };

  // Handle discard changes
  const handleDiscardChanges = (formType) => {
    const discardKey =
      formType === "personal" ? "personalDiscard" : "businessDiscard";
    setButtonActive((prev) => ({ ...prev, [discardKey]: true }));
    setEditField(null);

    const resetFields =
      formType === "personal"
        ? {
            firstName: originalData?.firstName || "",
            lastName: originalData?.lastName || "",
          }
        : {
            businessName: originalData?.businessName || "",
            category: originalData?.category || "",
            keyword: originalData?.keyword || [],
            location: originalData?.location || "",
            description: originalData?.description || "",
            contactNo: originalData?.contactNo || [],
            businesImg: originalData?.businesImg || "",
            backgroundImg: originalData?.backgroundImg || "",
          };

    setProfileData((prevData) => ({ ...prevData, ...resetFields }));
    if (formType === "business") {
      setSelectedCategory({
        id: originalData?.categories?.[0]?.id || "",
        name: resetFields.category || "",
      });
    }

    setTimeout(
      () => setButtonActive((prev) => ({ ...prev, [discardKey]: false })),
      200
    );
  };

  // Share functionality
  const handleShareClick = () => {
    setShowShareOptions(!showShareOptions);
  };

  const shareToSocialMedia = (platform) => {
    if (!shareableLink) {
      toast.error("No shareable link available!");
      return;
    }

    const encodedLink = encodeURIComponent(shareableLink);
    const message = `Check out my business profile: ${shareableLink}`;
    let url;

    switch (platform) {
      case "whatsapp":
        url = `https://api.whatsapp.com/send?text=${encodeURIComponent(
          message
        )}`;
        break;
      default:
        return;
    }

    window.open(url, "_blank");
    setShowShareOptions(false);
  };

  // Loader component
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
    <div className="relative w-full mx-auto">
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
      <div className="relative w-full h-[200px] sm:h-[250px] md:h-[300px] lg:h-[350px] overflow-hidden">
        {imageLoading.backgroundImg ? (
          <div className="absolute inset-0 flex justify-center items-center bg-gray-200 bg-opacity-50">
            <Loader />
          </div>
        ) : (
          <img
            src={profileData.backgroundImg || ProfileBg}
            className="w-full h-full object-cover object-center"
            alt="Background"
          />
        )}
        <FiEdit3
          className="absolute right-4 top-4 text-white text-[20px] sm:text-[24px] cursor-pointer z-10 bg-black bg-opacity-50 p-1 rounded-full"
          onClick={() => {
            const fileInput = document.createElement("input");
            fileInput.type = "file";
            fileInput.accept = "image/*";
            fileInput.onchange = (e) =>
              handleImageUpload("backgroundImg", e.target.files[0]);
            fileInput.click();
          }}
        />
      </div>

      <div className="relative w-full max-w-5xl mx-auto -mt-16 sm:-mt-20 md:-mt-24 lg:-mt-28 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center sm:flex-row sm:items-end sm:justify-between">
          <figure className="relative flex flex-col items-center">
            {imageLoading.businesImg ? (
              <div className="w-20 h-20 sm:w-24 sm:h-24 md:w-32 md:h-32 lg:w-40 lg:h-40 flex justify-center items-center">
                <Loader />
              </div>
            ) : (
              <img
                src={profileData.businesImg || ProfileImg}
                alt="Profile-photo"
                className="w-20 h-20 sm:w-24 sm:h-24 md:w-32 md:h-32 lg:w-40 lg:h-40 rounded-full object-cover border-4 border-white shadow-lg"
              />
            )}
            <figcaption className="text-center mt-2 text-[#6A7368]">
              <h4 className="text-sm sm:text-base md:text-lg font-semibold">
                {profileData.businessName}
              </h4>
              <p className="text-xs sm:text-sm">
                {selectedCategory.name || "Clothing and Accessories"}
              </p>
            </figcaption>
          </figure>

          <button
            className={`mt-4 sm:mt-0 border rounded-[11px] text-[10px] sm:text-sm px-4 sm:px-6 py-2 sm:py-3 shadow-lg transition-transform ${
              buttonActive.changeImage
                ? "scale-95 bg-[#043D12] text-white"
                : "hover:bg-[#043D12] hover:text-white"
            }`}
            onClick={() => {
              setButtonActive((prev) => ({ ...prev, changeImage: true }));
              const fileInput = document.createElement("input");
              fileInput.type = "file";
              fileInput.accept = "image/*";
              fileInput.onchange = (e) =>
                handleImageUpload("businesImg", e.target.files[0]);
              fileInput.click();
              setTimeout(
                () =>
                  setButtonActive((prev) => ({ ...prev, changeImage: false })),
                200
              );
            }}
          >
            Change Image
          </button>
        </div>

        <form onSubmit={(e) => handleSubmit(e, "personal")} className="mt-8">
          <h2 className="text-[12px] sm:text-sm border-b-[1px] border-[#6A7368] pb-1 w-fit px-2">
            Personal Information
          </h2>
          <div className="w-full flex flex-col sm:flex-row items-center gap-6 sm:gap-12 mt-4">
            <div className="w-full flex flex-col gap-6 sm:gap-8">
              <div className="text-[#6A7368] flex flex-col gap-2">
                <label className="text-sm">First Name</label>
                <div className="flex justify-between gap-4">
                  <input
                    type="text"
                    disabled={editField !== "firstName"}
                    value={profileData.firstName || ""}
                    onChange={(e) =>
                      handleInputChange("firstName", e.target.value)
                    }
                    className={`w-full h-[46px] px-4 rounded-[11px] border-[1px] ${
                      editField === "firstName"
                        ? "border-[#043D12] bg-green-50 focus:ring-2 focus:ring-[#043D12]"
                        : "border-[#6A7368]"
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => handleEditClick("firstName")}
                    className={`rounded-[11px] text-[14px] px-4 py-2 shadow-lg flex items-center justify-between gap-2 border-[1px] border-[#6A7368] transition-transform ${
                      buttonActive.firstName
                        ? "scale-95 bg-[#043D12] text-white"
                        : "hover:bg-[#043D12] hover:text-white"
                    }`}
                  >
                    <FiEdit3 className="text-[18px]" />
                    Edit
                  </button>
                </div>
              </div>
              <div className="w-full text-[#6A7368] flex flex-col gap-2">
                <label className="text-sm">Last Name</label>
                <div className="flex justify-between gap-4">
                  <input
                    type="text"
                    disabled={editField !== "lastName"}
                    value={profileData.lastName || ""}
                    onChange={(e) =>
                      handleInputChange("lastName", e.target.value)
                    }
                    className={`w-full h-[46px] px-4 rounded-[11px] border-[1px] ${
                      editField === "lastName"
                        ? "border-[#043D12] bg-green-50 focus:ring-2 focus:ring-[#043D12]"
                        : "border-[#6A7368]"
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => handleEditClick("lastName")}
                    className={`rounded-[11px] text-[14px] px-4 py-2 shadow-lg flex items-center justify-between gap-2 border-[1px] border-[#6A7368] transition-transform ${
                      buttonActive.lastName
                        ? "scale-95 bg-[#043D12] text-white"
                        : "hover:bg-[#043D12] hover:text-white"
                    }`}
                  >
                    <FiEdit3 className="text-[18px]" />
                    Edit
                  </button>
                </div>
              </div>
            </div>
            <div className="w-full flex flex-col gap-6 sm:gap-8">
              <div className="account-details text-[#6A7368] border rounded-[11px] shadow w-full flex flex-col justify-center px-4 py-2 gap-6 sm:gap-8">
                <div>
                  <TbLayoutGrid className="text-[24px] sm:text-[30px]" />
                  <p className="text-[12px] sm:text-[14px]">Account Created</p>
                </div>
                <p className="date text-[12px] sm:text-[14px]">
                  {new Date(profileData.createdAt).toLocaleDateString()}
                </p>
              </div>
              <div className="flex justify-between gap-4 relative">
                <button
                  type="button"
                  className="w-full h-[46px] px-4 rounded-[11px] border-[1px] border-[#6A7368] text-[#6A7368] text-[12px] sm:text-sm overflow-hidden text-ellipsis whitespace-nowrap"
                  onClick={() => {
                    if (shareableLink) {
                      navigator.clipboard.writeText(shareableLink);
                      toast.success("Link copied to clipboard!");
                    }
                  }}
                  disabled={!shareableLink}
                  title={shareableLink || "Generating shareable link..."}
                >
                  {shareableLink
                    ? "mbo-seven.vercel..."
                    : "Loading shareable link..."}
                </button>
                <button
                  type="button"
                  className="rounded-[11px] text-[14px] px-4 sm:px-6 py-1 shadow-lg border-[1px] border-[#6A7368] flex items-center justify-center"
                  onClick={handleShareClick}
                >
                  <TiArrowForwardOutline className="text-[20px] sm:text-[22px]" />
                </button>
                {showShareOptions && (
                  <div className="absolute right-0 top-[50px] bg-white border border-[#6A7368] rounded-lg shadow-lg p-2 flex gap-2 z-10">
                    <button
                      type="button"
                      onClick={() => shareToSocialMedia("whatsapp")}
                      title="Share on WhatsApp"
                    >
                      <FaWhatsapp className="text-[20px] text-green-500 hover:text-green-600" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="btns flex justify-end pt-12 sm:pt-20 pb-8 sm:pb-12">
            <div className="w-fit flex items-center gap-4 sm:gap-6">
              <button
                type="button"
                onClick={() => handleDiscardChanges("personal")}
                className={`border-[1px] border-[#6A7368] text-[#6A7368] rounded-[11px] text-[12px] sm:text-[15px] px-4 sm:px-8 py-2 sm:py-3 shadow-lg transition-transform ${
                  buttonActive.personalDiscard
                    ? "scale-95 bg-[#043D12] text-white"
                    : "hover:text-white hover:bg-[#043D12]"
                }`}
              >
                Discard Changes
              </button>
              <button
                type="submit"
                className={`border-[1px] border-[#6A7368] text-[#6A7368] rounded-[11px] text-[12px] sm:text-[15px] px-4 sm:px-8 py-2 sm:py-3 shadow-lg transition-transform flex items-center gap-2 ${
                  buttonActive.personalSubmit
                    ? "scale-95 bg-[#043D12] text-white"
                    : "hover:text-white hover:bg-[#043D12]"
                }`}
                disabled={buttonActive.personalSubmit}
              >
                Save Changes
                {buttonActive.personalSubmit && <Loader />}
              </button>
            </div>
          </div>
        </form>

        <form onSubmit={(e) => handleSubmit(e, "business")}>
          <h2 className="text-[12px] sm:text-sm border-b-[1px] border-[#6A7368] pb-1 w-fit px-2">
            Business Information
          </h2>
          <div className="mt-4 flex flex-col gap-6 sm:gap-8">
            <div className="text-[#6A7368] flex flex-col gap-2">
              <label className="text-sm">Business Name</label>
              <div className="flex justify-between gap-4">
                <input
                  type="text"
                  disabled={editField !== "businessName"}
                  value={profileData.businessName || ""}
                  onChange={(e) =>
                    handleInputChange("businessName", e.target.value)
                  }
                  className={`w-full h-[46px] px-4 rounded-[11px] border-[1px] ${
                    editField === "businessName"
                      ? "border-[#043D12] bg-green-50 focus:ring-2 focus:ring-[#043D12]"
                      : "border-[#6A7368]"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => handleEditClick("businessName")}
                  className={`rounded-[11px] text-[14px] px-4 py-2 shadow-lg flex items-center justify-between gap-2 border-[1px] border-[#6A7368] transition-transform ${
                    buttonActive.businessName
                      ? "scale-95 bg-[#043D12] text-white"
                      : "hover:bg-[#043D12] hover:text-white"
                  }`}
                >
                  <FiEdit3 className="text-[18px]" />
                  Edit
                </button>
              </div>
            </div>
            <div className="text-[#6A7368] flex flex-col gap-2">
              <label className="text-sm">Category</label>
              <div className="flex justify-between gap-4 relative">
                <button
                  type="button"
                  onClick={toggleDropdown}
                  className={`w-full h-[46px] px-4 rounded-[11px] border-[1px] border-[#6A7368] flex items-center justify-between text-left text-[#6A7368] focus:outline-none ${
                    editField === "category"
                      ? "border-[#043D12] bg-green-50 focus:ring-2 focus:ring-[#043D12]"
                      : "border-[#6A7368]"
                  }`}
                  disabled={editField !== "category"}
                >
                  <div className="flex items-center gap-2">
                    <MdOutlineCategory className="text-[#6A7368] text-[18px]" />
                    <span className="text-sm truncate max-w-[80%]">
                      {selectedCategory.name || "Select Business Category"}
                    </span>
                  </div>
                  {showDropdown ? (
                    <IoMdArrowDropup className="text-[#6A7368] cursor-pointer" />
                  ) : (
                    <IoMdArrowDropdown className="text-[#6A7368] cursor-pointer" />
                  )}
                </button>
                {showDropdown && isLoadingCategories ? (
                  <p className="absolute top-[50px] left-0 w-full bg-[#FFFDF2] text-[#043D12] p-2 z-10 text-sm">
                    Loading categories...
                  </p>
                ) : showDropdown && categories.length > 0 ? (
                  <ul className="absolute top-[50px] left-0 w-full bg-[#FFFDF2] text-[#043D12] border-4 border-[#043D12] rounded-[25px] mt-2 p-2 shadow-lg max-h-[200px] overflow-y-auto z-10">
                    {categories.map((category) => (
                      <li
                        key={category.id}
                        className="py-2 px-4 cursor-pointer hover:bg-[#043D12]/30 rounded-[20px] text-sm"
                        onClick={() =>
                          handleCategorySelect(category.id, category.name)
                        }
                      >
                        {category.name}
                        {category.description && (
                          <p className="text-xs text-[#043D12]/90">
                            {category.description}
                          </p>
                        )}
                      </li>
                    ))}
                  </ul>
                ) : showDropdown ? (
                  <p className="absolute top-[50px] left-0 w-full bg-[#FFFDF2] text-[#043D12] p-2 z-10 text-sm">
                    No categories available.
                  </p>
                ) : null}
                <button
                  type="button"
                  onClick={() => handleEditClick("category")}
                  className={`rounded-[11px] text-[14px] px-4 py-2 shadow-lg flex items-center justify-between gap-2 border-[1px] border-[#6A7368] transition-transform ${
                    buttonActive.category
                      ? "scale-95 bg-[#043D12] text-white"
                      : "hover:bg-[#043D12] hover:text-white"
                  }`}
                >
                  <FiEdit3 className="text-[18px]" />
                  Edit
                </button>
              </div>
            </div>
            <div className="text-[#6A7368] flex flex-col gap-2">
              <label className="text-sm">Keywords</label>
              <div className="flex justify-between gap-4">
                <input
                  type="text"
                  disabled={editField !== "keyword"}
                  value={profileData.keyword.join(",") || ""}
                  onChange={(e) => handleInputChange("keyword", e.target.value)}
                  className={`w-full h-[46px] px-4 rounded-[11px] border-[1px] ${
                    editField === "keyword"
                      ? "border-[#043D12] bg-green-50 focus:ring-2 focus:ring-[#043D12]"
                      : "border-[#6A7368]"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => handleEditClick("keyword")}
                  className={`rounded-[11px] text-[14px] px-4 py-2 shadow-lg flex items-center justify-between gap-2 border-[1px] border-[#6A7368] transition-transform ${
                    buttonActive.keyword
                      ? "scale-95 bg-[#043D12] text-white"
                      : "hover:bg-[#043D12] hover:text-white"
                  }`}
                >
                  <FiEdit3 className="text-[18px]" />
                  Edit
                </button>
              </div>
            </div>
            <div className="text-[#6A7368] flex flex-col gap-2">
              <label className="text-sm">Location</label>
              <div className="flex justify-between gap-4">
                <input
                  type="text"
                  disabled={editField !== "location"}
                  value={profileData.location || ""}
                  onChange={(e) =>
                    handleInputChange("location", e.target.value)
                  }
                  className={`w-full h-[46px] px-4 rounded-[11px] border-[1px] ${
                    editField === "location"
                      ? "border-[#043D12] bg-green-50 focus:ring-2 focus:ring-[#043D12]"
                      : "border-[#6A7368]"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => handleEditClick("location")}
                  className={`rounded-[11px] text-[14px] px-4 py-2 shadow-lg flex items-center justify-between gap-2 border-[1px] border-[#6A7368] transition-transform ${
                    buttonActive.location
                      ? "scale-95 bg-[#043D12] text-white"
                      : "hover:bg-[#043D12] hover:text-white"
                  }`}
                >
                  <FiEdit3 className="text-[18px]" />
                  Edit
                </button>
              </div>
            </div>
          </div>
          <div className="btns flex justify-end pt-12 sm:pt-20 pb-8 sm:pb-12">
            <div className="w-fit flex items-center gap-4 sm:gap-6">
              <button
                type="button"
                onClick={() => handleDiscardChanges("business")}
                className={`border-[1px] border-[#6A7368] text-[#6A7368] rounded-[11px] text-[12px] sm:text-[15px] px-4 sm:px-8 py-2 sm:py-3 shadow-lg transition-transform ${
                  buttonActive.businessDiscard
                    ? "scale-95 bg-[#043D12] text-white"
                    : "hover:text-white hover:bg-[#043D12]"
                }`}
              >
                Discard Changes
              </button>
              <button
                type="submit"
                className={`border-[1px] border-[#6A7368] text-[#6A7368] rounded-[11px] text-[12px] sm:text-[15px] px-4 sm:px-8 py-2 sm:py-3 shadow-lg transition-transform flex items-center gap-2 ${
                  buttonActive.businessSubmit
                    ? "scale-95 bg-[#043D12] text-white"
                    : "hover:text-white hover:bg-[#043D12]"
                }`}
                disabled={buttonActive.businessSubmit}
              >
                Save Changes
                {buttonActive.businessSubmit && <Loader />}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfile;
