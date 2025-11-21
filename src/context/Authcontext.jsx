import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";

const api = axios.create({
  baseURL: 'https://brainseekapi.onrender.com/api',
  withCredentials: true, // crucial for iOS Safari + cookies
  headers: {
    'Content-Type': 'application/json'
  }
});

export const Authcontext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [status, setStatus] = useState("pending"); // pending | authenticated | not authenticated | error
  const [error, setError] = useState("");

  // useEffect: fetch current user
  useEffect(() => {
    let ignore = false; // flag to prevent stale async overwrites

    const getUser = async () => {
      try {
        setStatus("pending");
        const res = await api.get("/auth/user");
        if (!ignore) {
          setUser(res.data);
          setStatus("authenticated");
        }
      } catch (err) {
        if (!ignore) {
          setUser(null);
          setError(err.response?.data?.message || err.message);
          setStatus("not authenticated");
        }
      }
    };

    getUser();

    return () => { ignore = true }; // cleanup on unmount
  }, []);

  // Register
  const register = async (name, email, password) => {
    setStatus("pending");
    setError("");
    try {
      const res = await api.post('/auth/register', { name, email, password });
      setUser(res.data);
      setStatus("authenticated");
    } catch (err) {
      setStatus("error");
      setError(err.response?.data?.error || err.message);
    }
  };

  // Login
  const login = async (email, password) => {
    setStatus("pending");
    setError("");
    try {
      const res = await api.post('/auth/login', { email, password });
      setUser(res.data);
      setStatus("authenticated");
    } catch (err) {
      setStatus("error");
      setError(err.response?.data?.message || err.response?.data?.error || 'Login failed');
    }
  };

  // Logout
  const logout = async () => {
    // Immediately clear state so UI updates instantly
    setUser(null);
    setStatus("not authenticated");
    setError("");

    try {
      // Call backend to destroy cookie
      await api.post('/auth/logout');
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  const value = { user, status, error, register, login, logout };

  return (
    <Authcontext.Provider value={value}>
      {children}
    </Authcontext.Provider>
  );
};

export const useAuth = () => useContext(Authcontext);
