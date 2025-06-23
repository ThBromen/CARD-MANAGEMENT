import React from 'react';

const PopupForm = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-md p-6 w-96 max-w-full shadow-lg relative">
        <h2 className="text-xl font-semibold mb-4">{title}</h2>
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-600 hover:text-gray-900"
          aria-label="Close popup"
        >
          &times;
        </button>
        {children}
      </div>
    </div>
  );
};

export default PopupForm;
