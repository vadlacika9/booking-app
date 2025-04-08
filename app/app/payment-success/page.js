"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

export default function PaymentSuccess() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const servicePrice = searchParams.get("amount"); 
  const selectedSlot = searchParams.get("selectedSlot");
  const value = searchParams.get("value");
  const serviceId = searchParams.get("serviceId");
  const userId = searchParams.get("userId");
  const { data: session, status } = useSession();
  const [error, setError] = useState(null);
  const [isBookingSaved, setIsBookingSaved] = useState(false); 

  useEffect(() => {
    if (status === "authenticated" && session?.user) { 
      console.log("user id " + session.user.id);
    }
  }, [status, session]);

  useEffect(() => {
    if (status === "authenticated" && session?.user && !isBookingSaved) { 
      saveToDataBase();  // Mentés csak egyszer, ha még nem mentük el az adatokat
    }
  }, [status, session, isBookingSaved]);

  const saveToDataBase = async () => {
      
    if (!servicePrice || !selectedSlot || !value || !serviceId || !userId) {
      setError("Missing booking details.");
      return;
    }

  console.log(JSON.stringify({
    servicePrice,
    selectedSlot,
    value,
    serviceId,
    userId
  }),)


    try {
      const response = await fetch('/api/add-booking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          servicePrice,
          selectedSlot,
          value,
          serviceId,
          userId
        }),
      });
      

      if (!response.ok) {
        throw new Error(`Booking failed: ${response.statusText}`);
      }

      const result = await response.json();
      console.log('Booking successful:', result);
      if (result.message === "Booking inserted successfully!") {
        setIsBookingSaved(true);
        router.push("/")
      }
    } catch (error) {
      setError(error.message); 
    }
  };

  return (
    <main className="max-w-6xl mx-auto p-10 text-white text-center border m-19 rounded-md bg-gradient-to-tr from-blue-500 to-purple-500">
      <div className="mb-10">
        <h1 className="text-4xl font-extrabold mb-2">Thank you!</h1>
        <h2 className="text-2xl">You successfully sent</h2>
        <div className="bg-white p-2 rounded-md text-purple-500 mt-5 text-4xl font-bold">
          
          {servicePrice ? servicePrice : "0.00"} RON
        </div>
      </div>

      {error && (
        <div className="text-red-500 mt-4">
          <p>{error}</p>
        </div>
      )}

    </main>
  );
}
