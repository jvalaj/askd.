import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import ChatDetail from './pages/ChatDetail'

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/chat/:slug" element={<ChatDetail />} />
      </Routes>
    </Router>
  )
}
