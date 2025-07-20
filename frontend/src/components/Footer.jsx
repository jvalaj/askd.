import React from 'react'

export default function Footer() {
  return (
    <footer className="border-t px-6 py-4 text-center text-gray-500 text-sm">
      &copy; {new Date().getFullYear()} Askd. All rights reserved.
    </footer>
  )
}
