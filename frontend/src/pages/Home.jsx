import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

export default function Home() {
  const [chats, setChats] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [showPostForm, setShowPostForm] = useState(false)
  const [formData, setFormData] = useState({ title: '', link: '' })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchChats()
  }, [])

  const fetchChats = async () => {
    try {
      const res = await fetch('/api/chats')
      const data = await res.json()
      setChats(data)
    } catch (err) {
      console.error(err)
    }
  }

  const handleSubmit = async e => {
    e.preventDefault()
    if (!formData.link) return
    setLoading(true)
    try {
      const res = await fetch('/api/chats', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ link: formData.link, content: formData.title })
      })
      if (res.ok) {
        const chat = await res.json()
        setChats(prev => [chat, ...prev])
        setFormData({ title: '', link: '' })
        setShowPostForm(false)
      }
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const filtered = chats.filter(c => {
    const text = c.content?.map(m => m.message).join(' ') + ' ' + c.link
    return text.toLowerCase().includes(searchTerm.toLowerCase())
  })

  return (
    <div className="min-h-screen w-full bg-white">
      {/* Header */}
      <header className="border-b px-6 py-4 flex justify-between">
        <div>
          <h1 className="text-2xl font-bold text-black">Chats.com</h1>
          <p className="text-gray-600 text-sm">Share and discover AI conversations</p>
        </div>
        <button onClick={() => setShowPostForm(true)} className="bg-black text-white px-4 py-2 text-sm rounded-md hover:bg-gray-800 transition-colors">
          Post Chat
        </button>
      </header>

      {/* Search */}
      <div className="px-6 py-4 border-b">
        <input
          type="text"
          placeholder="Search chats..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className="w-full px-3 py-2 border text-sm focus:outline-none rounded-md"
        />
      </div>

      {/* Chat list */}
      <div className="px-6 py-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map(chat => (
            <Link
              key={chat._id}
              to={`/chat/${chat.slug}`}
              className="border p-4 hover:bg-gray-50 rounded-lg"
            >
              <div className="mb-2">
                <h3 className="font-medium text-black truncate">
                  {chat.content?.[0]?.message.slice(0, 50) || 'View Chat'}
                </h3>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-500">#{chat.slug}</span>
                <span className="text-xs text-gray-600">{new Date(chat.createdAt).toLocaleDateString()}</span>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Post form modal */}
      {showPostForm && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white p-6 w-full max-w-md rounded-lg shadow-lg">
            <h2 className="text-xl font-bold text-black mb-4">Post Your Chat</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm text-black mb-1">Title</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={e => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-2 border text-sm text-black focus:outline-none rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm text-black mb-1">Link</label>
                <input
                  type="url"
                  required
                  value={formData.link}
                  onChange={e => setFormData({ ...formData, link: e.target.value })}
                  className="w-full px-3 py-2 border text-sm text-black focus:outline-none rounded-md"
                />
              </div>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowPostForm(false)}
                  className="flex-1 px-4 py-2 border text-sm rounded-md text-gray-500 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 px-4 py-2 bg-black text-white text-sm rounded-md hover:bg-gray-800 disabled:opacity-50"
                >
                  {loading ? 'Posting...' : 'Post'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
