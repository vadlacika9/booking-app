//TODO: a helymeghatarozast kulon komponensbe tenni es a leirasokat atalakitani ssr-be a jobb seo miatt

'use client'
import Image from "next/image";
import { useEffect, useState } from "react";


const Slidein = () => {

  const [isVisible, setIsVisible] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if(sessionStorage.getItem("userLocation")){
      setIsVisible(false);
    }
  },[])

  const [isLoading, setIsLoading] = useState(false);

  const saveUserLocation = () => {
    if ("geolocation" in navigator) {
      setIsLoading(true);
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
  
          sessionStorage.setItem("userLocation", JSON.stringify({ lat, lng }));
  
          setIsLoading(false);
          setIsVisible(false);
          window.location.reload();
        },
        (error) => {
          console.error("error:", error);
          setIsLoading(false);
        }
      );
    } else {
      console.log("error");
    }
  };
  

  return(
    
    <div className={`px-4 md:px-8 py-10 mt-16 max-w-7xl mx-auto h-[2000px]`}>
{isVisible && (<div className="flex items-center justify-center">
  <div data-aos="fade-up" className="w-full p-6 rounded-lg border-2 shadow-md flex justify-between items-center mb-24">
    <div>
      <p className="text-2xl mx-4 font-bold text-gray-700">Discover the nearest available services.</p>
      <p className="mx-4 text-gray-700">Please enable location services in your browser to find nearby options.</p>
      <button className="text-white bg-indigo-500 p-4 ml-4 font-bold rounded-lg" onClick={saveUserLocation}>Enable</button>
      <button className="p-4 my-4 ml-2 border-2 rounded border-indigo-500 text-indigo-500 font-bold " onClick={() => {setIsVisible(false)}}>Not now</button>
    </div>
    <div className="flex justify-end pr-24">
      <Image src="/images/undraw_destination_fkst.svg" width={200} height={200} alt="phone" />
    </div>
  </div>
</div>
)}
      {/* Flexbox container */}
      <div className={`flex flex-col md:flex-row items-stretch justify-between gap-6`}>
        {/* Left image */}
        <div data-aos="fade-right" className="w-full md:w-1/2 flex justify-center items-center">
          <Image
            src="/images/kep2.jpg"
            alt="Online booking"
            width={600}
            height={300}
            className="rounded-lg shadow-lg"
          />
        </div>

        {/* right text */}
        <div data-aos="fade-left" className="w-full md:w-1/2  rounded-lg p-4 px-6 text-center ">
        <h1 className="text-3xl pb-2"><strong>The Advantages of Online Booking</strong></h1>
          <p className="text-lg ">
          The Advantages of Online Booking

          In todays digital age, online booking has become an essential tool for both businesses and customers alike. Here are some of the key advantages of using online booking systems:

          Convenience: Online booking allows customers to make reservations at any time of the day or night, from the comfort of their own homes. This flexibility is particularly beneficial for those with busy schedules or those living in different time zones.

        Time-Saving: With online booking, theres no need to make phone calls or visit a physical location to secure a reservation. This saves valuable time for both customers and businesses.
          </p>
         
        </div>
      </div>

      {/* Flexbox container */}
      <div className="flex flex-col md:flex-row justify-between items-stretch mt-40  rounded-lg gap-6 ">

        {/* right text */}
        <div data-aos="fade-right" className="w-full md:w-1/2 text-center  rounded-lg px-6 p-4 ">
        <h1 className="text-3xl pb-3"><strong>The Advantages of Online Booking</strong></h1>
          <p className="text-lg">
          The Advantages of Online Booking

          In todays digital age, online booking has become an essential tool for both businesses and customers alike. Here are some of the key advantages of using online booking systems:

          Convenience: Online booking allows customers to make reservations at any time of the day or night, from the comfort of their own homes. This flexibility is particularly beneficial for those with busy schedules or those living in different time zones.

          Time-Saving: With online booking, theres no need to make phone calls or visit a physical location to secure a reservation. This saves valuable time for both customers and businesses.
          </p>
         
        </div>
        {/* left image */}
        <div data-aos="fade-left" className="w-full md:w-1/2 flex justify-center items-center">
          <Image
            src="/images/massage.jpg"
            alt="Online booking"
            width={600}
            height={300}
            className="rounded-lg shadow-lg"
          />
        </div>
      </div>

      {/* Flexbox container */}
      <div className="flex flex-col md:flex-row items-stretch mt-40 gap-6 ">
        {/* left image */}
        <div data-aos="fade-right" className="w-full md:w-1/2 flex justify-center items-center pr-10">
          <Image
            src="/images/my_app.svg"
            alt="myapp"
            width={400}
            height={200}
            
          />
        </div>

        {/* right text */}
        <div data-aos="fade-left" className="w-full md:w-1/2">

        <h1 className="text-3xl pb-14"><strong> IOS & Android application</strong></h1>
          <p className="text-lg">
            Coming soon..........
          </p>
         
        </div>
        {error && (
          <div>{error}</div>
        )}
      </div>
    </div>

    
  )
}

export default Slidein;