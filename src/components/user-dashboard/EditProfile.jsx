import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ProfileImg from "../../assets/DefaultProfileImg.svg";
import ProfileBg from "../../assets/DefaultProfileBg.svg";
import { FiEdit3 } from "react-icons/fi";
import { TiArrowForwardOutline } from "react-icons/ti";
import { TbLayoutGrid } from "react-icons/tb";
import { MdOutlineCategory } from "react-icons/md";
import { IoMdArrowDropdown, IoMdArrowDropup } from "react-icons/io";

const EditProfile = () => {
  const [profileData, setProfileData] = useState({
    businessName: "",
    contactNo: [],
    businessImg: "",
    backgroundImg: "",
    socialLinks: {},
    description: "",
    location: "",
    keyword: [],
    firstName: "",
    lastName: "",
    category: "",
  });
  const [originalData, setOriginalData] = useState(null);
  const [editField, setEditField] = useState(null);
  const [loading, setLoading] = useState(true);
  const [imageLoading, setImageLoading] = useState({
    businessImg: false,
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
  const [categories, setCategories] = useState([]); // New state for categories
  const [isLoadingCategories, setIsLoadingCategories] = useState(true); // Loading state for categories
  const [showDropdown, setShowDropdown] = useState(false); // Dropdown visibility
  const [selectedCategory, setSelectedCategory] = useState({
    id: "",
    name: profileData.category || "", // Initialize with existing category
  });

  const BASE_URL = "https://mbo.bookbank.com.ng"; // Consistent with your API URL

  // Fetch profile data
  useEffect(() => {
    const profileId = localStorage.getItem("profile_id");
    const token = localStorage.getItem("token");

    if (!profileId || !token) {
      setError("Profile ID or Token is missing from localStorage!");
      setLoading(false);
      return;
    }

    const fetchProfile = async () => {
      try {
        const response = await axios.get(
          `${BASE_URL}/member/get-profile/${profileId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (response.data && response.data.profile) {
          const profile = response.data.profile;
          const initialData = {
            ...profile,
            businessImg: profile.businessImg || "",
            backgroundImg: profile.backgroundImg || "",
            keyword: Array.isArray(profile.keyword) ? profile.keyword : [],
            firstName: profile.firstName || "",
            lastName: profile.lastName || "",
            category: profile.category || "",
            contactNo: Array.isArray(profile.contactNo)
              ? profile.contactNo
              : [],
            socialLinks:
              typeof profile.socialLinks === "object" &&
              profile.socialLinks !== null
                ? profile.socialLinks
                : {},
            description: profile.description || "",
          };
          setProfileData(initialData);
          setOriginalData(initialData);
          setSelectedCategory({ id: "", name: initialData.category || "" }); // Set initial category
        } else {
          setError("No profile data found in the response.");
          toast.error("No profile data found in the response.");
        }
      } catch (error) {
        console.error(
          "❌ Error Fetching Profile:",
          error.response?.data || error.message
        );
        setError(error.response?.data?.error || error.message);
        toast.error(error.response?.data?.error || "Error fetching profile.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(`${BASE_URL}/member/all-category`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log("🔍 Categories Response:", response.data);
        setCategories(response.data.category || response.data.categories || []);
        setIsLoadingCategories(false);
      } catch (error) {
        console.error(
          "❌ Error fetching categories:",
          error.response?.data || error
        );
        toast.error("Failed to load categories. Please try again.");
        setCategories([]);
        setIsLoadingCategories(false);
      }
    };

    fetchCategories();
  }, []);

  // Handle input change
  const handleInputChange = (field, value) => {
    setProfileData((prevData) => ({
      ...prevData,
      [field]:
        field === "keyword" || field === "contactNo" ? value.split(",") : value,
    }));
  };

  // Handle social links change
  const handleSocialLinkChange = (key, value) => {
    setProfileData((prevData) => ({
      ...prevData,
      socialLinks: {
        ...prevData.socialLinks,
        [key]: value,
      },
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
  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  // Handle category selection
  const handleCategorySelect = (id, name) => {
    setSelectedCategory({ id, name });
    setProfileData((prevData) => ({
      ...prevData,
      category: name, // Update profileData.category with selected name
    }));
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

      if (response.data && response.data.secure_url) {
        return response.data.secure_url;
      } else {
        throw new Error("Failed to upload image to Cloudinary.");
      }
    } catch (error) {
      console.error(
        "❌ Error Uploading Image to Cloudinary:",
        error.response?.data || error.message
      );
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

  // Handle form submission
  const handleSubmit = async (e, formType) => {
    e.preventDefault();
    const submitKey =
      formType === "personal" ? "personalSubmit" : "businessSubmit";
    setButtonActive((prev) => ({ ...prev, [submitKey]: true }));
    const profileId = localStorage.getItem("profile_id");
    const token = localStorage.getItem("token");

    if (!profileId || !token) {
      toast.error("Profile ID or Token is missing from localStorage!");
      setButtonActive((prev) => ({ ...prev, [submitKey]: false }));
      return;
    }

    try {
      const API_URL = `${BASE_URL}/member/edit-profile/${profileId}`;
      const {
        id,
        createdAt,
        updatedAt,
        deletedAt,
        views,
        sharedClicks,
        memberId,
        socialClicks,
        categories,
        productImages,
        ...editableData
      } = profileData;
      const payload = {
        ...editableData,
        contactNo: Array.isArray(profileData.contactNo)
          ? profileData.contactNo
          : [],
        keyword: Array.isArray(profileData.keyword) ? profileData.keyword : [],
        socialLinks:
          typeof profileData.socialLinks === "object" &&
          profileData.socialLinks !== null
            ? profileData.socialLinks
            : {},
      };
      console.log("PATCH payload (sent to backend):", payload);
      const response = await axios.patch(API_URL, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("PATCH response from backend:", response.data);

      toast.success(response.data.message || "Profile updated successfully!");
      setEditField(null);

      // Refetch profile to sync UI
      const fetchResponse = await axios.get(
        `${BASE_URL}/member/get-profile/${profileId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      console.log("Refetched profile data:", fetchResponse.data.profile);
      if (fetchResponse.data && fetchResponse.data.profile) {
        const updatedProfile = {
          ...fetchResponse.data.profile,
          businessImg: fetchResponse.data.profile.businessImg || "",
          backgroundImg: fetchResponse.data.profile.backgroundImg || "",
          keyword: Array.isArray(fetchResponse.data.profile.keyword)
            ? fetchResponse.data.profile.keyword
            : [],
          firstName: fetchResponse.data.profile.firstName || "",
          lastName: fetchResponse.data.profile.lastName || "",
          category: fetchResponse.data.profile.category || "",
          contactNo: Array.isArray(fetchResponse.data.profile.contactNo)
            ? fetchResponse.data.profile.contactNo
            : [],
          socialLinks:
            typeof fetchResponse.data.profile.socialLinks === "object" &&
            fetchResponse.data.profile.socialLinks !== null
              ? fetchResponse.data.profile.socialLinks
              : {},
          description: fetchResponse.data.profile.description || "",
        };
        setProfileData(updatedProfile);
        setOriginalData(updatedProfile);
        setSelectedCategory({ id: "", name: updatedProfile.category || "" }); // Update selected category
      }
    } catch (error) {
      console.error("❌ PATCH Error:", error.response?.data || error.message);
      const errorMessage =
        error.response?.data?.error || "Failed to update profile.";
      toast.error(errorMessage);
      if (errorMessage === "Invalid or expired token") {
        toast.error("Session expired. Please log in again.");
      }
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
            socialLinks: originalData?.socialLinks || {},
            description: originalData?.description || "",
          };

    setProfileData((prevData) => ({
      ...prevData,
      ...resetFields,
    }));
    setSelectedCategory({ id: "", name: resetFields.category || "" }); // Reset selected category

    setTimeout(
      () => setButtonActive((prev) => ({ ...prev, [discardKey]: false })),
      200
    );
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
    <div className="relative lg:w-full w-[90%] mx-auto max-lg:flex justify-center">
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
      {/* Background Image */}
      <div className="bgImg relative w-full h-[300px] overflow-hidden">
        {imageLoading.backgroundImg ? (
          <div className="absolute inset-0 flex justify-center items-center bg-gray-200 bg-opacity-50">
            <Loader />
          </div>
        ) : (
          <img
            src={profileData.backgroundImg || ProfileBg}
            className="w-full h-full object-cover"
            alt="Background"
          />
        )}
        <FiEdit3
          className="absolute right-6 top-4 text-white text-[20px] cursor-pointer"
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
      {/* Profile Image and Info */}
      <div className="lg:w-full md:w-[70%] mx-auto flex flex-col gap-4 absolute xl:top-[200px] lg:top-[180px] md:top-40 sm:top-20 min-[500px]:top-10 min-[350px]:top-15 top-5 lg:px-4">
        <div className="max-lg:mt-4 text-[#6A7368] flex max-lg:flex-col justify-center lg:justify-between items-center">
          <figure className="flex flex-col gap-4 items-center">
            {imageLoading.businessImg ? (
              <div className="md:w-[136px] md:h-[136px] w-[90px] h-[90px] flex justify-center items-center">
                <Loader />
              </div>
            ) : (
              <img
                src={profileData.businessImg || ProfileImg}
                alt="Profile-photo"
                className="md:w-[136px] md:h-[136px] w-[90px] h-[90px] rounded-full object-cover border-4 border-white"
              />
            )}
            <figcaption className="text-center">
              <h4 className="text-[16px]">{profileData.businessName}</h4>
              <p className="text-[10px]">
                {profileData.category || "Clothing and Accessories"}
              </p>
            </figcaption>
          </figure>
          <button
            className={`max-lg:mt-1 border rounded-[11px] text-[10px] px-7 py-3 shadow-lg mt-8 transition-transform ${
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
                handleImageUpload("businessImg", e.target.files[0]);
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
        <form onSubmit={(e) => handleSubmit(e, "personal")}>
          <h2 className="text-[12px] border-b-[1px] border-[#6A7368] pb-1 w-fit px-2">
            Personal Information
          </h2>

          <div className="w-full flex max-lg:flex-col items-center gap-12 mt-4">
            <div className="w-full flex flex-col gap-8">
              <div className="text-[#6A7368] flex flex-col gap-2">
                <label>First Name</label>
                <div className="flex justify-between gap-4">
                  <input
                    type="text"
                    disabled={editField !== "firstName"}
                    value={profileData.firstName || ""}
                    onChange={(e) =>
                      handleInputChange("firstName", e.target.value)
                    }
                    className={`w-full lg:w-full h-[46px] px-4 rounded-[11px] border-[1px] ${
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
                <label>Last Name</label>
                <div className="flex justify-between gap-4">
                  <input
                    type="text"
                    disabled={editField !== "lastName"}
                    value={profileData.lastName || ""}
                    onChange={(e) =>
                      handleInputChange("lastName", e.target.value)
                    }
                    className={`w-full lg:w-full h-[46px] px-4 rounded-[11px] border-[1px] ${
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
            <div className="w-full flex flex-col gap-8">
              <div className="account-details text-[#6A7368] border rounded-[11px] shadow w-full flex flex-col justify-center px-4 py-2 gap-8">
                <div>
                  <TbLayoutGrid className="text-[30px]" />
                  <p className="text-[14px]">Account Created</p>
                </div>
                <p className="date text-[14px]">
                  {new Date(profileData.createdAt).toLocaleDateString()}
                </p>
              </div>
              <div className="flex justify-between gap-4">
                <input
                  type="email"
                  disabled
                  placeholder="www.ukandsons.com"
                  className="h-[46px] px-4 rounded-[11px] border-[1px] border-[#6A7368]"
                />
                <button className="rounded-[11px] text-[14px] px-6 py-1 shadow-lg border-[1px] border-[#6A7368]">
                  <TiArrowForwardOutline className="text-[22px]" />
                </button>
              </div>
            </div>
          </div>
          <div className="btns flex justify-end pt-20 pb-12">
            <div className="w-fit flex items-center gap-6">
              <button
                type="button"
                onClick={() => handleDiscardChanges("personal")}
                className={`border-[1px] border-[#6A7368] text-[#6A7368] rounded-[11px] text-[15px] px-2 lg:px-8 py-3 shadow-lg transition-transform ${
                  buttonActive.personalDiscard
                    ? "scale-95 bg-[#043D12] text-white"
                    : "hover:text-white hover:bg-[#043D12]"
                }`}
              >
                Discard Changes
              </button>
              <button
                type="submit"
                className={`border-[1px] border-[#6A7368] text-[#6A7368] rounded-[11px] text-[15px] px-2 lg:px-8 py-3 shadow-lg transition-transform flex items-center gap-2 ${
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

        {/* Business Information */}
        <form onSubmit={(e) => handleSubmit(e, "business")}>
          <h2 className="text-[12px] border-b-[1px] border-[#6A7368] pb-1 w-fit px-2">
            Business Information
          </h2>

          <div className="mt-4">
            <div className="flex flex-col gap-8">
              <div className="text-[#6A7368] flex flex-col gap-2">
                <label>Business Name</label>
                <div className="flex justify-between lg:gap-10 gap-4">
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
                <label>Category</label>
                <div className="flex justify-between lg:gap-10 gap-4 relative">
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
                      <span className="text-sm md:text-base truncate max-w-[80%]">
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
                    <p className="absolute top-[50px] left-0 w-full bg-[#FFFDF2] text-[#043D12] p-2 z-10">
                      Loading categories...
                    </p>
                  ) : showDropdown && categories.length > 0 ? (
                    <ul className="absolute top-[50px] left-0 w-full bg-[#FFFDF2] text-[#043D12] border-4 border-[#043D12] rounded-[25px] mt-2 p-2 shadow-lg max-h-[200px] overflow-y-auto z-10">
                      {categories.map((category) => (
                        <li
                          key={category.id}
                          className="py-2 px-4 cursor-pointer hover:bg-[#043D12]/30 rounded-[20px]"
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
                    <p className="absolute top-[50px] left-0 w-full bg-[#FFFDF2] text-[#043D12] p-2 z-10">
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
                <label>Keywords</label>
                <div className="flex justify-between lg:gap-10 gap-4">
                  <input
                    type="text"
                    disabled={editField !== "keyword"}
                    value={profileData.keyword.join(",") || ""}
                    onChange={(e) =>
                      handleInputChange("keyword", e.target.value)
                    }
                    className={`w-full h-[46px] px-4 rounded-[11px] border-[1px] ${
                      editField === "keyword"
                        ? "border-[#043D12] bg-green-50 focus:ring-2 focus:ring-[#043D12]"
                        : "border-[#6A7368]"
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => handleEditClick("keyword")}
                    className={`rounded-[11px] h-fit text-[14px] px-4 py-3 shadow-lg flex items-center justify-between gap-2 border-[1px] border-[#6A7368] transition-transform ${
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
                <label>Location</label>
                <div className="flex justify-between lg:gap-10 gap-4">
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
              <div className="text-[#6A7368] flex flex-col gap-2">
                <label>Facebook Link (Social)</label>
                <div className="flex justify-between lg:gap-10 gap-4">
                  <input
                    type="text"
                    disabled={editField !== "socialLinks.facebook"}
                    value={profileData.socialLinks.facebook || ""}
                    onChange={(e) =>
                      handleSocialLinkChange("facebook", e.target.value)
                    }
                    className={`w-full h-[46px] px-4 rounded-[11px] border-[1px] ${
                      editField === "socialLinks.facebook"
                        ? "border-[#043D12] bg-green-50 focus:ring-2 focus:ring-[#043D12]"
                        : "border-[#6A7368]"
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => handleEditClick("socialLinks.facebook")}
                    className={`rounded-[11px] text-[14px] px-4 py-2 shadow-lg flex items-center justify-between gap-2 border-[1px] border-[#6A7368] transition-transform ${
                      buttonActive["socialLinks.facebook"]
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
          </div>
          <div className="btns flex justify-end pt-20 pb-12">
            <div className="w-fit flex items-center gap-6">
              <button
                type="button"
                onClick={() => handleDiscardChanges("business")}
                className={`border-[1px] border-[#6A7368] text-[#6A7368] rounded-[11px] text-[15px] px-2 lg:px-8 py-3 shadow-lg transition-transform ${
                  buttonActive.businessDiscard
                    ? "scale-95 bg-[#043D12] text-white"
                    : "hover:text-white hover:bg-[#043D12]"
                }`}
              >
                Discard Changes
              </button>
              <button
                type="submit"
                className={`border-[1px] border-[#6A7368] text-[#6A7368] rounded-[11px] text-[15px] px-2 lg:px-8 py-3 shadow-lg transition-transform flex items-center gap-2 ${
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
