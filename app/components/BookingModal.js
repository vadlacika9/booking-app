import React from "react";

const BookingModal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div
      id="modal-overlay"
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={onClose} // Ha rákattintunk a háttérre, zárja be a modált
    >
      <div
        className="relative bg-white p-6 rounded-lg shadow-lg max-w-md w-[600px] h-[600px]"
        onClick={(e) => e.stopPropagation()} // Megakadályozza a bezárást, ha a modalra kattintunk
      >
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-xl font-bold text-gray-500 hover:text-gray-800"
        >
          ×
        </button>
        {children}
      </div>
    </div>
  );
};

export default BookingModal;
