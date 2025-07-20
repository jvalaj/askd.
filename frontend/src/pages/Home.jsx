import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function Home() {
  const [chats, setChats] = useState([]);
  const [showPostForm, setShowPostForm] = useState(false);
  const [formData, setFormData] = useState({ title: '', link: '' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchChats();
  }, []);

  const fetchChats = async () => {
    try {
      const res = await fetch('/api/chats');
      const data = await res.json();
      setChats(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.link) return;
    setLoading(true);
    try {
      const res = await fetch('/api/chats', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ link: formData.link, content: formData.title }),
      });
      if (res.ok) {
        const chat = await res.json();
        setChats((prev) => [chat, ...prev]);
        setFormData({ title: '', link: '' });
        setShowPostForm(false);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const latestChats = chats.slice(0, 5);

  return (
    <div className="min-h-screen w-full flex flex-col bg-white text-gray-900">

      {/* Hero Section */}
      <div className="flex-1 flex flex-col justify-center items-center text-center py-16 px-6 bg-gradient-to-br from-gray-100 to-gray-50">
        <h1 className="text-5xl md:text-6xl font-extrabold mb-6">
          Everyone’s talking to AI
        </h1>
        <h2 className="text-2xl md:text-3xl font-medium text-gray-700 mb-8">
          Aren’t you curious?
        </h2>
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <button
            onClick={() => setShowPostForm(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg font-medium rounded-lg shadow-md transition-transform transform hover:scale-105"
          >
            Post your chat
          </button>
          <Link
            to="/chats"
            className="bg-gray-900 hover:bg-black text-white px-8 py-3 text-lg font-medium rounded-lg shadow-md transition-transform transform hover:scale-105"
          >
            View All Chats
          </Link>
        </div>
      </div>

      {/* Latest Chats Preview */}
      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="flex justify-between items-center mb-8">
          <h3 className="text-2xl font-semibold">Latest Chats</h3>
          <Link to="/chats" className="text-blue-600 hover:text-blue-700 font-medium">
            View all →
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {latestChats.length > 0 ? (
            latestChats.map((chat) => (
              <Link
                key={chat._id}
                to={`/chat/${chat.slug}`}
                className="border border-gray-200 p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="mb-2">
                  <h4 className="font-medium text-gray-800 truncate">
                    {chat.content?.[0]?.message.slice(0, 50) || 'View Chat'}
                  </h4>
                </div>
                <div className="flex justify-between items-center text-sm text-gray-500">
                  <span>#{chat.slug}</span>
                  <span>{new Date(chat.createdAt).toLocaleDateString()}</span>
                </div>
              </Link>
            ))
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500">No chats yet. Be the first to share!</p>
            </div>
          )}
        </div>
      </div>

      {/* Post form modal */}
      {showPostForm && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white p-6 w-full max-w-md rounded-lg shadow-lg">
            <h2 className="text-xl font-bold mb-4">Post Your Chat</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Title</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Link</label>
                <input
                  type="url"
                  required
                  value={formData.link}
                  onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowPostForm(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-gray-500 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                >
                  {loading ? 'Posting...' : 'Post'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}


    </div>
  );
}
