import Navbar from '@/components/Navbar';
import Link from 'next/link';

export default function Hero() {
  return (
    <section className="relative h-[34rem] flex flex-col text-center text-white">
      {/* background video */}
      <video 
        autoPlay 
        loop 
        muted 
        playsInline
        className="absolute top-0 left-0 w-full h-full object-cover"
      >
        <source src="/images/3181509-uhd_3840_2160_25fps.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* dark overlay */}
      <div className="absolute top-0 left-0 w-full h-full bg-black/50"></div>

      {/* Navbar */}
      <div className="relative w-full">
        <Navbar />
      </div>

      {/* Content */}
      <div className="relative z-10 flex-grow flex flex-col items-center justify-center">
      <h1 className="text-4xl font-bold mb-4">Glow up with just a click</h1>
        <p className="text-lg mb-6">find top professionals and book instantly.</p>
        <div className="flex gap-4 mt-6">
  <Link href="/services" className="px-6 py-3 bg-[#6366F1] text-white rounded-lg hover:bg-indigo-700 transition">
    Get Started
  </Link>
  <Link href="/about" className="px-6 py-3 bg-[#F59E0B] text-white rounded-lg hover:bg-yellow-600 transition">
    Learn More
  </Link>
</div>
      </div>
    </section>
  );
}
