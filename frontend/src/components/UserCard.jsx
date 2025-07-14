// src/components/UserCard.jsx

import React from "react";
import { Link } from "react-router-dom";

const UserCard = ({ user, onDelete }) => {
  return (
    <div className="border rounded-xl p-4 shadow-md bg-white">
      <h3 className="text-lg font-bold mb-2">{user.name}</h3>
      <p><strong>Email:</strong> {user.email}</p>
      <p><strong>Phone:</strong> {user.phone}</p>

      <div className="mt-4 flex items-center justify-between">
        <Link
          to={`/user/${user._id}`}
          className="text-sm text-blue-600 underline"
        >
          View Details
        </Link>

        <div className="flex gap-2">
          <Link
            to={`/edit/${user._id}`}
            className="text-xs bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-600"
          >
            Edit
          </Link>
          <button
            onClick={() => onDelete(user._id)}
            className="text-xs bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserCard;
