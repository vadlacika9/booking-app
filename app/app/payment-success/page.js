"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { CheckCircle, Loader2, AlertCircle } from "lucide-react";

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
  const [isProcessing, setIsProcessing] = useState(true);

  useEffect(() => {
    if (status === "authenticated" && session?.user) {
      console.log("user id " + session.user.id);
    }
  }, [status, session]);

  useEffect(() => {
    if (status === "authenticated" && session?.user && !isBookingSaved) {
      saveToDataBase(); // Save only once if not already saved
    }
  }, [status, session, isBookingSaved]);

  const saveToDataBase = async () => {
    if (!servicePrice || !selectedSlot || !value || !serviceId || !userId) {
      setError("Missing booking details.");
      setIsProcessing(false);
      return;
    }

    try {
      setIsProcessing(true);
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
        // Add a short delay before redirecting to show success message
        setTimeout(() => {
          router.push("/");
        }, 2000);
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <div className="max-w-md w-full">
        <div className="bg-white shadow-xl rounded-lg overflow-hidden">
          {/* Header with gradient */}
          <div className="bg-gradient-to-tr from-blue-600 to-purple-600 px-6 py-8 text-white text-center">
            {isProcessing ? (
              <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4" />
            ) : error ? (
              <AlertCircle className="h-12 w-12 mx-auto mb-4" />
            ) : (
              <CheckCircle className="h-12 w-12 mx-auto mb-4" />
            )}
            
            <h1 className="text-3xl font-bold mb-2">
              {error ? "Payment Error" : "Payment Successful!"}
            </h1>
          </div>
          
          {/* Content */}
          <div className="p-6 text-center">
            {isProcessing ? (
              <p className="text-gray-600">Processing your payment...</p>
            ) : error ? (
              <div>
                <p className="text-red-500 font-medium mb-4">{error}</p>
                <button 
                  onClick={() => router.push("/")}
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                >
                  Return Home
                </button>
              </div>
            ) : (
              <div>
                <p className="text-gray-600 mb-4">Your payment has been received</p>
                <div className="bg-gray-50 p-4 rounded-lg mb-6">
                  <p className="text-sm text-gray-500 mb-1">Amount paid</p>
                  <p className="text-4xl font-bold text-purple-600">
                    {servicePrice ? servicePrice : "0.00"} RON
                  </p>
                </div>
                <p className="text-sm text-gray-500 mb-6">
                  You will be redirected to the homepage shortly...
                </p>
                <button 
                  onClick={() => router.push("/")}
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                >
                  Return to Homepage
                </button>
              </div>
            )}
          </div>
          
          {/* Footer */}
          <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
            <p className="text-xs text-gray-500 text-center">
              Transaction ID: {value ? value.substring(0, 8) + "..." : "N/A"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}