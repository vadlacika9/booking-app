'use client'

import { useState, useRef, useEffect } from "react";
import { useRouter } from 'next/navigation';
import { useSession } from "next-auth/react";
import counties from "@/utils/counties";
import { filterLocations } from "@/utils/counties";

const AddService = () => {

  const {data: session, status} = useSession();
  const router = useRouter();
  const [serviceName, setServiceName] = useState('');
  const [serviceDesc, setServiceDesc] = useState('');
  const [servicePrice,setServicePrice] = useState('');
  const [serviceCounty, setServiceCounty] = useState('');
  const [serviceCity, setServiceCity] = useState('');
  const [serviceAddress, setServiceAddress] = useState('');
  const [servicePostal,setServicePostal] = useState('');
  const [message, setMessage] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [availableDays, setAvailableDays] = useState('Weekdays only');
  const [step, setStep] = useState(1);
  const [categories, setCategories] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [phoneNumber, setPhoneNumber] = useState('');
  const inputFileRef = useRef(null);
  const [error, setError] = useState(null);
  const [locations, setLocations] = useState([]);
  const [selectedCounty, setSelectedCounty] = useState('');
  const [selectedTown, setSelectedTown] = useState('');
  const [filePreview, setFilePreview] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState([]);

  //break form into steps
  const steps = [
    { id: 1, name: 'Basic Info' },
    { id: 2, name: 'Category' },
    { id: 3, name: 'Location' },
    { id: 4, name: 'Availability' },
    { id: 5, name: 'Image' }
  ];

    useEffect(() => { //fetching categories
    const getCategories = async () => {
      try{
        const fetchCategories = await fetch('/api/get-categories');
        const response = await fetchCategories.json();
        setCategories(response);
      }catch(error){
        setError(error)
      }
    }

    getCategories()
    },[session])

    //handles the selected county
    const handleSelectChange = (event) => {
    const countyCode = event.target.value;
    setServiceCounty(countyCode)
    setSelectedCounty(countyCode);
    // after select calling the getTownsInCounty function
    if (countyCode) {
      getTownsInCounty(countyCode);
    } else {
      setLocations([]);  // If no towns in tha county the Locations are []
    }
    };

    //handle the selected town
    const handleTownChange = (event) => {
    setSelectedTown(event.target.value);
    setServiceCity(event.target.value) // updating the selected city
    };

    //fetching the towns in the selected county
    const getTownsInCounty = async (code) => {
      try {
        const response = await fetch(`http://api.geonames.org/searchJSON?q=RO-${code}&country=RO&maxRows=1000&username=${process.env.NEXT_PUBLIC_GEO_USERNAME}`);
        if (!response.ok) {
          setError(response.status)
          return;
        }
        
        const data = await response.json();
        
        // filtering
        const filteredLocations = await filterLocations(data);
    
        setLocations(filteredLocations);
      } catch (error) {
        setError(error);
      }
    };

    //handle the files
    const handleFileChange = (e) => {
      const files = Array.from(e.target.files);
      setSelectedFiles(files);
  
      const filePreviews = files.map((file) => URL.createObjectURL(file));
      setFilePreview(filePreviews);
    };

    //handle submit
    async function handleSubmit(event){
    event.preventDefault();

    try{
     
      const uploadedUrls = [];
     
      if (selectedFiles){
        for (const file of selectedFiles) {
          //checking if the type of the files are allowed
        const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];

        //blocking the uploading
        if (!allowedTypes.includes(file.type)) {
          setError("❌ Invalid file type.");
          setUploading(false);
          return;
        }

        //uploading the files
        const res = await fetch(`/api/upload?filename=${file.name}`, {
          method: 'POST',
          body: file,
        });

        if (!res.ok) throw new Error("Upload failed");

        const data = await res.json();
        //pushing the uploaded file url to the uploadedUrls array
        uploadedUrls.push(data.url);
      }
    }

      //after the files are uploaded, we try to insert the service into database
      const response = await fetch('api/add-service',{
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ serviceName,serviceDesc,servicePrice,serviceCounty,serviceCity,serviceAddress,servicePostal,image: uploadedUrls,startTime,endTime, availableDays, phoneNumber, selectedCategory })
      });

      if(!response.ok){
        throw new Error('Failed to submit');
      }

      const data = await response.json();
        
      
      setMessage(data.message);

      //redirect after successfull insert
      router.push('/')
      
    }catch(error){
      setError(error)
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-indigo-50 to-white py-10 px-4">
      <div className="bg-white shadow-xl rounded-2xl px-8 py-6 mb-10 w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center text-indigo-700">Add Your Service</h1>
        
        {/* Progress indicator */}
        <div className="mb-8">
          <div className="flex justify-between mb-2">
            {steps.map((s) => (
              <div key={s.id} className="flex flex-col items-center">
                <div 
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium
                    ${step >= s.id ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-600'}`}
                >
                  {s.id}
                </div>
                <span className="text-xs mt-1 hidden sm:block">{s.name}</span>
              </div>
            ))}
          </div>
          <div className="overflow-hidden h-2 rounded-full bg-gray-200">
            <div 
              className="h-full bg-indigo-600 transition-all duration-300"
              style={{ width: `${(step / steps.length) * 100}%` }}
            ></div>
          </div>
        </div>
        
        {/*displaying the error*/}
        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4">
            {error.toString()}
          </div>
        )}
        
        {/*displaying the success message*/}
        {message && (
          <div className="bg-green-50 text-green-600 p-3 rounded-lg mb-4">
            {message}
          </div>
        )}
        
        {/*add-service form*/}
        <form onSubmit={handleSubmit}>
          {step === 1 && (
            <div className="space-y-4">
              <h2 className="text-lg font-medium text-gray-800 mb-4">Basic Information</h2>
              
              <input 
                className="w-full bg-indigo-50 rounded-lg p-4 focus:outline-none focus:ring-2 focus:ring-indigo-300 transition-colors" 
                value={serviceName} 
                onChange={(e) => setServiceName(e.target.value)} 
                required 
                placeholder="Service name"
              />
             
              <textarea 
                className="w-full bg-indigo-50 rounded-lg p-4 focus:outline-none focus:ring-2 focus:ring-indigo-300 transition-colors" 
                value={serviceDesc} 
                onChange={(e) => setServiceDesc(e.target.value)} 
                required 
                placeholder="Description"
                rows="3"
              />

              <input 
                className="w-full bg-indigo-50 rounded-lg p-4 focus:outline-none focus:ring-2 focus:ring-indigo-300 transition-colors" 
                value={phoneNumber} 
                onChange={(e) => setPhoneNumber(e.target.value)} 
                required 
                placeholder="Phone Number"
              />
             
              <input 
                className="w-full bg-indigo-50 rounded-lg p-4 focus:outline-none focus:ring-2 focus:ring-indigo-300 transition-colors" 
                type='number' 
                value={servicePrice} 
                onChange={(e) => setServicePrice(e.target.value)} 
                required 
                placeholder="Price/hour"
              />
            </div>
          )}
          
          {step === 2 && (
            <div>
              <h2 className="text-lg font-medium text-gray-800 mb-6">Choose a Category</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {categories && categories.map((cat, index) => (
                  <div
                    onClick={() => setSelectedCategory(cat.category_id)}
                    key={index}
                    className={`p-3 text-center cursor-pointer rounded-lg transition-all duration-200
                      ${selectedCategory === cat.category_id 
                        ? 'bg-indigo-600 text-white shadow-md transform scale-105' 
                        : 'bg-indigo-100 text-indigo-700 hover:bg-indigo-200'}`}
                  >
                    {cat.name}
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {step === 3 && (
            <div className="space-y-4">
              <h2 className="text-lg font-medium text-gray-800 mb-4">Location Details</h2>
              
              <select 
                className="w-full bg-indigo-50 rounded-lg p-4 focus:outline-none focus:ring-2 focus:ring-indigo-300 transition-colors" 
                value={selectedCounty} 
                onChange={handleSelectChange}
              >
                <option value="">Select County</option>
                {counties.map((county) => (
                  <option key={county.code} value={county.name}>
                    {county.name}
                  </option>
                ))}
              </select>
              
              <select 
                className="w-full bg-indigo-50 rounded-lg p-4 focus:outline-none focus:ring-2 focus:ring-indigo-300 transition-colors" 
                value={selectedTown} 
                onChange={handleTownChange}
              >
                <option value="">Select City</option>
                {locations.length > 0 ? (
                  locations.map((loc) => (
                    <option key={loc.geonameId} value={loc.name}>
                      {loc.name}
                    </option>
                  ))
                ) : (
                  <option disabled>There are no cities in the selected county</option>
                )}
              </select>
              
              <input 
                className="w-full bg-indigo-50 rounded-lg p-4 focus:outline-none focus:ring-2 focus:ring-indigo-300 transition-colors" 
                value={serviceAddress} 
                onChange={(e) => setServiceAddress(e.target.value)} 
                required 
                placeholder="Address"
              />
              
              <input 
                className="w-full bg-indigo-50 rounded-lg p-4 focus:outline-none focus:ring-2 focus:ring-indigo-300 transition-colors" 
                value={servicePostal} 
                onChange={(e) => setServicePostal(e.target.value)} 
                required 
                placeholder="Postal Code"
              />
            </div>
          )}
          
          {step === 4 && (
            <div className="space-y-4">
              <h2 className="text-lg font-medium text-gray-800 mb-4">Availability & Working Hours</h2>
              
              <div>
                <label className="block text-gray-700 mb-2 ml-1">Start Time</label>
                <input 
                  className="w-full bg-indigo-50 rounded-lg p-4 focus:outline-none focus:ring-2 focus:ring-indigo-300 transition-colors" 
                  type='time' 
                  value={startTime} 
                  onChange={(e) => setStartTime(e.target.value)} 
                  required 
                />
              </div>
              
              <div>
                <label className="block text-gray-700 mb-2 ml-1">End Time</label>
                <input 
                  className="w-full bg-indigo-50 rounded-lg p-4 focus:outline-none focus:ring-2 focus:ring-indigo-300 transition-colors" 
                  type='time' 
                  value={endTime} 
                  onChange={(e) => setEndTime(e.target.value)} 
                  required
                />
              </div>
              
              <div>
                <label className="block text-gray-700 mb-2 ml-1">Available Days</label>
                <select 
                  className="w-full bg-indigo-50 rounded-lg p-4 focus:outline-none focus:ring-2 focus:ring-indigo-300 transition-colors" 
                  value={availableDays} 
                  onChange={(e) => setAvailableDays(e.target.value)} 
                  required
                >
                  <option value='Weekdays only'>Weekdays only</option>
                  <option value='Every day'>Every day</option>
                </select>
              </div>
            </div>
          )}
          
          {step === 5 && (
            <div className="space-y-4">
              <h2 className="text-lg font-medium text-gray-800 mb-4">Upload Service Image</h2>
              
              <div 
                className="border-2 border-dashed border-indigo-300 rounded-lg p-4 text-center hover:bg-indigo-50 transition-colors cursor-pointer"
                onClick={() => inputFileRef.current.click()}
              >
                {filePreview.length > 0 ? (
                  <div className="py-2 grid grid-cols-2 gap-4">
                    {filePreview.map((preview, idx) => (
                      <img
                        key={idx}
                        src={preview}
                        alt={`Preview ${idx + 1}`}
                        className="max-h-40 mx-auto rounded-lg"
                      />
                    ))}
                    <p className="text-sm col-span-2 text-indigo-600">Click to change images</p>
                  </div>
                ) : (
                  <div className="py-8">
                    <svg className="w-12 h-12 text-indigo-400 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                    </svg>
                    <p className="font-medium text-indigo-600">Click to upload image</p>
                    <p className="text-sm text-gray-500 mt-1">JPG, PNG, GIF or WEBP</p>
                  </div>
                )}
                <input 
                  className="hidden" 
                  type='file' 
                  multiple
                  ref={inputFileRef} 
                  onChange={handleFileChange}
                  accept="image/jpeg,image/png,image/gif,image/webp"
                />
              </div>
              
              <button 
                type='submit' 
                className='w-full bg-indigo-600 text-white px-4 py-3 rounded-lg hover:bg-indigo-700 transition-colors font-medium mt-4'
              >
                Submit
              </button>
            </div>
          )}
          
          <div className='flex justify-between mt-6'>
            {step > 1 && (
              <button 
                type='button' 
                onClick={() => setStep(step - 1)} 
                className='px-5 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors'
              >
                Back
              </button>
            )}
            {step < 5 && (
              <button 
                type='button' 
                onClick={() => setStep(step + 1)} 
                className={`px-5 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition-colors ${step === 1 ? 'ml-auto' : ''}`}
              >
                Next
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddService;