'use client'
//TODO: oldal atalakitasa ssr-be
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import Modal from "@/components/Modal";
import Loading from "@/components/Loading";

const Services = () => {
  const [services, setServices] = useState([]);
  const [originalServices, setOriginalServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [categories, setCategories] = useState(null);
  const [selectedSort, setSelectedSort] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('');

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await fetch('/api/services');
        if (!response.ok) {
          throw new Error('Cannot get services!');
        }
        const data = await response.json();
        setServices(data);
        setOriginalServices(data);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };
    fetchServices();
  }, []);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('/api/get-categories');
        if (!response.ok) {
          throw new Error('Cannot get categories');
        }
        const data = await response.json();
        setCategories(data);
      } catch (error) {
        
        setError(error);
      }
    };
    fetchCategories();
  }, []);

  // sorting and filtering
  const computedServices = () => {
    let filtered = [...originalServices];

    if (selectedFilter) {
      filtered = filtered.filter(service => service.category_name === selectedFilter);
    }

    if (selectedSort === "price") {
      filtered.sort((a, b) => a.service_price - b.service_price);
    }

    if (selectedSort === "rating") {
      filtered.sort((a, b) => b.service_avg_rating - a.service_avg_rating);
    }

    return filtered;
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="flex px-4 md:px-8 mt-10 max-w-7xl mx-auto">
      {/* Sidebar szűrés és rendezés */}
      <aside className="w-64 h-96 bg-white py-4 pr-8 mr-10">
        <h2 className="text-xl font-semibold mb-4">Sort & Filter</h2>

        {/* Sort Section */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
          <select
            value={selectedSort}
            onChange={(e) => setSelectedSort(e.target.value)}
            className="w-full p-2 bg-white border border-gray-300 rounded-md"
          >
            <option value="">Select...</option>
            <option value="price">Price (low to high)</option>
            <option value="rating">Rating (high to low)</option>
          </select>
        </div>

        {/* Filter Section */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Filter By Category</label>
          <select
            value={selectedFilter}
            onChange={(e) => setSelectedFilter(e.target.value)}
            className="w-full p-2 bg-white border border-gray-300 rounded-md"
          >
            <option value="">All Categories</option>
            {categories &&
              categories.map((category) => (
                <option key={category.category_id} value={category.name}>
                  {category.name}
                </option>
              ))}
          </select>
        </div>
      </aside>

      {/* Services list */}
      <div className="flex flex-col gap-6 w-full">
        {computedServices().map((service) => (
          <div key={service.service_id} className="flex gap-6 border-b py-6">
            {/* Kép bal oldalon */}
            <div className="w-1/3 h-[250px] relative">
              <Link href={`services/${service.service_id}`}>
                <Image
                  src={service.images[0]}
                  width={400}
                  height={300}
                  alt={service.service_name}
                  className="w-full h-full object-cover rounded-md"
                />
              </Link>
              <div className="flex flex-col absolute top-0 right-0 w-16 bg-black opacity-90 text-white text-sm p-2 justify-center items-center">
                <div>{Number(service.service_avg_rating)} ★</div>
                <div className="text-sm">rated</div>
              </div>
            </div>

            {/* Right side */}
            <div className="w-2/3 pl-10">
              <h3 className="text-2xl font-semibold text-gray-600">{service.service_name}</h3>
              <p className="text-sm text-gray-500">
                {service.service_location}, {service.service_address}
              </p>
              <p className="text-gray-600 pt-10">{service.service_description}</p>
            </div>

            {/* Price and Modal */}
            <div className="flex items-center">
              <p className="whitespace-nowrap">{`${service.service_price} RON`}</p>
              <div className="pl-4">
                <Modal service={service} />
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {error && <p className="text-red-500 mt-2 text-center">{error}</p>}
    </div>
  );
};

export default Services;
