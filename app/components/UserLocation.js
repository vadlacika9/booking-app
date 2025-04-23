"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

const UserLocation = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [ready, setReady] = useState(false); // csak akkor renderelünk, ha ez true

  useEffect(() => {
    const savedLocation = sessionStorage.getItem("userLocation");
    if (!savedLocation) {
      setIsVisible(true);
    }
    setReady(true);
  }, []);

  const saveUserLocation = () => {
    if (!("geolocation" in navigator)) {
      console.error("Geolocation not available");
      return;
    }

    setIsLoading(true);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude: lat, longitude: lng } = position.coords;
        sessionStorage.setItem("userLocation", JSON.stringify({ lat, lng }));
        setIsVisible(false);
        window.location.reload();
      },
      (error) => {
        console.error("Geolocation error:", error);
        setIsLoading(false);
      }
    );
  };

  if (!ready || !isVisible) return null;

  return (
    <div className="flex justify-center items-center px-4 py-6">
      <div
        className="w-full p-8 rounded-2xl border border-gray-200 shadow-lg flex flex-col md:flex-row justify-between items-center gap-8 mb-24 bg-white/95 backdrop-blur-sm"
      >
        <div className="flex-1 space-y-6">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-3">
              Discover the nearest available services
            </h2>
            <p className="text-gray-600 text-lg leading-relaxed">
              Enable location services to find the best options near you and improve your experience.
            </p>
          </div>
          <div className="flex flex-wrap gap-4 pt-2">
            <button
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-xl font-semibold shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center min-w-40"
              onClick={saveUserLocation}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Loading...
                </>
              ) : (
                "Enable Location"
              )}
            </button>
            <button
              className="border-2 border-indigo-500 text-indigo-600 hover:bg-indigo-50 px-8 py-3 rounded-xl font-semibold transition-all duration-300 min-w-40"
              onClick={() => setIsVisible(false)}
            >
              Not now
            </button>
          </div>
        </div>
        <div className="flex-shrink-0 md:ml-6 relative">
          <div className="w-56 h-56 md:w-64 md:h-64 relative">
            <Image
              src="/images/undraw_destination_fkst.svg"
              fill
              className="object-contain"
              alt="Enable location illustration"
              priority
            />
          </div>
          <div className="absolute -bottom-4 -right-4 w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center animate-pulse">
            <div className="w-8 h-8 text-indigo-600">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserLocation;