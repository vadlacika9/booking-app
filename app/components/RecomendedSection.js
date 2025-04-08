'use client'

import React from 'react';
import { useState, useEffect } from 'react';
import Carousel from '../components/ImageCarousel';
import Loading from './Loading';

export default function RecommendedSection() {
  const [services, setServices] = useState([]);
  const [allLocations, setAllLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [locationNames, setLocationNames] = useState([]);
  const [nearbyServices, setNearbyServices] = useState([]);
  const [isUserLocation, setIsUserLocation] = useState(false);
  const [error, setError] = useState(null);
  const [position, setPosition] = useState(null);

 

 
  useEffect(() => {
    if(sessionStorage.getItem("userLocation")){
      const pos = JSON.parse(sessionStorage.getItem("userLocation"));
     
      setPosition(pos);
      setIsUserLocation(true);
     
      
    }
  },[])

  useEffect(() => {
    if(!isUserLocation){
    const fetchServices = async () => {
      try {
        const response = await fetch('api/services');
        console.log(response)
        if (!response.ok) {
          throw new Error(`Hiba: ${response.status}`);
        }
        const data = await response.json();
        setServices(data);

      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };
  
    fetchServices();
    }
  }, []); 
    

    useEffect(() => {
      const getLocations = async () => {
         
         const username = process.env.NEXT_PUBLIC_GEO_USERNAME
         
        try {
          // fetching the places in 50 km radius
      
          const response = await fetch(`http://api.geonames.org/findNearbyPlaceNameJSON?lat=${position.lat}&lng=${position.lng}&radius=50&maxRows=500&username=${username}`);
  
          
          if (!response.ok) {
            setError(response.json())
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
  
      getLocations();
    }, [position]);
  
    useEffect(() => {
      if(isUserLocation){
      const fetchNearbyServices = async () => {
       
        if (locationNames.length > 0) {
          try {
            const res = await fetch('/api/get-nearest-places', {
              method: 'POST',
              headers: {'Content-Type': 'application/json'},
              body: JSON.stringify({ locationNames })
            });
  
            if (!res.ok) {
              setError(res.json)
              return;
            }
  
            const data = await res.json();
            setNearbyServices(data);

          } catch (error) {
            setError(error);
          }
        }
      };
  
      fetchNearbyServices();
    }
    }, [locationNames]);
  
   

  if (loading) return  <Loading/>

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 z-0">
      <h1 className="font-bold text-2xl py-10 text-gray-800">Recommended</h1>
    {!isUserLocation && <Carousel services={services}/>}
    {isUserLocation && <Carousel services={nearbyServices}/>}
    
    </div>
  );
}