import Link from 'next/link';
import { ShoppingCart, User } from 'lucide-react';

export default function Header() {
  return (
    <header className="bg-white shadow-sm">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <Link href="/" className="text-2xl font-bold text-blue-600">
            AI-Shop
          </Link>
          <nav className="hidden md:flex gap-8 items-center">
            <Link href="/search" className="text-gray-600 hover:text-blue-600">
              Discover
            </Link>
            <Link href="/closet" className="text-gray-600 hover:text-blue-600">
              Closet
            </Link>
            <Link href="/profile" className="text-gray-600 hover:text-blue-600">
             <User/>
            </Link>
            <Link href="#" className="text-gray-600 hover:text-blue-600">
                <ShoppingCart/>
            </Link>
          </nav>
          <div className="md:hidden">
            {/* Mobile menu button placeholder */}
            <button className="text-gray-600 hover:text-blue-600">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
