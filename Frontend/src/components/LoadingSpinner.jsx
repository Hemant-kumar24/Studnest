import React from 'react';
import PropTypes from 'prop-types';

const LoadingSpinner = ({ 
  size = 'medium', 
  color = 'blue', 
  text = 'Loading...', 
  fullScreen = false,
  overlay = false 
}) => {
  const sizeClasses = {
    small: 'w-4 h-4',
    medium: 'w-8 h-8',
    large: 'w-12 h-12',
    xlarge: 'w-16 h-16'
  };

  const colorConfig = {
    blue: { spinner: 'border-blue-500', text: 'text-gray-600 dark:text-gray-300' },
    purple: { spinner: 'border-purple-500', text: 'text-gray-600 dark:text-gray-300' },
    pink: { spinner: 'border-pink-500', text: 'text-gray-600 dark:text-gray-300' },
    green: { spinner: 'border-green-500', text: 'text-gray-600 dark:text-gray-300' },
    red: { spinner: 'border-red-500', text: 'text-gray-600 dark:text-gray-300' },
    indigo: { spinner: 'border-indigo-500', text: 'text-gray-600 dark:text-gray-300' },
    white: { spinner: 'border-white', text: 'text-white' }
  };

  const selectedColor = colorConfig[color] || colorConfig.blue;

  const spinnerElement = (
    <div className="flex flex-col items-center justify-center gap-3" role="status">
      <div
        className={`${sizeClasses[size]} border-4 border-t-transparent ${selectedColor.spinner} rounded-full animate-spin`}
      >
        <span className="sr-only">{text}</span>
      </div>
      {text && (
        <p className={`text-sm font-medium ${selectedColor.text}`}>
          {text}
        </p>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-white dark:bg-gray-900 flex items-center justify-center z-50">
        {spinnerElement}
      </div>
    );
  }

  if (overlay) {
    return (
      <div className="absolute inset-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm flex items-center justify-center z-40">
        {spinnerElement}
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center">
      {spinnerElement}
    </div>
  );
};

LoadingSpinner.propTypes = {
  size: PropTypes.oneOf(['small', 'medium', 'large', 'xlarge']),
  color: PropTypes.oneOf(['blue', 'purple', 'pink', 'green', 'red', 'indigo', 'white']),
  text: PropTypes.string,
  fullScreen: PropTypes.bool,
  overlay: PropTypes.bool,
};

export default LoadingSpinner;