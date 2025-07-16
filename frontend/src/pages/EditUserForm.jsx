import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Upload,
  FileText,
  ArrowLeft,
  Save,
} from "lucide-react";
import { BASE_URL } from "../api";

const EditUserForm = () => {
  const { id: userId } = useParams();
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

  const [existingPhoto, setExistingPhoto] = useState("");
  const [existingDoc, setExistingDoc] = useState("");
  const [photoPreview, setPhotoPreview] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/api/users/${userId}`);
        setFormData({
          ...res.data,
          photo: null,
          document: null,
        });
        setExistingPhoto(res.data.photo || "");
        setExistingDoc(res.data.document || "");
      } catch (error) {
        alert("Failed to load user data");
      }
    };

    if (userId) fetchUser();
  }, [userId]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      setFormData({ ...formData, [name]: files[0] });

      if (name === "photo" && files[0]) {
        const reader = new FileReader();
        reader.onload = (e) => setPhotoPreview(e.target.result);
        reader.readAsDataURL(files[0]);
      }
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const data = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (value) data.append(key, value);
      });

      await axios.put(`${BASE_URL}/api/users/${userId}`, data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("User updated successfully!");
      navigate("/admin"); // ✅ Go back to dashboard
    } catch (error) {
      alert("Update failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-10 px-4">
      <div className="max-w-3xl mx-auto bg-white shadow-md rounded-lg p-6">
        <div className="flex items-center mb-6">
          <ArrowLeft
            className="w-6 h-6 text-gray-500 cursor-pointer"
            onClick={() => navigate("/admin")}
          />
          <h2 className="ml-3 text-2xl font-bold text-gray-800">
            Edit User: {formData.name}
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name */}
          <div>
            <label className="text-sm text-gray-600 flex items-center">
              <User className="w-4 h-4 mr-1" /> Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full mt-1 border border-gray-300 rounded-lg px-4 py-2"
              required
            />
          </div>

          {/* Email */}
          <div>
            <label className="text-sm text-gray-600 flex items-center">
              <Mail className="w-4 h-4 mr-1" /> Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full mt-1 border border-gray-300 rounded-lg px-4 py-2"
              required
            />
          </div>

          {/* Phone */}
          <div>
            <label className="text-sm text-gray-600 flex items-center">
              <Phone className="w-4 h-4 mr-1" /> Phone
            </label>
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full mt-1 border border-gray-300 rounded-lg px-4 py-2"
            />
          </div>

          {/* Address */}
          <div>
            <label className="text-sm text-gray-600 flex items-center">
              <MapPin className="w-4 h-4 mr-1" /> Address
            </label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              className="w-full mt-1 border border-gray-300 rounded-lg px-4 py-2"
            />
          </div>

          {/* Gender */}
          <div>
            <label className="text-sm text-gray-600">Gender</label>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className="w-full mt-1 border border-gray-300 rounded-lg px-4 py-2"
            >
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>

          {/* Age */}
          <div>
            <label className="text-sm text-gray-600 flex items-center">
              <Calendar className="w-4 h-4 mr-1" /> Age
            </label>
            <input
              type="number"
              name="age"
              value={formData.age}
              onChange={handleChange}
              className="w-full mt-1 border border-gray-300 rounded-lg px-4 py-2"
            />
          </div>

          {/* Existing Photo Preview */}
          {existingPhoto && (
            <div className="mb-2">
              <p className="text-sm text-gray-600">Existing Photo:</p>
              <img
                src={`${BASE_URL}/uploads/${existingPhoto}`}
                alt="Existing"
                className="h-24 rounded"
              />
            </div>
          )}

          {/* Upload New Photo */}
          <div>
            <label className="text-sm text-gray-600 flex items-center">
              <Upload className="w-4 h-4 mr-1" /> Upload New Photo
            </label>
            <input
              type="file"
              name="photo"
              onChange={handleChange}
              className="mt-1"
              accept="image/*"
            />
            {photoPreview && (
              <img
                src={photoPreview}
                alt="Preview"
                className="mt-2 h-24 rounded"
              />
            )}
          </div>

          {/* Existing Document */}
          {existingDoc && (
            <div className="mb-2">
              <p className="text-sm text-gray-600">Existing Document:</p>
              <a
                href={`${BASE_URL}/uploads/${existingDoc}`}
                target="_blank"
                rel="noreferrer"
                className="text-blue-600 underline"
              >
                View Document
              </a>
            </div>
          )}

          {/* Upload New Document */}
          <div>
            <label className="text-sm text-gray-600 flex items-center">
              <FileText className="w-4 h-4 mr-1" /> Upload New Document
            </label>
            <input
              type="file"
              name="document"
              onChange={handleChange}
              className="mt-1"
              accept=".pdf,.doc,.docx"
            />
          </div>

          {/* Submit Button */}
          <div className="text-right mt-6">
            <button
              type="submit"
              disabled={isLoading}
              className="inline-flex items-center bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
            >
              <Save className="w-4 h-4 mr-2" />
              {isLoading ? "Updating..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditUserForm;
