import Link from 'next/link';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import ServiceDetailsInfo from '@/components/ServiceDetailsInfo';
import Reviews from '@/components/Reviews';
import ReviewsForm from '@/components/ReviewsForm';
import Modal from '@/components/Modal';
import getServiceDetails from '@/components/GetServiceDetails';
import ImageCarousel from '@/components/ServiceImageCaroussel';

export default async function ServiceDetails({ params }) {
  const res = await params;
  const { id } = res;
  
  // Fetch service details and user session in parallel
  const [service, session] = await Promise.all([
    getServiceDetails(id),
    getServerSession(authOptions)
  ]);

  // Check if this service belongs to the logged-in user
  const isMyService = service?.user_id && session?.user?.id && service.user_id === session.user.id;
  
  // If no service found
  if (!service) {
    return (
      <div className="container max-w-7xl mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-bold text-gray-700">Service not found!</h2>
        <p className="mt-4 text-gray-600">The service you're looking for might have been removed or doesn't exist.</p>
        <Link href="/services" className="mt-6 inline-block px-6 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-700 transition">
          Back to Services
        </Link>
      </div>
    );
  }

  return (
    <div className="container max-w-7xl mx-auto px-4 md:px-8 py-10">
      {/* Service details section */}
      <div className="flex flex-col lg:flex-row items-start justify-between gap-8 relative">
        {/* Left side - Image Carousel */}
        <div className="w-full lg:w-1/2">
          {/* Itt használjuk a kliens oldali karusszel komponenst */}
          <ImageCarousel images={service.images} />
        </div>
        
        {/* Right side - Service Info */}
        <div className="w-full lg:w-1/2 px-0 lg:px-6 relative">
          <ServiceDetailsInfo service={service} />
          
          <div className="mt-8">
            <Modal service={service} />
          </div>
          
          {/* Edit button for service owner */}
          {isMyService && (
            <Link
              href={`/update-service?id=${id}`}
              className="absolute top-0 right-0 p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition"
              aria-label="Edit service"
            >
              <img src="/icons/pencil.svg" alt="Edit" width="20" height="20" />
            </Link>
          )}
        </div>
      </div>
      
      {/* Reviews section */}
      <div className="mt-16 w-full lg:w-3/4">
        <div className="border-t pt-8">
          <h2 className="font-bold text-gray-800 text-2xl mb-6">Reviews</h2>
          
          {/* Review form */}
          <div className="bg-gray-50 p-6 rounded-lg mb-8">
            <ReviewsForm id={id} />
          </div>
          
          {/* Existing reviews */}
          <div className="mt-10">
            <Reviews id={id} />
          </div>
        </div>
      </div>
    </div>
  );
}