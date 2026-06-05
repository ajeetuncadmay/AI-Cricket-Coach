import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Activity, UploadCloud, BarChart3, ChevronRight, PlayCircle, ShieldCheck } from 'lucide-react'

export default function Home() {
    const fadeUp = {
        hidden: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
    }
    const staggercontainer = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.2 } }
    }

    return (
        <div className="min-h-screen bg-[#050505] text-white overflow-hidden selection:bg-primary-500 selection:text-white">
            
            {/* Background Effects */}
            <div className="fixed top-0 left-0 w-full h-full overflow-hidden focus:outline-none pointer-events-none z-0">
                <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-indigo-900/20 blur-[120px]"></div>
                <div className="absolute bottom-[10%] right-[-10%] w-[40%] h-[60%] rounded-full bg-primary-900/20 blur-[150px]"></div>
                <div className="absolute top-[40%] left-[60%] w-[30%] h-[30%] rounded-full bg-purple-900/10 blur-[100px]"></div>
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03]"></div>
            </div>

            <div className="relative z-10">
                {/* HERO SECTION */}
                <motion.div 
                    className="max-w-7xl mx-auto px-6 pt-32 pb-20 text-center"
                    initial="hidden"
                    animate="visible"
                    variants={staggercontainer}
                >
                    <motion.div variants={fadeUp} className="inline-flex items-center space-x-2 bg-gray-900/50 border border-gray-800 rounded-full px-4 py-1.5 mb-8 backdrop-blur-md">
                        <span className="flex h-2 w-2 rounded-full bg-primary-500 animate-pulse"></span>
                        <span className="text-sm font-medium text-gray-300">Powered by Ajeet Singh ❤️</span>
                    </motion.div>
                    
                    <motion.h1 variants={fadeUp} className="text-6xl md:text-8xl font-black tracking-tighter mb-8 leading-[1.1]">
                        AI Cricket Coach <span className="inline-block animate-bounce-slow">🤖</span>
                    </motion.h1>
                    
                    <motion.p variants={fadeUp} className="text-xl md:text-2xl text-gray-400 font-medium max-w-3xl mx-auto leading-relaxed mb-12">
                        Upload your cricket shot <span className="text-white mx-2">→</span> AI analyzes <span className="text-white mx-2">→</span> Get score & tips
                    </motion.p>
                    
                    <motion.div variants={fadeUp} className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Link to="/register" className="w-full sm:w-auto flex items-center justify-center bg-white text-black px-8 py-4 rounded-2xl font-bold text-lg hover:scale-105 active:scale-95 transition-transform shadow-[0_0_40px_rgba(255,255,255,0.3)]">
                            Get Started
                        </Link>
                        <Link to="/upload" className="w-full sm:w-auto flex items-center justify-center bg-gray-900/80 border border-gray-700 text-white px-8 py-4 rounded-2xl font-bold text-lg hover:bg-gray-800 hover:border-gray-500 backdrop-blur-md transition-all">
                            <UploadCloud className="w-5 h-5 mr-2" /> Upload Now
                        </Link>
                    </motion.div>
                </motion.div>

                {/* SHOWCASE MOCKUP */}
                <motion.div 
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6, duration: 1 }}
                    className="max-w-5xl mx-auto px-6 mb-32"
                >
                    <div className="relative rounded-3xl overflow-hidden border border-gray-800/60 shadow-2xl shadow-indigo-500/10 group">
                        <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent z-10 h-full w-full pointer-events-none"></div>
                        <img 
                            src="https://images.unsplash.com/photo-1540747913346-19e32fc3e64b?auto=format&fit=crop&w=1200&q=80" 
                            alt="Cricket Player Action Shot" 
                            className="w-full h-[300px] md:h-[500px] object-cover opacity-80 group-hover:scale-105 group-hover:opacity-100 transition-all duration-[2s]"
                        />
                        <div className="absolute inset-0 flex items-center justify-center z-20">
                            <div className="w-20 h-20 bg-white/10 backdrop-blur-xl border border-white/20 rounded-full flex items-center justify-center shadow-2xl cursor-pointer hover:bg-white hover:text-black transition-all">
                                <PlayCircle className="w-10 h-10 ml-1" />
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* FEATURE CARDS */}
                <div className="max-w-7xl mx-auto px-6 pb-32">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold tracking-tight mb-4">Elite Capabilities</h2>
                        <p className="text-gray-400 text-lg">Pro-level biomechanics at your fingertips.</p>
                    </div>
                    
                    <motion.div 
                        className="grid md:grid-cols-3 gap-6"
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-100px" }}
                        variants={staggercontainer}
                    >
                        {[
                            {
                                icon: <UploadCloud className="w-8 h-8 text-white" />,
                                title: "Upload Video/Image",
                                desc: "Lightning fast processing. Drag, drop, and let the AI do the heavy lifting instantly.",
                                color: "from-blue-500 to-cyan-400"
                            },
                            {
                                icon: <Activity className="w-8 h-8 text-white" />,
                                title: "AI Analysis",
                                desc: "Military-grade pose estimation tracks 33 multi-dimensional body joints in real-time.",
                                color: "from-indigo-500 to-purple-500"
                            },
                            {
                                icon: <BarChart3 className="w-8 h-8 text-white" />,
                                title: "Performance Score",
                                desc: "Get an objective grade, metric breakdown, and structured tips curated by AI.",
                                color: "from-emerald-400 to-teal-500"
                            }
                        ].map((feature, i) => (
                            <motion.div key={i} variants={fadeUp} className="relative group">
                                <div className="absolute inset-0 bg-gradient-to-b from-gray-800/50 to-gray-900/50 rounded-3xl blur-md opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                <div className="relative bg-[#0d0d0d] border border-gray-800/80 p-8 rounded-3xl overflow-hidden hover:border-gray-600 transition-colors h-full flex flex-col">
                                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-6 shadow-lg shadow-black/50`}>
                                        {feature.icon}
                                    </div>
                                    <h3 className="text-2xl font-bold mb-3">{feature.title}</h3>
                                    <p className="text-gray-400 font-medium leading-relaxed">{feature.desc}</p>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
                
                {/* CTA SECTION */}
                <div className="border-t border-gray-800/50">
                    <div className="max-w-4xl mx-auto text-center px-6 py-24">
                        <ShieldCheck className="w-12 h-12 text-primary-500 mx-auto mb-6" />
                        <h2 className="text-4xl md:text-5xl font-black mb-6">Start Coaching Now</h2>
                        <p className="text-xl text-gray-400 mb-10">Join thousands of players refining their biomechanics.</p>
                        <Link to="/register" className="inline-flex items-center bg-white text-black px-10 py-5 rounded-full font-bold text-lg hover:shadow-[0_0_30px_rgba(255,255,255,0.4)] transition-all">
                            Get Your Free Analysis <ChevronRight className="w-5 h-5 ml-2" />
                        </Link>
                    </div>
                </div>

            </div>
        </div>
    )
}