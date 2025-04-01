import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const ProfileProgressBar = ({ progress, isComplete }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (!isComplete) {
      navigate("/user-dashboard/profile");
    }
  };

  return (
    <div className="flex flex-col items-center gap-2">
      <div
        className="w-[150px] sm:w-[200px] h-2 bg-gray-200 rounded-full overflow-hidden cursor-pointer"
        onClick={handleClick}
        title={!isComplete ? "Complete your profile" : "Profile Fully Synced"}
      >
        <motion.div
          className="h-full bg-[#043D12]"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        />
      </div>
      <p className="text-[10px] sm:text-[12px] text-[#6A7368]">
        {isComplete ? (
          <span className="text-[#043D12] font-semibold">
            Profile Fully Synced ⚡
          </span>
        ) : (
          `Profile Progress: ${Math.round(progress)}%`
        )}
      </p>
    </div>
  );
};

export default ProfileProgressBar;
