import React from "react";
import {
  FaBell,
  FaCheckCircle,
  FaTimesCircle,
  FaInfoCircle,
} from "react-icons/fa";

const Notification = () => {
  // Static sample data until endpoint is available
  const notifications = [
    {
      id: 1,
      type: "success",
      message: "Profile updated successfully",
      timestamp: "2 mins ago",
    },
    {
      id: 2,
      type: "error",
      message: "Failed to process payment",
      timestamp: "15 mins ago",
    },
    {
      id: 3,
      type: "info",
      message: "New feature available: Dark Mode",
      timestamp: "1 hour ago",
    },
  ];

  // Function to get appropriate icon based on notification type
  const getIcon = (type) => {
    switch (type) {
      case "success":
        return <FaCheckCircle className="text-green-500" />;
      case "error":
        return <FaTimesCircle className="text-red-500" />;
      case "info":
        return <FaInfoCircle className="text-blue-500" />;
      default:
        return <FaBell className="text-gray-500" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-white flex items-center gap-2">
            <FaBell /> Notifications
          </h2>
          <span className="bg-white bg-opacity-20 text-white text-xs font-medium px-2 py-1 rounded-full">
            {notifications.length}
          </span>
        </div>

        {/* Notification List */}
        <div className="divide-y divide-gray-200 max-h-[70vh] overflow-y-auto">
          {notifications.length > 0 ? (
            notifications.map((notification) => (
              <div
                key={notification.id}
                className="p-4 hover:bg-gray-50 transition-all duration-300 ease-in-out flex items-start gap-3"
              >
                <div className="mt-1">{getIcon(notification.type)}</div>
                <div className="flex-1">
                  <p className="text-gray-800 text-sm font-medium">
                    {notification.message}
                  </p>
                  <p className="text-gray-500 text-xs mt-1">
                    {notification.timestamp}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <div className="p-6 text-center">
              <FaBell className="text-gray-400 text-3xl mx-auto mb-2" />
              <p className="text-gray-500 text-sm">No notifications yet</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-gray-50 border-t border-gray-200">
          <button className="w-full py-2 px-4 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors duration-300">
            Clear All
          </button>
        </div>
      </div>
    </div>
  );
};

export default Notification;
