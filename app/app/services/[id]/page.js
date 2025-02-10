'use client';

import { useParams } from 'next/navigation';
import ServiceDetailsInfo from '@/components/ServiceDetailsInfo';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import Modal from '@/components/Modal';

const ServiceDetails = () => {
  const { id } = useParams(); // Az URL-ből kinyerjük az `id`-t
  const { data: session, status } = useSession();
  
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchService = async () => {
      try {
        const getService = await fetch(`/api/services/${id}`);
        if (!getService.ok) {
          throw new Error('Cannot get service!');
        }

        const data = await getService.json();
        setService(data);
      } catch (error) {
        console.error('Error fetching service:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchService();
  }, [id]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!service) {
    return <div>Service not found!</div>;
  }

  // Ellenőrizd, hogy van-e kép, és csak akkor próbálj hozzáférni, ha létezik
  const imageUrl = service.images[0];
  
  return (
    <div className="container mx-auto mt-16">
      <div className="flex gap-4">
        {/* Bal oldali elem */}
        <div className="flex-2 flex items-center justify-center ml-40 relative w-[750px] h-[500px]">
      <Image
        src={imageUrl}
        layout="fill"
        alt="service picture"
        objectFit="cover"
        className="rounded-lg shadow-lg"
      />
    </div>
        {/* Jobb oldali elem */}
        <div className="flex-1 p-10 pl-16">
          <ServiceDetailsInfo service={service} />
          <div>
            <Modal service={service}/>
          </div>
        </div>
        
          
        
      </div>
    </div>
  );
};

export default ServiceDetails;