'use client'
import { useState, useEffect } from "react";

export default function MyAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [showAvailable, setShowAvailable] = useState(false);
  const [loading, setLoading] = useState(true);

  const availableAppointments = () => {
    const now = new Date();
    const today = now.toISOString().split("T")[0]; // Jelenlegi dátum 'YYYY-MM-DD' formátumban
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();
  
  
    
    return appointments.filter((app) => {

      const [startHour, startMinute] = app.booking_start_time.split(":").map(Number);
      console.log(today)
      console.log(app.booking_day)
      return (
        app.booking_day > today || 
        (app.booking_day === today && (startHour > currentHour || (startHour === currentHour && startMinute > currentMinute)))
      );
      

    }).sort((a, b) => {
      return new Date(a.booking_day) - new Date(b.booking_day);
    });
  };
  
  // Az éppen megjelenített lista
  const displayedAppointments = showAvailable ? availableAppointments() : appointments;

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

  if (loading) {
    return (
      <div>
        <p>Loading...</p>
      </div>
    );
  }

  return (
<div>
<p className="pl-10 font-semibold text-gray-800 text-3xl pb-10">My Appointments</p>
    <div className="flex flex-col items-center justify-center">
    

      {/* Gombok szekció */}
      <div className="flex justify-center items-center gap-4 rounded-lg border-2 border-black px-4 mb-10">
        <button 
          onClick={() => setShowAvailable(false)} 
          className={`flex-1 p-2 text-center transition-all duration-300 ${!showAvailable ? 'bg-gray-400 text-white' : 'hover:bg-gray-200'}`}
        >
          All appointments
        </button>
        <div className="h-8 border-l-2 border-gray-900"></div>
        <button 
          onClick={() => setShowAvailable(true)} 
          className={`flex-1 p-2 text-center transition-all duration-300 ${showAvailable ? 'bg-gray-400 text-white' : 'hover:bg-gray-200'}`}
        >
          Available appointments
        </button>
      </div>

      {/* Táblázat szekció */}
      {displayedAppointments.length > 0 ? (
      <div className="p-4">
      <table className="table-fixed w-full border-collapse">
        <thead>
          <tr>
            <th className="border border-gray-300 px-4 py-2 text-left">Service</th>
            <th className="border border-gray-300 px-4 py-2 text-left">Location</th>
            <th className="border border-gray-300 px-4 py-2 text-left">Date</th>
            <th className="border border-gray-300 px-4 py-2 text-left">Time</th>
          </tr>
        </thead>
        <tbody>
          {displayedAppointments.map((app, index) => (
            <tr key={index}>
              <td className="border border-gray-300 px-4 py-2">{app.service_name}</td>
              <td className="border border-gray-300 px-4 py-2">{app.service_location}, {app.service_address}</td>
              <td className="border border-gray-300 px-4 py-2">{app.booking_day}</td>
              <td className="border border-gray-300 px-4 py-2">{app.booking_start_time}</td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>
      ) : <div>There are no appointments...</div>}
    </div>
    </div>
  );
}
