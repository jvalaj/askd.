import React, { useState, useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'

export default function ChatDetail() {
  const { slug } = useParams()
  const [chat, setChat] = useState(null)

  useEffect(() => {
    fetch(`/api/chats/${slug}`)
      .then(res => res.json())
      .then(setChat)
      .catch(console.error)
  }, [slug])

  if (!chat) return <div className="p-6">Loading...</div>

  return (
    <div className="min-h-screen w-1/2 bg-white p-6 flex flex-col">
      <Link to="/" className="text-blue-600 mb-4 text-sm">← Back to list</Link>
      <h1 className="text-xl font-bold mb-4">Conversation</h1>
      <div className="flex flex-col space-y-4">
        {chat.content.map(msg => (
          <div key={msg._id} className={`p-4 rounded-md ${msg.role === 'user' ? 'bg-gray-100 self-end' : 'bg-blue-50 self-start'}`}>
            <div className="text-xs text-gray-500 mb-1 capitalize">{msg.role}</div>
            <div className="text-black whitespace-pre-wrap">{msg.message}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
