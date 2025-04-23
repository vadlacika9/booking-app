'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { getInitial } from '@/utils/getInitials';
import Image from 'next/image';
import Loading from './Loading';

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
  
  if (status === 'loading') return <Loading/>;

  return (
    <nav
      className={`w-full transition-all duration-500 z-50 bg-transparent ${
        isSticky 
          ? "fixed top-0 bg-gradient-to-r from-black to-gray-900 shadow-xl" 
          : "absolute bg-black bg-opacity-60"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" className="block h-14 w-auto">
              <Image 
                src="/images/white_on_trans.png" 
                width={120} 
                height={120} 
                alt="logo"
                className="h-14 w-auto filter drop-shadow-md hover:brightness-125 transition-all duration-300"
              />
            </Link>
          </div>
          
          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            {status === 'authenticated' ? (
              <Link 
                href="/account" 
                className="group flex items-center relative"
              >
                <div className={`
                  relative z-10 w-12 h-12 rounded-full overflow-hidden 
                  ${session.user.profile_pic ? 'bg-white' : 'bg-gradient-to-r from-indigo-500 to-purple-600'} 
                  shadow-lg text-white font-bold text-xl flex items-center justify-center
                  ring-2 ring-white ring-opacity-40 hover:ring-opacity-100 transition-all
                `}>
                  {session.user.profile_pic ? (
                    <Image
                      src={session.user.profile_pic}
                      alt="Profile"
                      fill
                      className="object-cover"
                    />
                  ) : (
                    getInitial(session.user.last_name)
                  )}
                </div>
                <div className="ml-3 group-hover:translate-x-1 transition-transform">
                  <p className="text-white font-medium">Profile</p>
                  <p className="text-gray-300 text-xs">My Account</p>
                </div>
              </Link>
            ) : (
              <Link 
                href="/api/auth/signin" 
                className="relative overflow-hidden group px-5 py-2.5 rounded-lg bg-gradient-to-br from-gray-800 to-black text-white border border-gray-700 font-medium"
              >
                <span className="relative z-10 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                  </svg>
                  Login
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </Link>
            )}
            
            <Link
              href="/add-service"
              className="relative group px-6 py-3 font-bold rounded-xl bg-white text-black shadow-lg overflow-hidden"
            >
              <span className="relative z-10 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Add your Service
              </span>
              <div className="absolute bottom-0 left-0 h-1 w-full bg-gradient-to-r from-indigo-500 to-purple-600 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300"></div>
            </Link>
          </div>
          
          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-white hover:text-white focus:outline-none"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              {!isOpen ? (
                <svg className="block h-7 w-7" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              ) : (
                <svg className="block h-7 w-7" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu, show/hide based on menu state */}
      {isOpen && (
        <div className="md:hidden fixed inset-0 bg-gradient-to-b from-black to-gray-900 z-50 flex flex-col">
          <div className="px-6 pt-6 pb-4 flex items-center justify-between border-b border-gray-700">
            <div className="flex-shrink-0">
              <Link href="/" onClick={() => setIsOpen(false)}>
                <Image 
                  src="/images/white_on_trans.png" 
                  width={120} 
                  height={120} 
                  alt="logo"
                  className="h-14 w-auto"
                />
              </Link>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="rounded-full p-2 bg-gray-800 text-white hover:bg-gray-700 focus:outline-none"
            >
              <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div className="px-4 pt-8 pb-6 space-y-8 overflow-y-auto">
            {status === 'authenticated' ? (
              <Link 
                href="/account" 
                className="flex items-center p-4 bg-gray-800 bg-opacity-50 rounded-2xl hover:bg-opacity-70 transition-all"
                onClick={() => setIsOpen(false)}
              >
                <div className={`
                  relative flex-shrink-0 w-16 h-16 rounded-full overflow-hidden 
                  ${session.user.profile_pic ? 'bg-white' : 'bg-gradient-to-r from-indigo-500 to-purple-600'} 
                  shadow-lg text-white text-2xl font-bold flex items-center justify-center
                `}>
                  {session.user.profile_pic ? (
                    <Image
                      src={session.user.profile_pic}
                      alt="Profile picture"
                      fill
                      className="object-cover"
                    />
                  ) : (
                    getInitial(session.user.last_name)
                  )}
                </div>
                <div className="ml-4">
                  <h3 className="text-xl font-bold text-white">Your Profile</h3>
                  <p className="text-gray-400">View account details</p>
                </div>
                <div className="ml-auto">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </Link>
            ) : (
              <Link 
                href="/api/auth/signin" 
                className="flex items-center justify-between p-4 bg-gray-800 bg-opacity-50 rounded-2xl hover:bg-opacity-70 transition-all"
                onClick={() => setIsOpen(false)}
              >
                <div className="flex items-center">
                  <div className="p-3 rounded-full bg-indigo-600 mr-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">Login</h3>
                    <p className="text-gray-400">Sign in to your account</p>
                  </div>
                </div>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            )}
            
            <Link 
              href="/add-service" 
              className="flex items-center justify-center py-4 px-6 bg-white rounded-xl text-black font-bold text-lg shadow-lg hover:shadow-xl transition-all"
              onClick={() => setIsOpen(false)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Add your Service
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}