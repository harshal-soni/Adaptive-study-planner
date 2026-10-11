const express = require('express')
const router = express.Router()
const authMiddleware = require('../middleware/authMiddleware')
const Plan = require('../models/Plan')
const User = require('../models/User')

const clampNumber = (value, min, max, fallback) => {
  const number = Number(value)
  return Number.isFinite(number) ? Math.max(min, Math.min(max, number)) : fallback
}

const splitSubjects = (value = '') => {
  return value
    .split(',')
    .map(item => item.trim())
    .filter(Boolean)
    .slice(0, 5)
}

const minutesLabel = (minutes) => {
  const hrs = Math.floor(minutes / 60)
  const mins = minutes % 60
  if (hrs && mins) return `${hrs}h ${mins}m`
  if (hrs) return `${hrs}h`
  return `${mins}m`
}

function generateDailySchedule(weakList, strongList, goal, skillLevel, hours) {
  const weakMinutes = Math.round(hours * (skillLevel === 'Advanced' ? 0.3 : skillLevel === 'Intermediate' ? 0.4 : 0.5) * 60)
  const strongMinutes = Math.round(hours * (skillLevel === 'Advanced' ? 0.4 : skillLevel === 'Intermediate' ? 0.3 : 0.2) * 60)
  const reviewMinutes = Math.max(15, Math.round(hours * 0.1 * 60))
  const weakPrimary = weakList[0] || 'core concepts'
  const weakSecondary = weakList[1] || 'related foundation'
  const strongPrimary = strongList[0] || 'strength-building material'

  const schedule = []

  schedule.push(`Day 1: ${minutesLabel(Math.max(30, Math.round(weakMinutes * 0.45)))} focused learning on ${weakPrimary}`)
  schedule.push(`Day 2: ${minutesLabel(Math.max(25, Math.round(weakMinutes * 0.35)))} problem practice for ${weakSecondary}`)
  schedule.push(`Day 3: ${minutesLabel(Math.max(25, Math.round(strongMinutes * 0.5)))} confidence-building work on ${strongPrimary}`)

  if (skillLevel === 'Advanced') {
    schedule.push(`Day 4: ${minutesLabel(30)} mock test or timed challenge related to ${goal}`)
    schedule.push(`Day 5: ${minutesLabel(reviewMinutes)} advanced review and error analysis`)
  } else if (skillLevel === 'Intermediate') {
    schedule.push(`Day 4: ${minutesLabel(30)} applied practice with real examples`)
    schedule.push(`Day 5: ${minutesLabel(reviewMinutes)} spaced review and revision`)
  } else {
    schedule.push(`Day 4: ${minutesLabel(30)} fundamentals review and concept mapping`)
    schedule.push(`Day 5: ${minutesLabel(reviewMinutes)} light revision and confidence-building recap`)
  }

  schedule.push(`Daily focus: ${minutesLabel(weakMinutes)} weak-topic study, ${minutesLabel(strongMinutes)} practice time, ${minutesLabel(reviewMinutes)} revision time`)

  return schedule
}

function generateRecommendations(weakList, strongList, goal, skillLevel) {
  const recommendations = [
    `Focus on ${weakList[0] || 'your weakest topic'} with concept mapping`,
    `Review ${weakList[1] || 'related content'} through active recall`,
    `Leverage ${strongList[0] || 'your strongest area'} to build confidence`,
    `Connect all learning back to your goal: ${goal}`
  ]

  if (skillLevel === 'Advanced') {
    recommendations.push('Schedule a weekly mock test to sharpen exam readiness')
  } else if (skillLevel === 'Intermediate') {
    recommendations.push('Alternate practice and review to strengthen retention')
  } else {
    recommendations.push('Keep sessions short and clear to build fundamentals first')
  }

  return recommendations
}

