const jwt = require('jsonwebtoken')
const User = require('../models/User')

const getTokenFromHeader = (authHeader = '') => {
  if (!authHeader.startsWith('Bearer ')) {
    return null
  }
  return authHeader.split(' ')[1]
}

const authMiddleware = async (req, res, next) => {
  try {
    if (!process.env.JWT_SECRET) {
      return res.status(500).json({ message: 'Authentication is not configured' })
    }

    const token = getTokenFromHeader(req.headers.authorization || '')
    if (!token) {
      return res.status(401).json({ message: 'Authorization header missing or invalid' })
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    const user = await User.findById(decoded.userId).select('_id name email role status')

    if (!user) {
      return res.status(401).json({ message: 'User for this token no longer exists' })
    }

    if (user.status && user.status !== 'active') {
      return res.status(403).json({ message: 'Your account is not active' })
    }

    req.user = {
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
      name: user.name
    }
    next()
  } catch (error) {
    res.status(401).json({ message: 'Invalid or expired token' })
  }
}

const requireRole = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'You do not have permission to access this resource' })
    }
    next()
  }
}

module.exports = authMiddleware
module.exports.requireRole = requireRole
