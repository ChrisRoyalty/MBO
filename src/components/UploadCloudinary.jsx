import React from "react";

const UploadToCloudinary = () => {
  const openUploadWidget = () => {
    window.cloudinary
      .createUploadWidget(
        {
          cloudName: "drve24nad", // Replace with your Cloudinary cloud name
          uploadPreset: "mbo_upload_preset", // Replace with your upload preset
          sources: ["local"], // Allow local file uploads
          multiple: true, // Allow multiple files
          resourceType: "auto", // Detect image or video
          folder: "benefits", // Store in 'benefits' folder
        },
        (error, result) => {
          if (!error && result && result.event === "success") {
            console.log("Uploaded file:", {
              url: result.info.secure_url,
              public_id: result.info.public_id,
            });
          }
          if (error) {
            console.error("Upload error:", error);
          }
        }
      )
      .open();
  };

  return (
    <button
      onClick={openUploadWidget}
      className="px-4 py-2 bg-blue-500 text-white rounded"
    >
      Upload Assets to Cloudinary
    </button>
  );
};

export default UploadToCloudinary;
