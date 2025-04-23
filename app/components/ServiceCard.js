import Image from "next/image";
import Link from "next/link";

export default function ServiceCard({ id, name, desc, price, image, location }) {

  return (
    <div className="bg-white rounded-lg overflow-hidden hover:cursor-pointer transition-all duration-300 h-full flex flex-col">
      <Link href={`/services/${id}`} className="flex flex-col h-full">
        <div className="relative w-full h-56">
          <Image 
            src={image} 
            alt={name} 
            width={600} 
            height={400}
            className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
          />
          {price && (
            <div className="absolute top-4 right-4 bg-indigo-600 text-white px-3 py-1 rounded-full text-sm font-medium shadow-md">
              ${parseFloat(price).toFixed(2)}
            </div>
          )}
        </div>
        
        <div className="p-5 flex-grow flex flex-col">
          <h3 className="text-xl font-semibold text-gray-800 mb-2 line-clamp-1">{name}</h3>
          <p className="text-gray-600 mb-3 line-clamp-2 flex-grow">{desc}</p>
          
          <div className="flex items-center text-gray-500 mt-auto">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span className="text-sm truncate">
              {location?.city}{location?.address ? `, ${location.address}` : ''}
            </span>
          </div>
        </div>
      </Link>
    </div>
  );
}