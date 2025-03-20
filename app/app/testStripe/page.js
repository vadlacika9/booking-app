'use client'

import { Elements } from "@stripe/react-stripe-js"
import { loadStripe } from "@stripe/stripe-js"
import CheckoutPage from "@/components/CheckoutPage"
import convertToSubcurrency from "@/utils/convertToSubCurrency"

export default function TestStripe(){
  return(
    <div>TestStripe</div>
  )
}