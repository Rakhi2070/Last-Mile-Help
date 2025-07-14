// src/components/UserForm.jsx

import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const UserForm = () => {
  const navigate = useNavigate();
  const [selectedServices, setSelectedServices] = useState([]);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    gender: "",
    age: "",
    photo: null,
    document: null,
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      setFormData({ ...formData, [name]: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const form = new FormData();

    // Append normal fields
    Object.entries(formData).forEach(([key, value]) => {
      form.append(key, value);
    });

    // Append servicesApplied array as stringified JSON
    const services = selectedServices.map((type) => ({
      type,
      status: "Pending",
      appliedAt: new Date().toISOString(),
    }));
    form.append("servicesApplied", JSON.stringify(services));

    try {
      const res = await axios.post("http://192.168.1.108:5000/api/users", form, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success("User registered successfully!");
      navigate(`/user/${res.data._id}`);
    } catch (error) {
      console.error("Error registering user:", error);
      if (error.response?.status === 400) {
        toast.error(error.response.data.message || "User already exists");
      } else {
        toast.error("Failed to register user");
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded shadow-md w-full max-w-lg space-y-4"
      >
        <h2 className="text-2xl font-bold text-center">Register User</h2>

        <input type="text" name="name" placeholder="Full Name" value={formData.name} onChange={handleChange} className="w-full p-2 border rounded" required />
        <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} className="w-full p-2 border rounded" required />
        <input type="tel" name="phone" placeholder="Phone" value={formData.phone} onChange={handleChange} className="w-full p-2 border rounded" required />
        <input type="text" name="address" placeholder="Address" value={formData.address} onChange={handleChange} className="w-full p-2 border rounded" required />

        <select name="gender" value={formData.gender} onChange={handleChange} className="w-full p-2 border rounded" required>
          <option value="">Select Gender</option>
          <option value="Female">Female</option>
          <option value="Male">Male</option>
          <option value="Other">Other</option>
        </select>

        <input type="number" name="age" placeholder="Age" value={formData.age} onChange={handleChange} className="w-full p-2 border rounded" required />

        <div>
          <label className="block font-semibold mb-1">Choose a Photo:</label>
          <input type="file" name="photo" accept="image/*" onChange={handleChange} required />
        </div>

        <div>
          <label className="block font-semibold mb-1">Upload Document:</label>
          <input type="file" name="document" accept=".pdf,.jpg,.jpeg,.png" onChange={handleChange} required />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Services Required:</label>
          <select
            multiple
            value={selectedServices}
            onChange={(e) => {
              const options = Array.from(e.target.selectedOptions).map((o) => o.value);
              setSelectedServices(options);
            }}
            className="w-full p-2 border rounded"
          >
            <option value="Ration">Ration</option>
            <option value="Shelter">Shelter</option>
            <option value="Healthcare">Healthcare</option>
            <option value="Job">Job</option>
          </select>
          <p className="text-xs text-gray-500 mt-1">Hold Ctrl (or Cmd) to select multiple</p>
        </div>

        <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
          Register
        </button>
      </form>
    </div>
  );
};

export default UserForm;
