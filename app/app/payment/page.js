'use client'

import { Elements } from "@stripe/react-stripe-js"
import { loadStripe } from "@stripe/stripe-js"
import CheckoutPage from "@/components/CheckoutPage"
import convertToSubCurrency from "@/utils/convertToSubCurrency"
import { useEffect, useState } from "react"
import { useSession } from "next-auth/react";

if (process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY === undefined) {
  throw new Error("NEXT_PUBLIC_STRIPE_PUBLIC_KEY is not defined")
}

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY)

export default function Payment() {
  const [bookingDetails, setBookingDetails] = useState(null);
  const { data: session, status } = useSession();
  const [userId, setUserId]= useState(null);

  useEffect(() => {

   

    if (session && session.user) { //checking the session & setting the user
      setUserId(session.user.id);
    }
  }, [session, status]);

  useEffect(() => {
    console.log(userId)
  },[session])

  // Kiolvasás a sessionStorage-ból
  useEffect(() => {
    const savedBookingDetails = sessionStorage.getItem("bookingDetails");
    if (savedBookingDetails) {
      setBookingDetails(JSON.parse(savedBookingDetails));
    } else {
      // Ha nincs mentett adat, átirányíthatod az oldalra, hogy újra próbálja meg a felhasználó
      console.error("No booking details found in session storage.");
      // Például átirányíthatod egy hibaoldalra:
      // window.location.href = "/error";
    }
  }, []);

  // Ha a bookingDetails még nincs betöltve, ne rendereljük a fizetési oldalt
  if (!bookingDetails) {
    return (
      <div>Loading...</div>  // Ide rakhatod, hogy mi történjen, ha a bookingDetails nem elérhető
    );
  }

  return (
    <main className="max-w-6xl mx-auto p-10 text-white text-center border m-10 rounded-md bg-gradient-to-tr from-blue-500 to-purple-500">
      <div className="mb-10">
        <h1 className="text-4xl font-extrabold mb-2">{bookingDetails.serviceName}</h1>
        <h2 className="text-2xl">
          has requested 
          <span className="font-bold"> {bookingDetails.servicePrice} RON</span>
        </h2>
      </div>

      <Elements 
        stripe={stripePromise}
        options={{
          mode: "payment",
          amount: convertToSubCurrency(bookingDetails.servicePrice),
          currency: "ron"  // Itt módosítottam a devizát RON-ra
        }}>
        <CheckoutPage details={bookingDetails} userId={userId} />
      </Elements>
    </main>
  );
}
