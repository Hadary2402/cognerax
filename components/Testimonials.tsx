import { Star, Quote } from 'lucide-react'

const testimonials = [
  {
    name: 'Ahmed Al Mansoori',
    role: 'Managing Partner',
    company: 'Al Mansoori Law Firm',
    image: '👨‍💼',
    rating: 5,
    text: 'Nexora has transformed how we manage our practice. The AI assistant saves us hours every week, and the case management system is intuitive and powerful.',
  },
  {
    name: 'Sarah Johnson',
    role: 'Solo Practitioner',
    company: 'Johnson Legal Services',
    image: '👩‍💼',
    rating: 5,
    text: 'As a solo practitioner, I needed a system that could handle everything. Nexora does exactly that—from client management to deadline tracking, it\'s all there.',
  },
  {
    name: 'Mohammed Hassan',
    role: 'Legal Director',
    company: 'Dubai Corporate Legal',
    image: '👨‍💼',
    rating: 5,
    text: 'The multi-language support and hierarchical team structure make it perfect for our multi-office firm. Our team collaboration has improved significantly.',
  },
]

const stats = [
  { number: '500+', label: 'Law Firms' },
  { number: '2,000+', label: 'Legal Professionals' },
  { number: '50,000+', label: 'Cases Managed' },
  { number: '98%', label: 'Satisfaction Rate' },
]

export default function Testimonials() {
  return (
    <section id="testimonials" className="bg-primary-50 dark:bg-gray-800 py-20 transition-colors duration-300">
      <div className="section-container">
        <div className="text-center mb-16">
          <h2 className="section-title dark:text-white">Trusted by Legal Professionals</h2>
          <p className="section-subtitle mx-auto text-center dark:text-gray-300">
            See what law firms and legal professionals across the UAE are saying about Nexora.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-primary-600 dark:text-primary-400 mb-2">{stat.number}</div>
              <div className="text-legal-gray dark:text-gray-300">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Testimonials */}
        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div 
              key={index}
              className="bg-white dark:bg-gray-700 p-8 rounded-xl shadow-lg dark:shadow-gray-900 hover:shadow-xl dark:hover:shadow-gray-800 transition-shadow duration-300"
            >
              <div className="flex items-center gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="text-yellow-400 fill-yellow-400" size={20} />
                ))}
              </div>
              <Quote className="text-primary-200 dark:text-primary-600 mb-4" size={32} />
              <p className="text-legal-gray dark:text-gray-300 mb-6 italic">"{testimonial.text}"</p>
              <div className="flex items-center gap-4">
                <div className="text-4xl">{testimonial.image}</div>
                <div>
                  <div className="font-semibold text-legal-dark dark:text-white">{testimonial.name}</div>
                  <div className="text-sm text-legal-gray dark:text-gray-400">{testimonial.role}</div>
                  <div className="text-sm text-primary-600 dark:text-primary-400">{testimonial.company}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

