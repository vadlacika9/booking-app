'use client'

import { useState } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { getInitial } from '@/utils/getInitials';
import Image from 'next/image';
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
             <div className={`relative w-9 h-9 rounded-full overflow-hidden ${session.user.profile_pic ? 'bg-white' : 'bg-indigo-500'} text-white font-bold text-xl flex items-center justify-center`}>
               {session.user.profile_pic ? (
                 <Image
                   src={session.user.profile_pic}
                   alt="Profilkép"
                   fill
                   className="object-cover"
                 />
               ) : (
                 getInitial(session.user.last_name)
               )}
             </div>
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
  <div className="absolute top-0 left-0 w-full bg-black md:hidden shadow-lg p-4 flex flex-col">
    {/* Close button */}
    <button 
      className="absolute top-4 right-4 text-white text-xl"
      onClick={() => setIsOpen(false)}
    >
      ✕
    </button>

    {/* Menu items */}
    
    <Link href="/account" className="block text-white py-3 px-6 mr-10 hover:bg-gray-800">
      Profile
    </Link>
    <Link href="/add-service" className="block text-white py-3 px-6 mr-10 hover:bg-gray-800">
      Add your Service
    </Link>
  </div>
)}
    </nav>
  );
}