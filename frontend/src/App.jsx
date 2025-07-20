import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Header from './components/Header'
import Footer from './components/Footer'
import Home from './pages/Home'
import ChatDetail from './pages/ChatDetail'
import AllChats from './pages/AllChats'

export default function App() {
  return (
    <Router>
      <Header onPostClick={() => {}} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/chats" element={<AllChats />} />
        <Route path="/chat/:slug" element={<ChatDetail />} />
      </Routes>
      <Footer />
    </Router>
  )
}
