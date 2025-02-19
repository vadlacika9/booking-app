'use client'
import ServiceCard from "@/components/ServiceCard";
import { useState } from "react";
import { useEffect } from "react";
import Navbar from "@/components/Navbar";

const Services = () => {

  const [services,setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchServices = async () => {
      try{
        const getServices = await fetch('api/services');
        if(!getServices){
          throw new Error('cannot get services!');
        }
  
        const data = await getServices.json();
        setServices(data);
      }catch(error){
        console.log(error);
      }finally{
        setLoading(false);
      }
    }
    fetchServices();
  },[])

  return(
    <div className="py-4"> 
    
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {services.map((service) => (
          <ServiceCard
            key={service.service_id}
            id={service.service_id}
            name={service.name}
            desc={service.description}
            price={service.price}
            image={service.images[0]}
            location={service.location}

          />
        ))}
        
      </div>
    </div>
    
  )
}

export default Services;