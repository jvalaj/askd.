import React, { useState, useEffect } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '@clerk/clerk-react'
import ChatCard from '../components/ChatCard'

export default function ChatDetail() {
  const { slug } = useParams()
  const navigate = useNavigate();
  const { getToken } = useAuth()
  const [chat, setChat] = useState(null)
  const [showScrollTop, setShowScrollTop] = useState(false)

  useEffect(() => {
    const fetchChat = async () => {
      try {
        const token = await getToken() // Get auth token
        const res = await fetch(`/api/chats/${slug}`, {
          headers: {
            Authorization: `Bearer ${token}` // Add auth header
          }
        })
        const data = await res.json()
        setChat(data)
      } catch (err) {
        console.error(err)
      }
    }
    
    fetchChat()
  }, [slug, getToken])

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

  if (!chat) {
    return (
      <div className="min-h-screen w-full bg-white text-gray-900 flex flex-col items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500 text-lg">Loading your chats...</p>
        </div>
      </div>
    );
  }


  return (
    <div className="flex-grow mx-auto max-w-6xl bg-white flex flex-col">
    
  {/* Back button */}
      <div className="p-4 mt-10 flex rounded-full justify-between align-middle bg-gray-100">
        <button onClick={() => navigate(-1)} className="text-gray-600 hover:text-gray-800 text-sm font-medium">
          &larr; Back
        </button>
        <div className="text-gray-500 text-sm">
          {chat.service} 
        </div>
      </div>
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
                  <div className="whitespace-pre-wrap text-sm break-words ">
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
