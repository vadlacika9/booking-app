'use client'

import React from 'react';
import ServiceCard from './ServiceCard';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Carousel from '../components/ImageCarousel';

export default function RecommendedSection() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await fetch('api/services');
        if (!response.ok) {
          throw new Error(`Hiba: ${response.status}`);
        }
        const data = await response.json();
        setServices(data);

      } catch (error) {
        console.error('Hiba történt az adatok lekérésekor:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []); 

  if (loading) return <p>Adatok betöltése...</p>; 

  return (
    <div>
      <h1 className="ml-28 font-bold text-2xl py-10">Recommended</h1>
    <Carousel services={services}/>
    </div>
  );
}