function generateWeeklyGoals(weakList, strongList, goal, skillLevel, hours) {
  const goals = [
    `Complete ${Math.min(3, Math.ceil(hours / 2))} key topics around ${weakList.slice(0, 2).join(' and ') || 'your weak areas'}`,
    `Improve ${skillLevel === 'Beginner' ? 'core understanding' : skillLevel === 'Intermediate' ? 'practice accuracy' : 'deep mastery'} for ${goal}`
  ]

  if (skillLevel === 'Advanced') {
    goals.push('Finish two mock-style sessions and analyze results')
  } else {
    goals.push('Review weak points daily and reduce mistakes each week')
  }

  goals.push(`Create one strong summary note or cheat sheet for ${goal}`)

  return goals
}

function generatePracticeTasks(weakList, strongList, goal) {
  return [
    `Practice ${weakList[0] || 'a weak area'} with targeted questions`,
    `Summarize ${strongList[0] || 'a strong subject'} in your own words`,
    `Build a quick revision note for ${goal}`
  ]
}

function generateRevisionPlan(skillLevel) {
  const revisionPlan = [
    'Day 1: Learn new concepts with clear examples',
    'Day 2: Practice and test your understanding',
    'Day 3: Review mistakes and reinforce recall'
  ]

  if (skillLevel === 'Advanced') {
    revisionPlan.push('Day 4: Simulate a timed exam', 'Day 5: Analyze errors and refine strategy')
  } else {
    revisionPlan.push('Day 4: Spaced repetition of key ideas', 'Day 5: Summarize progress and next steps')
  }

  return revisionPlan
}

function generateProductivityTips(skillLevel, hours) {
  const tips = [
    'Use Pomodoro-style focus blocks with short breaks',
    'Study during your most alert hours and avoid distractions',
    'Write active notes instead of passive highlighting',
    'Quiz yourself after each study session to reinforce memory'
  ]

  if (skillLevel === 'Beginner') {
    tips.push('Start with fundamentals and practice simple examples')
  } else if (skillLevel === 'Intermediate') {
    tips.push('Balance review with new practice to improve retention')
  } else {
    tips.push('Push for deeper problem solving and advanced challenges')
  }

  if (hours >= 4) {
    tips.push('Take a 15-minute reset after every two hours of study')
  }

  return tips
}

function generateStudyStreakSuggestion(hours, skillLevel) {
  const streakLength = Math.max(3, Math.min(7, Math.ceil(hours)))
  return {
    goal: `${streakLength}-day study streak`,
    benefit: skillLevel === 'Advanced'
      ? 'Builds momentum and exam readiness'
      : skillLevel === 'Intermediate'
        ? 'Strengthens consistency without burnout'
        : 'Creates a reliable learning routine',
    tip: skillLevel === 'Advanced'
      ? 'Track progress and refine your strategy every day'
      : skillLevel === 'Intermediate'
        ? 'Celebrate each study win to stay motivated'
        : 'Keep the streak short and steady to build habit'
  }
}

// Break timing generation removed — breaks are no longer part of plan output

function generateMotivationTip(skillLevel, goal, weakList) {
  const messages = [
    `Small progress each day compounds into mastery for ${goal}.`,
    `Every review of ${weakList[0] || 'weak topics'} makes you stronger.`,
    'Focus on consistency, not perfection.',
    'A steady study rhythm beats last-minute cramming.',
    'Your effort today builds the confidence you need tomorrow.'
  ]
  return messages[Math.floor(Math.random() * messages.length)]
}

function generateDashboardRecommendations(weakList, strongList, plans) {
  const resources = []

  if (weakList.length) {
    resources.push({
      title: `Strengthen ${weakList[0]} with targeted practice`,
      description: `Work through quick review questions and active recall for ${weakList[0]}.`
    })
  }

  if (strongList.length) {
    resources.push({
      title: `Leverage ${strongList[0]} for greater confidence`,
      description: `Use your strong skills in ${strongList[0]} to support faster learning across weak topics.`
    })
  }

  if (plans.length) {
    resources.push({
      title: 'Review your latest adaptive plan',
      description: 'Open the newest plan to follow the recommended daily routine and stay on track.'
    })
  }

  if (resources.length < 3) {
    resources.push({
      title: 'Try a focused study sprint',
      description: 'Spend 15 minutes on a single topic to build momentum and confidence.'
    })
  }

  return resources.slice(0, 3)
}

