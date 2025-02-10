'use client'

import { useState } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';

export default function OtherNavbar() {
  const [isOpen, setIsOpen] = useState(false);
  const {data: session, status} = useSession();
  
  return (
    
    <nav className="bg-black p-4">
      <div className="container mx-auto flex items-center justify-between h-12">
        {/* Logo */}
        <div className="text-white text-xl font-bold pl-28">
          <Link href="/">MyLogo</Link>
        </div>

        {/* Menu Items (hidden on small screens) */}
        <div className="hidden md:flex space-x-6 p-5">
        {status === 'unauthenticated' && <Link href='/api/auth/signin' className='text-white hover:text-gray-300'>Login</Link>}
          <Link 
            href="/add-service" 
            className={`text-white hover:text-gray-300 ${status === 'unauthenticated' ? 'pr-28' : ''}`}
          >
            Add your Service
          </Link>
          
          {status === 'authenticated' && <Link href='/my_services' className='text-white hover:text-gray-300'>My Services</Link>}
          {status === 'authenticated' && <Link href='/api/auth/signout' className='text-white hover:text-gray-300 pr-28'>Sign out</Link>}
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