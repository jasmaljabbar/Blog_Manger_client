import React from 'react';

export const Alert = ({ children, variant = "default", className = "" }) => {
  const variants = {
    default: "bg-blue-50 text-blue-700 border-blue-200",
    destructive: "bg-red-50 text-red-700 border-red-200",
    warning: "bg-yellow-50 text-yellow-700 border-yellow-200",
    success: "bg-green-50 text-green-700 border-green-200"
  };

  const baseStyles = "border rounded-lg p-4";
  const variantStyles = variants[variant] || variants.default;

  return (
    <div className={`${baseStyles} ${variantStyles} ${className}`}>
      {children}
    </div>
  );
};

export const AlertDescription = ({ children, className = "" }) => {
  return (
    <div className={`text-sm ${className}`}>
      {children}
    </div>
  );
};