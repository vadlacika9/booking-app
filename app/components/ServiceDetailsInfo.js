'use client'

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";

const ServiceDetailsInfo = ({ service }) => {


  const [loading, setLoading] = useState(true);

  const { data: session, status } = useSession();

  

  //if (loading) return <div>Loading...</div>;
  
  if (!service) return <div>No service details available</div>;

  return (
    <div>
      <div className="rounded-lg shadow-lg w-[170px]">
        <h2 className="text-black pt-3"> {service.name}</h2>
        <p className="text-black pt-3">About us</p>
        <p className="pt-3">{service.description}</p>
        <p className="pt-3">Location: {service.location.city}</p>
        {/* Itt adhatod hozzá a többi kulcsot az objektumból */}
      </div>
    </div>
  );
}

export default ServiceDetailsInfo;