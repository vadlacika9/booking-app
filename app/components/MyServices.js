'use client'

import { useState, useEffect } from "react"
import ServiceCard from "./ServiceCard";
import Link from "next/link";

export default function MyServices(){
  const [myServices, setMyServices] = useState([]);
  const [loading, setLoading] = useState(true);

  
  const handleDelete = async (service_id, location_id, duration_id, image_id) => {
    if (!confirm("Are you sure you want to delete this service?")) return;
  
    try {
      // A body JSON formátumban
      const response = await fetch(`/api/delete-service/${service_id}`, {
        method: "DELETE",
        headers: {
          'Content-Type': 'application/json', // Jelzi, hogy JSON adatot küldünk
        },
        body: JSON.stringify({
          service_id: service_id,
          location_id: location_id,
          duration_id: duration_id,
          image_id: image_id,
        }),
      });
  
      if (response.ok) {
        const data = await response.json();
        alert(data.message);  // Display the success message
        window.location.href = "/services"; // Redirect after deletion
      } else {
        const errorData = await response.json();
        alert(`Failed to delete service: ${errorData.error}`);
      }
    } catch (error) {
      console.error("Error deleting service:", error);
      alert("Error deleting service");
    }
  };
  
  

  console.log(myServices)
  useEffect(() => {
    const fetchMyServices = async () => {
      try{
        const getMyServices = await fetch('api/myServices');
        if(!getMyServices){
          throw new Error('cannot get my services!');
        }
  
        const data = await getMyServices.json();
        setMyServices(data);
      }catch(error){
        console.log(error);
      }finally{
        setLoading(false);
      }
    }

    fetchMyServices();
  },[])

  if(loading){
    return (
      <div>
        <p>Loading...</p>
      </div>
    )
  }

    console.log(myServices)
  return(
    <div>
      <p className="pl-10 font-semibold text-gray-800 text-3xl ">My Services</p>
      <div className="p-4"> 
            <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
            {myServices.length > 0 && myServices.map((service) => (
  <div key={service.service_id} className="border-2 p-4 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 mb-4 flex flex-col">
    <ServiceCard
      id={service.service_id}
      key={service.service_id}
      name={service.service_name}
      desc={service.description}
      price={service.price}
      image={service.images?.images[0]}
      location={service.location}
    />

    <div className="flex-grow"> {/* Ezzel biztosítjuk, hogy a többi elem a kártya alján legyen, és a kártyák egységes magasságúak maradjanak */}
    </div>

    <div className="flex justify-center items-center gap-4 mt-4">
      <div className="text-white hover:text-gray-300 flex items-center space-x-2 cursor-pointer">
        <img src="/icons/trash.svg" alt="Trash Icon" width="25" height="25" onClick={() => handleDelete(service.service_id, service.location.location_id, service.duration_id, service.images.image_id)} />
      </div>
      <Link href={`/update-service?id=${service.service_id}`} className="text-white hover:text-gray-300 flex items-center space-x-2">
        <img src="/icons/pencil.svg" alt="Edit Icon" width="25" height="25" />
      </Link>
      <Link href={`/bookings/${service.service_id}?name=${service.service_name}`} className="text-white hover:text-gray-300 flex items-center space-x-2">
        <img src="/icons/calendar.svg" alt="Calendar Icon" width="25" height="25" />
      </Link>
    </div>
  </div>
))}

              
            </div>
          </div>
    </div>
  )
}