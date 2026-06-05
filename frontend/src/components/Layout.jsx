import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'

export default function Layout() {
    return (
        <div className="flex h-screen bg-[#050505] text-white relative overflow-hidden selection:bg-indigo-500 selection:text-white font-sans">
            
            {/* Ambient Background Glows */}
            <div className="fixed top-0 left-0 w-full h-full overflow-hidden focus:outline-none pointer-events-none z-0">
                <div className="absolute top-[-20%] left-[10%] w-[50%] h-[50%] rounded-full bg-indigo-600/30 blur-[150px] animate-blob mix-blend-screen"></div>
                <div className="absolute bottom-[-10%] right-[10%] w-[40%] h-[60%] rounded-full bg-blue-500/30 blur-[180px] animate-blob animation-delay-2000 mix-blend-screen"></div>
                <div className="absolute top-[30%] right-[20%] w-[30%] h-[30%] rounded-full bg-purple-600/20 blur-[120px] animate-blob animation-delay-4000 mix-blend-screen"></div>
            </div>

            {/* Sidebar Layout */}
            <div className="relative z-20 h-full">
                <Sidebar />
            </div>

            {/* Main Application Area (Scrollable) */}
            <main className="flex-1 relative z-10 overflow-y-auto w-full px-4 sm:px-8 py-6 custom-scrollbar">
                
                {/* Topbar Header representing User Details from Image */}
                <div className="flex justify-end items-center mb-10 gap-4">
                    <div className="hidden sm:flex items-center bg-[#11111a]/80 backdrop-blur-md rounded-2xl px-4 py-2 border border-gray-800 shadow-md">
                        <div className="w-5 h-5 rounded-full bg-yellow-500/20 flex items-center justify-center mr-2 border border-yellow-500/30">
                            <svg className="w-3 h-3 text-yellow-500" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-[9px] font-bold text-gray-500 uppercase tracking-widest leading-none">Credits Left</span>
                            <span className="font-black text-white text-sm">15</span>
                        </div>
                    </div>

                    <div className="hidden sm:flex items-center bg-[#11111a]/80 backdrop-blur-md rounded-2xl pr-4 pl-3 py-2 border border-gray-800 shadow-md text-sm gap-2 whitespace-nowrap">
                        <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Plan</span>
                        <span className="text-indigo-400 font-bold bg-indigo-500/10 px-2 rounded">Pro</span>
                    </div>

                    <div className="w-12 h-12 rounded-2xl bg-[#11111a]/80 backdrop-blur-md border border-gray-800 flex items-center justify-center relative shadow-md cursor-pointer hover:bg-gray-800 transition">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-gray-300"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>
                        <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-[#11111a] flex items-center justify-center text-[9px] font-black">2</span>
                    </div>

                    {/* Theme Toggle Button */}
                    <div className="w-16 h-8 rounded-full bg-[#11111a]/80 backdrop-blur-md border border-gray-700 flex items-center p-1 cursor-pointer hover:border-gray-500 transition shadow-inner">
                        <div className="w-6 h-6 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 shadow flex items-center justify-center translate-x-8 transition-transform duration-300">
                             <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"></path></svg>
                        </div>
                    </div>

                    <div className="flex items-center bg-[#11111a]/80 backdrop-blur-md rounded-2xl p-1.5 pr-4 border border-gray-800 shadow-md gap-3 cursor-pointer hover:bg-gray-800 transition">
                        <div className="w-9 h-9 rounded-xl overflow-hidden bg-gray-800 border border-gray-700">
                            <img src="https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&w=100&q=80" alt="Rahul" className="w-full h-full object-cover"/>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-xs font-black text-white leading-tight">Rahul Sharma</span>
                            <span className="text-[10px] text-purple-400 font-bold tracking-wide">Premium User</span>
                        </div>
                        <div className="ml-2 text-gray-500">
                             <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 12 15 18 9"></polyline></svg>
                        </div>
                    </div>
                </div>

                <div className="animate-fade-in relative z-10 w-full mx-auto max-w-[1400px]">
                    <Outlet />
                </div>
            </main>
        </div>
    )
}
