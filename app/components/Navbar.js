'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { data: session, status } = useSession();
  const [isSticky, setIsSticky] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsSticky(window.scrollY > 400);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`py-4 z-20 transition-all duration-300 ${
        isSticky ? "fixed top-0 w-full bg-black shadow-lg" : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between h-16 px-4 md:px-8">
        {/* Logo */}
        <div className="text-white text-xl font-bold">
          <Link href="/">MyLogo</Link>
        </div>

        {/* Menu Items (desktop) */}
        <div className="hidden md:flex space-x-6">
          {status === 'authenticated' && (
            <Link href="/account" className="text-white hover:text-gray-300 flex items-center space-x-2">
              <img src="/icons/userIcon.svg" alt="User Icon" width="25" height="25" />
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
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden text-white focus:outline-none"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
          </svg>
        </button>
      </div>

      {/* Mobile Menu (dropdown) */}
      <div
        className={`md:hidden bg-black transition-all overflow-hidden ${
          isOpen ? "max-h-96" : "max-h-0"
        }`}
      >
        <Link href="/" className="block text-white py-3 px-6 hover:bg-gray-800">
          Home
        </Link>
        <Link href="/about" className="block text-white py-3 px-6 hover:bg-gray-800">
          About
        </Link>
        <Link href="/services" className="block text-white py-3 px-6 hover:bg-gray-800">
          Services
        </Link>
        <Link href="/contact" className="block text-white py-3 px-6 hover:bg-gray-800">
          Contact
        </Link>
      </div>
    </nav>
  );
}
