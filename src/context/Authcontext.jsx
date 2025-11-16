"use client"
import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";

// ✅ Configure axios defaults BEFORE creating instance
const api = axios.create({
  baseURL: '/api',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
});

export const Authcontext = createContext()

export const AuthProvider = ({children})=> {
  const [user, setUser] = useState(null)
  const [status, setStatus] = useState(null)
  const [error, setError] = useState("")

  useEffect(()=>{
    const getUser = async () => {
      try { 
        setStatus("pending")
        const res = await api.get("/auth/user")  // ✅ Using api instance
        setUser(res.data)
        setStatus("success") 
      } catch (error) {
        setUser(null)
        //setError(error.response?.data?.message || error.message)
        setStatus("not authenticated")
      }
    }
    getUser()
  },[])

  const register = async (name, email, password)=>{
    try {
      setStatus("pending")
      const res = await api.post('/auth/register', {
        name, 
        email, 
        password
      })
      setUser(res.data)
      setStatus("success")
    } catch (error) {
      setStatus("error")  // ✅ Should be string not error object
      setError(error.response?.data?.error || error.message)
    }
  }

  const login = async (email, password)=>{
    setError("")
    try {
      setError("")
      setStatus("pending")
      const res = await api.post('/auth/login', {
        email, 
        password
      })

      

      setUser(res.data)
      setStatus("success")
    } catch (error) {
      setStatus("failed to login")
     const errorMsg = error.response?.data?.message 
        || error.response?.data?.error 
        || 'Login failed';
      setError(errorMsg);
    }
  }

  const logout = async ()=>{
    try {
      await api.post('/auth/logout')
      setUser(null)
      setStatus("not authenticated")
    } catch (error) {
      setError(error.response?.data?.message || error.message)
    }
  }

  const value = {user, status, register, login, logout, error}

  return (
    <Authcontext.Provider value={value}>
      {children}
    </Authcontext.Provider>
  )
}

export const useAuth = ()=> useContext(Authcontext)