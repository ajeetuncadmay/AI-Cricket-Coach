import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Video, Star, Medal, Clock, ArrowRight, Activity, TrendingUp, CheckCircle, Crosshair } from 'lucide-react'
import { Line, Radar, Bar } from 'react-chartjs-2'
import {
    Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler, RadialLinearScale, BarElement
} from 'chart.js'
import api from '../services/api'

ChartJS.register(
    CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler, RadialLinearScale, BarElement
)

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Dashboard Render Error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-8 text-white bg-red-900 rounded-lg max-w-4xl mx-auto mt-20">
          <h1 className="text-3xl font-bold mb-4">Something went wrong in Dashboard.</h1>
          <pre className="bg-black p-4 overflow-auto rounded">{this.state.error && this.state.error.toString()}</pre>
          <pre className="bg-black p-4 mt-2 overflow-auto rounded text-xs">{this.state.error?.stack}</pre>
        </div>
      );
    }
    return this.props.children;
  }
}

function DashboardContent() {
    const [sessions, setSessions] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchSessions()
    }, [])

    const fetchSessions = async () => {
        setLoading(true)
        setError(null)
        try {
            const controller = new AbortController()
            const id = setTimeout(() => controller.abort(), 8000)
            const { data } = await api.get('/sessions', { signal: controller.signal })
            clearTimeout(id)
            if (Array.isArray(data)) {
                setSessions(data)
            } else {
                setSessions([])
            }
        } catch (error) {
            console.error('Failed to fetch sessions:', error)
            setError(error.name === 'AbortError' ? 'Analysis engine timed out.' : 'Unable to reach core modules.')
            setSessions([])
        } finally {
            setLoading(false)
        }
    }

    const safeSessions = Array.isArray(sessions) ? sessions : []
    const completed = safeSessions.filter(s => s && s.status === 'completed' && s.report)
    const latest = completed.length > 0 ? completed[0] : null
    
    const totalSessions = safeSessions.length
    const avgScore = completed.length > 0 ? (completed.reduce((a, b) => a + (b.report?.score || 0), 0) / completed.length).toFixed(1) : 0
    const bestScore = completed.length > 0 ? Math.max(...completed.map(s => s.report?.score || 0)) : 0
    const practiceTime = (completed.length * 0.5).toFixed(1) 

    const lineChartData = {
        labels: completed.slice(0, 7).map(s => s.created_at ? new Date(s.created_at).toLocaleDateString('en-GB') : '').reverse(),
        datasets: [{
            label: 'Score',
            data: completed.slice(0, 7).map(s => s.report?.score || 0).reverse(),
            borderColor: '#a855f7',
            backgroundColor: 'rgba(168, 85, 247, 0.2)',
            fill: true,
            tension: 0.4,
            borderWidth: 2,
            pointBackgroundColor: '#a855f7',
            pointRadius: 3
        }]
    }
    const lineOptions = { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { y: { min: 0, max: 100, display: false }, x: { grid: { display: false }, ticks: { color: '#64748b', font: { size: 10 } } } } }

    const barChartData = {
        labels: completed.slice(0, 5).map(s => s.created_at ? new Date(s.created_at).toLocaleDateString('en-GB') : '').reverse(),
        datasets: [{
            label: 'Score',
            data: completed.slice(0, 5).map(s => s.report?.score || 0).reverse(),
            backgroundColor: '#818cf8',
            borderRadius: 6,
            barThickness: 16
        }]
    }
    const barOptions = { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { y: { display: false }, x: { grid: { display: false }, ticks: { color: '#64748b', font: { size: 10 } } } } }

    const radarData = {
        labels: ['Balance', 'Timing', 'Techwork', 'Footwork', 'Power'],
        datasets: [
            { label: 'You', data: [80, 85, 75, 70, 90], borderColor: '#6366f1', borderWidth: 2, pointRadius: 0, backgroundColor: 'rgba(99, 102, 241, 0.2)' },
            { label: 'Ideal', data: [90, 85, 95, 80, 95], borderColor: '#22c55e', borderWidth: 2, borderDash: [5, 5], pointRadius: 0, backgroundColor: 'transparent' }
        ]
    }
    const radarOptions = { responsive: true, maintainAspectRatio: false, scales: { r: { ticks: { display: false }, grid: { color: 'rgba(255,255,255,0.1)' }, pointLabels: { color: '#94a3b8', font: { size: 10 } } } }, plugins: { legend: { display: false } } }

    if (loading) {
        return (
            <div className="flex flex-col justify-center items-center h-[60vh] space-y-6">
                <div className="w-16 h-16 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin"></div>
                <div className="text-white text-xl font-black tracking-widest animate-pulse uppercase">Syncing AI Core...</div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="max-w-xl mx-auto mt-20 p-8 bg-red-900/20 border border-red-500/30 rounded-[2.5rem] backdrop-blur-xl text-center">
                <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                <h2 className="text-2xl font-black text-white mb-2">Sync Interrupted</h2>
                <p className="text-gray-400 mb-6">{error}</p>
                <button 
                    onClick={fetchSessions}
                    className="bg-red-600 hover:bg-red-500 text-white font-black py-3 px-8 rounded-xl transition shadow-lg shadow-red-900/20"
                >
                    Retry Connection
                </button>
            </div>
        )
    }

    if (sessions.length === 0) {
        return (
            <div className="max-w-[1600px] mx-auto pb-12 text-white">
                 <div className="text-center mt-32 p-12 bg-[#11111a]/80 rounded-[3rem] border border-gray-800 shadow-2xl backdrop-blur-xl max-w-2xl mx-auto">
                    <Activity className="w-16 h-16 text-indigo-500 mx-auto mb-4" />
                    <h2 className="text-3xl font-black mb-4">Initialize Training</h2>
                    <p className="text-gray-400 mb-8 font-medium">Upload your first batting video to unlock professional biomechanical insights and tracking.</p>
                    <Link to="/upload" className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-black py-4 px-10 rounded-2xl transition shadow-xl shadow-indigo-600/30">Start First Analysis</Link>
                </div>
            </div>
        )
    }

    return (
        <div className="max-w-[1600px] mx-auto pb-12 text-white">
            <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center bg-[#11111a]/80 p-8 rounded-[2.5rem] border border-gray-800/80 shadow-2xl backdrop-blur-xl gap-4">
                <div>
                    <h1 className="text-4xl font-black mb-1">Elite Performance <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">Dashboard</span></h1>
                    <p className="text-gray-400 text-sm font-medium">Monitoring real-time biomechanics and technical progression.</p>
                </div>
                <div className="flex gap-3">
                    <Link to="/upload" className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2.5 px-6 rounded-xl transition text-sm shadow-lg shadow-indigo-600/20 flex items-center">
                        <Video className="w-4 h-4 mr-2" /> New Session
                    </Link>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                {[
                    { title: "TOTAL SESSIONS", val: totalSessions, sub: "from active history", icon: <Video className="w-6 h-6 text-purple-400"/>, bg: 'bg-gradient-to-br from-purple-900/30 to-purple-800/10', border: 'border-purple-500/30', valColor: 'text-white' },
                    { title: "AVERAGE SCORE", val: avgScore, sub: "+8.2% improvement", icon: <Star className="w-6 h-6 text-green-400"/>, bg: 'bg-gradient-to-br from-green-900/30 to-green-800/10', border: 'border-green-500/30', valColor: 'text-white' },
                    { title: "BEST SCORE", val: bestScore, sub: "Cover Drive • Recent", icon: <Medal className="w-6 h-6 text-orange-400"/>, bg: 'bg-gradient-to-br from-orange-900/30 to-orange-800/10', border: 'border-orange-500/30', valColor: 'text-white' },
                    { title: "PRACTICE TIME", val: `${practiceTime} hrs`, sub: "+1.1h this week", icon: <Clock className="w-6 h-6 text-blue-400"/>, bg: 'bg-gradient-to-br from-blue-900/30 to-blue-800/10', border: 'border-blue-500/30', valColor: 'text-white' }
                ].map((card, i) => (
                    <div key={i} className={`${card.bg} border ${card.border} rounded-2xl p-5 shadow-2xl relative overflow-hidden group hover:scale-[1.02] transition-transform`}>
                        <div className="flex gap-4 items-center mb-3">
                            <div className={`w-12 h-12 rounded-full flex items-center justify-center bg-black/30 backdrop-blur-md`}>
                                {card.icon}
                            </div>
                            <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{card.title}</h3>
                        </div>
                        <p className={`text-4xl font-black ml-16 ${card.valColor}`}>{card.val}</p>
                        <p className="text-[10px] text-gray-500 ml-16 mt-1 font-bold">{card.sub}</p>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                <div className="lg:col-span-2 bg-[#11111a]/80 backdrop-blur-xl border border-gray-800/80 rounded-2xl p-6 shadow-2xl">
                    <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4 flex items-center">
                        <TrendingUp className="w-4 h-4 mr-2"/> Performance Overview
                    </h3>
                    <div className="h-[200px] w-full">
                        <Line data={lineChartData} options={lineOptions} />
                    </div>
                </div>

                <div className="lg:col-span-1 bg-[#11111a]/80 backdrop-blur-xl border border-gray-800/80 rounded-2xl p-6 shadow-2xl relative">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest flex items-center">
                            <Activity className="w-4 h-4 mr-2 text-indigo-400"/> AI Insights & Progress
                        </h3>
                    </div>
                    <div className="flex flex-col gap-6">
                        <div className="flex items-center gap-4">
                            <div className="relative w-28 h-28">
                                <svg className="w-full h-full transform -rotate-90">
                                    <circle cx="56" cy="56" r="48" fill="none" stroke="#1f2937" strokeWidth="10" />
                                    <circle cx="56" cy="56" r="48" fill="none" stroke="#22c55e" strokeWidth="10" strokeDasharray="301" strokeDashoffset={301 - (301 * 0.78)} strokeLinecap="round" />
                                </svg>
                                <div className="absolute inset-0 flex flex-col items-center justify-center">
                                    <span className="text-2xl font-black text-white">78%</span>
                                </div>
                            </div>
                            <div>
                                <p className="text-sm font-bold text-emerald-400 flex items-center mb-1"><CheckCircle className="w-3 h-3 mr-1"/> Great Improvement</p>
                                <p className="text-[10px] text-gray-400 leading-snug">Your front foot balance has improved by 15%</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Grid Layout Row 2: Recent Activity List & Recent Analysis */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-6">
                
                {/* Recent Activity List (History) */}
                <div className="lg:col-span-1 bg-[#11111a]/80 backdrop-blur-xl border border-gray-800/80 rounded-2xl p-6 shadow-2xl overflow-y-auto max-h-[360px] custom-scrollbar">
                     <div className="flex justify-between items-center mb-4">
                        <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest flex items-center">
                            RECENT ACTIVITY
                        </h3>
                     </div>
                     <div className="flex flex-col gap-3">
                         {completed.slice(0, 10).map((session, i) => (
                             <div key={i} className="flex gap-3 items-center border-b border-gray-800 pb-3 last:border-0 last:pb-0">
                                 <div className="w-10 h-10 rounded bg-gray-800 overflow-hidden shrink-0">
                                     <img src={`http://localhost:8000/api/report/${session.id}/image`} alt="Thumb" className="w-full h-full object-cover" onError={(e) => e.target.src="https://images.unsplash.com/photo-1540747913346-19e32fc3e64b?auto=format&fit=crop&w=100&q=80"} />
                                 </div>
                                 <div className="flex-1">
                                     <Link to={`/analytics/${session.id}`} className="text-sm font-bold text-white hover:text-indigo-400 leading-tight">Biomechanical Analysis</Link>
                                     <p className="text-[9px] text-gray-500 uppercase font-bold">{new Date(session.created_at).toLocaleString()}</p>
                                 </div>
                                 <div className="w-8 h-8 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-black flex items-center justify-center shrink-0">
                                     {session.report?.score || 0}
                                 </div>
                             </div>
                         ))}
                         {completed.length === 0 && <p className="text-sm text-gray-500">No sessions recorded.</p>}
                     </div>
                </div>

                {/* Recent Analysis Card */}
                <div className="lg:col-span-2 bg-[#11111a]/80 backdrop-blur-xl border border-gray-800/80 rounded-2xl p-6 shadow-2xl relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-cyan-900/10 to-indigo-900/10 z-0"></div>
                    <div className="relative z-10 flex flex-col sm:flex-row gap-6">
                        <div className="w-full sm:w-1/2 h-[240px] rounded-xl overflow-hidden relative">
                            {latest && latest.id ? (
                                <img src={`http://localhost:8000/api/report/${latest.id}/image`} alt="Latest" className="w-full h-full object-cover" onError={(e) => e.target.src="https://images.unsplash.com/photo-1540747913346-19e32fc3e64b?auto=format&fit=crop&w=600&q=80"} />
                            ) : (
                                <div className="w-full h-full bg-gray-900 flex items-center justify-center">No latest image</div>
                            )}
                            <div className="absolute top-2 left-2 bg-black/60 backdrop-blur text-[10px] font-bold text-white px-2 py-1 rounded">RECENT ANALYSIS</div>
                        </div>
                        <div className="w-full sm:w-1/2 flex flex-col justify-center">
                            <div className="flex justify-between items-center mb-4">
                                <p className="text-xs font-bold text-gray-400">{latest && latest.created_at ? new Date(latest.created_at).toLocaleDateString() : 'N/A'}</p>
                                <span className="text-[10px] font-bold text-green-400 bg-green-500/10 px-2 py-0.5 rounded-full border border-green-500/20">Completed</span>
                            </div>
                            <div className="flex items-center gap-6 mb-6">
                                <div className="relative w-24 h-24">
                                    <svg className="w-full h-full transform -rotate-90">
                                        <circle cx="48" cy="48" r="40" fill="none" stroke="#1f2937" strokeWidth="8" />
                                        <circle cx="48" cy="48" r="40" fill="none" stroke="#a855f7" strokeWidth="8" strokeDasharray="251" strokeDashoffset={251 - (251 * (latest?.report?.score || 0)) / 100 || 0} />
                                    </svg>
                                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                                        <span className="text-2xl font-black text-white">{latest?.report?.score || 0}</span>
                                        <span className="text-[10px] text-gray-500 font-bold -mt-1">/100</span>
                                    </div>
                                </div>
                                <div className="flex-1 space-y-3">
                                    <div className="flex justify-between items-center border-b border-gray-800 pb-1">
                                        <div className="flex flex-col">
                                            <span className="text-[10px] text-gray-500 font-bold uppercase">Elbow Angle</span>
                                            <span className="text-sm font-black text-white">{latest?.report?.elbow_angle || 0}°</span>
                                        </div>
                                    </div>
                                    <div className="flex justify-between items-center border-b border-gray-800 pb-1">
                                        <div className="flex flex-col">
                                            <span className="text-[10px] text-gray-500 font-bold uppercase">Shoulder Rot.</span>
                                            <span className="text-sm font-black text-white">{latest?.report?.shoulder_rotation || 0}°</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            <Link to={latest?.id ? `/analytics/${latest.id}` : '#'} className="w-full text-center bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2 rounded-lg text-sm shadow-lg shadow-indigo-600/20 transition">View Full Report</Link>
                        </div>
                    </div>
                </div>

                <div className="lg:col-span-1 bg-[#11111a]/80 backdrop-blur-xl border border-gray-800/80 rounded-2xl p-6 shadow-2xl flex flex-col">
                    <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4 flex items-center">
                        <Medal className="w-4 h-4 mr-2 text-yellow-500"/> Training Recommendations
                    </h3>
                    <div className="space-y-3 flex-1 flex flex-col justify-center">
                        {[
                            { title: 'Improve Elbow Extension', desc: 'Focus on full extension for more power', icon: <Activity className="w-4 h-4"/>, color: 'text-purple-400', bg: 'bg-purple-500/10 border-purple-500/20' }
                        ].map((rec, i) => (
                            <div key={i} className={`flex items-center p-3 rounded-xl border ${rec.bg} cursor-pointer group`}>
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${rec.bg} ${rec.color} shrink-0 mr-3`}>
                                    {rec.icon}
                                </div>
                                <div className="flex-1">
                                    <h4 className="text-xs font-bold text-white">{rec.title}</h4>
                                    <p className="text-[10px] text-gray-400">{rec.desc}</p>
                                </div>
                                <ArrowRight className="w-4 h-4 text-gray-600" />
                            </div>
                        ))}
                    </div>
                </div>

            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-[#11111a]/80 backdrop-blur-xl border border-gray-800/80 rounded-2xl p-6 shadow-2xl">
                    <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">Technique Breakdown</h3>
                    <div className="h-[150px] w-full">
                        <Radar data={radarData} options={radarOptions} />
                    </div>
                </div>

                <div className="bg-[#11111a]/80 backdrop-blur-xl border border-gray-800/80 rounded-2xl p-6 shadow-2xl">
                    <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">Improvement Trend</h3>
                    <div className="h-[150px] w-full">
                        <Bar data={barChartData} options={barOptions} />
                    </div>
                </div>

                <div className="bg-[#11111a]/80 backdrop-blur-xl border border-gray-800/80 rounded-2xl p-6 shadow-2xl flex flex-col justify-center">
                    <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">Quick Stats</h3>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="border border-gray-800 bg-[#1a1a24] p-3 rounded-xl">
                            <span className="text-[10px] text-gray-500 font-bold uppercase block mb-1">Cover Drives</span>
                            <span className="text-xl font-black text-indigo-400">14</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default function Dashboard() {
    return (
        <ErrorBoundary>
            <DashboardContent />
        </ErrorBoundary>
    )
}
