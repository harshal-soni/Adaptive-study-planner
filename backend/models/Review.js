const mongoose = require('mongoose')

// Review model stores student review records for admin management.
const reviewSchema = new mongoose.Schema({
  studentName: { type: String, required: true },
  email: { type: String, required: true },
  course: { type: String, required: true },
  review: { type: String, required: true },
  rating: { type: Number, default: 5, min: 1, max: 5 },
  status: {
    type: String,
    enum: ['published', 'pending', 'archived'],
    default: 'published'
  },
  createdAt: { type: Date, default: Date.now }
})

module.exports = mongoose.model('Review', reviewSchema)
