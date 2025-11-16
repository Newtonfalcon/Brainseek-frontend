import { BrowserRouter, Routes, Route, Navigate } from 'react-router'
import { AuthProvider, useAuth } from './context/Authcontext'
import LoginPage from './pages/Login'
import RegisterPage from './pages/Register'

import WelcomePage from './pages/Welcome'
import ChatPage from './pages/Messages'
import NebulaLoader from './components/Loader'
import { useEffect } from 'react'
import Chats from './pages/Chats'


function PrivateRoute({ children }) {
  const { user, status } = useAuth()
  
  if (status === "pending") return <div><NebulaLoader/></div>
  if (!user) return <Navigate to="/login" />
  
  return children
}


function App() {
  return (
    
      <AuthProvider>
        <Routes>
          <Route path="/" element={<WelcomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route 
            path="/message" 
            element={
              <PrivateRoute>
                <ChatPage/>
              </PrivateRoute>
            } 
          />

          <Route path="/chat/:id" element={<Chats/>} />

        </Routes>
      </AuthProvider>
    
  )
}

export default App
