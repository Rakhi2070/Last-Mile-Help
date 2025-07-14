const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  phone: String,
  address: String,
  gender: {
    type: String,
    required: true,
  },
  age: {
    type: Number,
    required: true,
  },
  photo: {
    type: String,
    required: true,
  },
  document: {
    type: String,
    required: true,
  },

  // ✅ NEW: Services Applied by the User
  servicesApplied: [
    {
      type: {
        type: String, // e.g., "Ration", "Shelter", etc.
        required: true,
      },
      status: {
        type: String,
        enum: ['Pending', 'Approved', 'Rejected'],
        default: 'Pending',
      },
      appliedAt: {
        type: Date,
        default: Date.now,
      },
    }
  ]
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
