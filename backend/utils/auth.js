const jwt = require('jsonwebtoken')

const TOKEN_EXPIRES_IN = '7d'

const getJwtSecret = () => {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET is not configured')
  }
  return process.env.JWT_SECRET
}

const createToken = (user) => {
  return jwt.sign(
    { userId: user._id, email: user.email, role: user.role },
    getJwtSecret(),
    { expiresIn: TOKEN_EXPIRES_IN }
  )
}

const toAuthUser = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
  status: user.status
})

module.exports = {
  createToken,
  toAuthUser
}
