//TODO: Implementing the user modify function(api route and form)
import { useState } from "react";
import { useSession } from 'next-auth/react';
const MySettings = () => {

  const { data: session, status, update } = useSession();
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [error, setError] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    

    if (!selectedFile) throw new Error("No file selected.");

    
      const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
      if (!allowedTypes.includes(selectedFile.type)) {
        setError("❌ Invalid file type. Please upload an image (JPG, PNG, GIF, WEBP).");
        return;
    }

    try{
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
      
    const imageUrl =  uploadedImage.url;

    const res = await fetch('/api/upload-profile', {
      method: 'POST',
      body: JSON.stringify({imageUrl}),
    });
    if(res.ok){
    await update();
    }else{
      throw new Error("Error uploading profile pic to database")
    }
      

  }catch(error){
    console.log(error)
    setError(error)
  }}

  return (
    <div>
      <p className="pl-10 font-semibold text-gray-800 text-3xl pb-10 ">Account settings</p>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <form
        onSubmit={handleSubmit}
        className="p-4 border rounded-2xl shadow-md space-y-4"
      >
        <label className="block text-sm font-medium text-gray-700">Upload profile picture</label>
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
        />
        {preview && (
          <img
            src={preview}
            alt="Előnézet"
            className="w-32 h-32 rounded-full object-cover mx-auto"
          />
        )}
         <button
          type="submit"
          className="w-full bg-indigo-600 text-white py-2 px-4 rounded-xl hover:bg-indigo-700 transition"
        >
          Change
        </button>
      </form>
  
      <form className="p-4 border rounded-2xl shadow-md space-y-4">
        <label className="block text-sm font-medium text-gray-700">First Name</label>
        <input
          type="text"
          className="block w-full text-sm text-gray-700 border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <button
          type="submit"
          className="w-full bg-indigo-600 text-white py-2 px-4 rounded-xl hover:bg-indigo-700 transition"
        >
          Change
        </button>
      </form>
  
      <form className="p-4 border rounded-2xl shadow-md space-y-4">
        <label className="block text-sm font-medium text-gray-700">Last Name</label>
        <input
          type="text"
          className="block w-full text-sm text-gray-700 border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
          <button
          type="submit"
          className="w-full bg-indigo-600 text-white py-2 px-4 rounded-xl hover:bg-indigo-700 transition"
        >
          Change
        </button>
      </form>

      <form className="p-4 border rounded-2xl shadow-md space-y-4">
        <label className="block text-sm font-medium text-gray-700">Email</label>
        <input
          type="text"
          className="block w-full text-sm text-gray-700 border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
         <button
          type="submit"
          className="w-full bg-indigo-600 text-white py-2 px-4 rounded-xl hover:bg-indigo-700 transition"
        >
          Change
        </button>
      </form>

      <div className="p-4 border rounded-2xl shadow-md space-y-4">Change Password</div>

      
  
      {error && (
        <p className="text-red-500 mt-2 text-center col-span-full">{error}</p>
      )}
    </div>
    </div>
  );
  
  
}

export default MySettings;