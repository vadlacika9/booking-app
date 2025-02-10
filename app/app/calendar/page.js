/*'use client'

import Calendar from 'react-calendar';
import { useEffect, useState } from 'react';
import 'react-calendar/dist/Calendar.css';
import BookingModal from '@/components/BookingModal';

const CalendarPage = () => {
  const [value, onChange] = useState(null);
  const [slots, setSlots] = useState(null);
  const [bookedSlots, setBookedSlots] = useState([
    "17:00", "09:30", "13:00"  // például már lefoglalt időpontok
  ]);
  const [isClient, setIsClient] = useState(false);  // State to track if it's the client-side
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCalendarOpen, setIsCalenderOpen] = useState(false);

  const disableWeekends = ({ date }) => {
    const day = date.getDay();
    return day === 0 || day === 6; // 0: Vasárnap, 6: Szombat
  };

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);
  const openCalendar = () => setIsCalenderOpen(true);
  const closeCalendar = () => setIsCalenderOpen(false);
  
  // Only set up the slots when the component has mounted
  useEffect(() => {
    setIsClient(true);  // Mark that the component is mounted on the client
  }, []);

  const generateTimeSlots = (start, end, interval, booked) => {
    let times = [];
    let current = new Date(`2024-01-01T${start}:00`);
    const endTime = new Date(`2024-01-01T${end}:00`);
  
    while (current <= endTime) {
      let hours = String(current.getHours()).padStart(2, "0");
      let minutes = String(current.getMinutes()).padStart(2, "0");
      let timeSlot = `${hours}:${minutes}`;

      // Csak akkor adjuk hozzá, ha a slot nincs benne a lefoglalt időpontok között
      if (!booked.includes(timeSlot)) {
        times.push(timeSlot);
      }

      current.setMinutes(current.getMinutes() + interval);
    }
    return times;  // Visszaadja a szűrt időpontokat
  };

  useEffect(() => {
    if (isClient) {  // Ensure this runs only on the client-side
      const timeSlots = generateTimeSlots("09:00", "17:00", 30, bookedSlots);
      setSlots(timeSlots);
    }
  }, [bookedSlots, isClient]);  // Runs only when the component is client-side

  useEffect(() => {
    if (slots) {
      console.log(slots);  // Kimenet a konzolra
    }
  }, [slots]);

  if (!isClient) {
    return null;  // Optionally return nothing or a loading screen until client-side rendering
  }

  return (
    <div>
      <Calendar onChange={onChange} value={value} tileDisabled={disableWeekends} isOpen={isCalendarOpen} />
      <div>
        {slots && slots.map((slot, index) => <div key={index}>{slot}</div>)}
      </div>

      <button onClick={openModal}>Modal Megnyitása</button>
     
      <BookingModal isOpen={isModalOpen} onClose={closeModal}>
        <h2 className='text-center'>Book an appointment</h2>
        <p className='p-4'>Date</p>
        <div className="flex 1 gap-x-4">
          <div className="h-[45px] w-[80px] flex items-center justify-center border rounded bg-red-500">Today</div>
          <div className="h-[45px] w-[80px] flex items-center justify-center border rounded bg-gray-100">Tomorrow</div>
          <div className="h-[45px] w-[100px] flex items-center justify-center border rounded bg-gray-100" onClick={openCalendar}>Other Date</div>
        </div>
        
      </BookingModal>

    </div>
  );
}

export default CalendarPage;
*/
'use client'
import Calendar from 'react-calendar';
import { useState, useEffect } from 'react';
import 'react-calendar/dist/Calendar.css';
import BookingModal from '@/components/BookingModal';

const CalendarPage = () => {
  const [value, setValue] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [slots, setSlots] = useState(null);
  const [bookedSlots, setBookedSlots] = useState([
    "17:00", "09:30", "13:00"  // például már lefoglalt időpontok
  ]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const disableWeekends = ({ date }) => {
    const day = date.getDay();
    return day === 0 || day === 6; // 0: Sunday, 6: Saturday
  };

  const generateTimeSlots = (start, end, interval, booked) => {
    let times = [];
    let current = new Date(`2024-01-01T${start}:00`);
    const endTime = new Date(`2024-01-01T${end}:00`);
  
    while (current <= endTime) {
      let hours = String(current.getHours()).padStart(2, "0");
      let minutes = String(current.getMinutes()).padStart(2, "0");
      let timeSlot = `${hours}:${minutes}`;

      // Csak akkor adjuk hozzá, ha a slot nincs benne a lefoglalt időpontok között
      if (!booked.includes(timeSlot)) {
        times.push(timeSlot);
      }

      current.setMinutes(current.getMinutes() + interval);
    }
    return times;  // Visszaadja a szűrt időpontokat
  };

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);
  
  ;
  const toggleCalendar = () => setIsCalendarOpen((prev) => !prev);

  const onDateChange = (date) => {
    setValue(date); // Mentés dátum
    setIsCalendarOpen(false); // Bezárás
    console.log(date)
  };

  const selectToday = () => {
    setValue(new Date());
    setIsCalendarOpen(false);
  };

  const selectTomorrow = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1); // Egy nap hozzáadása a mai dátumhoz
    setValue(tomorrow);
    setIsCalendarOpen(false);
  };

  useEffect(() => {
      // Ensure this runs only on the client-side
      const timeSlots = generateTimeSlots("09:00", "17:00", 30, bookedSlots);
      setSlots(timeSlots);
      console.log(value)
      
  }, [bookedSlots])

  return (
    <div>
      <button onClick={openModal}>Open modal</button>
      <BookingModal isOpen={isModalOpen} onClose={closeModal}>
        <h2 className="text-center text-lg font-bold">Book an appointment</h2>
        <p className="mt-4 text-center">Select a date:</p>
        {isCalendarOpen && (
          <Calendar
            onChange={onDateChange} // Dátum kezelése
            value={value}
            tileDisabled={disableWeekends}
            className="relative z-[1050] bg-white shadow-lg"
          />
        )}
        <div className="flex justify-center gap-x-4 mt-4">
          <button
            className="h-[45px] w-[80px] flex items-center justify-center rounded bg-red-500 text-white"
            onClick={selectToday} // Azonnali mentés az aktuális napra
          >
            Today
          </button>
          <button
            className="h-[45px] w-[100px] flex items-center justify-center rounded bg-blue-500 text-white"
            onClick={selectTomorrow} // Holnapi dátum mentése
          >
            Tomorrow
          </button>
          <button
            className="h-[45px] w-[100px] flex items-center justify-center rounded bg-gray-100"
            onClick={toggleCalendar} // Naptár megnyitása/zárása
          >
            {isCalendarOpen ? 'Close Calendar' : 'Other Date'}
          </button>
        </div>
        {value && (
          <p className="mt-4 text-center text-gray-700">
            Selected Date: {value.toDateString()}
          </p>
        )}

{ value && (<div className="overflow-x-scroll flex gap-4 p-4 bg-gray-100 rounded shadow-md">
  {slots && slots.map((slot, index) => (
    <div
      key={index}
      onClick={() => setSelectedSlot(slot)} // Kiválasztás esemény
      className={`min-w-[100px] flex items-center justify-center p-2 shadow rounded-lg
        ${selectedSlot === slot ? 'bg-green-500' : 'bg-blue-500 text-white'}`}
    >
      {slot}
    </div>
  ))}
</div>)}
        
      </BookingModal>
    </div>
  );
};

export default CalendarPage;


