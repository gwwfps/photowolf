import React from 'react';

export default ({ className = '', ...props }) => (
  <div
    {...props}
    className={`cursor-pointer text-gray-700 inline-block rounded-md h-8 w-16 flex items-center justify-center bg-teal-100 shadow text-xs ${className}`}
  />
);
