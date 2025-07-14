// src/pages/Home.jsx

import React from "react";
import { Link } from "react-router-dom";

const Home = () => {
  const isLoggedIn = localStorage.getItem("adminToken");

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white shadow-xl rounded-2xl p-10 max-w-2xl w-full text-center">
        <h1 className="text-4xl font-extrabold text-blue-700 mb-4">
          Last Mile Help
        </h1>
        <p className="text-gray-700 mb-6 text-lg">
          A platform to assist individuals without valid IDs or permanent
          addresses by providing temporary digital identities and helping them
          access essential services like shelter, ration, healthcare, and jobs.
        </p>

        <div className="flex flex-col md:flex-row justify-center gap-4 mt-6">
          <Link
            to="/register"
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-2 rounded-md shadow"
          >
            📋 Register User
          </Link>

          {isLoggedIn ? (
            <Link
              to="/admin"
              className="bg-green-600 hover:bg-green-700 text-white font-medium px-6 py-2 rounded-md shadow"
            >
              🧑‍💼 Go to Dashboard
            </Link>
          ) : (
            <Link
              to="/login"
              className="bg-green-600 hover:bg-green-700 text-white font-medium px-6 py-2 rounded-md shadow"
            >
              🔐 Admin Login
            </Link>
          )}

          <Link
            to="/admin-register"
            className="bg-purple-600 hover:bg-purple-700 text-white font-medium px-6 py-2 rounded-md shadow"
          >
            🛡️ Register Admin
          </Link>
          <Link
            to="/services"
            className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-2 rounded"
          >
            View Services
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;
