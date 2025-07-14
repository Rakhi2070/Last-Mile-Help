// controllers/userController.js

const fs = require("fs");
const path = require("path");
const User = require("../models/User");

// ✅ CREATE USER
const createUser = async (req, res) => {
  try {
    const { name, email, phone, address, gender, age } = req.body;

    // ✅ Parse servicesApplied safely
    let parsedServices = [];
    if (req.body.servicesApplied) {
      try {
        parsedServices = JSON.parse(req.body.servicesApplied);
      } catch (parseError) {
        return res.status(400).json({ message: "Invalid services format" });
      }
    }

    // ✅ Duplicate email check
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      // Delete uploaded files if duplicate
      if (req.files?.photo) fs.unlinkSync(path.join(__dirname, "../uploads", req.files.photo[0].filename));
      if (req.files?.document) fs.unlinkSync(path.join(__dirname, "../uploads", req.files.document[0].filename));
      return res.status(400).json({ message: "User with this email already exists" });
    }

    const newUser = new User({
      name,
      email,
      phone,
      address,
      gender,
      age,
      photo: req.files.photo[0].filename,
      document: req.files.document[0].filename,
      servicesApplied: parsedServices,
    });

    const savedUser = await newUser.save();
    res.status(201).json(savedUser);
  } catch (error) {
    console.error("Error in createUser:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ GET ALL USERS
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: "Error fetching users" });
  }
};

// ✅ GET USER BY ID
const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Error fetching user" });
  }
};

// ✅ DELETE USER + FILES
const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const photoPath = path.join(__dirname, "../uploads", user.photo);
    const documentPath = path.join(__dirname, "../uploads", user.document);

    if (fs.existsSync(photoPath)) fs.unlinkSync(photoPath);
    if (fs.existsSync(documentPath)) fs.unlinkSync(documentPath);

    res.json({ message: "User and files deleted successfully" });
  } catch (error) {
    console.error("Delete error:", error);
    res.status(500).json({ message: "Failed to delete user" });
  }
};

// ✅ UPDATE USER (with optional file updates)
const updateUser = async (req, res) => {
  try {
    const { name, email, phone, address, gender, age } = req.body;
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.name = name;
    user.email = email;
    user.phone = phone;
    user.address = address;
    user.gender = gender;
    user.age = age;

    if (req.files?.photo) {
      fs.unlinkSync(path.join(__dirname, "../uploads", user.photo));
      user.photo = req.files.photo[0].filename;
    }

    if (req.files?.document) {
      fs.unlinkSync(path.join(__dirname, "../uploads", user.document));
      user.document = req.files.document[0].filename;
    }

    await user.save();
    res.json(user);
  } catch (error) {
    console.error("Update error:", error);
    res.status(500).json({ message: "Failed to update user" });
  }
};

// ✅ APPLY FOR A SERVICE (post-registration)
const applyForService = async (req, res) => {
  try {
    const { serviceType } = req.body;
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (!user.servicesApplied) user.servicesApplied = [];

    const alreadyApplied = user.servicesApplied.find((s) => s.type === serviceType);
    if (alreadyApplied) {
      return res.status(400).json({ message: "Already applied for this service" });
    }

    user.servicesApplied.push({
      type: serviceType,
      appliedAt: new Date(),
      status: "Pending",
    });

    await user.save();
    res.status(200).json({ message: "Service application submitted successfully" });
  } catch (err) {
    console.error("Apply Service Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ UPDATE Service Status by Admin
const updateServiceStatus = async (req, res) => {
  const { userId, serviceType, newStatus } = req.body;

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const service = user.servicesApplied.find((s) => s.type === serviceType);
    if (!service) return res.status(404).json({ message: "Service not found" });

    service.status = newStatus;

    await user.save();
    res.status(200).json({ message: "Service status updated", updated: service });
  } catch (err) {
    console.error("Service Status Update Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};


module.exports = {
  createUser,
  getAllUsers,
  getUserById,
  deleteUser,
  updateUser,
  applyForService,
  updateServiceStatus, // ← add this
};
