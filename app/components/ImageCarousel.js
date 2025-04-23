'use client';

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";

const ITEMS_VISIBLE = 4;

export default function Carousel({ services }) {
  const [transitionEnabled, setTransitionEnabled] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isHovering, setIsHovering] = useState(null);
  const totalItems = services.length;
  const isSingleItem = totalItems <= 4;
  const clonedServices = isSingleItem
    ? services
    : [...services.slice(-ITEMS_VISIBLE), ...services, ...services.slice(0, ITEMS_VISIBLE)];
    const [currentIndex, setCurrentIndex] = useState(isSingleItem ? 0 : ITEMS_VISIBLE);

  // Sort services by rating
  services.sort((a, b) => b.service_avg_rating - a.service_avg_rating);

  
  useEffect(() => {
    if (!isSingleItem) {
      if (currentIndex === 0) {
        setTimeout(() => {
          setTransitionEnabled(false);
          setCurrentIndex(totalItems);
        }, 500);
      } else if (currentIndex === totalItems + ITEMS_VISIBLE) {
        setTimeout(() => {
          setTransitionEnabled(false);
          setCurrentIndex(ITEMS_VISIBLE);
        }, 500);
      } else {
        setTransitionEnabled(true);
        setActiveIndex((currentIndex - ITEMS_VISIBLE) % totalItems);
      }
    }
  }, [currentIndex, totalItems, isSingleItem]);
  
  const handleNext = () => {
    if (!isSingleItem) setCurrentIndex((prev) => prev + 1);
  };
  
  const handlePrev = () => {
    if (!isSingleItem) setCurrentIndex((prev) => prev - 1);
  };

  const goToSlide = (index) => {
    setCurrentIndex(index + ITEMS_VISIBLE);
  };
  
  return (
    <div className="relative text-center z-0 my-8">
      {/* Left button */}
      {!isSingleItem && (
        <button
          onClick={handlePrev}
          className="absolute -left-5 top-28 transform -translate-y-1/2 bg-white shadow-md border border-gray-200 w-10 h-10 rounded-full cursor-pointer z-50 flex items-center justify-center hover:bg-gray-50 transition-all duration-200"
          aria-label="Previous slide"
        >
          <Image src="/images/left.png" width={32} height={32} alt="Previous" />
        </button>
      )}
      
      {/* Image container */}
      <div className="w-full overflow-hidden px-2">
        <div
          className={`flex gap-5 w-max ${transitionEnabled ? 'transition-transform duration-500 ease-in-out' : ''}`}
          style={{ transform: `translateX(-${isSingleItem ? 0 : currentIndex * 280}px)` }}
        >
          {clonedServices.map((service, index) => (
            <Link 
              key={`${service.service_id}-${index}`} 
              href={`/services/${service.service_id}`}
              className="flex flex-col items-center group"
              onMouseEnter={() => setIsHovering(index)}
              onMouseLeave={() => setIsHovering(null)}
            >
              <div className="relative overflow-hidden rounded-lg shadow-md transition-all duration-300 hover:shadow-lg">
                <div className="w-[260px] h-[180px] relative">
                  <Image
                    src={service.images[0]}
                    alt={service.service_name}
                    fill
                    objectFit="cover"
                    className={`rounded-lg transition-transform duration-500 ${isHovering === index ? 'scale-110' : 'scale-100'}`}
                  />
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
                <div className="flex flex-col absolute rounded-bl-lg rounded-tr-lg top-0 right-0 p-2 bg-black/80 text-white font-medium text-sm">
                  <div className="flex items-center gap-1">
                    {Number(service.service_avg_rating).toFixed(1)} 
                    <span className="text-yellow-400">★</span>
                  </div>
                </div>
              </div>
              <div className="flex flex-col items-start w-full px-3 py-3 mt-2 rounded-md transition-all duration-300">
                <div className="text-black font-semibold text-left mb-1">{service.service_name}</div>
                <div className="text-gray-600 text-sm text-left flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                  </svg>
                  {service.service_location}, {service.service_address}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
      
      {/* Right button */}
      {!isSingleItem && (
        <button
          onClick={handleNext}
          className="absolute -right-5 top-28 transform -translate-y-1/2 bg-white shadow-md border border-gray-200 w-10 h-10 rounded-full cursor-pointer z-50 flex items-center justify-center hover:bg-gray-50 transition-all duration-200"
          aria-label="Next slide"
        >
          <Image src="/images/right.png" width={32} height={32} alt="Next" />
        </button>
      )}
      
      {/* Pagination indicators */}
      {!isSingleItem && (
        <div className="flex justify-center gap-2 mt-6">
          {Array.from({ length: totalItems }).map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                activeIndex === index ? 'bg-black w-4' : 'bg-gray-300'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}