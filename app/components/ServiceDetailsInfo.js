'use client'

const ServiceDetailsInfo = ({ service }) => {
  
  if (!service) return <div>No service details available</div>;

  return (
    <div className="container">
      <div className="">
        <h2 className="text-gray-700  font-bold text-3xl"> {service.service_name}</h2>
        <p className="pt-1 text-sm text-gray-700">{service.service_location}, {service.service_address}</p>
      </div>

      <div className="pt-10">
        <h3 className="font-bold text-gray-700">Contact & Business hours</h3>
        <div>{service.days_available}, {service.duration_start_time} - {service.duration_end_time}</div>
      </div>
    </div>
  );
}

export default ServiceDetailsInfo;