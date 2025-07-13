import { useState } from 'react'
import { login } from '../api'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import { NavLink } from 'react-router-dom'
function Login() {
  const {setUser , user} = useAuth()
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
  email: "",
  password: ""
  })
    
  const handleChange = (e) => {
      setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async () => {
    try {
      const res = await login(formData);
      setUser(res.data.user);
      console.log("User logged in", res.data.user);
  
      setTimeout(() => {
        console.log("Redirecting to home...");
        navigate("/");
      }, 100);
    } catch (error) {
       console.log("Full error:", error);
       console.log("Login error:", error?.response?.data || error.message);
    }
  }
      
  return (
    <div className="w-full h-screen bg-[url('/src/assets/bg.png')] bg-center bg-cover flex justify-center items-center flex-col relative transition-all duration-300">
         <img src="/src/assets/logo.png" alt="logo" width={160} className='absolute top-6 left-1/2 -translate-x-1/2' />
      <div className="bg-white p-8 rounded-2xl shadow-md w-80 text-center">
        <h1 className="font-light text-3xl mb-2">
          Welcome Back to <span className="font-bold text-indigo-500">Qurio</span>
        </h1>
        <h2 className="font-light text-md text-gray-500 mb-6">
          Log in to continue chatting
        </h2>

        <input
          type="email"
          name='email'
          value={formData.email}
          onChange={handleChange}
          className="w-full bg-[#F9FAFB] border border-gray-300 rounded-md px-3 py-2 text-sm text-[#111827] focus:outline-none focus:ring-2 focus:ring-indigo-300 mb-3"
          placeholder="Enter your email"
        />

        <input
          type="password"
          name='password'
          value={formData.password}
          onChange={handleChange}
          className="w-full bg-[#F9FAFB] border border-gray-300 rounded-md px-3 py-2 text-sm text-[#111827] focus:outline-none focus:ring-2 focus:ring-indigo-300 mb-1"
          placeholder="Enter your password"
        />

        <div className="text-right w-full text-xs text-indigo-500 mb-4 hover:underline cursor-pointer">
          Forgot password?
        </div>

        <button onClick={handleSubmit} className="bg-indigo-500 text-white w-full py-2 text-sm font-medium rounded-md hover:bg-indigo-600 transition">
          Log In
        </button>

        <p className="text-sm mt-4 text-gray-600">
          Don’t have an account?{" "}
          <NavLink to={"/register"} >
          <span className="text-indigo-500 font-medium cursor-pointer hover:underline">
            Sign up
          </span>
          </NavLink>
        </p>
      </div>
    </div>
  )
}

export default Login

