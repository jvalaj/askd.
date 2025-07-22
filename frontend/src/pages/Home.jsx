import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth, useClerk } from '@clerk/clerk-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export default function Home() {
  const { getToken, isSignedIn } = useAuth();
  const { openSignIn } = useClerk();
  const navigate = useNavigate();
  const [chats, setChats] = useState([]);
  const [showPostForm, setShowPostForm] = useState(false);
  const [formData, setFormData] = useState({ title: '', link: '' });
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');

  const handlePostClick = () => {
    if (isSignedIn) {
      setShowPostForm(true);
      setStatus('');
      setError('');
    } else {
      openSignIn();
    }
  };

  const handleViewAllChatsClick = () => {
    if (isSignedIn) {
      navigate('/allchats');
    } else {
      openSignIn();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.link) return;
    setLoading(true);
    setStatus('Scraping conversation...');
    setError('');
    try {
      const token = await getToken();
      setStatus('Adding data to platform...');
      const res = await fetch(`${API_URL}/api/chats`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ link: formData.link, content: formData.title }),
      });
      if (res.ok) {
        const chat = await res.json();
        setStatus('Posted!');
        setTimeout(() => {
          setChats(prev => [chat, ...prev]);
          setFormData({ title: '', link: '' });
          setShowPostForm(false);
          setStatus('');
        }, 1500);
      } else {
        throw new Error('Failed to post');
      }
    } catch (err) {
      console.error(err);
      setError('Something went wrong! Please delete the chat created on our platform under My Chats, and retry.');
      setStatus('');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-grow bg-white flex flex-col justify-center text-center py-16 px-6 text-gray-900">
      <div className="bitcount-prop-single-unique text-6xl  font-semibold text-blue-500 mb-4 flex items-baseline justify-center flex-wrap animate-fade-in-up">
        <span>Everyone's talking to AI</span>
       
        </div>
      <div className="mb-10 bitcount-prop-single-unique text-2xl md:text-3xl font-medium text-gray-700 animate-fade-in-up-delay-1">
        Aren't you <span className="bitcount-prop-single-unique text-red-400 animate-blink">curious?</span>
      </div>
      <br/> <br/>
      <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-in-up-delay-2">
        <button
          onClick={handlePostClick}
          className="border border-blue-600 text-blue-600 bg-white bg-opacity-20 px-6 py-2 text-base font-medium rounded-full shadow-md transition-transform transform hover:scale-105 hover:bg-blue-600 hover:text-white hover:bg-opacity-30"
        >
          Post a conversation
        </button>
        <button
          onClick={handleViewAllChatsClick}
          className="bg-gray-900 hover:bg-black text-white px-6 py-2 text-base font-medium rounded-full shadow-md transition-transform transform hover:scale-105"
        >
          View Conversations
        </button>
      </div>
      {showPostForm && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white p-6 w-full max-w-md rounded-lg shadow-lg text-left">
            <h2 className="text-xl font-bold mb-4">Post Your Conversation</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* <div className="space-y-1">
                <label className="block text-sm font-medium">Title</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Enter a clear, descriptive title"
                  className="w-full px-4 py-2 border border-gray-300 rounded-full text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
                <p className="text-xs text-gray-500 italic">
                  (We auto-detect service types, so just write a good title to help filtering and search.)
                </p>
              </div> */}
              <div className="space-y-1">
                <label className="block text-sm font-medium">Link</label>
                <input
                  type="url"
                  required
                  placeholder="Supported URLs: ChatGPT/Grok ONLY"
                  value={formData.link}
                  onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-full text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
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
    </div>
  );
}
