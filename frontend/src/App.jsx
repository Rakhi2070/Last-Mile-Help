// src/App.jsx

import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Register from "./pages/Register";
import Admin from "./pages/Admin";
import UserDetail from "./pages/UserDetail";
import EditUserForm from "./pages/EditUserForm";
import Login from "./pages/Login";
import AdminRegister from "./pages/AdminRegister";
import Navbar from "./components/Navbar";
import ServiceDashboard from "./pages/ServiceDashboard"; // ✅ NEW

const PrivateRoute = ({ children }) => {
  const isLoggedIn = localStorage.getItem("adminToken");
  return isLoggedIn ? children : <Navigate to="/login" />;
};

const App = () => {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin-register" element={<AdminRegister />} />
        <Route
          path="/admin"
          element={
            <PrivateRoute>
              <Admin />
            </PrivateRoute>
          }
        />
        <Route
          path="/services"
          element={
            <PrivateRoute>
              <ServiceDashboard />
            </PrivateRoute>
          }
        />
        <Route path="/user/:id" element={<UserDetail />} />
        <Route path="/edit/:id" element={<EditUserForm />} />
      </Routes>
    </>
  );
};

export default App;
