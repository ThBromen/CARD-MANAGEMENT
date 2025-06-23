import React from 'react';

const Alert = ({ type = 'info', message, className = '' }) => {
  const baseStyle = "p-4 rounded mb-4 text-white";
  const typeStyles = {
    info: "bg-blue-500",
    success: "bg-green-500",
    warning: "bg-yellow-500 text-black",
    error: "bg-red-500"
  };

  return (
    <div className={`${baseStyle} ${typeStyles[type]} ${className}`}>
      {message}
    </div>
  );
};

export default Alert;
