// routes/recommendationRoutes.js - Content recommendations and learning roadmaps
const express = require('express')
const router = express.Router()
const authMiddleware = require('../middleware/authMiddleware')
const Recommendation = require('../models/Recommendation')
const User = require('../models/User')
const { generateRecommendations, generateLearningRoadmap } = require('../controllers/recommendationController')

// POST /api/recommendations/generate - Generate and save recommendations
router.post('/generate', authMiddleware, async (req, res) => {
  try {
    const { subject, skillLevel, preferredLearningTypes } = req.body
    const userId = req.user.userId

    // Validate inputs
    if (!subject || !skillLevel) {
      return res.status(400).json({ success: false, error: 'Subject and skill level are required' })
    }

    const validSubjects = ['Math', 'Physics', 'Chemistry', 'Computer Science', 'Data Structures', 'Web Development', 'Machine Learning']
    const validLevels = ['Beginner', 'Intermediate', 'Advanced']

    if (!validSubjects.includes(subject) || !validLevels.includes(skillLevel)) {
      return res.status(400).json({ success: false, error: 'Invalid subject or skill level' })
    }

    // Generate recommendations and roadmap
    const resources = generateRecommendations(subject, skillLevel, preferredLearningTypes)
    const roadmap = generateLearningRoadmap(subject, skillLevel)

    // Create and save recommendation to MongoDB
    const recommendation = new Recommendation({
      userId,
      subject,
      skillLevel,
      preferredLearningTypes: preferredLearningTypes || [],
      resources,
      roadmap
    })

    await recommendation.save()

    // Add to user's saved recommendations
    await User.findByIdAndUpdate(
      userId,
      { $push: { savedRecommendations: recommendation._id } },
      { new: true }
    )

    res.status(201).json({
      success: true,
      recommendation: {
        _id: recommendation._id,
        subject,
        skillLevel,
        resources,
        roadmap
      }
    })
  } catch (error) {
    console.error('Recommendation generation error:', error.message)
    res.status(500).json({ success: false, error: error.message || 'Failed to generate recommendations' })
  }
})

// GET /api/recommendations - Get all user's saved recommendations
router.get('/', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.userId
    const recommendations = await Recommendation.find({ userId })
      .sort({ createdAt: -1 })
      .lean()

    res.json({
      success: true,
      recommendations,
      count: recommendations.length
    })
  } catch (error) {
    console.error('Error fetching recommendations:', error.message)
    res.status(500).json({ success: false, error: error.message || 'Failed to fetch recommendations' })
  }
})

// GET /api/recommendations/:id - Get specific recommendation
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.userId
    const recommendation = await Recommendation.findOne({
      _id: req.params.id,
      userId
    })

    if (!recommendation) {
      return res.status(404).json({ success: false, error: 'Recommendation not found' })
    }

    res.json({ success: true, recommendation })
  } catch (error) {
    console.error('Error fetching recommendation:', error.message)
    res.status(500).json({ success: false, error: error.message || 'Failed to fetch recommendation' })
  }
})

// DELETE /api/recommendations/:id - Delete recommendation
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.userId
    const recommendation = await Recommendation.findOneAndDelete({
      _id: req.params.id,
      userId
    })

    if (!recommendation) {
      return res.status(404).json({ success: false, error: 'Recommendation not found' })
    }

    // Remove from user's saved recommendations
    await User.findByIdAndUpdate(
      userId,
      { $pull: { savedRecommendations: req.params.id } },
      { new: true }
    )

    res.json({ success: true, message: 'Recommendation deleted' })
  } catch (error) {
    console.error('Error deleting recommendation:', error.message)
    res.status(500).json({ success: false, error: error.message || 'Failed to delete recommendation' })
  }
})

// POST /api/recommendations/:id/save-resource - Save resource to study plan
router.post('/:id/save-resource', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.userId
    const { resourceId, title, url } = req.body

    if (!resourceId || !title || !url) {
      return res.status(400).json({ success: false, error: 'Resource ID, title, and URL are required' })
    }

    // Verify recommendation belongs to user
    const recommendation = await Recommendation.findOne({
      _id: req.params.id,
      userId
    })

    if (!recommendation) {
      return res.status(404).json({ success: false, error: 'Recommendation not found' })
    }

    // Add resource to user's saved resources
    await User.findByIdAndUpdate(
      userId,
      {
        $push: {
          savedResources: {
            recommendationId: req.params.id,
            resourceId,
            title,
            url
          }
        }
      },
      { new: true }
    )

    // Mark resource as saved in recommendation
    await Recommendation.findByIdAndUpdate(
      req.params.id,
      { 'resources.$[elem].savedToStudyPlan': true },
      { arrayFilters: [{ 'elem.id': resourceId }], new: true }
    )

    res.json({ success: true, message: 'Resource saved to study plan' })
  } catch (error) {
    console.error('Error saving resource:', error.message)
    res.status(500).json({ success: false, error: error.message || 'Failed to save resource' })
  }
})

module.exports = router
