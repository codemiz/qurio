import { useEffect, useState } from 'react'

import Register from './pages/register'
import Login from './pages/Login'
import Home from './pages/Home'
import { BrowserRouter , Routes , Route } from 'react-router-dom'
import ProtectedRoute from './components/ProtectedRoute'
import { AuthProvider } from './context/AuthContext'

function App() {
 
  return (
    <AuthProvider>
      <BrowserRouter>
      <Routes>
        <Route path='/login' element ={<Login />} />
        <Route path='/register' element={<Register />} />
        <Route path='/' element={
          <ProtectedRoute>
            <Home/>
          </ProtectedRoute>
        } />
      </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App

