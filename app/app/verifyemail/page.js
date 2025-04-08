"use client"

import Link from "next/link"
import { useEffect, useState } from "react"

export default function VerifiyEmailPage(){
const [token, setToken] = useState("");
const [verified, setVerified] = useState(false);
const [error, setError] = useState(null);
const [message, setMassege] = useState("");


useEffect(() => {
  const urlToken = window.location.search.split('=')[1];
  setToken(urlToken || "");

},[])

useEffect(() => {
  if(token.length > 0){
    verifiyUserEmail()
  }
},[token])


const verifiyUserEmail = async () => {
  try{
    const verify = await fetch('/api/users/verifyemail',{
      method: "POST",
      headers: {
        'Content-Type': 'application/json', // A content-type beállítása JSON-ra
      },
      body: JSON.stringify({ token })
    })

    const data = await verify.json()
    if(!verify.ok){
      setError(verify.error)
    }

    setVerified(true);
    

  }catch(error){
    setError(error)
    console.log(error)

  }
}

return (
  <div className="flex flex-col items-center justify-center min-h-screen py-2">
    <h1 className="text-4xl">Verify email</h1>
    <h2 className="p-2 bg-orange-500 text-black">{token ? `${token}` : "No token"}</h2>

    {verified && (
      <div>
        <h2 className="text-2xl">Email verified</h2>
        <Link href="/login" className="text-blue-500">Login</Link>
      </div>
    )}

{error && (
      <div>
        <h2 className="text-2xl bg-red-500 text-black">{error}</h2>
       
      </div>
    )}
  </div>
)

}