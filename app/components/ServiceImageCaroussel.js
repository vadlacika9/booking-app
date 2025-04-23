'use client';
import { useState } from 'react';
import Image from 'next/image';

export default function ServiceImageCaroussel({ images }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Ha nincsenek képek vagy csak egy kép van
  if (!images || images.length === 0) {
    return (
      <div className="w-full h-[400px] lg:h-[500px] relative rounded-lg overflow-hidden">
        <Image
          src={"https://ceouekx9cbptssme.public.blob.vercel-storage.com/default-NIiwIB7QvsHFa1RVneC6dHZdSQIrAs.png"}
          fill={true}
          alt="Service image"
          className="object-cover"
          priority
        />
      </div>
    );
  }

  if (images.length === 1) {
    return (
      <div className="w-full h-[400px] lg:h-[500px] relative rounded-lg overflow-hidden">
        <Image
          src={images[0].path}
          fill={true}
          alt="Service image"
          className="object-cover"
          priority
        />
      </div>
    );
  }

  const goToPrevious = () => {
    const isFirstSlide = currentIndex === 0;
    const newIndex = isFirstSlide ? images.length - 1 : currentIndex - 1;
    setCurrentIndex(newIndex);
  };

  const goToNext = () => {
    const isLastSlide = currentIndex === images.length - 1;
    const newIndex = isLastSlide ? 0 : currentIndex + 1;
    setCurrentIndex(newIndex);
  };

  const goToSlide = (slideIndex) => {
    setCurrentIndex(slideIndex);
  };

  return (
    <div className="w-full h-[400px] lg:h-[500px] relative group">
      <div className="relative w-full h-full rounded-lg overflow-hidden">
        <Image
          src={images[currentIndex].path}
          fill={true}
          alt={`Service image ${currentIndex + 1}`}
          className="object-cover"
          priority={currentIndex === 0}
        />
      </div>

      {/* Bal/Jobb nyilak */}
      <div 
        className="absolute top-1/2 left-4 -translate-y-1/2 bg-white/70 hover:bg-white rounded-full p-2 cursor-pointer z-10 shadow-md transition-all"
        onClick={goToPrevious}
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
        </svg>
      </div>
      
      <div 
        className="absolute top-1/2 right-4 -translate-y-1/2 bg-white/70 hover:bg-white rounded-full p-2 cursor-pointer z-10 shadow-md transition-all"
        onClick={goToNext}
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
        </svg>
      </div>

      {/* Indikátor pontok */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
        {images.map((_, slideIndex) => (
          <div
            key={slideIndex}
            onClick={() => goToSlide(slideIndex)}
            className={`w-3 h-3 rounded-full cursor-pointer transition-all ${
              currentIndex === slideIndex ? 'bg-indigo-600' : 'bg-white/70 hover:bg-white'
            }`}
          />
        ))}
      </div>
    </div>
  );
}