
'use client';

import { useState, useEffect } from "react";

export function FilterControls({ services, categories, onFilter }) {
  const [selectedSort, setSelectedSort] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('');

  useEffect(() => {
    let filtered = [...services];
    
    if (selectedFilter) {
      filtered = filtered.filter(service => service.category_name === selectedFilter);
    }
    
    if (selectedSort === "price") {
      filtered.sort((a, b) => a.service_price - b.service_price);
    }
    
    if (selectedSort === "rating") {
      filtered.sort((a, b) => b.service_avg_rating - a.service_avg_rating);
    }
    
    onFilter(filtered);
  }, [selectedSort, selectedFilter, services, onFilter]);

  return (
    <aside className="w-64 bg-white p-6 rounded-xl shadow-md">
      <h2 className="text-xl font-bold text-indigo-800 mb-6 pb-2 border-b border-indigo-100">Refine Results</h2>
      
      {/* Sort Section */}
      <div className="mb-6">
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          <div className="flex items-center mb-2">
            <svg className="w-4 h-4 mr-2 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12"></path>
            </svg>
            Sort By
          </div>
        </label>
        <select
          value={selectedSort}
          onChange={(e) => setSelectedSort(e.target.value)}
          className="w-full p-3 bg-indigo-50 border border-indigo-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300 transition-colors"
        >
          <option value="">Best Match</option>
          <option value="price">Price (low to high)</option>
          <option value="rating">Rating (high to low)</option>
        </select>
      </div>
      
      {/* Filter Section */}
      <div className="mb-6">
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          <div className="flex items-center mb-2">
            <svg className="w-4 h-4 mr-2 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"></path>
            </svg>
            Filter By Category
          </div>
        </label>
        <select
          value={selectedFilter}
          onChange={(e) => setSelectedFilter(e.target.value)}
          className="w-full p-3 bg-indigo-50 border border-indigo-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300 transition-colors"
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

      {/* Reset Button */}
      {(selectedSort || selectedFilter) && (
        <button 
          onClick={() => {
            setSelectedSort('');
            setSelectedFilter('');
          }}
          className="w-full p-2 text-sm bg-white text-indigo-600 border border-indigo-300 rounded-lg hover:bg-indigo-50 transition-colors flex items-center justify-center"
        >
          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
          </svg>
          Reset Filters
        </button>
      )}
    </aside>
  );
}