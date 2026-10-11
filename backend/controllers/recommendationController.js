// controllers/recommendationController.js - Generate real educational resources and learning roadmaps
const resourceDatabase = {
  Math: {
    Beginner: [
      // Videos
      {
        id: 'math-b-v1',
        title: 'Algebra Fundamentals - Khan Academy',
        description: 'Complete introduction to algebraic concepts, equations, and problem-solving strategies.',
        difficulty: 'Beginner',
        type: 'Video',
        url: 'https://www.khanacademy.org/math/algebra1',
        duration: '40+ hours',
        platform: 'Khan Academy',
        rating: 4.9
      },
      {
        id: 'math-b-v2',
        title: 'Basic Mathematics Explained - YouTube',
        description: 'Step-by-step video tutorials covering numbers, fractions, and basic operations.',
        difficulty: 'Beginner',
        type: 'Video',
        url: 'https://www.youtube.com/playlist?list=PLmdFyQYShrjR3RPTRQ_cKBRGj3YzfQk5x',
        duration: '8 hours',
        platform: 'YouTube',
        rating: 4.7
      },
      // Notes
      {
        id: 'math-b-n1',
        title: 'Algebra Quick Reference Guide - StudyBlue',
        description: 'Comprehensive flashcards and notes for essential algebra concepts.',
        difficulty: 'Beginner',
        type: 'Notes',
        url: 'https://www.studyblue.com/flashcards/algebra-basics/123456',
        duration: 'Self-paced',
        platform: 'StudyBlue',
        rating: 4.6
      },
      {
        id: 'math-b-n2',
        title: 'Math Basics Notebook - Notion',
        description: 'Organized digital notebook with formulas, definitions, and worked examples.',
        difficulty: 'Beginner',
        type: 'Notes',
        url: 'https://www.notion.so/math-basics',
        duration: 'Self-paced',
        platform: 'Notion',
        rating: 4.5
      },
      // Practice Platforms
      {
        id: 'math-b-p1',
        title: 'IXL Math - Interactive Practice',
        description: 'Adaptive practice platform with real-time feedback and progress tracking.',
        difficulty: 'Beginner',
        type: 'Practice Platform',
        url: 'https://www.ixl.com/math',
        duration: 'Unlimited',
        platform: 'IXL',
        rating: 4.8
      },
      {
        id: 'math-b-p2',
        title: 'Mathway - Problem Solver',
        description: 'Solve problems step-by-step with detailed explanations for learning.',
        difficulty: 'Beginner',
        type: 'Practice Platform',
        url: 'https://www.mathway.com',
        duration: 'Unlimited',
        platform: 'Mathway',
        rating: 4.6
      },
      // Quizzes
      {
        id: 'math-b-q1',
        title: 'Basic Math Quiz - Quizizz',
        description: 'Interactive quizzes covering fundamentals with gamified learning.',
        difficulty: 'Beginner',
        type: 'Quiz',
        url: 'https://quizizz.com/admin/quiz/5e1234567890',
        duration: '15-20 min',
        platform: 'Quizizz',
        rating: 4.7
      }
    ],
    Intermediate: [
      {
        id: 'math-i-v1',
        title: 'Advanced Algebra - Coursera',
        description: 'In-depth exploration of quadratics, polynomials, and rational functions.',
        difficulty: 'Intermediate',
        type: 'Video',
        url: 'https://www.coursera.org/learn/algebra-intermediate',
        duration: '20 hours',
        platform: 'Coursera',
        rating: 4.8
      },
      {
        id: 'math-i-v2',
        title: 'Trigonometry Foundations - MIT OCW',
        description: 'University-level introduction to trigonometric functions and applications.',
        difficulty: 'Intermediate',
        type: 'Video',
        url: 'https://ocw.mit.edu/courses/mathematics/18-01-single-variable-calculus',
        duration: '30 hours',
        platform: 'MIT OCW',
        rating: 4.9
      },
      {
        id: 'math-i-p1',
        title: 'Brilliant.org - Interactive Math',
        description: 'Interactive problem-solving with visual explanations and guided solutions.',
        difficulty: 'Intermediate',
        type: 'Practice Platform',
        url: 'https://brilliant.org/courses/algebra/',
        duration: 'Unlimited',
        platform: 'Brilliant',
        rating: 4.9
      },
      {
        id: 'math-i-q1',
        title: 'SAT Math Practice - Khan Academy',
        description: 'Standardized test preparation with hundreds of practice problems.',
        difficulty: 'Intermediate',
        type: 'Quiz',
        url: 'https://www.khanacademy.org/test-prep/sat',
        duration: 'Self-paced',
        platform: 'Khan Academy',
        rating: 4.8
      }
    ],
    Advanced: [
      {
        id: 'math-a-v1',
        title: 'Calculus I - MIT OpenCourseWare',
        description: 'Complete calculus course with derivatives, integrals, and applications.',
        difficulty: 'Advanced',
        type: 'Video',
        url: 'https://ocw.mit.edu/courses/mathematics/18-01-single-variable-calculus-fall-2006/',
        duration: '50+ hours',
        platform: 'MIT OCW',
        rating: 4.9
      },
      {
        id: 'math-a-p1',
        title: 'AoPS - Advanced Problem Solving',
        description: 'Competition mathematics and advanced concepts for serious learners.',
        difficulty: 'Advanced',
        type: 'Practice Platform',
        url: 'https://artofproblemsolving.com/',
        duration: 'Unlimited',
        platform: 'AoPS',
        rating: 4.9
      }
    ]
  },
  Physics: {
    Beginner: [
      {
        id: 'phy-b-v1',
        title: 'Physics Fundamentals - Khan Academy',
        description: 'Core concepts of motion, forces, energy, and waves explained clearly.',
        difficulty: 'Beginner',
        type: 'Video',
        url: 'https://www.khanacademy.org/science/physics',
        duration: '30+ hours',
        platform: 'Khan Academy',
        rating: 4.9
      },
      {
        id: 'phy-b-v2',
        title: 'Crash Course Physics - YouTube',
        description: 'Engaging video series covering essential physics concepts.',
        difficulty: 'Beginner',
        type: 'Video',
        url: 'https://www.youtube.com/playlist?list=PL8dPuuaLjXtN0ge7yDk_UA0ldZJdhwkoV',
        duration: '16 hours',
        platform: 'YouTube',
        rating: 4.8
      },
      {
        id: 'phy-b-n1',
        title: 'Physics Notes & Formulas - Quizlet',
        description: 'Comprehensive flashcard sets for physics fundamentals.',
        difficulty: 'Beginner',
        type: 'Notes',
        url: 'https://quizlet.com/subject/physics/',
        duration: 'Self-paced',
        platform: 'Quizlet',
        rating: 4.6
      },
      {
        id: 'phy-b-p1',
        title: 'PhET Interactive Simulations',
        description: 'Interactive physics simulations for hands-on learning.',
        difficulty: 'Beginner',
        type: 'Practice Platform',
        url: 'https://phet.colorado.edu/en/simulations',
        duration: 'Unlimited',
        platform: 'PhET',
        rating: 4.9
      }
    ],
    Intermediate: [
      {
        id: 'phy-i-v1',
        title: 'College Physics - edX',
        description: 'Advanced mechanics, electricity, and magnetism course.',
        difficulty: 'Intermediate',
        type: 'Video',
        url: 'https://www.edx.org/course/physics',
        duration: '25 hours',
        platform: 'edX',
        rating: 4.8
      },
      {
        id: 'phy-i-p1',
        title: 'Chegg Study - Physics Solutions',
        description: 'Step-by-step solutions and tutoring for physics problems.',
        difficulty: 'Intermediate',
        type: 'Practice Platform',
        url: 'https://www.chegg.com/',
        duration: 'Unlimited',
        platform: 'Chegg',
        rating: 4.6
      }
    ],
    Advanced: [
      {
        id: 'phy-a-v1',
        title: 'Classical Mechanics - MIT OpenCourseWare',
        description: 'Advanced mechanics course for serious physics students.',
        difficulty: 'Advanced',
        type: 'Video',
        url: 'https://ocw.mit.edu/courses/physics/8-01-classical-mechanics-fall-1999/',
        duration: '40+ hours',
        platform: 'MIT OCW',
        rating: 4.9
      }
    ]
  },
  Chemistry: {
    Beginner: [
      {
        id: 'chem-b-v1',
        title: 'Chemistry Fundamentals - Khan Academy',
        description: 'Atoms, bonds, reactions, and periodic table concepts.',
        difficulty: 'Beginner',
        type: 'Video',
        url: 'https://www.khanacademy.org/science/chemistry',
        duration: '35+ hours',
        platform: 'Khan Academy',
        rating: 4.9
      },
      {
        id: 'chem-b-v2',
        title: 'Crash Course Chemistry - YouTube',
        description: 'Fast-paced chemistry concepts explained with visual aids.',
        difficulty: 'Beginner',
        type: 'Video',
        url: 'https://www.youtube.com/playlist?list=PL8dPuuaLjXtPHzzYuWy6fYEaX9mQQ8oF2',
        duration: '12 hours',
        platform: 'YouTube',
        rating: 4.8
      },
      {
        id: 'chem-b-n1',
        title: 'Chemistry Flashcards - Anki',
        description: 'Spaced repetition flashcards for chemistry concepts.',
        difficulty: 'Beginner',
        type: 'Notes',
        url: 'https://ankiweb.net/',
        duration: 'Self-paced',
        platform: 'Anki',
        rating: 4.7
      },
      {
        id: 'chem-b-p1',
        title: 'Molecular Viewer - RCSB PDB',
        description: 'Interactive 3D visualization of molecular structures.',
        difficulty: 'Beginner',
        type: 'Practice Platform',
        url: 'https://www.rcsb.org/',
        duration: 'Unlimited',
        platform: 'RCSB PDB',
        rating: 4.8
      }
    ],
    Intermediate: [
      {
        id: 'chem-i-v1',
        title: 'General Chemistry - Udemy',
        description: 'Comprehensive general chemistry course with practice problems.',
        difficulty: 'Intermediate',
        type: 'Video',
        url: 'https://www.udemy.com/course/general-chemistry',
        duration: '30 hours',
        platform: 'Udemy',
        rating: 4.7
      },
      {
        id: 'chem-i-p1',
        title: 'ChemDoodle - Chemistry Software',
        description: 'Professional chemistry drawing and structure visualization tool.',
        difficulty: 'Intermediate',
        type: 'Practice Platform',
        url: 'https://www.chemdoodle.com/',
        duration: 'Unlimited',
        platform: 'ChemDoodle',
        rating: 4.7
      }
    ],
    Advanced: [
      {
        id: 'chem-a-v1',
        title: 'Organic Chemistry - MIT OCW',
        description: 'Advanced organic chemistry with reaction mechanisms.',
        difficulty: 'Advanced',
        type: 'Video',
        url: 'https://ocw.mit.edu/courses/chemistry/',
        duration: '45+ hours',
        platform: 'MIT OCW',
        rating: 4.9
      }
    ]
  },
  'Computer Science': {
    Beginner: [
      {
        id: 'cs-b-v1',
        title: 'CS50 Introduction - edX',
        description: 'Harvard\'s legendary intro to CS course covering fundamentals.',
        difficulty: 'Beginner',
        type: 'Video',
        url: 'https://www.edx.org/course/cs50s-introduction-to-computer-science',
        duration: '12 weeks',
        platform: 'edX',
        rating: 4.9
      },
      {
        id: 'cs-b-v2',
        title: 'Python for Beginners - Codecademy',
        description: 'Interactive Python basics with hands-on coding exercises.',
        difficulty: 'Beginner',
        type: 'Video',
        url: 'https://www.codecademy.com/learn/learn-python-3',
        duration: '25 hours',
        platform: 'Codecademy',
        rating: 4.8
      },
      {
        id: 'cs-b-n1',
        title: 'Programming Cheatsheets - Dev.to',
        description: 'Quick reference guides for programming languages and concepts.',
        difficulty: 'Beginner',
        type: 'Notes',
        url: 'https://dev.to/',
        duration: 'Self-paced',
        platform: 'Dev.to',
        rating: 4.6
      },
      {
        id: 'cs-b-p1',
        title: 'LeetCode Easy - Coding Challenges',
        description: 'Beginner-friendly coding problems with solutions and discussions.',
        difficulty: 'Beginner',
        type: 'Practice Platform',
        url: 'https://leetcode.com/problemset/all/?difficulty=Easy',
        duration: 'Unlimited',
        platform: 'LeetCode',
        rating: 4.8
      }
    ],
    Intermediate: [
      {
        id: 'cs-i-v1',
        title: 'Data Structures - GeeksforGeeks',
        description: 'Comprehensive guide to algorithms and data structures.',
        difficulty: 'Intermediate',
        type: 'Video',
        url: 'https://www.geeksforgeeks.org/data-structures/',
        duration: 'Self-paced',
        platform: 'GeeksforGeeks',
        rating: 4.8
      },
      {
        id: 'cs-i-p1',
        title: 'HackerRank Coding Challenges',
        description: 'Intermediate problem sets with real-time feedback.',
        difficulty: 'Intermediate',
        type: 'Practice Platform',
        url: 'https://www.hackerrank.com/',
        duration: 'Unlimited',
        platform: 'HackerRank',
        rating: 4.7
      }
    ],
    Advanced: [
      {
        id: 'cs-a-v1',
        title: 'CLRS Algorithms - MIT Course',
        description: 'Advanced algorithms course based on classic textbook.',
        difficulty: 'Advanced',
        type: 'Video',
        url: 'https://ocw.mit.edu/courses/electrical-engineering-and-computer-science/6-006-introduction-to-algorithms',
        duration: '50+ hours',
        platform: 'MIT OCW',
        rating: 4.9
      }
    ]
  },
  'Data Structures': {
    Beginner: [
      {
        id: 'ds-b-v1',
        title: 'Data Structures Basics - Udacity',
        description: 'Introduction to arrays, linked lists, stacks, and queues.',
        difficulty: 'Beginner',
        type: 'Video',
        url: 'https://www.udacity.com/course/data-structures-nanodegree',
        duration: '4 months',
        platform: 'Udacity',
        rating: 4.8
      },
      {
        id: 'ds-b-v2',
        title: 'Visualizing Data Structures - VisuAlgo',
        description: 'Interactive visualization of data structure operations.',
        difficulty: 'Beginner',
        type: 'Video',
        url: 'https://visualgo.net/',
        duration: 'Self-paced',
        platform: 'VisuAlgo',
        rating: 4.9
      },
      {
        id: 'ds-b-n1',
        title: 'Data Structure Notes - StudyBlue',
        description: 'Comprehensive flashcards for data structure concepts.',
        difficulty: 'Beginner',
        type: 'Notes',
        url: 'https://www.studyblue.com/flashcards/data-structures/123456',
        duration: 'Self-paced',
        platform: 'StudyBlue',
        rating: 4.6
      },
      {
        id: 'ds-b-p1',
        title: 'Coding Practice - CodeSignal',
        description: 'Data structure problems with instant feedback.',
        difficulty: 'Beginner',
        type: 'Practice Platform',
        url: 'https://codesignal.com/',
        duration: 'Unlimited',
        platform: 'CodeSignal',
        rating: 4.7
      }
    ],
    Intermediate: [
      {
        id: 'ds-i-v1',
        title: 'Advanced DS & Algorithms - Coursera',
        description: 'Trees, graphs, and advanced algorithm techniques.',
        difficulty: 'Intermediate',
        type: 'Video',
        url: 'https://www.coursera.org/specializations/data-structures-algorithms',
        duration: '6 months',
        platform: 'Coursera',
        rating: 4.8
      },
      {
        id: 'ds-i-p1',
        title: 'InterviewBit - Interview Prep',
        description: 'Curated problems for tech interviews.',
        difficulty: 'Intermediate',
        type: 'Practice Platform',
        url: 'https://www.interviewbit.com/',
        duration: 'Unlimited',
        platform: 'InterviewBit',
        rating: 4.7
      }
    ],
    Advanced: [
      {
        id: 'ds-a-v1',
        title: 'Algorithm Design - Stanford',
        description: 'Advanced algorithm analysis and design techniques.',
        difficulty: 'Advanced',
        type: 'Video',
        url: 'https://www.coursera.org/learn/algorithm-design-analysis',
        duration: '8 weeks',
        platform: 'Coursera',
        rating: 4.9
      }
    ]
  },
  'Web Development': {
    Beginner: [
      {
        id: 'web-b-v1',
        title: 'HTML & CSS Basics - freeCodeCamp',
        description: 'Complete guide to HTML and CSS for web development.',
        difficulty: 'Beginner',
        type: 'Video',
        url: 'https://www.freecodecamp.org/learn/responsive-web-design/',
        duration: '30+ hours',
        platform: 'freeCodeCamp',
        rating: 4.9
      },
      {
        id: 'web-b-v2',
        title: 'JavaScript Basics - Codecademy',
        description: 'Interactive JavaScript fundamentals course.',
        difficulty: 'Beginner',
        type: 'Video',
        url: 'https://www.codecademy.com/learn/learn-javascript',
        duration: '20 hours',
        platform: 'Codecademy',
        rating: 4.8
      },
      {
        id: 'web-b-n1',
        title: 'Web Dev Cheatsheets - MDN',
        description: 'Official Mozilla documentation for web technologies.',
        difficulty: 'Beginner',
        type: 'Notes',
        url: 'https://developer.mozilla.org/',
        duration: 'Self-paced',
        platform: 'MDN',
        rating: 4.9
      },
      {
        id: 'web-b-p1',
        title: 'Frontend Practice - Frontend Mentor',
        description: 'Real-world frontend projects with design files.',
        difficulty: 'Beginner',
        type: 'Practice Platform',
        url: 'https://www.frontendmentor.io/',
        duration: 'Unlimited',
        platform: 'Frontend Mentor',
        rating: 4.8
      }
    ],
    Intermediate: [
      {
        id: 'web-i-v1',
        title: 'React Course - Udemy',
        description: 'Complete React with hooks, context, and modern patterns.',
        difficulty: 'Intermediate',
        type: 'Video',
        url: 'https://www.udemy.com/course/react-the-complete-guide',
        duration: '40+ hours',
        platform: 'Udemy',
        rating: 4.8
      },
      {
        id: 'web-i-v2',
        title: 'Node.js Backend - Express',
        description: 'Server-side development with Node.js and Express.',
        difficulty: 'Intermediate',
        type: 'Video',
        url: 'https://www.udemy.com/course/nodejs-express-mongodb-bootcamp',
        duration: '30+ hours',
        platform: 'Udemy',
        rating: 4.8
      },
      {
        id: 'web-i-p1',
        title: 'Codewars - JavaScript Challenges',
        description: 'Community-driven coding challenges for JavaScript.',
        difficulty: 'Intermediate',
        type: 'Practice Platform',
        url: 'https://www.codewars.com/',
        duration: 'Unlimited',
        platform: 'Codewars',
        rating: 4.7
      }
    ],
    Advanced: [
      {
        id: 'web-a-v1',
        title: 'Advanced JavaScript - Frontend Masters',
        description: 'Deep dive into JavaScript internals and optimization.',
        difficulty: 'Advanced',
        type: 'Video',
        url: 'https://frontendmasters.com/',
        duration: '40+ hours',
        platform: 'Frontend Masters',
        rating: 4.9
      }
    ]
  },
  'Machine Learning': {
    Beginner: [
      {
        id: 'ml-b-v1',
        title: 'Machine Learning Basics - Coursera',
        description: 'Andrew Ng\'s foundational ML course.',
        difficulty: 'Beginner',
        type: 'Video',
        url: 'https://www.coursera.org/learn/machine-learning',
        duration: '6 weeks',
        platform: 'Coursera',
        rating: 4.9
      },
      {
        id: 'ml-b-v2',
        title: 'TensorFlow for Beginners - TensorFlow',
        description: 'Introduction to deep learning with TensorFlow.',
        difficulty: 'Beginner',
        type: 'Video',
        url: 'https://www.tensorflow.org/tutorials',
        duration: '20 hours',
        platform: 'TensorFlow',
        rating: 4.8
      },
      {
        id: 'ml-b-n1',
        title: 'ML Cheatsheets - DataCamp',
        description: 'Quick reference for ML algorithms and techniques.',
        difficulty: 'Beginner',
        type: 'Notes',
        url: 'https://www.datacamp.com/',
        duration: 'Self-paced',
        platform: 'DataCamp',
        rating: 4.7
      },
      {
        id: 'ml-b-p1',
        title: 'Kaggle Competitions',
        description: 'Real-world ML problems with datasets and kernels.',
        difficulty: 'Beginner',
        type: 'Practice Platform',
        url: 'https://www.kaggle.com/competitions',
        duration: 'Unlimited',
        platform: 'Kaggle',
        rating: 4.8
      }
    ],
    Intermediate: [
      {
        id: 'ml-i-v1',
        title: 'Deep Learning Specialization - Coursera',
        description: 'Comprehensive deep learning course series.',
        difficulty: 'Intermediate',
        type: 'Video',
        url: 'https://www.coursera.org/specializations/deep-learning',
        duration: '5 months',
        platform: 'Coursera',
        rating: 4.9
      },
      {
        id: 'ml-i-p1',
        title: 'Papers with Code',
        description: 'Latest ML research papers with implementations.',
        difficulty: 'Intermediate',
        type: 'Practice Platform',
        url: 'https://paperswithcode.com/',
        duration: 'Unlimited',
        platform: 'Papers with Code',
        rating: 4.8
      }
    ],
    Advanced: [
      {
        id: 'ml-a-v1',
        title: 'Stanford CS224N - NLP',
        description: 'Advanced natural language processing course.',
        difficulty: 'Advanced',
        type: 'Video',
        url: 'https://web.stanford.edu/class/cs224n/',
        duration: '40+ hours',
        platform: 'Stanford',
        rating: 4.9
      }
    ]
  }
}

