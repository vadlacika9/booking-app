'use client'

import Image from "next/image";
import Navbar from "./Navbar";
import { signOut } from "next-auth/react";

export default function HeroSection() {
  return (
    <section
  className="bg-cover bg-center h-96 flex flex-col text-center text-white bg-gradient-to-r from-indigo-700 to-fuchsia-800"
 // style={{ backgroundImage: 'url(/images/kep2.jpg)' }}
>
<div className="w-full">
    <Navbar /> {/* Navbar kitölti a teljes szélességet */}
  </div>
  
  <div className="flex-grow flex flex-col items-center justify-center"> {/* Középre igazítás */}
    <h1 className="text-4xl font-bold mb-4">Be brave</h1>
    <p className="text-lg mb-6">Discover and book beauty & wellness professionals near you</p>
    <input
      type="text"
      placeholder="Search services or businesses"
      className="w-2/3 max-w-md p-2 rounded-md text-gray-700"
    />
  </div>
</section>
  
  );
}