import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Activity, Download, Calendar, ExternalLink, RefreshCw, AlertCircle, Play } from 'lucide-react'
import api from '../services/api'
import { motion } from 'framer-motion'

export default function Sessions() {
    const [sessions, setSessions] = useState([])
    const [error, setError] = useState(null)

    useEffect(() => {
        fetchSessions()
    }, [])

    const fetchSessions = async () => {
        setLoading(true)
        setError(null)
        try {
            const controller = new AbortController()
            const id = setTimeout(() => controller.abort(), 10000)
            const { data } = await api.get('/sessions', { signal: controller.signal })
            clearTimeout(id)
            setSessions(data)
        } catch (error) {
            console.error('Failed to fetch sessions', error)
            setError(error.name === 'AbortError' ? 'Session history service timed out.' : 'Unable to connect to session history.')
        } finally {
            setLoading(false)
        }
    }

    if (loading) {
        return (
            <div className="flex flex-col justify-center items-center h-96 space-y-4">
                <RefreshCw className="w-10 h-10 text-indigo-500 animate-spin" />
                <p className="text-gray-400 font-bold tracking-widest text-sm uppercase">Syncing Project History...</p>
            </div>
        )
    }

    if (error) {
        return (
            <div className="max-w-xl mx-auto mt-20 p-8 bg-black/40 border border-red-500/20 rounded-[2.5rem] backdrop-blur-xl text-center">
                <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                <h2 className="text-2xl font-black text-white mb-2">History Sync Failed</h2>
                <p className="text-gray-400 mb-6">{error}</p>
                <button 
                    onClick={fetchSessions}
                    className="bg-indigo-600 hover:bg-indigo-500 text-white font-black py-3.5 px-10 rounded-xl transition shadow-lg shadow-indigo-900/20"
                >
                    Retry Loading
                </button>
            </div>
        )
    }

    return (
        <div className="max-w-[1200px] mx-auto space-y-6 relative z-20">
            <div className="flex flex-col md:flex-row md:items-center justify-between bg-[#11111a]/80 p-8 rounded-[2rem] border border-gray-800/80 shadow-2xl backdrop-blur-xl gap-4">
                <div>
                    <h1 className="text-3xl font-black text-white leading-tight">Project History</h1>
                    <p className="text-gray-400 text-sm font-medium mt-1">Audit trail of all biomechanical analyses and reports generated.</p>
                </div>
                <Link to="/upload" className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2.5 px-6 rounded-xl transition text-sm shadow-lg shadow-indigo-600/20">
                    New Analysis
                </Link>
            </div>

            {sessions.length === 0 ? (
                <div className="bg-[#11111a]/80 backdrop-blur-xl border border-gray-800 rounded-[2rem] p-12 text-center shadow-2xl">
                    <AlertCircle className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-white mb-2">No Sessions Yet</h3>
                    <p className="text-gray-500 mb-6 font-medium">Head over to the upload page to create your first analysis!</p>
                    <Link to="/upload" className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 px-8 rounded-xl transition inline-flex items-center shadow-lg shadow-indigo-500/20">
                        Create New Analysis
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {sessions.map((session, i) => (
                        <motion.div 
                            initial={{ opacity: 0, y: 20 }} 
                            animate={{ opacity: 1, y: 0 }} 
                            transition={{ delay: i * 0.1 }}
                            key={session.id} 
                            className="bg-[#11111a]/80 backdrop-blur-xl border border-gray-800 rounded-3xl overflow-hidden shadow-2xl group flex flex-col"
                        >
                            <div className="relative h-48 w-full bg-black">
                                <img 
                                    src={`http://localhost:8000/api/report/${session.id}/image`} 
                                    alt="Thumbnail" 
                                    className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition duration-500" 
                                    onError={(e) => e.target.src="https://images.unsplash.com/photo-1540747913346-19e32fc3e64b?auto=format&fit=crop&w=600&q=80"}
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-[#11111a] via-transparent to-transparent"></div>
                                <div className="absolute top-4 left-4 bg-black/60 backdrop-blur px-3 py-1.5 rounded-lg border border-gray-700/50 flex items-center">
                                    <Calendar className="w-3 h-3 text-gray-400 mr-2" />
                                    <span className="text-[10px] text-gray-300 font-bold uppercase">{new Date(session.created_at).toLocaleDateString()}</span>
                                </div>
                                <div className="absolute top-4 right-4 bg-emerald-500/10 backdrop-blur border border-emerald-500/30 px-3 py-1.5 rounded-lg flex items-center">
                                    <span className="text-emerald-400 text-xs font-black">Score: {session.report?.score || 0}</span>
                                </div>
                            </div>
                            
                            <div className="p-6 flex-1 flex flex-col justify-between">
                                <div>
                                    <h3 className="text-lg font-bold text-white mb-2">Biomechanical Analysis #{session.id}</h3>
                                    <div className="flex gap-2">
                                        <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest bg-[#1a1a24] px-2 py-1 rounded border border-gray-800">
                                            {session.status === 'completed' ? 'Completed' : 'Processing'}
                                        </span>
                                    </div>
                                </div>
                                
                                <div className="flex gap-3 mt-6">
                                    <Link to={`/analytics/${session.id}`} className="flex-1 text-center text-xs font-bold bg-indigo-600/10 text-indigo-400 border border-indigo-500/20 hover:bg-indigo-500/20 py-2.5 rounded-xl transition flex justify-center items-center">
                                        <ExternalLink className="w-3.5 h-3.5 mr-1" /> View Dashboard
                                    </Link>
                                    <a href={`http://localhost:8000/api/report/${session.id}/download`} download className="flex-1 text-center text-xs font-bold bg-gray-800/50 text-white border border-gray-700 hover:bg-gray-800 py-2.5 rounded-xl transition flex justify-center items-center">
                                        <Download className="w-3.5 h-3.5 mr-1" /> PDF Report
                                    </a>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    )
}