function generateRealisticPlan(name, goal, weakList, strongList, hours, skillLevel) {
  const dailySchedule = generateDailySchedule(weakList, strongList, goal, skillLevel, hours)
  const recommendations = generateRecommendations(weakList, strongList, goal, skillLevel)
  const weeklyGoals = generateWeeklyGoals(weakList, strongList, goal, skillLevel, hours)
  const practiceTasks = generatePracticeTasks(weakList, strongList, goal)
  const revisionPlan = generateRevisionPlan(skillLevel)
  const productivityTips = generateProductivityTips(skillLevel, hours)
  const studyStreakSuggestion = generateStudyStreakSuggestion(hours, skillLevel)
  const motivationTip = generateMotivationTip(skillLevel, goal, weakList)

  return {
    success: true,
    plan: {
      student: name,
      goal,
      skillLevel,
      dailyHours: hours,
      weakSubjects: weakList,
      strongSubjects: strongList,
      dailySchedule,
      recommendations,
      weeklyGoals,
      practiceTasks,
      revisionPlan,
      productivityTips,
      studyStreakSuggestion,
      motivationTip,
      generatedAt: new Date().toISOString()
    }
  }
}

router.post('/api/plans/generate', authMiddleware, async (req, res) => {
  try {
    let {
      name,
      goal,
      weakSubjects = '',
      strongSubjects = '',
      studyHours,
      dailyHours,
      skillLevel = 'Beginner'
    } = req.body

    if (!name || !goal) {
      return res.status(400).json({ success: false, error: 'Name and goal are required fields' })
    }

    const hours = clampNumber(studyHours || dailyHours || 2, 1, 12, 2)
    let weakList = splitSubjects(weakSubjects)
    const strongList = splitSubjects(strongSubjects)

    if (!weakList.length) {
      weakList = ['core concepts']
    }

    if (!['Beginner', 'Intermediate', 'Advanced'].includes(skillLevel)) {
      return res.status(400).json({ success: false, error: 'Invalid skill level' })
    }

    const result = generateRealisticPlan(name, goal, weakList, strongList, hours, skillLevel)

    // Save plan to MongoDB
    const plan = new Plan({
      userId: req.user.userId,
      student: name,
      goal: result.plan.goal,
      skillLevel: result.plan.skillLevel,
      dailyHours: result.plan.dailyHours,
      weakSubjects: result.plan.weakSubjects,
      strongSubjects: result.plan.strongSubjects,
      dailySchedule: result.plan.dailySchedule,
      recommendations: result.plan.recommendations,
      weeklyGoals: result.plan.weeklyGoals,
      practiceTasks: result.plan.practiceTasks,
      revisionPlan: result.plan.revisionPlan,
      productivityTips: result.plan.productivityTips,
      studyStreakSuggestion: result.plan.studyStreakSuggestion,
      motivationTip: result.plan.motivationTip
    })

    await plan.save()

    // Update user's adaptivePlans array with plan reference
    await User.findByIdAndUpdate(
      req.user.userId,
      {
        $push: {
          adaptivePlans: {
            _id: plan._id,
            goal: goal,
            skillLevel: skillLevel,
            createdAt: new Date()
          }
        }
      },
      { new: true }
    )

    return res.status(201).json({
      success: true,
      plan: {
        _id: plan._id,
        ...result.plan
      }
    })
  } catch (error) {
    console.error('Plan generation error:', error)
    return res.status(500).json({ success: false, error: 'Server error while generating plan' })
  }
})

