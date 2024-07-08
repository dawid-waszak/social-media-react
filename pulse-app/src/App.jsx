import { useState } from 'react'
import Home from './pages/home/Home'
import Login from './pages/login/Login'
import Navbar from './components/navbar/Navbar'
import Footer from './components/footer/Footer'
import { Routes, Route} from "react-router-dom";
import Register from './pages/register/Register'
import Welcome from './pages/welcome/Welcome'
import UserContextProvider from './context/UserContextProvider'

function App() {

  return (
    <>
    <UserContextProvider>
      <Navbar/>
        <Routes>
          <Route path="/" element={<Home />}/>
          <Route path="/login" element={<Login/>}/>
          <Route path="/register" element={<Register/>}/>
          <Route path="/welcome" element={<Welcome/>}/>
        </Routes>
      <Footer/>
    </UserContextProvider>
    </>
  )
}

export default App
