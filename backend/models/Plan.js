// models/Plan.js - Define how adaptive study plans are stored in MongoDB
const mongoose = require('mongoose')

// Define the structure of a plan document in MongoDB
const planSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  student: {
    type: String,
    required: true
  },
  goal: {
    type: String,
    required: true
  },
  skillLevel: {
    type: String,
    enum: ['Beginner', 'Intermediate', 'Advanced'],
    default: 'Beginner'
  },
  dailyHours: {
    type: Number,
    required: true,
    min: 1,
    max: 12
  },
  weakSubjects: [{
    type: String
  }],
  strongSubjects: [{
    type: String
  }],
  dailySchedule: [{
    type: String
  }],
  recommendations: [{
    type: String
  }],
  weeklyGoals: [{
    type: String
  }],
  practiceTasks: [{
    type: String
  }],
  revisionPlan: [{
    type: String
  }],
  productivityTips: [{
    type: String
  }],
  studyStreakSuggestion: {
    goal: String,
    benefit: String,
    tip: String
  },
  motivationTip: {
    type: String
  },
  generatedAt: {
    type: Date,
    default: Date.now
  },
  createdAt: {
    type: Date,
    default: Date.now,
    index: true
  }
})

// Create index for efficient querying
planSchema.index({ userId: 1, createdAt: -1 })

// Create and export the Plan model
module.exports = mongoose.model('Plan', planSchema)
