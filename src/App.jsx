import { useEffect, useState } from 'react'

import Register from './pages/Register'
import Login from './pages/Login'
import Home from './pages/Home'
import { BrowserRouter , Routes , Route } from 'react-router-dom'
import ProtectedRoute from './components/ProtectedRoute'
import { AuthProvider } from './context/AuthContext'
import PublicRoute from './components/PublicRoute'

function App() {
 
  return (
    <AuthProvider>
      <BrowserRouter>
      <Routes>
        <Route path='/login' element ={
          <PublicRoute>
            <Login />
          </PublicRoute>
          } />
        <Route path='/register' element={
          <PublicRoute>
            <Register />
          </PublicRoute>
          } />
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