const roadmapDatabase = {
  Math: {
    Beginner: {
      title: 'Master Mathematics Fundamentals - 4 Week Journey',
      overview: 'A comprehensive 4-week roadmap to build strong foundations in mathematics.',
      weeks: [
        {
          weekNumber: 1,
          weekTitle: 'Numbers & Operations',
          weeklyGoals: [
            'Understand number systems and place value',
            'Master basic arithmetic operations',
            'Learn order of operations (PEMDAS)',
            'Develop mental math skills'
          ],
          topics: ['Number systems', 'Whole numbers', 'Decimals', 'Fractions', 'Order of operations'],
          recommendedResources: ['Khan Academy - Arithmetic', 'IXL Math'],
          practiceTasks: [
            'Complete 50 arithmetic problems daily',
            'Practice mental math for 15 minutes',
            'Create flashcards for basic facts'
          ],
          estimatedHours: 8,
          milestones: ['Complete basic arithmetic test', 'Master multiplication tables']
        },
        {
          weekNumber: 2,
          weekTitle: 'Fractions & Ratios',
          weeklyGoals: [
            'Master fraction concepts and operations',
            'Understand ratios and proportions',
            'Apply fractions to real-world problems',
            'Develop fraction equivalency skills'
          ],
          topics: ['Fractions', 'Decimals', 'Ratios', 'Proportions', 'Percentages'],
          recommendedResources: ['Khan Academy - Fractions', 'YouTube tutorials'],
          practiceTasks: [
            'Solve 40 fraction problems daily',
            'Create ratio scenarios from daily life',
            'Practice converting fractions, decimals, percentages'
          ],
          estimatedHours: 10,
          milestones: ['Pass fraction mastery quiz', 'Solve real-world ratio problems']
        },
        {
          weekNumber: 3,
          weekTitle: 'Introduction to Algebra',
          weeklyGoals: [
            'Learn variables and expressions',
            'Solve basic linear equations',
            'Understand equation properties',
            'Apply algebra to word problems'
          ],
          topics: ['Variables', 'Expressions', 'Linear equations', 'Solving equations', 'Word problems'],
          recommendedResources: ['Khan Academy - Algebra', 'Mathway'],
          practiceTasks: [
            'Solve 30 linear equations daily',
            'Translate word problems to equations',
            'Complete algebra problem sets'
          ],
          estimatedHours: 12,
          milestones: ['Solve linear equations fluently', 'Master word problem translation']
        },
        {
          weekNumber: 4,
          weekTitle: 'Review & Assessment',
          weeklyGoals: [
            'Review all concepts from weeks 1-3',
            'Strengthen weak areas',
            'Take comprehensive assessment',
            'Plan next learning phase'
          ],
          topics: ['Arithmetic review', 'Fractions review', 'Algebra review', 'Problem-solving'],
          recommendedResources: ['Practice quizzes', 'Khan Academy review', 'IXL diagnostic tests'],
          practiceTasks: [
            'Complete 20 mixed review problems daily',
            'Take full-length practice test',
            'Re-study areas with <80% accuracy'
          ],
          estimatedHours: 10,
          milestones: ['Score 80%+ on comprehensive test', 'Identify readiness for next level']
        }
      ]
    },
    Intermediate: {
      title: 'Advanced Algebra & Functions - 4 Week Mastery',
      overview: 'Deep dive into quadratics, polynomials, functions, and trigonometry foundations.',
      weeks: [
        {
          weekNumber: 1,
          weekTitle: 'Quadratic Functions & Equations',
          weeklyGoals: [
            'Master quadratic equations and functions',
            'Learn multiple solving methods',
            'Understand parabola properties',
            'Apply to real-world scenarios'
          ],
          topics: ['Quadratic equations', 'Completing the square', 'Quadratic formula', 'Parabolas', 'Vertex form'],
          recommendedResources: ['Brilliant.org', 'Coursera Algebra course'],
          practiceTasks: [
            'Solve 25 quadratic equations daily using different methods',
            'Graph 10 parabolas and identify properties',
            'Complete application problems'
          ],
          estimatedHours: 12,
          milestones: ['Solve quadratics fluently', 'Graph and analyze parabolas']
        },
        {
          weekNumber: 2,
          weekTitle: 'Polynomial & Rational Functions',
          weeklyGoals: [
            'Understand polynomial operations',
            'Master factoring techniques',
            'Learn about zeros and end behavior',
            'Explore rational functions'
          ],
          topics: ['Polynomials', 'Factoring', 'Polynomial division', 'Zeros', 'Rational functions', 'Asymptotes'],
          recommendedResources: ['Khan Academy Advanced Algebra', 'MIT OCW'],
          practiceTasks: [
            'Factor 20 polynomial expressions daily',
            'Find zeros using various methods',
            'Analyze polynomial and rational behavior'
          ],
          estimatedHours: 13,
          milestones: ['Factor complex polynomials', 'Analyze end behavior']
        },
        {
          weekNumber: 3,
          weekTitle: 'Functions & Trigonometry Intro',
          weeklyGoals: [
            'Master function concepts and notation',
            'Learn composition and inverse functions',
            'Introduction to trigonometric functions',
            'Understand unit circle'
          ],
          topics: ['Function properties', 'Composition', 'Inverse functions', 'Trig functions', 'Unit circle', 'Angle measures'],
          recommendedResources: ['Brilliant.org Trigonometry', 'Khan Academy'],
          practiceTasks: [
            'Work with 15 function composition problems daily',
            'Unit circle practice and angle conversion',
            'Basic trigonometric function evaluation'
          ],
          estimatedHours: 14,
          milestones: ['Understand function composition', 'Master unit circle']
        },
        {
          weekNumber: 4,
          weekTitle: 'Advanced Problem-Solving',
          weeklyGoals: [
            'Integrate concepts from weeks 1-3',
            'Develop problem-solving strategies',
            'Prepare for standardized tests',
            'Identify next learning goals'
          ],
          topics: ['Mixed problem-solving', 'Real-world applications', 'Test strategies', 'Competition problems'],
          recommendedResources: ['Khan Academy SAT prep', 'AoPS'],
          practiceTasks: [
            'Solve 30 mixed problems daily',
            'Complete full-length practice tests',
            'Work on competition-level problems'
          ],
          estimatedHours: 12,
          milestones: ['Score 85%+ on advanced test', 'Master problem-solving strategies']
        }
      ]
    },
    Advanced: {
      title: 'Calculus & Advanced Analysis - 4 Week Program',
      overview: 'Comprehensive calculus course covering limits, derivatives, integrals, and applications.',
      weeks: [
        {
          weekNumber: 1,
          weekTitle: 'Limits & Continuity',
          weeklyGoals: [
            'Understand limit concepts and definitions',
            'Learn limit evaluation techniques',
            'Master continuity and discontinuity',
            'Prepare for derivatives'
          ],
          topics: ['Limits', 'Limit laws', 'Continuity', 'Discontinuities', 'Intermediate Value Theorem'],
          recommendedResources: ['MIT OCW Calculus', 'Coursera Advanced Math'],
          practiceTasks: [
            'Evaluate 20 limits using various techniques daily',
            'Analyze continuity of functions',
            'Prove limit concepts formally'
          ],
          estimatedHours: 13,
          milestones: ['Master limit evaluation', 'Understand formal definitions']
        },
        {
          weekNumber: 2,
          weekTitle: 'Derivatives & Differentiation',
          weeklyGoals: [
            'Learn derivative definition and rules',
            'Master differentiation techniques',
            'Apply derivatives to optimization',
            'Understand applications'
          ],
          topics: ['Derivative definition', 'Power rule', 'Product rule', 'Chain rule', 'Implicit differentiation', 'Applications'],
          recommendedResources: ['MIT OCW', 'Khan Academy Calculus'],
          practiceTasks: [
            'Compute 25 derivatives daily using various rules',
            'Solve optimization problems',
            'Apply derivatives to real-world scenarios'
          ],
          estimatedHours: 15,
          milestones: ['Differentiate complex functions', 'Solve optimization problems']
        },
        {
          weekNumber: 3,
          weekTitle: 'Integration & Integrals',
          weeklyGoals: [
            'Understand antiderivatives and indefinite integrals',
            'Learn integration techniques',
            'Master the Fundamental Theorem of Calculus',
            'Apply definite integrals'
          ],
          topics: ['Antiderivatives', 'Indefinite integrals', 'Integration rules', 'Integration by parts', 'U-substitution', 'Definite integrals', 'FTC'],
          recommendedResources: ['MIT OCW', 'Paul\'s Online Math Notes'],
          practiceTasks: [
            'Compute 20 integrals daily',
            'Use FTC to evaluate definite integrals',
            'Apply integrals to area and volume problems'
          ],
          estimatedHours: 16,
          milestones: ['Master integration techniques', 'Apply FTC effectively']
        },
        {
          weekNumber: 4,
          weekTitle: 'Applications & Problem-Solving',
          weeklyGoals: [
            'Apply calculus to complex problems',
            'Explore multiple solution strategies',
            'Prepare for advanced studies',
            'Master exam-level problems'
          ],
          topics: ['Applied optimization', 'Related rates', 'Differential equations', 'Series basics', 'Mixed applications'],
          recommendedResources: ['MIT OCW', 'AoPS Calculus'],
          practiceTasks: [
            'Solve 25 application problems daily',
            'Complete full-length exam practice',
            'Work on competition problems'
          ],
          estimatedHours: 15,
          milestones: ['Master applied calculus', 'Score 90%+ on final assessment']
        }
      ]
    }
  },
  Physics: {
    Beginner: {
      title: 'Physics Fundamentals - 4 Week Explorer',
      overview: 'Build foundational understanding of motion, forces, energy, and waves.',
      weeks: [
        {
          weekNumber: 1,
          weekTitle: 'Motion & Mechanics',
          weeklyGoals: [
            'Understand distance, speed, velocity, acceleration',
            'Learn Newton\'s laws of motion',
            'Solve kinematics problems',
            'Develop problem-solving skills'
          ],
          topics: ['Distance and displacement', 'Velocity and acceleration', 'Graphs of motion', 'Newton\'s laws', 'Forces'],
          recommendedResources: ['Khan Academy Physics', 'YouTube tutorials'],
          practiceTasks: [
            'Solve 15 kinematics problems daily',
            'Create motion diagrams',
            'Analyze real-world motion scenarios'
          ],
          estimatedHours: 10,
          milestones: ['Understand motion graphs', 'Apply Newton\'s laws']
        },
        {
          weekNumber: 2,
          weekTitle: 'Energy & Work',
          weeklyGoals: [
            'Learn work, energy, and power concepts',
            'Master conservation of energy',
            'Solve energy problems',
            'Apply to real situations'
          ],
          topics: ['Work', 'Kinetic energy', 'Potential energy', 'Conservation of energy', 'Power', 'Collisions'],
          recommendedResources: ['Khan Academy Energy', 'PhET Simulations'],
          practiceTasks: [
            'Solve 15 energy problems daily',
            'Use PhET simulations for understanding',
            'Analyze real-world energy conversions'
          ],
          estimatedHours: 10,
          milestones: ['Master energy conservation', 'Solve momentum problems']
        },
        {
          weekNumber: 3,
          weekTitle: 'Waves & Oscillations',
          weeklyGoals: [
            'Understand wave properties and behavior',
            'Learn sound and light basics',
            'Explore wave interactions',
            'Apply to simple harmonic motion'
          ],
          topics: ['Wave properties', 'Wave equation', 'Sound waves', 'Light waves', 'Interference', 'Diffraction', 'Simple harmonic motion'],
          recommendedResources: ['Khan Academy Waves', 'PhET Simulations'],
          practiceTasks: [
            'Solve 12 wave problems daily',
            'Use simulations to explore wave behavior',
            'Analyze sound and light phenomena'
          ],
          estimatedHours: 11,
          milestones: ['Understand wave behavior', 'Apply wave equations']
        },
        {
          weekNumber: 4,
          weekTitle: 'Comprehensive Review',
          weeklyGoals: [
            'Review all concepts from weeks 1-3',
            'Practice mixed problem-solving',
            'Complete comprehensive assessment',
            'Plan next physics journey'
          ],
          topics: ['Motion review', 'Energy review', 'Waves review', 'Integrated problems'],
          recommendedResources: ['Practice tests', 'Khan Academy review'],
          practiceTasks: [
            'Complete 25 mixed physics problems daily',
            'Take full practice exam',
            'Study weak areas'
          ],
          estimatedHours: 10,
          milestones: ['Score 80%+ on comprehensive test', 'Ready for intermediate physics']
        }
      ]
    },
    Intermediate: {
      title: 'Classical Mechanics & Electricity - 4 Week Deep Dive',
      overview: 'Advanced study of mechanics, thermodynamics, and electromagnetism basics.',
      weeks: [
        {
          weekNumber: 1,
          weekTitle: 'Advanced Mechanics',
          weeklyGoals: [
            'Understand rotational motion',
            'Learn angular momentum and torque',
            'Master statics and dynamics',
            'Solve complex mechanical problems'
          ],
          topics: ['Rotational kinematics', 'Rotational dynamics', 'Angular momentum', 'Torque', 'Equilibrium', 'Elasticity'],
          recommendedResources: ['MIT OCW Classical Mechanics', 'Coursera'],
          practiceTasks: [
            'Solve 12 rotational mechanics problems daily',
            'Analyze rotational systems',
            'Complete equilibrium problems'
          ],
          estimatedHours: 13,
          milestones: ['Master rotational dynamics', 'Solve torque problems']
        },
        {
          weekNumber: 2,
          weekTitle: 'Thermodynamics',
          weeklyGoals: [
            'Understand heat, temperature, and thermal energy',
            'Learn thermodynamic laws',
            'Master gas laws and kinetic theory',
            'Apply to real systems'
          ],
          topics: ['Temperature', 'Heat transfer', 'First law of thermodynamics', 'Entropy', 'Gas laws', 'Kinetic theory'],
          recommendedResources: ['Khan Academy Thermodynamics', 'MIT OCW'],
          practiceTasks: [
            'Solve 12 thermodynamics problems daily',
            'Analyze thermal systems',
            'Apply gas laws to scenarios'
          ],
          estimatedHours: 12,
          milestones: ['Understand thermodynamic laws', 'Master gas laws']
        },
        {
          weekNumber: 3,
          weekTitle: 'Electricity & Magnetism Basics',
          weeklyGoals: [
            'Learn electric charge and fields',
            'Master Coulomb\'s law and electric potential',
            'Understand circuits and current',
            'Explore magnetic fields'
          ],
          topics: ['Electric charge', 'Electric fields', 'Coulomb\'s law', 'Electric potential', 'Current', 'Resistance', 'Magnetism', 'Magnetic force'],
          recommendedResources: ['Khan Academy E&M', 'MIT OCW'],
          practiceTasks: [
            'Solve 12 electricity problems daily',
            'Analyze electric circuits',
            'Study magnetic field effects'
          ],
          estimatedHours: 14,
          milestones: ['Master Coulomb\'s law', 'Understand circuits']
        },
        {
          weekNumber: 4,
          weekTitle: 'Advanced Problem-Solving',
          weeklyGoals: [
            'Integrate all concepts',
            'Develop advanced problem strategies',
            'Prepare for university-level physics',
            'Explore research areas'
          ],
          topics: ['Mixed mechanics', 'Complex thermal systems', 'E&M applications', 'Real-world physics'],
          recommendedResources: ['MIT OCW', 'Chegg Study'],
          practiceTasks: [
            'Solve 20 mixed problems daily',
            'Complete practice exams',
            'Work on research-level problems'
          ],
          estimatedHours: 12,
          milestones: ['Score 85%+ on advanced test', 'Ready for university physics']
        }
      ]
    },
    Advanced: {
      title: 'Modern Physics & Quantum Mechanics - 4 Week Journey',
      overview: 'Explore special relativity, quantum mechanics, and modern physics concepts.',
      weeks: [
        {
          weekNumber: 1,
          weekTitle: 'Special Relativity',
          weeklyGoals: [
            'Understand relativity principles',
            'Master Lorentz transformations',
            'Learn energy-mass equivalence',
            'Solve relativistic problems'
          ],
          topics: ['Reference frames', 'Speed of light constancy', 'Time dilation', 'Length contraction', 'Lorentz transformations', 'Relativistic energy'],
          recommendedResources: ['MIT OCW Modern Physics', 'Coursera'],
          practiceTasks: [
            'Solve 10 relativity problems daily',
            'Work with Lorentz transformations',
            'Analyze relativistic scenarios'
          ],
          estimatedHours: 14,
          milestones: ['Master special relativity', 'Solve relativistic mechanics']
        },
        {
          weekNumber: 2,
          weekTitle: 'Quantum Mechanics Foundations',
          weeklyGoals: [
            'Learn quantum postulates',
            'Master wave functions and probability',
            'Understand Schrödinger equation',
            'Solve basic quantum problems'
          ],
          topics: ['Wave-particle duality', 'Quantum postulates', 'Wave functions', 'Schrödinger equation', 'Uncertainty principle', 'Quantization'],
          recommendedResources: ['MIT OCW Quantum Mechanics', 'Khan Academy'],
          practiceTasks: [
            'Solve 10 Schrödinger problems daily',
            'Work with wave functions',
            'Apply uncertainty principle'
          ],
          estimatedHours: 15,
          milestones: ['Understand Schrödinger equation', 'Master quantization']
        },
        {
          weekNumber: 3,
          weekTitle: 'Quantum Applications',
          weeklyGoals: [
            'Explore hydrogen atom solutions',
            'Learn atomic structure',
            'Understand quantum numbers',
            'Apply to molecular systems'
          ],
          topics: ['Hydrogen atom', 'Quantum numbers', 'Orbital theory', 'Spin', 'Pauli exclusion', 'Molecular bonding', 'Spectroscopy'],
          recommendedResources: ['MIT OCW', 'Advanced textbooks'],
          practiceTasks: [
            'Solve 10 atomic problems daily',
            'Analyze orbital diagrams',
            'Study molecular spectroscopy'
          ],
          estimatedHours: 14,
          milestones: ['Master hydrogen atom', 'Understand atomic structure']
        },
        {
          weekNumber: 4,
          weekTitle: 'Quantum & Relativistic Integration',
          weeklyGoals: [
            'Integrate quantum and relativistic concepts',
            'Explore cutting-edge physics',
            'Master advanced problem-solving',
            'Prepare for research'
          ],
          topics: ['QED basics', 'Particle physics', 'Quantum field theory intro', 'Advanced applications'],
          recommendedResources: ['MIT OCW', 'Caltech lectures'],
          practiceTasks: [
            'Solve 15 advanced problems daily',
            'Complete research-level exams',
            'Explore active research areas'
          ],
          estimatedHours: 15,
          milestones: ['Score 90%+ on final assessment', 'Ready for graduate-level physics']
        }
      ]
    }
  },
  'Computer Science': {
    Beginner: {
      title: 'Programming Fundamentals - 4 Week Bootcamp',
      overview: 'Master programming basics, problem-solving, and foundational CS concepts.',
      weeks: [
        {
          weekNumber: 1,
          weekTitle: 'Programming Basics',
          weeklyGoals: [
            'Learn programming basics and syntax',
            'Master variables, data types, operators',
            'Understand control flow',
            'Write simple programs'
          ],
          topics: ['Syntax', 'Variables', 'Data types', 'Operators', 'Input/output', 'Comments'],
          recommendedResources: ['Codecademy', 'Python for Beginners'],
          practiceTasks: [
            'Write 10 simple programs daily',
            'Practice variable declarations',
            'Complete syntax exercises'
          ],
          estimatedHours: 10,
          milestones: ['Write working programs', 'Master syntax']
        },
        {
          weekNumber: 2,
          weekTitle: 'Control Flow & Logic',
          weeklyGoals: [
            'Master conditional statements',
            'Learn loops and iteration',
            'Understand boolean logic',
            'Solve logic problems'
          ],
          topics: ['If/else statements', 'Loops', 'While loops', 'For loops', 'Boolean logic', 'Nested structures'],
          recommendedResources: ['Python tutorials', 'LeetCode Easy'],
          practiceTasks: [
            'Solve 15 control flow problems daily',
            'Write programs with loops',
            'Practice nested conditions'
          ],
          estimatedHours: 11,
          milestones: ['Master conditionals', 'Understand loops']
        },
        {
          weekNumber: 3,
          weekTitle: 'Functions & Debugging',
          weeklyGoals: [
            'Learn function definitions and calls',
            'Master parameters and return values',
            'Understand variable scope',
            'Debug effectively'
          ],
          topics: ['Function definition', 'Parameters', 'Return values', 'Scope', 'Debugging', 'Documentation'],
          recommendedResources: ['Python documentation', 'Codecademy'],
          practiceTasks: [
            'Write 8 functions daily',
            'Practice debugging code',
            'Complete function challenges'
          ],
          estimatedHours: 10,
          milestones: ['Write complex functions', 'Debug effectively']
        },
        {
          weekNumber: 4,
          weekTitle: 'Projects & Assessment',
          weeklyGoals: [
            'Integrate all concepts into projects',
            'Build small applications',
            'Complete coding assessments',
            'Plan next learning phase'
          ],
          topics: ['Project planning', 'Code organization', 'Testing', 'Best practices', 'Performance basics'],
          recommendedResources: ['Project ideas', 'GitHub examples'],
          practiceTasks: [
            'Complete 2 small projects',
            'Take coding assessment',
            'Code review practice'
          ],
          estimatedHours: 12,
          milestones: ['Complete projects', 'Score 80%+ on assessment']
        }
      ]
    },
    Intermediate: {
      title: 'Data Structures & Algorithms - 4 Week Master Class',
      overview: 'Deep dive into essential DSA concepts for technical interviews and strong programming.',
      weeks: [
        {
          weekNumber: 1,
          weekTitle: 'Arrays & Linked Lists',
          weeklyGoals: [
            'Master array operations and algorithms',
            'Understand linked list structure',
            'Learn common list algorithms',
            'Solve array/list problems'
          ],
          topics: ['Arrays', 'Dynamic arrays', 'Linked lists', 'List operations', 'Common algorithms', 'Time/space complexity'],
          recommendedResources: ['LeetCode', 'HackerRank'],
          practiceTasks: [
            'Solve 15 array problems daily',
            'Implement linked list operations',
            'Analyze time/space complexity'
          ],
          estimatedHours: 12,
          milestones: ['Master arrays', 'Implement linked lists']
        },
        {
          weekNumber: 2,
          weekTitle: 'Stacks, Queues & Trees',
          weeklyGoals: [
            'Master stack and queue data structures',
            'Learn binary trees',
            'Understand tree traversals',
            'Solve tree problems'
          ],
          topics: ['Stacks', 'Queues', 'Binary trees', 'Tree traversals', 'Binary search trees', 'Balanced trees'],
          recommendedResources: ['Brilliant.org', 'GeeksforGeeks'],
          practiceTasks: [
            'Implement stacks and queues',
            'Solve 12 tree problems daily',
            'Practice tree traversals'
          ],
          estimatedHours: 13,
          milestones: ['Master trees', 'Implement BST']
        },
        {
          weekNumber: 3,
          weekTitle: 'Graphs & Advanced Structures',
          weeklyGoals: [
            'Understand graph representations',
            'Master graph algorithms',
            'Learn graph traversals',
            'Solve graph problems'
          ],
          topics: ['Graph representation', 'DFS', 'BFS', 'Dijkstra\'s algorithm', 'Graph properties', 'Advanced structures'],
          recommendedResources: ['LeetCode', 'InterviewBit'],
          practiceTasks: [
            'Solve 12 graph problems daily',
            'Implement graph algorithms',
            'Analyze graph complexity'
          ],
          estimatedHours: 14,
          milestones: ['Master graph algorithms', 'Solve complex graphs']
        },
        {
          weekNumber: 4,
          weekTitle: 'Sorting, Searching & Integration',
          weeklyGoals: [
            'Master sorting algorithms',
            'Learn searching techniques',
            'Integrate DSA concepts',
            'Prepare for interviews'
          ],
          topics: ['Sorting algorithms', 'Binary search', 'Hashing', 'Dynamic programming intro', 'Problem-solving strategies'],
          recommendedResources: ['LeetCode', 'InterviewBit', 'Codewars'],
          practiceTasks: [
            'Solve 15 mixed DSA problems daily',
            'Complete mock interviews',
            'Study interview patterns'
          ],
          estimatedHours: 13,
          milestones: ['Master sorting', 'Ready for tech interviews']
        }
      ]
    },
    Advanced: {
      title: 'Advanced Algorithms & System Design - 4 Week Program',
      overview: 'Master advanced algorithms, optimization, and system design patterns.',
      weeks: [
        {
          weekNumber: 1,
          weekTitle: 'Dynamic Programming',
          weeklyGoals: [
            'Master DP concepts and principles',
            'Learn DP problem patterns',
            'Solve optimization problems',
            'Understand memoization'
          ],
          topics: ['Overlapping subproblems', 'Optimal substructure', 'Memoization', 'Tabulation', 'DP patterns', 'Optimization problems'],
          recommendedResources: ['Codeforces', 'LeetCode Premium'],
          practiceTasks: [
            'Solve 10 DP problems daily',
            'Implement memoization solutions',
            'Analyze optimization opportunities'
          ],
          estimatedHours: 15,
          milestones: ['Master DP patterns', 'Solve complex DP']
        },
        {
          weekNumber: 2,
          weekTitle: 'Advanced Graph & Geometry Algorithms',
          weeklyGoals: [
            'Master advanced graph algorithms',
            'Learn computational geometry',
            'Understand algorithms for hard problems',
            'Solve competition problems'
          ],
          topics: ['Network flow', 'Minimum spanning trees', 'Strongly connected components', 'Geometric algorithms', 'Hard problems'],
          recommendedResources: ['Codeforces', 'AtCoder'],
          practiceTasks: [
            'Solve 10 advanced graph problems daily',
            'Implement flow algorithms',
            'Study geometry algorithms'
          ],
          estimatedHours: 15,
          milestones: ['Master flow algorithms', 'Solve geometry problems']
        },
        {
          weekNumber: 3,
          weekTitle: 'System Design & Architecture',
          weeklyGoals: [
            'Learn system design principles',
            'Master scalability concepts',
            'Design real-world systems',
            'Understand trade-offs'
          ],
          topics: ['Scalability', 'Load balancing', 'Caching', 'Databases', 'Message queues', 'Microservices', 'CAP theorem'],
          recommendedResources: ['System Design Interview', 'Grokking the System Design'],
          practiceTasks: [
            'Design 3 systems weekly',
            'Analyze trade-offs',
            'Study real systems (Instagram, Uber, etc.)'
          ],
          estimatedHours: 15,
          milestones: ['Design Twitter-scale system', 'Understand distributed systems']
        },
        {
          weekNumber: 4,
          weekTitle: 'Integration & Mastery',
          weeklyGoals: [
            'Integrate algorithms and design',
            'Master complex problem-solving',
            'Prepare for senior interviews',
            'Explore research areas'
          ],
          topics: ['Mixed algorithm problems', 'System design integration', 'Performance optimization', 'Advanced techniques'],
          recommendedResources: ['Coding competition sites', 'Research papers'],
          practiceTasks: [
            'Solve 15 mixed problems daily',
            'Complete system design interviews',
            'Study performance optimization'
          ],
          estimatedHours: 15,
          milestones: ['Master all algorithms', 'Excel at senior interviews']
        }
      ]
    }
  }
}

