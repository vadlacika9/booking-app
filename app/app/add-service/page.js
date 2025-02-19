'use client'

import { useState, useRef, useEffect } from "react";
import Navbar from "@/components/Navbar";
import { useRouter } from 'next/navigation';
import { useSession } from "next-auth/react";


const AddService = () => {

  const {data: session, status} = useSession();
  const router = useRouter();
  const [serviceName, setServiceName] = useState('');
  const [serviceDesc, setServiceDesc] = useState('');
  const [servicePrice,setServicePrice] = useState(0);
  const [serviceCounty, setServiceCounty] = useState('');
  const [serviceCity, setServiceCity] = useState('');
  const [serviceAddress, setServiceAddress] = useState('');
  const [servicePostal,setServicePostal] = useState('');
  const [message, setMessage] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [availableDays, setAvailableDays] = useState('');
  
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/api/auth/signin');
    }
  }, [status, router]);
  

   const inputFileRef = useRef(null);
    const [blob, setBlob] = useState(null);

  async function handleSubmit(event){
    event.preventDefault();

    try{
      const file = inputFileRef.current.files[0];
      if (!file) throw new Error("No file selected.");

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
        body: JSON.stringify({ serviceName,serviceDesc,servicePrice,serviceCounty,serviceCity,serviceAddress,servicePostal,image: imageUrl,startTime,endTime, availableDays })
      });

      if(!response.ok){
        throw new Error('Failed to submit');
      }

      const data = await response.json();
        
      
      setMessage(data.message);
      
      router.push('/')
      
    }catch(error){
      console.log(error);
    }

    
  }



  return (
    
    <div className="flex items-center justify-center h-full bg-gray-100">
      <div className="bg-white shadow-md rounded px-8 py-6 mb-10 w-96 mt-20">
        <h1 className="text-2xl font-bold mb-6 text-center">Add Service</h1>
        <form  onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="service_name" className="block text-gray-700 text-sm font-bold mb-2">
              Service name
            </label>
            <input
              type="text"
              value={serviceName}
              id="service_name"
              onChange={(e) => setServiceName(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="service_description" className="block text-gray-700 text-sm font-bold mb-2">
              Service description
            </label>
            <input
              type="text"
              id="service_description"
              value={serviceDesc}
              onChange={(e) => setServiceDesc(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="service_price_per_hour" className="block text-gray-700 text-sm font-bold mb-2">
              Price
            </label>
            <input
              type="number"
              id="service_price_per_hour"
              value={servicePrice}
              onChange={(e) => setServicePrice(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="service_county" className="block text-gray-700 text-sm font-bold mb-2">
              County
            </label>
            <input
              type="text"
              id="service_county"
              value={serviceCounty}
              onChange={(e) => setServiceCounty(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="service_city" className="block text-gray-700 text-sm font-bold mb-2">
              City
            </label>
            <input
              type="text"
              id="service_city"
              value={serviceCity}
              onChange={(e) => setServiceCity(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            />
          </div>
          <div className="mb-6">
            <label htmlFor="service_address" className="block text-gray-700 text-sm font-bold mb-2">
              Service Address
            </label>
            <input
              type="text"
              id="service_address"
              value={serviceAddress}
              onChange={(e) => setServiceAddress(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            />
          </div>
          <div className="mb-6">
            <label htmlFor="service_postal_code" className="block text-gray-700 text-sm font-bold mb-2">
              Postal Code
            </label>
            <input
              type="text"
              id="service_postal_code"
              value={servicePostal}
              onChange={(e) => setServicePostal(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            />
          </div>
          <div className="mb-6">
          <label htmlFor="image" className="block text-gray-700 text-sm font-bold mb-2">
              Image
            </label>
          <input id="image" ref={inputFileRef} type="file" />
          </div>
          <div className="mb-6">
            <label htmlFor="service_start_time" className="block text-gray-700 text-sm font-bold mb-2">
              Start time
            </label>
            <input
              type="time"
              id="service_start_time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            />
          </div>
          <div className="mb-6">
            <label htmlFor="service_end_time" className="block text-gray-700 text-sm font-bold mb-2">
              End time
            </label>
            <input
              type="time"
              id="service_end_time"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            />
          </div>
          <div className="mb-6">
            <label htmlFor="days_available" className="block text-gray-700 text-sm font-bold mb-2">
              Available days
            </label>
            <input
              list='options'
              id="days_available"
              value={availableDays}
              onChange={(e) => setAvailableDays(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            />
          </div>
            <datalist id="options">
                <option value="Weekdays only"/>
                <option value="Every day"/>
              </datalist>
          <div className="flex items-center justify-between">
           
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Add Service
            </button>
          </div>
        </form>
        {message && <p>{message}</p>}
      </div>
    </div>
    
  
  )

}

export default AddService;