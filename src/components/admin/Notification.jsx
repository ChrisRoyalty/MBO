import React from "react";
import { FaBell } from "react-icons/fa";

const Notification = () => {
  return (
    <div className="flex-1 bg-white p-6 h-screen text-[#043D12]">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <FaBell className="text-[#6A7368]" /> Notifications
          </h2>
          <span className="text-[#6A7368] text-sm">Coming Soon</span>
        </div>

        {/* Coming Soon Card */}
        <div className="bg-[#FFFDF2] rounded-lg p-8 flex flex-col items-center text-center border border-[#6A7368] border-opacity-20">
          {/* Icon with Subtle Animation */}
          <div className="relative mb-4">
            <FaBell className="text-4xl text-[#6A7368] animate-pulse" />
            <div className="absolute inset-0 rounded-full bg-[#6A7368] opacity-10 animate-ping"></div>
          </div>

          {/* Title */}
          <h3 className="text-lg font-medium text-[#043D12] mb-2">
            Notifications Coming Soon
          </h3>

          {/* Description */}
          <p className="text-[#6A7368] text-sm mb-4 max-w-md leading-relaxed">
            Stay tuned for real-time updates, alerts, and system notifications
            to keep you informed. We're building a powerful feature for you!
          </p>

          {/* Decorative Divider */}
          <div className="w-12 h-px bg-[#6A7368] opacity-50 mb-4"></div>

          {/* Progress Indicator */}
          <div className="flex space-x-2 mb-4">
            <div className="w-2 h-2 bg-[#043D12] rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-[#043D12] rounded-full animate-bounce delay-200"></div>
            <div className="w-2 h-2 bg-[#043D12] rounded-full animate-bounce delay-400"></div>
          </div>

          {/* Subtle Tagline */}
          <p className="mt-2 text-xs text-[#6A7368]">
            A seamless admin experience awaits...
          </p>
        </div>
      </div>

      {/* Inline CSS for Animations */}
      <style jsx>{`
        @keyframes ping {
          0% {
            transform: scale(0.2);
            opacity: 0.8;
          }
          80% {
            transform: scale(1.2);
            opacity: 0;
          }
          100% {
            transform: scale(2.2);
            opacity: 0;
          }
        }
        .animate-ping {
          animation: ping 2s cubic-bezier(0, 0, 0.2, 1) infinite;
        }
        @keyframes bounce {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-5px);
          }
        }
        .animate-bounce {
          animation: bounce 1s infinite;
        }
        .delay-200 {
          animation-delay: 0.2s;
        }
        .delay-400 {
          animation-delay: 0.4s;
        }
      `}</style>
    </div>
  );
};

export default Notification;
