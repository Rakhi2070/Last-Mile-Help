// src/pages/ServiceDashboard.jsx

import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const statusColors = {
  Pending: "bg-yellow-100 text-yellow-800",
  Approved: "bg-green-100 text-green-800",
  Rejected: "bg-red-100 text-red-800",
};

const ServiceDashboard = () => {
  const [users, setUsers] = useState([]);

  const fetchAllUsers = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/users");
      setUsers(res.data);
    } catch (err) {
      toast.error("Failed to fetch users");
    }
  };

  useEffect(() => {
    fetchAllUsers();
  }, []);

  const handleStatusChange = async (userId, serviceType, newStatus) => {
    try {
      await axios.post("http://localhost:5000/api/users/update-service-status", {
        userId,
        serviceType,
        newStatus,
      });
      toast.success("Status updated successfully!");
      fetchAllUsers(); // Refresh data
    } catch (err) {
      toast.error("Status update failed");
      console.error("Status update failed:", err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-6">
      <h1 className="text-4xl font-bold text-center text-gray-800 mb-10">
        Service Applications Dashboard
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {users.map((user) => (
          <div key={user._id} className="bg-white rounded-xl shadow-md p-6 border">
            <h2 className="text-xl font-semibold text-gray-800 mb-1">{user.name}</h2>
            <p className="text-sm text-gray-500 mb-1">{user.email}</p>
            <p className="text-sm text-gray-500 mb-3">{user.address}</p>

            <h3 className="text-md font-medium mb-2">Applied Services:</h3>

            {user.servicesApplied && user.servicesApplied.length > 0 ? (
              <ul className="space-y-2">
                {user.servicesApplied.map((service, index) => (
                  <li key={index} className="bg-gray-50 border rounded p-3">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-semibold text-gray-700">{service.type}</span>
                      <span className={`text-xs px-2 py-1 rounded-full ${statusColors[service.status]}`}>
                        {service.status}
                      </span>
                    </div>

                    <p className="text-xs text-gray-400 mb-1">
                      Applied at: {new Date(service.appliedAt).toLocaleString()}
                    </p>

                    <select
                      className="mt-1 w-full border p-1 rounded text-sm"
                      value={service.status}
                      onChange={(e) =>
                        handleStatusChange(user._id, service.type, e.target.value)
                      }
                    >
                      <option value="Pending">Pending</option>
                      <option value="Approved">Approved</option>
                      <option value="Rejected">Rejected</option>
                    </select>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-gray-500">No services applied.</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ServiceDashboard;
