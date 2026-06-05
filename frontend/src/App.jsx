import { Routes, Route, Navigate } from 'react-router-dom'
import Navbar from './components/Navbar'
import Layout from './components/Layout'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import Upload from './pages/Upload'
import Analytics from './pages/Analytics'
import Pricing from './pages/Pricing'
import Sessions from './pages/Sessions'
import Profile from './pages/Profile'


const ProtectedRoute = ({ children }) => {
    const token = localStorage.getItem('token')
    if (!token) return <Navigate to="/login" />
    return children
}

function App() {
    return (
        <Routes>
            {/* Public Auth Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Protected App Routes */}
            <Route element={
                <ProtectedRoute>
                    <Layout />
                </ProtectedRoute>
            }>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/upload" element={<Upload />} />
                <Route path="/analytics/:id" element={<Analytics />} />
                <Route path="/sessions" element={<Sessions />} />
                <Route path="/analytics" element={<Sessions />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/pricing" element={<Pricing />} />

                <Route path="/" element={<Navigate to="/dashboard" replace />} />
            </Route>
        </Routes>
    )
}

export default App