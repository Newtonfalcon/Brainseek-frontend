


import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../context/Authcontext";
import NebulaLoader from "../components/Loader";





export default function LoginPage() {

  const router = useNavigate()


  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const {login, user, status, error} = useAuth()

  const handleSubmit =  (e) => {

    e.preventDefault()
    try {

       login( email, password)
       if(user){
        router("/message")
       }
      
      
    } catch (error) {
      alert(error)
    }
  }
useEffect(() => {
  if (status === "pending") return;
  
  if (user) {
    router("/message", { replace: true });
  }
}, [status, user, router]);



  return (
    <div className="min-h-screen flex items-center justify-center bg-white text-black px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-md hover:shadow-lg transition-shadow py-5 px-8  border border-gray-200">
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 rounded-full bg-black flex items-center justify-center text-white text-2xl font-bold">
            BS
          </div>
        </div>

        <h1 className="text-3xl font-semibold text-center mb-6">
          Login your BrainSeek Account
        </h1>

        <form
          className="space-y-5"
          onSubmit={handleSubmit}
        >
          

          <div>
            <label className="block text-gray-700 mb-2 text-sm">Email</label>
            <input
              type="email"
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-black transition"
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-2 text-sm">Password</label>
            <input
              type="password"
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-black transition"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 mt-4 bg-black hover:bg-gray-900 text-white font-medium rounded-xl transition"
          >
            {status === "pending" ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="text-gray-600 text-center text-sm mt-6">
          Don't have an accout?{" "}
          <a
            href="/register" 
            className="text-black font-medium hover:underline"
          >
          Register Here
          </a>
         
        </p>
         <p className="text-red-600 text-sm text-center font-light py-2">{error && error}</p>
      </div>
    </div>
  );
}
