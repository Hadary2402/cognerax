import { Check } from 'lucide-react'
import Link from 'next/link'

const plans = [
  {
    name: 'Starter',
    price: 'AED 299',
    period: '/month',
    description: 'Perfect for solo practitioners',
    features: [
      'Up to 50 cases',
      'Unlimited documents',
      'AI Co-Pilot assistance',
      'Client management',
      'Calendar & deadlines',
      'Email support',
      'Mobile app access',
    ],
    popular: false,
  },
  {
    name: 'Professional',
    price: 'AED 799',
    period: '/month',
    description: 'Ideal for small to medium law firms',
    features: [
      'Unlimited cases',
      'Unlimited documents',
      'AI Co-Pilot assistance',
      'Team collaboration (up to 10 users)',
      'Analytics dashboard',
      'Priority support',
      'Multi-language support',
      'API access',
      'Custom workflows',
    ],
    popular: true,
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    period: '',
    description: 'For large firms and multi-office practices',
    features: [
      'Everything in Professional',
      'Unlimited users',
      'Hierarchical team structure',
      'Advanced analytics',
      'Dedicated account manager',
      'Custom integrations',
      'On-premise deployment option',
      'SLA guarantee',
      'Training & onboarding',
    ],
    popular: false,
  },
]

export default function Pricing() {
  return (
    <section id="pricing" className="bg-white dark:bg-gray-900 py-20 transition-colors duration-300">
      <div className="section-container">
        <div className="text-center mb-16">
          <h2 className="section-title dark:text-white">Simple, Transparent Pricing</h2>
          <p className="section-subtitle mx-auto text-center dark:text-gray-300">
            Choose the plan that fits your practice. Contact us for a personalized demo and pricing.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`relative bg-white dark:bg-gray-800 rounded-2xl shadow-lg dark:shadow-gray-900 hover:shadow-2xl dark:hover:shadow-gray-800 transition-shadow duration-300 ${
                plan.popular ? 'border-4 border-primary-600 dark:border-primary-500 scale-105' : 'border border-gray-200 dark:border-gray-700'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-primary-600 dark:bg-primary-500 text-white px-4 py-1 rounded-full text-sm font-semibold">
                  Most Popular
                </div>
              )}
              <div className="p-8">
                <h3 className="text-2xl font-bold text-legal-dark dark:text-white mb-2">{plan.name}</h3>
                <p className="text-legal-gray dark:text-gray-300 mb-6">{plan.description}</p>
                <div className="mb-6">
                  <span className="text-4xl font-bold text-legal-dark dark:text-white">{plan.price}</span>
                  <span className="text-legal-gray dark:text-gray-400">{plan.period}</span>
                </div>
                <Link
                  href="/request-demo"
                  className={`w-full py-3 px-6 rounded-lg font-semibold transition-colors duration-200 text-center block ${
                    plan.popular
                      ? 'btn-primary'
                      : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-legal-dark dark:text-white'
                  }`}
                >
                  Request Demo
                </Link>
                <ul className="mt-8 space-y-4">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start gap-3">
                      <Check className="text-green-500 dark:text-green-400 flex-shrink-0 mt-1" size={20} />
                      <span className="text-legal-gray dark:text-gray-300">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="text-legal-gray dark:text-gray-300 mb-4">
            All plans include onboarding support and training. Custom pricing available for Enterprise plans.
          </p>
          <p className="text-sm text-legal-gray dark:text-gray-400">
            Need help choosing? <a href="#contact" className="text-primary-600 dark:text-primary-400 hover:underline">Contact our sales team</a>
          </p>
        </div>
      </div>
    </section>
  )
}

