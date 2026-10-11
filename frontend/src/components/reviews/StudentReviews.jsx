import './StudentReviews.css'

export default function StudentReviews() {
  const reviews = [
    {
      id: 1,
      name: 'Sarah Chen',
      course: 'Advanced Mathematics',
      review: 'This platform completely transformed how I approach problem-solving. The adaptive recommendations kept me engaged and challenged at just the right level.',
      rating: 5,
      avatar: 'SC',
      color: 'avatar-purple'
    },
    {
      id: 2,
      name: 'Marcus Johnson',
      course: 'Computer Science',
      review: 'The personalized content sequence made complex concepts so much easier to grasp. I finished my course 3 weeks ahead of schedule!',
      rating: 5,
      avatar: 'MJ',
      color: 'avatar-cyan'
    },
    {
      id: 3,
      name: 'Aisha Patel',
      course: 'Data Science',
      review: 'Progress insights showed me exactly where I was struggling. Now I can focus on the areas that matter most to my learning goals.',
      rating: 4,
      avatar: 'AP',
      color: 'avatar-purple'
    },
    {
      id: 4,
      name: 'James Liu',
      course: 'Physics',
      review: 'The curated resources and real-time feedback loop made studying efficient and enjoyable. Highly recommend to any serious student!',
      rating: 5,
      avatar: 'JL',
      color: 'avatar-cyan'
    }
  ]

  const renderStars = (rating) => {
    return (
      <div className="stars">
        {[...Array(5)].map((_, i) => (
          <span key={i} className={`star ${i < rating ? 'filled' : ''}`}>
            ★
          </span>
        ))}
      </div>
    )
  }

  return (
    <section className="container reviews-section">
      <h2 className="section-title">Student Reviews</h2>
      <p className="reviews-subtitle">Hear from learners who transformed their education</p>
      
      <div className="reviews-grid">
        {reviews.map((review, index) => (
          <div 
            key={review.id} 
            className="review-card"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <div className="review-header">
              <div className={`avatar ${review.color}`}>
                {review.avatar}
              </div>
              <div className="reviewer-info">
                <h3 className="reviewer-name">{review.name}</h3>
                <p className="reviewer-course">{review.course}</p>
              </div>
            </div>

            <div className="review-content">
              <p className="review-text">"{review.review}"</p>
            </div>

            <div className="review-footer">
              {renderStars(review.rating)}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
