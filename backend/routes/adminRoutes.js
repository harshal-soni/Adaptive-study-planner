const express = require('express')
const router = express.Router()
const adminController = require('../controllers/adminController')
const authMiddleware = require('../middleware/authMiddleware')
const adminMiddleware = require('../middleware/adminMiddleware')

router.post('/login', adminController.adminLogin)

router.use(authMiddleware)
router.use(adminMiddleware)

router.get('/users', adminController.getUsers)
router.put('/users/:id', adminController.updateUser)
router.delete('/users/:id', adminController.deleteUser)

router.get('/plans', adminController.getPlans)

router.get('/reviews', adminController.getReviews)
router.put('/reviews/:id', adminController.updateReview)
router.delete('/reviews/:id', adminController.deleteReview)

router.get('/analytics', adminController.getAnalytics)
router.get('/analytics/recent', adminController.getRecentActivity)

router.get('/resources', adminController.getResources)
router.post('/resources', adminController.addResource)
router.put('/resources/:id', adminController.updateResource)
router.delete('/resources/:id', adminController.deleteResource)

module.exports = router
