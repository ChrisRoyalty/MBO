import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ProfileImg from "../../assets/DefaultProfileImg.svg";
import ProfileBg from "../../assets/DefaultProfileBg.svg";
import { FiEdit3 } from "react-icons/fi";
import { TiArrowForwardOutline } from "react-icons/ti";
import { TbLayoutGrid } from "react-icons/tb";

const EditProfile = () => {
  const [profileData, setProfileData] = useState({
    businessName: "",
    contactNo: [],
    businesImg: "", // Ensure this is a string
    backgroundImg: "", // Ensure this is a string
    socialLinks: {},
    description: "",
    location: "",
    keyword: [],
  });
  const [editField, setEditField] = useState(null); // Track which field is being edited
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
        const API_URL = `https://mbo.bookbank.com.ng/member/get-profile/${profileId}`;
        const response = await axios.get(API_URL, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.data && response.data.profile) {
          const profile = response.data.profile;
          setProfileData({
            ...profile,
            businesImg: profile.businesImg || "", // Ensure businesImg is a string
            backgroundImg: profile.backgroundImg || "", // Ensure backgroundImg is a string
            keyword: Array.isArray(profile.keyword) ? profile.keyword : [], // Ensure keyword is an array
          });
        } else {
          setError("No profile data found in the response.");
          toast.error("No profile data found in the response.");
        }
      } catch (error) {
        console.error("❌ Error Fetching Profile:", error);
        setError(error.message);
        toast.error(`Error fetching profile: ${error.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  // Handle input change
  const handleInputChange = (field, value) => {
    setProfileData((prevData) => ({
      ...prevData,
      [field]: value,
    }));
  };

  // Handle edit button click
  const handleEditClick = (field) => {
    setEditField(field);
  };

  // Upload image to Cloudinary
  const uploadImageToCloudinary = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "your_cloudinary_upload_preset"); // Replace with your Cloudinary upload preset

    try {
      const response = await axios.post(
        "https://api.cloudinary.com/v1_1/your_cloud_name/image/upload", // Replace with your Cloudinary cloud name
        formData
      );

      if (response.data && response.data.secure_url) {
        return response.data.secure_url; // Return the image URL
      } else {
        throw new Error("Failed to upload image to Cloudinary.");
      }
    } catch (error) {
      console.error("❌ Error Uploading Image to Cloudinary:", error);
      toast.error(`Error uploading image: ${error.message}`);
      return null;
    }
  };

  // Handle image upload
  const handleImageUpload = async (field, file) => {
    if (!file) return;

    const imageUrl = await uploadImageToCloudinary(file);
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
    const profileId = localStorage.getItem("profile_id");
    const token = localStorage.getItem("token");

    if (!profileId || !token) {
      toast.error("Profile ID or Token is missing from localStorage!");
      return;
    }

    try {
      const API_URL = `https://mbo.bookbank.com.ng/member/edit-profile/${profileId}`;
      const response = await axios.patch(
        API_URL,
        {
          ...profileData,
          keyword: Array.isArray(profileData.keyword)
            ? profileData.keyword
            : [], // Ensure keyword is an array
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data && response.data.updatedProfile) {
        toast.success(response.data.message || "Profile updated successfully!");
        setEditField(null); // Exit edit mode
      } else {
        toast.error("Failed to update profile.");
      }
    } catch (error) {
      console.error("❌ Error Updating Profile:", error);
      toast.error(
        `Error updating profile: ${
          error.response?.data?.message || error.message
        }`
      );
    }
  };

  // Handle discard changes
  const handleDiscardChanges = () => {
    setEditField(null); // Exit edit mode
    setError(null);
  };

  // Loader
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
      <div className="bgImg relative w-full">
        <img
          src={profileData.backgroundImg || ProfileBg}
          className="w-full Profile-background-photo lg:h-[400px] h-full"
        />
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
      <div className="lg:w-full md:w-[70%] mx-auto flex flex-col gap-4 absolute xl:top-[280px] md:top-60 sm:top-30 min-[500px]:top-10 min-[350px]:top-15 top-5 lg:px-4">
        <div className="max-lg:mt-4 text-[#6A7368] flex max-lg:flex-col justify-center lg:justify-between items-center">
          <figure className="flex flex-col gap-4 items-center">
            <img
              src={profileData.businesImg || ProfileImg}
              alt="Profile-photo"
              className="md:w-[136px] md:h-[136px] w-[90px] h-[90px]"
            />
            <figcaption className="">
              <h4 className="text-[16px]">{profileData.businessName}</h4>
              <p className="text-[10px]">Clothing and Accessories</p>
            </figcaption>
          </figure>
          <button
            className="max-lg:mt-1 border rounded-[11px] text-[10px] px-7 hover:px- cursor-pointer hover:bg-[#043D12] hover:text-white py-3  shadow-lg mt-8"
            onClick={() => {
              const fileInput = document.createElement("input");
              fileInput.type = "file";
              fileInput.accept = "image/*";
              fileInput.onchange = (e) =>
                handleImageUpload("businesImg", e.target.files[0]);
              fileInput.click();
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
                    className="w-full lg:w-full h-[46px] px-4 rounded-[11px] border-[1px] border-[#6A7368]"
                  />
                  <button
                    type="button"
                    onClick={() => handleEditClick("firstName")}
                    className="rounded-[11px] text-[14px] px-4 cursor-pointer hover:bg-[#043D12] hover:text-white py-2  shadow-lg flex items-center justify-between gap-2 border-[1px] border-[#6A7368]"
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
                    className="w-full lg:w-full h-[46px] px-4 rounded-[11px] border-[1px] border-[#6A7368]"
                  />
                  <button
                    type="button"
                    onClick={() => handleEditClick("lastName")}
                    className="rounded-[11px] text-[14px] px-4 cursor-pointer hover:bg-[#043D12] hover:text-white py-2  shadow-lg flex items-center justify-between gap-2 border-[1px] border-[#6A7368]"
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
                  className=" h-[46px] px-4 rounded-[11px] border-[1px] border-[#6A7368]"
                />
                <button className="rounded-[11px] text-[14px] px-6 cursor-pointer py-1  shadow-lg gap-2 border-[1px] border-[#6A7368]">
                  <TiArrowForwardOutline className="text-[22px]" />
                </button>
              </div>
            </div>
          </div>
          <div className="btns flex justify-end pt-20 pb-12">
            <div className="w-fit flex items-center gap-6">
              <button
                type="button"
                onClick={handleDiscardChanges}
                className="border-[1px] border-[#6A7368] text-[#6A7368] rounded-[11px] text-[15px] hover:text-white px-2 lg:px-8 py-3  shadow-lg hover:bg-[#043D12]"
              >
                Discard Changes
              </button>
              <button
                type="submit"
                className="border-[1px] border-[#6A7368] text-[#6A7368] rounded-[11px] text-[15px] hover:text-white px-2 lg:px-8 py-3  shadow-lg hover:bg-[#043D12]"
              >
                Save Changes
              </button>
            </div>
          </div>
        </form>

        {/* Business information */}
        <form onSubmit={(e) => handleSubmit(e, "business")}>
          <h2 className="text-[12px] border-b-[1px] border-[#6A7368] pb-1 w-fit px-2">
            Business Information
          </h2>

          <div className=" mt-4">
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
                    className="w-full h-[46px] px-4 rounded-[11px] border-[1px] border-[#6A7368]"
                  />
                  <button
                    type="button"
                    onClick={() => handleEditClick("businessName")}
                    className="rounded-[11px] text-[14px] px-4 cursor-pointer hover:bg-[#043D12] hover:text-white py-2  shadow-lg flex items-center justify-between gap-2 border-[1px] border-[#6A7368]"
                  >
                    <FiEdit3 className="text-[18px]" />
                    Edit
                  </button>
                </div>
              </div>

              <div className="text-[#6A7368] flex flex-col gap-2">
                <label>Category</label>
                <div className="flex justify-between lg:gap-10 gap-4">
                  <input
                    type="text"
                    disabled={editField !== "category"}
                    value={profileData.category || ""}
                    onChange={(e) =>
                      handleInputChange("category", e.target.value)
                    }
                    className="w-full h-[46px] px-4 rounded-[11px] border-[1px] border-[#6A7368]"
                  />
                  <button
                    type="button"
                    onClick={() => handleEditClick("category")}
                    className="rounded-[11px] text-[14px] px-4 cursor-pointer hover:bg-[#043D12] hover:text-white py-2  shadow-lg flex items-center justify-between gap-2 border-[1px] border-[#6A7368]"
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
                    value={profileData.keyword || ""}
                    onChange={(e) =>
                      handleInputChange("keyword", e.target.value)
                    }
                    className="w-full h-[46px] px-4 rounded-[11px] border-[1px] border-[#6A7368]"
                  />
                  <button
                    type="button"
                    onClick={() => handleEditClick("keyword")}
                    className="rounded-[11px] h-fit text-[14px] px-4 cursor-pointer hover:bg-[#043D12] hover:text-white py-3  shadow-lg flex items-center justify-between gap-2 border-[1px] border-[#6A7368]"
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
                    className="w-full h-[46px] px-4 rounded-[11px] border-[1px] border-[#6A7368]"
                  />
                  <button
                    type="button"
                    onClick={() => handleEditClick("location")}
                    className="rounded-[11px] text-[14px] px-4 cursor-pointer hover:bg-[#043D12] hover:text-white py-2  shadow-lg flex items-center justify-between gap-2 border-[1px] border-[#6A7368]"
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
                onClick={handleDiscardChanges}
                className="border-[1px] border-[#6A7368] text-[#6A7368] rounded-[11px] text-[15px] hover:text-white px-2 lg:px-8 py-3  shadow-lg hover:bg-[#043D12]"
              >
                Discard Changes
              </button>
              <button
                type="submit"
                className="border-[1px] border-[#6A7368] text-[#6A7368] rounded-[11px] text-[15px] hover:text-white px-2 lg:px-8 py-3  shadow-lg hover:bg-[#043D12]"
              >
                Save Changes
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfile;
