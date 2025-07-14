import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const EditUserForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
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

  const [existingPhoto, setExistingPhoto] = useState(null);
  const [existingDoc, setExistingDoc] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/users/${id}`);
        const user = res.data;
        setFormData({
          name: user.name,
          email: user.email,
          phone: user.phone,
          address: user.address,
          gender: user.gender,
          age: user.age,
          photo: null,
          document: null,
        });
        setExistingPhoto(user.photo);
        setExistingDoc(user.document);
      } catch (err) {
        toast.error("Failed to fetch user");
      }
    };
    fetchUser();
  }, [id]);

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

    for (let key in formData) {
      if (formData[key]) {
        form.append(key, formData[key]);
      }
    }

    try {
      await axios.put(`http://localhost:5000/api/users/${id}`, form, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success("User updated successfully!");
      navigate("/admin");
    } catch (error) {
      console.error("Update failed:", error);
      toast.error("Failed to update user");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded shadow-md w-full max-w-lg space-y-4"
      >
        <h2 className="text-2xl font-bold text-center">Edit User</h2>

        <input
          type="text"
          name="name"
          placeholder="Full Name"
          value={formData.name}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />

        <input
          type="tel"
          name="phone"
          placeholder="Phone"
          value={formData.phone}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />

        <input
          type="text"
          name="address"
          placeholder="Address"
          value={formData.address}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />

        <select
          name="gender"
          value={formData.gender}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        >
          <option value="">Select Gender</option>
          <option value="Female">Female</option>
          <option value="Male">Male</option>
          <option value="Other">Other</option>
        </select>

        <input
          type="number"
          name="age"
          placeholder="Age"
          value={formData.age}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />

        <div>
          <label className="block font-semibold mb-1">Photo:</label>
          <input
            type="file"
            name="photo"
            accept="image/*"
            onChange={handleChange}
          />
          {existingPhoto && (
            <p className="text-xs mt-1 text-gray-500">Current: {existingPhoto}</p>
          )}
        </div>

        <div>
          <label className="block font-semibold mb-1">Document:</label>
          <input
            type="file"
            name="document"
            accept=".pdf,.jpg,.jpeg,.png"
            onChange={handleChange}
          />
          {existingDoc && (
            <p className="text-xs mt-1 text-gray-500">Current: {existingDoc}</p>
          )}
        </div>

        <button
          type="submit"
          className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
        >
          Update
        </button>
      </form>
    </div>
  );
};

export default EditUserForm;
