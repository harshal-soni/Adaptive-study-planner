// models/Recommendation.js - Store generated content recommendations and learning roadmaps
const mongoose = require('mongoose')

const recommendationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  subject: {
    type: String,
    enum: ['Math', 'Physics', 'Chemistry', 'Computer Science', 'Data Structures', 'Web Development', 'Machine Learning'],
    required: true
  },
  skillLevel: {
    type: String,
    enum: ['Beginner', 'Intermediate', 'Advanced'],
    required: true
  },
  preferredLearningTypes: [String],
  
  // Section 1: Recommended Resources
  resources: [
    {
      id: String,
      title: String,
      description: String,
      difficulty: String,
      type: {
        type: String,
        enum: ['Video', 'Notes', 'Practice Platform', 'Quiz']
      },
      url: String,
      duration: String,
      platform: String,
      rating: Number,
      savedToStudyPlan: {
        type: Boolean,
        default: false
      }
    }
  ],
  
  // Section 2: Personalized Learning Roadmap
  roadmap: {
    title: String,
    overview: String,
    weeks: [
      {
        weekNumber: Number,
        weekTitle: String,
        weeklyGoals: [String],
        topics: [String],
        recommendedResources: [String],
        practiceTasks: [String],
        estimatedHours: Number,
        milestones: [String]
      }
    ]
  },

  // Metadata
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

// Index for efficient querying
recommendationSchema.index({ userId: 1, createdAt: -1 })

module.exports = mongoose.model('Recommendation', recommendationSchema)
