import React from 'react';
import { Link } from 'react-router-dom';

export default function ChatCard({ chat, onDelete }) {
  // map service types to badge color classes
  const serviceColors = {
    chatgpt: 'bg-green-100 text-green-800',
    grok: 'bg-blue-100 text-blue-800',
    claude: 'bg-purple-100 text-purple-800',
    gemini: 'bg-yellow-100 text-yellow-800',
  };
  const badgeClasses = serviceColors[chat.service] || 'bg-gray-100 text-gray-800';
  return (
    <div className="w-full relative border border-gray-200 p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow">
      <Link to={`/chat/${chat.slug}`}>  
        <div className="mb-2 flex items-center justify-between">
          <span className={`inline-block px-2 py-0.5 text-xs font-medium rounded-full ${badgeClasses}`}>{chat.service}</span>
          <span className="text-xs text-gray-500">By {chat.username || 'Unknown'}</span>
        </div>
        <div className="mb-3">
          <h3 className="font-medium text-gray-800 text-sm leading-snug truncate">
            {chat.content?.[0]?.message.slice(0, 80) +
              (chat.content?.[0]?.message.length > 80 ? '...' : '') ||
              'View Chat'}
          </h3>
        </div>
        <div className="flex justify-between items-center text-xs text-gray-500">
        
          <span>{new Date(chat.createdAt).toLocaleDateString()}</span>
        </div>
      </Link>
      {onDelete && (
        <button
          onClick={() => onDelete(chat.slug)}
          className="mt-4 w-full bg-red-100 text-red-700 text-sm rounded-full py-1 hover:bg-red-200 transition-colors"
        >
          Delete
        </button>
      )}
    </div>
  );
}
