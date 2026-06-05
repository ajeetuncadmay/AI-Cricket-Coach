import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Activity, Mail, Lock, AlertCircle, ArrowRight } from 'lucide-react'
import api from '../services/api'

export default function Login() {
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
            const controller = new AbortController()
            const id = setTimeout(() => controller.abort(), 10000) // 10s timeout
            const response = await api.post('/login', { email, password }, { signal: controller.signal })
            clearTimeout(id)
            localStorage.setItem('token', response.data.access_token)
            navigate('/dashboard')
        } catch (err) {
            console.error('Login error:', err)
            if (err.name === 'AbortError') {
                setError('Authentication server is unresponsive. Please try again.')
            } else {
                setError(err.response?.data?.detail || 'Failed to login. Please check credentials.')
            }
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="flex min-h-screen bg-white">
            {/* Left Side - Form */}
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
                        Welcome back
                    </h2>
                    <p className="mt-3 text-base text-gray-500 font-medium">
                        Don't have an account?{' '}
                        <Link to="/register" className="text-primary-600 hover:text-primary-500 shadow-[0_1px_0] shadow-primary-200 transition-all">
                            Start for free
                        </Link>
                    </p>

                    <div className="mt-8">
                        <form className="space-y-6" onSubmit={handleSubmit}>
                            {error && (
                                <div className="bg-red-50/80 border border-red-100 rounded-xl p-4 flex items-start gap-3 animate-fade-in text-red-800">
                                    <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
                                    <p className="text-sm font-medium">{error}</p>
                                </div>
                            )}

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
                                className="w-full flex items-center justify-center py-3.5 px-4 border border-transparent rounded-xl shadow-lg text-sm font-bold text-white bg-primary-600 hover:bg-primary-700 hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:hover:translate-y-0 transition-all group"
                            >
                                {loading ? (
                                    <Activity className="animate-spin h-5 w-5 text-white" />
                                ) : (
                                    <>
                                        Sign in to account
                                        <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                                    </>
                                )}
                            </button>
                        </form>
                    </div>
                </div>
            </div>

            {/* Right Side - Image/Gradient */}
            <div className="hidden lg:block relative w-0 flex-1 overflow-hidden bg-gray-900">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-900 via-primary-900 to-slate-900 opacity-90 mix-blend-multiply z-10"></div>
                <div className="absolute inset-0 z-20 flex flex-col justify-center items-start px-20">
                    <h2 className="text-5xl font-black text-white tracking-tight leading-tight max-w-xl">
                        Perfect your technique with AI precision ajeet singh
                    </h2>
                    <p className="mt-6 text-xl text-indigo-100 max-w-lg font-light leading-relaxed">
                        Join thousands of players taking their game to the next level using state-of-the-art computer vision algorithms.
                    </p>

                    <div className="mt-12 flex items-center space-x-6">
                        <div className="flex -space-x-3">
                            {[1, 2, 3, 4].map(i => (
                                <div key={i} className="h-12 w-12 rounded-full border-2 border-primary-900 bg-white shadow-sm flex items-center justify-center font-bold text-primary-900 text-xs">
                                    P{i}
                                </div>
                            ))}
                        </div>
                        <div className="text-white">
                            <p className="font-bold text-lg">4.9/5 Rating</p>
                            <p className="text-primary-200 text-sm">from 2,000+ players</p>
                        </div>
                    </div>
                </div>

                {/* Decorative Elements */}
                <div className="absolute -top-24 -right-24 w-96 h-96 bg-primary-500 rounded-full mix-blend-overlay filter blur-3xl opacity-50 z-10"></div>
                <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-indigo-500 rounded-full mix-blend-overlay filter blur-3xl opacity-50 z-10"></div>
            </div>
        </div>
    )
}
