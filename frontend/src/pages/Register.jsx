import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Activity, Mail, Lock, User, AlertCircle, ArrowRight } from 'lucide-react'
import api from '../services/api'

export default function Register() {
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')
        setLoading(true)

        try {
            await api.post('/register', { name, email, password })
            navigate('/login')
        } catch (err) {
            setError(err.response?.data?.detail || 'Failed to register')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="flex min-h-screen bg-white flex-row-reverse">
            {/* Right Side - Form */}
            <div className="flex-1 flex flex-col justify-center py-12 px-4 sm:px-6 lg:flex-none lg:w-[480px] xl:w-[560px] lg:px-20 xl:px-24">
                <div className="mx-auto w-full max-w-sm lg:w-96 animate-slide-up">
                    <div className="flex items-center gap-2 mb-8 cursor-pointer" onClick={() => navigate('/')}>
                        <div className="bg-primary-600 p-2 rounded-xl">
                            <Activity className="h-6 w-6 text-white" />
                        </div>
                        <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600">
                            Cricket Coach
                        </span>
                    </div>

                    <h2 className="text-4xl font-extrabold text-gray-900 tracking-tight">
                        Create account
                    </h2>
                    <p className="mt-3 text-base text-gray-500 font-medium">
                        Already joined?{' '}
                        <Link to="/login" className="text-primary-600 hover:text-primary-500 shadow-[0_1px_0] shadow-primary-200 transition-all">
                            Sign in instead
                        </Link>
                    </p>

                    <div className="mt-8">
                        <form className="space-y-5" onSubmit={handleSubmit}>
                            {error && (
                                <div className="bg-red-50/80 border border-red-100 rounded-xl p-4 flex items-start gap-3 animate-fade-in text-red-800">
                                    <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
                                    <p className="text-sm font-medium">{error}</p>
                                </div>
                            )}

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                                    Full Name
                                </label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 group-focus-within:text-primary-500 transition-colors">
                                        <User className="h-5 w-5" />
                                    </div>
                                    <input
                                        type="text"
                                        required
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        className="pl-10 block w-full rounded-xl border-gray-200 bg-gray-50 border py-3 px-4 text-gray-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all sm:text-sm font-medium"
                                        placeholder="Virat Kohli"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                                    Email address
                                </label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 group-focus-within:text-primary-500 transition-colors">
                                        <Mail className="h-5 w-5" />
                                    </div>
                                    <input
                                        type="email"
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="pl-10 block w-full rounded-xl border-gray-200 bg-gray-50 border py-3 px-4 text-gray-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all sm:text-sm font-medium"
                                        placeholder="you@example.com"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                                    Password
                                </label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 group-focus-within:text-primary-500 transition-colors">
                                        <Lock className="h-5 w-5" />
                                    </div>
                                    <input
                                        type="password"
                                        required
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="pl-10 block w-full rounded-xl border-gray-200 bg-gray-50 border py-3 px-4 text-gray-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all sm:text-sm font-medium"
                                        placeholder="••••••••"
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full flex items-center justify-center py-3.5 px-4 border border-transparent rounded-xl shadow-lg text-sm font-bold text-white bg-gray-900 hover:bg-gray-800 hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 disabled:opacity-50 disabled:hover:translate-y-0 transition-all group mt-2"
                            >
                                {loading ? (
                                    <Activity className="animate-spin h-5 w-5 text-white" />
                                ) : (
                                    <>
                                        Get Started
                                        <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                                    </>
                                )}
                            </button>
                        </form>
                    </div>
                </div>
            </div>

            {/* Left Side - Image/Gradient */}
            <div className="hidden lg:block relative w-0 flex-1 overflow-hidden bg-primary-900">
                {/* Interesting background pattern instead of just gradient */}
                <div className="absolute inset-0 z-0">
                    <svg className="absolute w-full h-full opacity-[0.03]" xmlns="http://www.w3.org/2000/svg">
                        <defs><pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse"><path d="M0 40V0h40" fill="none" stroke="white" strokeWidth="2"/></pattern></defs><rect width="100%" height="100%" fill="url(#grid)" />
                    </svg>
                </div>
                <div className="absolute inset-0 bg-gradient-to-tr from-indigo-900 via-primary-800 to-primary-900 opacity-90 mix-blend-multiply z-10"></div>
                <div className="absolute inset-0 z-20 flex flex-col justify-center items-start px-24">
                    <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl mb-8 border border-white/20">
                        <Activity className="h-8 w-8 text-primary-200" />
                    </div>
                    <h2 className="text-5xl font-black text-white tracking-tight leading-tight max-w-xl">
                        AI-Powered Cricket Analytics
                    </h2>
                    <p className="mt-6 text-xl text-primary-100 max-w-lg font-light leading-relaxed">
                        Upload your batting or bowling videos and receive instant biomechanical feedback scored by our advanced AI model.
                    </p>
                    
                    <ul className="mt-10 space-y-4">
                        {['Instant technique grading', 'Biomechanical angle checks', 'Personalized pro tips'].map((item, idx) => (
                            <li key={idx} className="flex items-center text-primary-50">
                                <div className="bg-primary-500/30 rounded-full p-1 mr-3">
                                    <svg className="w-4 h-4 text-primary-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                    </svg>
                                </div>
                                <span className="font-medium text-lg tracking-wide">{item}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    )
}
