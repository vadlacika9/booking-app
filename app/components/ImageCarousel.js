'use client';

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";

const ITEMS_VISIBLE = 4;
const ITEM_WIDTH = 220;

export default function Carousel({ services }) {
  const totalItems = services.length;
  const clonedServices = [...services.slice(-ITEMS_VISIBLE), ...services, ...services.slice(0, ITEMS_VISIBLE)];
  const [currentIndex, setCurrentIndex] = useState(ITEMS_VISIBLE);
  const transitionRef = useRef(true);

  useEffect(() => {
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
  }, [currentIndex, totalItems]);

  const handleNext = () => {
    setCurrentIndex((prev) => prev + 1);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => prev - 1);
  };

  return (
    <div className="relative text-center py-5">
      {/* Bal oldali gomb */}
      <button
        onClick={handlePrev}
        className="absolute left-20 top-32 transform -translate-y-1/2 bg-white border border-black w-10 h-10 rounded-full cursor-pointer z-50 flex items-center justify-center"
      >
        ⬅
      </button>

      {/* Képek konténer */}
      <div className="overflow-hidden mx-auto" style={{ width: `${ITEMS_VISIBLE * ITEM_WIDTH + 330 + ITEM_WIDTH / 2}px` }}>
        <div
          className={`flex gap-5 w-max ${transitionRef.current ? 'transition-transform duration-500 ease-in-out' : ''}`}
          style={{ transform: `translateX(-${currentIndex * 320}px)` }}
        >
          {clonedServices.map((service, index) => (
            <Link key={`${service.service_id}-${index}`} href={`/services/${service.service_id}`} className="flex flex-col items-center">
              <Image
                src={service.images[0]}
                alt={`Image ${index}`}
                width={300}
                height={200}
                className="rounded-lg w-[300px] h-[200px]"
              />
              <div className="flex flex-col items-start w-full px-3 py-2 mt-2 rounded-md">
                <div className="text-black font-semibold">{service.name}</div>
                <div className="text-gray-700"> {service.location.address}, {service.location.city} </div>
              </div>

            </Link>
          ))}
        </div>
      </div>

      {/* Jobb oldali gomb */}
      <button
        onClick={handleNext}
        className="absolute right-20 top-32 transform -translate-y-1/2 bg-white border border-black w-10 h-10 rounded-full cursor-pointer z-50 flex items-center justify-center"
      >
        ➡
      </button>
    </div>
  );
}
