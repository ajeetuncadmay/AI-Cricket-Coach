import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { 
    ArrowLeft, Download, User, Activity, AlertCircle, CheckCircle2, 
    Map, Play, Image as ImageIcon, Crosshair, ChevronRight, Target, 
    BrainCircuit, RefreshCw, Trophy, Gauge, ListChecks, ArrowUpRight
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { Radar, Line } from 'react-chartjs-2'
import {
    Chart as ChartJS,
    RadialLinearScale,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Filler,
    Tooltip,
    Legend
} from 'chart.js'
import api from '../services/api'

ChartJS.register(
    RadialLinearScale,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Filler,
    Tooltip,
    Legend
)

export default function Analytics() {
    const { id } = useParams()
    const [session, setSession] = useState(null)
    const [error, setError] = useState(null)

    useEffect(() => {
        fetchSessionDetails()
    }, [id])

    const fetchSessionDetails = async () => {
        setLoading(true)
        setError(null)
        try {
            const controller = new AbortController()
            const timeoutId = setTimeout(() => controller.abort(), 12000)
            const { data } = await api.get(`/session/${id}`, { signal: controller.signal })
            clearTimeout(timeoutId)
            setSession(data)
        } catch (error) {
            console.error('Failed to fetch session details', error)
            setError(error.name === 'AbortError' ? 'AI Analysis report is taking longer than usual.' : 'Failed to retrieve analysis data.')
        } finally {
            setLoading(false)
        }
    }

    if (loading) {
        return (
            <div className="flex flex-col justify-center items-center h-screen bg-[#020205] space-y-6">
                <div className="relative">
                    <div className="w-20 h-20 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin"></div>
                    <div className="absolute inset-0 w-20 h-20 border-4 border-transparent border-b-purple-500 rounded-full animate-[spin_1.5s_linear_infinite]"></div>
                </div>
                <div className="text-center">
                    <p className="text-white font-black tracking-widest animate-pulse uppercase text-lg">Analyzing Biomechanics</p>
                    <p className="text-gray-500 text-xs mt-2 uppercase tracking-tight">AI Engine processing skeleton data...</p>
                </div>
            </div>
        )
    }

    if (error || !session || !session.report) {
        return (
            <div className="min-h-screen bg-[#020205] flex items-center justify-center p-6">
                <div className="text-center p-12 bg-[#0a0a0f] rounded-[2.5rem] border border-gray-800/30 max-w-2xl w-full shadow-2xl backdrop-blur-3xl">
                    <div className="w-24 h-24 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-8 relative">
                         <div className="absolute inset-0 bg-red-500/20 blur-2xl rounded-full"></div>
                         <AlertCircle className="w-12 h-12 text-red-500 relative z-10" />
                    </div>
                    <h2 className="text-3xl font-black text-white mb-3">Syncing Interrupted</h2>
                    <p className="text-gray-400 mb-10 text-lg font-medium">
                        {error || "We couldn't retrieve the report for this session. It might still be processing."}
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <button 
                            onClick={fetchSessionDetails}
                            className="inline-flex items-center justify-center bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-4 px-10 rounded-2xl transition-all shadow-xl shadow-indigo-600/30"
                        >
                            <RefreshCw className="w-5 h-5 mr-3" /> Retry Analysis
                        </button>
                        <Link to="/dashboard" className="inline-flex items-center justify-center bg-white/5 hover:bg-white/10 text-white border border-white/10 font-bold py-4 px-10 rounded-2xl transition-all">
                            <ArrowLeft className="w-5 h-5 mr-3" /> Dashboard
                        </Link>
                    </div>
                </div>
            </div>
        )
    }

    const report = session.report
    const scoreColor = report.score >= 85 ? '#10b981' : report.score >= 70 ? '#6366f1' : report.score >= 50 ? '#facc15' : '#ef4444'

    // Helpers
    const getStatus = (val, min, max) => val < min ? 'Low' : val > max ? 'Over' : 'Optimal'
    const getStatusText = (val, min, max) => val < min ? 'Sub-optimal' : val > max ? 'Over-extended' : 'Near Ideal'
    const getStatusBadge = (status) => {
        switch(status) {
            case 'Optimal': return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
            case 'Over': return 'bg-rose-500/20 text-rose-400 border-rose-500/30'
            default: return 'bg-amber-500/20 text-amber-400 border-amber-500/30'
        }
    }

    const radarData = {
        labels: ['Balance', 'Timing', 'Power', 'Footwork', 'Technique'],
        datasets: [
            {
                label: 'Your Perf',
                data: [report.score * 0.9, report.score * 0.82, report.score * 0.75, report.score * 0.88, report.score],
                backgroundColor: 'rgba(99, 102, 241, 0.15)',
                borderColor: '#6366f1',
                borderWidth: 2,
                pointBackgroundColor: '#6366f1',
                pointBorderColor: '#fff',
                pointRadius: 3,
            },
            {
                label: 'Ideal',
                data: [90, 85, 80, 85, 95],
                backgroundColor: 'rgba(52, 211, 153, 0.05)',
                borderColor: 'rgba(52, 211, 153, 0.4)',
                borderWidth: 1.5,
                borderDash: [4, 4],
                pointRadius: 0,
            }
        ]
    }

    const radarOptions = {
        scales: { 
            r: { 
                angleLines: { color: 'rgba(255,255,255,0.05)' }, 
                grid: { color: 'rgba(255,255,255,0.05)' }, 
                pointLabels: { color: '#94a3b8', font: { family: 'Outfit', size: 10, weight: 'bold' } }, 
                ticks: { display: false, max: 100, min: 0 } 
            } 
        },
        plugins: { legend: { display: false } },
        maintainAspectRatio: false
    }

    const trendData = {
        labels: ['S-01', 'S-02', 'S-03', 'S-04', 'S-05'],
        datasets: [
            {
                label: 'Score',
                data: [42, 58, 52, 65, report.score],
                borderColor: '#818cf8',
                backgroundColor: 'rgba(129, 140, 248, 0.1)',
                borderWidth: 3,
                fill: true,
                tension: 0.4,
                pointBackgroundColor: '#fff',
                pointBorderColor: '#818cf8',
                pointBorderWidth: 2,
                pointRadius: 5
            },
            {
                label: 'Ideal',
                data: [85, 85, 85, 85, 85],
                borderColor: 'rgba(16, 185, 129, 0.3)',
                borderWidth: 1.5,
                borderDash: [5, 5],
                fill: false,
                pointRadius: 0
            }
        ]
    }

    const trendOptions = {
        responsive: true,
        plugins: { legend: { display: false } },
        scales: { 
            y: { min: 0, max: 100, grid: { color: 'rgba(255,255,255,0.03)' }, ticks: { color: '#64748b', font: { size: 10 } } },
            x: { grid: { display: false }, ticks: { color: '#64748b', font: { size: 10 } } }
        },
        maintainAspectRatio: false
    }

    const semiCircleScore = (report.score / 100) * 180;

    return (
        <div className="bg-[#020205] min-h-screen font-['Outfit']">
            <motion.div 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                className="max-w-[1600px] mx-auto p-4 md:p-8 space-y-6 text-white"
            >
                {/* --- HEADER --- */}
                <motion.header 
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="flex flex-col lg:flex-row items-center justify-between bg-[#0a0a0f]/60 backdrop-blur-2xl border border-white/5 p-6 rounded-[2rem] shadow-2xl relative overflow-hidden"
                >
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent"></div>
                    <div className="flex items-center gap-6 z-10">
                        <div className="relative group">
                            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-indigo-600 to-violet-600 flex items-center justify-center shadow-xl shadow-indigo-600/20 transition-transform group-hover:scale-105 duration-500">
                                <BrainCircuit className="w-9 h-9 text-white" />
                            </div>
                            <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-emerald-500 rounded-lg flex items-center justify-center text-[10px] font-black border-2 border-[#0a0a0f]">
                                AI
                            </div>
                        </div>
                        <div>
                            <h1 className="text-3xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-200 to-purple-400">AI CRICKET COACH</h1>
                            <p className="text-gray-500 text-sm font-bold tracking-widest uppercase mt-0.5 opacity-80">Biomechanical Analysis Report</p>
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-4 mt-6 lg:mt-0 items-center justify-center lg:justify-end z-10 w-full lg:w-auto">
                        <div className="hidden sm:flex bg-black/40 border border-white/5 px-6 py-3 rounded-2xl items-center gap-8 text-[11px] font-bold uppercase tracking-wider">
                            <div className="flex flex-col">
                                <span className="text-gray-500 mb-0.5">Report ID</span>
                                <span className="text-emerald-400">#ACC-{String(session.id).padStart(6, '0')}</span>
                            </div>
                            <div className="w-px h-8 bg-white/5"></div>
                            <div className="flex flex-col">
                                <span className="text-gray-500 mb-0.5">Date</span>
                                <span className="text-gray-200">{new Date(session.created_at).toLocaleDateString('en-GB', {day: '2-digit', month: 'short', year: 'numeric'})}</span>
                            </div>
                            <div className="w-px h-8 bg-white/5"></div>
                            <div className="flex flex-col">
                                <span className="text-gray-500 mb-0.5">Session</span>
                                <span className="text-purple-400">Batting Shot</span>
                            </div>
                        </div>
                        <a 
                            href={`http://localhost:8000/api/report/${session.id}/download`} 
                            download
                            className="bg-indigo-600 hover:bg-indigo-500 text-white font-black py-4 px-8 rounded-2xl flex items-center shadow-2xl shadow-indigo-600/30 transition-all hover:-translate-y-1 active:scale-95 text-sm"
                        >
                            <Download className="w-4 h-4 mr-3" /> DOWNLOAD PDF
                        </a>
                    </div>
                </motion.header>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    
                    {/* --- LEFT SECTION: Profile & Shot Visual --- */}
                    <div className="lg:col-span-3 space-y-6">
                        {/* Profile Card */}
                        <motion.div 
                            initial={{ x: -20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: 0.1 }}
                            className="bg-[#0a0a0f]/60 backdrop-blur-xl border border-white/5 rounded-[2rem] p-6 shadow-2xl relative group overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 blur-[60px] rounded-full"></div>
                            <div className="flex items-center gap-5 relative z-10">
                                <div className="relative">
                                    <div className="w-20 h-20 rounded-full border-2 border-indigo-500/30 p-1 group-hover:border-indigo-500/60 transition-colors duration-500">
                                        <div className="w-full h-full bg-[#151520] rounded-full flex justify-center items-center overflow-hidden border border-white/5">
                                            <User className="w-10 h-10 text-indigo-400/50" />
                                        </div>
                                    </div>
                                    <div className="absolute inset-0 rounded-full border-r-2 border-t-2 border-emerald-400/40 animate-[spin_6s_linear_infinite]"></div>
                                </div>
                                <div>
                                    <h2 className="text-2xl font-black text-white leading-tight">RAHUL</h2>
                                    <p className="text-gray-500 text-sm font-bold uppercase tracking-tighter">Role: Batsman | Exp: Pro</p>
                                    <div className="flex gap-2 mt-3">
                                        <span className="text-[10px] uppercase font-black bg-white/5 text-gray-400 px-3 py-1 rounded-lg border border-white/5">Age 24</span>
                                        <span className="text-[10px] uppercase font-black bg-emerald-500/10 text-emerald-400 px-3 py-1 rounded-lg border border-emerald-500/10 flex items-center">
                                            <Trophy className="w-2 h-2 mr-1" /> ALL STAR
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        {/* Visual Analysis Card */}
                        <motion.div 
                            initial={{ x: -20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: 0.2 }}
                            className="bg-[#0a0a0f]/60 backdrop-blur-xl border border-white/5 rounded-[2rem] shadow-2xl flex flex-col overflow-hidden relative group aspect-[4/5]"
                        >
                            <div className="p-6 border-b border-white/5 flex justify-between items-center bg-black/20">
                                <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center">
                                    <ImageIcon className="w-4 h-4 mr-2 text-indigo-400" /> SHOT FRAME ANALYSIS
                                </h3>
                                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                            </div>
                            <div className="relative flex-1 bg-black group/img">
                                <img 
                                    src={`http://localhost:8000/api/report/${session.id}/image`} 
                                    alt="Analysis Frame" 
                                    className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-700"
                                    onError={(e) => { e.target.src = "https://images.unsplash.com/photo-1540747913346-19e32fc3e64b?auto=format&fit=crop&w=800&q=80" }}
                                />
                                
                                {/* AI HUD Elements */}
                                <div className="absolute inset-0 p-4 pointer-events-none flex flex-col justify-between">
                                    <div className="space-y-2">
                                        <div className="inline-flex bg-black/60 backdrop-blur-md border border-white/10 rounded-lg px-3 py-2 gap-3 items-center">
                                            <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
                                            <span className="text-[10px] text-white font-bold tracking-tight">Shoulder: {report.shoulder_rotation}°</span>
                                        </div>
                                        <br/>
                                        <div className="inline-flex bg-black/60 backdrop-blur-md border border-white/10 rounded-lg px-3 py-2 gap-3 items-center">
                                            <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                                            <span className="text-[10px] text-white font-bold tracking-tight">Elbow: {report.elbow_angle}°</span>
                                        </div>
                                    </div>

                                    <div className="flex justify-between items-end">
                                        <div className="bg-black/60 backdrop-blur-md border border-white/10 rounded-xl p-3">
                                            <p className="text-[9px] text-gray-500 font-black uppercase">Frame Captured</p>
                                            <p className="text-xs text-white font-bold">at 0.23s</p>
                                        </div>
                                        <a href={`http://localhost:8000/api/report/${session.id}/video`} target="_blank" className="pointer-events-auto bg-indigo-600/90 hover:bg-indigo-500 backdrop-blur p-3 rounded-2xl transition-all shadow-xl">
                                            <Play className="w-5 h-5 text-white" />
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>

                    {/* --- MIDDLE SECTION: Performance Metrics --- */}
                    <div className="lg:col-span-5 space-y-6">
                        {/* Overall Performance Gauge */}
                        <motion.div 
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.1 }}
                            className="bg-[#0a0a0f]/60 backdrop-blur-xl border border-white/5 rounded-[2rem] p-8 shadow-2xl relative overflow-hidden"
                        >
                            <div className="absolute -top-10 -right-10 w-48 h-48 bg-indigo-500/5 blur-[80px] rounded-full"></div>
                            <h3 className="text-xs font-black text-gray-500 uppercase tracking-widest flex items-center mb-8">
                                <Activity className="w-4 h-4 mr-2 text-indigo-400" /> OVERALL PERFORMANCE
                            </h3>
                            
                            <div className="flex flex-col md:flex-row items-center gap-12">
                                <div className="relative w-52 h-32 flex items-end justify-center overflow-hidden">
                                    <svg className="w-full h-full transform -rotate-180" viewBox="0 0 100 55">
                                        <path d="M 10 50 A 40 40 0 0 1 90 50" fill="none" stroke="#1f2937" strokeWidth="8" strokeLinecap="round" />
                                        <motion.path 
                                            d="M 10 50 A 40 40 0 0 1 90 50" fill="none" 
                                            stroke={scoreColor} strokeWidth="8" strokeLinecap="round"
                                            initial={{ pathLength: 0 }}
                                            animate={{ pathLength: report.score / 100 }}
                                            transition={{ duration: 2, ease: "circOut" }}
                                        />
                                    </svg>
                                    <div className="absolute bottom-0 inset-x-0 text-center flex flex-col items-center">
                                        <span className="text-6xl font-black text-white tracking-tighter">{report.score}</span>
                                        <span className="text-xs text-gray-500 font-bold -mt-2">/100</span>
                                    </div>
                                </div>

                                <div className="flex-1 space-y-4 text-center md:text-left">
                                    <div>
                                        <p className="text-[10px] text-gray-500 font-black tracking-widest uppercase mb-1">Current Grade</p>
                                        <span className={`text-3xl font-black italic uppercase tracking-tighter ${report.score >= 85 ? 'text-emerald-400' : report.score >= 60 ? 'text-indigo-400' : 'text-rose-500'}`}>
                                            {report.grade}
                                        </span>
                                    </div>
                                    <p className="text-gray-400 text-sm leading-relaxed font-medium">
                                        {report.grade === 'Poor' ? 'Your biomechanical data is significantly below the professional range.' : 'You have a solid foundation with room for refinement.'}
                                    </p>
                                </div>
                            </div>
                        </motion.div>

                        {/* Metrics Table */}
                        <motion.div 
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.2 }}
                            className="bg-[#0a0a0f]/60 backdrop-blur-xl border border-white/5 rounded-[2rem] p-8 shadow-2xl flex-1"
                        >
                            <h3 className="text-xs font-black text-gray-500 uppercase tracking-widest flex items-center mb-10">
                                <ListChecks className="w-4 h-4 mr-2 text-indigo-400" /> IDEAL vs YOUR COMPARISON
                            </h3>
                            
                            <div className="space-y-10">
                                {[
                                    { label: 'Elbow Angle', icon: <Target className="w-4 h-4" />, val: report.elbow_angle, range: [140, 160], color: 'from-indigo-600 to-indigo-400' },
                                    { label: 'Shoulder Rotation', icon: <RefreshCw className="w-4 h-4" />, val: report.shoulder_rotation, range: [120, 150], color: 'from-purple-600 to-purple-400' },
                                    { label: 'Knee Bend', icon: <Activity className="w-4 h-4" />, val: report.knee_bend, range: [50, 70], color: 'from-rose-600 to-rose-400' }
                                ].map((item, idx) => {
                                    const status = getStatus(item.val, item.range[0], item.range[1]);
                                    const scorePct = Math.min((item.val / (item.range[1] * 1.2)) * 100, 100);
                                    
                                    return (
                                        <div key={idx} className="space-y-4">
                                            <div className="flex justify-between items-end">
                                                <div className="flex items-center gap-3">
                                                    <div className={`w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-gray-400 border border-white/5`}>
                                                        {item.icon}
                                                    </div>
                                                    <div>
                                                        <h4 className="text-sm font-bold text-gray-300">{item.label}</h4>
                                                        <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Ideal: {item.range[0]}° - {item.range[1]}°</p>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-xl font-black text-white">{item.val}°</span>
                                                        <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-md border ${getStatusBadge(status)}`}>
                                                            {status}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="h-2 w-full bg-white/5 rounded-full relative overflow-hidden">
                                                <div className="absolute inset-y-0 bg-indigo-500/10 border-x border-white/10 z-10" style={{ left: `${(item.range[0] / (item.range[1] * 1.2)) * 100}%`, width: `${((item.range[1] - item.range[0]) / (item.range[1] * 1.2)) * 100}%` }}></div>
                                                <motion.div 
                                                    initial={{ width: 0 }}
                                                    animate={{ width: `${scorePct}%` }}
                                                    transition={{ duration: 1.5, delay: 0.5 + (idx*0.2) }}
                                                    className={`absolute inset-y-0 rounded-full bg-gradient-to-r ${item.color} z-20`}
                                                />
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        </motion.div>
                    </div>

                    {/* --- RIGHT SECTION: Analysis & Tips --- */}
                    <div className="lg:col-span-4 space-y-6 flex flex-col">
                        {/* Problems Card */}
                        <motion.div 
                            initial={{ x: 20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: 0.1 }}
                            className="bg-[#0a0a0f]/60 backdrop-blur-xl border border-rose-900/10 rounded-[2rem] p-8 shadow-2xl relative overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 w-32 h-32 bg-rose-500/5 blur-[80px] rounded-full"></div>
                            <h3 className="text-xs font-black text-gray-500 uppercase tracking-widest flex items-center mb-8">
                                <AlertCircle className="w-4 h-4 mr-2 text-rose-500" /> PROBLEMS DETECTED
                            </h3>
                            <div className="space-y-4">
                                {report.tips.split('|').map((tip, i) => tip.trim() && (
                                    <div key={i} className="flex gap-4 items-start group">
                                        <div className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-2 shrink-0 group-hover:scale-125 transition-transform"></div>
                                        <p className="text-sm text-gray-300 font-medium leading-relaxed">{tip.trim()}</p>
                                    </div>
                                ))}
                            </div>
                        </motion.div>

                        {/* Radar Chart Card */}
                        <motion.div 
                            initial={{ x: 20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: 0.2 }}
                            className="bg-[#0a0a0f]/60 backdrop-blur-xl border border-white/5 rounded-[2rem] p-8 shadow-2xl flex-1 flex flex-col"
                        >
                            <div className="flex justify-between items-center mb-10">
                                <h3 className="text-xs font-black text-gray-500 uppercase tracking-widest flex items-center">
                                    <Crosshair className="w-4 h-4 mr-2 text-indigo-400" /> BIOMECHANICAL OVERVIEW
                                </h3>
                                <div className="flex gap-4 text-[9px] font-black uppercase text-gray-500">
                                    <span className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-indigo-500"></div> User</span>
                                    <span className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full border border-gray-600 border-dashed"></div> Ideal</span>
                                </div>
                            </div>
                            <div className="flex-1 relative min-h-[220px]">
                                <Radar data={radarData} options={radarOptions} />
                            </div>
                        </motion.div>

                        {/* Coaching Card */}
                        <motion.div 
                            initial={{ x: 20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: 0.3 }}
                            className="bg-gradient-to-br from-emerald-950/20 to-[#0a0a0f]/60 backdrop-blur-xl border border-emerald-900/10 rounded-[2rem] p-8 shadow-2xl relative overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 blur-[80px] rounded-full"></div>
                            <h3 className="text-xs font-black text-emerald-500 uppercase tracking-widest flex items-center mb-8">
                                <BrainCircuit className="w-4 h-4 mr-2" /> AI COACHING SOLUTIONS
                            </h3>
                            <div className="space-y-5">
                                {report.tips?.split('|').map((step, i) => {
                                    if (!step.trim()) return null;
                                    return (
                                    <div key={i} className="flex gap-4 items-center group">
                                        <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 text-xs font-black group-hover:bg-emerald-500 group-hover:text-black transition-all">
                                            {i + 1}
                                        </div>
                                        <p className="text-sm text-gray-300 font-bold">{step.trim()}</p>
                                    </div>
                                )})}
                            </div>
                        </motion.div>
                    </div>
                </div>

                {/* --- BOTTOM SECTION: Trends & Drills --- */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pb-12">
                    {/* Improvement Chart */}
                    <motion.div 
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.4 }}
                        className="lg:col-span-7 bg-[#0a0a0f]/60 backdrop-blur-xl border border-white/5 rounded-[2rem] p-8 shadow-2xl"
                    >
                        <div className="flex justify-between items-center mb-8">
                            <div>
                                <h3 className="text-xs font-black text-gray-500 uppercase tracking-widest flex items-center">
                                    <Activity className="w-4 h-4 mr-2" /> PROGRESS OVER TIME
                                </h3>
                                <p className="text-[10px] text-gray-600 font-bold uppercase mt-1">Score trend across last 5 sessions</p>
                            </div>
                            <div className="px-4 py-2 rounded-xl bg-white/5 border border-white/5 text-[10px] font-black text-indigo-400">
                                <ArrowUpRight className="w-3 h-3 inline mr-1" /> +12.4% IMPROVEMENT
                            </div>
                        </div>
                        <div className="h-[200px] w-full mt-4">
                            <Line data={trendData} options={trendOptions} />
                        </div>
                    </motion.div>

                    {/* Drill Recommendations */}
                    <motion.div 
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.5 }}
                        className="lg:col-span-5 bg-[#0a0a0f]/60 backdrop-blur-xl border border-white/5 rounded-[2rem] p-8 shadow-2xl"
                    >
                        <h3 className="text-xs font-black text-gray-500 uppercase tracking-widest flex items-center mb-8">
                            <Gauge className="w-4 h-4 mr-2 text-indigo-400" /> KEY RECOMMENDATIONS
                        </h3>
                        <div className="space-y-4">
                            {report.recommendations?.split('|').map((rec, i) => {
                                if (!rec.trim()) return null;
                                const [title, sub] = rec.split(';');
                                return (
                                <div key={i} className="flex gap-5 items-center p-4 rounded-3xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors cursor-default group">
                                    <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                                        {i === 0 ? <Target className="w-6 h-6 text-indigo-400" /> : <Activity className="w-6 h-6 text-purple-400" />}
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="text-sm font-black text-gray-200">{title.trim()}</h4>
                                        <p className="text-[11px] text-gray-500 font-bold uppercase tracking-tight mt-0.5">{sub ? sub.trim() : 'Daily Practice'}</p>
                                    </div>
                                    <ChevronRight className="w-4 h-4 text-gray-700" />
                                </div>
                            )})}
                        </div>
                    </motion.div>
                </div>
            </motion.div>
            
            {/* --- FOOTER BANNER --- */}
            <div className="fixed bottom-0 left-0 w-full h-[100px] pointer-events-none z-50 overflow-hidden hidden md:block">
                <div className="absolute inset-0 bg-gradient-to-t from-indigo-500/10 to-transparent blur-3xl opacity-50"></div>
                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 bg-black/60 backdrop-blur-2xl border border-white/10 py-3 px-8 rounded-full flex items-center gap-6 shadow-2xl">
                    <span className="text-[10px] font-black italic tracking-widest text-gray-400 uppercase">Always Keep Training. Perfect Your Tech. Build Your Legacy.</span>
                    <div className="w-px h-4 bg-white/10"></div>
                    <div className="flex items-center gap-2">
                         <span className="text-[9px] font-black text-gray-500">POWERED BY</span>
                         <span className="text-[9px] font-black text-indigo-400">AI CRICKET COACH PLATFORM</span>
                    </div>
                </div>
            </div>
        </div>
    )
}