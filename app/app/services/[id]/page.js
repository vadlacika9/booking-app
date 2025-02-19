'use client';

import { useParams } from 'next/navigation';
import ServiceDetailsInfo from '@/components/ServiceDetailsInfo';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import Modal from '@/components/Modal';
import Link from 'next/link';

const ServiceDetails = () => {
  const { id } = useParams(); 
  const { data: session, status } = useSession();
  const [isMyService, setIsMyService] = useState(false)
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

  useEffect(() => {
    if (service?.user_id && session?.user?.id) {
      if (service.user_id === session.user.id) {
        setIsMyService(true);
        console.log('Service belongs to the current user', service.user_id);
      }
    }
  }, [service, session]);
  
  
  if (loading) {
    return <div>Loading...</div>;
  }

  if (!service) {
    return <div>Service not found!</div>;
  }

  // Ellenőrizzük, hogy a `service.images` létezik-e és nem üres
  const imageUrl = service.images;

  return (
    <div className="container max-w-7xl mx-auto px-4 md:px-8 pt-10">
  <div className="flex items-center justify-between gap-4 relative"> {/* Add relative positioning to the parent */}
    
    {/* Bal oldali kép */}
    <div className="flex-2 flex items-center justify-center relative w-[750px] h-[500px]">
      <Image
        src={imageUrl}
        layout="fill"
        alt="service picture"
        objectFit="cover"
        className="rounded-lg shadow-lg"
      />
    </div>
    
    {/* Jobb oldali információs panel */}
    <div className="flex-1 px-10">
      <ServiceDetailsInfo service={service} />
      <div className="pt-10">
        <Modal service={service} />
      </div>
    </div>
    
    {/* Last element (icon) positioned in the top-right corner */}
    <div className="absolute top-0 right-0 p-4"> {/* Use absolute positioning */}
      {isMyService && (
        <div>
          <Link href={`/update-service?id=${id}`} className="">
            <img src="/icons/pencil.svg" alt="User Icon" width="25" height="25" />
          </Link>
        </div>
      )}
    </div>
  </div>
  <div className="reviews pt-10">
    <h2 className="font-bold text-gray-700 text-2xl">Reviews</h2>
    <div>There are no reviews</div>
  </div>
</div>

  );
};

export default ServiceDetails;
