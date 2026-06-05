import { useState, useRef, useCallback, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { UploadCloud, CheckCircle, Activity, FileVideo, Image as ImageIcon, X, AlertCircle, Camera, Video, History, Sun, User, Aperture, FileText, Smartphone, Calendar, Info } from 'lucide-react'
import ReactWebcam from 'react-webcam'
import api from '../services/api'

export default function Upload() {
    const [file, setFile] = useState(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [success, setSuccess] = useState(false)
    const [dragActive, setDragActive] = useState(false)
    const [mode, setMode] = useState('upload') // 'upload', 'camera', 'record'
    const [recording, setRecording] = useState(false)
    const [recordedChunks, setRecordedChunks] = useState([])
    const [recentSessions, setRecentSessions] = useState([])

    const inputRef = useRef(null)
    const webcamRef = useRef(null)
    const mediaRecorderRef = useRef(null)
    const navigate = useNavigate()

    useEffect(() => {
        fetchRecent()
    }, [])

    const fetchRecent = async () => {
        try {
            const { data } = await api.get('/sessions')
            setRecentSessions(Array.isArray(data) ? data.filter(s => s && s.status === 'completed').slice(0, 3) : [])
        } catch (error) {
            console.error('Failed to fetch sessions', error)
        }
    }

    const handleDrag = function (e) {
        e.preventDefault()
        e.stopPropagation()
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true)
        } else if (e.type === "dragleave") {
            setDragActive(false)
        }
    }

    const handleDrop = function (e) {
        e.preventDefault()
        e.stopPropagation()
        setDragActive(false)
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFileSelection(e.dataTransfer.files[0])
        }
    }

    const handleChange = function (e) {
        e.preventDefault()
        if (e.target.files && e.target.files[0]) {
            handleFileSelection(e.target.files[0])
        }
    }

    const handleFileSelection = (selectedFile) => {
        const validExtensions = ['.mp4', '.webm', '.jpg', '.jpeg', '.png']
        const isValid = validExtensions.some(ext => selectedFile.name.toLowerCase().endsWith(ext))

        if (!isValid) {
            setError('Only MP4, WEBM, JPG, or PNG files are supported.')
            setFile(null)
            return
        }
        if (selectedFile.size > 50 * 1024 * 1024) {
            setError('File size too large. Maximum size is 50MB.')
            setFile(null)
            return
        }
        setFile(selectedFile)
        setError('')
        setSuccess(false)
        // Automatically start upload
        handleUpload(null, selectedFile)
    }

    const handleStartCaptureClick = useCallback(() => {
        setRecording(true)
        const chunks = []
        mediaRecorderRef.current = new MediaRecorder(webcamRef.current.stream, {
            mimeType: "video/webm"
        })
        mediaRecorderRef.current.addEventListener(
            "dataavailable",
            (e) => {
                if (e.data.size > 0) chunks.push(e.data)
            }
        )
        mediaRecorderRef.current.addEventListener(
            "stop",
            () => {
                const blob = new Blob(chunks, { type: "video/webm" })
                const recordedFile = new File([blob], `live_capture_${Date.now()}.webm`, { type: "video/webm" })
                handleUpload(null, recordedFile)
            }
        )
        mediaRecorderRef.current.start()
    }, [webcamRef, setRecording])

    const handleStopCaptureClick = useCallback(() => {
        if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
            mediaRecorderRef.current.stop()
        }
        setRecording(false)
    }, [mediaRecorderRef, setRecording])

    const handleUpload = async (e, uploadFile = file) => {
        if (e) e.preventDefault()
        if (!uploadFile) return

        setLoading(true)
        setError('')

        const formData = new FormData()
        formData.append('file', uploadFile)

        try {
            // Add a timeout for the analysis
            const controller = new AbortController()
            const id = setTimeout(() => controller.abort(), 45000) // 45s for deep analysis
            
            const response = await api.post('/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
                signal: controller.signal
            })
            
            clearTimeout(id)
            setSuccess(true)
            setTimeout(() => navigate('/dashboard'), 2500)
        } catch (err) {
            console.error('Upload error:', err)
            if (err.name === 'CanceledError' || err.name === 'AbortError') {
                setError('The analysis is taking longer than expected. Please check your connection or try a smaller file.')
            } else {
                setError(err.response?.data?.detail || 'Analysis engine failed to process the request. Ensure you are in good lighting.')
            }
            setFile(null)
            setLoading(false)
        } finally {
            // setLoading(false) // Handled in catch/success
        }
    }

    if (loading || success) {
        return (
            <div className="flex flex-col justify-center items-center h-full min-h-[600px] space-y-6">
                <div className="relative w-32 h-32">
                    <div className="absolute inset-0 bg-indigo-500/20 rounded-full animate-ping opacity-60"></div>
                    <div className="absolute inset-2 bg-indigo-500/20 rounded-full border-2 border-indigo-500/50 flex justify-center items-center backdrop-blur-md">
                        {success ? <CheckCircle className="w-12 h-12 text-emerald-400" /> : <Activity className="w-12 h-12 text-indigo-400 animate-pulse" />}
                    </div>
                </div>
                <h3 className="text-3xl font-black text-white">
                    {success ? "Analysis Complete!" : "Uploading & Analyzing..."}
                </h3>
                <p className="text-gray-400 font-bold tracking-widest text-sm bg-[#11111a] px-6 py-2 rounded-full border border-gray-800">
                    {success ? "Redirecting to your dashboard..." : "Processing biomechanical model matrices"}
                </p>
            </div>
        )
    }

    return (
        <div className="max-w-[1400px] w-full mx-auto space-y-6 animate-fade-in relative z-20">
            
            {/* Header Area */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black text-white leading-tight">Upload & Analyze</h1>
                    <p className="text-gray-400 text-sm font-medium mt-1">Upload an image/video or capture live shot for AI Biomechanical Analysis</p>
                </div>
                <Link to="/sessions" className="flex items-center text-sm font-bold bg-[#11111a]/80 backdrop-blur-xl border border-indigo-500/30 text-indigo-300 px-6 py-2.5 rounded-xl hover:bg-indigo-500/10 hover:border-indigo-400 transition shadow-lg shadow-indigo-900/20">
                    <History className="w-4 h-4 mr-2" /> View Previous Sessions &rarr;
                </Link>
            </div>

            {/* Main Action Tabs */}
            <div className="flex gap-4">
                <button 
                    onClick={() => setMode('upload')}
                    className={`flex items-center px-8 py-3 rounded-xl font-bold transition-all border ${mode === 'upload' ? 'bg-gradient-to-r from-indigo-600 to-purple-600 border-indigo-500 shadow-lg shadow-indigo-500/20 text-white' : 'bg-[#11111a]/80 backdrop-blur-xl border-gray-800 text-gray-400 hover:text-white hover:border-gray-600'}`}
                >
                    <UploadCloud className="w-5 h-5 mr-3" /> Upload Media
                </button>
                <button 
                    onClick={() => setMode('camera')}
                    className={`flex items-center px-8 py-3 rounded-xl font-bold transition-all border ${mode === 'camera' ? 'bg-gradient-to-r from-indigo-600 to-purple-600 border-indigo-500 shadow-lg shadow-indigo-500/20 text-white' : 'bg-[#11111a]/80 backdrop-blur-xl border-gray-800 text-gray-400 hover:text-white hover:border-gray-600'}`}
                >
                    <Camera className="w-5 h-5 mr-3" /> Live Camera Capture
                </button>
                <button 
                    onClick={() => setMode('record')}
                    className={`flex items-center px-8 py-3 rounded-xl font-bold transition-all border ${mode === 'record' ? 'bg-gradient-to-r from-indigo-600 to-purple-600 border-indigo-500 shadow-lg shadow-indigo-500/20 text-white' : 'bg-[#11111a]/80 backdrop-blur-xl border-gray-800 text-gray-400 hover:text-white hover:border-gray-600'}`}
                >
                    <div className="relative flex items-center justify-center mr-3">
                        <Video className="w-5 h-5 text-gray-400 group-hover:text-white" />
                        <span className="absolute top-0 right-0 w-1.5 h-1.5 bg-red-500 rounded-full"></span>
                    </div>
                     Record Video
                </button>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
                
                {/* Drag and Drop Primary Module */}
                <div className="xl:col-span-5 bg-[#0d0d14]/80 backdrop-blur-xl border border-indigo-500/20 rounded-[2rem] p-8 shadow-2xl relative flex flex-col justify-center items-center group transition-colors hover:border-indigo-500/40">
                    <div className="absolute inset-0 bg-gradient-to-b from-indigo-500/5 to-purple-500/5 rounded-[2rem] pointer-events-none"></div>
                    
                    <div 
                        className={`w-full relative flex flex-col justify-center items-center py-12 border-2 border-dashed rounded-3xl transition-all duration-300 ${dragActive ? 'border-primary-500 bg-primary-900/20 scale-[1.02]' : 'border-gray-700 hover:border-gray-500'}`}
                        onDragEnter={handleDrag}
                        onDragLeave={handleDrag}
                        onDragOver={handleDrag}
                        onDrop={handleDrop}
                        onClick={() => inputRef.current.click()}
                    >
                        <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-indigo-900/40 to-purple-900/40 flex items-center justify-center mb-6 relative">
                            <div className="absolute inset-0 bg-indigo-500/20 blur-xl rounded-full"></div>
                            <UploadCloud className="w-12 h-12 text-indigo-400 relative z-10" />
                        </div>
                        
                        <h2 className="text-2xl font-black text-white text-center">
                            Drag & Drop <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">Image</span> or <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">Video</span>
                        </h2>
                        <p className="text-sm text-gray-400 mt-2 font-medium">or click to browse from device</p>

                        <div className="w-full max-w-xs border-t border-gray-800 my-8 relative">
                            <span className="absolute left-1/2 -top-3 -translate-x-1/2 bg-[#0d0d14] px-4 text-xs font-bold text-gray-600 uppercase tracking-widest">Supported Formats</span>
                        </div>

                        <div className="flex flex-wrap justify-center gap-2 mb-8">
                            {['JPG', 'PNG', 'WEBP', 'MP4', 'MOV', 'AVI'].map(ext => (
                                <span key={ext} className="px-3 py-1 bg-gray-900 border border-gray-800 rounded-lg text-xs font-bold text-gray-400 tracking-wider">
                                    {ext}
                                </span>
                            ))}
                        </div>

                        <button className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold py-3.5 px-10 rounded-xl shadow-lg shadow-indigo-600/30 transition-all text-sm w-[80%] max-w-[280px]">
                            Browse Files
                        </button>
                        <input ref={inputRef} type="file" className="sr-only" accept=".mp4,.webm,.jpg,.jpeg,.png" onChange={handleChange} />
                    </div>
                </div>

                {/* Live Camera Feed */}
                <div className="xl:col-span-4 bg-[#11111a]/80 backdrop-blur-xl border border-gray-800 rounded-[2rem] p-6 shadow-2xl flex flex-col justify-between">
                    <div className="flex justify-between items-center mb-4 px-2">
                        <h3 className="text-sm font-bold text-gray-300 flex items-center">
                            <Camera className="w-4 h-4 mr-2 text-gray-500"/> Live Camera Capture
                        </h3>
                        <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-3 py-1 rounded text-[10px] font-black tracking-widest">LIVE</span>
                    </div>

                    <div className="flex-1 bg-black rounded-2xl relative overflow-hidden flex flex-col group min-h-[300px]">
                        {mode === 'record' || mode === 'camera' ? (
                             <ReactWebcam
                                audio={false}
                                ref={webcamRef}
                                className="w-full h-full object-cover scale-x-[-1]"
                            />
                        ) : (
                            <img src="https://images.unsplash.com/photo-1540747913346-19e32fc3e64b?auto=format&fit=crop&w=600&q=80" alt="Sample Feed" className="w-full h-full object-cover opacity-60 grayscale-[30%] blur-[2px]" />
                        )}
                       
                        {/* Overlay elements */}
                        <div className="absolute top-4 left-4 flex items-center bg-black/60 backdrop-blur px-3 py-1.5 rounded border border-gray-700/50">
                            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse mr-2"></span>
                            <span className="text-xs text-white font-black tracking-widest font-mono">00:00:00</span>
                        </div>
                        <div className="absolute top-4 right-4 bg-black/60 backdrop-blur p-2 rounded border border-gray-700/50 cursor-pointer hover:bg-gray-800 transition">
                            <Aperture className="w-4 h-4 text-white" />
                        </div>
                    </div>

                    <div className="mt-4 flex flex-col sm:flex-row items-center gap-3 w-full">
                        <select className="bg-[#1a1a24] border border-gray-800 text-gray-300 text-xs font-bold rounded-xl px-4 py-3.5 focus:outline-none flex-1 w-full sm:w-auto appearance-none cursor-pointer hover:bg-gray-800 transition">
                            <option>Camera: Front</option>
                            <option>Camera: Rear</option>
                        </select>
                        <button 
                            onClick={handleStartCaptureClick}
                            disabled={recording || mode === 'upload'}
                            className="bg-emerald-600 hover:bg-emerald-500 text-white border-none font-bold py-3.5 px-6 rounded-xl flex items-center justify-center flex-1 shadow-lg shadow-emerald-900/20 transition-all text-sm w-full disabled:opacity-50"
                        >
                            <Camera className="w-4 h-4 mr-2" /> Capture Photo
                        </button>
                    </div>

                    <button 
                        onClick={recording ? handleStopCaptureClick : handleStartCaptureClick}
                        className={`mt-3 w-full border font-bold py-3 text-sm rounded-xl transition-all shadow-md items-center justify-center flex ${recording ? 'bg-red-500 text-white shadow-red-500/20 border-red-500' : 'bg-transparent border-gray-600 text-gray-300 hover:bg-red-500/10 hover:border-red-500 hover:text-red-400'}`}
                    >
                         <span className={`w-2.5 h-2.5 rounded-full mr-2 ${recording ? 'bg-white' : 'bg-red-500'}`}></span>
                         {recording ? 'Stop Recording' : 'Start Recording'}
                    </button>
                </div>

                {/* Right Side Info Panels */}
                <div className="xl:col-span-3 flex flex-col gap-6">
                    
                    <div className="bg-[#11111a]/80 backdrop-blur-xl border border-gray-800 rounded-[2rem] p-6 shadow-2xl flex-1 flex flex-col justify-center">
                        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center mb-6">
                            <Activity className="w-4 h-4 mr-2 text-rose-500" /> ANALYSIS TIPS
                        </h3>
                        <div className="space-y-4">
                            <div className="flex bg-[#1a1a24] p-4 rounded-2xl border border-gray-800/50">
                                <div className="w-10 h-10 rounded-full bg-yellow-500/10 flex items-center justify-center mr-4 shrink-0">
                                    <Sun className="w-5 h-5 text-yellow-500" />
                                </div>
                                <div className="flex-1">
                                    <h4 className="text-xs font-bold text-gray-200">Good Lighting</h4>
                                    <p className="text-[10px] text-gray-500 leading-snug mt-1">Use natural light for better detection</p>
                                </div>
                            </div>
                            <div className="flex bg-[#1a1a24] p-4 rounded-2xl border border-gray-800/50">
                                <div className="w-10 h-10 rounded-full bg-cyan-500/10 flex items-center justify-center mr-4 shrink-0">
                                    <User className="w-5 h-5 text-cyan-500" />
                                </div>
                                <div className="flex-1">
                                    <h4 className="text-xs font-bold text-gray-200">Full Body Visible</h4>
                                    <p className="text-[10px] text-gray-500 leading-snug mt-1">Ensure complete body is in frame</p>
                                </div>
                            </div>
                            <div className="flex bg-[#1a1a24] p-4 rounded-2xl border border-gray-800/50">
                                <div className="w-10 h-10 rounded-full bg-indigo-500/10 flex items-center justify-center mr-4 shrink-0">
                                    <Aperture className="w-5 h-5 text-indigo-400" />
                                </div>
                                <div className="flex-1">
                                    <h4 className="text-xs font-bold text-gray-200">Stable Position</h4>
                                    <p className="text-[10px] text-gray-500 leading-snug mt-1">Keep camera steady for accurate analysis</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-[#11111a]/80 backdrop-blur-xl border border-gray-800 rounded-[2rem] p-6 shadow-2xl flex-1 flex flex-col justify-center">
                        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center mb-6">
                            <FileText className="w-4 h-4 mr-2 text-emerald-500" /> WHAT HAPPENS NEXT?
                        </h3>
                        <div className="space-y-5 relative">
                            <div className="absolute left-[15px] top-4 bottom-4 w-0.5 bg-gray-800"></div>
                            
                            <div className="flex relative z-10">
                                <div className="w-8 h-8 rounded-full bg-emerald-600 flex items-center justify-center text-xs font-black text-white mr-4 shrink-0 shadow-[0_0_15px_rgba(5,150,105,0.4)] border-2 border-[#11111a]">1</div>
                                <div className="flex-1 pt-1">
                                    <h4 className="text-xs font-bold text-gray-200">Media Upload</h4>
                                    <p className="text-[10px] text-gray-500 mt-1">Your file will be securely uploaded</p>
                                </div>
                            </div>
                            <div className="flex relative z-10">
                                <div className="w-8 h-8 rounded-full bg-emerald-600 flex items-center justify-center text-xs font-black text-white mr-4 shrink-0 shadow-[0_0_15px_rgba(5,150,105,0.4)] border-2 border-[#11111a]">2</div>
                                <div className="flex-1 pt-1">
                                    <h4 className="text-xs font-bold text-gray-200">AI Processing</h4>
                                    <p className="text-[10px] text-gray-500 mt-1">Our AI model analyzes angles</p>
                                </div>
                            </div>
                            <div className="flex relative z-10">
                                <div className="w-8 h-8 rounded-full bg-emerald-600 flex items-center justify-center text-xs font-black text-white mr-4 shrink-0 shadow-[0_0_15px_rgba(5,150,105,0.4)] border-2 border-[#11111a]">3</div>
                                <div className="flex-1 pt-1">
                                    <h4 className="text-xs font-bold text-gray-200">Instant Report</h4>
                                    <p className="text-[10px] text-gray-500 mt-1">Get performance score & tips</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Row */}
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 mt-2">
                <div className="xl:col-span-9 bg-[#11111a]/80 backdrop-blur-xl border border-gray-800 rounded-[2rem] p-6 shadow-2xl">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center">
                            <History className="w-4 h-4 mr-2 text-cyan-500" /> RECENT UPLOADS
                        </h3>
                        <Link to="/sessions" className="text-xs font-bold text-indigo-400 hover:text-indigo-300">View All &rarr;</Link>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {recentSessions.length > 0 ? recentSessions.map((s, i) => (
                            <Link key={i} to={`/analytics/${s.id}`} className="bg-[#1a1a24] rounded-2xl border border-gray-800/80 overflow-hidden group hover:border-gray-600 transition shadow-lg relative h-[140px] flex flex-col justify-end">
                                <div className="absolute inset-0">
                                    <img src={`http://localhost:8000/api/report/${s.id}/image`} alt="Thumb" className="w-full h-full object-cover opacity-60 group-hover:opacity-80 transition group-hover:scale-105" onError={(e) => e.target.src="https://images.unsplash.com/photo-1540747913346-19e32fc3e64b?auto=format&fit=crop&w=400&q=80"} />
                                </div>
                                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent"></div>
                                
                                <div className="absolute top-3 right-3 flex flex-col items-end">
                                    <span className="text-2xl font-black text-white leading-none shadow-sm">{s.report?.score || 0}</span>
                                    <span className="text-[9px] font-bold text-emerald-400 uppercase">Score</span>
                                </div>

                                <div className="relative p-4 flex justify-between items-end">
                                    <div>
                                        <h4 className="text-sm font-bold text-white leading-tight">Analysed Shot</h4>
                                        <p className="text-[10px] text-gray-400 mt-1">{new Date(s.created_at).toLocaleDateString()}</p>
                                    </div>
                                    <span className="text-[9px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">Completed</span>
                                </div>
                            </Link>
                        )) : (
                            <div className="col-span-3 text-center py-6 text-sm text-gray-500 font-bold">No sessions found in history.</div>
                        )}
                    </div>
                </div>

                <div className="xl:col-span-3 bg-[#11111a]/80 backdrop-blur-xl border border-gray-800 rounded-[2rem] p-6 shadow-2xl flex flex-col justify-center">
                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center mb-6">
                        <Info className="w-4 h-4 mr-2 text-purple-500" /> SESSION INFO
                    </h3>
                    
                    <div className="space-y-5">
                        <div className="flex items-center">
                            <div className="w-10 h-10 rounded-full bg-[#1a1a24] flex items-center justify-center mr-4 shrink-0 border border-gray-800 shadow-inner">
                                <User className="w-5 h-5 text-indigo-400" />
                            </div>
                            <div>
                                <p className="text-[10px] font-bold text-gray-500 uppercase leading-tight mb-0.5">Player</p>
                                <p className="text-sm font-bold text-white">Rahul Sharma</p>
                            </div>
                        </div>
                        <div className="flex items-center">
                            <div className="w-10 h-10 rounded-full bg-[#1a1a24] flex items-center justify-center mr-4 shrink-0 border border-gray-800 shadow-inner">
                                <Aperture className="w-5 h-5 text-cyan-400" />
                            </div>
                            <div>
                                <p className="text-[10px] font-bold text-gray-500 uppercase leading-tight mb-0.5">Session Type</p>
                                <p className="text-sm font-bold text-white">Batting Analysis</p>
                            </div>
                        </div>
                        <div className="flex items-center">
                            <div className="w-10 h-10 rounded-full bg-[#1a1a24] flex items-center justify-center mr-4 shrink-0 border border-gray-800 shadow-inner">
                                <Calendar className="w-5 h-5 text-emerald-400" />
                            </div>
                            <div>
                                <p className="text-[10px] font-bold text-gray-500 uppercase leading-tight mb-0.5">Date & Time</p>
                                <p className="text-sm font-bold text-white">{new Date().toLocaleDateString('en-GB')} • {new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    )
}
