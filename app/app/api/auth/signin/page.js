'use client'

import { signIn } from "next-auth/react";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";


export default function LoginForm() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const searchParams = useSearchParams();
  const signInError = searchParams.get("error");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const result = await signIn("credentials", {
      redirect: false,
      username,
      password,
    });

    if (result.error) {
      setError(result.error);
    } else {
      
      window.location.href = "/";
    }
  };

  return (<div>
    {signInError && (
        <div className="bg-red-500 text-white p-3 rounded mt-4">
          <p>Hiba: {decodeURIComponent(signInError)}</p>
        </div>
      )}
    <div className="flex justify-center items-center h-screen w-fill">
      
      <div className="flex justify-center items-center  w-3/4 flex-col">
      <p className="text-5xl font-bold">Login to your account</p>
      <p className="pt-4 text-gray-700">Login using social networks</p>
      <div className="flex pt-4">
        <div className="px-4 cursor-pointer" onClick={() => signIn("github", {callbackUrl : "/"})}><Image src="/icons/github.png" alt="facebook" width={40} height={40}/></div>
        <div className="px-4 cursor-pointer" onClick={() => signIn("google", {callbackUrl : "/"})}><Image src="/icons/google.png" alt="google" width={40} height={40}/></div>
      </div>
      <p className="pt-4 text-gray-700">Or</p>
    <form className="flex  justify-center items-center  flex-col pt-4"  onSubmit={handleSubmit}>
      <input
        className="rounded-3xl border-2 py-2 pr-64 pl-4 bg-indigo-100 placeholder-black"
        type="text"
        name="username"
        placeholder="Email or username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        required
      />
      <input
        className="rounded-3xl border-2 py-2 pr-64  pl-4 mb-8 mt-4 bg-indigo-100 placeholder-black"
        type="password"
        name="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <button className="bg-indigo-500 text-white rounded-3xl py-2 px-10" type="submit">Sign in</button>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </form>
    </div>
    <div className=" flex justify-center items-center w-1/4 h-screen bg-indigo-500 flex-col text-white px-4">
      <p className="text-5xl font-bold justify-center items-center text-center leading-relaxed">New Here?</p>
      <p className="text-center leading-relaxed">Sign up and discover a great amount of new opportunities</p>
      <Link href="/register"><div className="bg-white text-black px-10 py-4 rounded-3xl mt-4">Sign Up</div></Link>
    </div>
    </div>
    </div>
  );
}
