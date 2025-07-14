const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');

const {
  createUser,
  getAllUsers,
  getUserById,
  deleteUser,
  applyForService,
  updateUser,
  updateServiceStatus
} = require('../controllers/userController');

// Multer config
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../uploads'));
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + file.originalname;
    cb(null, uniqueSuffix);
  },
});

const upload = multer({ storage });

// ✅ Create User
router.post(
  '/',
  upload.fields([
    { name: 'photo', maxCount: 1 },
    { name: 'document', maxCount: 1 },
  ]),
  createUser
);

// ✅ Get All Users
router.get('/', getAllUsers);

// ✅ Get User by ID
router.get('/:id', getUserById);

// ✅ Delete User
router.delete('/:id', deleteUser);

// ✅ Update User
router.put(
  '/:id',
  upload.fields([
    { name: 'photo', maxCount: 1 },
    { name: 'document', maxCount: 1 },
  ]),
  updateUser
);

// ✅ Apply for a Service (user-specific)
router.post('/:id/apply-service', applyForService);

// ✅ Update Service Status (admin-specific)
router.post('/update-service-status', updateServiceStatus);

module.exports = router;
