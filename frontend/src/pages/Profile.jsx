import { User, Activity, Trophy, Crown, CheckCircle2 } from 'lucide-react'

export default function Profile() {
    return (
        <div className="max-w-[1000px] mx-auto space-y-8 pb-12">
            <h1 className="text-3xl font-black text-white leading-tight mb-2">Player Profile</h1>
            <p className="text-gray-400 text-sm font-medium mb-8">Manage your details & subscription tier</p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Left Col: Main Profile Card */}
                <div className="md:col-span-1 bg-[#11111a]/80 backdrop-blur-xl border border-gray-800 rounded-[2rem] p-8 shadow-2xl flex flex-col items-center relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 blur-3xl rounded-full"></div>
                    <div className="w-32 h-32 rounded-full bg-gradient-to-tr from-indigo-600 to-purple-600 p-1 mb-6 shadow-xl shadow-indigo-600/20 relative z-10">
                        <img src="https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&w=300&q=80" alt="Rahul" className="w-full h-full rounded-full object-cover border-4 border-[#11111a]" />
                    </div>
                    <h2 className="text-2xl font-black text-white">Rahul Sharma</h2>
                    <p className="text-indigo-400 font-bold text-sm my-1 tracking-wide">Right Hand Batsman</p>
                    <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Premium Member</span>

                    <div className="w-full h-px bg-gray-800 my-6"></div>

                    <div className="w-full space-y-4">
                        <div className="flex justify-between items-center text-sm">
                            <span className="text-gray-500 font-bold">Age</span>
                            <span className="text-white font-bold bg-[#1a1a24] px-3 py-1 rounded-lg">24</span>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                            <span className="text-gray-500 font-bold">Experience</span>
                            <span className="text-white font-bold bg-[#1a1a24] px-3 py-1 rounded-lg">Pro</span>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                            <span className="text-gray-500 font-bold">Total Sessions</span>
                            <span className="text-white font-bold bg-[#1a1a24] px-3 py-1 rounded-lg">42</span>
                        </div>
                    </div>
                </div>

                {/* Right Col: Stats & Sub */}
                <div className="md:col-span-2 flex flex-col gap-6">
                    {/* Stats Grids */}
                    <div className="grid grid-cols-2 gap-6">
                        <div className="bg-[#11111a]/80 backdrop-blur-xl border border-gray-800 rounded-[2rem] p-8 shadow-2xl">
                            <div className="flex items-center text-emerald-500 mb-4">
                                <Trophy className="w-6 h-6 mr-3" />
                                <h3 className="text-sm font-bold uppercase tracking-widest">Avg Score</h3>
                            </div>
                            <p className="text-5xl font-black text-white mt-2">84<span className="text-lg text-gray-500">/100</span></p>
                            <p className="text-xs text-gray-500 font-medium mt-4">Top 15% of all users</p>
                        </div>
                        <div className="bg-[#11111a]/80 backdrop-blur-xl border border-gray-800 rounded-[2rem] p-8 shadow-2xl">
                            <div className="flex items-center text-indigo-500 mb-4">
                                <Activity className="w-6 h-6 mr-3" />
                                <h3 className="text-sm font-bold uppercase tracking-widest">Credits</h3>
                            </div>
                            <p className="text-5xl font-black text-white mt-2">15</p>
                            <p className="text-xs text-gray-500 font-medium mt-4">Credits reset in 12 days</p>
                        </div>
                    </div>

                    {/* Subscription Sub */}
                    <div className="bg-[#11111a]/80 backdrop-blur-xl border border-purple-500/30 rounded-[2rem] p-8 shadow-2xl relative overflow-hidden flex-1">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/10 blur-[80px] rounded-full pointer-events-none"></div>
                        <div className="relative z-10">
                            <div className="flex items-center text-purple-400 mb-6">
                                <Crown className="w-6 h-6 mr-3" />
                                <h3 className="text-sm font-bold uppercase tracking-widest">Current Plan</h3>
                            </div>
                            
                            <div className="flex justify-between items-end">
                                <div>
                                    <h4 className="text-3xl font-black text-white mb-2">Pro Tier</h4>
                                    <p className="text-gray-400 text-sm">₹999 / month</p>
                                </div>
                                <button className="bg-white text-black font-bold py-2.5 px-6 rounded-xl hover:bg-gray-200 transition text-sm">
                                    Manage Billing
                                </button>
                            </div>

                            <div className="w-full h-px bg-gray-800 my-6"></div>

                            <div className="grid grid-cols-2 gap-y-3 gap-x-6 text-sm">
                                <div className="flex items-center text-gray-300"><CheckCircle2 className="w-4 h-4 text-purple-500 mr-2 shrink-0" /> HD Video Downloads</div>
                                <div className="flex items-center text-gray-300"><CheckCircle2 className="w-4 h-4 text-purple-500 mr-2 shrink-0" /> Priority Server Access</div>
                                <div className="flex items-center text-gray-300"><CheckCircle2 className="w-4 h-4 text-purple-500 mr-2 shrink-0" /> PDF Biomechanics Report</div>
                                <div className="flex items-center text-gray-300"><CheckCircle2 className="w-4 h-4 text-purple-500 mr-2 shrink-0" /> 50 Sessions / Month</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
