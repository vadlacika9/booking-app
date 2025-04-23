'use client'

import { useState } from 'react';
import Link from 'next/link';
import { Eye, EyeOff, User, Mail, Phone, Lock } from 'lucide-react';

export default function Register() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    username: '',
    email: '',
    password: '',
    passwordAgain: '',
    phoneNumber: ''
  });
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Form validation
  const validateForm = () => {
    const newErrors = {};
    
    // Username validation
    if (formData.username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters';
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    // Password validation
    if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }
    
    // Password confirmation
    if (formData.password !== formData.passwordAgain) {
      newErrors.passwordAgain = 'Passwords do not match';
    }
    
    // Phone number validation
    const phoneRegex = /^\+?[0-9]{10,15}$/;
    if (!phoneRegex.test(formData.phoneNumber)) {
      newErrors.phoneNumber = 'Please enter a valid phone number';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    // Clear specific error when field is changed
    if (errors[name]) {
      setErrors({ ...errors, [name]: null });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form before submission
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    setSuccess(null);
    
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await response.json();
      
      if (!response.ok) throw new Error(data.error || 'Registration failed');

      setSuccess('Registration successful! We sent you a verification email.');
      setFormData({
        firstName: '',
        lastName: '',
        username: '',
        email: '',
        password: '',
        passwordAgain: '',
        phoneNumber: ''
      });
    } catch (error) {
      setErrors({ form: error.message || 'An error occurred during registration' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex h-screen">
      {/* Left panel */}
      <div className="hidden md:flex w-1/3 bg-indigo-600 flex-col justify-center items-center text-white px-8">
        <h2 className="text-3xl md:text-4xl font-bold text-center leading-tight mb-4">
          Already have an account?
        </h2>
        <p className="text-center text-indigo-100 mb-8">
          Sign in and continue exploring our services
        </p>
        <Link href="/api/auth/signin">
          <div className="bg-white text-indigo-600 font-medium px-8 py-3 rounded-full hover:shadow-xl transition-all duration-200 transform hover:-translate-y-1">
            Sign In
          </div>
        </Link>
      </div>

      {/* Right panel - Registration form */}
      <div className="w-full md:w-2/3 flex flex-col justify-center items-center px-4 md:px-12 bg-gray-50">
        <div className="w-full max-w-md">
          {/* Mobile sign-in link */}
          <div className="md:hidden text-center mb-6">
            <p className="text-gray-600 mb-2">Already have an account?</p>
            <Link href="/api/auth/signin">
              <div className="text-indigo-600 font-medium">
                Sign In
              </div>
            </Link>
          </div>
          
          <h1 className="text-3xl md:text-4xl font-bold text-center mb-8 text-gray-800">
            Create an Account
          </h1>

          {/* Success message */}
          {success && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-6">
              {success}
            </div>
          )}

          {/* Form error */}
          {errors.form && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6">
              {errors.form}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Username field */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User size={18} className="text-gray-500" />
              </div>
              <input
                type="text"
                name="username"
                placeholder="Username"
                value={formData.username}
                onChange={handleChange}
                className={`w-full pl-10 pr-4 py-2 rounded-lg border ${errors.username ? 'border-red-500 bg-red-50' : 'border-gray-300 bg-white'} focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500`}
                required
              />
              {errors.username && <p className="text-red-500 text-xs mt-1">{errors.username}</p>}
            </div>

            {/* Name fields - grid layout */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <input
                  type="text"
                  name="firstName"
                  placeholder="First Name"
                  value={formData.firstName}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  required
                />
              </div>
              <div>
                <input
                  type="text"
                  name="lastName"
                  placeholder="Last Name"
                  value={formData.lastName}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  required
                />
              </div>
            </div>

            {/* Email field */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail size={18} className="text-gray-500" />
              </div>
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                className={`w-full pl-10 pr-4 py-2 rounded-lg border ${errors.email ? 'border-red-500 bg-red-50' : 'border-gray-300 bg-white'} focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500`}
                required
              />
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
            </div>

            {/* Password field */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock size={18} className="text-gray-500" />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                className={`w-full pl-10 pr-12 py-2 rounded-lg border ${errors.password ? 'border-red-500 bg-red-50' : 'border-gray-300 bg-white'} focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500`}
                required
              />
              <div
                className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={18} className="text-gray-500" /> : <Eye size={18} className="text-gray-500" />}
              </div>
              {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
            </div>

            {/* Confirm Password field */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock size={18} className="text-gray-500" />
              </div>
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                name="passwordAgain"
                placeholder="Confirm Password"
                value={formData.passwordAgain}
                onChange={handleChange}
                className={`w-full pl-10 pr-12 py-2 rounded-lg border ${errors.passwordAgain ? 'border-red-500 bg-red-50' : 'border-gray-300 bg-white'} focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500`}
                required
              />
              <div
                className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? <EyeOff size={18} className="text-gray-500" /> : <Eye size={18} className="text-gray-500" />}
              </div>
              {errors.passwordAgain && <p className="text-red-500 text-xs mt-1">{errors.passwordAgain}</p>}
            </div>

            {/* Phone number field */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Phone size={18} className="text-gray-500" />
              </div>
              <input
                type="tel"
                name="phoneNumber"
                placeholder="Phone Number"
                value={formData.phoneNumber}
                onChange={handleChange}
                className={`w-full pl-10 pr-4 py-2 rounded-lg border ${errors.phoneNumber ? 'border-red-500 bg-red-50' : 'border-gray-300 bg-white'} focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500`}
                required
              />
              {errors.phoneNumber && <p className="text-red-500 text-xs mt-1">{errors.phoneNumber}</p>}
            </div>

            {/* Submit button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 px-4 rounded-lg transition duration-300 ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {isSubmitting ? 'Registering...' : 'Create Account'}
            </button>
          </form>

          {/* Mobile sign-in link */}
          <div className="md:hidden text-center mt-6">
            <p className="text-gray-600">Already have an account?</p>
            <Link href="/api/auth/signin">
              <div className="text-indigo-600 font-medium mt-2">
                Sign In
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}