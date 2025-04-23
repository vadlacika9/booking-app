'use client';

import React, { useState, useEffect } from 'react';
import Carousel from '../components/ImageCarousel';

export default function RecommendedSection({ services }) {
  const [allLocations, setAllLocations] = useState([]);
  const [locationNames, setLocationNames] = useState([]);
  const [nearbyServices, setNearbyServices] = useState([]);
  const [isUserLocation, setIsUserLocation] = useState(false);
  const [error, setError] = useState(null);
  const [position, setPosition] = useState(null);
  const [hydrated, setHydrated] = useState(false); // ⬅️ új állapot
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    const location = sessionStorage.getItem("userLocation");
    if (location) {
      const pos = JSON.parse(location);
      setPosition(pos);
      setIsUserLocation(true);
    }
    setHydrated(true);
  }, []);


  useEffect(() => {
    const getLocations = async () => {
      if (!position) return;

      const username = process.env.NEXT_PUBLIC_GEO_USERNAME;
      try {
        const response = await fetch(
          `http://api.geonames.org/findNearbyPlaceNameJSON?lat=${position.lat}&lng=${position.lng}&radius=50&maxRows=500&username=${username}`
        );

        if (!response.ok) {
          setError(await response.json());
          return;
        }

        const data = await response.json();
        setAllLocations(data.geonames);

        const names = data.geonames.map((location) => location.name);
        setLocationNames(names);
      } catch (error) {
        setError(error);
      }
    };

    if (isUserLocation) getLocations();
  }, [position, isUserLocation]);


  useEffect(() => {
    const fetchNearbyServices = async () => {
      if (locationNames.length === 0) return;

      try {
        const res = await fetch('/api/get-nearest-places', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ locationNames }),
        });

        if (!res.ok) {
          setError(await res.json());
          return;
        }

        const data = await res.json();
        setNearbyServices(data);
      } catch (error) {
        setError(error);
      }
    };

    if (isUserLocation) fetchNearbyServices();
  }, [locationNames, isUserLocation]);


  if (!hydrated) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 z-0">
      <h1 className="font-bold text-2xl py-10 text-gray-800">Recommended</h1>
      {!isUserLocation && <Carousel services={services} />}
      {isUserLocation && <Carousel services={nearbyServices} />}
    </div>
  );
}
