// config/db.js - Connect to MongoDB Atlas with diagnostics
const mongoose = require('mongoose')
const dns = require('dns')
const { URL } = require('url')

// Helper to attempt SRV lookup for informative errors
const checkSrv = (uri) => {
  try {
    if (!uri.startsWith('mongodb+srv://')) return Promise.resolve(null)
    const hostPart = uri.split('@')[1]
    const host = hostPart ? hostPart.split('/')[0] : null
    if (!host) return Promise.resolve(null)
    const srvName = `_mongodb._tcp.${host}`
    return new Promise((resolve, reject) => {
      dns.resolveSrv(srvName, (err, records) => {
        if (err) return reject(err)
        resolve(records || [])
      })
    })
  } catch (e) {
    return Promise.reject(e)
  }
}

// This function connects to MongoDB
const connectDB = async () => {
  const uri = process.env.MONGO_URI
  if (!uri) {
    console.error('✗ MongoDB connection failed: MONGO_URI is not set')
    process.exit(1)
  }

  // Quick helpful log without exposing credentials when possible
  try {
    const u = new URL(uri)
    console.log('Connecting to MongoDB host:', u.host)
  } catch (e) {
    console.log('Connecting to MongoDB (unable to parse host for display)')
  }

  // If using mongodb+srv, attempt an SRV DNS lookup and log results
  if (uri.startsWith('mongodb+srv://')) {
    try {
      const records = await checkSrv(uri)
      if (!records || records.length === 0) {
        console.warn('! SRV lookup returned no records. This usually means DNS/SRV resolution failed or the Atlas host is incorrect.')
      } else {
        console.log('✓ SRV records found for cluster host:')
        records.forEach(r => console.log(`  - ${r.name}:${r.port}`))
      }
    } catch (err) {
      console.error('✗ SRV DNS lookup failed:', err.code || err.message || err)
      console.error('  -> Check DNS, corporate VPN/firewall, or use a standard connection string instead of mongodb+srv.')
    }
  }

  try {
    // Use a short server selection timeout to fail fast
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 10000
    })
    console.log('✓ MongoDB connected successfully')
  } catch (error) {
    // Provide more detailed logging to aid troubleshooting
    console.error('✗ MongoDB connection failed:', error.message || error)
    if (error && error.name) console.error('Error name:', error.name)
    if (error && error.code) console.error('Error code:', error.code)
    console.error('Full error:', error)
    process.exit(1)
  }
}

module.exports = connectDB
