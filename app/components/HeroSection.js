'use client';

import Navbar from '@/components/Navbar';
import Link from 'next/link';

export default function Hero() {
  return (
    <section className="relative h-[34rem] flex flex-col text-center text-white">
      {/* Háttérvideó */}
      <video 
        autoPlay 
        loop 
        muted 
        playsInline
        className="absolute top-0 left-0 w-full h-full object-cover"
      >
        <source src="images/3181509-uhd_3840_2160_25fps.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* Sötét overlay a jobb olvashatóságért */}
      <div className="absolute top-0 left-0 w-full h-full bg-black/50"></div>

      {/* Navbar */}
      <div className="relative z-10 w-full">
        <Navbar />
      </div>

      {/* Tartalom */}
      <div className="relative z-10 flex-grow flex flex-col items-center justify-center">
        <h1 className="text-4xl font-bold mb-4">Glow up with just a click</h1>
        <p className="text-lg mb-6">find top professionals and book instantly.</p>
        <Link href="/services" className="mt-6 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
              Get Started
        </Link> 
      </div>
    </section>
  );
}
