import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@clerk/clerk-react';
import ChatCard from '../components/ChatCard';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export default function MyChats() {
  const { getToken } = useAuth();
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMyChats();
  }, []);

  const fetchMyChats = async () => {
    try {
      const token = await getToken();
      const res = await fetch(`${API_URL}/api/chats/my-chats`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const data = await res.json();
      setChats(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Delete a chat by slug
  const deleteChat = async (slug) => {
    if (!window.confirm('Are you sure you want to delete this chat?')) return;
    try {
      const token = await getToken();
      const res = await fetch(`${API_URL}/api/chats/${slug}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) throw new Error('Failed to delete');
      // Remove from state
      setChats((prev) => prev.filter((c) => c.slug !== slug));
    } catch (err) {
      console.error(err);
      alert('Error deleting chat');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen w-full bg-white text-gray-900 flex flex-col items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500 text-lg">Loading your chats...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-grow w-full bg-white text-gray-900 flex flex-col items-center">
      {/* Page Title */}
      <div className="px-6 py-8 mt-10 border-b w-full bg-gray-50 text-center">
        <h2 className="text-3xl font-bold tracking-tight mb-2">My Chats</h2>
        <p className="text-base text-gray-600">Your shared AI conversations</p>
      </div>

      {/* Chat grid */}
      <div className="px-6 py-8 min-h-[50vh] w-full max-w-3xl">
        {chats.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">You haven't posted any chats yet.</p>
            <Link
              to="/"
              className="inline-block mt-4 bg-blue-300 hover:bg-blue-400 text-white px-6 py-2 rounded-full transition-colors"
            >
              Post your first chat
            </Link>
          </div>
        ) : (
          <div className="flex flex-col gap-6 w-full">
            {chats.map((chat) => (
              <ChatCard key={chat._id} chat={chat} onDelete={deleteChat} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
