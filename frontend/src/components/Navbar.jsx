import { Link, useNavigate, useLocation } from 'react-router-dom'
import { LogOut, Activity, UploadCloud, UserCircle, Menu, X } from 'lucide-react'
import { useState } from 'react'

export default function Navbar() {
    const navigate = useNavigate()
    const location = useLocation()
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

    const handleLogout = () => {
        localStorage.removeItem('token')
        navigate('/login')
    }

    const isActive = (path) => location.pathname === path

    return (
        <nav className="sticky top-0 z-50 bg-[#050505]/80 backdrop-blur-xl border-b border-gray-800/80 shadow-md transition-all duration-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-20">
                    <div className="flex items-center">
                        <div className="flex-shrink-0 flex items-center group cursor-pointer" onClick={() => navigate('/dashboard')}>
                            <div className="bg-gradient-to-tr from-primary-600 to-indigo-500 p-2 rounded-xl shadow-lg shadow-primary-500/20 group-hover:shadow-primary-500/40 group-hover:-translate-y-0.5 transition-all">
                                <Activity className="h-6 w-6 text-white" />
                            </div>
                            <span className="ml-3 text-2xl font-black text-white tracking-tight">
                                AI Cricket Coach
                            </span>
                        </div>
                        <div className="hidden sm:ml-12 sm:flex sm:space-x-8">
                            <Link
                                to="/dashboard"
                                className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-semibold transition-colors duration-200 ${isActive('/dashboard')
                                        ? 'border-primary-500 text-white'
                                        : 'border-transparent text-gray-400 hover:text-white hover:border-gray-600'
                                    }`}
                            >
                                Dashboard
                            </Link>
                            <Link
                                to="/sessions"
                                className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-semibold transition-colors duration-200 ${isActive('/sessions')
                                        ? 'border-primary-500 text-white'
                                        : 'border-transparent text-gray-400 hover:text-white hover:border-gray-600'
                                    }`}
                            >
                                My Sessions
                            </Link>
                            <Link
                                to="/upload"
                                className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-semibold transition-colors duration-200 ${isActive('/upload')
                                        ? 'border-primary-500 text-white'
                                        : 'border-transparent text-gray-400 hover:text-white hover:border-gray-600'
                                    }`}
                            >
                                <UploadCloud className="h-4 w-4 mr-1.5" />
                                New Analysis
                            </Link>
                        </div>
                    </div>

                    {/* Desktop Right side */}
                    <div className="hidden sm:flex items-center space-x-4">
                        <Link to="/pricing" className="flex items-center text-sm font-bold text-white bg-gray-800/50 hover:bg-gray-700 hover:shadow-lg px-4 py-2 rounded-full border border-gray-700/50 transition-all group">
                            <UserCircle className="h-5 w-5 text-primary-400 mr-2 group-hover:scale-110 transition-transform" />
                            Upgrade to Pro
                        </Link>
                        <button
                            onClick={handleLogout}
                            className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-full flex items-center transition-all duration-200 group"
                            title="Logout"
                        >
                            <LogOut className="h-5 w-5" />
                        </button>
                    </div>

                    {/* Mobile menu button */}
                    <div className="flex items-center sm:hidden">
                        <button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-800 focus:outline-none transition-all z-[60]"
                        >
                            <span className="sr-only">Open main menu</span>
                            {mobileMenuOpen ? (
                                <X className="block h-6 w-6" aria-hidden="true" />
                            ) : (
                                <Menu className="block h-6 w-6" aria-hidden="true" />
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile menu */}
            {mobileMenuOpen && (
                <div className="sm:hidden bg-[#0a0a0a] border-t border-gray-800 shadow-2xl fixed inset-0 top-20 z-[100] animate-slide-up origin-top">
                    <div className="pt-2 pb-3 space-y-1">
                        <Link
                            to="/dashboard"
                            className={`block pl-3 pr-4 py-4 border-l-4 text-base font-bold ${isActive('/dashboard')
                                    ? 'bg-primary-900/30 border-primary-500 text-white'
                                    : 'border-transparent text-gray-400 hover:bg-gray-800 hover:text-white'
                                }`}
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            Dashboard
                        </Link>
                        <Link
                            to="/sessions"
                            className={`block pl-3 pr-4 py-4 border-l-4 text-base font-bold ${isActive('/sessions')
                                    ? 'bg-primary-900/30 border-primary-500 text-white'
                                    : 'border-transparent text-gray-400 hover:bg-gray-800 hover:text-white'
                                }`}
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            My Sessions
                        </Link>
                        <Link
                             to="/upload"
                             className={`flex items-center pl-3 pr-4 py-4 border-l-4 text-base font-bold ${isActive('/upload')
                                     ? 'bg-primary-900/30 border-primary-500 text-white'
                                     : 'border-transparent text-gray-400 hover:bg-gray-800 hover:text-white'
                                 }`}
                             onClick={() => setMobileMenuOpen(false)}
                         >
                             <UploadCloud className="h-5 w-5 mr-3" />
                             New Analysis
                         </Link>
                    </div>
                    <div className="pt-4 pb-3 border-t border-gray-800">
                        <div className="flex items-center px-4">
                            <div className="flex-shrink-0">
                                <UserCircle className="h-10 w-10 text-primary-500" />
                            </div>
                            <div className="ml-3">
                                <Link to="/pricing" onClick={() => setMobileMenuOpen(false)} className="text-base font-bold text-white block">Upgrade to Pro</Link>
                                <div className="text-sm font-medium text-gray-400">View Premium Plans</div>
                            </div>
                        </div>
                        <div className="mt-4 space-y-1">
                            <button
                                onClick={handleLogout}
                                className="block w-full text-left px-4 py-3 text-base font-medium text-red-500 hover:text-red-400 hover:bg-red-500/10 transition"
                            >
                                Sign out
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </nav>
    )
}
