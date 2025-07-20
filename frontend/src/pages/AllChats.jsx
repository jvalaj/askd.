import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function AllChats() {
  const [chats, setChats] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
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

  const filtered = chats.filter((c) => {
    const text = c.content?.map((m) => m.message).join(' ') + ' ' + c.link;
    return text.toLowerCase().includes(searchTerm.toLowerCase());
  });

  return (
    <div className="min-h-screen w-full bg-white text-gray-900 flex flex-col items-center">
      {/* Page Title */}
      <div className="px-6 py-8 border-b w-full bg-gray-50 text-center">
        <h2 className="text-3xl font-bold tracking-tight mb-2">All Chats</h2>
        <p className="text-base text-gray-600">Browse and search through all shared AI conversations</p>
      </div>

      {/* Search */}
      <div className="px-6 py-6 border-b bg-white w-full max-w-4xl">
        <div className="max-w-lg mx-auto">
          <input
            type="text"
            placeholder="Search chats..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-300 focus:outline-none text-sm"
          />
        </div>
      </div>

      {/* Chat grid */}
      <div className="px-6 py-8 min-h-[50vh] w-full max-w-6xl">
        {filtered.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">
              {searchTerm ? 'No chats match your search.' : 'No chats found.'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 justify-center">
            {filtered.map((chat) => (
              <Link
                key={chat._id}
                to={`/chat/${chat.slug}`}
                className="border border-gray-200 p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="mb-3">
                  <h3 className="font-medium text-gray-800 text-sm leading-snug truncate">
                    {chat.content?.[0]?.message.slice(0, 80) + (chat.content?.[0]?.message.length > 80 ? '...' : '') || 'View Chat'}
                  </h3>
                </div>
                <div className="flex justify-between items-center text-xs text-gray-500">
                  <span className="font-mono">#{chat.slug}</span>
                  <span>{new Date(chat.createdAt).toLocaleDateString()}</span>
                </div>
              </Link>
            ))}
          </div>
        )}
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
