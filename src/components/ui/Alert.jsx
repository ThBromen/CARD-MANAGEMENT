import React from 'react';

const Alert = ({ type = 'info', children, className = '' }) => {
  const baseStyle = "p-4 rounded mb-4 border";
  const typeStyles = {
    info: "bg-blue-50 border-blue-200 text-blue-800",
    success: "bg-green-50 border-green-200 text-green-800",
    warning: "bg-yellow-50 border-yellow-200 text-yellow-800",
    error: "bg-red-50 border-red-200 text-red-800"
  };

  return (
    <div className={`${baseStyle} ${typeStyles[type]} ${className}`}>
      {children}
    </div>
  );
};

const AlertDescription = ({ children, className = '' }) => {
  return (
    <div className={`text-sm ${className}`}>
      {children}
    </div>
  );
};

export { Alert, AlertDescription };
export default Alert;
