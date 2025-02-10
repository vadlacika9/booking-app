
'use client'

import { useState } from 'react';

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
      console.log(data)
      if (!response.ok) throw new Error(data.error);

      setSuccess('Regisztráció sikeres!');
      setError(null);
      setFormData({ firstName:'',lastName:'', username:'', email:'', password:'',passwordAgain:'', phoneNumber:'' });
    } catch (error) {
     
      setError(error);
      setSuccess(null);
    }
  };

  return (
    <div className="container">
      <h1>Regisztráció</h1>
      
      <form onSubmit={handleSubmit} className="form">
      <input
          type="text"
          placeholder="Username"
          value={formData.username}
          onChange={(e) => setFormData({ ...formData, username: e.target.value })}
          className="input"
          required
        />
        <input
          type="text"
          placeholder="First Name"
          value={formData.firstName}
          onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
          className="input"
          required
        />
         <input
          type="text"
          placeholder="Last Name"
          value={formData.lastName}
          onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
          className="input"
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          className="input"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={formData.password}
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          className="input"
          required
        />
        <input
          type="password"
          placeholder="Password again"
          value={formData.passwordAgain}
          onChange={(e) => setFormData({ ...formData, passwordAgain: e.target.value })}
          className="input"
          required
        />
        <input
          type="text"
          placeholder="Phone number"
          value={formData.phoneNumber}
          onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
          className="input"
          required
        />
        <button type="submit" className="button">Regisztráció</button>
      </form>

      <style jsx>{`
        .container {
          max-width: 400px;
          margin: 0 auto;
          padding: 20px;
          border: 1px solid #ddd;
          border-radius: 8px;
          background: #f9f9f9;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }
        h1 {
          text-align: center;
          color: #333;
        }
        .error {
          color: red;
          text-align: center;
        }
        .success {
          color: green;
          text-align: center;
        }
        .form {
          display: flex;
          flex-direction: column;
        }
        .input {
          margin-bottom: 15px;
          padding: 10px;
          border: 1px solid #ccc;
          border-radius: 4px;
          font-size: 16px;
        }
        .button {
          padding: 10px;
          background: #0070f3;
          color: white;
          border: none;
          border-radius: 4px;
          font-size: 16px;
          cursor: pointer;
          transition: background 0.3s ease;
        }
        .button:hover {
          background: #005bb5;
        }
      `}</style>
    </div>
  );
}