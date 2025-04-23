'use client'

import { Clock, MapPin, Calendar, Phone, Mail } from "lucide-react";

const ServiceDetailsInfo = ({ service }) => {
  if (!service) {
    return (
      <div className="text-center p-4 bg-gray-50 rounded-lg">
        No service details available
      </div>
    );
  }

  console.log(service)
  return (
    <div className="space-y-6">
      {/* Service title and location */}
      <div>
        <h1 className="text-3xl font-bold text-gray-800">{service.service_name}</h1>
        
        <div className="flex items-center mt-2 text-gray-600">
          <MapPin size={16} className="mr-1" />
          <p className="text-sm">
            {service.service_location}, {service.service_address}
          </p>
        </div>
      </div>
      
      {/* Service description */}
      <div className="py-2">
        <h3 className="text-lg font-medium text-gray-700 mb-2">Description</h3>
        <p className="text-gray-700 leading-relaxed">
          {service.service_description}
        </p>
      </div>
      
      {/* Business hours and contact */}
      <div className="border-t pt-4">
        <h3 className="text-lg font-medium text-gray-700 mb-3">
          Business Hours & Contact Information
        </h3>
        
        <div className="space-y-2">
          <div className="flex items-center text-gray-700">
            <Calendar size={18} className="mr-2 text-gray-500" />
            <span className="font-medium mr-2">Available:</span>
            <span>{service.days_available}</span>
          </div>
          
          <div className="flex items-center text-gray-700">
            <Clock size={18} className="mr-2 text-gray-500" />
            <span className="font-medium mr-2">Hours:</span>
            <span>{service.duration_start_time} - {service.duration_end_time}</span>
          </div>
          
          {service.phone_number && (
            <div className="flex items-center text-gray-700">
              <Phone size={18} className="mr-2 text-gray-500" />
              <span className="font-medium mr-2">Phone:</span>
              <span>{service.phone_number}</span>
            </div>
          )}
          
          {service.email && (
            <div className="flex items-center text-gray-700">
              <Mail size={18} className="mr-2 text-gray-500" />
              <span className="font-medium mr-2">Email:</span>
              <span>{service.email}</span>
            </div>
          )}
        </div>
      </div>
      
      {/* Additional service details if available */}
      
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="grid grid-cols-2 gap-4">
            {service.service_price && (
              <div>
                <h4 className="text-sm font-medium text-gray-500">Price</h4>
                <p className="text-lg font-semibold">
                  {typeof service.service_price === 'number' ? service.service_price.toFixed(2) : service.service_price} RON
                </p>
              </div>
            )}
          </div>
        </div>
      
    </div>
  );
};

export default ServiceDetailsInfo;