function generateRecommendations(subject, skillLevel, preferredTypes = []) {
  const resources = resourceDatabase[subject]?.[skillLevel] || []
  
  // If preferred types are specified, filter resources
  if (preferredTypes && preferredTypes.length > 0) {
    return resources.filter(r => preferredTypes.includes(r.type))
  }

  return resources
}

function generateLearningRoadmap(subject, skillLevel) {
  const roadmap = roadmapDatabase[subject]?.[skillLevel]
  
  if (!roadmap) {
    return {
      title: `${skillLevel} ${subject} - 4 Week Roadmap`,
      overview: 'A structured 4-week learning roadmap to master key concepts.',
      weeks: [
        {
          weekNumber: 1,
          weekTitle: 'Fundamentals',
          weeklyGoals: ['Understand core concepts', 'Build foundation'],
          topics: ['Key topics'],
          recommendedResources: ['Multiple sources'],
          practiceTasks: ['Daily practice problems'],
          estimatedHours: 10,
          milestones: ['Complete week 1']
        },
        {
          weekNumber: 2,
          weekTitle: 'Intermediate Concepts',
          weeklyGoals: ['Build on fundamentals', 'Deepen understanding'],
          topics: ['Advanced topics'],
          recommendedResources: ['Detailed resources'],
          practiceTasks: ['Complex problems'],
          estimatedHours: 11,
          milestones: ['Master intermediate concepts']
        },
        {
          weekNumber: 3,
          weekTitle: 'Advanced Application',
          weeklyGoals: ['Apply concepts', 'Solve complex problems'],
          topics: ['Application topics'],
          recommendedResources: ['Advanced materials'],
          practiceTasks: ['Project work'],
          estimatedHours: 12,
          milestones: ['Complete projects']
        },
        {
          weekNumber: 4,
          weekTitle: 'Mastery & Review',
          weeklyGoals: ['Integrate all concepts', 'Achieve mastery'],
          topics: ['Review and integration'],
          recommendedResources: ['Comprehensive review'],
          practiceTasks: ['Final assessment'],
          estimatedHours: 10,
          milestones: ['Complete assessment']
        }
      ]
    }
  }

  return roadmap
}

module.exports = {
  generateRecommendations,
  generateLearningRoadmap
}
