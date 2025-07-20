import React from 'react'
import { Link } from 'react-router-dom'

export default function Header({ onPostClick }) {
  return (
    <header className="sticky top-0 z-50 backdrop-blur bg-white border-b">
      <div className="max-w-6xl mx-auto px-6 flex items-center justify-between h-16">
        <Link to="/" className="text-xl font-semibold text-gray-900 hover:opacity-80">
          chats
        </Link>
        <button
          onClick={onPostClick}
          className="bg-black text-white px-4 py-2 text-sm font-medium rounded-full hover:bg-gray-800 transition-colors"
        >
          Post Chat
        </button>
      </div>
    </header>
  )
}
