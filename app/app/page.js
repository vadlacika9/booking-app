"use client";

import { useState, useEffect } from "react";
import { getSession } from "next-auth/react";
import AOS from "aos";
import "aos/dist/aos.css";
import HeroSection from "../components/HeroSection";
import RecommendedSection from "../components/RecomendedSection";
import Slidein from "@/components/Slide-in";
import Footer from "@/components/Footer";
import Loading from "@/components/Loading";

export default function App() {
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState(null);
  const [error, setError] = useState(null)



  useEffect(() => {
    AOS.init({
      duration: 1000, 
      offset: 20,

   
    });


  },[])


  useEffect(() => {
    
    const fetchSession = async () => {
      try {
        setLoading(true);
        const sessionData = await getSession();
        setSession(sessionData);
      } catch (error) {
        setError(error)
      } finally {
        setLoading(false);
      }
    };

    fetchSession();

  }, []);

  useEffect(() => {
    if(session){
      console.log(session)
    }
  },[session])

  if (loading) {
    return (
      <Loading/>
    );
  }

  return (
    <div className="overflow-x-hidden">
      <HeroSection />
      <RecommendedSection />
      <Slidein/>
      <Footer/>
      {error && <p className="text-red-500 mt-2 text-center">{error}</p>}
    </div>
  );
}
