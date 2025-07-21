import React from 'react'

export default function Footer() {
  return (
    <footer className="border-t px-6 py-4 text-center bg-white text-gray-500 text-sm">
      &copy; {new Date().getFullYear()} Askd. give feedback <a className="text-blue-500 hover:underline" href="https://x.com/messages/compose?recipient_username=jvalaj13" target="_blank" rel="noopener noreferrer">here</a>
    </footer>
  )
}
