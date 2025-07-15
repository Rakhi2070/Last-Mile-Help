// src/components/Navbar.jsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();
  const isLoggedIn = localStorage.getItem("adminToken");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    navigate("/login");
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const navLinks = [
  { to: "/", text: "Home", icon: "🏠" },
  ...(isLoggedIn
    ? [
        { to: "/register", text: "Register", icon: "📋" },
        { to: "/admin", text: "Dashboard", icon: "🧑‍💼" }
      ]
    : [
        { to: "/login", text: "Admin Login", icon: "🔐" }
      ])
];


  return (
    <nav className="bg-gradient-to-r from-blue-600 via-blue-700 to-purple-700 text-white shadow-2xl relative">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-20 -right-20 w-40 h-40 bg-white opacity-5 rounded-full animate-pulse"></div>
        <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-white opacity-5 rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-4 relative z-10">
        <div className="flex justify-between items-center">
          {/* Logo/Brand */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
              <span className="text-xl">🤝</span>
            </div>
            <h1 className="text-2xl font-black bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
              Last Mile Help
            </h1>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-2">
            {navLinks.map((link, index) => (
              <Link
                key={index}
                to={link.to}
                className="group relative px-4 py-2 rounded-xl hover:bg-white/20 transition-all duration-300 backdrop-blur-sm"
              >
                <div className="flex items-center space-x-2">
                  <span className="text-sm opacity-80 group-hover:opacity-100 transition-opacity">
                    {link.icon}
                  </span>
                  <span className="font-medium group-hover:text-white transition-colors">
                    {link.text}
                  </span>
                </div>
                {/* Hover underline effect */}
                <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-white to-blue-200 group-hover:w-full transition-all duration-300"></div>
              </Link>
            ))}
            
            {/* Logout Button */}
            {isLoggedIn && (
              <button
                onClick={handleLogout}
                className="group relative px-4 py-2 rounded-xl hover:bg-red-500/20 transition-all duration-300 backdrop-blur-sm ml-2"
              >
                <div className="flex items-center space-x-2">
                  <span className="text-sm opacity-80 group-hover:opacity-100 transition-opacity">
                    🚪
                  </span>
                  <span className="font-medium group-hover:text-white transition-colors">
                    Logout
                  </span>
                </div>
                <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-red-300 to-red-200 group-hover:w-full transition-all duration-300"></div>
              </button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMobileMenu}
            className="md:hidden p-2 rounded-lg hover:bg-white/20 transition-all duration-300 backdrop-blur-sm"
          >
            <div className="w-6 h-6 flex flex-col justify-center items-center">
              <span className={`block w-5 h-0.5 bg-white transform transition-all duration-300 ${isMobileMenuOpen ? 'rotate-45 translate-y-1' : '-translate-y-1'}`}></span>
              <span className={`block w-5 h-0.5 bg-white transition-all duration-300 ${isMobileMenuOpen ? 'opacity-0' : 'opacity-100'}`}></span>
              <span className={`block w-5 h-0.5 bg-white transform transition-all duration-300 ${isMobileMenuOpen ? '-rotate-45 -translate-y-1' : 'translate-y-1'}`}></span>
            </div>
          </button>
        </div>

        {/* Mobile Menu */}
        <div className={`md:hidden transition-all duration-300 overflow-hidden ${isMobileMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
          <div className="pt-4 pb-2 space-y-2">
            {navLinks.map((link, index) => (
              <Link
                key={index}
                to={link.to}
                onClick={() => setIsMobileMenuOpen(false)}
                className="block px-4 py-3 rounded-xl hover:bg-white/20 transition-all duration-300 backdrop-blur-sm"
              >
                <div className="flex items-center space-x-3">
                  <span className="text-lg opacity-80">{link.icon}</span>
                  <span className="font-medium">{link.text}</span>
                </div>
              </Link>
            ))}
            
            {/* Mobile Logout Button */}
            {isLoggedIn && (
              <button
                onClick={() => {
                  handleLogout();
                  setIsMobileMenuOpen(false);
                }}
                className="w-full text-left px-4 py-3 rounded-xl hover:bg-red-500/20 transition-all duration-300 backdrop-blur-sm"
              >
                <div className="flex items-center space-x-3">
                  <span className="text-lg opacity-80">🚪</span>
                  <span className="font-medium">Logout</span>
                </div>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Bottom gradient line */}
      <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-blue-400 via-purple-400 to-blue-400 opacity-50"></div>
    </nav>
  );
};

export default Navbar;