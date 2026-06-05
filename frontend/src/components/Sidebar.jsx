import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Home, UploadCloud, LayoutDashboard, BarChart2, User, Crown, HelpCircle, LogOut } from 'lucide-react'

export default function Sidebar() {
    const location = useLocation()
    const navigate = useNavigate()
    const currentPath = location.pathname

    const menuItems = [
        { name: 'Dashboard', path: '/dashboard', icon: <Home className="w-5 h-5 mr-3" /> },
        { name: 'Upload & Analyze', path: '/upload', icon: <UploadCloud className="w-5 h-5 mr-3" /> },
        { name: 'My Sessions', path: '/sessions', icon: <LayoutDashboard className="w-5 h-5 mr-3" /> },
        { name: 'Analytics & Reports', path: '/analytics', icon: <BarChart2 className="w-5 h-5 mr-3" /> },
        { name: 'Player Profile', path: '/profile', icon: <User className="w-5 h-5 mr-3" /> },
        { name: 'Pricing / Upgrade', path: '/pricing', icon: <Crown className="w-5 h-5 mr-3" /> },
    ]

    return (
        <div className="w-[280px] h-screen bg-[#0a0a0f]/90 backdrop-blur-3xl border-r border-gray-800/80 flex flex-col shrink-0">
            {/* Logo Section */}
            <div className="p-6">
                <Link to="/" className="flex items-center gap-3">
                    <div className="relative w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center overflow-hidden border-2 border-indigo-500/50">
                        <div className="absolute inset-0 bg-white/20 skew-x-12 translate-x-3"></div>
                        <span className="text-white font-black text-xl">AC</span>
                    </div>
                    <div>
                        <h1 className="text-xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-300 to-purple-400 leading-none">AI CRICKET</h1>
                        <h1 className="text-xl font-black text-white leading-none">COACH</h1>
                    </div>
                </Link>
            </div>

            {/* Menu Label */}
            <div className="px-6 mt-4 mb-2">
                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">MAIN MENU</p>
            </div>

            {/* Nav Links */}
            <nav className="flex-1 px-4 space-y-2">
                {menuItems.map((item) => {
                    const isActive = currentPath.includes(item.path) || (item.path === '/dashboard' && currentPath === '/')
                    return (
                        <Link
                            key={item.name}
                            to={item.path}
                            className={`flex items-center px-4 py-3 text-sm font-bold rounded-2xl transition-all ${
                                isActive
                                    ? 'bg-gradient-to-r from-indigo-600/20 to-purple-600/10 text-white border border-indigo-500/30 shadow-inner'
                                    : 'text-gray-400 hover:text-white hover:bg-gray-800/50 border border-transparent'
                            }`}
                        >
                            <div className={isActive ? 'text-indigo-400' : 'text-gray-500'}>
                                {item.icon}
                            </div>
                            {item.name}
                        </Link>
                    )
                })}
            </nav>

            {/* Quick Guide Card */}
            <div className="p-6">
                <div className="bg-[#11111a] border border-gray-800 rounded-3xl p-5 shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/10 blur-2xl rounded-full pointer-events-none"></div>
                    <div className="flex items-center text-xs font-bold text-yellow-500 mb-4">
                        <HelpCircle className="w-4 h-4 mr-2" /> QUICK GUIDE
                    </div>
                    <div className="space-y-4">
                        <div className="flex items-start">
                            <div className="w-5 h-5 rounded-full bg-indigo-600 flex items-center justify-center text-[10px] font-black text-white shrink-0 mt-0.5">1</div>
                            <div className="ml-3">
                                <p className="text-xs font-bold text-white leading-tight">Upload or Capture</p>
                                <p className="text-[10px] text-gray-500">Add batting/bowling media</p>
                            </div>
                        </div>
                        <div className="flex items-start">
                            <div className="w-5 h-5 rounded-full bg-indigo-600 flex items-center justify-center text-[10px] font-black text-white shrink-0 mt-0.5">2</div>
                            <div className="ml-3">
                                <p className="text-xs font-bold text-white leading-tight">AI Processing</p>
                                <p className="text-[10px] text-gray-500">Model analyzes biomechanics</p>
                            </div>
                        </div>
                        <div className="flex items-start">
                            <div className="w-5 h-5 rounded-full bg-indigo-600 flex items-center justify-center text-[10px] font-black text-white shrink-0 mt-0.5">3</div>
                            <div className="ml-3">
                                <p className="text-xs font-bold text-white leading-tight">Get Report</p>
                                <p className="text-[10px] text-gray-500">View score, angles & tips</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            {/* Logout & Footer */}
            <div className="px-6 pb-6">
                <button 
                    onClick={() => {
                        localStorage.removeItem('token')
                        navigate('/login')
                    }}
                    className="w-full flex items-center justify-center px-4 py-3 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-500 rounded-xl transition-all cursor-pointer font-bold text-sm mb-4"
                >
                    <LogOut className="w-4 h-4 mr-2" /> Log Out
                </button>
                <div className="text-center">
                    <p className="text-[10px] text-gray-600 font-bold">Powered by Ajeet Singh ❤️</p>
                </div>
            </div>
        </div>
    )
}
