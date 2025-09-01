// src/app/not-found.tsx
import { SearchX } from 'lucide-react';
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-center px-6">
      <SearchX className='h-16 w-16 text-purple-600' /><h1 className="text-4xl font-bold text-gray-800 mb-4 font-caveat-brush">Oopsies</h1>
      <p className="text-lg text-gray-600 mb-6 font-shadows-into-light">
        Sorry, we couldn’t find that page.
      </p>
      <Link href="/home" className="inline-block bg-purple-600 text-white px-5 py-2 rounded hover:bg-purple-700 transition font-caveat-brush">
          Go Home
      </Link>
    </div>
  );
}