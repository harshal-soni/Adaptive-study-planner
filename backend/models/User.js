// models/User.js - Define how user data is stored in MongoDB
const mongoose = require('mongoose')
const bcryptjs = require('bcryptjs')

// Define the structure of a user document in MongoDB
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,           // Name is required
    trim: true,
    minlength: 2
  },
  email: {
    type: String,
    required: true,           // Email is required
    unique: true,             // Each email can only be used once
    lowercase: true,          // Convert to lowercase before saving
    trim: true                // Remove whitespace
  },
  password: {
    type: String,
    required: true,           // Password is required
    minlength: 8              // Password must be at least 8 characters
  },
  adaptivePlans: [
    {
      goal: String,
      skillLevel: String,
      createdAt: {
        type: Date,
        default: Date.now
      }
    }
  ],
  savedRecommendations: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Recommendation'
    }
  ],
  savedResources: [
    {
      recommendationId: mongoose.Schema.Types.ObjectId,
      resourceId: String,
      title: String,
      url: String,
      savedAt: {
        type: Date,
        default: Date.now
      }
    }
  ],
  progressData: {
    studyHours: {
      type: Number,
      default: 0
    },
    completedTasks: {
      type: Number,
      default: 0
    },
    weakAreas: {
      type: [String],
      default: []
    },
    strongAreas: {
      type: [String],
      default: []
    },
    weeklyProgress: {
      type: Number,
      default: 0
    },
    consistency: {
      type: Number,
      default: 0
    },
    streak: {
      type: Number,
      default: 0
    }
  },
  status: {
    type: String,
    default: 'active'
  },
  role: {
    type: String,
    enum: ['student', 'admin'],
    default: 'student'
  },
  createdAt: {
    type: Date,
    default: Date.now         // Automatically set to current time
  }
})

// This function runs BEFORE saving a user to hash the password
userSchema.pre('save', async function() {
  // If password was not modified, skip hashing
  if (!this.isModified('password')) {
    return
  }

  const salt = await bcryptjs.genSalt(10)
  this.password = await bcryptjs.hash(this.password, salt)
})

// Add a method to compare passwords during login
userSchema.methods.comparePassword = async function(enteredPassword) {
  // Compare the entered password with the hashed password in database
  // Returns true if they match, false if they don't
  return await bcryptjs.compare(enteredPassword, this.password)
}

// Create and export the User model
module.exports = mongoose.model('User', userSchema)
