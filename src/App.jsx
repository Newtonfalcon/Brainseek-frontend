import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/Authcontext'
import LoginPage from './pages/Login'
import RegisterPage from './pages/Register'
import WelcomePage from './pages/Welcome'
import ChatPage from './pages/Messages'
import NebulaLoader from './components/Loader'
import Chats from './pages/Chats'

// PrivateRoute: protects routes that require authentication
function PrivateRoute({ children }) {
  const { user, status } = useAuth()

  if (status === "pending") {
    return (
      <div style={{ display:'flex', justifyContent:'center', alignItems:'center', height:'100vh' }}>
        <NebulaLoader/>
      </div>
    )
  }

  if (!user) return <Navigate to="/login" replace />

  return children
}

// PublicRoute: prevents logged-in users from accessing login/register pages
function PublicRoute({ children }) {
  const { user, status } = useAuth()

  if (status === "pending") return <NebulaLoader />

  if (user) return <Navigate to="/message" replace />

  return children
}

function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<WelcomePage />} />
        <Route path="/login" element={<PublicRoute><LoginPage/></PublicRoute>} />
        <Route path="/register" element={<PublicRoute><RegisterPage/></PublicRoute>} />

        {/* Protected routes */}
        <Route path="/message" element={<PrivateRoute><ChatPage/></PrivateRoute>} />
        <Route path="/chat/:id" element={<PrivateRoute><Chats/></PrivateRoute>} />
      </Routes>
    </AuthProvider>
  )
}

export default App
