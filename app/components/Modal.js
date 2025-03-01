'use client'
import Calendar from 'react-calendar';
import { useState, useEffect } from 'react';
import 'react-calendar/dist/Calendar.css';
import BookingModal from '../components/BookingModal';
import { useSession,signIn } from 'next-auth/react';
import { useRouter } from "next/navigation";

const Modal = ({service}) => {
  const [value, setValue] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [slots, setSlots] = useState(null);
  const [todaySlots, setTodaySlots] = useState(null);
  const [bookedSlots, setBookedSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [servicePrice, setServicePrice] = useState(null);
  const [serviceId, setServiceId] = useState(null);
  const [userId, setUserId] = useState(null);
  const [isClickedToday, setIsClickedToday] = useState(false);
  const [isClickedTomorrow, setIsClickedTomorrow] = useState(false);
  const [isClickedOther, setIsClickedOther] = useState(false);
  const [shouldDisableWeekends, setShouldDisableWeekends] = useState(false);
  const [shouldDisableToday, setShouldDisableToday] = useState(false);
  const [shouldDisableTomorrow, setShouldDisableTomorrow] = useState(false);
  

  const { data: session, status } = useSession();
  const router = useRouter();

  const resetState = () => {
    setValue(null);
    setIsCalendarOpen(false);
    setBookedSlots([]);
    setSelectedSlot(null);
    setIsClickedToday(false);
    setIsClickedTomorrow(false);
    setIsClickedOther(false);
  };

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

  const disablePastAndWeekends = ({ date }) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Reset the time part, only compare the date
  
    const day = date.getDay(); // 0: Sunday, 6: Saturday
  
    // Ha shouldDisableWeekends igaz, akkor letiltjuk a hétvégéket és a múltbeli napokat
    if (shouldDisableWeekends) {
      return day === 0 || day === 6 || date < today; // Ha hétvége vagy múltbeli nap
    } else {
      // Ha nem kell letiltani a hétvégéket, csak a múltbeli napokat tiltjuk
      return date < today; // Ha múltbeli nap
    }
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



  const generateTimeSlotsForToday = (start, end, interval, booked) => {
    let times = [];
    let current = new Date();
    let today = current.toISOString().split("T")[0]; // Az aktuális dátum YYYY-MM-DD formátumban
  
    let currentSlot = new Date(`${today}T${start}:00`);
    let endTime = new Date(`${today}T${end}:00`);
    let now = new Date();
  
    while (currentSlot <= endTime) {
      let hours = String(currentSlot.getHours()).padStart(2, "0");
      let minutes = String(currentSlot.getMinutes()).padStart(2, "0");
      let timeSlot = `${hours}:${minutes}`;
  
      // A timeSlot-ot is átalakítjuk Date objektummá a pontos összehasonlításhoz
      let timeSlotDate = new Date(`${today}T${timeSlot}:00`);
  
      if (!booked.includes(timeSlot) && timeSlotDate > now) {
        times.push(timeSlot);
      }
  
      currentSlot.setMinutes(currentSlot.getMinutes() + interval);
    }
    return times;
  };
  
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => {
    resetState();
    setIsModalOpen(false);
  };
  
  ;
  const toggleCalendar = () => setIsCalendarOpen((prev) => !prev);

  const onDateChange = (date, type) => {

    if(type === 'other'){
      setIsClickedToday(false)
      setIsClickedTomorrow(false)
     
      
      
      const newDate = new Date(date); // Létrehozunk egy új Date objektumot
      newDate.setDate(newDate.getDate() + 1);
      setValue(newDate);
      fetchBookedSlots(newDate.toISOString().split("T")[0]); // API hívás az aktuális dátumhoz
    setIsCalendarOpen(false);
    console.log(newDate.toISOString().split("T")[0]);

    }else{
      
      setValue(date);
      fetchBookedSlots(date.toISOString().split("T")[0]); // API hívás az aktuális dátumhoz
    setIsCalendarOpen(false);
    console.log(date.toISOString().split("T")[0]);
    }
}
      
   
    
  
  
  const selectToday = () => {
    
    const today = new Date();
    
    /*setValue(today);*/
    setIsCalendarOpen(false);
    setIsClickedTomorrow(false)
    setIsClickedToday(true);
    onDateChange(today)
  };
  
  const selectTomorrow = () => {
    
    const tomorrow = new Date();
    
    tomorrow.setDate(tomorrow.getDate() + 1);
    onDateChange(tomorrow)
    /*setValue(tomorrow);*/
    
    setIsCalendarOpen(false);
    setIsClickedToday(false)
    setIsClickedTomorrow(true);
    
  };


  const addBook = async () => {
    if (!value || !selectedSlot || !servicePrice || !serviceId) {
      console.log(value)
      console.log(selectedSlot)
      console.log(servicePrice)
      console.log(serviceId)
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
      setIsModalOpen();
    } catch (error) {
      console.error('Booking error:', error);
    }
  };



  useEffect(() => {
    console.log(service)
    if (isModalOpen) {
      if (status === "unauthenticated") {
        router.push("/api/auth/signin");
      }
      if (service.days_available === "Weekdays only") {
        setShouldDisableWeekends(true);
      }
  
      if (shouldDisableWeekends) {
        const date = new Date();
        const dateName = date.getDay();
  
        if (dateName === 0) {
          setShouldDisableToday(true);
        } else if (dateName === 6) {
          setShouldDisableToday(true);
          setShouldDisableTomorrow(true);
        } else if (dateName === 5) {
          setShouldDisableTomorrow(true);
        }
      }
  
      const timeSlots = generateTimeSlots(service.duration_start_time, service.duration_end_time, 30, bookedSlots);
      const todayTimeSlots = generateTimeSlotsForToday(service.duration_start_time, service.duration_end_time, 30, bookedSlots);
      setSlots(timeSlots);
      setTodaySlots(todayTimeSlots);
      setServicePrice(service.service_price);
      setUserId(session?.user?.id || null);
      setServiceId(service.service_id);
    }
  }, [isModalOpen, bookedSlots, shouldDisableWeekends]);
  

  useEffect(() => {
    if (value) {
      console.log("Selected date:", value.toISOString().split("T")[0]);
    }
  }, [value]);
  
  useEffect(() => {
    
    if (!isModalOpen) {
      setValue(null);
      setIsCalendarOpen(false);
      setBookedSlots([]);
      setSelectedSlot(null);
      setIsClickedToday(false);
      setIsClickedTomorrow(false);
      setIsClickedOther(false);
    }
  }, [isModalOpen]);
  

  //EZT AT KELL ALAKITANI DINAMIKUSSA



  return (
    <div>
      <button onClick={openModal} className="bg-indigo-500 rounded-lg w-28 h-10 text-white">Book Now</button>
      <BookingModal isOpen={isModalOpen} onClose={closeModal}>
        <h2 className="text-center text-lg font-bold">Book an appointment</h2>
        <p className="mt-4 text-center">Select a date:</p>
        {isCalendarOpen && (
  <div className="flex flex-col items-start justify-center absolute inset-0 -top-32 z-10">
    {/* Kék sáv a gombbal */}
    <div className="bg-blue-500 w-full p-2 flex items-center justify-between">
      <button 
        onClick={toggleCalendar} 
        className="text-white font-bold px-4 py-2"
      >
        X
      </button>
    </div>

    {/* Naptár középre helyezése */}
    <div className="w-full flex justify-center bg-white p-4">
      <Calendar
        onChange={(date) => onDateChange(date, "other")} // Dátum kezelése
        tileDisabled={disablePastAndWeekends}
        className="bg-white shadow-lg w-full " // Maximális szélesség beállítása
      />
    </div>
  </div>
)}



        
        
        
        
        <div className="flex justify-center gap-x-4 mt-4">
        <button
  className={`h-[45px] w-[80px] flex items-center justify-center rounded-lg border text-black transition-all duration-300
    ${isClickedToday ? "bg-blue-500 text-white" : "bg-transparent"}
    ${shouldDisableToday ? "cursor-auto opacity-50" : "cursor-pointer"}`}
  onClick={selectToday}
  disabled={shouldDisableToday}
>
  Today
</button>




<button
  className={`h-[45px] w-[80px] flex items-center justify-center rounded-lg border text-black transition-all duration-300
    ${isClickedTomorrow ? "bg-blue-500 text-white" : "bg-transparent"}
    ${shouldDisableTomorrow ? "cursor-auto opacity-50" : "cursor-pointer"}`}
  onClick={selectTomorrow}
  disabled={shouldDisableTomorrow}
>
  Tomorrow
</button>

          

          <button
            className="h-[45px] w-[100px] flex items-center justify-center rounded-lg border text-black"
            onClick={toggleCalendar} // Naptár megnyitása/zárása
          >
            Other Date
          </button>
        </div>

        

{value && (
  <div className="overflow-x-scroll flex gap-4 p-4 mt-4">
    {(
      (value.toISOString().split("T")[0] === new Date().toISOString().split("T")[0] ? todaySlots : slots).length > 0
    ) ? (
      (value.toISOString().split("T")[0] === new Date().toISOString().split("T")[0] ? todaySlots : slots)
        .map((slot, index) => (
          <div
            key={index}
            onClick={() => setSelectedSlot(slot)} // Kiválasztás esemény
            className={`min-w-[100px] flex items-center justify-center p-2 shadow rounded-lg cursor-pointer
              ${selectedSlot === slot ? 'bg-blue-500 text-white' : 'text-black'}`}
          >
            {slot}
          </div>
        ))
    ) : (
      <p className="text-gray-500 text-center w-full">No available time slots</p>
    )}
  </div>
)}

{value && selectedSlot && (
  <div className="px-4 py-2 text-center mt-10  rounded ">Selected date: {value.toISOString().split("T")[0]}, {selectedSlot}</div>
)}



 {value && selectedSlot ? (<div className="flex justify-center items-center">     
    <button 
  className='px-4 py-2 text-center mt-10 cursor-pointer bg-blue-500 rounded text-white'
  onClick={addBook}
  
    >
    Book
    </button>
</div>
 ) : (
  <div className="flex justify-center items-center">
    <button 
  className='px-4 py-2 text-center cursor-auto inactive mt-10 bg-gray-500 rounded text-white'>
    Book
    </button>
  </div>
 )}

        
    
      </BookingModal>
    </div>
  );
};

export default Modal;