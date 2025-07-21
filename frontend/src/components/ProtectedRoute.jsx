import React from 'react';
import { useAuth } from '@clerk/clerk-react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const { isSignedIn, isLoaded } = useAuth();

  if (!isLoaded) {
    // You can return a loading spinner here while Clerk is checking auth status
    return <div>Loading...</div>;
  }

  if (!isSignedIn) {
    // If not signed in, redirect to the home page
    return <Navigate to="/" replace />;
  }

  // If signed in, render the component
  return children;
};

export default ProtectedRoute;
