// src/pages/Register.jsx
import React from "react";
import UserForm from "../components/UserForm";

const Register = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white p-6 rounded-xl shadow-md w-full max-w-2xl">
        <h2 className="text-2xl font-bold text-center mb-6">Register a New Member</h2>
        <UserForm />
      </div>
    </div>
  );
};

export default Register;
