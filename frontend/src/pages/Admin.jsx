import React, { useEffect, useState } from "react";
import axios from "axios";
import UserCard from "../components/UserCard";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Admin = () => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [genderFilter, setGenderFilter] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("adminToken");

    if (token !== "secureadmintoken") {
      toast.error("Access denied. Please login as admin.");
      navigate("/login");
      return;
    }

    fetchUsers();
  }, [navigate]);

  const fetchUsers = () => {
    axios
      .get('http://192.168.1.108:5000/api/users')
      .then((res) => setUsers(res.data))
      .catch((err) => console.error("Error fetching users:", err));
  };

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    toast.success("Logged out successfully");
    navigate("/login");
  };

  const handleDelete = async (userId) => {
    const confirm = window.confirm("Are you sure you want to delete this user?");
    if (!confirm) return;

    try {
      await axios.delete(`http://localhost:5000/api/users/${userId}`);
      toast.success("User deleted successfully!");
      fetchUsers(); // Refresh list
    } catch (error) {
      toast.error("Failed to delete user");
    }
  };

  const handleEdit = (userId) => {
    navigate(`/edit/${userId}`);
  };

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesGender = genderFilter === "" || user.gender === genderFilter;

    return matchesSearch && matchesGender;
  });

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {/* 🔐 Top Bar */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">All Registered Users</h2>
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
          Logout
        </button>
      </div>

      {/* 🔍 Search & Filter */}
      <div className="flex flex-col md:flex-row gap-4 mb-6 justify-center items-start md:items-end">
        <div className="flex flex-col w-full md:w-1/3">
          <label className="text-sm font-medium mb-1 text-gray-700">
            Search (Name or Email):
          </label>
          <input
            type="text"
            placeholder="Type here..."
            className="border p-2 rounded"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex flex-col w-full md:w-1/5">
          <label className="text-sm font-medium mb-1 text-gray-700">
            Filter by Gender:
          </label>
          <select
            className="border p-2 rounded"
            value={genderFilter}
            onChange={(e) => setGenderFilter(e.target.value)}
          >
            <option value="">All Genders</option>
            <option value="Female">Female</option>
            <option value="Male">Male</option>
            <option value="Other">Other</option>
          </select>
        </div>
      </div>

      {/* 📋 User List */}
      {filteredUsers.length === 0 ? (
        <p className="text-center">No users found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredUsers.map((user) => (
            <UserCard
              key={user._id}
              user={user}
              onDelete={handleDelete}
              onEdit={handleEdit}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Admin;
