'use client';
import { useState, useEffect } from 'react';
import { FilterControls } from './FiltersControls';
import Link from 'next/link';
import Image from 'next/image';
import Modal from './Modal';

export default function ServicesClient({ initialServices, categories }) {
  const [filteredServices, setFilteredServices] = useState(initialServices);
  
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [servicesPerPage] = useState(5);
  
  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [filteredServices.length]);

  // Calculate pagination data
  const indexOfLastService = currentPage * servicesPerPage;
  const indexOfFirstService = indexOfLastService - servicesPerPage;
  const currentServices = filteredServices.slice(indexOfFirstService, indexOfLastService);
  const totalPages = Math.ceil(filteredServices.length / servicesPerPage);

  // Page change handlers
  const goToPage = (pageNumber) => {
    setCurrentPage(pageNumber);
    // Scroll to top of results when page changes
    window.scrollTo({
      top: document.querySelector('.services-container')?.offsetTop - 100 || 0,
      behavior: 'smooth'
    });
  };

  const nextPage = () => {
    if (currentPage < totalPages) {
      goToPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      goToPage(currentPage - 1);
    }
  };

  // Generate page numbers to display
  const getPaginationNumbers = () => {
    const maxVisiblePages = 5;
    let pages = [];
    
    if (totalPages <= maxVisiblePages) {
      // If few pages, show all
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // More complex logic for many pages
      let startPage = Math.max(1, currentPage - 2);
      let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
      
      // Adjust when near the end
      if (endPage - startPage < maxVisiblePages - 1) {
        startPage = Math.max(1, endPage - maxVisiblePages + 1);
      }
      
      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }
    }
    
    return pages;
  };

  return (
    <>
      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <FilterControls
          services={initialServices}
          categories={categories}
          onFilter={setFilteredServices}
        />
      </div>

      {/* Services list with pagination */}
      <div className="services-container flex flex-col gap-6 w-full">
        {currentServices.map((service) => (
          <div key={service.service_id} className="flex flex-col md:flex-row gap-6 border-b border-gray-200 py-6 hover:bg-gray-50 transition-colors rounded-md">
            {/* Image on the left */}
            <div className="w-full md:w-1/3 h-64 relative">
              <Link href={`services/${service.service_id}`}>
                <Image
                  src={service.images[0]}
                  width={400}
                  height={300}
                  alt={service.service_name}
                  className="w-full h-full object-cover rounded-md shadow-sm"
                />
              </Link>
              <div className="flex flex-col absolute top-2 right-2 bg-black bg-opacity-90 text-white text-sm p-2 justify-center items-center rounded-md">
                <div className="font-bold">{Number(service.service_avg_rating).toFixed(1)} 
                  <span className="text-yellow-400 pl-1">★</span>
                </div>
                <div className="text-xs">rated</div>
              </div>
            </div>

            {/* Right side */}
            <div className="w-full md:w-2/3 pl-0 md:pl-6">
              <h3 className="text-2xl font-semibold text-gray-600">
                <Link href={`services/${service.service_id}`} className="hover:text-indigo-600 transition-colors">
                  {service.service_name}
                </Link>
              </h3>
              <p className="text-sm text-gray-500">
                {service.service_location}, {service.service_address}
              </p>
              <p className="text-gray-600 pt-4">{service.service_description}</p>
              
              {/* Price and Modal */}
              <div className="flex items-center justify-end mt-4">
                <p className="whitespace-nowrap font-medium text-lg text-green-600">{`${service.service_price} RON`}</p>
                <div className="px-4">
                  <Modal service={service} />
                </div>
              </div>
            </div>
          </div>
        ))}
        
        {filteredServices.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-500">No services match your criteria. Try adjusting your filters.</p>
          </div>
        )}
        
        {/* Pagination controls */}
        {filteredServices.length > 0 && totalPages > 1 && (
          <div className="flex justify-center items-center mt-8 mb-4">
            <nav className="flex items-center space-x-2" aria-label="Pagination">
              {/* Previous page button */}
              <button
                onClick={prevPage}
                disabled={currentPage === 1}
                className={`px-3 py-2 rounded border ${
                  currentPage === 1
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
                aria-label="Previous page"
              >
                &laquo; Prev
              </button>
              
              {/* Page numbers */}
              <div className="hidden sm:flex space-x-2">
                {getPaginationNumbers().map(number => (
                  <button
                    key={number}
                    onClick={() => goToPage(number)}
                    className={`px-3 py-2 rounded ${
                      currentPage === number
                        ? 'bg-indigo-600 text-white'
                        : 'bg-white text-gray-700 hover:bg-gray-50 border'
                    }`}
                    aria-current={currentPage === number ? 'page' : undefined}
                  >
                    {number}
                  </button>
                ))}
              </div>
              
              {/* Mobile view page indicator */}
              <span className="sm:hidden text-sm text-gray-700">
                Page {currentPage} of {totalPages}
              </span>
              
              {/* Next page button */}
              <button
                onClick={nextPage}
                disabled={currentPage === totalPages}
                className={`px-3 py-2 rounded border ${
                  currentPage === totalPages
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
                aria-label="Next page"
              >
                Next &raquo;
              </button>
            </nav>
          </div>
        )}
        
        {/* Results count */}
        <div className="text-center text-gray-500 text-sm mt-2">
          Showing {filteredServices.length > 0 ? indexOfFirstService + 1 : 0} - {Math.min(indexOfLastService, filteredServices.length)} of {filteredServices.length} services
        </div>
      </div>
    </>
  );
}