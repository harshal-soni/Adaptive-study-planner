const User = require('../models/User')
const Review = require('../models/Review')
const Resource = require('../models/Resource')
const { createToken, toAuthUser } = require('../utils/auth')

const adminLogin = async (req, res) => {
  try {
    const email = String(req.body.email || '').trim().toLowerCase()
    const password = String(req.body.password || '')
    if (!email || !password) {
      return res.status(400).json({ message: 'Admin email and password are required' })
    }

    const adminUser = await User.findOne({ email, role: 'admin' })
    if (!adminUser) {
      return res.status(401).json({ message: 'Invalid admin credentials' })
    }

    const isPasswordValid = await adminUser.comparePassword(password)
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid admin credentials' })
    }

    if (adminUser.status && adminUser.status !== 'active') {
      return res.status(403).json({ message: 'Admin account is not active' })
    }

    const token = createToken(adminUser)
    res.status(200).json({
      message: 'Admin login successful',
      token,
      user: toAuthUser(adminUser)
    })
  } catch (error) {
    if (error.message === 'JWT_SECRET is not configured') {
      return res.status(500).json({ message: 'Authentication is not configured' })
    }
    res.status(500).json({ message: 'Server error' })
  }
}

const getUsers = async (req, res) => {
  try {
    const users = await User.find({ role: { $ne: 'admin' } })
      .select('-password')
      .sort({ createdAt: -1 })

    res.json({ users })
  } catch (error) {
    res.status(500).json({ message: 'Unable to fetch users', error: error.message })
  }
}

const updateUser = async (req, res) => {
  try {
    const { id } = req.params
    const { name, email, status, streak } = req.body

    const updates = {}
    if (name) updates.name = name
    if (email) updates.email = email.toLowerCase().trim()
    if (status) updates.status = status
    if (typeof streak === 'number') {
      updates['progressData.streak'] = streak
    }

    const user = await User.findByIdAndUpdate(id, updates, { new: true }).select('-password')
    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    res.json({ message: 'User updated', user })
  } catch (error) {
    res.status(500).json({ message: 'Unable to update user', error: error.message })
  }
}

const deleteUser = async (req, res) => {
  try {
    const { id } = req.params
    const deleted = await User.findByIdAndDelete(id)
    if (!deleted) {
      return res.status(404).json({ message: 'User not found' })
    }
    res.json({ message: 'User deleted' })
  } catch (error) {
    res.status(500).json({ message: 'Unable to delete user', error: error.message })
  }
}

const getPlans = async (req, res) => {
  try {
    const users = await User.find({ role: { $ne: 'admin' } }).select('name email adaptivePlans')
    const plans = users.flatMap((user) => {
      return (user.adaptivePlans || []).map((plan) => ({
        ...plan.toObject(),
        studentName: user.name,
        studentEmail: user.email
      }))
    })

    res.json({ plans: plans.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)) })
  } catch (error) {
    res.status(500).json({ message: 'Unable to fetch plans', error: error.message })
  }
}

const getAnalytics = async (req, res) => {
  try {
    const totalUsersPromise = User.countDocuments({ role: { $ne: 'admin' } })
    const totalReviewsPromise = Review.countDocuments()
    const totalResourcesPromise = Resource.countDocuments()
    const activeStudentsPromise = User.countDocuments({ role: { $ne: 'admin' }, 'progressData.studyHours': { $gt: 0 } })

    const [totalUsers, totalReviews, totalResources, activeStudents] = await Promise.all([
      totalUsersPromise,
      totalReviewsPromise,
      totalResourcesPromise,
      activeStudentsPromise
    ])

    const planCounts = await User.aggregate([
      { $match: { role: { $ne: 'admin' } } },
      { $project: { adaptivePlans: { $ifNull: ['$adaptivePlans', []] } } },
      { $project: { planCount: { $size: '$adaptivePlans' } } },
      { $group: { _id: null, totalPlans: { $sum: '$planCount' } } }
    ])

    const totalPlans = planCounts[0]?.totalPlans || 0

    const subjectAggregation = await User.aggregate([
      { $match: { role: { $ne: 'admin' } } },
      { $unwind: { path: '$adaptivePlans', preserveNullAndEmptyArrays: true } },
      { $group: { _id: '$adaptivePlans.goal', count: { $sum: { $cond: [{ $ifNull: ['$adaptivePlans', false] }, 1, 0] } } } }
    ])

    const categorizeSubject = (goal = '') => {
      const text = String(goal).toLowerCase()
      if (text.includes('math')) return 'Math'
      if (text.includes('science')) return 'Science'
      if (text.includes('code') || text.includes('program') || text.includes('computer')) return 'Coding'
      if (text.includes('history') || text.includes('language')) return 'Humanities'
      if (text.includes('design')) return 'Design'
      return 'General Learning'
    }

    const subjectCounts = subjectAggregation.reduce((acc, item) => {
      const subject = categorizeSubject(item._id)
      acc[subject] = (acc[subject] || 0) + item.count
      return acc
    }, {})

    const popularSubjects = Object.entries(subjectCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 6)
      .map(([subject, count]) => ({ subject, count }))

    const now = new Date()
    const monthLabels = Array.from({ length: 6 }).map((_, index) => {
      const date = new Date(now.getFullYear(), now.getMonth() - (5 - index), 1)
      return date.toLocaleDateString('en-US', { month: 'short' })
    })

    const userGrowthData = await User.aggregate([
      { $match: { role: { $ne: 'admin' } } },
      { $group: {
        _id: { year: { $year: '$createdAt' }, month: { $month: '$createdAt' } },
        count: { $sum: 1 }
      } },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ])

    const planGrowthData = await User.aggregate([
      { $match: { role: { $ne: 'admin' } } },
      { $unwind: { path: '$adaptivePlans', preserveNullAndEmptyArrays: true } },
      { $group: {
        _id: { year: { $year: '$adaptivePlans.createdAt' }, month: { $month: '$adaptivePlans.createdAt' } },
        count: { $sum: { $cond: [{ $ifNull: ['$adaptivePlans', false] }, 1, 0] } }
      } },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ])

    const buildMonthlySeries = (rawData) => {
      const series = monthLabels.map((label, index) => {
        const date = new Date(now.getFullYear(), now.getMonth() - (5 - index), 1)
        const year = date.getFullYear()
        const month = date.getMonth() + 1
        const row = rawData.find((item) => item._id.year === year && item._id.month === month)
        return { month: label, count: row?.count || 0 }
      })
      return series
    }

    const userGrowth = buildMonthlySeries(userGrowthData)
    const planGrowth = buildMonthlySeries(planGrowthData)

    const recentUsers = await User.find({ role: { $ne: 'admin' } })
      .sort({ createdAt: -1 })
      .limit(5)
      .select('name email createdAt')
      .lean()

    const recentPlans = await User.aggregate([
      { $match: { role: { $ne: 'admin' } } },
      { $unwind: '$adaptivePlans' },
      { $sort: { 'adaptivePlans.createdAt': -1 } },
      { $limit: 5 },
      { $project: {
        studentName: '$name',
        goal: '$adaptivePlans.goal',
        skillLevel: '$adaptivePlans.skillLevel',
        createdAt: '$adaptivePlans.createdAt'
      } }
    ])

    res.json({
      totalUsers,
      totalPlans,
      activeStudents,
      totalReviews,
      totalResources,
      popularSubjects,
      userGrowth,
      planGrowth,
      mostSelectedSubjects: popularSubjects,
      recentUsers,
      recentPlans
    })
  } catch (error) {
    res.status(500).json({ message: 'Unable to fetch analytics', error: error.message })
  }
}

