'use client';

import { useParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Loading from '@/components/Loading';

const Bookings = () => {
  const [bookings, setBookings] = useState(null);
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAvailable, setShowAvailable] = useState(false);
  const { id } = useParams();
  const searchParams = useSearchParams();
  const name = searchParams.get('name'); 
  const { data: session, status } = useSession();
  
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const bookingsPerPage = 10;

  // Fetching bookings
  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await fetch(`/api/service-bookings/${id}`);
        if (!response.ok) {
          throw new Error('There are no bookings for this service!');
        }
        const data = await response.json();
        setBookings(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();

    const fetchService = async () => {
      try {
        const response = await fetch(`/api/services/${id}`);
        if (!response.ok) {
          throw new Error("There is no service with that id!")
        }
        const data = await response.json();
        setService(data)
      } catch (error) {
        setError(error.message)
      } finally {
        setLoading(false)
      }
    }
    if (id) {
      fetchService();
    }
  }, [id]);

  // Reset pagination when toggling between all and available bookings
  useEffect(() => {
    setCurrentPage(1);
  }, [showAvailable]);

  // Filtering and sorting the bookings
  const validBookings = bookings
    ? bookings
        .filter(booking => {
          const now = new Date();
          const currentDate = now.toISOString().split('T')[0]; // YYYY-MM-DD format
          const currentTime = now.getHours() * 60 + now.getMinutes(); // time converted to minutes

          const bookingDate = booking.booking_day;
          const [hours, minutes] = booking.booking_start_time.split(':').map(Number);
          const bookingTime = hours * 60 + minutes; // time converted to minutes

          return bookingDate > currentDate || (bookingDate === currentDate && bookingTime >= currentTime);
        })
        .sort((a, b) => {
          if (a.booking_day !== b.booking_day) {
            return a.booking_day.localeCompare(b.booking_day);
          }
          const [aHours, aMinutes] = a.booking_start_time.split(':').map(Number);
          const [bHours, bMinutes] = b.booking_start_time.split(':').map(Number);
          return aHours * 60 + aMinutes - (bHours * 60 + bMinutes);
        })
    : [];

  // Deciding what to display, all bookings or only valid bookings
  const allBookings = bookings || [];
  const displayedBookings = showAvailable ? validBookings : allBookings;

  // Calculate total revenue
  const calculateTotalRevenue = () => {
    if (!bookings || bookings.length === 0) return 0;
      return bookings.reduce((total, booking) => total + (Number(booking.price) || 0), 0);
  };

  // Pagination logic
  const indexOfLastBooking = currentPage * bookingsPerPage;
  const indexOfFirstBooking = indexOfLastBooking - bookingsPerPage;
  const currentBookings = displayedBookings.slice(indexOfFirstBooking, indexOfLastBooking);
  const totalPages = Math.ceil(displayedBookings.length / bookingsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Loading states
  if (loading || status === 'loading') {
    return <Loading />
  }

  if (error) {
    return <div className="text-center text-red-500 font-semibold mt-4">{error}</div>;
  }

  if (!session || !session.user) {
    return <div className="text-center p-8 bg-red-50 rounded-lg shadow-md mt-10">
      <h3 className="text-xl font-semibold text-red-600">Authentication Required</h3>
      <p className="mt-2 text-gray-700">You need to be logged in to view this page.</p>
    </div>;
  }
  
  if (!service) {
    return <div className="text-center p-4">Loading service data...</div>;
  }
  
  if (service && session && session.user && Number(service.user_id) !== Number(session.user.id)) {
    return <div className="text-center p-8 bg-red-50 rounded-lg shadow-md mt-10">
      <h3 className="text-xl font-semibold text-red-600">Access Denied</h3>
      <p className="mt-2 text-gray-700">You don&apos;t have permission to access this page.</p>
    </div>;
  }

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const formatTime = (timeString) => {
    const [hours, minutes] = timeString.split(':');
    return `${hours}:${minutes}`;
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-8 bg-gradient-to-r from-indigo-600 to-purple-600 p-6 rounded-lg shadow-lg text-white">
        <h2 className="text-3xl font-bold text-center mb-2">{name}</h2>
        <p className="text-center text-indigo-100">Booking Management</p>
      </div>
      
      {/* Revenue Statistics Card */}
      <div className="bg-white rounded-lg p-6 mb-8 shadow-md border border-indigo-200">
        <div className="flex flex-col items-center md:flex-row md:justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-800">Total Revenue</h3>
            <p className="text-sm text-gray-500">From completed bookings</p>
          </div>
          <div className="mt-3 md:mt-0">
            <p className="text-3xl font-bold text-green-600">{calculateTotalRevenue()} RON</p>
          </div>
        </div>
      </div>
      
      {/* Filter Controls */}
      <div className="flex justify-center mb-8">
        <div className="bg-white rounded-full shadow-md inline-flex">
          <button 
            onClick={() => setShowAvailable(false)} 
            className={`px-6 py-3 rounded-l-full transition-all duration-300 ${!showAvailable ? 'bg-indigo-600 text-white' : 'hover:bg-indigo-100'}`}
          >
            All Bookings ({allBookings.length})
          </button>
          <button 
            onClick={() => setShowAvailable(true)} 
            className={`px-6 py-3 rounded-r-full transition-all duration-300 ${showAvailable ? 'bg-indigo-600 text-white' : 'hover:bg-indigo-100'}`}
          >
            Available Bookings ({validBookings.length})
          </button>
        </div>
      </div>
      
      {/* Bookings Table */}
      {displayedBookings.length > 0 ? (
        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-indigo-100 text-indigo-800">
                  <th className="p-4 text-left">Booking Day</th>
                  <th className="p-4 text-left">Time</th>
                  <th className="p-4 text-left">Client</th>
                </tr>
              </thead>
              <tbody>
                {currentBookings.map((booking, index) => (
                  <tr 
                    key={booking.booking_id} 
                    className={`border-t border-gray-200 hover:bg-indigo-50 transition-colors ${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}`}
                  >
                    <td className="p-4">{formatDate(booking.booking_day)}</td>
                    <td className="p-4">{formatTime(booking.booking_start_time)}</td>
                    <td className="p-4">{booking.first_name} {booking.last_name}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="bg-gray-50 px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
              <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-gray-700">
                    Showing <span className="font-medium">{indexOfFirstBooking + 1}</span> to{' '}
                    <span className="font-medium">
                      {Math.min(indexOfLastBooking, displayedBookings.length)}
                    </span>{' '}
                    of <span className="font-medium">{displayedBookings.length}</span> bookings
                  </p>
                </div>
                <div>
                  <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                    <button
                      onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                      disabled={currentPage === 1}
                      className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium ${
                        currentPage === 1 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-500 hover:bg-gray-50'
                      }`}
                    >
                      Previous
                    </button>
                    
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(number => (
                      <button
                        key={number}
                        onClick={() => paginate(number)}
                        className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                          currentPage === number
                            ? 'z-10 bg-indigo-50 border-indigo-500 text-indigo-600'
                            : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                        }`}
                      >
                        {number}
                      </button>
                    ))}
                    
                    <button
                      onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                      disabled={currentPage === totalPages}
                      className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium ${
                        currentPage === totalPages ? 'text-gray-300 cursor-not-allowed' : 'text-gray-500 hover:bg-gray-50'
                      }`}
                    >
                      Next
                    </button>
                  </nav>
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="bg-white rounded-lg p-8 text-center shadow-md">
          <p className="text-gray-500">No bookings available.</p>
        </div>
      )}
    </div>
  );
};

export default Bookings;