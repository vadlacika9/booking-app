import Image from "next/image";
import UserLocation from "./UserLocation";

const Slidein = () => {
  return (
    <div className="px-4 md:px-8 py-16 max-w-7xl mx-auto">
      <UserLocation />
      
      {/* First section - Image on left */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-12 mb-32 rounded-xl overflow-hidden bg-gradient-to-br from-white to-indigo-50 shadow-xl p-6">
        {/* Left image with border effect */}
        <div className="w-full md:w-1/2 flex justify-center items-center">
          <div className="relative group">
            <div className="absolute -inset-1 bg-indigo-500 rounded-lg blur opacity-25 group-hover:opacity-50 transition duration-500"></div>
            <Image
              src="/images/kep2.jpg"
              alt="Online booking"
              width={600}
              height={300}
              className="relative rounded-lg shadow-lg transform transition duration-500 hover:scale-105"
            />
          </div>
        </div>
        
        {/* Right text with custom styling */}
        <div className="w-full md:w-1/2 rounded-lg p-6 text-center md:text-left">
          <h1 className="text-3xl md:text-4xl font-bold mb-6 relative">
            <span className="inline-block border-b-4 border-indigo-500 pb-2">The Advantages of Online Booking</span>
          </h1>
          <p className="text-lg text-gray-700 space-y-4">
            <span className="block mb-4">
            In today&apos;s fast-paced digital world, convenience and efficiency are more important than ever. Online booking systems offer a smart solution for businesses and customers alike, streamlining the reservation process and creating a smoother, more professional experience for everyone involved. 
            </span>
            
            <span className="block pl-4 border-l-4 border-indigo-500 mb-4">
              <strong className="text-indigo-700">24/7 Availability:</strong> One of the most powerful benefits of online booking is round-the-clock access. Customers can make reservations at any time, from anywhere—no need to worry about business hours or time zones. This level of flexibility leads to more bookings and greater customer satisfaction.


            </span>
            
            <span className="block pl-4 border-l-4 border-indigo-500">
              <strong className="text-indigo-700">Time Efficiency for Everyone:</strong> Online booking eliminates the back-and-forth of phone calls, emails, or in-person visits. Customers can quickly secure their desired time slot, while staff can focus on what really matters—delivering quality service, not managing calendars.
            </span>
          </p>
        </div>
      </div>
      
      {/* Second section - Image on right */}
      <div className="flex flex-col md:flex-row-reverse items-center justify-between gap-12 mb-32 rounded-xl overflow-hidden bg-gradient-to-br from-white to-indigo-50 shadow-xl p-6">
        {/* Left text with custom styling */}
        <div className="w-full md:w-1/2 flex justify-center items-center">
          <div className="relative group">
            <div className="absolute -inset-1 bg-indigo-500 rounded-lg blur opacity-25 group-hover:opacity-50 transition duration-500"></div>
            <Image
              src="/images/massage.jpg"
              alt="Service management"
              width={600}
              height={300}
              className="relative rounded-lg shadow-lg transform transition duration-500 hover:scale-105"
            />
          </div>
        </div>

        {/* Right image with border effect */}
        <div className="w-full md:w-1/2 rounded-lg p-6 text-center md:text-left">
          <h1 className="text-3xl md:text-4xl font-bold mb-6 relative">
            <span className="inline-block border-b-4 border-indigo-500 pb-2">Effortless Service Management</span>
          </h1>
          <p className="text-lg text-gray-700 space-y-4">
            <span className="block mb-4">
              In today&apos;s digital age, online booking has become an essential tool for both businesses and customers alike. Here are some of the key advantages of using online booking systems:
            </span>
            
            <span className="block pl-4 border-l-4 border-indigo-500 mb-4">
              <strong className="text-indigo-700">Ultimate Convenience:</strong> With just a few clicks, customers can schedule appointments without making phone calls or visiting in person. It&apos;s quick, easy, and stress-free.
            </span>
            
            <span className="block pl-4 border-l-4 border-indigo-500">
              <strong className="text-indigo-700">Real-Time Updates:</strong> Availability is always up to date, so double bookings and scheduling errors are minimized — everything runs smoother.


            </span>
          </p>
        </div>
      </div>
      
      {/* Third section - App preview */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-12 rounded-xl overflow-hidden bg-gradient-to-br from-white to-indigo-50 shadow-xl p-6">
        {/* Left image - App preview */}
        <div className="w-full md:w-1/2 flex justify-center items-center">
          <div className="relative transform transition-all duration-700 hover:-translate-y-4">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl blur opacity-75 animate-pulse"></div>
            <Image
              src="/images/my_app.svg"
              alt="Mobile application"
              width={400}
              height={400}
              className="relative z-10"
            />
          </div>
        </div>
        
        {/* Right text */}
        <div className="w-full md:w-1/2 rounded-lg p-6 text-center md:text-left">
          <h1 className="text-3xl md:text-4xl font-bold mb-8 relative">
            <span className="inline-block border-b-4 border-indigo-500 pb-2">iOS & Android Application</span>
          </h1>
          <div className="bg-indigo-100 border-l-4 border-indigo-500 p-6 rounded-r-lg shadow-md">
            <p className="text-xl text-indigo-800 font-medium flex items-center">
              <svg className="w-6 h-6 mr-2 text-indigo-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v3.586L7.707 9.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 10.586V7z" clipRule="evenodd"></path>
              </svg>
              Coming soon...
            </p>
            <p className="mt-4 text-indigo-700">Get early access to our mobile application by signing up for our newsletter!</p>
          </div>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8">
      {/* X (Twitter) Button */}
      <a 
        href="#" 
        className="bg-black text-white px-6 py-3 rounded-lg flex items-center gap-2 shadow-md hover:bg-gray-800 transition duration-300 w-48 justify-center"
      >
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          className="w-5 h-5" 
          viewBox="0 0 24 24" 
          fill="currentColor"
        >
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
        
      </a>
      
      {/* Facebook Button */}
      <a 
        href="#" 
        className="bg-blue-600 text-white px-6 py-3 rounded-lg flex items-center gap-2 shadow-md hover:bg-blue-700 transition duration-300 w-48 justify-center"
      >
        <svg 
          className="w-5 h-5" 
          viewBox="0 0 24 24" 
          fill="currentColor" 
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M14 13.5H16.5L17.5 9.5H14V7.5C14 6.47 14 5.5 16 5.5H17.5V2.14C17.174 2.097 15.943 2 14.643 2C11.928 2 10 3.657 10 6.7V9.5H7V13.5H10V22H14V13.5Z" />
        </svg>
        <span className="font-medium">Facebook</span>
      </a>
    </div>
        </div>
      </div>
    </div>
  );
};

export default Slidein;