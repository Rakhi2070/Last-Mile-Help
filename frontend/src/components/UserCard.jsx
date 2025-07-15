// src/components/UserCard.jsx

import React, { useState } from "react";
import { Link } from "react-router-dom";

const UserCard = ({ user, onDelete }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleDeleteClick = () => {
    setShowDeleteConfirm(true);
  };

  const handleConfirmDelete = () => {
    onDelete(user._id);
    setShowDeleteConfirm(false);
  };

  const handleCancelDelete = () => {
    setShowDeleteConfirm(false);
  };

  return (
    <div 
      className="relative group bg-gradient-to-br from-white to-gray-50 rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-200/50 hover:border-blue-300/50 transform hover:-translate-y-1"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Background gradient animation */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 to-purple-50/30 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      
      {/* Animated border effect */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-400/20 via-purple-400/20 to-blue-400/20 opacity-0 group-hover:opacity-100 blur-sm transition-opacity duration-300 -z-10"></div>

      <div className="relative z-10">
        {/* Header with user avatar */}
        <div className="flex items-center mb-4">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg mr-4">
            <span className="text-white font-bold text-lg">
              {user.name.charAt(0).toUpperCase()}
            </span>
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-bold text-gray-800 mb-1">
              {user.name}
            </h3>
            <div className="w-8 h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
          </div>
        </div>

        {/* User information */}
        <div className="space-y-3 mb-6">
          <div className="flex items-center text-gray-600">
            <span className="text-blue-500 mr-3">✉️</span>
            <span className="font-medium text-gray-500 mr-2">Email:</span>
            <span className="text-gray-800">{user.email}</span>
          </div>
          <div className="flex items-center text-gray-600">
            <span className="text-green-500 mr-3">📞</span>
            <span className="font-medium text-gray-500 mr-2">Phone:</span>
            <span className="text-gray-800">{user.phone}</span>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex items-center justify-between">
          <Link
            to={`/user/${user._id}`}
            className="group/link inline-flex items-center text-blue-600 hover:text-blue-700 font-medium transition-colors duration-200"
          >
            <span className="mr-2">👁️</span>
            <span className="relative">
              View Details
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-600 group-hover/link:w-full transition-all duration-300"></span>
            </span>
          </Link>

          <div className="flex gap-3">
            <Link
              to={`/edit/${user._id}`}
              className="group/edit inline-flex items-center px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-sm font-medium rounded-xl hover:from-amber-600 hover:to-orange-600 transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105"
            >
              <span className="mr-2">✏️</span>
              Edit
            </Link>
            
            <button
              onClick={handleDeleteClick}
              className="group/delete inline-flex items-center px-4 py-2 bg-gradient-to-r from-red-500 to-pink-500 text-white text-sm font-medium rounded-xl hover:from-red-600 hover:to-pink-600 transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105"
            >
              <span className="mr-2">🗑️</span>
              Delete
            </button>
          </div>
        </div>

        {/* Delete confirmation modal */}
        {showDeleteConfirm && (
          <div className="absolute inset-0 bg-white/95 backdrop-blur-sm rounded-2xl flex items-center justify-center z-20 animate-fadeIn">
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">⚠️</span>
              </div>
              <h4 className="text-lg font-bold text-gray-800 mb-2">
                Confirm Delete
              </h4>
              <p className="text-gray-600 mb-6">
                Are you sure you want to delete {user.name}?
              </p>
              <div className="flex gap-3 justify-center">
                <button
                  onClick={handleCancelDelete}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors duration-200"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmDelete}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors duration-200"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Floating action indicator */}
      <div className={`absolute top-4 right-4 w-3 h-3 bg-green-400 rounded-full transition-all duration-300 ${isHovered ? 'opacity-100 scale-100' : 'opacity-0 scale-0'}`}></div>
    </div>
  );
};

export default UserCard;