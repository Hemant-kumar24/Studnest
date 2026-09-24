import React from 'react';

const ButtonLoader = ({ size = 'small', color = 'white' }) => {
  const sizeClasses = {
    small: 'w-4 h-4',
    medium: 'w-5 h-5',
    large: 'w-6 h-6'
  };

  const colorClasses = {
    white: 'border-white',
    blue: 'border-blue-500',
    purple: 'border-purple-500',
    pink: 'border-pink-500',
    green: 'border-green-500',
    gray: 'border-gray-500'
  };

  return (
    <div
      className={`${sizeClasses[size]} border-2 border-t-transparent ${colorClasses[color]} rounded-full animate-spin`}
    ></div>
  );
};

export default ButtonLoader;


