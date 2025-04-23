'use client'

import { useState, useEffect } from "react";
import ServiceCard from "./ServiceCard";
import Link from "next/link";
import Image from "next/image";
import Loading from "./Loading";
import ConfirmDialog from "./ConfirmDialog";

export default function MyServices() {
  const [myServices, setMyServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [serviceToDelete, setServiceToDelete] = useState(null);

  const openDeleteDialog = (service_id, location_id, duration_id, image_id) => {
    setServiceToDelete({ service_id, location_id, duration_id, image_id });
    setIsDeleteDialogOpen(true);
  };

  const closeDeleteDialog = () => {
    setIsDeleteDialogOpen(false);
    setServiceToDelete(null);
  };

  const confirmDelete = async () => {
    if (!serviceToDelete) return;
    
    try {
      setLoading(true);
      
      const response = await fetch(`/api/delete-service/${serviceToDelete.service_id}`, {
        method: "DELETE",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          service_id: serviceToDelete.service_id,
          location_id: serviceToDelete.location_id,
          duration_id: serviceToDelete.duration_id,
          image_id: serviceToDelete.image_id,
        }),
      });
      
      if (response.ok) {
        const data = await response.json();
        setSuccessMessage(data.message);
        
        // Remove the deleted service from the state instead of reloading the page
        setMyServices(prevServices => 
          prevServices.filter(service => service.service_id !== serviceToDelete.service_id)
        );
        
        // Clear success message after 3 seconds
        setTimeout(() => {
          setSuccessMessage(null);
        }, 3000);
      } else {
        const errorData = await response.json();
        setError(`Failed to delete service: ${errorData.error}`);
        
        // Clear error message after 3 seconds
        setTimeout(() => {
          setError(null);
        }, 3000);
      }
    } catch (error) {
      console.error("Error deleting service:", error);
      setError("Error deleting service");
      
      // Clear error message after 3 seconds
      setTimeout(() => {
        setError(null);
      }, 3000);
    } finally {
      setLoading(false);
      closeDeleteDialog();
    }
  };

  useEffect(() => {
    const fetchMyServices = async () => {
      try {
        const getMyServices = await fetch('api/myServices');
        if (!getMyServices.ok) {
          throw new Error('Cannot get my services!');
        }
        
        const data = await getMyServices.json();
        setMyServices(data);
      } catch (error) {
        setError(error.message || "Failed to fetch services");
      } finally {
        setLoading(false);
      }
    };
    
    fetchMyServices();
  }, []);

  if (loading && myServices.length === 0) {
    return <Loading />;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-10 bg-gray-50 min-h-screen">
      {/* Delete Confirmation Dialog */}
      {isDeleteDialogOpen && (
        <ConfirmDialog
          title="Delete Service"
          message="Are you sure you want to delete this service? This action cannot be undone."
          onClose={closeDeleteDialog}
          handle={confirmDelete}
        />
      )}

      <div className="bg-white p-6 rounded-2xl shadow-lg mb-8">
        <div className="flex justify-between items-center mb-8 border-b border-gray-100 pb-4">
          <h1 className="font-bold text-gray-800 text-3xl">My Services</h1>
          <Link 
            href="/add-service" 
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition duration-300 flex items-center shadow-sm hover:shadow"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            Add New Service
          </Link>
        </div>

        {/* Status messages */}
        {successMessage && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-700 rounded-xl flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            {successMessage}
          </div>
        )}

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            {error}
          </div>
        )}

        {myServices.length === 0 ? (
          <div className="text-center py-16 bg-gray-50 rounded-xl border border-gray-200">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
            <h3 className="text-xl font-medium text-gray-700 mb-2">No Services Added Yet</h3>
            <p className="text-gray-500 mb-6">Start by adding your first service to display here</p>
            <Link href="/add-service" className="inline-flex items-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition duration-300 shadow-sm hover:shadow">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
              Add Your First Service
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {myServices.map((service) => (
              <div 
                key={service.service_id} 
                className="border border-gray-200 hover:border-indigo-200 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden bg-white flex flex-col"
              >
                <div className="flex-grow">
                  <ServiceCard
                    id={service.service_id}
                    name={service.service_name}
                    desc={service.description}
                    price={service.price}
                    image={service.images?.images[0]}
                    location={service.location}
                  />
                </div>
                
                <div className="border-t border-gray-100 mt-2 bg-gray-50 px-4 py-3">
                  <div className="flex justify-center items-center gap-5">
                    <button 
                      onClick={() => openDeleteDialog(
                        service.service_id, 
                        service.location.location_id, 
                        service.duration_id, 
                        service.images.image_id
                      )}
                      className="flex items-center text-red-600 hover:text-red-800 transition px-3 py-1 rounded-md hover:bg-red-50"
                      title="Delete service"
                    >
                      <Image 
                        src="/icons/trash.svg" 
                        alt="Delete" 
                        width={20} 
                        height={20} 
                        className="mr-1" 
                      />
                      <span className="text-sm font-medium">Delete</span>
                    </button>
                    
                    <Link 
                      href={`/update-service?id=${service.service_id}`}
                      className="flex items-center text-amber-600 hover:text-amber-800 transition px-3 py-1 rounded-md hover:bg-amber-50"
                      title="Edit service"
                    >
                      <Image 
                        src="/icons/pencil.svg" 
                        alt="Edit" 
                        width={20} 
                        height={20} 
                        className="mr-1" 
                      />
                      <span className="text-sm font-medium">Edit</span>
                    </Link>
                    
                    <Link 
                      href={`/bookings/${service.service_id}?name=${service.service_name}`}
                      className="flex items-center text-indigo-600 hover:text-indigo-800 transition px-3 py-1 rounded-md hover:bg-indigo-50"
                      title="View bookings"
                    >
                      <Image 
                        src="/icons/calendar.svg" 
                        alt="Bookings" 
                        width={20} 
                        height={20} 
                        className="mr-1" 
                      />
                      <span className="text-sm font-medium">Bookings</span>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}