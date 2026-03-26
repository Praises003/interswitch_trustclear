import { useState } from 'react'
import reactLogo from './assets/react.svg'
import { Routes, Route, Link } from "react-router-dom";
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import Dashboard from './pages/Dashboard'
import CheckoutPage from './pages/CheckoutPage'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <Routes>
        <Route path="/" element={<Dashboard/>} />
        <Route path="/checkout" element={<CheckoutPage />} />
      </Routes>
    </>
  ) 
}

export default App
