'use client'

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';

export default function OtherNavbar() {
  const [isOpen, setIsOpen] = useState(false);
  const {data: session, status} = useSession();
  
  
  return (
    
    <nav className="bg-black py-4 z-20 transition-all duration-300">
      <div className=" max-w-7xl mx-auto flex items-center justify-between  px-4 md:px-8 h-16">
        {/* Logo */}
        <div className="text-white text-xl font-bold">
          <Link href="/">MyLogo</Link>
        </div>

        {/* Menu Items (hidden on small screens) */}
        <div className="hidden md:flex space-x-6 ">
       
        {status === 'authenticated' && (
            <Link href="/account" className="text-white hover:text-gray-300 flex items-center space-x-2">
              <img src="/icons/User.svg" alt="User Icon" width="25" height="25" />
              <span>Profile</span>
            </Link>
          )}
          {status === 'unauthenticated' && (
            <Link href="/api/auth/signin" className="text-white hover:text-gray-300 p-2">
              Login
            </Link>
          )}
          <Link
            href="/add-service"
            className="bg-white text-black px-4 py-2 rounded-lg hover:bg-gray-300 transition"
          >
            Add your Service
          </Link>
          
          
          
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="text-white focus:outline-none"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu (dropdown) */}
      {isOpen && (
        <div className="md:hidden bg-blue-500">
          <Link href="/" className="block text-white py-2 px-4 hover:bg-blue-600">Home</Link>
          <Link href="/about" className="block text-white py-2 px-4 hover:bg-blue-600">About</Link>
          <Link href="/services" className="block text-white py-2 px-4 hover:bg-blue-600">Services</Link>
          <Link href="/contact" className="block text-white py-2 px-4 hover:bg-blue-600">Contact</Link>
        </div>
      )}
    </nav>
  );
}