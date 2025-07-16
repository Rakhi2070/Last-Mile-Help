// controllers/adminController.js

const Admin = require("../models/Admin");
const bcrypt = require("bcryptjs");

// ✅ Register admin
const registerAdmin = async (req, res) => {
  console.log("🛂 Admin Register Request Body:", req.body);
  try {
    const { email, password } = req.body;

    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return res.status(400).json({ message: "Admin already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newAdmin = new Admin({ email, password: hashedPassword });
    await newAdmin.save();

    res.status(201).json({ message: "Admin registered successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ Login admin
const loginAdmin = async (req, res) => {
  console.log("📥 Login Request Body:", req.body); // Add this line

  const { email, password } = req.body;

  try {
    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(400).json({ message: "Admin not found" });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    res.status(200).json({ token: "secureadmintoken" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { registerAdmin, loginAdmin };
