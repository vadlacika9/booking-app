'use client'

import { Elements } from "@stripe/react-stripe-js"
import { loadStripe } from "@stripe/stripe-js"
import CheckoutPage from "@/components/CheckoutPage"
import convertToSubCurrency from "@/utils/convertToSubCurrency"
import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { Loader2 } from "lucide-react"

if (process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY === undefined) {
  throw new Error("NEXT_PUBLIC_STRIPE_PUBLIC_KEY is not defined")
}

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY)

export default function Payment() {
  const [bookingDetails, setBookingDetails] = useState(null)
  const { data: session, status } = useSession()
  const [userId, setUserId] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (session && session.user) {
      setUserId(session.user.id)
    }
  }, [session, status])

  // Load booking details from sessionStorage
  useEffect(() => {
    setIsLoading(true)
    const savedBookingDetails = sessionStorage.getItem("bookingDetails")
    
    if (savedBookingDetails) {
      setBookingDetails(JSON.parse(savedBookingDetails))
    } else {
      console.error("No booking details found in session storage.")
      // Could redirect to an error page:
      // window.location.href = "/error"
    }
    setIsLoading(false)
  }, [])

  // Show a loading state
  if (isLoading || !bookingDetails) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
        <div className="p-8 rounded-lg shadow-md bg-white max-w-md w-full text-center">
          <Loader2 className="h-10 w-10 animate-spin text-blue-500 mx-auto mb-4" />
          <p className="text-gray-700 text-lg">Loading payment details...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-xl mx-auto">
        <div className="bg-white shadow-xl rounded-lg overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-tr from-blue-600 to-purple-600 px-6 py-8 text-white">
            <h1 className="text-3xl font-bold mb-2 text-center">{bookingDetails.serviceName}</h1>
            <div className="text-center">
              <p className="text-lg mb-1">Payment Request</p>
              <p className="text-2xl font-bold">{bookingDetails.servicePrice} RON</p>
            </div>
          </div>
          
          {/* Payment Form */}
          <div className="p-6">
            <Elements
              stripe={stripePromise}
              options={{
                mode: "payment",
                amount: convertToSubCurrency(bookingDetails.servicePrice),
                currency: "ron"
              }}
            >
              <CheckoutPage details={bookingDetails} userId={userId} />
            </Elements>
          </div>
          
          {/* Footer */}
          <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
            <p className="text-sm text-gray-500 text-center">
              Secure payment processing by Stripe
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}