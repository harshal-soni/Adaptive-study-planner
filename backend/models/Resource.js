const mongoose = require('mongoose')

// Resource model stores learning materials that admins can manage.
const resourceSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  subject: { type: String, required: true },
  level: { type: String, default: 'All levels' },
  link: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now }
})

module.exports = mongoose.model('Resource', resourceSchema)
