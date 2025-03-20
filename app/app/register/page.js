
'use client'

import { useState } from 'react';
import Link from 'next/link';

export default function Register() {
  const [formData, setFormData] = useState({ firstName:'',lastName:'', username:'', email:'', password:'',passwordAgain:'', phoneNumber:'' });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if(formData.password !== formData.passwordAgain){
      throw new Error('The password should be the same');
    }

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await response.json();
      
      if (!response.ok) throw new Error(data.error);

      setSuccess('Successful registration!');
      setError(null);
      setFormData({ firstName:'',lastName:'', username:'', email:'', password:'',passwordAgain:'', phoneNumber:'' });
    } catch (error) {
     
      setError(error);
      setSuccess(null);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen w-fill">
      <div className=" flex justify-center items-center w-1/4 h-screen bg-indigo-500 flex-col text-white px-4">
      <p className="text-5xl font-bold justify-center items-center text-center leading-relaxed">Already have an account?</p>
      <p className="text-center leading-relaxed">Sign in and continue browsing</p>
      <Link href="/api/auth/signin"><div className="bg-white text-black px-10 py-4 rounded-3xl mt-4">Sign In</div></Link>
    </div>

    <div className="flex justify-center items-center  w-3/4 flex-col ">
    <h1 className="text-5xl font-bold">Sign Up</h1>
      
      <form onSubmit={handleSubmit} className="flex flex-col justify-center items-center ">
      <input
          type="text"
          placeholder="Username"
          value={formData.username}
          onChange={(e) => setFormData({ ...formData, username: e.target.value })}
          className="rounded-3xl border-2 py-2 pr-64   pl-4 mb-2 mt-10 bg-indigo-100 placeholder-black"
          required
        />
        <input
          type="text"
          placeholder="First Name"
          value={formData.firstName}
          onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
          className="rounded-3xl border-2 py-2 pr-64  pl-4 my-2 bg-indigo-100 placeholder-black"
          required
        />
         <input
          type="text"
          placeholder="Last Name"
          value={formData.lastName}
          onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
          className="rounded-3xl border-2 py-2 pr-64  pl-4 my-2 bg-indigo-100 placeholder-black"
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          className="rounded-3xl border-2 py-2 pr-64  pl-4 my-2 bg-indigo-100 placeholder-black"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={formData.password}
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          className="rounded-3xl border-2 py-2 pr-64  pl-4 my-2 bg-indigo-100 placeholder-black"
          required
        />
        <input
          type="password"
          placeholder="Password again"
          value={formData.passwordAgain}
          onChange={(e) => setFormData({ ...formData, passwordAgain: e.target.value })}
          className="rounded-3xl border-2 py-2 pr-64  pl-4 my-2 bg-indigo-100 placeholder-black"
          required
        />
        <input
          type="text"
          placeholder="Phone number"
          value={formData.phoneNumber}
          onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
          className="rounded-3xl border-2 py-2 pr-64  pl-4 my-2 bg-indigo-100 placeholder-black"
          required
        />
        <button type="submit" className="bg-indigo-500 text-white rounded-3xl py-2 px-10 mt-10">Register</button>
      </form>
      </div>
     {error && <div>{error}</div>}
    </div>
  );
}