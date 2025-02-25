import React from "react";

const ProfileProgressBar = () => {
  const progress = 60; // Static value for now

  return (
    <div className="progress-bar flex items-center gap-4 w-fit">
      <p className="text-[#6A7368] lg:text-[16px] text-[14px] max-md:hidden">
        Complete Profile
      </p>
      <div className="relative w-[250px] h-[15px] bg-[#e0e0e0] rounded-full">
        <div
          className="absolute top-0 left-0 h-full bg-[#4CAF50] rounded-full transition-all duration-500"
          style={{ width: `${progress}%` }}
        ></div>
      </div>
      <p className="text-[16px] text-[#6A7368]">{progress}%</p>
    </div>
  );
};

export default ProfileProgressBar;
