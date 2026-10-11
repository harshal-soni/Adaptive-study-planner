# Backend - Personalized Learning Recommendation System

## 📋 Overview

This is a **Node.js + Express** backend with **MongoDB** for authentication. It handles user registration, login, and provides protected routes.

### Tech Stack
- **Node.js** - JavaScript runtime
- **Express** - Web framework
- **MongoDB** - Database (Atlas cloud)
- **Mongoose** - MongoDB object modeling
- **JWT** - Secure authentication tokens
- **bcryptjs** - Password hashing

---

## 📁 Folder Structure

```
backend/
├── config/
│   └── db.js              # MongoDB connection setup
├── models/
│   └── User.js            # User database schema
├── middleware/
│   └── auth.js            # JWT token verification
├── routes/
│   └── auth.js            # Register, Login, Profile routes
├── server.js              # Main Express server
├── .env                   # Environment variables
└── package.json           # Project dependencies
```S

### What Each File Does:

**config/db.js** - Connects to MongoDB when server starts
- Reads `MONGODB_URI` from .env
- Shows success/error messages

**models/User.js** - Defines user data structure
- Email (required, unique)
- Password (hashed using bcryptjs)
- CreatedAt (automatic timestamp)
- Has methods to hash and compare passwords

**middleware/auth.js** - Protects routes
- Checks for valid JWT token in request
- Extracts user info from token
- Blocks requests without token or with invalid token

**routes/auth.js** - API endpoints
- `/register` - Create new user account
- `/login` - Get JWT token
- `/profile` - Get user info (protected route)

**server.js** - Starts the server
- Sets up Express app
- Enables CORS (for frontend communication)
- Connects all routes
- Listens on port 5000

---

## 🔧 Setup Instructions

### Step 1: Create MongoDB Atlas Account & Get Connection String

1. Go to https://www.mongodb.com/cloud/atlas
2. Sign up for free account
3. Create a new project
4. Create a free cluster
5. Get connection string (looks like: `mongodb+srv://username:password@cluster.mongodb.net/dbname`)

### Step 2: Update .env File

Open `backend/.env` and replace:
```env
MONGODB_URI=mongodb+srv://YOUR_USERNAME:YOUR_PASSWORD@cluster.mongodb.net/plrs_db?retryWrites=true&w=majority
JWT_SECRET=your_super_secret_key_here_use_something_random_like_xyz123abc
PORT=5000
NODE_ENV=development
```

**Important:** 
- Replace `YOUR_USERNAME` and `YOUR_PASSWORD` with your MongoDB credentials
- Use a strong random string for `JWT_SECRET` (e.g., generate one online)
- Never commit `.env` to git!

### Step 3: Start the Server

Navigate to backend folder and run:

```bash
cd backend
npm start
```

You should see:
```
✓ MongoDB connected successfully
✓ Server running on http://localhost:5000
✓ API endpoints:
  - POST   http://localhost:5000/api/auth/register
  - POST   http://localhost:5000/api/auth/login
  - GET    http://localhost:5000/api/auth/profile (protected)
  - GET    http://localhost:5000/api/health
```

---

## 🧪 Testing the API

You can test using **curl**, **Postman**, or your frontend.

### 1. Check Server Health

```bash
curl http://localhost:5000/api/health
```

Expected response:
```json
{"message":"Server is running ✓"}
```

### 2. Register a New User

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

Expected response:
```json
{
  "message": "User registered successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "email": "test@example.com"
  }
}
```

**Save the token** - you'll need it for protected routes!

### 3. Login with Email & Password

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

Expected response: (same format as register, returns a new token)

### 4. Access Protected Route

Use the token from register/login response:

```bash
curl http://localhost:5000/api/auth/profile \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

Replace `YOUR_TOKEN_HERE` with the actual token.

Expected response:
```json
{
  "user": {
    "_id": "507f1f77bcf86cd799439011",
    "email": "test@example.com",
    "createdAt": "2026-05-22T10:20:00.000Z"
  }
}
```

---

## 🔐 Security Features Explained

### Password Hashing with bcryptjs
```
Original password: "password123"
Hashed password:   "$2a$10$X5Y6Z7A8B9C0D1E2F3G4H5I6J7K8L9M..."
```
- One-way encryption (cannot reverse)
- Each hash is unique even for same password
- Takes ~0.1 seconds (slow on purpose to prevent brute force)

### JWT Authentication
```
Header: "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."

Token contains:
- userId (who you are)
- email (user email)
- exp (when token expires - 7 days)
```
- Token is verified on every protected route
- Invalid/expired tokens are rejected
- Server secret key ensures tokens can't be forged

---

## 📌 How Authentication Works (Step by Step)

### Registration:
1. User sends email + password
2. Check if email already exists
3. Hash password with bcryptjs
4. Save user to MongoDB
5. Create JWT token (expires in 7 days)
6. Return token to user

### Login:
1. User sends email + password
2. Find user by email in database
3. Compare entered password with hashed password
4. If match: create JWT token
5. If no match: return error

### Protected Routes:
1. User sends request with token in header
2. Middleware checks if token exists
3. Verify token with secret key
4. If valid: allow access to route
5. If invalid: return 401 error

---

## 🚀 Next Steps

### For Production:
- [ ] Use strong JWT_SECRET (use online generator)
- [ ] Set `NODE_ENV=production`
- [ ] Add rate limiting (prevent brute force)
- [ ] Add email verification
- [ ] Add refresh tokens (tokens that create new tokens)
- [ ] Add password reset functionality
- [ ] Use HTTPS (not HTTP)

### Connect Frontend:
Replace `http://localhost:5000` with actual backend URL in frontend API calls

Example in React:
```javascript
const register = async (email, password) => {
  const response = await fetch('http://localhost:5000/api/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  })
  return response.json()
}
```

---

## 🐛 Common Issues & Fixes

### "Cannot connect to MongoDB"
- Check `MONGODB_URI` in .env
- Verify credentials are correct
- Make sure IP is whitelisted in MongoDB Atlas

### "Token invalid or expired"
- Token expires after 7 days
- User needs to login again to get new token
- Check token format in Authorization header: `Bearer <token>`

### "Server won't start"
- Make sure port 5000 is not in use
- Check if dependencies are installed: `npm install`
- Check .env file exists and has `MONGODB_URI`

### "Email already registered"
- Try different email or
- Delete user from MongoDB Atlas and try again

---

## 📚 Learning Resources

- **Express.js**: https://expressjs.com/
- **MongoDB**: https://docs.mongodb.com/
- **JWT**: https://jwt.io/
- **bcryptjs**: https://www.npmjs.com/package/bcryptjs
- **Mongoose**: https://mongoosejs.com/

---

## 📝 API Summary

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | /api/auth/register | ❌ | Create new user |
| POST | /api/auth/login | ❌ | Get JWT token |
| GET | /api/auth/profile | ✅ | Get user profile |
| GET | /api/health | ❌ | Check server health |

✅ = Requires JWT token in Authorization header
❌ = No authentication needed

---

## 🎯 Code Comments Explained

All code files have detailed comments explaining what each part does. Read the comments if you want to understand how authentication works!

---

Good luck building your Personalized Learning Recommendation System! 🚀
