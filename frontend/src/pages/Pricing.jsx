import { useState } from 'react'
import { CheckCircle, X, Shield, Zap, Sparkles, AlertCircle } from 'lucide-react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'

export default function Pricing() {
    const [annual, setAnnual] = useState(true)
    const [loading, setLoading] = useState(false)
    const [success, setSuccess] = useState(false)
    const navigate = useNavigate()

    const handleSubscribe = (plan) => {
        setLoading(plan)
        setTimeout(() => {
            setLoading(false)
            setSuccess(plan)
            setTimeout(() => setSuccess(null), 3000)
        }, 1500)
    }

    const plans = [
        {
            name: "Amateur",
            priceMonthly: 0,
            priceAnnual: 0,
            description: "Perfect for testing the waters and getting basic analytics.",
            features: [
                "Up to 5 video uploads per month",
                "Basic joint angle tracking",
                "Standard speed analysis",
                "Community support"
            ],
            missing: [
                "Detailed stance breakdown",
                "AI Coach Suggestions",
                "3D Pose estimation"
            ],
            icon: <Shield className="w-8 h-8 text-slate-400" />
        },
        {
            name: "Pro Athlete",
            popular: true,
            priceMonthly: 19,
            priceAnnual: 15,
            description: "Unlock full computer vision analysis for regular training.",
            features: [
                "Unlimited video uploads",
                "Advanced biomechanical breakdown",
                "Actionable AI Coaching tips",
                "Side-by-side comparison mode",
                "Priority cloud processing"
            ],
            missing: [
                "3D Pose estimation"
            ],
            icon: <Zap className="w-8 h-8 text-primary-500" />
        },
        {
            name: "Elite Academy",
            priceMonthly: 49,
            priceAnnual: 39,
            description: "For teams, academies, and professional setups.",
            features: [
                "Everything in Pro Athlete",
                "Full 3D Pose estimation",
                "Multi-player roster management",
                "API Access to raw data",
                "Dedicated Account Manager",
                "White-label PDF reports"
            ],
            missing: [],
            icon: <Sparkles className="w-8 h-8 text-amber-500" />
        }
    ]

    return (
        <div className="max-w-7xl mx-auto space-y-12 pb-24 overflow-hidden pt-8">
            <div className="text-center space-y-6 relative">
                <div className="absolute top-0 right-1/4 w-96 h-96 bg-primary-300 rounded-full blur-[100px] opacity-20 -z-10"></div>
                <div className="absolute top-10 left-1/4 w-64 h-64 bg-indigo-300 rounded-full blur-[100px] opacity-20 -z-10"></div>

                <motion.h1 
                    initial={{ opacity: 0, y: -20 }} 
                    animate={{ opacity: 1, y: 0 }} 
                    className="text-5xl font-black tracking-tight text-gray-900 sm:text-7xl"
                >
                    Train like a <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-indigo-500">Professional</span>
                </motion.h1>
                <motion.p 
                    initial={{ opacity: 0 }} 
                    animate={{ opacity: 1 }} 
                    transition={{ delay: 0.1 }}
                    className="max-w-2xl mx-auto text-xl text-gray-500 font-medium"
                >
                    Unlock the full potential of computer vision. Get elite coaching insights for a fraction of the cost of a private coach.
                </motion.p>
                
                {/* Billing Toggle */}
                <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }} 
                    animate={{ opacity: 1, scale: 1 }} 
                    transition={{ delay: 0.2 }}
                    className="flex justify-center items-center mt-8 space-x-6"
                >
                    <span className={`text-lg font-bold ${!annual ? 'text-gray-900' : 'text-gray-400'}`}>Monthly</span>
                    <button 
                        onClick={() => setAnnual(!annual)}
                        className="relative w-20 h-10 rounded-full bg-primary-600 p-1 transition-colors focus:outline-none focus:ring-4 focus:ring-primary-500/30"
                    >
                        <div className={`w-8 h-8 bg-white rounded-full shadow-lg transform transition-transform duration-300 ${annual ? 'translate-x-10' : 'translate-x-0'}`}></div>
                    </button>
                    <span className={`text-lg font-bold flex items-center ${annual ? 'text-gray-900' : 'text-gray-400'}`}>
                        Annually <span className="ml-2 text-xs font-black text-green-700 bg-green-100 px-2 py-1 rounded-full">-20%</span>
                    </span>
                </motion.div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 px-4 sm:px-6 z-10 relative">
                {plans.map((plan, index) => (
                    <motion.div 
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.15, type: 'spring' }}
                        key={plan.name} 
                        className={`bg-white rounded-[2rem] p-8 shadow-xl flex flex-col relative transition duration-300 ${plan.popular ? 'border-2 border-primary-500 transform lg:-translate-y-4' : 'border border-gray-100 hover:shadow-2xl'}`}
                    >
                        {plan.popular && (
                            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                                <span className="bg-primary-500 text-white px-4 py-1.5 rounded-full text-xs font-black tracking-widest uppercase shadow-lg shadow-primary-500/40">
                                    Most Popular
                                </span>
                            </div>
                        )}
                        <div className="mb-6 flex items-center justify-between">
                            <div>
                                <h3 className="text-2xl font-bold text-gray-900">{plan.name}</h3>
                                <p className="text-gray-500 text-sm mt-1">{plan.description}</p>
                            </div>
                            <div className="p-3 bg-gray-50 rounded-2xl">{plan.icon}</div>
                        </div>

                        <div className="mb-8 flex items-end">
                            <span className="text-6xl font-black text-gray-900 tracking-tighter">
                                ${annual ? plan.priceAnnual : plan.priceMonthly}
                            </span>
                            <span className="text-lg font-bold text-gray-400 ml-2 mb-2">/mo</span>
                        </div>

                        <ul className="space-y-4 flex-1 mb-8">
                            {plan.features.map((feature, i) => (
                                <li key={i} className="flex items-start">
                                    <CheckCircle className="w-5 h-5 text-primary-500 shrink-0 mr-3 mt-0.5" />
                                    <span className="text-gray-700 font-medium">{feature}</span>
                                </li>
                            ))}
                            {plan.missing.map((feature, i) => (
                                <li key={`missing-${i}`} className="flex items-start text-gray-400">
                                    <X className="w-5 h-5 text-gray-300 shrink-0 mr-3 mt-0.5" />
                                    <span className="font-medium">{feature}</span>
                                </li>
                            ))}
                        </ul>

                        <button 
                            onClick={() => handleSubscribe(plan.name)}
                            disabled={loading === plan.name || success === plan.name}
                            className={`w-full py-4 rounded-xl font-bold text-lg transition-all duration-300 flex justify-center items-center ${
                                success === plan.name
                                    ? 'bg-green-500 text-white'
                                    : plan.popular 
                                        ? 'bg-primary-600 hover:bg-primary-700 text-white shadow-xl shadow-primary-600/30' 
                                        : 'bg-gray-100 hover:bg-gray-200 text-gray-900'
                            }`}
                        >
                            {loading === plan.name ? (
                                <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            ) : success === plan.name ? (
                                <>Subscribed <CheckCircle className="w-5 h-5 ml-2" /></>
                            ) : (
                                plan.priceMonthly === 0 ? 'Current Plan' : 'Select Plan'
                            )}
                        </button>
                    </motion.div>
                ))}
            </div>

            {/* Simulated payment banner */}
            <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="mt-16 bg-blue-50/50 border border-blue-100 rounded-3xl p-8 max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between shadow-sm">
                <div className="flex items-center mb-4 sm:mb-0">
                    <AlertCircle className="w-8 h-8 text-blue-500 mr-4 shrink-0" />
                    <div>
                        <h4 className="text-lg font-bold text-blue-900">Secure Payment Processing</h4>
                        <p className="text-blue-700 font-medium mt-1">Stripe integration is used in the production environment. No actual charges are made in this demo.</p>
                    </div>
                </div>
            </motion.div>
        </div>
    )
}
