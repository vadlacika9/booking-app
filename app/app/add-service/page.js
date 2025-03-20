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
  const [blob, setBlob] = useState(null);
  const [error, setError] = useState(null);
  const [locations, setLocations] = useState([]);
  const [selectedCounty, setSelectedCounty] = useState('');
    const [selectedTown, setSelectedTown] = useState('');

  useEffect(() => { //checking if the user is authenticated
    if (status === 'unauthenticated') {
      router.push('/api/auth/signin');
    }
  }, [status, router]);
  

  useEffect(() => { //fetching categories
    const getCategories = async () => {
      try{
        const fetchCategories = await fetch('/api/get-categories');
        const response = await fetchCategories.json();
        setCategories(response);
      }catch(error){
        console.log(error);
      }
    }

    getCategories()

    
  },[session])

  const handleSelectChange = (event) => {
    const countyCode = event.target.value;
    console.log(countyCode)
    setServiceCounty(countyCode)
    setSelectedCounty(countyCode);
    // after select calling the getTownsInCounty function
    if (countyCode) {
      getTownsInCounty(countyCode);
    } else {
      setLocations([]);  // If no towns in tha county the Locations are []
    }
  };

  const handleTownChange = (event) => {
    setSelectedTown(event.target.value);
    setServiceCity(event.target.value) // updating the selected city
  };

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

  async function handleSubmit(event){
    event.preventDefault();

    try{
      const file = inputFileRef.current.files[0];
      if (!file) throw new Error("No file selected.");

      if(file){
        const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
        if (!allowedTypes.includes(file.type)) {
          setError("❌ Invalid file type. Please upload an image (JPG, PNG, GIF, WEBP).");
          return;
      }
    }
      const responseImage = await fetch(
        `/api/upload?filename=${file.name}`,
        {
          method: 'POST',
          body: file,
        },
      );
      if (!responseImage.ok) {
        throw new Error("Image upload failed.");
      }

      const uploadedImage = await responseImage.json();
      
      const imageUrl =  uploadedImage.url;
      
      const response = await fetch('api/add-service',{
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ serviceName,serviceDesc,servicePrice,serviceCounty,serviceCity,serviceAddress,servicePostal,image: imageUrl,startTime,endTime, availableDays, phoneNumber, selectedCategory })
      });

      if(!response.ok){
        throw new Error('Failed to submit');
      }

      const data = await response.json();
        
      
      setMessage(data.message);
      
      router.push('/')
      
    }catch(error){
      setError(error)
    }

    
  }



  return (
    <div className='flex items-center justify-center h-full bg-gray-100'>
      <div className='bg-white shadow-md rounded-3xl px-8 py-6 mb-10 w-96 mt-20'>
        <h1 className='text-2xl font-bold mb-6 text-center'>Service details</h1>
        <form onSubmit={handleSubmit}>
          {step === 1 && (
            <div className="flex flex-col">
              <h1 className="p-4 font-bold text-lg">Basic informations</h1>
              
              <input className="bg-indigo-50 rounded-full p-4 mb-4" value={serviceName} onChange={(e) => setServiceName(e.target.value)} required placeholder="Service name"/>
             
              <input className="bg-indigo-50 rounded-full p-4 mb-4" value={serviceDesc} onChange={(e) => setServiceDesc(e.target.value)} required placeholder="Description"/>

              <input className="bg-indigo-50 rounded-full p-4 mb-4" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} required placeholder="Phone Number"/>
             
              <input className="bg-indigo-50 rounded-full p-4 mb-4" type='number' value={servicePrice} onChange={(e) => setServicePrice(e.target.value)} required placeholder="Price/hour"/>

            </div>
          )}
          {step ===2 && (
            <div>
            <h1 className="p-4 font-bold text-lg">Category</h1>
            <div className="grid grid-cols-3 gap-4">
            {categories.map((cat, index) => (
              <div
                onClick={() => setSelectedCategory(cat.category_id)}
                key={index}
                className={`p-4 text-center cursor-pointer rounded-full flex justify-center items-center
                  ${selectedCategory === cat.category_id ? 'bg-indigo-600 text-white' : 'bg-indigo-300 text-white'}`}
              >
                {cat.name}
              </div>
            ))}
          </div>
          </div>
          )}
          {step === 3 && (
            <div className="flex flex-col">
              <h1 className="p-4 font-bold text-lg">Location</h1>
              <select className="bg-indigo-50 rounded-full p-4 mb-4" value={selectedCounty} onChange={handleSelectChange}>
        <option value="">County</option>
        {counties.map((county) => (
          <option key={county.code} value={county.name}>
            {county.name}
          </option>
        ))}
      </select>
      <select className="bg-indigo-50 rounded-full p-4 mb-4" value={selectedTown} onChange={handleTownChange}>
        <option >City</option>
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
              <input className="bg-indigo-50 rounded-full p-4 mb-4" value={serviceAddress} onChange={(e) => setServiceAddress(e.target.value)} required placeholder="Address"/>
              <input className="bg-indigo-50 rounded-full p-4 mb-4" value={servicePostal} onChange={(e) => setServicePostal(e.target.value)} required placeholder="Postal Code"/>
            </div>
          )}
          {step === 4 && (
            <div className="flex flex-col">
              <h1 className="p-4 font-bold text-lg">Availability & Working Hours</h1>
              <label className="pl-4">Start Time</label>
              <input className="bg-indigo-50 rounded-full p-4 mb-4" type='time' value={startTime} onChange={(e) => setStartTime(e.target.value)} required />
              <label className="pl-4" >End Time</label>
              <input className="bg-indigo-50 rounded-full p-4 mb-4" type='time' value={endTime} onChange={(e) => setEndTime(e.target.value)} required/>
              <select className='bg-indigo-50 rounded-full p-4 mb-4' value={availableDays} onChange={(e) => setAvailableDays(e.target.value)} required placeholder="Available days">
                <option value='Weekdays only'>Weekdays only</option>
                <option value='Every day'>Every day</option>
              </select>
            </div>
          )}
          {step === 5 && (
            <div className="flex flex-col">
              <h1 className="p-4 font-bold text-lg">Image for your service</h1>
              <input className="bg-indigo-50 rounded-full p-4 mb-4" type='file' ref={inputFileRef} />
              <button type='submit' className='bg-indigo-500 text-white px-4 py-2 rounded'>Submit</button>
            </div>
          )}
          <div className='flex justify-between mt-4'>
            {step > 1 && (
              <button type='button' onClick={() => setStep(step - 1)} className='bg-gray-500 text-white px-4 py-2 rounded'>Back</button>
            )}
            {step < 5 && (
              <button type='button' onClick={() => setStep(step + 1)} className='bg-indigo-500 text-white px-4 py-2 rounded'>Next</button>
            )}
          </div>
        </form>
        {message && <p>{message}</p>}
        {error && <p className="text-red-500 mt-2 text-center">{error}</p>}
      </div>
      
    </div>
  );

}

export default AddService;