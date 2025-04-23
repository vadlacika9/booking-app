'use client'

import { useState, useEffect } from "react";
import { useSession } from 'next-auth/react';
import Loading from "./Loading";
import Image from "next/image";
import { useRouter } from 'next/navigation';
import ConfirmDialog from "./ConfirmDialog";

const MySettings = () => {
  const router = useRouter();
  const { data: session, status, update } = useSession();
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);
  const [userId, setUserId] = useState(null);
  const [userDetails, setUserDetails] = useState(null);
  const [email, setEmail] = useState(null);
  const [isPasswordChangeDialogOpen, setIsPasswordChangeDialogOpen] = useState(false);
  
  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const res = await fetch("/api/users/get-my-details");
        if (!res.ok) {
          throw new Error('Cannot get service!');
        }
        const data = await res.json();
        setUserDetails(data);
      } catch (error) {
        setError(error.message);
      }
    }
    
    fetchDetails();
  }, [userId]);

  useEffect(() => {
    if (userDetails) {
      setPreview(userDetails.profile_pic);
      setEmail(userDetails.email);
    }
  }, [userDetails]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserDetails((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleDetailsSubmit = async () => {
    try {
      setMessage(null);
      setError(null);
      
      const response = await fetch('/api/users/update-profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userDetails),
      });

      if (!response.ok) {
        throw new Error("Failed to update profile details");
      }

      setMessage("Profile updated successfully!");
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } catch (err) {
      setError(err.message);
    }
  };
  
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setMessage(null);

    if (!selectedFile) {
      setError("No file selected.");
      return;
    }

    const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
    if (!allowedTypes.includes(selectedFile.type)) {
      setError("Invalid file type. Please upload an image (JPG, PNG, GIF, WEBP).");
      return;
    }

    try {
      const responseImage = await fetch(
        `/api/upload?filename=${selectedFile.name}`,
        {
          method: 'POST',
          body: selectedFile,
        },
      );
      
      if (!responseImage.ok) {
        throw new Error("Image upload failed.");
      }

      const uploadedImage = await responseImage.json();
      const imageUrl = uploadedImage.url;

      const res = await fetch('/api/upload-profile', {
        method: 'POST',
        body: JSON.stringify({ imageUrl }),
      });
      
      if (res.ok) {
        await update();
        setMessage("Profile picture updated successfully!");
      } else {
        throw new Error("Error uploading profile picture to database");
      }
    } catch (error) {
      setError(error.message);
    }
  };

  const openPasswordChangeDialog = () => {
    setIsPasswordChangeDialogOpen(true);
  };

  const closePasswordChangeDialog = () => {
    setIsPasswordChangeDialogOpen(false);
  };

  const handlePasswordChanging = async () => {
    try {
      setError(null);
      setMessage(null);
      closePasswordChangeDialog();
      
      const response = await fetch('/api/users/forgotpassword', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(data.message || "Password reset link sent to your email!");
      } else {
        setError(data.error || "Failed to send password reset email");
      }
    } catch (err) {
      setError(err.message);
    }
  };

  if (!userDetails) return <Loading />;

  return (
    <div className="max-w-4xl mx-auto px-4 py-10 space-y-8 bg-gray-50 min-h-screen">
      <div className="bg-white p-8 rounded-2xl shadow-lg">
        <h1 className="font-bold text-gray-800 text-3xl mb-6 border-b border-gray-100 pb-4">Account Settings</h1>

        {/* Status messages */}
        {message && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-700 rounded-xl flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            {message}
          </div>
        )}

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            {error}
          </div>
        )}

        {/* Password Change Confirmation Dialog */}
        {isPasswordChangeDialogOpen && (
          <ConfirmDialog title="Confirm Password Change" message="Are you sure you want to change your password? A password reset link will be sent to your email address." onClose={closePasswordChangeDialog} handle={handlePasswordChanging}/>
        )}

        {/* Profile picture section */}
        <div className="flex flex-col items-center gap-4 p-6 border border-indigo-100 rounded-2xl bg-indigo-50 shadow-sm w-full md:max-w-md mx-auto mb-8">
          <h2 className="text-xl font-medium text-indigo-800 mb-2">Profile Picture</h2>
          
          {/* Hidden file input */}
          <input
            type="file"
            accept="image/*"
            id="fileUpload"
            onChange={handleFileChange}
            className="hidden"
          />

          {/* Clickable image label */}
          <label htmlFor="fileUpload" className="cursor-pointer group relative">
            {preview || userDetails.profile_pic ? (
              <div className="relative">
                <Image
                  src={preview || userDetails.profile_pic}
                  alt="Profile Preview"
                  width={300}
                  height={300}
                  className="w-36 h-36 rounded-full object-cover border-4 border-white shadow-md group-hover:opacity-90 transition"
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 rounded-full flex items-center justify-center transition-all">
                  <span className="text-white opacity-0 group-hover:opacity-100 font-medium">Change</span>
                </div>
              </div>
            ) : (
              <div className="w-36 h-36 bg-gray-200 rounded-full flex items-center justify-center text-gray-600 text-sm border-4 border-dashed border-indigo-200 group-hover:border-indigo-300 transition">
                Click to upload
              </div>
            )}
          </label>

          {/* Submit button */}
          <form onSubmit={handleSubmit} className="w-full flex justify-center">
            <button
              type="submit"
              disabled={!selectedFile}
              className={`w-full mt-4 py-2.5 px-6 rounded-xl text-white font-medium transition shadow-sm
                ${selectedFile 
                  ? "bg-indigo-600 hover:bg-indigo-700 hover:shadow" 
                  : "bg-indigo-400 cursor-not-allowed"}`}
            >
              Update Profile Picture
            </button>
          </form>
        </div>

        {/* Account details section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="p-6 border border-gray-200 rounded-2xl shadow-sm hover:shadow transition bg-white space-y-4">
            <label className="block text-sm font-medium text-gray-700">First Name</label>
            <div className="relative">
              <input
                type="text"
                name="first_name"
                value={userDetails.first_name || ""}
                onChange={handleChange}
                className="block w-full text-gray-700 border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                placeholder="Your first name"
              />
            </div>
          </div>
          
          <div className="p-6 border border-gray-200 rounded-2xl shadow-sm hover:shadow transition bg-white space-y-4">
            <label className="block text-sm font-medium text-gray-700">Last Name</label>
            <div className="relative">
              <input
                type="text"
                name="last_name"
                value={userDetails.last_name || ""}
                onChange={handleChange}
                className="block w-full text-gray-700 border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                placeholder="Your last name"
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 mb-8">
          <div className="p-6 border border-gray-200 rounded-2xl shadow-sm bg-white">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-gray-800">Email Address</h3>
                <p className="text-gray-500 text-sm mt-1">{email || userDetails.email}</p>
              </div>
              <div className="text-xs text-gray-400">Cannot be changed</div>
            </div>
          </div>
        </div>

        <button
          onClick={handleDetailsSubmit}
          className="w-full bg-indigo-600 text-white py-3 px-6 rounded-xl hover:bg-indigo-700 transition font-medium shadow-sm hover:shadow flex items-center justify-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13a1 1 0 102 0V9.414l1.293 1.293a1 1 0 001.414-1.414z" clipRule="evenodd" />
          </svg>
          Save Profile Changes
        </button>

        <div className="mt-10 p-6 border border-orange-100 rounded-2xl shadow-sm bg-orange-50 hover:shadow transition">
          <div className="flex items-center justify-between cursor-pointer" onClick={openPasswordChangeDialog}>
            <div>
              <h3 className="font-medium text-gray-800 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-orange-500" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                </svg>
                Change Password
              </h3>
              <p className="text-gray-500 text-sm mt-1">Reset your password via email</p>
            </div>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MySettings;