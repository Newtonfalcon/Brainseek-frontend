import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";

const api = axios.create({
  baseURL: 'https://brainseekapi.vercel.app/api',
  withCredentials: true, // crucial for iOS
  headers: {
    'Content-Type': 'application/json'
  }
});

export const Authcontext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [status, setStatus] = useState("pending"); // "pending" | "authenticated" | "not authenticated" | "error"
  const [error, setError] = useState("");

  // Fetch current user on mount
  useEffect(() => {
    const getUser = async () => {
      setStatus("pending");
      try {
        const res = await api.get("/auth/user");
        setUser(res.data);
        setStatus("authenticated");
      } catch (err) {
        setUser(null);
        setError(err.response?.data?.message || err.message);
        setStatus("not authenticated");
      }
    };
    getUser();
  }, []);

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

  const logout = async () => {
   
  setUser(null);             // immediately clear user state
  setStatus("not authenticated"); // mark user as logged out
  try {
    await api.post('/auth/logout'); // async cookie clearing
  } catch (err) {
    console.error("Logout failed:", err);
  
    };

  };

  const value = { user, status, error, register, login, logout };

  return (
    <Authcontext.Provider value={value}>
      {children}
    </Authcontext.Provider>
  );
};

export const useAuth = () => useContext(Authcontext);
