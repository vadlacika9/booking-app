'use client';

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";

const ITEMS_VISIBLE = 4;


export default function Carousel({ services }) {
  const totalItems = services.length;
 
  services.sort((a, b) =>  b.service_avg_rating - a.service_avg_rating);
 

  const isSingleItem = totalItems <= 4;
  const clonedServices = isSingleItem 
  ? services 
  : [...services.slice(-ITEMS_VISIBLE), ...services, ...services.slice(0, ITEMS_VISIBLE)];

  
  const [currentIndex, setCurrentIndex] = useState(isSingleItem ? 0 : ITEMS_VISIBLE);
  const transitionRef = useRef(true);

  
  useEffect(() => {
    if (!isSingleItem) {
      if (currentIndex === 0) {
        setTimeout(() => {
          transitionRef.current = false;
          setCurrentIndex(totalItems);
        }, 500);
      } else if (currentIndex === totalItems + ITEMS_VISIBLE) {
        setTimeout(() => {
          transitionRef.current = false;
          setCurrentIndex(ITEMS_VISIBLE);
        }, 500);
      } else {
        transitionRef.current = true;
      }
    }
  }, [currentIndex, totalItems, isSingleItem]);

  const handleNext = () => {
    if (!isSingleItem) setCurrentIndex((prev) => prev + 1);
  };

  const handlePrev = () => {
    if (!isSingleItem) setCurrentIndex((prev) => prev - 1);
  };

  return (
    <div className="relative text-center z-0">
      {/* Left button */}
      {!isSingleItem && (
        <button
          onClick={handlePrev}
          className="absolute -left-6 top-28 transform -translate-y-1/2 bg-white border border-black w-10 h-10 rounded-full cursor-pointer z-50 flex items-center justify-center"
        >
          <Image src="/images/left.png" width={40} height={40} alt="left"/>
        </button>
      )}

      {/* Image container */}
      <div className="w-full overflow-hidden">
        <div
          className={`flex gap-5 w-max ${transitionRef.current ? 'transition-transform duration-500 ease-in-out' : ''}`}
          style={{ transform: `translateX(-${isSingleItem ? 0 : currentIndex * 320}px)` }}
        >
          {clonedServices.map((service, index) => (
            <Link key={`${service.service_id}-${index}`} href={`/services/${service.service_id}`} className="flex flex-col items-center">
            <div className="relative">
              <Image
                src={service.images[0]}
                alt={`Image ${index}`}
                width={300}
                height={200}
                className="rounded-lg w-[300px] h-[200px] relative"
              />
              <div className="flex flex-col absolute top-0 right-0 w-16 bg-black opacity-90 text-white text-sm p-2">
                <div>{Number(service.service_avg_rating)} ★</div>
                <div className="text-sm">rated</div>
              </div>
            </div>
            <div className="flex flex-col items-start w-full px-3 py-2 mt-2 rounded-md">
              <div className="text-black font-semibold">{service.service_name}</div>
              <div className="text-gray-700"> {service.service_location}, {service.service_address} </div>
            </div>
          </Link>
          ))}
        </div>
      </div>

      {/* Right button */}
      {!isSingleItem && (
        <button
          onClick={handleNext}
          className="absolute -right-6 top-28 transform -translate-y-1/2 bg-white border border-black w-10 h-10 rounded-full cursor-pointer z-50 flex items-center justify-center"
        >
          <Image src="/images/right.png" width={40} height={40} alt="right"/>
        </button>
      )}
    </div>
  );
}