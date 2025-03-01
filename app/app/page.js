"use client";

import { useState, useEffect } from "react";
import { getSession } from "next-auth/react";
import AOS from "aos";
import "aos/dist/aos.css";
import HeroSection from "../components/HeroSection";
import RecommendedSection from "../components/RecomendedSection";
import Slidein from "@/components/Slide-in";



export default function App() {
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState(null);


  useEffect(() => {
    AOS.init({
      duration: 1000 // Animáció időtartama (ms)
    });
  },[])


  useEffect(() => {
   
    const fetchSession = async () => {
      try {
        setLoading(true);
        const sessionData = await getSession();
        setSession(sessionData);
      } catch (error) {
        console.error("Error fetching session:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSession();
  }, []);



  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="spinner border-t-4 border-b-4 border-blue-500 rounded-full w-16 h-16 animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="overflow-x-hidden">
      <HeroSection />
      <RecommendedSection />
      <Slidein/>
      
    </div>
  );
}
