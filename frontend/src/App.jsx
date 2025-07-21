import React, { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Header from './components/Header'
import Footer from './components/Footer'
import Home from './pages/Home'
import ChatDetail from './pages/ChatDetail'
import AllChats from './pages/AllChats'
import MyChats from './pages/MyChats'
import ProtectedRoute from './components/ProtectedRoute'
import NotFound from './pages/NotFound'
import { SignedIn, SignedOut, SignInButton, UserButton, useAuth, useClerk } from '@clerk/clerk-react';

export default function App() {
  const [showPostForm, setShowPostForm] = useState(false);
  const { isSignedIn } = useAuth();
  const { openSignIn } = useClerk();

  const handlePostClick = () => {
    if (isSignedIn) {
      setShowPostForm(true);
    } else {
      openSignIn();
    }
  };

  return (
    <Router>
      <div className="flex flex-col bg-white min-h-screen">
        <Header onPostClick={handlePostClick}>
          <SignedOut>
            <SignInButton className="bg-black text-white px-4 py-2 text-sm font-medium rounded-full hover:bg-gray-800 transition-colors">
              Sign in
            </SignInButton>
          </SignedOut>
          <SignedIn>
            <UserButton />
          </SignedIn>
        </Header>
   
          <Routes>
            <Route path="/" element={<Home showPostForm={showPostForm} setShowPostForm={setShowPostForm} />} />
            <Route path="/allchats" element={<ProtectedRoute><AllChats /></ProtectedRoute>} />
            <Route path="/my-chats" element={<ProtectedRoute><MyChats /></ProtectedRoute>} />
            <Route path="/chat/:slug" element={<ProtectedRoute><ChatDetail /></ProtectedRoute>} />
            <Route path="*" element={<NotFound />} />
          </Routes>

        <Footer />
      </div>
    </Router>
  )
}
