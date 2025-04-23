'use client'
import Calendar from 'react-calendar';
import { useState, useEffect } from 'react';
import 'react-calendar/dist/Calendar.css';
import BookingModal from '../components/BookingModal';
import { useSession } from 'next-auth/react';
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
  const [error,setError] = useState(null);
  const [serviceName,setServiceName] = useState(null);
  
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
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
      setServiceName(service.service_name);
    }
  }, [isModalOpen, bookedSlots, shouldDisableWeekends]);
  
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
      
      setBookedSlots(data.bookedSlots || []); 
    } catch (error) {
      console.error("Error fetching booked slots:", error);
    }
  };

  const disablePastAndWeekends = ({ date }) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Reset the time part, only compare the date
  
    const day = date.getDay(); // 0: Sunday, 6: Saturday
  
    if (shouldDisableWeekends) {
      return day === 0 || day === 6 || date < today; // weekend or date from the past
    } else {
      //dates from the past
      return date < today;
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
  
      if (!booked.includes(timeSlot)) {
        times.push(timeSlot);
      }

      current.setMinutes(current.getMinutes() + interval);
    }
    return times;  //filtered times
  };

  const generateTimeSlotsForToday = (start, end, interval, booked) => {
    let times = [];
    let current = new Date();
    let today = current.toISOString().split("T")[0]; 
  
    let currentSlot = new Date(`${today}T${start}:00`);
    let endTime = new Date(`${today}T${end}:00`);
    let now = new Date();
  
    while (currentSlot <= endTime) {
      let hours = String(currentSlot.getHours()).padStart(2, "0");
      let minutes = String(currentSlot.getMinutes()).padStart(2, "0");
      let timeSlot = `${hours}:${minutes}`;
      
      let timeSlotDate = new Date(`${today}T${timeSlot}:00`);
  
      if (!booked.includes(timeSlot) && timeSlotDate > now) {
        times.push(timeSlot);
      }
  
      currentSlot.setMinutes(currentSlot.getMinutes() + interval);
    }
    return times;
  };
  
  const openModal = () => {
    if (!session) {
      router.push("/api/auth/signin");
      return;
    }
    setIsModalOpen(true);
  };
  
  const closeModal = () => {
    resetState();
    setIsModalOpen(false);
  };
  
  const toggleCalendar = () => setIsCalendarOpen((prev) => !prev);

  const onDateChange = (date, type) => {
    
    setIsCalendarOpen(false);
    
    if(type === 'other'){
      setIsClickedToday(false);
      setIsClickedTomorrow(false);
     
      const newDate = new Date(date); 
      newDate.setDate(newDate.getDate() + 1);
      setValue(newDate);
      fetchBookedSlots(newDate.toISOString().split("T")[0]);
    } else {
      setValue(date);
      fetchBookedSlots(date.toISOString().split("T")[0]);
    }
  }
  
  const selectToday = () => {
    const today = new Date();
    
    setIsCalendarOpen(false);
    setIsClickedTomorrow(false)
    setIsClickedToday(true);
    onDateChange(today)
  };
  
  const selectTomorrow = () => {
    const tomorrow = new Date();
    
    tomorrow.setDate(tomorrow.getDate() + 1);
    onDateChange(tomorrow)
   
    setIsCalendarOpen(false);
    setIsClickedToday(false)
    setIsClickedTomorrow(true);
  };

  const addBook = async () => {
    if (!value || !selectedSlot || !servicePrice || !serviceId || !serviceName) {
      setError("Missing booking details.");
      return;
    }
  
    const payload = {
      servicePrice,
      selectedSlot,
      value: value.toISOString().split("T")[0], 
      serviceId,
      serviceName
    };
      
    sessionStorage.setItem("bookingDetails", JSON.stringify(payload));
    window.location.href = "/payment";
  }

  // Format date to show YYYY-MM-DD format
  const formatDate = (date) => {
    if (!date) return '';
    return date.toISOString().split("T")[0];
  };

  return (
    <div>
      <button onClick={openModal} className="bg-indigo-500 hover:bg-indigo-600 transition-all duration-300 rounded-lg w-28 h-10 text-white shadow-sm">Book Now</button>
      <BookingModal isOpen={isModalOpen} onClose={closeModal}>
        <div className="h-full flex flex-col">
          <h2 className="text-center text-xl font-bold text-gray-800 mb-6">Book an appointment</h2>
          
          {/* Calendar popup */}
          {isCalendarOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg shadow-lg w-full max-w-md">
                <div className="bg-indigo-500 text-white p-3 flex justify-between items-center rounded-t-lg">
                  <h3 className="font-medium">Select Date</h3>
                  <button 
                    onClick={toggleCalendar} 
                    className="text-white hover:text-indigo-100 transition-colors duration-200"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
                <div className="p-4">
                  <Calendar
                    onChange={(date) => onDateChange(date, "other")} 
                    tileDisabled={disablePastAndWeekends}
                    className="mx-auto border-none shadow-none" 
                  />
                </div>
              </div>
            </div>
          )}
          
          {/* Date selection buttons */}
          <div className="mb-6">
            <p className="mb-3 text-center text-gray-600">Select a date:</p>
            <div className="flex justify-center gap-3">
              <button
                className={`h-12 w-24 flex items-center justify-center rounded-lg transition-all duration-300
                  ${isClickedToday 
                    ? "bg-indigo-500 text-white border-indigo-500" 
                    : "bg-white text-gray-700 border border-gray-300 hover:border-indigo-400"}
                  ${shouldDisableToday ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
                onClick={selectToday}
                disabled={shouldDisableToday}
              >
                Today
              </button>

              <button
                className={`h-12 w-24 flex items-center justify-center rounded-lg transition-all duration-300
                  ${isClickedTomorrow 
                    ? "bg-indigo-500 text-white border-indigo-500" 
                    : "bg-white text-gray-700 border border-gray-300 hover:border-indigo-400"}
                  ${shouldDisableTomorrow ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
                onClick={selectTomorrow}
                disabled={shouldDisableTomorrow}
              >
                Tomorrow
              </button>

              <button
                className="h-12 w-28 flex items-center justify-center rounded-lg border border-gray-300 text-gray-700 hover:border-indigo-400 transition-all duration-300"
                onClick={toggleCalendar}
              >
                Other Date
              </button>
            </div>
          </div>

          {/* Time slots grid */}
          {value && (
            <div className="flex-1 overflow-auto">
              <div className=" max-h-64 p-2">
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {(value.toISOString().split("T")[0] === new Date().toISOString().split("T")[0] ? todaySlots : slots)?.length > 0 ? (
                    (value.toISOString().split("T")[0] === new Date().toISOString().split("T")[0] ? todaySlots : slots)
                      .map((slot, index) => (
                        <div
                          key={index}
                          onClick={() => setSelectedSlot(slot)} 
                          className={`p-3 text-center rounded-lg shadow-sm cursor-pointer transition-all duration-200
                            ${selectedSlot === slot 
                              ? 'bg-indigo-500 text-white shadow-md' 
                              : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'}`}
                        >
                          {slot}
                        </div>
                      ))
                  ) : (
                    <p className="text-gray-500 text-center col-span-full py-6">No available time slots</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Selected date display */}
          {value && selectedSlot && (
            <div className="mt-4 mb-4 p-3 bg-gray-50 rounded-lg text-center border border-gray-200">
              <p className="text-gray-600">Selected date:</p>
              <p className="font-medium text-gray-800">{formatDate(value)}, {selectedSlot}</p>
            </div>
          )}

          {/* Book button */}
          <div className="mt-auto mb-4 flex justify-center">
            {value && selectedSlot ? (
              <button 
                className="px-8 py-3 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg font-medium shadow-sm transition-all duration-300"
                onClick={addBook}
              >
                Book
              </button>
            ) : (
              <button 
                className="px-8 py-3 bg-gray-400 text-white rounded-lg font-medium shadow-sm cursor-not-allowed"
                disabled
              >
                Book
              </button>
            )}
          </div>
          
          {/* Error message */}
          {error && <p className="text-red-500 text-center">{error}</p>}
        </div>
      </BookingModal>
    </div>
  );
};

export default Modal;