'use client';

import HeroSection from "../components/HeroSection";
import RecommendedSection from "../components/RecomendedSection";
import { useState, useEffect } from "react";
import { getSession } from "next-auth/react";

export default function App() {
  const [loading, setLoading] = useState(true); // Loading állapot
  const [session, setSession] = useState(null); // Session állapot

  useEffect(() => {
    const fetchSession = async () => {
      try {
        setLoading(true); // Betöltés kezdete
        const sessionData = await getSession(); // Betöltjük a sessiont
        setSession(sessionData); // Állapot beállítása
      } catch (error) {
        console.error("Error fetching session:", error);
      } finally {
        setLoading(false); // Betöltés vége
      }
    };

    fetchSession();
  }, []); // Csak egyszer fusson

  if (loading) {
    // Betöltés közben
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="spinner border-t-4 border-b-4 border-blue-500 rounded-full w-16 h-16 animate-spin"></div>
      </div>
    );
  }

  // Betöltés után (vagy ha nincs session)
  return (
    <div>
      
          <HeroSection />
          <RecommendedSection />
    </div>
  );
}
