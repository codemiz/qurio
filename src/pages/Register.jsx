import React, { useState } from 'react'
import { register } from '../api'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import { NavLink } from 'react-router-dom'


function Register() {
  const {setUser} = useAuth()
  const navigate = useNavigate()
    const [step, setStep] = useState(1)
    const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
    })


  const nextStep = () => setStep(prev => prev + 1)
  const prevStep = () => setStep(prev => prev - 1)

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }
  const handleSubmit = async ()=>{
    try {
      const res = await register(formData)
      setUser(res.data.user)
      navigate("/")
      console.log(res);
      
    } catch (error) {
      console.log(error.response.data);
      
    }
    
  }
  return (
    <div className="w-full h-screen bg-[url('/src/assets/bg.png')] bg-center bg-cover flex justify-center items-center flex-col relative transition-all duration-300">
    <img src="/src/assets/logo.png" alt="logo" width={160} className='absolute top-6 left-1/2 -translate-x-1/2' />

    <div className="bg-white p-8 rounded-2xl shadow-md w-80 text-center backdrop-blur-sm bg-opacity-95 transition-all duration-500">
      <h1 className="font-light text-3xl mb-4">
        Welcome to <span className="font-bold text-indigo-500">Qurio</span>
      </h1>

      {/* Step 1 */}
      <div className={`transition-all duration-500 ${step === 1 ? 'opacity-100 scale-100' : 'opacity-0 scale-95 hidden'}`}>
        <h2 className="font-light text-md text-gray-500 mb-3">
          Let's take you onboard
        </h2>
        <input
          type="email"
          name='email'
          value={formData.email}
          onChange={handleChange}
          className="w-full bg-[#F9FAFB] border border-gray-200 rounded-md px-3 py-2.5 text-sm text-[#111827] focus:outline-none focus:ring-2 focus:ring-indigo-300 mb-3"
          placeholder="Email address"
        />
        <button
          onClick={nextStep}
          className="bg-indigo-500 text-white w-full py-2 text-sm font-medium rounded-md hover:bg-indigo-600 transition active:scale-95"
        >
          Next
        </button>
      </div>

      {/* Step 2 */}
      <div className={`transition-all duration-500 ${step === 2 ? 'opacity-100 scale-100' : 'opacity-0 scale-95 hidden'}`}>
        <h2 className="font-light text-md text-gray-500 mb-3">
          You're all set — just enter your name
        </h2>
        <input
          type="text"
          name='name'
          value={formData.name}
          onChange={handleChange}
          className="w-full bg-[#F9FAFB] border border-gray-200 rounded-md px-3 py-2.5 text-sm text-[#111827] focus:outline-none focus:ring-2 focus:ring-indigo-300 mb-3"
          placeholder="Enter your name"
        />
        <button
          onClick={nextStep}
          className="bg-indigo-500 text-white w-full py-2 text-sm font-medium rounded-md hover:bg-indigo-600 transition active:scale-95"
        >
          Next
        </button>
      </div>

      {/* Step 3 */}
      <div className={`transition-all duration-500 ${step === 3 ? 'opacity-100 scale-100' : 'opacity-0 scale-95 hidden'}`}>
        <h2 className="font-light text-md text-gray-500 mb-3">
          Create a strong 6-digit password
        </h2>
        <input
          type="password"
          name='password'
          value={formData.password}
          onChange={handleChange}
          className="w-full bg-[#F9FAFB] border border-gray-200 rounded-md px-3 py-2.5 text-sm text-[#111827] focus:outline-none focus:ring-2 focus:ring-indigo-300 mb-3"
          placeholder="Create password"
        />
        <button
          onClick={handleSubmit}
          className="bg-green-500 text-white w-full py-2 text-sm font-medium rounded-md hover:bg-green-600 transition active:scale-95"
        >
          Submit
        </button>
      </div>

      {/* Step Indicator Dots */}
      <div className="flex justify-center gap-2 mt-4">
        {[1, 2, 3].map((s) => (
          <div key={s} className={`w-2 h-2 rounded-full ${step === s ? 'bg-indigo-500 scale-125' : 'bg-gray-300'} transition-transform duration-300`} />
        ))}
      </div>

      <p className="text-sm mt-4 text-gray-600">
        Already have an account?{" "}
        <NavLink to={"/login"}>
          <span className="text-indigo-500 font-medium cursor-pointer hover:underline">
          Log in
        </span>
          </NavLink>
      </p>
    </div>
  </div>
  )
}

export default Register
