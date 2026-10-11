const User = require('../models/User')
const { createToken, toAuthUser } = require('../utils/auth')

const normalizeEmail = (email = '') => email.trim().toLowerCase()

const isValidEmail = (email) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

const register = async (req, res) => {
  try {
    const name = String(req.body.name || '').trim()
    const email = normalizeEmail(req.body.email)
    const password = String(req.body.password || '')

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email and password are required' })
    }

    if (!isValidEmail(email)) {
      return res.status(400).json({ message: 'Please enter a valid email address' })
    }

    if (password.length < 8) {
      return res.status(400).json({ message: 'Password must be at least 8 characters long' })
    }

    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return res.status(409).json({ message: 'Email already registered' })
    }

    const user = new User({ name, email, password })
    await user.save()

    const token = createToken(user)

    res.status(201).json({
      message: 'User registered successfully',
      user: toAuthUser(user),
      token
    })
  } catch (error) {
    if (error.message === 'JWT_SECRET is not configured') {
      return res.status(500).json({ message: 'Authentication is not configured' })
    }
    res.status(500).json({ message: 'Server error' })
  }
}

const login = async (req, res) => {
  try {
    const email = normalizeEmail(req.body.email)
    const password = String(req.body.password || '')

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' })
    }

    const user = await User.findOne({ email })
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' })
    }

    const isPasswordValid = await user.comparePassword(password)
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid email or password' })
    }

    if (user.status && user.status !== 'active') {
      return res.status(403).json({ message: 'Your account is not active' })
    }

    const token = createToken(user)

    res.status(200).json({
      message: 'Login successful',
      user: toAuthUser(user),
      token
    })
  } catch (error) {
    if (error.message === 'JWT_SECRET is not configured') {
      return res.status(500).json({ message: 'Authentication is not configured' })
    }
    res.status(500).json({ message: 'Server error' })
  }
}

const profile = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-password')
    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }
    res.status(200).json({ user: toAuthUser(user) })
  } catch (error) {
    res.status(500).json({ message: 'Server error' })
  }
}

module.exports = { register, login, profile }
