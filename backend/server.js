require('dotenv').config()
const express = require('express')
const cors = require('cors')
const connectDB = require('./config/db')
const authRoutes = require('./routes/authRoutes')
const planRoutes = require('./routes/planRoutes')
const recommendationRoutes = require('./routes/recommendationRoutes')
const adminRoutes = require('./routes/adminRoutes')
const User = require('./models/User')

const app = express()

const ensureAdminUser = async () => {
  const adminEmail = process.env.ADMIN_EMAIL?.toLowerCase()
  const adminPassword = process.env.ADMIN_PASSWORD

  if (!adminEmail || !adminPassword) {
    console.log('Admin bootstrap skipped. Set ADMIN_EMAIL and ADMIN_PASSWORD to seed an admin account.')
    return
  }

  const existing = await User.findOne({ email: adminEmail, role: 'admin' })
  if (!existing) {
    const admin = new User({
      name: 'Admin',
      email: adminEmail,
      password: adminPassword,
      role: 'admin'
    })
    await admin.save()
    console.log('Admin user created:', adminEmail)
  }
}

connectDB().then(() => {
  ensureAdminUser().catch((error) => console.error('Admin setup failed:', error.message))
})

app.use(cors({ origin: ['http://localhost:5173', 'http://127.0.0.1:5173'], credentials: true }))
app.use(express.json())

app.use('/api/auth', authRoutes)
app.use('/api/admin', adminRoutes)
app.use('/api/recommendations', recommendationRoutes)
app.use('/', planRoutes)

app.get('/', (req, res) => {
  res.send('Backend running')
})

app.listen(5000, () => {
  console.log("Server running on port 5000");
});
