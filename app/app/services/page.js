'use client'
import ServiceCard from "@/components/ServiceCard";
import { useState } from "react";
import { useEffect } from "react";
import Navbar from "@/components/Navbar";
import Image from "next/image";
import Link from "next/link";
import Modal from "@/components/Modal";

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

    console.table(services);
  },[])

  return(
    <div className="px-4 md:px-8 mt-10 max-w-7xl mx-auto"> 
    <div className="px-4">Filter by</div>
    <div className="flex flex-col gap-6">
      {services.map((service) => (
        <div key={service.service_id} className="flex gap-6 border-b py-6">
          {/* Kép bal oldalon */}
          <div className="w-1/3 h-[250px]">
            <Link href={`services/${service.service_id}`}>
            <Image src={service.images[0]} width={400} height={300} alt={service.service_name} className="w-full h-full object-cover rounded-md"/>
            </Link>
          </div>

          
          {/* Információk jobbra */}
          <div className="w-2/3 pl-10">
            <h3 className="text-2xl font-semibold text-gray-600">{service.service_name}</h3>
            <p className="text-sm text-gray-500">{service.service_location} , {service.service_address}</p>
            <p className="text-gray-600 pt-10">{service.service_description}</p>
            
          </div>

          <div className="flex items-center">
            <p className="whitespace-nowrap">{`${service.service_price} RON`}</p>
            <div className="pl-4">
              <Modal service={service} />
            </div>
          </div>

        </div>
      ))}
    </div>
  </div>
  
   
    
  )
}

export default Services;