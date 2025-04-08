'use client'

import { useState, useEffect } from 'react';

export default function ResetPassword() {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [token, setToken] = useState("");

  useEffect(() => {
    const urlToken = window.location.search.split('=')[1];
    setToken(urlToken || "");
  
  },[])
  
  useEffect(() => {
    if(token.length > 0){
      console.log(token)
    }
  },[token])

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      setError('A jelszavak nem egyeznek!');
      return;
    }

    resetPassword()
}

const resetPassword = async () => {
  try {
    const response = await fetch('/api/users/resetpassword', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ newPassword, token }),
    });

    const data = await response.json();

    if (response.ok) {
      setSuccess('Jelszó sikeresen megváltoztatva!');
    } else {
      setError(data.error || 'Valami hiba történt!');
    }
  } catch (err) {
    setError('Hálózati hiba történt!');
  }
};
   

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-4">Jelszó visszaállítása</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700">Új jelszó</label>
            <input
              type="password"
              placeholder="Új jelszó"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md mt-2"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Jelszó megerősítése</label>
            <input
              type="password"
              placeholder="Jelszó megerősítése"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md mt-2"
              required
            />
          </div>
          {error && <div className="text-red-500 text-sm mb-4">{error}</div>}
          {success && <div className="text-green-500 text-sm mb-4">{success}</div>}
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-3 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300"
          >
            Jelszó visszaállítása
          </button>
        </form>
      </div>
    </div>
  );
}