// GET all user plans
router.get('/api/plans', authMiddleware, async (req, res) => {
  try {
    const plans = await Plan.find({ userId: req.user.userId })
      .sort({ createdAt: -1 })
      .select('-__v')

    return res.status(200).json({
      success: true,
      plans: plans,
      count: plans.length
    })
  } catch (error) {
    console.error('Error fetching plans:', error)
    return res.status(500).json({ success: false, error: 'Server error while fetching plans' })
  }
})

// GET dashboard summary for current user
router.get('/api/dashboard', authMiddleware, async (req, res) => {
  try {
    const [user, plans] = await Promise.all([
      User.findById(req.user.userId).select('name email progressData adaptivePlans'),
      Plan.find({ userId: req.user.userId }).sort({ createdAt: -1 }).select('-__v')
    ])

    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' })
    }

    const weakAreas = user.progressData?.weakAreas || []
    const strongAreas = user.progressData?.strongAreas || []
    const progress = {
      studyHours: user.progressData?.studyHours || 0,
      completedTasks: user.progressData?.completedTasks || 0,
      weeklyProgress: user.progressData?.weeklyProgress || 0,
      consistency: user.progressData?.consistency || 0,
      streak: user.progressData?.streak || 0,
      weakAreas,
      strongAreas
    }

    const recentActivity = plans.slice(0, 3).map(plan => ({
      id: plan._id,
      goal: plan.goal,
      skillLevel: plan.skillLevel,
      dailyHours: plan.dailyHours,
      createdAt: plan.createdAt,
      weakSubjects: plan.weakSubjects || []
    }))

    const recommendedResources = generateDashboardRecommendations(weakAreas, strongAreas, plans)

    return res.status(200).json({
      success: true,
      user: { name: user.name, email: user.email },
      progress,
      plans,
      totalPlans: plans.length,
      recentActivity,
      recommendedResources
    })
  } catch (error) {
    console.error('Error fetching dashboard data:', error)
    return res.status(500).json({ success: false, error: 'Server error while loading dashboard data' })
  }
})

// GET single plan by ID
router.get('/api/plans/:id', authMiddleware, async (req, res) => {
  try {
    const plan = await Plan.findOne({
      _id: req.params.id,
      userId: req.user.userId
    }).select('-__v')

    if (!plan) {
      return res.status(404).json({ success: false, error: 'Plan not found' })
    }

    return res.status(200).json({
      success: true,
      plan: plan
    })
  } catch (error) {
    console.error('Error fetching plan:', error)
    return res.status(500).json({ success: false, error: 'Server error while fetching plan' })
  }
})

// DELETE a plan
router.delete('/api/plans/:id', authMiddleware, async (req, res) => {
  try {
    const plan = await Plan.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.userId
    })

    if (!plan) {
      return res.status(404).json({ success: false, error: 'Plan not found' })
    }

    // Remove plan reference from user's adaptivePlans array
    await User.findByIdAndUpdate(
      req.user.userId,
      {
        $pull: {
          adaptivePlans: { _id: req.params.id }
        }
      }
    )

    return res.status(200).json({
      success: true,
      message: 'Plan deleted successfully'
    })
  } catch (error) {
    console.error('Error deleting plan:', error)
    return res.status(500).json({ success: false, error: 'Server error while deleting plan' })
  }
})

// Keep the old /generate-plan endpoint for backward compatibility (without auth)
router.post('/generate-plan', (req, res) => {
  const { name, goal, weakSubjects = '', strongSubjects = '', dailyHours = '2', skillLevel = 'Beginner' } = req.body
  const hours = clampNumber(dailyHours, 1, 12, 2)
  const weakList = splitSubjects(weakSubjects)
  const strongList = splitSubjects(strongSubjects)
  const result = generateRealisticPlan(name, goal, weakList, strongList, hours, skillLevel)
  res.json({ success: true, plan: result.plan })
})

module.exports = router
