import React, { useState, useEffect } from "react";
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

const EditUserForm = ({ userId }) => {
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
  const [isLoading, setIsLoading] = useState(false);
  const [photoPreview, setPhotoPreview] = useState(null);

  useEffect(() => {
    // Fetch user data from backend
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
    } catch (error) {
      alert("Update failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    alert("Navigate back to admin panel");
  };

  return (
    <form onSubmit={handleSubmit} className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-8 px-4">
      {/* form UI same as before */}
      {/* Copy form layout you already have here */}
    </form>
  );
};

export default EditUserForm;