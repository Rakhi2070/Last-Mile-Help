// src/components/Navbar.jsx
import React from "react";
import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();
  const isLoggedIn = localStorage.getItem("adminToken");

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    navigate("/login");
  };

  return (
    <nav className="bg-blue-600 text-white px-4 py-3 shadow-md">
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        <h1 className="text-xl font-bold">Last Mile Help</h1>

        <div className="space-x-4 text-sm sm:text-base">
          <Link to="/" className="hover:underline">Home</Link>
          <Link to="/register" className="hover:underline">Register</Link>

          {!isLoggedIn ? (
            <>
              <Link to="/login" className="hover:underline">Admin Login</Link>
            </>
          ) : (
            <>
              <Link to="/admin" className="hover:underline">Dashboard</Link>
              <button onClick={handleLogout} className="hover:underline">Logout</button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
