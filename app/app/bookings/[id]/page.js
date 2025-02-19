'use client';

import { useParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { useSession } from 'next-auth/react';

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

 


  //fetching bookings
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
      try{
        const response = await fetch(`/api/services/${id}`);
        if(!response.ok){
          throw new Error("There are no service with that id!")
        }
        const data = await response.json();
        setService(data)
      }catch(error){
        setError(error.message)
      }finally {
        setLoading(false)
      }
    }
    if(id){fetchService();}
  }, [id]);

  


  //filtering and sorting the bookings, only available bookings is what we need
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

    //deciding what to display, all bookings or only valid bookings
    const displayedBookings = showAvailable ? validBookings : bookings || [];


  if (loading) {
    return <div className="text-center text-lg font-semibold mt-4">Loading...</div>;
  }

  if (status === 'loading') {
    return <div>Loading...</div>; // Tükrözi, ha a session adat még töltődik
  }

  if (error) {
    return <div className="text-center text-red-500 font-semibold mt-4">{error}</div>;
  }

  if (!session || !session.user) {
    return <div>You need to be logged in.</div>;
  }
  
  if (!service) {
    return <div>Loading service data...</div>;
  }

  
  if (service && session && session.user && Number(service.user_id) !== Number(session.user.id)) {
    return <div>You don't have access to be here</div>;
  }
  
  console.log(session.user.id)

  return (
    
    <div className="max-w-4xl mx-auto p-6">
      
      
      <h2 className="text-2xl font-bold text-center mb-6">Bookings for {name}</h2>
      <div className="flex justify-center items-center gap-4 rounded-lg border-2 border-black px-4 mb-10">
        <button 
          onClick={() => setShowAvailable(false)} 
          className={`flex-1 p-2 text-center transition-all duration-300 ${!showAvailable ? 'bg-gray-400 text-white' : 'hover:bg-gray-200'}`}
        >
          All bookings
        </button>
        <div className="h-8 border-l-2 border-gray-900"></div>
        <button 
          onClick={() => setShowAvailable(true)} 
          className={`flex-1 p-2 text-center transition-all duration-300 ${showAvailable ? 'bg-gray-400 text-white' : 'hover:bg-gray-200'}`}
        >
          Available bookings
        </button>
      </div>
      {displayedBookings.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-100 text-gray-700">
                <th className="border p-3">Booking Day</th>
                <th className="border p-3">Time</th>
                <th className="border p-3">Price</th>
                <th className="border p-3">Name</th>
              </tr>
            </thead>
            <tbody>
              {displayedBookings.map((booking) => (
                <tr key={booking.booking_id} className="border text-center hover:bg-gray-50">
                  <td className="border p-3">{booking.booking_day}</td>
                  <td className="border p-3">{booking.booking_start_time}</td>
                  <td className="border p-3">${booking.price}</td>
                  <td className="border p-3">{booking.first_name} {booking.last_name}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-center text-gray-500">No valid bookings available.</p>
      )}
    </div>
  );
};

export default Bookings;
