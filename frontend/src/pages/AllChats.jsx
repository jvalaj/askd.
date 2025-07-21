import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@clerk/clerk-react';
import ChatCard from '../components/ChatCard';

export default function AllChats() {
  const { getToken, isSignedIn } = useAuth();
  const [chats, setChats] = useState([]);
  const [showPostForm, setShowPostForm] = useState(false);
  const [formData, setFormData] = useState({ title: '', link: '' });
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [serviceFilter, setServiceFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');

  useEffect(() => {
    if (isSignedIn) {
      fetchChats();
    }
  }, [isSignedIn]);

  const fetchChats = async () => {
    try {
      console.log('Fetching chats...');
      const token = await getToken();
      console.log('Token received:', token ? 'Yes' : 'No');
      
      const res = await fetch('/api/chats/allchats', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      console.log('Response status:', res.status);
      
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      
      const data = await res.json();
      setChats(data);
    } catch (err) {
      console.error('Fetch error:', err);
    }
  };

  // Handler stubs for UI; actual filtering logic to be implemented
  const handleSearchChange = (e) => setSearchTerm(e.target.value);
  const handleServiceFilterChange = (e) => setServiceFilter(e.target.value);
  const handleCategoryFilterChange = (e) => setCategoryFilter(e.target.value);
  // Filter chats by selected service
  const filteredChats = chats.filter(chat =>
    (serviceFilter === 'all' || chat.service === serviceFilter) &&
    (categoryFilter === 'all' || chat.category === categoryFilter) &&
    (searchTerm === '' || 
     chat.content?.some(msg => msg.message.toLowerCase().includes(searchTerm.toLowerCase())) ||
     chat.username?.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.link) return;
    setLoading(true);
    try {
      const token = await getToken();
      const res = await fetch('/api/chats', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
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

  return (
    <div className="flex-grow w-full bg-white text-gray-900 flex flex-col items-center">
      {/* Page Title */}
      <div className="px-6 py-8 mt-10 border-b w-full bg-gray-200 text-center">
        <h2 className="text-3xl font-bold tracking-tight mb-2">All Chats</h2>
        <p className="text-base text-gray-600">Browse and search through all shared AI conversations</p>
      </div>

      {/* Filters */}
      <div className="w-full max-w-6xl px-6 py-4 flex flex-col sm:flex-row sm:items-center gap-4">
        <input
          type="text"
          placeholder="Search chats..."
          value={searchTerm}
          onChange={handleSearchChange}
          className="flex-1 px-4 py-2 border border-gray-300 rounded-full text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
        />
        <select
          value={serviceFilter}
          onChange={handleServiceFilterChange}
          className="px-4 py-2 border border-gray-300 rounded-full text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
        >
          <option value="all">All Services</option>
          <option value="chatgpt">ChatGPT</option>
          <option value="grok">Grok</option>
          <option value="gemini">Gemini</option>
          <option value="claude">Claude</option>
        </select>
        <select
          value={categoryFilter}
          onChange={handleCategoryFilterChange}
          className="px-4 py-2 border border-gray-300 rounded-full text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
        >
          <option value="all">All Categories</option>
          <option value="education">Education</option>
          <option value="tech">Tech</option>
          <option value="money">Money & Finance</option>
          <option value="creative">Creative</option>
          <option value="business">Business</option>
          <option value="other">Other</option>
        </select>
      </div>

      {/* Chat grid */}
      <div className="px-6 py-8 min-h-[50vh] w-full max-w-6xl">
        {filteredChats.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No chats found.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 justify-center">
            {filteredChats.map((chat) => (
              <ChatCard key={chat._id} chat={chat} />
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
