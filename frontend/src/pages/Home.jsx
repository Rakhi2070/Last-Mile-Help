// src/pages/Home.jsx

import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const Home = () => {
  const isLoggedIn = localStorage.getItem("adminToken");
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Trigger entrance animation
    setTimeout(() => setIsVisible(true), 100);
  }, []);

 const buttonData = [
  ...(isLoggedIn
    ? [
        {
          to: "/register",
          icon: "📋",
          text: "Register User",
          bgColor: "bg-blue-600 hover:bg-blue-700",
          gradientFrom: "from-blue-500",
          gradientTo: "to-blue-600",
          description: "Create digital identity"
        }
      ]
    : []
  ),
  {
    to: isLoggedIn ? "/admin" : "/login",
    icon: isLoggedIn ? "🧑‍💼" : "🔐",
    text: isLoggedIn ? "Go to Dashboard" : "Admin Login",
    bgColor: "bg-green-600 hover:bg-green-700",
    gradientFrom: "from-emerald-500",
    gradientTo: "to-emerald-600",
    description: isLoggedIn ? "Access admin panel" : "Admin authentication"
  },
  {
    to: "/admin-register",
    icon: "🛡️",
    text: "Register Admin",
    bgColor: "bg-purple-600 hover:bg-purple-700",
    gradientFrom: "from-purple-500",
    gradientTo: "to-purple-600",
    description: "Create admin account"
  },
  {
    to: "/services",
    icon: "🏥",
    text: "View Services",
    bgColor: "bg-orange-600 hover:bg-orange-700",
    gradientFrom: "from-orange-500",
    gradientTo: "to-orange-600",
    description: "Browse available services"
  }
];


  const features = [
    { icon: "🆔", title: "Digital Identity", desc: "Temporary digital IDs for verification" },
    { icon: "🏠", title: "Shelter Access", desc: "Find and access emergency shelter" },
    { icon: "🍚", title: "Food Security", desc: "Ration and meal assistance programs" },
    { icon: "💼", title: "Job Opportunities", desc: "Employment assistance and placement" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-200 rounded-full opacity-20 animate-pulse"></div>
        <div
          className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-200 rounded-full opacity-20 animate-pulse"
          style={{ animationDelay: "1s" }}
        ></div>
        <div
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-emerald-200 rounded-full opacity-10 animate-pulse"
          style={{ animationDelay: "2s" }}
        ></div>
      </div>

      <div className="relative z-10 min-h-screen flex items-center justify-center px-4 py-8">
        <div
          className={`w-full max-w-6xl transition-all duration-1000 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          {/* Main Card */}
          <div className="bg-white/80 backdrop-blur-sm shadow-2xl rounded-3xl p-8 md:p-12 text-center mb-8 border border-white/20">
            <div className="mb-6">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full mb-4 shadow-lg">
                <span className="text-3xl">🤝</span>
              </div>
              <h1 className="text-5xl md:text-6xl font-black bg-gradient-to-r from-blue-600 via-purple-600 to-emerald-600 bg-clip-text text-transparent mb-4">
                Last Mile Help
              </h1>
              <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto mb-6 rounded-full"></div>
            </div>

            <p className="text-gray-700 text-lg md:text-xl leading-relaxed max-w-4xl mx-auto mb-8">
              A platform to assist individuals without valid IDs or permanent
              addresses by providing
              <span className="font-semibold text-blue-600">
                {" "}
                temporary digital identities
              </span>{" "}
              and helping them access essential services like shelter, ration,
              healthcare, and jobs.
            </p>

            {/* Feature Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="bg-white/60 backdrop-blur-sm rounded-2xl p-4 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-white/30"
                  style={{ animationDelay: `${index * 0.2}s` }}
                >
                  <div className="text-2xl mb-2">{feature.icon}</div>
                  <h3 className="font-bold text-gray-800 text-sm mb-1">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 text-xs">{feature.desc}</p>
                </div>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap justify-center gap-4">
              {buttonData.map((button, index) => (
                <Link
                  key={index}
                  to={button.to}
                  className={`w-72 group relative bg-gradient-to-r ${button.gradientFrom} ${button.gradientTo} 
    hover:from-opacity-90 hover:to-opacity-90 text-white font-semibold 
    px-8 py-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 
    hover:-translate-y-1 overflow-hidden transform hover:scale-105`}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  {/* Button shine effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>

                  <div className="relative z-10">
                    <div className="text-2xl mb-2">{button.icon}</div>
                    <div className="font-bold text-sm mb-1">{button.text}</div>
                    <div className="text-xs opacity-90">
                      {button.description}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Additional Info Card */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-8 text-center text-white shadow-2xl">
            <div className="flex items-center justify-center mb-4">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mr-4">
                <span className="text-2xl">💡</span>
              </div>
              <h2 className="text-2xl font-bold">How It Works</h2>
            </div>
            <p className="text-lg opacity-90 max-w-3xl mx-auto">
              Our platform creates secure, temporary digital identities that
              enable access to essential services while maintaining privacy and
              dignity. Join thousands who have already found help through our
              network.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;