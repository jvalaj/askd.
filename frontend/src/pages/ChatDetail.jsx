import React, { useState, useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import Header from '../components/Header'
import Footer from '../components/Footer'

export default function ChatDetail() {
  const { slug } = useParams()
  const [chat, setChat] = useState(null)
  const [showScrollTop, setShowScrollTop] = useState(false)

  useEffect(() => {
    fetch(`/api/chats/${slug}`)
      .then(res => res.json())
      .then(setChat)
      .catch(console.error)
  }, [slug])

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  if (!chat) return <div className="p-6">Loading...</div>

  return (
    <div className="min-h-screen bg-white flex flex-col">

      {/* Chat Container */}
      <div className="flex-1 flex justify-center">
        <div className="w-full max-w-3xl">
          {chat.content.map((msg, index) => (
            <div
              key={msg._id}
              className="py-6 px-4"
            >
              <div className={`max-w-3xl mx-auto ${
                msg.role === 'user' ? 'flex justify-end' : 'flex justify-start'
              }`}>
                {/* Message Content */}
                <div className={`min-w-0 max-w-[70%] px-4 py-3 rounded-lg ${
                  msg.role === 'user' 
                    ? 'bg-gray-200 text-gray-900' 
                    : 'bg-gray-50 text-gray-900'
                }`}>
                  <div className="whitespace-pre-wrap break-words leading-relaxed">
                    {msg.message}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll to Top Button */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-gray-600 hover:bg-gray-700 text-white p-3 rounded-full shadow-lg transition-all z-50"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
          </svg>
        </button>
      )}

    </div>
  )
}
