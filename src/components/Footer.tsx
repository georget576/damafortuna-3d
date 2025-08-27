"use client"

export default function Footer() {
  return (
    <footer className="bg-gradient-to-b from-purple-900/30 to-indigo-900/30 border-t border-purple-300/20 py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <p className="text-purple-800 text-sm font-just-another-hand mb-2 tracking-widest">
          © {new Date().getFullYear()} DamaFortuna. All rights reserved.
        </p>
        <p className="text-purple-700 text-sm font-shadows-into-light">
          Tarot readings are for entertainment purposes only.
        </p>
      </div>
    </footer>
  )
}