'use client'
import Calendar from 'react-calendar';
import { useState, useEffect } from 'react';
import 'react-calendar/dist/Calendar.css';
import BookingModal from '../components/BookingModal';
import { useSession } from 'next-auth/react';

const Modal = ({service}) => {
  const [value, setValue] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [slots, setSlots] = useState(null);
  const [bookedSlots, setBookedSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [servicePrice, setServicePrice] = useState(null);
  const [serviceId, setServiceId] = useState(null);
  const [userId, setUserId] = useState(null);

  const { data: session, status } = useSession();

  const fetchBookedSlots = async (date) => {
    try {
      const response = await fetch(`/api/get-booked-slots?serviceId=${serviceId}&date=${date}`);
      if (!response.ok) {
        throw new Error("Failed to fetch booked slots.");
      }
      const data = await response.json();
      console.log(data)
      setBookedSlots(data.bookedSlots || []); // Az adatokat mentjük, vagy üres tömböt
    } catch (error) {
      console.error("Error fetching booked slots:", error);
    }
  };

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
    setValue(date); // Dátum beállítása
    fetchBookedSlots(date.toISOString().split("T")[0]); // API hívás az aktuális dátumhoz
    setIsCalendarOpen(false);
    console.log(date);
  };
  
  const selectToday = () => {
    const today = new Date();
    setValue(today);
    fetchBookedSlots(today.toISOString().split("T")[0]);
    setIsCalendarOpen(false);
  };
  
  const selectTomorrow = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    setValue(tomorrow);
    fetchBookedSlots(tomorrow.toISOString().split("T")[0]);
    setIsCalendarOpen(false);
  };

  const addBook = async () => {
    if (!value || !selectedSlot || !servicePrice || !serviceId) {
      console.error("Missing booking details.");
      return;
    }
  
    const payload = {
      servicePrice,
      selectedSlot,
      value: value.toISOString().split("T")[0], // Konvertálás string formátumba
      serviceId,
    };
  
    try {
      const response = await fetch('/api/add-booking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
  
      if (!response.ok) {
        throw new Error(`Booking failed: ${response.statusText}`);
      }
  
      const result = await response.json();
      console.log('Booking successful:', result);
    } catch (error) {
      console.error('Booking error:', error);
    }
  };
  

 useEffect(() => {
      // Ensure this runs only on the client-side
      const timeSlots = generateTimeSlots("09:00", "17:00", 30, bookedSlots);
      setSlots(timeSlots);
      setServicePrice(service.price);
      setUserId(session.user.id);
      setServiceId(service.service_id);      
  }, [value, bookedSlots])



  return (
    <div>
      <button onClick={openModal}>Book Now</button>
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

      <div className='text-center mt-10 cursor-pointer' onClick={addBook}>Book</div>
        
      </BookingModal>
    </div>
  );
};

export default Modal;