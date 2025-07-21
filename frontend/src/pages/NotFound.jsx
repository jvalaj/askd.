import React from 'react';
import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="flex-grow flex flex-col justify-center items-center text-center py-16 px-6 bg-white text-gray-900">
      <h1 className="text-5xl md:text-6xl font-extrabold mb-4">404</h1>
      <h2 className="text-2xl md:text-3xl font-medium text-gray-700 mb-8">
        Page Not Found
      </h2>
      <p className="text-gray-600 mb-8">
        Sorry, the page you are looking for does not exist.
      </p>
      <Link
        to="/"
        className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg font-medium rounded-lg shadow-md transition-transform transform hover:scale-105"
      >
        Go to Home
      </Link>
    </div>
  );
}
