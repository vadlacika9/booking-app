'use client'
import { useState, useEffect } from "react";
import Loading from "./Loading";

export default function MyAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [showAvailable, setShowAvailable] = useState(false);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const appointmentsPerPage = 10;

  const availableAppointments = () => {
    const now = new Date();
    const today = now.toISOString().split("T")[0];
    
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();
    
    return appointments.filter((app) => {
      const [startHour, startMinute] = app.booking_start_time.split(":").map(Number);
      return (
        app.booking_day > today || 
        (app.booking_day === today && (startHour > currentHour || (startHour === currentHour && startMinute > currentMinute)))
      );
    }).sort((a, b) => {
      return new Date(a.booking_day) - new Date(b.booking_day);
    });
  };
  
  const allAppointments = showAvailable ? availableAppointments() : appointments;
  
  // Calculate pagination
  const indexOfLastAppointment = currentPage * appointmentsPerPage;
  const indexOfFirstAppointment = indexOfLastAppointment - appointmentsPerPage;
  const displayedAppointments = allAppointments.slice(indexOfFirstAppointment, indexOfLastAppointment);
  const totalPages = Math.ceil(allAppointments.length / appointmentsPerPage);

  // Page navigation
  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  
  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };
  
  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const getAppointments = await fetch('api/get-my-bookings');
        if (!getAppointments) {
          throw new Error('cannot get my appointments!');
        }
        
        const data = await getAppointments.json();
        setAppointments(data);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchAppointments();
  }, []);

  // Reset to first page when filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [showAvailable]);

  if (loading) {
    return <Loading/>
  }

  // Format date to be more readable
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const formatTime = (timeString) => {
    const [hours, minutes] = timeString.split(':');
    return `${hours}:${minutes}`;
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h1 className="font-semibold text-gray-800 text-3xl mb-8">My Appointments</h1>
      
      <div className="mb-8">
        <div className="flex justify-center items-center max-w-md mx-auto rounded-lg overflow-hidden border border-gray-300">
          <button
            onClick={() => setShowAvailable(false)}
            className={`flex-1 py-3 px-4 text-center font-medium transition-all duration-300 ${!showAvailable ? 'bg-indigo-500 text-white' : 'hover:bg-indigo-100'}`}
          >
            All appointments
          </button>
          <div className="h-10 border-l border-gray-300"></div>
          <button
            onClick={() => setShowAvailable(true)}
            className={`flex-1 py-3 px-4 text-center font-medium transition-all duration-300 ${showAvailable ? 'bg-indigo-500 text-white' : 'hover:bg-indigo-100'}`}
          >
            Available appointments
          </button>
        </div>
      </div>

      {/* Showing results summary */}
      <div className="text-sm text-gray-500 mb-4">
        Showing {indexOfFirstAppointment + 1}-{Math.min(indexOfLastAppointment, allAppointments.length)} of {allAppointments.length} appointments
      </div>

      {/* Table section */}
      {displayedAppointments.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200 rounded-lg overflow-hidden">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 border-b border-gray-200 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Service</th>
                <th className="px-6 py-3 border-b border-gray-200 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                <th className="px-6 py-3 border-b border-gray-200 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 border-b border-gray-200 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {displayedAppointments.map((app, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{app.service_name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{app.service_location}, {app.service_address}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatDate(app.booking_day)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatTime(app.booking_start_time)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center py-10 bg-gray-50 rounded-lg">
          <p className="text-gray-500">There are no appointments...</p>
        </div>
      )}
      
      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-6 px-4">
          <button 
            onClick={prevPage} 
            disabled={currentPage === 1}
            className={`px-4 py-2 border rounded-md ${currentPage === 1 ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white hover:bg-gray-50 text-gray-700'}`}
          >
            Previous
          </button>
          
          <div className="flex items-center space-x-2">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((number) => (
              <button
                key={number}
                onClick={() => paginate(number)}
                className={`w-8 h-8 flex items-center justify-center rounded-full ${
                  currentPage === number ? 'bg-indigo-500 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                {number}
              </button>
            ))}
          </div>
          
          <button 
            onClick={nextPage} 
            disabled={currentPage === totalPages}
            className={`px-4 py-2 border rounded-md ${currentPage === totalPages ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white hover:bg-gray-50 text-gray-700'}`}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}