const getRecentActivity = async (req, res) => {
  try {
    const recentUsers = await User.find({ role: { $ne: 'admin' } })
      .sort({ createdAt: -1 })
      .limit(5)
      .select('name email createdAt')
      .lean()

    const recentPlans = await User.aggregate([
      { $match: { role: { $ne: 'admin' } } },
      { $unwind: '$adaptivePlans' },
      { $sort: { 'adaptivePlans.createdAt': -1 } },
      { $limit: 5 },
      { $project: {
        studentName: '$name',
        goal: '$adaptivePlans.goal',
        skillLevel: '$adaptivePlans.skillLevel',
        createdAt: '$adaptivePlans.createdAt'
      } }
    ])

    res.json({ recentUsers, recentPlans })
  } catch (error) {
    res.status(500).json({ message: 'Unable to fetch recent activity', error: error.message })
  }
}

const getReviews = async (req, res) => {
  try {
    const reviews = await Review.find().sort({ createdAt: -1 })
    res.json({ reviews })
  } catch (error) {
    res.status(500).json({ message: 'Unable to fetch reviews', error: error.message })
  }
}

const updateReview = async (req, res) => {
  try {
    const { id } = req.params
    const { status } = req.body
    const review = await Review.findByIdAndUpdate(id, { status }, { new: true })
    if (!review) {
      return res.status(404).json({ message: 'Review not found' })
    }
    res.json({ message: 'Review updated', review })
  } catch (error) {
    res.status(500).json({ message: 'Unable to update review', error: error.message })
  }
}

const deleteReview = async (req, res) => {
  try {
    const { id } = req.params
    const deleted = await Review.findByIdAndDelete(id)
    if (!deleted) {
      return res.status(404).json({ message: 'Review not found' })
    }
    res.json({ message: 'Review deleted' })
  } catch (error) {
    res.status(500).json({ message: 'Unable to delete review', error: error.message })
  }
}

const getResources = async (req, res) => {
  try {
    const resources = await Resource.find().sort({ createdAt: -1 })
    res.json({ resources })
  } catch (error) {
    res.status(500).json({ message: 'Unable to fetch resources', error: error.message })
  }
}

const addResource = async (req, res) => {
  try {
    const { title, description, subject, level, link } = req.body
    if (!title || !description || !subject) {
      return res.status(400).json({ message: 'Title, description and subject are required' })
    }
    const resource = new Resource({ title, description, subject, level, link })
    await resource.save()
    res.status(201).json({ message: 'Resource added', resource })
  } catch (error) {
    res.status(500).json({ message: 'Unable to add resource', error: error.message })
  }
}

const updateResource = async (req, res) => {
  try {
    const { id } = req.params
    const { title, description, subject, level, link } = req.body
    const updates = { title, description, subject, level, link }
    Object.keys(updates).forEach((key) => updates[key] === undefined && delete updates[key])

    const resource = await Resource.findByIdAndUpdate(id, updates, { new: true })
    if (!resource) {
      return res.status(404).json({ message: 'Resource not found' })
    }
    res.json({ message: 'Resource updated', resource })
  } catch (error) {
    res.status(500).json({ message: 'Unable to update resource', error: error.message })
  }
}

const deleteResource = async (req, res) => {
  try {
    const { id } = req.params
    const deleted = await Resource.findByIdAndDelete(id)
    if (!deleted) {
      return res.status(404).json({ message: 'Resource not found' })
    }
    res.json({ message: 'Resource deleted' })
  } catch (error) {
    res.status(500).json({ message: 'Unable to delete resource', error: error.message })
  }
}

module.exports = {
  adminLogin,
  getUsers,
  updateUser,
  deleteUser,
  getPlans,
  getAnalytics,
  getRecentActivity,
  getReviews,
  updateReview,
  deleteReview,
  getResources,
  addResource,
  updateResource,
  deleteResource
}
