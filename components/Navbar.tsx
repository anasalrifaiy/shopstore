'use client';

import Link from 'next/link';
import { useCartStore } from '@/lib/store/cart-store';
import { ShoppingCartIcon, MagnifyingGlassIcon, UserIcon } from '@heroicons/react/24/outline';

export default function Navbar() {
  const itemCount = useCartStore((state) => state.getItemCount());

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0">
            <h1 className="text-2xl font-bold text-blue-600">ShopStore</h1>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-gray-700 hover:text-blue-600 transition">
              Home
            </Link>
            <Link href="/products" className="text-gray-700 hover:text-blue-600 transition">
              Products
            </Link>
            <Link href="/products?featured=true" className="text-gray-700 hover:text-blue-600 transition">
              Featured
            </Link>
            <Link href="/admin" className="text-gray-700 hover:text-blue-600 transition">
              Admin
            </Link>
          </div>

          {/* Right side icons */}
          <div className="flex items-center space-x-4">
            <button className="p-2 text-gray-700 hover:text-blue-600 transition">
              <MagnifyingGlassIcon className="h-6 w-6" />
            </button>
            <Link href="/account" className="p-2 text-gray-700 hover:text-blue-600 transition">
              <UserIcon className="h-6 w-6" />
            </Link>
            <Link href="/cart" className="p-2 text-gray-700 hover:text-blue-600 transition relative">
              <ShoppingCartIcon className="h-6 w-6" />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </Link>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className="md:hidden border-t border-gray-200">
        <div className="px-2 pt-2 pb-3 space-y-1">
          <Link
            href="/"
            className="block px-3 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-md"
          >
            Home
          </Link>
          <Link
            href="/products"
            className="block px-3 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-md"
          >
            Products
          </Link>
          <Link
            href="/products?featured=true"
            className="block px-3 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-md"
          >
            Featured
          </Link>
          <Link
            href="/admin"
            className="block px-3 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-md"
          >
            Admin
          </Link>
        </div>
      </div>
    </nav>
  );
}
