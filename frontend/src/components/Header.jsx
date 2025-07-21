import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth, useClerk } from '@clerk/clerk-react'

export default function Header({ children }) {
  const { getToken, isSignedIn } = useAuth()
  const { openSignIn } = useClerk()
  const [showPostForm, setShowPostForm] = useState(false)
  const [formData, setFormData] = useState({ title: '', link: '' })
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState('')
  const [error, setError] = useState('')

  const handlePostClick = () => {
    if (isSignedIn) {
      setShowPostForm(true)
      setStatus('')
      setError('')
    } else {
      openSignIn()
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!formData.link) return
    setLoading(true)
    setStatus('Scraping conversation...')
    setError('')
    try {
      const token = await getToken()
      setStatus('Adding data to platform...')
      const res = await fetch('/api/chats', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ link: formData.link, content: formData.title })
      })
      if (res.ok) {
        setStatus('Posted!')
        setTimeout(() => {
          setFormData({ title: '', link: '' })
          setShowPostForm(false)
          setStatus('')
          window.location.reload()
        }, 1500)
      } else {
        throw new Error('Failed to post')
      }
    } catch (err) {
      console.error(err)
      setError('Something went wrong! Please delete the chat created on our platform under My Chats, and retry.')
      setStatus('')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <header className="sticky animate-fade-in-up-header top-4 mx-2 z-50 flex justify-center">
        <div className="backdrop-blur-md bg-white/30 border bg-opacity-30 shadow-lg rounded-full w-full max-w-6xl mx-auto px-6 py-2 flex items-center justify-between h-16 text-xs">
          <Link to="/" className="flex items-center hover:opacity-80">
            <img src="/icon.svg" alt="Askd Logo" className="h-6 w-6 mr-2" />
            <span className="bitcount-prop-single-unique text-xl font-semibold text-gray-900">Askd.</span>
          </Link>
          <div className="flex items-center space-x-4">
            {isSignedIn && (
              <>
                <Link to="/allchats" className="text-sm text-gray-700 hover:text-gray-900">
                  All Chats
                </Link>
                <Link to="/my-chats" className="text-sm text-gray-700 hover:text-gray-900">
                  My Chats
                </Link>
              </>
            )}
            {children}
            <button
              onClick={handlePostClick}
              className="border border-black text-black bg-white bg-opacity-20 px-4 py-2 text-xs font-medium rounded-full hover:bg-black hover:text-white transition-colors"
            >
              Post Chat
            </button>
          </div>
        </div>
      </header>

      {showPostForm && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white  p-6 w-full max-w-md rounded-lg shadow-lg text-left">
            <h2 className="text-xl font-bold mb-4 text-black">Post Your Conversation</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                
              {/* <div className="space-y-1">
               
                <label className="block text-sm font-medium text-black">Title</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Enter a clear, descriptive title"
                  className="w-full text-gray-800 px-4 py-2 border border-gray-300 rounded-full text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
                <p className="text-xs text-gray-500 italic">
                  (We auto-detect service types, so just write a good title to help filtering and search.)
                </p>
              </div> */}
              <div className="space-y-1">
                <label className="block text-sm font-medium text-black">Link</label>
                <input
                  type="url"
                  required
                  placeholder="Supported URLs: ChatGPT/Gemini/Claude/Grok"
                  value={formData.link}
                  onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                  className="w-full text-gray-800 px-4 py-2 border border-gray-300 rounded-full text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
                 <p className="text-xs text-gray-500 italic pt-1">
                  (We do not support conversations with images.)
                </p>
              </div>
              {status && (
                <div className="text-center py-2">
                  <p className="text-sm text-blue-600 font-medium">{status}</p>
                </div>
              )}
              {error && (
                <div className="text-center py-2">
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              )}
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowPostForm(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-full text-sm text-gray-500 hover:bg-gray-50"
                  disabled={loading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-full text-sm hover:bg-blue-700 disabled:opacity-50"
                >
                  {loading ? (status || 'Processing...') : 'Post'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
